#!/bin/bash

set -e

echo "✅ Starting Kubernetes setup script..."

# 1️⃣ Create namespaces
kubectl create namespace analytics || echo "Namespace analytics exists"
kubectl create namespace ingress-nginx || echo "Namespace ingress-nginx exists"

# 2️⃣ Install ingress-nginx via Helm
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx \
    --namespace ingress-nginx --create-namespace || echo "Ingress already installed"

# 3️⃣ Apply Metrics Server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Wait for Metrics Server
echo "⏳ Waiting for Metrics Server to be ready..."
kubectl wait --for=condition=available --timeout=120s deployment/metrics-server -n kube-system

# 4️⃣ Deploy Services & Deployments
echo "📦 Applying deployments and services..."
kubectl apply -f <<EOF
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: analytics-deployment
  namespace: analytics
  labels:
    app: analytics-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: analytics-service
  template:
    metadata:
      labels:
        app: analytics-service
    spec:
      containers:
      - name: analytics
        image: tush1809/analytics:latest
        ports:
        - containerPort: 8000
---
apiVersion: v1
kind: Service
metadata:
  name: analytics-service
  namespace: analytics
spec:
  selector:
    app: analytics-service
  ports:
    - protocol: TCP
      port: 5002
      targetPort: 8000
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: data-upload-deployment
  namespace: analytics
  labels:
    app: data-upload-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: data-upload-service
  template:
    metadata:
      labels:
        app: data-upload-service
    spec:
      containers:
      - name: data-upload
        image: tush1809/data-upload-service:latest
        ports:
        - containerPort: 5002
---
apiVersion: v1
kind: Service
metadata:
  name: data-upload-service
  namespace: analytics
spec:
  selector:
    app: data-upload-service
  ports:
    - protocol: TCP
      port: 5002
      targetPort: 5002
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deployment
  namespace: analytics
  labels:
    app: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: tush1809/frontend:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: analytics
spec:
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-auth-deployment
  namespace: analytics
  labels:
    app: user-auth-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: user-auth-service
  template:
    metadata:
      labels:
        app: user-auth-service
    spec:
      containers:
      - name: user-auth
        image: tush1809/user-auth-service:latest
        ports:
        - containerPort: 5000
---
apiVersion: v1
kind: Service
metadata:
  name: user-auth-service
  namespace: analytics
spec:
  selector:
    app: user-auth-service
  ports:
    - protocol: TCP
      port: 5000
      targetPort: 5000
  type: ClusterIP
EOF

# 5️⃣ Apply HPA
echo "📈 Applying Horizontal Pod Autoscalers..."
kubectl apply -f <<EOF
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: analytics-hpa
  namespace: analytics
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: analytics-deployment
  minReplicas: 2
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: data-upload-hpa
  namespace: analytics
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: data-upload-deployment
  minReplicas: 2
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: frontend-hpa
  namespace: analytics
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: frontend-deployment
  minReplicas: 2
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: user-auth-hpa
  namespace: analytics
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-auth-deployment
  minReplicas: 2
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization: 50
EOF

# 6️⃣ Apply Ingress for analytics
kubectl apply -f <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: analytics-ingress
  namespace: analytics
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
    - host: analytics.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80
EOF

echo "✅ Setup complete! Use kubectl get all -n analytics to check resources."


#!/bin/bash

set -e

echo "✅ Starting Kubernetes setup script..."

# 1️⃣ Create namespaces if they don't exist
kubectl get namespace analytics || kubectl create namespace analytics
kubectl get namespace ingress-nginx || kubectl create namespace ingress-nginx

# 2️⃣ Install ingress-nginx via Helm, upgrading if already installed
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx \
    --namespace ingress-nginx --create-namespace

# 3️⃣ Apply Metrics Server
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Wait for Metrics Server
echo "⏳ Waiting for Metrics Server to be ready..."
kubectl wait --for=condition=available --timeout=120s deployment/metrics-server -n kube-system

# 4️⃣ Deploy Services & Deployments
echo "📦 Applying deployments and services..."
kubectl apply -f k8s/analytics-deployment.yaml
kubectl apply -f k8s/data-upload-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/user-auth-deployment.yaml

kubectl apply -f k8s/analytics-service.yaml
kubectl apply -f k8s/data-upload-service.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/user-auth-service.yaml

# 5️⃣ Apply Horizontal Pod Autoscalers
echo "📈 Applying Horizontal Pod Autoscalers..."
kubectl apply -f k8s/analytics-hpa.yaml
kubectl apply -f k8s/data-upload-hpa.yaml
kubectl apply -f k8s/frontend-hpa.yaml
kubectl apply -f k8s/user-auth-hpa.yaml

# 6️⃣ Apply Ingress for analytics
kubectl apply -f k8s/analytics-ingress.yaml

echo "✅ Setup complete! Use kubectl get all -n analytics to check resources."


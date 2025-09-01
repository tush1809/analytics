#!/bin/bash
set -e

NAMESPACE="analytics"

echo "Creating namespace if it doesn't exist..."
kubectl get ns $NAMESPACE >/dev/null 2>&1 || kubectl create ns $NAMESPACE

echo "Applying Deployments and Services..."

# Analytics service
kubectl apply -f analytics-service/analytics-deployment.yaml -n $NAMESPACE

# Data Upload service
kubectl apply -f data-upload-service/data-upload-deployment.yaml -n $NAMESPACE

# Frontend service
kubectl apply -f frontend/frontend-deployment.yaml -n $NAMESPACE

# User Auth service
kubectl apply -f user-auth-service/user-auth-deployment.yaml -n $NAMESPACE

echo "Waiting for deployments to roll out..."
kubectl rollout status deployment analytics-deployment -n $NAMESPACE
kubectl rollout status deployment data-upload-deployment -n $NAMESPACE
kubectl rollout status deployment frontend-deployment -n $NAMESPACE
kubectl rollout status deployment user-auth-deployment -n $NAMESPACE

echo "Applying Horizontal Pod Autoscalers..."

kubectl apply -f analytics-service/analytics-hpa.yaml -n $NAMESPACE
kubectl apply -f data-upload-service/data-upload-hpa.yaml -n $NAMESPACE
kubectl apply -f frontend/frontend-hpa.yaml -n $NAMESPACE
kubectl apply -f user-auth-service/user-auth-hpa.yaml -n $NAMESPACE

echo "All resources applied successfully!"
kubectl get all -n $NAMESPACE
kubectl get hpa -n $NAMESPACE


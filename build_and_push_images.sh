#!/bin/bash

# ====== CONFIGURATION ======
DOCKER_USERNAME="tush1809"   # <-- change this
TAG="latest"
PUSH=true   # set to false if you don't want to push to Docker Hub

# ====== BUILD IMAGES ======
echo "🚀 Building Docker images..."

# Analytics service
docker build -t analytics-service:$TAG ./analytics-service
docker tag analytics-service:$TAG $DOCKER_USERNAME/analytics-service:$TAG

# Backend service
docker build -t backend-service:$TAG ./backend
docker tag backend-service:$TAG $DOCKER_USERNAME/backend-service:$TAG

# Data upload service
docker build -t data-upload-service:$TAG ./data-upload-service
docker tag data-upload-service:$TAG $DOCKER_USERNAME/data-upload-service:$TAG

# Frontend service
docker build -t frontend-service:$TAG ./frontend
docker tag frontend-service:$TAG $DOCKER_USERNAME/frontend-service:$TAG

# User-auth service
docker build -t user-auth-service:$TAG ./user-auth-service/backend
docker tag user-auth-service:$TAG $DOCKER_USERNAME/user-auth-service:$TAG

# ====== PUSH IMAGES ======
if [ "$PUSH" = true ]; then
  echo "📤 Pushing Docker images to Docker Hub..."
  docker push $DOCKER_USERNAME/analytics-service:$TAG
  docker push $DOCKER_USERNAME/backend-service:$TAG
  docker push $DOCKER_USERNAME/data-upload-service:$TAG
  docker push $DOCKER_USERNAME/frontend-service:$TAG
  docker push $DOCKER_USERNAME/user-auth-service:$TAG
else
  echo "⚠️ Skipping image push (PUSH=false)"
fi

echo "✅ Build process complete."


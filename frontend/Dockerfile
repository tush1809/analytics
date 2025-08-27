# ------------------------------
# Stage 1: Build React/Vite app
# ------------------------------
FROM node:18-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies (use only production deps if needed)
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# ------------------------------
# Stage 2: Serve with Nginx
# ------------------------------
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from Stage 1
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for frontend
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]


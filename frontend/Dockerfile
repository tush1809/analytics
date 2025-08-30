# ------------------------------
# Stage 1: Build React/Vite app
# ------------------------------
FROM node:18-alpine AS build

# Set working directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app. The placeholders are now hardcoded in the bundle.
RUN npm run build

# ------------------------------
# Stage 2: Serve with Nginx
# ------------------------------
FROM nginx:alpine

# Copy the entrypoint script and make it executable
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from Stage 1
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for frontend
EXPOSE 80

# Set the entrypoint to the new script
ENTRYPOINT ["/docker-entrypoint.sh"]

# Set the command to be executed by the entrypoint
CMD ["nginx", "-g", "daemon off;"]

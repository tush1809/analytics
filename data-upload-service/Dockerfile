# -----------------------------
# Stage 1: Build
# -----------------------------
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copy package files first for better layer caching
COPY package*.json ./

# Install production dependencies only (faster & smaller)
RUN npm ci --omit=dev

# Copy source code (respects .dockerignore)
COPY . .

# -----------------------------
# Stage 2: Production
# -----------------------------
FROM node:18-alpine

WORKDIR /usr/src/app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy app from the build stage
COPY --from=build /usr/src/app ./

# Create uploads folder and set proper permissions
RUN mkdir -p /usr/src/app/uploads && chown -R appuser:appgroup /usr/src/app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "src/index.js"]


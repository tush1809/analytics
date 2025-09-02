# -----------------------------
# Stage 1: Build
# -----------------------------
FROM node:18-alpine AS build

# Set working directory
WORKDIR /usr/src/app


COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

# -----------------------------
# Stage 2: Production
# -----------------------------
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy build artifacts
COPY --from=build /usr/src/app ./

#non root user
RUN mkdir -p /usr/src/app/uploads && chown -R appuser:appgroup /usr/src/app

# Switch to non-root user
USER appuser

# Expose app port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "src/index.js"]


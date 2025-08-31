Using Multi stage build-->

The Dockerfile is divided into two stages: build and production.The first stage handles the compilation and dependency installation, while the second stage copies only the essential files from the build stage.

This keeps the final image lightweight and more secure
-------------------------------------------------------------------------------------------------
FROM node:18-alpine AS build----->for frontend and other two microservices

The Dockerfiles uses node:18-alpine as its base image. The alpine variant is a minimal Linux distribution, making the final image size much smaller compared to images based on larger distributions like Debian or Ubuntu. This leads to faster image downloads and less disk space usage
--------------------------------------------------------------------------------------------------
Doing Dependency caching-->

To build the images faster in case if there is change in code in future this also reduces unnnecessary network calls

The RUN npm ci --omit=dev command ensures that only the production dependencies are installed. npm ci is used instead of npm install because it provides a clean installation, making it more reliable for automated builds. Omitting the development dependencies further reduces the size of the final image.
---------------------------------------------------------------------------------------------------
Managing the sytems packages-->

Using the --no-install-recommends to avoids unnecessary packages and Cleanup reduces image size.
---------------------------------------------------------------------------------------------------
Managing The Environment variables-->Prevents Python from generating .pyc files in container thus reducing clutter
---------------------------------------------------------------------------------------------------
Implementing Non-Root Users-->non-root user and group (appuser and appgroup) and runs the application as that user. This is a critical security practice. By not running the container as the default root user, you minimize the risk of a container-based exploit affecting the host system.
---------------------------------------------------------------------------------------------------
Managing permisions->

The RUN mkdir -p /usr/src/app/uploads && chown -R appuser:appgroup /usr/src/app command explicitly creates a directory and sets the correct ownership and permissions for the non-root user. 

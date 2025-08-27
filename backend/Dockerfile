FROM node:18-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .

FROM node:18-alpine
WORKDIR /usr/src/app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=build /usr/src/app ./
EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "src/index.js"]


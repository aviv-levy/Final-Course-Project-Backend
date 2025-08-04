# Build stage
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files to /app
COPY . .

# Production image
FROM node:20-bullseye-slim

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 4500

CMD ["node", "server.js"]
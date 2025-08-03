# Multi-stage build for optimized image size
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code (but not media files yet)
COPY src ./src
COPY index.html ./
COPY vite.config.js ./

# Build the React app
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built React app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy media files directly to nginx html directory
COPY public/Pictures-Optimized /usr/share/nginx/html/Pictures-Optimized

# Create a health check endpoint
RUN echo '<!DOCTYPE html><html><body>OK</body></html>' > /usr/share/nginx/html/health

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

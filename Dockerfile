# Multi-stage build for React with Vite
FROM node:18 as builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the React app with Vite
RUN npm run build

# Production stage - serve with node http-server
FROM node:18-slim

WORKDIR /app

# Install http-server
RUN npm install -g http-server

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:80/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start server
CMD ["http-server", "dist", "-p", "80"]



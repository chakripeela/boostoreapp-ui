# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies needed for Vite build)
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application with Vite
RUN npm run build

# Production stage - serve with http-server
FROM node:18-alpine

WORKDIR /app

# Install http-server from npm
RUN npm install -g http-server

# Copy only the built dist folder from builder
COPY --from=builder /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start http-server to serve the React SPA
CMD ["http-server", "dist", "-p", "3000", "-c-1"]


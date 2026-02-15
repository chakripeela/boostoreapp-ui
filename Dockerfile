# Build stage
FROM node:18-lts AS builder

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
FROM node:18-lts

WORKDIR /app

# Install http-server globally
RUN npm install -g http-server

# Copy only the built dist folder from builder
COPY --from=builder /app/dist ./dist

# Expose port 80 (required for Azure App Service)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://localhost:80/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start http-server on port 80 (App Service expects this)
# Using absolute path to ensure http-server is found
CMD ["/usr/local/bin/http-server", "dist", "-p", "80", "-c-1"]



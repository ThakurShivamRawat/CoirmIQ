# ==============================================================================
# Stage 1: Development and Dependency Installation
# ==============================================================================
FROM node:22-alpine AS development

WORKDIR /app

# Copy dependency configuration files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy application source files
COPY . .

# Expose Vite development server port
EXPOSE 3001

# Start Vite development server with host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ==============================================================================
# Stage 2: Production Build & Preview Execution
# ==============================================================================
FROM development AS builder

# Build the production assets
RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

# Copy package configurations and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy build artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Expose production preview port
EXPOSE 3001

# Serve the production preview build
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3001"]

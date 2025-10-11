# Build Stage - Frontend
FROM node:20 AS frontend-builder
WORKDIR /app

# Copy root package.json for workspace support
COPY package*.json ./
# Copy client package.json
COPY client/package*.json ./client/
# Copy server package.json
COPY server/package*.json ./server/

# Install all dependencies (workspaces will be hoisted)
RUN npm ci

# Copy client source code
COPY client/ ./client/

# Build frontend (generic - no environment variables)
RUN npm run build -w client

# Build Stage - Backend
FROM node:20 AS backend-builder
WORKDIR /app

# Copy root package.json for workspace support
COPY package*.json ./
# Copy server package.json
COPY server/package*.json ./server/

# Install only production dependencies
RUN npm ci --omit=dev

# Copy server source code
COPY server/ ./server/

# Final Stage
FROM node:20-slim
WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /app/client/dist ./dist

# Copy server files
COPY --from=backend-builder /app/server ./server
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/package*.json ./

WORKDIR /app/server

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "index.js"]


# Multi-stage production Dockerfile for TubiStream VOD & FAST Platform
# Stage 1: Build React Client & Node Server
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
COPY client/package*.json client/
COPY server/package*.json server/

# Install all build dependencies
RUN npm run install:all

# Copy source trees
COPY client/ client/
COPY server/ server/

# Build React client into client/dist & Express server into server/dist
RUN npm run build

# Stage 2: Minimal Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy build output & package manifests
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server/package*.json server/
COPY --from=builder /app/server/dist server/dist
COPY --from=builder /app/client/dist client/dist

# Install production-only dependencies for backend
RUN npm --prefix server install --omit=dev

EXPOSE 5000

CMD ["node", "server/dist/index.js"]

# ==================================================================
# AgriFusion AI — Frontend Dockerfile (Production Multi-Stage Build)
# ==================================================================
# Stage 1: Build static assets
FROM node:20-alpine AS builder

WORKDIR /build

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.27-alpine AS runtime

LABEL maintainer="AgriFusion AI Team"
LABEL description="AgriFusion AI Frontend"

# Copy built assets to nginx
COPY --from=builder /build/dist /usr/share/nginx/html

# Custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

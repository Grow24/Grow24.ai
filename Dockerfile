FROM node:22-alpine AS builder
LABEL "language"="nodejs"
LABEL "framework"="vite"
WORKDIR /src
# Copy package files
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy source code
COPY . .
# Build main app
RUN npm run build:main
# Build Univer static files
RUN npm install -g pnpm@10.24.0
RUN cd univer && pnpm run install:ci
RUN cd univer && pnpm run build:static
# Copy Univer files to dist
RUN mkdir -p dist/univer && cp -r univer/examples/local/. dist/univer/
# Final stage - serve with Caddy
FROM zeabur/caddy-static
WORKDIR /src
# Copy built files from builder
COPY --from=builder /src/dist /usr/share/caddy
# Copy custom Caddyfile for routing
COPY --from=builder /src/Caddyfile /etc/caddy/Caddyfile
EXPOSE 8080


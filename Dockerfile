FROM node:22-alpine AS builder
LABEL "language"="nodejs"
LABEL "framework"="vite"

WORKDIR /src

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .

RUN corepack enable && corepack prepare pnpm@9 --activate

# Avoid stale prebuilt Next artifacts from previous/local builds.
# Zeabur should always build mxgraph output from current source.
RUN rm -rf /src/mxgraph_standalone /src/Mxgraph_ReactFlow/apps/web/.next

# Baked into HBMPONE client build (see npm run build → build:hbmpone).
# On Zeabur: set to your HBMP API public URL, e.g. https://your-hbmp-service.zeabur.app/api
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Ensure optional mxgraph folder exists so COPY does not fail
# when Mxgraph_ReactFlow is absent in this checkout.
RUN mkdir -p /src/mxgraph_standalone/apps/web

FROM node:22-alpine

RUN apk add --no-cache caddy ca-certificates

WORKDIR /app

COPY --from=builder /src/dist /usr/share/caddy
COPY --from=builder /src/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /src/mxgraph_standalone /app/mxgraph
COPY --from=builder /src/docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]

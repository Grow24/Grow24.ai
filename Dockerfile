FROM node:22-alpine AS builder
LABEL "language"="nodejs"
LABEL "framework"="vite"

WORKDIR /src

# Build deps used by sharp if prebuilt binary download fails.
RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev pixman-dev

# Improve npm reliability on intermittent networks and sharp install behavior.
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1 \
    NODE_OPTIONS=--max-old-space-size=4096 \
    NPM_CONFIG_FETCH_RETRIES=5 \
    NPM_CONFIG_FETCH_RETRY_FACTOR=2 \
    NPM_CONFIG_FETCH_TIMEOUT=120000 \
    NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000 \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000

COPY package*.json ./
RUN sh -c 'for i in 1 2 3; do npm ci --no-audit --no-fund && exit 0; echo "npm ci failed (attempt $i), retrying..."; sleep 8; done; exit 1'

COPY . .
RUN test -f /src/Caddyfile || (echo "Missing required file: /src/Caddyfile" && exit 1)
RUN test -f /src/docker-entrypoint.sh || (echo "Missing required file: /src/docker-entrypoint.sh" && exit 1)
RUN test -f /src/scripts/build-ci.sh || (echo "Missing required file: /src/scripts/build-ci.sh" && exit 1)
RUN chmod +x /src/scripts/build-ci.sh
RUN test -f /src/scripts/build-zeabur-profile.sh || (echo "Missing required file: /src/scripts/build-zeabur-profile.sh" && exit 1)
RUN chmod +x /src/scripts/build-zeabur-profile.sh

RUN corepack enable && corepack prepare pnpm@9 --activate

# Avoid stale prebuilt Next artifacts from previous/local builds.
# Zeabur should always build mxgraph output from current source.
RUN rm -rf /src/mxgraph_standalone /src/Mxgraph_ReactFlow/apps/web/.next

# Baked into HBMPONE client build (see npm run build → build:hbmpone).
# On Zeabur: set to your HBMP API public URL, e.g. https://your-hbmp-service.zeabur.app/api
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
ARG BUILD_PROFILE=full

RUN sh scripts/build-zeabur-profile.sh "${BUILD_PROFILE}"

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

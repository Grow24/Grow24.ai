FROM node:22-alpine AS builder
LABEL "language"="nodejs"
LABEL "framework"="vite"

WORKDIR /src

# Build deps used by sharp if prebuilt binary download fails.
# openssl is required to generate the Prisma client for the docs API.
RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev pixman-dev openssl

# Improve npm reliability on intermittent networks and sharp install behavior.
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1 \
    NODE_OPTIONS=--max-old-space-size=3072 \
    NPM_CONFIG_FETCH_RETRIES=5 \
    NPM_CONFIG_FETCH_RETRY_FACTOR=2 \
    NPM_CONFIG_FETCH_TIMEOUT=120000 \
    NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=20000 \
    NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=120000

COPY package*.json ./
# Zeabur injects NODE_ENV=production, which makes npm ci skip vite/autoprefixer (devDependencies).
ENV NPM_CONFIG_PRODUCTION=false
RUN sh -c 'for i in 1 2 3; do NODE_ENV=development npm ci --no-audit --no-fund --include=dev && exit 0; echo "npm ci failed (attempt $i), retrying..."; sleep 8; done; exit 1'

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

# Baked into HBMP_One client. Same-origin API via Caddy → 127.0.0.1:4010.
ARG VITE_API_URL=/HBMP_One/api
ENV VITE_API_URL=${VITE_API_URL}

# Main site chatbot / leads / contact email (build-time — Vite bakes these in).
# Zeabur frontend Variables must set these BEFORE rebuild.
ARG VITE_API_ENDPOINT=https://pbmpchatbotbackend.zeabur.app/api/chat
ENV VITE_API_ENDPOINT=${VITE_API_ENDPOINT}
ARG VITE_SEND_EMAIL_ENDPOINT=
ENV VITE_SEND_EMAIL_ENDPOINT=${VITE_SEND_EMAIL_ENDPOINT}
ARG VITE_WHATSAPP_NUMBER=+919370239600
ENV VITE_WHATSAPP_NUMBER=${VITE_WHATSAPP_NUMBER}
ARG VITE_CLERK_PUBLISHABLE_KEY=
ENV VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY}

ARG BUILD_PROFILE=core
ENV BUILD_PROFILE=${BUILD_PROFILE}

RUN sh scripts/build-zeabur-profile.sh "${BUILD_PROFILE}"

# Docs Platform API (Express + Prisma/SQLite) — served from this same container.
WORKDIR /src/HBMP_DOCS_PLATFORM/server
RUN sh -c 'for i in 1 2 3; do npm ci --no-audit --no-fund && exit 0; echo "docs-api npm ci failed (attempt $i), retrying..."; sleep 8; done; exit 1'
RUN npx prisma generate
RUN ./node_modules/.bin/tsc -p tsconfig.json || echo "docs-api tsc failed; runtime will use tsx"
WORKDIR /src

# HBMP_One API (Express + Prisma/SQLite) — same container as the static UI.
WORKDIR /src/HBMP_One/server
ENV DATABASE_URL="file:./dev.db"
RUN sh -c 'for i in 1 2 3; do npm ci --no-audit --no-fund && exit 0; echo "hbmp-one-api npm ci failed (attempt $i), retrying..."; sleep 8; done; exit 1'
RUN npx prisma generate
RUN ./node_modules/.bin/tsc -p tsconfig.json || echo "hbmp-one-api tsc failed; runtime will use tsx"
WORKDIR /src

# PBMP_LibreChat API (Express orchestration runtime)
WORKDIR /src/PBMP_LibreChat/server
RUN sh -c 'for i in 1 2 3; do npm ci --no-audit --no-fund && exit 0; echo "pbmp-librechat-api npm ci failed (attempt $i), retrying..."; sleep 8; done; exit 1'
RUN ./node_modules/.bin/tsc -p tsconfig.json || echo "pbmp-librechat-api tsc failed; runtime will use tsx"
WORKDIR /src

# Ensure optional mxgraph folder exists so COPY does not fail
# when Mxgraph_ReactFlow is absent in this checkout.
RUN mkdir -p /src/mxgraph_standalone/apps/web

FROM node:22-alpine

RUN apk add --no-cache caddy ca-certificates openssl python3

WORKDIR /app

COPY --from=builder /src/dist /usr/share/caddy
COPY --from=builder /src/Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /src/mxgraph_standalone /app/mxgraph
COPY --from=builder /src/HBMP_DOCS_PLATFORM/server /app/docs-api
COPY --from=builder /src/HBMP_One/server /app/hbmp-one-api
COPY --from=builder /src/PBMP_LibreChat/server /app/pbmp-librechat-api
COPY --from=builder /src/PBMP_LibreChat/mcp /app/pbmp-mcp
COPY --from=builder /src/PBMP_LibreChat/knowledge /app/pbmp-knowledge
COPY --from=builder /src/scripts/start-all.cjs /app/start-all.cjs
COPY --from=builder /src/scripts/agentbot-stub.cjs /app/agentbot-stub.cjs
COPY --from=builder /src/docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && mkdir -p /app/data

EXPOSE 8080

ENTRYPOINT ["node", "/app/start-all.cjs"]

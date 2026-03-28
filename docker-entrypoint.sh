#!/bin/sh
set -e
export MXGRAPH_API_UPSTREAM="${MXGRAPH_API_UPSTREAM:-127.0.0.1:3001}"
cd /app/mxgraph
export PORT="${MXGRAPH_NEXT_PORT:-5191}"
export HOSTNAME="${MXGRAPH_NEXT_HOST:-127.0.0.1}"
export NODE_ENV=production
node apps/web/server.js &
exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile

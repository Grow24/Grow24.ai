#!/bin/sh
set -e
export MXGRAPH_API_UPSTREAM="${MXGRAPH_API_UPSTREAM:-127.0.0.1:3001}"
export CAMUNDA_FRONTEND_UPSTREAM="${CAMUNDA_FRONTEND_UPSTREAM:-127.0.0.1:5196}"
export CAMUNDA_BACKEND_UPSTREAM="${CAMUNDA_BACKEND_UPSTREAM:-127.0.0.1:4001}"

if [ "${CAMUNDA_FRONTEND_UPSTREAM}" = "127.0.0.1:5196" ]; then
  echo "CAMUNDA_FRONTEND_UPSTREAM not set; defaulting to ${CAMUNDA_FRONTEND_UPSTREAM}"
fi
if [ "${CAMUNDA_BACKEND_UPSTREAM}" = "127.0.0.1:4001" ]; then
  echo "CAMUNDA_BACKEND_UPSTREAM not set; defaulting to ${CAMUNDA_BACKEND_UPSTREAM}"
fi

if [ -f /app/mxgraph/apps/web/server.js ]; then
  cd /app/mxgraph
  export PORT="${MXGRAPH_NEXT_PORT:-5191}"
  export HOSTNAME="${MXGRAPH_NEXT_HOST:-127.0.0.1}"
  export NODE_ENV=production
  node apps/web/server.js &
else
  echo "mxgraph server not found; skipping mxgraph startup"
fi

exec caddy run --config /etc/caddy/Caddyfile --adapter caddyfile

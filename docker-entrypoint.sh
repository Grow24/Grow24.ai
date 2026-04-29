#!/bin/sh
set -e
export MXGRAPH_API_UPSTREAM="${MXGRAPH_API_UPSTREAM:-127.0.0.1:3001}"

if [ -z "${CAMUNDA_FRONTEND_UPSTREAM}" ]; then
  echo "CAMUNDA_FRONTEND_UPSTREAM not set; /camunda-bpmn will return a configuration error until this env is set"
fi
if [ -z "${CAMUNDA_BACKEND_UPSTREAM}" ]; then
  echo "CAMUNDA_BACKEND_UPSTREAM not set; /camunda-bpmn/api will return a configuration error until this env is set"
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

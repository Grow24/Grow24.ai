#!/bin/sh
set -e
export MXGRAPH_API_UPSTREAM="${MXGRAPH_API_UPSTREAM:-127.0.0.1:3001}"
export N8N_HOST="${N8N_HOST:-0.0.0.0}"
export N8N_PORT="${N8N_PORT:-5678}"
export N8N_PROTOCOL="${N8N_PROTOCOL:-https}"
export N8N_PATH="${N8N_PATH:-/n8n/}"
export N8N_EDITOR_BASE_URL="${N8N_EDITOR_BASE_URL:-https://grow24.ai/n8n/}"
export WEBHOOK_URL="${WEBHOOK_URL:-https://grow24.ai/n8n/}"
export N8N_USER_FOLDER="${N8N_USER_FOLDER:-/app/n8n-data}"
export N8N_COMMUNITY_PACKAGES_ENABLED="${N8N_COMMUNITY_PACKAGES_ENABLED:-true}"
export N8N_CUSTOM_EXTENSIONS="${N8N_CUSTOM_EXTENSIONS:-/app/n8n-community}"

mkdir -p "$N8N_USER_FOLDER"

if [ -z "$N8N_UPSTREAM" ]; then
  echo "Starting internal n8n on 127.0.0.1:${N8N_PORT}"
  n8n start --port "$N8N_PORT" --host 127.0.0.1 &
else
  echo "N8N_UPSTREAM is set; skipping internal n8n startup"
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

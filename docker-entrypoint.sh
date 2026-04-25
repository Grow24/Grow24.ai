#!/bin/sh
set -e
export MXGRAPH_API_UPSTREAM="${MXGRAPH_API_UPSTREAM:-127.0.0.1:3001}"
# Public site URL (no trailing slash) — set in Zeabur, e.g. https://www.grow24.ai
export PUBLIC_SITE_URL="${PUBLIC_SITE_URL:-https://grow24.ai}"
export N8N_HOST="${N8N_HOST:-0.0.0.0}"
export N8N_PORT="${N8N_PORT:-5678}"
export N8N_PROTOCOL="${N8N_PROTOCOL:-https}"
export N8N_PATH="${N8N_PATH:-/n8n/}"

N8N_UPSTREAM_WAS_SET=0
if [ -n "${N8N_UPSTREAM:-}" ]; then
  N8N_UPSTREAM_WAS_SET=1
fi

# Caddy must always have a valid upstream. Default: bundled n8n in this container.
export N8N_UPSTREAM="${N8N_UPSTREAM:-127.0.0.1:${N8N_PORT}}"

export N8N_EDITOR_BASE_URL="${N8N_EDITOR_BASE_URL:-${PUBLIC_SITE_URL}/n8n/}"
export WEBHOOK_URL="${WEBHOOK_URL:-${PUBLIC_SITE_URL}/n8n/}"
export N8N_USER_FOLDER="${N8N_USER_FOLDER:-/app/n8n-data}"
export N8N_COMMUNITY_PACKAGES_ENABLED="${N8N_COMMUNITY_PACKAGES_ENABLED:-true}"
export N8N_CUSTOM_EXTENSIONS="${N8N_CUSTOM_EXTENSIONS:-/app/n8n-community}"

mkdir -p "$N8N_USER_FOLDER"

if [ "$N8N_UPSTREAM_WAS_SET" = 0 ]; then
  echo "Starting internal n8n on 127.0.0.1:${N8N_PORT}"
  n8n start --port "$N8N_PORT" --host 127.0.0.1 &
else
  echo "N8N_UPSTREAM was set externally; skipping internal n8n startup (proxying to ${N8N_UPSTREAM})"
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

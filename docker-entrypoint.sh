#!/bin/sh
set -e
export MXGRAPH_API_UPSTREAM="${MXGRAPH_API_UPSTREAM:-127.0.0.1:3001}"
export HBMP_DOCS_API_UPSTREAM="${HBMP_DOCS_API_UPSTREAM:-127.0.0.1:4000}"

if [ -z "${CAMUNDA_FRONTEND_UPSTREAM}" ]; then
  echo "CAMUNDA_FRONTEND_UPSTREAM not set; /camunda-bpmn will return a configuration error until this env is set"
fi
if [ -z "${CAMUNDA_BACKEND_UPSTREAM}" ]; then
  echo "CAMUNDA_BACKEND_UPSTREAM not set; /camunda-bpmn/api will return a configuration error until this env is set"
fi
if [ -z "${AGENTBOT_API_UPSTREAM}" ]; then
  echo "AGENTBOT_API_UPSTREAM not set; /HBMP_AgentBot/api will return 503 until this env is set"
fi

if [ -f /app/docs-api/src/index.ts ]; then
  mkdir -p /app/data
  cd /app/docs-api
  export PORT="${HBMP_DOCS_API_PORT:-4000}"
  export DATABASE_URL="${DATABASE_URL:-file:/app/data/docs.db}"
  export CORS_ORIGIN="${CORS_ORIGIN:-https://www.grow24.ai}"
  npx prisma migrate deploy || npx prisma db push --skip-generate || echo "docs db migrate failed; continuing"
  npx tsx src/index.ts &
  cd /app
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

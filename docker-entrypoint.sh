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

start_docs_api() {
  if [ ! -f /app/docs-api/src/index.ts ]; then
    echo "docs-api source not found at /app/docs-api/src/index.ts; skipping"
    return 0
  fi

  mkdir -p /app/data
  cd /app/docs-api
  export PORT="${HBMP_DOCS_API_PORT:-4000}"
  export DATABASE_URL="${DATABASE_URL:-file:/app/data/docs.db}"
  export CORS_ORIGIN="${CORS_ORIGIN:-https://www.grow24.ai}"

  echo "Starting HBMP Docs API on 0.0.0.0:${PORT} (DATABASE_URL=${DATABASE_URL})"
  npx prisma migrate deploy || npx prisma db push --skip-generate || echo "docs db migrate failed; continuing"

  if [ -x ./node_modules/.bin/tsx ]; then
    ./node_modules/.bin/tsx src/index.ts &
  else
    echo "tsx binary missing; trying node --experimental-strip-types"
    node --experimental-strip-types src/index.ts &
  fi
  cd /app
}

start_docs_api || echo "docs API failed to start; Caddy will still run"

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

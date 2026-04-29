#!/bin/sh
set -eu

PROFILE="${1:-full}"

run_step() {
  step="$1"
  shift
  echo "========== START: ${step} =========="
  "$@"
  echo "========== DONE:  ${step} =========="
}

if [ "${PROFILE}" = "core" ]; then
  echo "Using BUILD_PROFILE=core (reduced build set)"
  run_step "build:main" npm run build:main
  run_step "build:hbmp-one" npm run build:hbmp-one
  run_step "build:hbmp-docs-platform" npm run build:hbmp-docs-platform
  run_step "build:google" npm run build:google
  run_step "build:app-manager" npm run build:app-manager
  run_step "build:hbmp-form-manager" npm run build:hbmp-form-manager
  run_step "copy:openstreetmaps" npm run copy:openstreetmaps
  run_step "copy:microsoft" npm run copy:microsoft
  run_step "copy:imageprocessing" npm run copy:imageprocessing
  run_step "copy:mcp-server" npm run copy:mcp-server
  echo "Core build profile completed."
  exit 0
fi

echo "Using BUILD_PROFILE=full (default)"
run_step "build:main" npm run build:main
run_step "build:hbmp-one" npm run build:hbmp-one
run_step "build:hbmp-docs-platform" npm run build:hbmp-docs-platform
run_step "build:google" npm run build:google
run_step "build:app-manager" npm run build:app-manager
run_step "build:hbmp-form-manager" npm run build:hbmp-form-manager
run_step "build:hbmp-agentbot" npm run build:hbmp-agentbot
run_step "build:mxgraph-reactflow" npm run build:mxgraph-reactflow
run_step "build:ivvychainv2" npm run build:ivvychainv2
run_step "build:univer:static" npm run build:univer:static
run_step "copy:univer" npm run copy:univer
run_step "copy:openstreetmaps" npm run copy:openstreetmaps
run_step "copy:microsoft" npm run copy:microsoft
run_step "copy:imageprocessing" npm run copy:imageprocessing
run_step "copy:mcp-server" npm run copy:mcp-server
run_step "patch-univer-dist-paths" node scripts/patch-univer-dist-paths.mjs
run_step "verify-univer-dist" node scripts/verify-univer-dist.mjs
run_step "verify-hbmp-dist" node scripts/verify-hbmp-dist.mjs
run_step "verify-agentbot-dist" node scripts/verify-agentbot-dist.mjs
run_step "verify-mxgraph-standalone" node scripts/verify-mxgraph-standalone.mjs

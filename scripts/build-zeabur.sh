#!/bin/sh
set -eu

echo "==> [1/20] build:main"
npm run build:main
echo "==> [2/20] build:hbmp-one"
npm run build:hbmp-one
echo "==> [3/20] build:hbmp-docs-platform"
npm run build:hbmp-docs-platform
echo "==> [4/20] build:google"
npm run build:google
echo "==> [5/20] build:app-manager"
npm run build:app-manager
echo "==> [6/20] build:hbmp-form-manager"
npm run build:hbmp-form-manager
echo "==> [7/20] build:hbmp-agentbot"
npm run build:hbmp-agentbot
echo "==> [8/20] build:mxgraph-reactflow"
npm run build:mxgraph-reactflow
echo "==> [9/20] build:ivvychainv2"
npm run build:ivvychainv2
echo "==> [10/20] build:univer:static"
npm run build:univer:static
echo "==> [11/20] copy:univer"
npm run copy:univer
echo "==> [12/20] copy:openstreetmaps"
npm run copy:openstreetmaps
echo "==> [13/20] copy:microsoft"
npm run copy:microsoft
echo "==> [14/20] copy:imageprocessing"
npm run copy:imageprocessing
echo "==> [15/20] copy:mcp-server"
npm run copy:mcp-server
echo "==> [16/20] patch-univer-dist-paths"
node scripts/patch-univer-dist-paths.mjs
echo "==> [17/20] verify-univer-dist"
node scripts/verify-univer-dist.mjs
echo "==> [18/20] verify-hbmp-dist"
node scripts/verify-hbmp-dist.mjs
echo "==> [19/20] verify-agentbot-dist"
node scripts/verify-agentbot-dist.mjs
echo "==> [20/20] verify-mxgraph-standalone"
node scripts/verify-mxgraph-standalone.mjs

echo "==> build-zeabur completed"

#!/usr/bin/env node
/**
 * After `pnpm --filter @hbmp/web build`, copy Next standalone output + static assets
 * into ./mxgraph_standalone at repo root (used by Docker / Zeabur).
 *
 * Resolves repo root from this file — `build:mxgraph-reactflow` runs with cwd inside
 * `Mxgraph_ReactFlow/`, so `process.cwd()` would wrongly double that segment.
 */
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const standalone = join(root, 'Mxgraph_ReactFlow/apps/web/.next/standalone')
const dest = join(root, 'mxgraph_standalone')

if (!existsSync(standalone)) {
  console.error('[package-mxgraph-standalone] Missing:', standalone)
  console.error('  Run: npm run build:mxgraph-reactflow (web build first)')
  process.exit(1)
}

rmSync(dest, { recursive: true, force: true })
cpSync(standalone, dest, { recursive: true })

const staticSrc = join(root, 'Mxgraph_ReactFlow/apps/web/.next/static')
const staticDest = join(dest, 'apps/web/.next/static')
if (existsSync(staticSrc)) {
  mkdirSync(join(dest, 'apps/web/.next'), { recursive: true })
  cpSync(staticSrc, staticDest, { recursive: true })
}

const publicSrc = join(root, 'Mxgraph_ReactFlow/apps/web/public')
if (existsSync(publicSrc)) {
  cpSync(publicSrc, join(dest, 'apps/web/public'), { recursive: true })
}

const serverJs = join(dest, 'apps/web/server.js')
if (!existsSync(serverJs)) {
  console.error('[package-mxgraph-standalone] Missing server bundle:', serverJs)
  process.exit(1)
}

console.log('[package-mxgraph-standalone] OK:', dest)

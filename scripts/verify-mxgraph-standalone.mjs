#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const standaloneRoot = join(root, 'mxgraph_standalone')
const server = join(root, 'mxgraph_standalone', 'apps', 'web', 'server.js')

if (!existsSync(standaloneRoot)) {
  console.log('[verify-mxgraph-standalone] Skipped: mxgraph_standalone not found')
  process.exit(0)
}

if (!existsSync(server)) {
  console.error('[verify-mxgraph-standalone] Missing:', server)
  console.error('  Run: npm run build:mxgraph-reactflow')
  process.exit(1)
}

console.log('[verify-mxgraph-standalone] OK:', standaloneRoot)

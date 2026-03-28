#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const server = join(root, 'mxgraph_standalone', 'apps', 'web', 'server.js')

if (!existsSync(server)) {
  console.error('[verify-mxgraph-standalone] Missing:', server)
  console.error('  Run: npm run build:mxgraph-reactflow')
  process.exit(1)
}

console.log('[verify-mxgraph-standalone] OK:', join(root, 'mxgraph_standalone'))

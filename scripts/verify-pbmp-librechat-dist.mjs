import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const dir = join(root, 'dist', 'PBMP_LibreChat')
const htmlPath = join(dir, 'index.html')

if (!existsSync(htmlPath)) {
  console.error('[verify-pbmp-librechat-dist] missing dist/PBMP_LibreChat/index.html')
  process.exit(1)
}

const html = readFileSync(htmlPath, 'utf8')
if (!html.includes('/PBMP_LibreChat/')) {
  console.warn('[verify-pbmp-librechat-dist] index.html may be missing /PBMP_LibreChat/ base paths')
}

const assetMatch = html.match(/src="([^"]+)"/)
if (assetMatch && assetMatch[1].startsWith('/assets/')) {
  console.error('  Expected /PBMP_LibreChat/assets/... (check PBMP_LIBRECHAT_BASE at build time)')
  process.exit(1)
}

console.log('[verify-pbmp-librechat-dist] ok')

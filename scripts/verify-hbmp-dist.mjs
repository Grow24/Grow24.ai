#!/usr/bin/env node
/**
 * Fail the build if HBMPONE was not copied into dist/HBMPONE or if bundles
 * reference root-only asset paths (main SPA HTML served as "JS" → blank page).
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = process.cwd();
const hbmpDir = join(root, 'dist', 'HBMPONE');
const indexHtml = join(hbmpDir, 'index.html');

let failed = false;

if (!existsSync(indexHtml)) {
  console.error('[verify-hbmp-dist] Missing:', indexHtml);
  console.error('  Run: npm run build:hbmpone');
  failed = true;
} else {
  const html = readFileSync(indexHtml, 'utf8');
  if (!html.includes('/HBMPONE/') && !html.includes('HBMPONE')) {
    console.warn('[verify-hbmp-dist] index.html may be missing /HBMPONE/ base paths');
  }
}

function walk(dir, files = []) {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return files;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (['.js', '.mjs', '.css'].includes(extname(name))) files.push(p);
  }
  return files;
}

/** Vite with base /HBMPONE/ must not emit root /assets/ (would hit main SPA). */
const BAD = [/["']\/assets\//, /(?:import\s*\(\s*|from\s*)["']\/assets\//];

if (!failed) {
  const jsFiles = walk(hbmpDir);
  for (const file of jsFiles) {
    const src = readFileSync(file, 'utf8');
    for (const re of BAD) {
      if (re.test(src)) {
        console.error(`[verify-hbmp-dist] Forbidden root asset path in ${file}`);
        console.error('  Expected /HBMPONE/assets/... (check HBMPONE_BASE at build time)');
        failed = true;
        break;
      }
    }
  }
}

if (failed) process.exit(1);
console.log('[verify-hbmp-dist] OK:', hbmpDir);

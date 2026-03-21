#!/usr/bin/env node
/**
 * Fail the build if Univer was not copied into dist/univer or if the bundle
 * still references root-level chunks (would break on Zeabur behind Caddy).
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const univerDir = join(root, 'dist', 'univer');
const mainJs = join(univerDir, 'main.js');
const indexHtml = join(univerDir, 'index.html');

let failed = false;

if (!existsSync(indexHtml)) {
  console.error('[verify-univer-dist] Missing:', indexHtml);
  console.error('  Run: npm run build:univer:static && npm run copy:univer');
  failed = true;
}

if (!existsSync(mainJs)) {
  console.error('[verify-univer-dist] Missing:', mainJs);
  failed = true;
}

if (existsSync(mainJs)) {
  const src = readFileSync(mainJs, 'utf8');
  // Bad: absolute imports from site root (browser loads main index.html as "JS")
  const badRoot = /(?:import\s*\(\s*|from\s*)["']\/chunk-/;
  if (badRoot.test(src)) {
    console.error('[verify-univer-dist] main.js still references /chunk-* at domain root.');
    console.error('  Rebuild Univer with production publicPath (see univer/examples/esbuild.config.ts).');
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log('[verify-univer-dist] OK — dist/univer looks usable.');

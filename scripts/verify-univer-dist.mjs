#!/usr/bin/env node
/**
 * Fail the build if Univer was not copied into dist/univer or if bundles still
 * reference root-only asset paths (main SPA HTML served as "JS" → blank page).
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

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

function walk(dir, files = []) {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return files;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (extname(name) === '.js') files.push(p);
  }
  return files;
}

/** Root-absolute paths that must not appear after patch-univer-dist-paths.mjs */
const BAD = [
  /["']\/vs\//,
  /(?:import\s*\(\s*|from\s*)["']\/chunk-/,
  /(?:import\s*\(\s*|from\s*)["']\/lazy-[^"']/,
  /(?:import\s*\(\s*|from\s*)["']\/very-lazy-/,
];

if (!failed) {
  const jsFiles = walk(univerDir);
  for (const file of jsFiles) {
    const src = readFileSync(file, 'utf8');
    for (const re of BAD) {
      if (re.test(src)) {
        console.error('[verify-univer-dist] Bad root path in:', file.replace(root + '/', ''));
        console.error('  Pattern:', re.toString());
        console.error('  Run patch-univer-dist-paths.mjs or fix esbuild publicPath.');
        failed = true;
        break;
      }
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log('[verify-univer-dist] OK — dist/univer looks usable.');

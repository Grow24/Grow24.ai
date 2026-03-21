#!/usr/bin/env node
/**
 * Univer / esbuild sometimes emits absolute URLs from site root (/vs/, /chunk-*, …).
 * Behind https://domain/univer/ those must be /univer/vs/, /univer/chunk-*, or the
 * browser loads the main SPA HTML and the app stays blank.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = process.cwd();
const univerDir = join(root, 'dist', 'univer');

function walk(dir, files = []) {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return files;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules') continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (['.js', '.mjs', '.css'].includes(extname(name))) files.push(p);
  }
  return files;
}

function patchSource(content) {
  let out = content
    .replaceAll('"/univer/univer/', '"/univer/')
    .replaceAll("'/univer/univer/", "'/univer/");

  // Monaco workers: "/vs/..." -> "/univer/vs/..."
  out = out.replace(/(["'])\/(vs\/[^"']*)/g, (_, q, path) => `${q}/univer/${path}`);

  // Split chunks at domain root
  out = out.replace(/(["'])\/(very-lazy-[^"']+)/g, (_, q, path) => `${q}/univer/${path}`);
  out = out.replace(/(["'])\/(lazy-[^"']+)/g, (_, q, path) => `${q}/univer/${path}`);
  out = out.replace(/(["'])\/(chunk-[^"']+)/g, (_, q, path) => {
    if (path.startsWith('univer/')) return `${q}/${path}`;
    return `${q}/univer/${path}`;
  });

  return out;
}

let changed = 0;
if (!existsSync(univerDir)) {
  console.error('[patch-univer-dist-paths] Missing:', univerDir);
  process.exit(1);
}
const files = walk(univerDir);
for (const file of files) {
  const before = readFileSync(file, 'utf8');
  const after = patchSource(before);
  if (after !== before) {
    writeFileSync(file, after, 'utf8');
    changed++;
  }
}

console.log(`[patch-univer-dist-paths] Patched ${changed} file(s) under dist/univer.`);

#!/usr/bin/env node
/**
 * Fail the build if HBMP_AgentBot static output is missing or uses root-only asset paths.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = process.cwd();
const dir = join(root, 'dist', 'HBMP_AgentBot');
const indexHtml = join(dir, 'index.html');

let failed = false;

if (!existsSync(indexHtml)) {
  console.error('[verify-agentbot-dist] Missing:', indexHtml);
  console.error('  Run: npm run build:hbmp-agentbot');
  failed = true;
} else {
  const html = readFileSync(indexHtml, 'utf8');
  if (!html.includes('/HBMP_AgentBot/')) {
    console.warn('[verify-agentbot-dist] index.html may be missing /HBMP_AgentBot/ base paths');
  }
}

function walk(d, files = []) {
  if (!existsSync(d) || !statSync(d).isDirectory()) return files;
  for (const name of readdirSync(d)) {
    const p = join(d, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (['.js', '.mjs', '.css'].includes(extname(name))) files.push(p);
  }
  return files;
}

const BAD = [/["']\/assets\//, /(?:import\s*\(\s*|from\s*)["']\/assets\//];

if (!failed) {
  const jsFiles = walk(dir);
  for (const file of jsFiles) {
    const src = readFileSync(file, 'utf8');
    for (const re of BAD) {
      if (re.test(src)) {
        console.error(`[verify-agentbot-dist] Forbidden root asset path in ${file}`);
        console.error('  Expected /HBMP_AgentBot/assets/... (check AGENTBOT_BASE at build time)');
        failed = true;
        break;
      }
    }
  }
}

if (failed) process.exit(1);
console.log('[verify-agentbot-dist] OK:', dir);

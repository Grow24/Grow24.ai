#!/usr/bin/env node
/** Smoke-test stdio MCP (newline JSON, same as LibreChat SDK): initialize → tools/list → tools/call */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const child = spawn(process.execPath, [path.join(dir, 'index.js')], {
  stdio: ['pipe', 'pipe', 'inherit'],
});

let buf = Buffer.alloc(0);
const pending = new Map();
let nextId = 1;

function send(method, params) {
  const id = nextId++;
  const msg = { jsonrpc: '2.0', id, method, params };
  child.stdin.write(`${JSON.stringify(msg)}\n`);
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout waiting for ${method}`)), 5000);
    pending.set(id, (obj) => {
      clearTimeout(t);
      resolve(obj);
    });
  });
}

child.stdout.on('data', (chunk) => {
  buf = Buffer.concat([buf, chunk]);
  while (true) {
    const nl = buf.indexOf(10);
    if (nl < 0) break;
    const line = buf.subarray(0, nl).toString('utf8').trim();
    buf = buf.subarray(nl + 1);
    if (!line) continue;
    const obj = JSON.parse(line);
    const fn = pending.get(obj.id);
    if (fn) {
      pending.delete(obj.id);
      fn(obj);
    }
  }
});

try {
  const init = await send('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'pbmp-verify', version: '0.1.0' },
  });
  if (!init.result?.serverInfo?.name) throw new Error('initialize failed');
  const listed = await send('tools/list', {});
  const names = (listed.result?.tools || []).map((t) => t.name);
  if (!names.includes('get_sales')) throw new Error(`missing get_sales: ${names}`);
  const call = await send('tools/call', {
    name: 'get_sales',
    arguments: { product: 'Product X', geography: 'Mumbai', period: 'last_12_months' },
  });
  const text = call.result?.content?.[0]?.text || '';
  if (!text.includes('18.2')) throw new Error(`unexpected sales: ${text}`);
  console.error('stdio MCP ok', names.length, 'tools; Mumbai Product X = 18.2');
  child.stdin.end();
  process.exit(0);
} catch (err) {
  console.error(err);
  try {
    child.stdin.end();
  } catch {
    /* ignore */
  }
  process.exit(1);
}

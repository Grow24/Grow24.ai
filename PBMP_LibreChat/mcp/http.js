import http from 'node:http';
import { callTool, toolDefs } from './tools.js';
import { store } from './store.js';

function send(res, status, body) {
  const json = JSON.stringify(body, null, 2);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(json);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

export function startHttp(port = Number(process.env.PBMP_MCP_PORT || 5202)) {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
      return;
    }
    try {
      if (req.method === 'GET' && url.pathname === '/health') {
        return send(res, 200, { ok: true, service: 'pbmp-mcp', tools: toolDefs.map((t) => t.name) });
      }
      if (req.method === 'GET' && url.pathname === '/tools') {
        return send(res, 200, { tools: toolDefs });
      }
      if (req.method === 'GET' && url.pathname === '/sample') {
        return send(res, 200, {
          projects: store.projects.map((p) => p.name),
          products: [...new Set(store.sales.map((s) => s.product))],
        });
      }
      if (req.method === 'POST' && url.pathname.startsWith('/tools/')) {
        const name = url.pathname.slice('/tools/'.length);
        const args = await readBody(req);
        return send(res, 200, callTool(name, args));
      }
      send(res, 404, { ok: false, error: 'Not found' });
    } catch (err) {
      send(res, 400, { ok: false, error: String(err.message || err) });
    }
  });
  server.listen(port, '0.0.0.0', () => {
    console.error(`PBMP MCP HTTP listening on http://127.0.0.1:${port}`);
  });
  return server;
}

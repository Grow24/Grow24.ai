#!/usr/bin/env node
/**
 * PBMP MCP for LibreChat / TrueForge.
 * Default: MCP JSON-RPC over stdio (Content-Length framing).
 * HTTP sample API: node index.js --http   (port 5202)
 */
import { callTool, toolDefs } from './tools.js';
import { startHttp } from './http.js';

const useHttp = process.argv.includes('--http') || process.env.PBMP_MCP_HTTP === '1';

if (useHttp) {
  startHttp();
} else {
  startStdio();
}

const INSTRUCTIONS =
  'PBMP sample business system. Prefer get_project, get_customer, get_sales for the Product X demo. ' +
  'Ask a human before create_requirement, update_project_status, create_risk, or update_risk.';

function startStdio() {
  let buf = Buffer.alloc(0);
  process.stdin.on('data', (chunk) => {
    buf = Buffer.concat([buf, Buffer.from(chunk)]);
    while (true) {
      const parsed = readOne(buf);
      if (!parsed) break;
      buf = parsed.rest;
      if (parsed.obj) handleRequest(parsed.obj);
    }
  });
  process.stdin.on('end', () => process.exit(0));
}

function readOne(buf) {
  if (!buf.length) return null;
  const text = buf.toString('utf8');
  const trimmedStart = text.match(/^\s*/)[0].length;

  if (text.slice(trimmedStart).toLowerCase().startsWith('content-length:')) {
    const headerEnd = text.indexOf('\r\n\r\n');
    if (headerEnd < 0) return null;
    const header = text.slice(0, headerEnd);
    const match = header.match(/content-length:\s*(\d+)/i);
    if (!match) return { obj: null, rest: buf.subarray(headerEnd + 4) };
    const len = Number(match[1]);
    const bodyStart = headerEnd + 4;
    if (buf.length < bodyStart + len) return null;
    const body = buf.subarray(bodyStart, bodyStart + len).toString('utf8');
    return { obj: JSON.parse(body), rest: buf.subarray(bodyStart + len) };
  }

  const nl = text.indexOf('\n');
  if (nl < 0) return null;
  const line = text.slice(0, nl).trim();
  const rest = buf.subarray(nl + 1);
  if (!line) return { obj: null, rest };
  return { obj: JSON.parse(line), rest };
}

function write(msg) {
  process.stdout.write(`${JSON.stringify(msg)}\n`);
}

function handleRequest(req) {
  if (!req || typeof req !== 'object') return;
  const id = req.id;
  const method = req.method;
  if (method === 'initialize') {
    write({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: req.params?.protocolVersion || '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'pbmp-mcp', version: '0.1.0' },
        instructions: INSTRUCTIONS,
      },
    });
    return;
  }
  if (method === 'notifications/initialized' || method === 'initialized' || method === 'notifications/cancelled') {
    return;
  }
  if (method === 'tools/list') {
    write({ jsonrpc: '2.0', id, result: { tools: toolDefs } });
    return;
  }
  if (method === 'tools/call') {
    const name = req.params?.name;
    const args = req.params?.arguments || {};
    const result = callTool(name, args);
    write({
      jsonrpc: '2.0',
      id,
      result: {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        isError: !result.ok,
      },
    });
    return;
  }
  if (method === 'ping') {
    write({ jsonrpc: '2.0', id, result: {} });
    return;
  }
  if (id !== undefined) {
    write({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
  }
}

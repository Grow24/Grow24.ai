#!/usr/bin/env node
/**
 * Local AgentBot API for grow24.ai.
 * Stores users on disk so register/login work without MongoDB.
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 5188);
const HOST = process.env.HOST || '0.0.0.0';
const serverDomain = process.env.DOMAIN_CLIENT || 'https://www.grow24.ai/HBMP_AgentBot';
const dataDir = process.env.AGENTBOT_DATA_DIR || '/app/data';
const usersFile = path.join(dataDir, 'agentbot-users.json');
const secretFile = path.join(dataDir, 'agentbot-secret.txt');
const convosFile = path.join(dataDir, 'agentbot-convos.json');
const presetsFile = path.join(dataDir, 'agentbot-presets.json');
const filesMetaFile = path.join(dataDir, 'agentbot-files.json');
const filesDir = path.join(dataDir, 'files');
const NO_PARENT = '00000000-0000-0000-0000-000000000000';
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(filesDir, { recursive: true });

function loadSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (fs.existsSync(secretFile)) return fs.readFileSync(secretFile, 'utf8').trim();
  const secret = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(secretFile, secret);
  return secret;
}

const JWT_SECRET = loadSecret();

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  const next = crypto.scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(next, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function b64url(value) {
  return Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)).toString('base64url');
}

function signJwt(payload, expiresInSec) {
  const header = b64url({ alg: 'HS256', typ: 'JWT' });
  const now = Math.floor(Date.now() / 1000);
  const body = b64url({ ...payload, iat: now, exp: now + expiresInSec });
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

function verifyJwt(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  if (sig !== expected) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    avatar: user.avatar || '',
    role: user.role || 'USER',
    provider: 'local',
    plugins: [],
    twoFactorEnabled: false,
    personalization: { memories: false },
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function send(res, status, body, extraHeaders = {}) {
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': typeof body === 'string' ? 'text/plain; charset=utf-8' : 'application/json',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function isBlankToken(token) {
  const value = String(token || '').trim();
  return !value || value === 'undefined' || value === 'null' || value === 'Bearer';
}

function cookieToken(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/(?:^|;\s*)(?:agentbotRefreshToken|refreshToken)=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

function bearer(req) {
  const header = String(req.headers.authorization || '');
  let token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (isBlankToken(token) || token.split('.').length !== 3) {
    token = cookieToken(req);
  }
  return isBlankToken(token) ? '' : token;
}

function upsertUserFromPayload(payload) {
  if (!payload?.id && !payload?.email) return null;
  const users = readUsers();
  const existing = users.find(
    (item) => item.id === payload.id || (payload.email && item.email === payload.email),
  );
  if (existing) return existing;
  const now = new Date().toISOString();
  const email = String(payload.email || `${payload.id}@local`).toLowerCase();
  const user = {
    id: payload.id || crypto.randomUUID(),
    email,
    username: email.split('@')[0],
    name: email.split('@')[0],
    password: hashPassword(crypto.randomBytes(16).toString('hex')),
    role: users.length === 0 ? 'ADMIN' : 'USER',
    avatar: '',
    createdAt: now,
    updatedAt: now,
  };
  users.push(user);
  writeUsers(users);
  return user;
}

function userFromReq(req) {
  const payload = verifyJwt(bearer(req));
  if (!payload) return null;
  return readUsers().find((user) => user.id === payload.id) || upsertUserFromPayload(payload);
}

function ensureGuestUser() {
  return upsertUserFromPayload({ id: 'local-web', email: 'agentbot@local' });
}

function sessionUser(req) {
  return userFromReq(req) || (sameSiteRequest(req) ? ensureGuestUser() : null);
}

function sameSiteRequest(req) {
  const host = String(req.headers.host || '');
  const origin = String(req.headers.origin || '');
  const referer = String(req.headers.referer || '');
  return /grow24\.ai/i.test(host + origin + referer) || /localhost|127\.0\.0\.1/i.test(host);
}

function guestUser() {
  return {
    id: 'local-web',
    email: 'agentbot@local',
    username: 'user',
    name: 'User',
    role: 'USER',
    avatar: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const startupConfig = {
  appTitle: 'HBMP AgentBot',
  socialLogins: [],
  discordLoginEnabled: false,
  facebookLoginEnabled: false,
  githubLoginEnabled: false,
  googleLoginEnabled: false,
  appleLoginEnabled: false,
  openidLoginEnabled: false,
  openidLabel: 'Continue with OpenID',
  openidAutoRedirect: false,
  samlLoginEnabled: false,
  serverDomain,
  emailLoginEnabled: true,
  registrationEnabled: true,
  socialLoginEnabled: false,
  emailEnabled: false,
  passwordResetEnabled: false,
  showBirthdayIcon: false,
  helpAndFaqURL: 'https://librechat.ai',
  interface: {
    endpointsMenu: true,
    modelSelect: true,
    parameters: true,
    presets: true,
    sidePanel: true,
    customWelcome: 'Welcome to HBMP AgentBot!',
    bookmarks: true,
    prompts: true,
    multiConvo: true,
    agents: true,
    fileSearch: true,
    fileCitations: true,
    peoplePicker: { users: true, groups: true, roles: true },
    mcpServers: { placeholder: 'MCP Servers' },
  },
  mcpServers: {
    pbmp: { startup: true, chatMenu: true, isOAuth: false },
  },
  turnstile: {},
  balance: { enabled: false },
  sharedLinksEnabled: true,
  publicSharedLinksEnabled: true,
  instanceProjectId: '000000000000000000000000',
  sharePointFilePickerEnabled: false,
  openidReuseTokens: false,
  conversationImportMaxFileSize: 0,
  ldap: { enabled: false },
  modelSpecs: {
    list: [
      {
        name: 'gemini-2.5-flash',
        label: 'Gemini 2.5 Flash',
        default: true,
        description: 'Default chat model',
        group: 'google',
        preset: {
          endpoint: 'google',
          model: 'gemini-2.5-flash',
        },
      },
    ],
  },
};

const endpoints = {
  google: { userProvide: false, order: 1 },
  agents: {
    userProvide: false,
    capabilities: ['execute_code', 'file_search', 'web_search', 'actions', 'artifacts'],
    order: 2,
    disableBuilder: false,
  },
};

const MCP_URL = process.env.PBMP_MCP_URL || 'http://127.0.0.1:5202';
const PBMP_SYSTEM =
  'You are the PBMP assistant for Grow24 / HBMP. PBMP means Personal & Business Management Platform, not pharmacy benefit management. ' +
  'Use PBMP tools for sales, projects, customers, requirements and risks. ' +
  'Product X last-12-month sample: Mumbai ₹18.2 Cr ROI 24% Medium; Delhi ₹15.7 Cr ROI 19% Low; Bangalore ₹13.6 Cr ROI 16% Medium. ' +
  'Never invent rupee figures when a tool can return them.';

const PBMP_TOOL_DEFS = [
  { name: 'get_project', description: 'Get a PBMP project by name.', parameters: { type: 'object', properties: { project_name: { type: 'string' } }, required: ['project_name'] } },
  { name: 'get_customer', description: 'Get a PBMP customer by name.', parameters: { type: 'object', properties: { customer_name: { type: 'string' } }, required: ['customer_name'] } },
  { name: 'get_sales', description: 'Get sales for a product, geography and period (use last_12_months).', parameters: { type: 'object', properties: { product: { type: 'string' }, geography: { type: 'string' }, period: { type: 'string' } }, required: ['product'] } },
  { name: 'create_requirement', description: 'Create a requirement in PBMP.', parameters: { type: 'object', properties: { description: { type: 'string' } }, required: ['description'] } },
  { name: 'update_project_status', description: 'Update a PBMP project status.', parameters: { type: 'object', properties: { project: { type: 'string' }, status: { type: 'string' } }, required: ['project', 'status'] } },
  { name: 'get_project_actuals', description: 'Get actual vs plan figures for a project.', parameters: { type: 'object', properties: { project_name: { type: 'string' } }, required: ['project_name'] } },
  { name: 'get_project_risks', description: 'List risks on a PBMP project.', parameters: { type: 'object', properties: { project_name: { type: 'string' } }, required: ['project_name'] } },
  { name: 'create_risk', description: 'Add a risk to a PBMP project.', parameters: { type: 'object', properties: { project: { type: 'string' }, title: { type: 'string' }, severity: { type: 'string' } }, required: ['project', 'title'] } },
  { name: 'update_risk', description: 'Update a PBMP risk.', parameters: { type: 'object', properties: { id: { type: 'string' }, status: { type: 'string' } }, required: ['id'] } },
];

const DEFAULT_GEMINI = 'gemini-2.5-flash';
const GEMINI_FALLBACKS = [
  'gemini-2.5-flash',
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
];

const models = {
  google: ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.5-flash'],
  agents: ['gemini-2.5-flash', 'gemini-3.5-flash'],
};

function resolveGeminiModel(model) {
  const requested = String(model || '').replace(/^google\//, '').trim();
  const aliases = {
    'gemini-1.5-flash-lite': DEFAULT_GEMINI,
    'gemini-1.5-flash': DEFAULT_GEMINI,
    'gemini-1.5-pro': DEFAULT_GEMINI,
    'gemini-2.0-flash': DEFAULT_GEMINI,
    'gemini-2.0-flash-001': DEFAULT_GEMINI,
    'gemini-2.0-flash-lite': DEFAULT_GEMINI,
    'gemini-2.0-flash-lite-001': DEFAULT_GEMINI,
  };
  if (!requested) return DEFAULT_GEMINI;
  return aliases[requested] || requested;
}

function localJson(pathname, body, method = 'GET') {
  return new Promise((resolve) => {
    const payload = body == null ? '' : JSON.stringify(body);
    const target = new URL(pathname, MCP_URL);
    const req = http.request(
      {
        hostname: target.hostname,
        port: target.port,
        path: target.pathname,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        timeout: 8000,
      },
      (incoming) => {
        const chunks = [];
        incoming.on('data', (chunk) => chunks.push(chunk));
        incoming.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');
          try {
            resolve(JSON.parse(raw));
          } catch {
            resolve({ ok: false, error: raw.slice(0, 300) });
          }
        });
      },
    );
    req.on('error', (err) => resolve({ ok: false, error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ ok: false, error: 'MCP timeout' });
    });
    req.end(payload);
  });
}

async function callPbmpTool(name, args) {
  return localJson(`/tools/${name}`, args || {}, 'POST');
}

async function generateGemini(key, model, contents, extra = {}) {
  const tried = [];
  const queue = [model, ...GEMINI_FALLBACKS.filter((item) => item !== model)];
  let last = { status: 500, json: null, raw: 'No Gemini model attempted.' };
  for (const candidate of queue) {
    if (tried.includes(candidate)) continue;
    tried.push(candidate);
    last = await httpsJson(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(candidate)}:generateContent?key=${encodeURIComponent(key)}`,
      { contents, ...extra },
    );
    const message = String(last.json?.error?.message || last.raw || '');
    const unavailable =
      last.status >= 400 && /no longer available|not found|not supported/i.test(message);
    if (!unavailable && last.status < 400) {
      return { ...last, model: candidate };
    }
    if (!unavailable) {
      return { ...last, model: candidate };
    }
  }
  return { ...last, model: tried[tried.length - 1] };
}

async function generateGeminiWithPbmp(key, model, userContents, extras = {}) {
  const systemText = [PBMP_SYSTEM, extras.promptPrefix].filter(Boolean).join('\n\n');
  const extra = {
    systemInstruction: { parts: [{ text: systemText }] },
    tools: [{ functionDeclarations: PBMP_TOOL_DEFS }],
  };
  if (extras.generationConfig && Object.keys(extras.generationConfig).length) {
    extra.generationConfig = extras.generationConfig;
  }
  let contents = userContents;
  let last = { status: 500, json: null, raw: 'No Gemini model attempted.' };
  for (let step = 0; step < 5; step += 1) {
    last = await generateGemini(key, model, contents, extra);
    if (last.model) model = last.model;
    const parts = last.json?.candidates?.[0]?.content?.parts || [];
    const calls = parts.filter((part) => part.functionCall && part.functionCall.name);
    if (!calls.length || last.status >= 400) {
      return { ...last, model };
    }
    const responses = [];
    for (const part of calls) {
      const data = await callPbmpTool(part.functionCall.name, part.functionCall.args || {});
      responses.push({
        functionResponse: {
          name: part.functionCall.name,
          response: data && typeof data === 'object' ? data : { result: String(data) },
        },
      });
    }
    contents = [...contents, { role: 'model', parts }, { role: 'user', parts: responses }];
  }
  return { ...last, model };
}

const emptyList = { object: 'list', data: [], first_id: '', last_id: '', has_more: false };

function authHeaders(token, req) {
  const proto = String(req?.headers['x-forwarded-proto'] || '');
  const secure = proto === 'https' ? '; Secure' : '';
  const cookie = `HttpOnly; Path=/HBMP_AgentBot; SameSite=Lax; Max-Age=604800${secure}`;
  return {
    'Set-Cookie': [
      `refreshToken=${token}; ${cookie}`,
      `agentbotRefreshToken=${token}; ${cookie}`,
    ],
  };
}

function geminiKey() {
  return String(process.env.GOOGLE_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();
}

function readConvos() {
  try {
    return JSON.parse(fs.readFileSync(convosFile, 'utf8'));
  } catch {
    return { conversations: {}, messages: {} };
  }
}

function writeConvos(store) {
  fs.writeFileSync(convosFile, JSON.stringify(store));
}

function readPresets() {
  try {
    return JSON.parse(fs.readFileSync(presetsFile, 'utf8'));
  } catch {
    return [];
  }
}

function writePresets(list) {
  fs.writeFileSync(presetsFile, JSON.stringify(list));
}

function readFiles() {
  try {
    return JSON.parse(fs.readFileSync(filesMetaFile, 'utf8'));
  } catch {
    return {};
  }
}

function writeFiles(store) {
  fs.writeFileSync(filesMetaFile, JSON.stringify(store));
}

function publicFile(rec) {
  if (!rec) return null;
  return {
    file_id: rec.file_id,
    temp_file_id: rec.temp_file_id || rec.file_id,
    user: rec.user,
    conversationId: rec.conversationId,
    filename: rec.filename,
    filepath: rec.filepath,
    type: rec.type,
    bytes: rec.bytes,
    width: rec.width,
    height: rec.height,
    embedded: false,
    object: 'file',
    usage: 0,
    context: rec.context || 'message_attachment',
    source: 'local',
    createdAt: rec.createdAt,
    updatedAt: rec.updatedAt,
  };
}

function parseMultipart(req) {
  return new Promise((resolve) => {
    const chunks = [];
    let size = 0;
    let tooLarge = false;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_UPLOAD_BYTES) {
        tooLarge = true;
        req.destroy();
        resolve({ fields: {}, file: null, error: 'File is larger than 20 MB.' });
        return;
      }
      chunks.push(chunk);
    });
    req.on('error', () => resolve({ fields: {}, file: null, error: tooLarge ? 'File is larger than 20 MB.' : 'Upload failed.' }));
    req.on('end', () => {
      if (tooLarge) return;
      const buffer = Buffer.concat(chunks);
      const ct = String(req.headers['content-type'] || '');
      const match = ct.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
      if (!match) {
        resolve({ fields: {}, file: null, error: 'Missing multipart boundary.' });
        return;
      }
      const delim = Buffer.from(`--${(match[1] || match[2]).trim()}`);
      const fields = {};
      let file = null;
      let pos = 0;
      while (pos < buffer.length) {
        const start = buffer.indexOf(delim, pos);
        if (start === -1) break;
        let partStart = start + delim.length;
        if (buffer[partStart] === 0x2d && buffer[partStart + 1] === 0x2d) break;
        if (buffer[partStart] === 0x0d) partStart += 1;
        if (buffer[partStart] === 0x0a) partStart += 1;
        const headerEnd = buffer.indexOf('\r\n\r\n', partStart);
        if (headerEnd === -1) break;
        const headers = buffer.slice(partStart, headerEnd).toString('utf8');
        const next = buffer.indexOf(delim, headerEnd + 4);
        let contentEnd = next === -1 ? buffer.length : next;
        if (contentEnd >= 2 && buffer[contentEnd - 2] === 0x0d && buffer[contentEnd - 1] === 0x0a) {
          contentEnd -= 2;
        }
        const content = buffer.slice(headerEnd + 4, contentEnd);
        const nameMatch = headers.match(/name="([^"]+)"/i);
        const filenameMatch = headers.match(/filename\*?=(?:UTF-8'')?"?([^";\r\n]+)"?/i);
        const typeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);
        const rawName = filenameMatch ? filenameMatch[1].replace(/"/g, '').trim() : '';
        if (rawName) {
          let originalname = rawName;
          try {
            originalname = decodeURIComponent(rawName);
          } catch {
            originalname = rawName;
          }
          file = {
            originalname,
            mimetype: (typeMatch ? typeMatch[1] : 'application/octet-stream').trim(),
            buffer: Buffer.from(content),
          };
        } else if (nameMatch) {
          fields[nameMatch[1]] = content.toString('utf8');
        }
        pos = next === -1 ? buffer.length : next;
      }
      resolve({ fields, file, error: null });
    });
  });
}

function guessMime(filename, fallback) {
  const ext = path.extname(String(filename || '')).toLowerCase();
  const map = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.md': 'text/markdown',
    '.json': 'application/json',
  };
  return map[ext] || fallback || 'application/octet-stream';
}

function saveUploadedFile({ user, fields, file }) {
  const fileId = fields.file_id && String(fields.file_id).trim() ? String(fields.file_id).trim() : crypto.randomUUID();
  const filename = path.basename(file.originalname || 'upload.bin').replace(/[^\w.\- ()[\]]+/g, '_') || 'upload.bin';
  const ext = path.extname(filename) || '';
  const diskName = `${fileId}${ext}`;
  const diskPath = path.join(filesDir, diskName);
  fs.writeFileSync(diskPath, file.buffer);
  const now = new Date().toISOString();
  const rec = {
    file_id: fileId,
    temp_file_id: fields.file_id || fileId,
    user: user.id,
    conversationId: fields.conversationId || '',
    filename,
    filepath: `/HBMP_AgentBot/api/files/download/${encodeURIComponent(user.id)}/${encodeURIComponent(fileId)}`,
    diskPath,
    type: file.mimetype || guessMime(filename),
    bytes: file.buffer.length,
    width: fields.width ? Number(fields.width) : undefined,
    height: fields.height ? Number(fields.height) : undefined,
    context: 'message_attachment',
    createdAt: now,
    updatedAt: now,
  };
  const store = readFiles();
  store[fileId] = rec;
  writeFiles(store);
  return rec;
}

function filesToGeminiParts(files) {
  const parts = [];
  const store = readFiles();
  for (const item of files || []) {
    const rec = store[item.file_id] || Object.values(store).find((entry) => entry.filepath === item.filepath);
    if (!rec || !rec.diskPath || !fs.existsSync(rec.diskPath)) continue;
    const mime = rec.type || item.type || 'application/octet-stream';
    const buf = fs.readFileSync(rec.diskPath);
    if (mime.startsWith('text/') || mime === 'application/json' || mime === 'text/csv') {
      parts.push({ text: `\n\n--- File: ${rec.filename} ---\n${buf.toString('utf8').slice(0, 80000)}` });
      continue;
    }
    if (mime.startsWith('image/') || mime === 'application/pdf') {
      parts.push({ inlineData: { mimeType: mime, data: buf.toString('base64') } });
      continue;
    }
    parts.push({ text: `\n\n[Attached file: ${rec.filename} (${mime}, ${rec.bytes} bytes)]` });
  }
  return parts;
}

const fileConfig = {
  serverFileSizeLimit: 20,
  avatarSizeLimit: 2,
  endpoints: {
    default: {
      fileLimit: 5,
      fileSizeLimit: 20,
      totalSizeLimit: 25,
    },
    google: {
      fileLimit: 5,
      fileSizeLimit: 20,
      totalSizeLimit: 25,
    },
    agents: {
      fileLimit: 5,
      fileSizeLimit: 20,
      totalSizeLimit: 25,
    },
  },
};

function knowledgeDir() {
  const fromEnv = process.env.PBMP_KNOWLEDGE_DIR;
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;
  if (fs.existsSync('/app/pbmp-knowledge')) return '/app/pbmp-knowledge';
  const local = path.join(__dirname, '..', 'PBMP_LibreChat', 'knowledge');
  return fs.existsSync(local) ? local : '';
}

function seedKnowledgeFiles() {
  const dir = knowledgeDir();
  if (!dir) return;
  const store = readFiles();
  let added = 0;
  for (const name of fs.readdirSync(dir)) {
    const src = path.join(dir, name);
    if (!fs.statSync(src).isFile() || name.startsWith('.')) continue;
    const fileId = `sample-${name.replace(/[^\w.\-]+/g, '_')}`;
    const diskPath = path.join(filesDir, fileId);
    fs.copyFileSync(src, diskPath);
    const stat = fs.statSync(diskPath);
    const now = stat.mtime.toISOString();
    store[fileId] = {
      file_id: fileId,
      temp_file_id: fileId,
      user: 'sample',
      sample: true,
      filename: name,
      filepath: `/HBMP_AgentBot/api/files/download/sample/${encodeURIComponent(fileId)}`,
      diskPath,
      type: guessMime(name),
      bytes: stat.size,
      context: 'message_attachment',
      createdAt: now,
      updatedAt: now,
    };
    added += 1;
  }
  writeFiles(store);
  if (added) console.log(`[agentbot-stub] seeded ${added} PBMP sample files from ${dir}`);
}

seedKnowledgeFiles();

function httpsJson(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (incoming) => {
      const chunks = [];
      incoming.on('data', (chunk) => chunks.push(chunk));
      incoming.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        try {
          resolve({ status: incoming.statusCode || 500, json: JSON.parse(raw), raw });
        } catch {
          resolve({ status: incoming.statusCode || 500, json: null, raw });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function sseStart(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
}

function sseWrite(res, event) {
  res.write(`event: message\ndata: ${JSON.stringify(event)}\n\n`);
}

function toGeminiContents(history, latestText, latestFiles = []) {
  const contents = [];
  for (const item of history) {
    const part = String(item.text || '').trim();
    const fileParts = filesToGeminiParts(item.files);
    if (!part && !fileParts.length) continue;
    const parts = [];
    if (part) parts.push({ text: part });
    parts.push(...fileParts);
    contents.push({
      role: item.isCreatedByUser ? 'user' : 'model',
      parts,
    });
  }
  const latestParts = [];
  if (latestText) latestParts.push({ text: latestText });
  latestParts.push(...filesToGeminiParts(latestFiles));
  if (!latestParts.length) latestParts.push({ text: latestText || 'Please review the attached file.' });
  if (!contents.length || contents[contents.length - 1].role !== 'user') {
    contents.push({ role: 'user', parts: latestParts });
  }
  return contents;
}

const server = http.createServer(async (req, res) => {
  const rawUrl = req.url || '/';
  const url = rawUrl.split('?')[0];
  const qs = new URLSearchParams(rawUrl.split('?')[1] || '');
  const method = req.method || 'GET';

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (method === 'GET' && (url === '/health' || url === '/api/health')) {
    send(res, 200, { status: 'ok' });
    return;
  }

  if (method === 'GET' && url === '/api/config') {
    send(res, 200, startupConfig);
    return;
  }

  if (method === 'POST' && url === '/api/auth/register') {
    const body = await readBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const name = String(body.name || '').trim();
    const username = String(body.username || email).trim();
    if (!email || !email.includes('@') || password.length < 8 || !name) {
      send(res, 400, { message: 'Name, valid email, and password (8+ characters) are required.' });
      return;
    }
    const users = readUsers();
    const now = new Date().toISOString();
    const existing = users.find((user) => user.email === email);
    if (existing) {
      existing.username = username || existing.username;
      existing.name = name || existing.name;
      existing.password = hashPassword(password);
      existing.updatedAt = now;
    } else {
      users.push({
        id: crypto.randomUUID(),
        email,
        username,
        name,
        password: hashPassword(password),
        role: users.length === 0 ? 'ADMIN' : 'USER',
        avatar: '',
        createdAt: now,
        updatedAt: now,
      });
    }
    writeUsers(users);
    send(res, 200, { message: 'Registration successful. You can now sign in.' });
    return;
  }

  if (method === 'POST' && url === '/api/auth/login') {
    const body = await readBody(req);
    const email = String(body.email || body.username || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!email || !email.includes('@') || password.length < 8) {
      send(res, 401, { message: 'Invalid email or password.' });
      return;
    }
    const users = readUsers();
    let user = users.find((item) => item.email === email);
    if (!user) {
      const now = new Date().toISOString();
      user = {
        id: crypto.randomUUID(),
        email,
        username: email,
        name: email.split('@')[0],
        password: hashPassword(password),
        role: users.length === 0 ? 'ADMIN' : 'USER',
        avatar: '',
        createdAt: now,
        updatedAt: now,
      };
      users.push(user);
      writeUsers(users);
    } else if (!verifyPassword(password, user.password)) {
      send(res, 401, { message: 'Invalid email or password.' });
      return;
    }
    const token = signJwt({ id: user.id, email: user.email }, 60 * 60 * 24 * 7);
    send(res, 200, { token, user: publicUser(user) }, authHeaders(token, req));
    return;
  }

  if (method === 'POST' && url === '/api/auth/logout') {
    send(res, 200, { message: 'Logout successful', redirect: '/login' }, {
      'Set-Cookie': [
        'refreshToken=; HttpOnly; Path=/HBMP_AgentBot; Max-Age=0',
        'agentbotRefreshToken=; HttpOnly; Path=/HBMP_AgentBot; Max-Age=0',
      ],
    });
    return;
  }

  if (method === 'POST' && url.startsWith('/api/auth/refresh')) {
    const user = sessionUser(req);
    if (!user) {
      send(res, 401, { token: null, user: null, message: 'Refresh token not provided' });
      return;
    }
    const token = signJwt({ id: user.id, email: user.email }, 60 * 60 * 24 * 7);
    send(res, 200, { token, user: publicUser(user) }, authHeaders(token, req));
    return;
  }

  if (method === 'GET' && url === '/api/user') {
    const user = sessionUser(req);
    if (!user) {
      send(res, 401, { message: 'Unauthorized' });
      return;
    }
    send(res, 200, publicUser(user));
    return;
  }

  if (method === 'GET' && url === '/api/user/terms') {
    send(res, 200, { termsAccepted: true });
    return;
  }

  if (method === 'GET' && url === '/api/banner') {
    send(res, 200, null);
    return;
  }

  if (method === 'GET' && url === '/api/balance') {
    send(res, 200, { tokenCredits: 0, autoRefillEnabled: false });
    return;
  }

  if (method === 'GET' && url === '/api/endpoints') {
    send(res, 200, endpoints);
    return;
  }

  if (method === 'GET' && url === '/api/files/config') {
    send(res, 200, fileConfig);
    return;
  }

  if (method === 'GET' && url === '/api/files') {
    const user = userFromReq(req);
    const store = readFiles();
    const list = Object.values(store)
      .filter((item) => item.sample || !user || item.user === user.id)
      .sort((a, b) => String(a.filename).localeCompare(String(b.filename)))
      .map(publicFile);
    send(res, 200, list);
    return;
  }

  if (method === 'GET' && url.startsWith('/api/files/download/')) {
    const parts = url.slice('/api/files/download/'.length).split('/');
    const fileId = decodeURIComponent(parts[1] || parts[0] || '');
    const rec = readFiles()[fileId];
    if (!rec || !rec.diskPath || !fs.existsSync(rec.diskPath)) {
      send(res, 404, { message: 'File not found' });
      return;
    }
    const data = fs.readFileSync(rec.diskPath);
    res.writeHead(200, {
      'Content-Type': rec.type || 'application/octet-stream',
      'Content-Length': data.length,
      'Cache-Control': 'private, max-age=3600',
      'Content-Disposition': `inline; filename="${encodeURIComponent(rec.filename)}"`,
    });
    res.end(data);
    return;
  }

  if (method === 'POST' && (url === '/api/files' || url === '/api/files/images' || url === '/api/files/images/avatar')) {
    const user = userFromReq(req) || (sameSiteRequest(req) ? guestUser() : null);
    if (!user) {
      send(res, 401, { message: 'Unauthorized' });
      return;
    }
    const parsed = await parseMultipart(req);
    if (parsed.error || !parsed.file) {
      send(res, 400, { message: parsed.error || 'No file uploaded' });
      return;
    }
    const rec = saveUploadedFile({ user, fields: parsed.fields, file: parsed.file });
    if (url === '/api/files/images/avatar') {
      send(res, 200, { url: rec.filepath });
      return;
    }
    send(res, 200, { message: 'File uploaded and processed successfully', ...publicFile(rec) });
    return;
  }

  if (method === 'DELETE' && url === '/api/files') {
    const body = await readBody(req);
    const files = Array.isArray(body.files) ? body.files : [];
    const store = readFiles();
    for (const item of files) {
      const rec = store[item.file_id];
      if (!rec) continue;
      try {
        if (rec.diskPath && fs.existsSync(rec.diskPath)) fs.unlinkSync(rec.diskPath);
      } catch {
        /* ignore */
      }
      delete store[item.file_id];
    }
    writeFiles(store);
    send(res, 200, { message: 'Files deleted successfully', result: {} });
    return;
  }

  if (method === 'GET' && url === '/api/presets') {
    const user = userFromReq(req);
    const list = readPresets().filter((item) => !user || item.user === user.id);
    send(res, 200, list);
    return;
  }

  if (method === 'POST' && url === '/api/presets') {
    const user = userFromReq(req) || (sameSiteRequest(req) ? guestUser() : null);
    if (!user) {
      send(res, 401, { message: 'Unauthorized' });
      return;
    }
    const body = await readBody(req);
    const now = new Date().toISOString();
    const presetId = String(body.presetId || crypto.randomUUID());
    const preset = {
      ...body,
      presetId,
      user: user.id,
      title: String(body.title || body.modelLabel || 'My Preset').trim() || 'My Preset',
      endpoint: body.endpoint || 'google',
      createdAt: body.createdAt || now,
      updatedAt: now,
    };
    const list = readPresets();
    const index = list.findIndex((item) => item.presetId === presetId && item.user === user.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...preset };
    } else {
      list.push(preset);
    }
    writePresets(list);
    send(res, 201, preset);
    return;
  }

  if (method === 'POST' && url === '/api/presets/delete') {
    const user = userFromReq(req) || (sameSiteRequest(req) ? guestUser() : null);
    const body = await readBody(req);
    const presetId = body.presetId;
    let deletedCount = 0;
    const next = readPresets().filter((item) => {
      if (user && item.user && item.user !== user.id) return true;
      if (presetId && item.presetId !== presetId) return true;
      deletedCount += 1;
      return false;
    });
    writePresets(next);
    send(res, 201, { acknowledged: true, deletedCount });
    return;
  }

  if (method === 'GET' && url === '/api/agents') {
    send(res, 200, emptyList);
    return;
  }

  if (method === 'GET' && url.startsWith('/api/assistants')) {
    send(res, 200, emptyList);
    return;
  }

  if (method === 'GET' && url === '/api/user/plugins') {
    send(res, 200, []);
    return;
  }

  if (method === 'GET' && url === '/api/models') {
    send(res, 200, models);
    return;
  }

  if (method === 'GET' && url === '/api/convos') {
    const user = userFromReq(req);
    const archived = qs.get('isArchived') === 'true';
    const store = readConvos();
    const conversations = Object.values(store.conversations)
      .filter((item) => !user || item.user === user.id)
      .filter((item) => !!item.isArchived === archived)
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    send(res, 200, { conversations, nextCursor: null });
    return;
  }

  if (method === 'GET' && url.startsWith('/api/convos/')) {
    const id = url.slice('/api/convos/'.length);
    const store = readConvos();
    const conversation = store.conversations[id] || {
      conversationId: id,
      title: 'New Chat',
      endpoint: 'google',
      model: DEFAULT_GEMINI,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    send(res, 200, conversation);
    return;
  }

  if (method === 'POST' && url === '/api/convos/gen_title') {
    const body = await readBody(req);
    const store = readConvos();
    const conversation = store.conversations[body.conversationId];
    send(res, 200, { title: conversation?.title || 'New Chat' });
    return;
  }

  if (method === 'POST' && url === '/api/convos/update') {
    const body = await readBody(req);
    const update = body.arg || body;
    const store = readConvos();
    const current = store.conversations[update.conversationId];
    if (!current) {
      send(res, 404, { error: 'Conversation not found' });
      return;
    }
    const next = {
      ...current,
      ...update,
      updatedAt: new Date().toISOString(),
    };
    store.conversations[update.conversationId] = next;
    writeConvos(store);
    send(res, 201, next);
    return;
  }

  if (method === 'POST' && url === '/api/convos/duplicate') {
    const body = await readBody(req);
    const sourceId = body.conversationId;
    const store = readConvos();
    const source = store.conversations[sourceId];
    if (!source) {
      send(res, 404, { error: 'Conversation not found' });
      return;
    }
    const conversationId = crypto.randomUUID();
    const now = new Date().toISOString();
    const conversation = {
      ...source,
      conversationId,
      title: `${source.title || 'Chat'} (copy)`,
      createdAt: now,
      updatedAt: now,
    };
    const messages = (store.messages[sourceId] || []).map((item) => ({
      ...item,
      messageId: crypto.randomUUID(),
      conversationId,
    }));
    store.conversations[conversationId] = conversation;
    store.messages[conversationId] = messages;
    writeConvos(store);
    send(res, 200, { conversation, messages });
    return;
  }

  if (method === 'DELETE' && url === '/api/convos/all') {
    const user = userFromReq(req);
    const store = readConvos();
    let deletedCount = 0;
    let deletedMessages = 0;
    for (const [id, item] of Object.entries(store.conversations)) {
      if (user && item.user && item.user !== user.id) continue;
      deletedMessages += (store.messages[id] || []).length;
      delete store.conversations[id];
      delete store.messages[id];
      deletedCount += 1;
    }
    writeConvos(store);
    send(res, 201, {
      acknowledged: true,
      deletedCount,
      messages: { acknowledged: true, deletedCount: deletedMessages },
    });
    return;
  }

  if (method === 'DELETE' && url === '/api/convos') {
    const body = await readBody(req);
    const arg = body.arg || body;
    const conversationId = arg.conversationId;
    if (!conversationId) {
      send(res, 400, { error: 'no parameters provided' });
      return;
    }
    const store = readConvos();
    const existing = store.conversations[conversationId];
    const deletedMessages = (store.messages[conversationId] || []).length;
    delete store.conversations[conversationId];
    delete store.messages[conversationId];
    writeConvos(store);
    send(res, 201, {
      acknowledged: true,
      deletedCount: existing ? 1 : 0,
      messages: { acknowledged: true, deletedCount: deletedMessages },
    });
    return;
  }

  if (method === 'GET' && url.startsWith('/api/messages/')) {
    const conversationId = decodeURIComponent(url.slice('/api/messages/'.length).split('/')[0]);
    const store = readConvos();
    send(res, 200, store.messages[conversationId] || []);
    return;
  }

  if (method === 'POST' && url.startsWith('/api/agents/chat/')) {
    const body = await readBody(req);
    const user = userFromReq(req) || (sameSiteRequest(req) ? guestUser() : null);
    if (!user) {
      send(res, 401, { text: 'Unauthorized. Please sign in again.', error: true });
      return;
    }

    const key = geminiKey();
    const text = String(body.text || '').trim();
    let model = resolveGeminiModel(body.model || body.modelOptions?.model || DEFAULT_GEMINI);
    const endpoint = String(body.endpoint || url.split('/').pop() || 'google');
    let conversationId = body.conversationId;
    if (!conversationId || conversationId === 'new') {
      conversationId = crypto.randomUUID();
    }
    const parentMessageId = body.parentMessageId || NO_PARENT;
    const userMessageId = body.messageId || crypto.randomUUID();
    const responseMessageId = crypto.randomUUID();
    const now = new Date().toISOString();
    const attachedFiles = Array.isArray(body.files) ? body.files : [];
    const userMessage = {
      messageId: userMessageId,
      conversationId,
      parentMessageId,
      text,
      sender: 'User',
      isCreatedByUser: true,
      endpoint,
      model,
      files: attachedFiles,
      createdAt: now,
      updatedAt: now,
    };

    sseStart(res);
    sseWrite(res, { created: true, message: userMessage });

    const finish = (reply, isError) => {
      const responseMessage = {
        messageId: responseMessageId,
        conversationId,
        parentMessageId: userMessageId,
        text: reply,
        sender: 'Gemini',
        isCreatedByUser: false,
        endpoint,
        model,
        unfinished: false,
        error: !!isError,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const title = (text || 'New Chat').slice(0, 48);
      const conversation = {
        conversationId,
        title,
        endpoint,
        model,
        createdAt: now,
        updatedAt: new Date().toISOString(),
        user: user.id,
      };
      const store = readConvos();
      store.conversations[conversationId] = conversation;
      store.messages[conversationId] = [...(store.messages[conversationId] || []), userMessage, responseMessage];
      writeConvos(store);
      sseWrite(res, {
        message: true,
        text: reply,
        messageId: responseMessageId,
        conversationId,
        parentMessageId: userMessageId,
      });
      sseWrite(res, {
        final: true,
        title,
        conversation,
        requestMessage: userMessage,
        responseMessage,
      });
      res.end();
    };

    if (!key) {
      finish(
        'Gemini API key is missing. Set GEMINI_API_KEY or GOOGLE_KEY on the grow24.ai Zeabur service, then redeploy.',
        true,
      );
      return;
    }

    try {
      const store = readConvos();
      const history = store.messages[conversationId] || [];
      const options = body.endpointOption || body.modelOptions || body;
      const promptPrefix = String(options.promptPrefix || body.promptPrefix || '').trim();
      const generationConfig = {};
      const temperature = options.temperature ?? body.temperature;
      const topP = options.topP ?? body.topP;
      const topK = options.topK ?? body.topK;
      const maxOutputTokens = options.maxOutputTokens ?? body.maxOutputTokens;
      if (temperature != null && temperature !== '' && Number.isFinite(Number(temperature))) {
        generationConfig.temperature = Number(temperature);
      }
      if (topP != null && topP !== '' && Number.isFinite(Number(topP))) {
        generationConfig.topP = Number(topP);
      }
      if (topK != null && topK !== '' && Number.isFinite(Number(topK))) {
        generationConfig.topK = Number(topK);
      }
      if (maxOutputTokens != null && maxOutputTokens !== '' && Number.isFinite(Number(maxOutputTokens))) {
        generationConfig.maxOutputTokens = Number(maxOutputTokens);
      }
      const result = await generateGeminiWithPbmp(key, model, toGeminiContents(history, text, attachedFiles), {
        promptPrefix,
        generationConfig,
      });
      if (result.model) model = result.model;
      const reply = (result.json?.candidates?.[0]?.content?.parts || [])
        .map((part) => part.text || '')
        .join('')
        .trim();
      if (result.status >= 400 || !reply) {
        const apiMessage = result.json?.error?.message || result.raw.slice(0, 400) || 'Gemini returned an empty response.';
        finish(apiMessage, true);
        return;
      }
      finish(reply, false);
    } catch (error) {
      finish(error.message || 'Failed to reach Gemini.', true);
    }
    return;
  }

  if (method === 'GET' && url.startsWith('/api/roles/')) {
    send(res, 200, { name: url.split('/').pop(), permissions: {} });
    return;
  }

  if (method === 'GET' && url === '/api/search/enable') {
    send(res, 200, false);
    return;
  }

  if (method === 'GET' && url === '/api/mcp/tools') {
    send(res, 200, {
      servers: {
        pbmp: {
          name: 'pbmp',
          icon: '',
          authenticated: true,
          authConfig: [],
          tools: PBMP_TOOL_DEFS.map((tool) => ({
            name: tool.name,
            pluginKey: `${tool.name}_mcp_pbmp`,
            description: tool.description,
          })),
        },
      },
    });
    return;
  }

  if (method === 'GET' && url === '/api/mcp/connection/status') {
    send(res, 200, {
      success: true,
      connectionStatus: { pbmp: { connectionState: 'connected', requiresOAuth: false } },
    });
    return;
  }

  if (method === 'GET' && url === '/api/mcp/connection/status/pbmp') {
    send(res, 200, { success: true, connectionState: 'connected', requiresOAuth: false });
    return;
  }

  if (method === 'GET' && url === '/api/tags') {
    send(res, 200, []);
    return;
  }

  if (method === 'GET' && url.startsWith('/api/prompts')) {
    send(res, 200, {
      promptGroups: [],
      prompts: [],
      pageNumber: '1',
      pageSize: 10,
      pages: 0,
      has_more: false,
      after: null,
    });
    return;
  }

  if (method === 'GET' && url === '/api/categories') {
    send(res, 200, []);
    return;
  }

  if (method === 'GET' && url === '/api/plugins') {
    send(res, 200, []);
    return;
  }

  if (method === 'GET' && url === '/api/memories') {
    send(res, 200, { memories: [], totalTokens: 0, tokenLimit: null, usagePercentage: null });
    return;
  }

  if (method === 'GET' && url.startsWith('/api/share')) {
    send(res, 200, { share: false, shared: false });
    return;
  }

  if (method === 'GET' && url.startsWith('/api/keys')) {
    send(res, 200, { expiresAt: null });
    return;
  }

  if (method === 'GET' && url.startsWith('/api/files/speech')) {
    send(res, 200, url.includes('voices') ? [] : {});
    return;
  }

  if (method === 'POST' && /\/api\/messages\/.+\/feedback$/.test(url)) {
    send(res, 200, { updated: true });
    return;
  }

  if (method === 'POST' && url === '/api/tokenizer') {
    send(res, 200, { count: 0 });
    return;
  }

  if (method === 'GET' && url.startsWith('/api/')) {
    send(res, 200, []);
    return;
  }

  send(res, 404, { text: `Route ${method} ${url} not found`, message: `Route ${method} ${url} not found` });
});

server.listen(PORT, HOST, () => {
  console.log(`[agentbot-stub] listening on ${HOST}:${PORT}`);
});

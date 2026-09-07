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
const { spawn } = require('child_process');

const PORT = Number(process.env.PORT || 5188);
const HOST = process.env.HOST || '0.0.0.0';
const serverDomain = process.env.DOMAIN_CLIENT || 'https://www.grow24.ai/HBMP_AgentBot';
const dataDir = process.env.AGENTBOT_DATA_DIR || '/app/data';
const usersFile = path.join(dataDir, 'agentbot-users.json');
const secretFile = path.join(dataDir, 'agentbot-secret.txt');
const convosFile = path.join(dataDir, 'agentbot-convos.json');
const presetsFile = path.join(dataDir, 'agentbot-presets.json');
const agentsFile = path.join(dataDir, 'agentbot-agents.json');
const promptsFile = path.join(dataDir, 'agentbot-prompts.json');
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
        fileSearch: true,
        executeCode: true,
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

const ROLE_PERMISSIONS = {
  PROMPTS: { SHARED_GLOBAL: true, USE: true, CREATE: true },
  BOOKMARKS: { USE: true },
  MEMORIES: { USE: true, CREATE: true, UPDATE: true, READ: true, OPT_OUT: true },
  AGENTS: { SHARED_GLOBAL: true, USE: true, CREATE: true },
  MULTI_CONVO: { USE: true },
  TEMPORARY_CHAT: { USE: true },
  RUN_CODE: { USE: true },
  WEB_SEARCH: { USE: true },
  PEOPLE_PICKER: { VIEW_USERS: true, VIEW_GROUPS: true, VIEW_ROLES: true },
  MARKETPLACE: { USE: true },
  FILE_SEARCH: { USE: true },
  FILE_CITATIONS: { USE: true },
};

const MCP_URL = process.env.PBMP_MCP_URL || 'http://127.0.0.1:5202';
const PBMP_SYSTEM =
  'You are the PBMP assistant for Grow24 / HBMP. PBMP means Personal & Business Management Platform, not pharmacy benefit management. ' +
  'Use PBMP tools for sales, projects, customers, requirements and risks. ' +
  'Product X last-12-month sample: Mumbai ₹18.2 Cr ROI 24% Medium; Delhi ₹15.7 Cr ROI 19% Low; Bangalore ₹13.6 Cr ROI 16% Medium. ' +
  'Never invent rupee figures when a tool can return them. ' +
  'Use file_search for company documents (policy, catalogue, customers, marketing, contract, business case, sales CSV). Cite the filename. ' +
  'Use execute_code for arithmetic, totals, ROI, percentages and tables. Print the result. Never invent a calculated figure.';

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

const FILE_SEARCH_TOOL = {
  name: 'file_search',
  description:
    'Search company knowledge documents and uploaded files. Use for policy, catalogue, customers, marketing, contract, business case, and sales CSV. Do not invent figures found in documents.',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'What to look up in the documents.' },
    },
    required: ['query'],
  },
};

const EXECUTE_CODE_TOOL = {
  name: 'execute_code',
  description:
    'Run Python for calculations, totals, ROI, percentages and tables. Print the answer. Sales CSV path is SALES_CSV; use read_csv(SALES_CSV). Allowed: math, csv, json, statistics, datetime. No files, network or shell.',
  parameters: {
    type: 'object',
    properties: {
      code: { type: 'string', description: 'Python code. Must print() the result.' },
    },
    required: ['code'],
  },
};

const DEFAULT_GEMINI = 'gemini-2.5-flash';
const DEFAULT_AGENT_ID = 'agent_pbmp_executive_analyst';
const DEFAULT_AGENT_INSTRUCTIONS =
  'You are the PBMP Executive Analyst for Grow24 / HBMP. PBMP means Personal & Business Management Platform, not pharmacy.\n' +
  'On every management question:\n' +
  '1. Restate the decision in one sentence.\n' +
  '2. Fetch internal facts first: file_search on company documents, then PBMP tools (get_project, get_customer, get_sales, get_project_actuals, get_project_risks).\n' +
  '3. Use execute_code for arithmetic from retrieved figures. Never invent rupee amounts.\n' +
  '4. Structure with MECE. Close with one recommendation and a sequence (who / where / next).\n' +
  '5. Prefer a table when comparing markets or KPIs.\n' +
  '6. Before any write (create_requirement, update_project_status, create_risk, update_risk), state the payload and wait for human approval.\n' +
  'Product X last-12-month sample: Mumbai ₹18.2 Cr ROI 24% Medium; Delhi ₹15.7 Cr ROI 19% Low; Bangalore ₹13.6 Cr ROI 16% Medium.\n' +
  'Default recommendation unless retrieved data contradicts it: launch Mumbai → Delhi → Bangalore.';

function seedDefaultAgent() {
  const list = readAgents();
  if (list.some((item) => item.id === DEFAULT_AGENT_ID)) return;
  const tools = ['file_search', 'execute_code', ...PBMP_TOOL_DEFS.map((tool) => `${tool.name}_mcp_pbmp`)];
  list.unshift(
    normalizeAgent({
      id: DEFAULT_AGENT_ID,
      _id: DEFAULT_AGENT_ID,
      name: 'PBMP Executive Analyst',
      description: 'Internal facts, then recommendation for Product X markets.',
      instructions: DEFAULT_AGENT_INSTRUCTIONS,
      provider: 'google',
      model: DEFAULT_GEMINI,
      tools,
      category: 'general',
      isPublic: true,
      is_promoted: true,
      conversation_starters: [
        'We are considering launching Product X in three Indian markets. Use our internal sales and cost information, analyse the economics and risks, recommend where we should launch, and give me a management table.',
      ],
      author: 'system',
      authorName: 'HBMP AgentBot',
    }),
  );
  writeAgents(list);
  console.log('[agentbot-stub] seeded PBMP Executive Analyst agent');
}

seedDefaultAgent();
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

function geminiCandidateParts(json) {
  return json?.candidates?.[0]?.content?.parts || [];
}

function geminiText(json) {
  return geminiCandidateParts(json)
    .map((part) => part.text || '')
    .join('')
    .trim();
}

function formatCodeResult(data) {
  if (!data) return '';
  if (data.ok && data.stdout) return data.stdout;
  return data.stderr || data.error || '';
}

async function fallbackCodeReply(text) {
  if (!/\b(add|sum|total|using code|calculate|plus)\b/i.test(text)) return '';
  const nums = (String(text).match(/-?\d+(?:\.\d+)?/g) || [])
    .map(Number)
    .filter((n) => Number.isFinite(n));
  if (nums.length < 2) return '';
  const data = await executePython(`print(${nums.join(' + ')})`);
  return formatCodeResult(data);
}

async function generateGeminiWithPbmp(key, model, userContents, extras = {}) {
  const tools = [...PBMP_TOOL_DEFS, FILE_SEARCH_TOOL, EXECUTE_CODE_TOOL];
  const systemText = [
    PBMP_SYSTEM,
    extras.promptPrefix,
    extras.fileSearchNote,
    extras.codeNote,
  ].filter(Boolean).join('\n\n');
  const extra = {
    systemInstruction: { parts: [{ text: systemText }] },
    tools: [{ functionDeclarations: tools }],
    toolConfig: { functionCallingConfig: { mode: 'AUTO' } },
  };
  if (extras.generationConfig && Object.keys(extras.generationConfig).length) {
    extra.generationConfig = { ...extras.generationConfig };
  }
  let contents = userContents;
  let last = { status: 500, json: null, raw: 'No Gemini model attempted.' };
  const toolNotes = [];
  for (let step = 0; step < 5; step += 1) {
    last = await generateGemini(key, model, contents, extra);
    if (last.model) model = last.model;
    const parts = geminiCandidateParts(last.json);
    const calls = parts.filter((part) => part.functionCall && part.functionCall.name);
    const text = geminiText(last.json);
    if (last.status >= 400) {
      return { ...last, model, toolNotes };
    }
    if (!calls.length) {
      if (text) return { ...last, model, toolNotes };
      if (toolNotes.length) {
        return {
          ...last,
          model,
          toolNotes,
          json: {
            candidates: [{ content: { role: 'model', parts: [{ text: toolNotes.join('\n\n') }] } }],
          },
        };
      }
      if (step === 0) {
        contents = [
          ...contents,
          { role: 'user', parts: [{ text: 'Answer now. If this is arithmetic, call execute_code and print the result.' }] },
        ];
        continue;
      }
      return { ...last, model, toolNotes };
    }
    const responses = [];
    for (const part of calls) {
      const name = part.functionCall.name;
      const args = part.functionCall.args || {};
      let data;
      if (name === 'file_search') {
        data = searchFiles(String(args.query || extras.userQuery || ''), extras.user, { limit: 5, minScore: 2 });
      } else if (name === 'execute_code') {
        data = await executePython(String(args.code || args.python || ''));
        const printed = formatCodeResult(data);
        if (printed) toolNotes.push(printed);
      } else {
        data = await callPbmpTool(name, args);
      }
      responses.push({
        functionResponse: {
          name,
          response: data && typeof data === 'object' ? data : { result: String(data) },
        },
      });
    }
    contents = [...contents, { role: 'model', parts }, { role: 'user', parts: responses }];
  }
  if (toolNotes.length) {
    return {
      ...last,
      model,
      toolNotes,
      json: {
        candidates: [{ content: { role: 'model', parts: [{ text: toolNotes.join('\n\n') }] } }],
      },
    };
  }
  return { ...last, model, toolNotes };
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

function readAgents() {
  try {
    const list = JSON.parse(fs.readFileSync(agentsFile, 'utf8'));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeAgents(list) {
  fs.writeFileSync(agentsFile, JSON.stringify(list, null, 2));
}

function normalizeAgent(raw, user) {
  const now = Date.now();
  const id = raw.id || `agent_${crypto.randomBytes(6).toString('hex')}`;
  const tools = Array.isArray(raw.tools)
    ? raw.tools
        .map((item) => {
          if (typeof item === 'string') return item;
          return item && (item.name || item.pluginKey);
        })
        .filter(Boolean)
    : [];
  const provider =
    typeof raw.provider === 'string'
      ? raw.provider
      : (raw.provider && (raw.provider.value || raw.provider.label)) || 'google';
  return {
    _id: raw._id || id,
    id,
    name: raw.name || 'Untitled Agent',
    description: raw.description || '',
    instructions: raw.instructions || '',
    author: raw.author || (user && user.id) || 'system',
    authorName: raw.authorName || (user && user.name) || 'agentbot',
    created_at: raw.created_at || now,
    updated_at: now,
    avatar: raw.avatar === undefined ? null : raw.avatar,
    tools,
    provider,
    model: raw.model || DEFAULT_GEMINI,
    model_parameters: raw.model_parameters || {},
    conversation_starters: raw.conversation_starters || [],
    tool_resources: raw.tool_resources || {},
    artifacts: raw.artifacts || '',
    category: raw.category || 'general',
    end_after_tools: !!raw.end_after_tools,
    hide_sequential_outputs: !!raw.hide_sequential_outputs,
    recursion_limit: raw.recursion_limit,
    agent_ids: raw.agent_ids || [],
    edges: raw.edges || [],
    support_contact: raw.support_contact,
    isPublic: raw.isPublic !== false,
    is_promoted: !!raw.is_promoted,
    version: raw.version || 1,
    versions: raw.versions || [],
  };
}

function findAgent(id) {
  if (!id) return null;
  return readAgents().find((item) => item.id === id || item._id === id) || null;
}

function listAgentsPayload(list) {
  const data = list || [];
  return {
    object: 'list',
    data,
    first_id: data[0] ? data[0].id : '',
    last_id: data.length ? data[data.length - 1].id : '',
    has_more: false,
  };
}

function agentToolPlugins() {
  const plugins = [
    { name: 'File Search', pluginKey: 'file_search', description: 'Search company documents and uploads.', authenticated: true },
    { name: 'Code Interpreter', pluginKey: 'execute_code', description: 'Run Python for calculations.', authenticated: true },
    { name: 'Web Search', pluginKey: 'web_search', description: 'Search the public web when enabled.', authenticated: true },
  ];
  for (const tool of PBMP_TOOL_DEFS) {
    plugins.push({
      name: tool.name,
      pluginKey: `${tool.name}_mcp_pbmp`,
      description: tool.description,
      authenticated: true,
    });
  }
  return plugins;
}

const PROMPT_CATEGORIES = [
  { label: 'com_ui_idea', value: 'idea' },
  { label: 'com_ui_travel', value: 'travel' },
  { label: 'com_ui_teach_or_explain', value: 'teach_or_explain' },
  { label: 'com_ui_write', value: 'write' },
  { label: 'com_ui_shop', value: 'shop' },
  { label: 'com_ui_code', value: 'code' },
  { label: 'com_ui_misc', value: 'misc' },
  { label: 'com_ui_roleplay', value: 'roleplay' },
  { label: 'com_ui_finance', value: 'finance' },
];

const DEFAULT_PROMPT_TEXT =
  'You are the PBMP Executive Analyst. Answer {{market_question}} using internal Product X facts only.\n\n' +
  'Last 12 months:\n' +
  '- Mumbai: ₹18.2 Cr, ROI 24%, risk Medium\n' +
  '- Delhi: ₹15.7 Cr, ROI 19%, risk Low\n' +
  '- Bangalore: ₹13.6 Cr, ROI 16%, risk Medium\n\n' +
  'Recommend a launch sequence. First launch needs ROI at least 18% or risk Low.';

function readPromptStore() {
  try {
    const store = JSON.parse(fs.readFileSync(promptsFile, 'utf8'));
    return {
      groups: Array.isArray(store.groups) ? store.groups : [],
      prompts: Array.isArray(store.prompts) ? store.prompts : [],
    };
  } catch {
    return { groups: [], prompts: [] };
  }
}

function writePromptStore(store) {
  fs.writeFileSync(promptsFile, JSON.stringify(store, null, 2));
}

function listPromptGroupsPayload(groups) {
  const data = groups || [];
  return {
    promptGroups: data,
    pageNumber: '1',
    pageSize: Math.max(data.length, 10),
    pages: 1,
    has_more: false,
    after: null,
  };
}

function seedDefaultPrompt() {
  const store = readPromptStore();
  if (store.groups.some((item) => item._id === 'prompt_pbmp_launch')) return;
  const now = new Date().toISOString();
  store.groups.unshift({
    _id: 'prompt_pbmp_launch',
    name: 'PBMP Product X launch',
    category: 'finance',
    oneliner: 'Recommend Mumbai, Delhi or Bangalore using sample sales.',
    command: 'pbmp-launch',
    author: 'system',
    authorName: 'HBMP AgentBot',
    productionId: 'promptver_pbmp_launch',
    productionPrompt: { prompt: DEFAULT_PROMPT_TEXT },
    createdAt: now,
    updatedAt: now,
  });
  store.prompts.push({
    _id: 'promptver_pbmp_launch',
    groupId: 'prompt_pbmp_launch',
    author: 'system',
    prompt: DEFAULT_PROMPT_TEXT,
    type: 'text',
    createdAt: now,
    updatedAt: now,
  });
  writePromptStore(store);
  console.log('[agentbot-stub] seeded PBMP Product X launch prompt');
}

seedDefaultPrompt();

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

function filesToGeminiParts(files, options = {}) {
  const allowBinary = options.allowBinary !== false;
  const parts = [];
  const store = readFiles();
  for (const item of files || []) {
    const rec = store[item.file_id] || Object.values(store).find((entry) => entry.filepath === item.filepath);
    if (!rec || !rec.diskPath || !fs.existsSync(rec.diskPath)) continue;
    const mime = rec.type || item.type || 'application/octet-stream';
    const buf = fs.readFileSync(rec.diskPath);
    if (mime.startsWith('text/') || mime === 'application/json' || mime === 'text/csv' || mime === 'text/markdown') {
      parts.push({ text: `\n\n--- File: ${rec.filename} ---\n${buf.toString('utf8').slice(0, 80000)}` });
      continue;
    }
    if (allowBinary && (mime.startsWith('image/') || mime === 'application/pdf')) {
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

const SEARCH_STOP = new Set(
  'a an the and or of for to in on is it we our you your what does say please from with this this that than then how why who whom which are was were be been being not no do did can will would should about into over under'.split(
    ' ',
  ),
);

function isTextSearchable(rec) {
  const type = String(rec.type || '').toLowerCase();
  const name = String(rec.filename || '').toLowerCase();
  if (type.startsWith('text/') || type.includes('json') || type.includes('csv') || type.includes('markdown') || type.includes('xml')) {
    return true;
  }
  return /\.(md|txt|csv|json|xml|html|htm)$/i.test(name);
}

function readFileText(rec) {
  if (!rec?.diskPath || !fs.existsSync(rec.diskPath)) return '';
  const buf = fs.readFileSync(rec.diskPath);
  if (!buf.length) return '';
  const sample = buf.subarray(0, Math.min(buf.length, 800));
  let nul = 0;
  for (const byte of sample) {
    if (byte === 0) nul += 1;
  }
  if (nul > 8) return '';
  return buf.toString('utf8').slice(0, 80000);
}

function tokenizeSearch(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 1 && !SEARCH_STOP.has(word));
}

function chunkText(text, size = 900) {
  const clean = String(text || '').replace(/\r\n/g, '\n').trim();
  if (!clean) return [];
  const parts = [];
  const paras = clean.split(/\n{2,}/);
  let buf = '';
  for (const para of paras) {
    const next = buf ? `${buf}\n\n${para}` : para;
    if (next.length > size && buf) {
      parts.push(buf.trim());
      buf = para;
    } else {
      buf = next;
    }
  }
  if (buf.trim()) parts.push(buf.trim());
  return parts.length ? parts : [clean.slice(0, size)];
}

function scoreSnippet(tokens, phrase, filename, snippet) {
  const hay = `${filename}\n${snippet}`.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (hay.includes(token)) score += 2;
    if (String(filename).toLowerCase().includes(token)) score += 4;
  }
  if (phrase && hay.includes(phrase)) score += 10;
  return score;
}

function searchableFiles(user) {
  return Object.values(readFiles()).filter((item) => {
    if (!isTextSearchable(item)) return false;
    if (item.sample) return true;
    if (!user) return true;
    return item.user === user.id;
  });
}

function searchFiles(query, user, options = {}) {
  const limit = options.limit || 5;
  const minScore = options.minScore || 2;
  const tokens = tokenizeSearch(query);
  const phrase = tokens.join(' ');
  if (!tokens.length) {
    return { ok: true, query, count: 0, hits: [] };
  }
  const ranked = [];
  for (const rec of searchableFiles(user)) {
    const text = readFileText(rec);
    if (!text) continue;
    for (const snippet of chunkText(text)) {
      const score = scoreSnippet(tokens, phrase, rec.filename, snippet);
      if (score < minScore) continue;
      ranked.push({
        file_id: rec.file_id,
        filename: rec.filename,
        snippet: snippet.slice(0, 1200),
        score,
      });
    }
  }
  ranked.sort((a, b) => b.score - a.score || a.filename.localeCompare(b.filename));
  const perFile = new Map();
  const hits = [];
  for (const item of ranked) {
    const already = perFile.get(item.filename) || 0;
    if (already >= 2) continue;
    perFile.set(item.filename, already + 1);
    hits.push(item);
    if (hits.length >= limit) break;
  }
  return { ok: true, query, count: hits.length, hits };
}

function formatSearchHits(result) {
  if (!result?.hits?.length) return '';
  const blocks = result.hits.map(
    (hit, index) =>
      `### ${index + 1}. ${hit.filename}\n${hit.snippet}`,
  );
  return (
    'Retrieved from File Search. Cite the filename. Do not invent figures missing from these snippets.\n\n' +
    blocks.join('\n\n')
  );
}

function salesCsvPath() {
  const dir = knowledgeDir();
  const candidate = dir ? path.join(dir, '03-sales-product-x.csv') : '';
  return candidate && fs.existsSync(candidate) ? candidate : '';
}

function executePython(code) {
  return new Promise((resolve) => {
    const raw = String(code || '');
    if (!raw.trim()) {
      resolve({ ok: false, error: 'No code provided.' });
      return;
    }
    if (raw.length > 20000) {
      resolve({ ok: false, error: 'Code is too long (20k character limit).' });
      return;
    }
    const allowedDirs = [filesDir, knowledgeDir(), dataDir].filter(Boolean);
    const wrapper = `
import ast, csv, json, math, statistics, datetime, decimal, collections, itertools, os, sys
SALES_CSV = ${JSON.stringify(salesCsvPath())}
ALLOWED_DIRS = ${JSON.stringify(allowedDirs)}

def _safe_path(p):
    ap = os.path.realpath(p)
    for d in ALLOWED_DIRS:
        rd = os.path.realpath(d)
        if ap == rd or ap.startswith(rd + os.sep):
            return ap
    raise SystemExit('Path not allowed')

def read_csv(p=None):
    path = _safe_path(p or SALES_CSV)
    with open(path, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))

USER_CODE = ${JSON.stringify(raw)}
ALLOWED = {'math','csv','json','statistics','datetime','decimal','collections','itertools'}

class Guard(ast.NodeVisitor):
    def visit_Import(self, node):
        for alias in node.names:
            if alias.name.split('.')[0] not in ALLOWED:
                raise SystemExit('Import not allowed: ' + alias.name)
    def visit_ImportFrom(self, node):
        root = (node.module or '').split('.')[0]
        if root and root not in ALLOWED:
            raise SystemExit('Import not allowed: ' + root)
    def visit_Call(self, node):
        if isinstance(node.func, ast.Name) and node.func.id in ('eval','exec','compile','__import__','open','input'):
            raise SystemExit(node.func.id + ' is not allowed. Use read_csv(SALES_CSV) for sales data.')
        self.generic_visit(node)

tree = ast.parse(USER_CODE, mode='exec')
Guard().visit(tree)
exec(compile(tree, '<user>', 'exec'), {
    '__builtins__': {
        'abs': abs, 'min': min, 'max': max, 'sum': sum, 'round': round, 'len': len,
        'range': range, 'enumerate': enumerate, 'zip': zip, 'list': list, 'dict': dict,
        'tuple': tuple, 'set': set, 'print': print, 'sorted': sorted, 'map': map,
        'filter': filter, 'float': float, 'int': int, 'str': str, 'bool': bool,
        'True': True, 'False': False, 'None': None, 'pow': pow, 'divmod': divmod,
        'isinstance': isinstance, 'type': type, 'repr': repr, 'format': format,
        'all': all, 'any': any, 'reversed': reversed,
    },
    'math': math, 'csv': csv, 'json': json, 'statistics': statistics,
    'datetime': datetime, 'decimal': decimal, 'collections': collections,
    'itertools': itertools, 'SALES_CSV': SALES_CSV, 'read_csv': read_csv,
})
`;
    const tmp = path.join(dataDir, `code-${crypto.randomUUID()}.py`);
    try {
      fs.writeFileSync(tmp, wrapper);
    } catch (error) {
      resolve({ ok: false, error: error.message });
      return;
    }
    const child = spawn('python3', ['-I', tmp], {
      cwd: dataDir,
      env: { PATH: process.env.PATH || '/usr/bin:/bin', LANG: 'C.UTF-8' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
      if (stdout.length > 16000) child.kill('SIGKILL');
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    const timer = setTimeout(() => child.kill('SIGKILL'), 8000);
    child.on('error', (error) => {
      clearTimeout(timer);
      try { fs.unlinkSync(tmp); } catch { /* ignore */ }
      resolve({ ok: false, error: error.message || 'python3 is not available.' });
    });
    child.on('close', (exitCode) => {
      clearTimeout(timer);
      try { fs.unlinkSync(tmp); } catch { /* ignore */ }
      resolve({
        ok: exitCode === 0,
        stdout: stdout.slice(0, 12000).trim(),
        stderr: stderr.slice(0, 2500).trim(),
        exitCode,
      });
    });
  });
}

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

function isPoisonHistory(item) {
  if (!item) return true;
  if (item.error) return true;
  const text = String(item.text || '');
  if (!text && !(item.files && item.files.length)) return true;
  if (/Something went wrong|finishReason|"candidates"\s*:/i.test(text)) return true;
  return false;
}

function toGeminiContents(history, latestText, latestFiles = []) {
  const contents = [];
  for (const item of history) {
    if (isPoisonHistory(item)) continue;
    const part = String(item.text || '').trim();
    const fileParts = filesToGeminiParts(item.files, { allowBinary: false });
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
  latestParts.push(...filesToGeminiParts(latestFiles, { allowBinary: true }));
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

  if (method === 'GET' && url === '/api/files/search') {
    const user = userFromReq(req) || (sameSiteRequest(req) ? guestUser() : null);
    const query = String(qs.get('q') || qs.get('query') || '').trim();
    send(res, 200, searchFiles(query, user, { limit: 8, minScore: 2 }));
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

  if (method === 'GET' && /\/api\/agents\/tools\/[^/]+\/auth$/.test(url)) {
    send(res, 200, { authenticated: true, message: 'system_defined' });
    return;
  }

  if (method === 'GET' && url === '/api/agents/tools/calls') {
    send(res, 200, []);
    return;
  }

  if (method === 'POST' && /\/api\/agents\/tools\/execute_code\/call$/.test(url)) {
    const body = await readBody(req);
    const result = await executePython(String(body.code || ''));
    send(res, 200, { result: result.ok ? (result.stdout || 'Code ran with no output.') : (result.stderr || result.error || 'Code failed.') });
    return;
  }

  if (method === 'GET' && url === '/api/agents/tools') {
    send(res, 200, agentToolPlugins());
    return;
  }

  if (method === 'GET' && url === '/api/agents/categories') {
    const list = readAgents();
    const counts = {};
    for (const agent of list) {
      const key = agent.category || 'general';
      counts[key] = (counts[key] || 0) + 1;
    }
    const categories = Object.keys(counts).map((value) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
      count: counts[value],
      description: '',
    }));
    if (list.some((item) => item.is_promoted)) {
      categories.unshift({
        value: 'promoted',
        label: 'Promoted',
        count: list.filter((item) => item.is_promoted).length,
        description: 'Recommended agents',
      });
    }
    categories.push({ value: 'all', label: 'All', count: list.length, description: 'All available agents' });
    send(res, 200, categories);
    return;
  }

  if (method === 'GET' && url === '/api/agents/actions') {
    send(res, 200, []);
    return;
  }

  if (method === 'GET' && url === '/api/agents') {
    let list = readAgents();
    const search = String(qs.get('search') || '').trim().toLowerCase();
    const category = String(qs.get('category') || '').trim();
    const promoted = qs.get('promoted');
    if (category && category !== 'all') {
      if (category === 'promoted') list = list.filter((item) => item.is_promoted);
      else list = list.filter((item) => (item.category || 'general') === category);
    }
    if (promoted === '1') list = list.filter((item) => item.is_promoted);
    if (promoted === '0') list = list.filter((item) => !item.is_promoted);
    if (search) {
      list = list.filter((item) =>
        `${item.name || ''} ${item.description || ''}`.toLowerCase().includes(search),
      );
    }
    const limit = Math.max(1, Number(qs.get('limit') || 50) || 50);
    send(res, 200, listAgentsPayload(list.slice(0, limit)));
    return;
  }

  if (method === 'POST' && url === '/api/agents') {
    const user = userFromReq(req) || (sameSiteRequest(req) ? guestUser() : null);
    if (!user) {
      send(res, 401, { error: 'Unauthorized. Please sign in again.' });
      return;
    }
    const body = await readBody(req);
    const agent = normalizeAgent(body, user);
    const list = readAgents();
    list.unshift(agent);
    writeAgents(list);
    send(res, 201, agent);
    return;
  }

  const agentExpanded = url.match(/^\/api\/agents\/([^/]+)\/expanded$/);
  if (method === 'GET' && agentExpanded) {
    const agent = findAgent(decodeURIComponent(agentExpanded[1]));
    if (!agent) {
      send(res, 404, { error: 'Agent not found' });
      return;
    }
    send(res, 200, agent);
    return;
  }

  if (method === 'POST' && /^\/api\/agents\/[^/]+\/duplicate$/.test(url)) {
    const user = userFromReq(req) || (sameSiteRequest(req) ? guestUser() : null);
    const id = decodeURIComponent(url.split('/')[3]);
    const source = findAgent(id);
    if (!source) {
      send(res, 404, { error: 'Agent not found' });
      return;
    }
    const copy = normalizeAgent(
      {
        ...source,
        id: undefined,
        _id: undefined,
        name: `${source.name || 'Agent'} (copy)`,
        is_promoted: false,
      },
      user,
    );
    const list = readAgents();
    list.unshift(copy);
    writeAgents(list);
    send(res, 201, { agent: copy, actions: [] });
    return;
  }

  if (method === 'POST' && /^\/api\/agents\/[^/]+\/revert$/.test(url)) {
    const id = decodeURIComponent(url.split('/')[3]);
    const agent = findAgent(id);
    if (!agent) {
      send(res, 404, { error: 'Agent not found' });
      return;
    }
    send(res, 200, agent);
    return;
  }

  if (method === 'POST' && /\/api\/files\/images\/agents\/[^/]+\/avatar/.test(url)) {
    const id = decodeURIComponent(url.split('/')[5]);
    const agent = findAgent(id);
    if (!agent) {
      send(res, 404, { error: 'Agent not found' });
      return;
    }
    send(res, 200, agent);
    return;
  }

  if (method === 'GET' && /^\/api\/agents\/[^/]+$/.test(url) && !url.startsWith('/api/agents/chat')) {
    const id = decodeURIComponent(url.slice('/api/agents/'.length));
    const reserved = new Set(['tools', 'categories', 'actions', 'chat', 'marketplace']);
    if (reserved.has(id)) {
      send(res, 200, id === 'actions' || id === 'tools' ? [] : emptyList);
      return;
    }
    const agent = findAgent(id);
    if (!agent) {
      send(res, 404, { error: 'Agent not found' });
      return;
    }
    send(res, 200, agent);
    return;
  }

  if (method === 'PATCH' && /^\/api\/agents\/[^/]+$/.test(url)) {
    const user = userFromReq(req) || (sameSiteRequest(req) ? guestUser() : null);
    const id = decodeURIComponent(url.slice('/api/agents/'.length));
    const body = await readBody(req);
    const list = readAgents();
    const index = list.findIndex((item) => item.id === id || item._id === id);
    if (index < 0) {
      send(res, 404, { error: 'Agent not found' });
      return;
    }
    const merged = normalizeAgent({ ...list[index], ...body, id: list[index].id, _id: list[index]._id }, user);
    merged.created_at = list[index].created_at;
    merged.author = list[index].author;
    merged.version = (list[index].version || 1) + 1;
    list[index] = merged;
    writeAgents(list);
    send(res, 200, merged);
    return;
  }

  if (method === 'DELETE' && /^\/api\/agents\/[^/]+$/.test(url)) {
    const id = decodeURIComponent(url.slice('/api/agents/'.length));
    const previous = readAgents();
    const next = previous.filter((item) => item.id !== id && item._id !== id);
    writeAgents(next);
    send(res, 200, { acknowledged: true, deletedCount: previous.length - next.length });
    return;
  }

  if (method === 'GET' && /\/api\/permissions\/[^/]+\/[^/]+\/effective$/.test(url)) {
    send(res, 200, { permissionBits: 15 });
    return;
  }

  if (method === 'GET' && /\/api\/permissions\/[^/]+\/roles$/.test(url)) {
    send(res, 200, [
      { accessRoleId: 'agent_viewer', name: 'Viewer', resourceType: 'agent', permBits: 1 },
      { accessRoleId: 'agent_editor', name: 'Editor', resourceType: 'agent', permBits: 3 },
      { accessRoleId: 'agent_owner', name: 'Owner', resourceType: 'agent', permBits: 15 },
    ]);
    return;
  }

  if (method === 'GET' && /\/api\/permissions\/[^/]+\/[^/]+$/.test(url)) {
    const parts = url.split('/');
    send(res, 200, { resourceType: parts[3], resourceId: parts[4], principals: [] });
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
    const endpoint = String(body.endpoint || url.split('/').pop() || 'google');
    const earlyOptions = body.endpointOption || body.modelOptions || body;
    const chatAgentId = String(
      body.agent_id || earlyOptions.agent_id || (earlyOptions.agent && earlyOptions.agent.id) || '',
    ).trim();
    const chatAgent = findAgent(chatAgentId);
    let model = resolveGeminiModel(
      (chatAgent && chatAgent.model) || body.model || body.modelOptions?.model || DEFAULT_GEMINI,
    );
    if (/^agent_/i.test(String(body.model || ''))) {
      model = resolveGeminiModel((chatAgent && chatAgent.model) || DEFAULT_GEMINI);
    }
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
        agent_id: chatAgentId || undefined,
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
      const savedAgent = chatAgent || findAgent(String(body.agent_id || options.agent_id || (options.agent && options.agent.id) || '').trim());
      const agentInstructions = String(
        (savedAgent && savedAgent.instructions) ||
          (options.agent && options.agent.instructions) ||
          '',
      ).trim();
      const promptPrefix = [agentInstructions, String(options.promptPrefix || body.promptPrefix || '').trim()]
        .filter(Boolean)
        .join('\n\n');
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
      const ephemeral = body.ephemeralAgent || options.ephemeralAgent || {};
      const agentTools = (savedAgent && savedAgent.tools) || [];
      const fileSearchOn = ephemeral.file_search === true || agentTools.includes('file_search');
      const codeOn = ephemeral.execute_code !== false || agentTools.includes('execute_code');
      const retrieved = searchFiles(text, user, {
        limit: fileSearchOn ? 5 : 3,
        minScore: fileSearchOn ? 2 : 6,
      });
      const fileSearchNote = formatSearchHits(retrieved);
      const codeNote = codeOn
        ? 'Code Interpreter is ON. For any arithmetic, total, ROI, percentage or table of numbers, call execute_code and print the result. Do not guess the calculated figure.'
        : '';
      const result = await generateGeminiWithPbmp(key, model, toGeminiContents(history, text, attachedFiles), {
        promptPrefix,
        generationConfig,
        fileSearchNote,
        codeNote,
        user,
        userQuery: text,
      });
      if (result.model) model = result.model;
      let reply = geminiText(result.json) || (result.toolNotes || []).join('\n\n').trim();
      if (!reply && codeOn) {
        reply = await fallbackCodeReply(text);
      }
      if (result.status >= 400 && !reply) {
        finish(
          result.json?.error?.message || 'Gemini request failed. Open New Chat and send the message again.',
          true,
        );
        return;
      }
      if (!reply) {
        finish(
          'No answer came back. Click New Chat (pencil icon) and send the same message in a fresh chat — do not reuse a thread that has a large PDF attached.',
          true,
        );
        return;
      }
      finish(reply, false);
    } catch (error) {
      finish(error.message || 'Failed to reach Gemini.', true);
    }
    return;
  }

  if (method === 'GET' && url.startsWith('/api/roles/')) {
    const raw = decodeURIComponent((url.split('/').pop() || '').split('?')[0]);
    const name = raw.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';
    send(res, 200, { name, permissions: ROLE_PERMISSIONS });
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

  if (method === 'GET' && url === '/api/categories') {
    send(res, 200, PROMPT_CATEGORIES);
    return;
  }

  if (method === 'GET' && url === '/api/prompts/all') {
    send(res, 200, readPromptStore().groups);
    return;
  }

  if (method === 'GET' && /^\/api\/prompts\/groups\/[^/]+$/.test(url)) {
    const id = decodeURIComponent(url.slice('/api/prompts/groups/'.length));
    const group = readPromptStore().groups.find((item) => item._id === id);
    if (!group) {
      send(res, 404, { message: 'Prompt group not found' });
      return;
    }
    send(res, 200, group);
    return;
  }

  if (method === 'GET' && url === '/api/prompts/groups') {
    let groups = readPromptStore().groups;
    const category = String(qs.get('category') || '').trim();
    const name = String(qs.get('name') || '').trim().toLowerCase();
    if (category) groups = groups.filter((item) => (item.category || '') === category);
    if (name) groups = groups.filter((item) => String(item.name || '').toLowerCase().includes(name));
    send(res, 200, listPromptGroupsPayload(groups));
    return;
  }

  if (method === 'GET' && url === '/api/prompts') {
    const groupId = String(qs.get('groupId') || '').trim();
    const prompts = readPromptStore().prompts.filter((item) => !groupId || item.groupId === groupId);
    send(res, 200, prompts);
    return;
  }

  if (method === 'GET' && /^\/api\/prompts\/[^/]+$/.test(url)) {
    const id = decodeURIComponent(url.slice('/api/prompts/'.length));
    const reserved = new Set(['groups', 'all', 'random']);
    if (reserved.has(id)) {
      send(res, 200, []);
      return;
    }
    const prompt = readPromptStore().prompts.find((item) => item._id === id);
    if (!prompt) {
      send(res, 404, { message: 'Prompt not found' });
      return;
    }
    send(res, 200, { prompt });
    return;
  }

  if (method === 'POST' && /^\/api\/prompts\/groups\/[^/]+\/prompts$/.test(url)) {
    const user = userFromReq(req) || (sameSiteRequest(req) ? guestUser() : null);
    const groupId = decodeURIComponent(url.split('/')[4]);
    const body = await readBody(req);
    const store = readPromptStore();
    const group = store.groups.find((item) => item._id === groupId);
    if (!group) {
      send(res, 404, { error: 'Prompt group not found' });
      return;
    }
    const now = new Date().toISOString();
    const prompt = {
      _id: `promptver_${crypto.randomBytes(6).toString('hex')}`,
      groupId,
      author: (user && user.id) || 'system',
      prompt: String((body.prompt && body.prompt.prompt) || body.prompt || ''),
      type: (body.prompt && body.prompt.type) || 'text',
      createdAt: now,
      updatedAt: now,
    };
    store.prompts.push(prompt);
    group.productionId = prompt._id;
    group.productionPrompt = { prompt: prompt.prompt };
    group.updatedAt = now;
    writePromptStore(store);
    send(res, 200, { prompt, group });
    return;
  }

  if (method === 'POST' && url === '/api/prompts') {
    const user = userFromReq(req) || (sameSiteRequest(req) ? guestUser() : null);
    const body = await readBody(req);
    if (!body.prompt || !body.group || !body.group.name) {
      send(res, 400, { error: 'Prompt and group name are required' });
      return;
    }
    const now = new Date().toISOString();
    const groupId = `prompt_${crypto.randomBytes(6).toString('hex')}`;
    const promptId = `promptver_${crypto.randomBytes(6).toString('hex')}`;
    const text = String(body.prompt.prompt || '');
    const group = {
      _id: groupId,
      name: body.group.name,
      category: body.group.category || '',
      oneliner: body.group.oneliner || '',
      command: body.group.command || '',
      author: (user && user.id) || 'system',
      authorName: (user && user.name) || 'agentbot',
      productionId: promptId,
      productionPrompt: { prompt: text },
      createdAt: now,
      updatedAt: now,
    };
    const prompt = {
      _id: promptId,
      groupId,
      author: group.author,
      prompt: text,
      type: body.prompt.type || 'text',
      createdAt: now,
      updatedAt: now,
    };
    const store = readPromptStore();
    store.groups.unshift(group);
    store.prompts.push(prompt);
    writePromptStore(store);
    send(res, 200, { prompt, group });
    return;
  }

  if (method === 'PATCH' && /^\/api\/prompts\/groups\/[^/]+$/.test(url)) {
    const id = decodeURIComponent(url.slice('/api/prompts/groups/'.length));
    const body = await readBody(req);
    const store = readPromptStore();
    const group = store.groups.find((item) => item._id === id);
    if (!group) {
      send(res, 404, { message: 'Prompt group not found' });
      return;
    }
    Object.assign(group, body, { _id: group._id, updatedAt: new Date().toISOString() });
    writePromptStore(store);
    send(res, 200, group);
    return;
  }

  if (method === 'DELETE' && /^\/api\/prompts\/groups\/[^/]+$/.test(url)) {
    const id = decodeURIComponent(url.slice('/api/prompts/groups/'.length));
    const store = readPromptStore();
    store.groups = store.groups.filter((item) => item._id !== id);
    store.prompts = store.prompts.filter((item) => item.groupId !== id);
    writePromptStore(store);
    send(res, 200, { acknowledged: true });
    return;
  }

  if (method === 'DELETE' && /^\/api\/prompts\/[^/]+$/.test(url)) {
    const id = decodeURIComponent(url.slice('/api/prompts/'.length));
    const store = readPromptStore();
    store.prompts = store.prompts.filter((item) => item._id !== id);
    writePromptStore(store);
    send(res, 200, { acknowledged: true });
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

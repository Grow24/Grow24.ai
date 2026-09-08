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
const zlib = require('zlib');
const { spawn, execFileSync } = require('child_process');

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
const tagsFile = path.join(dataDir, 'agentbot-tags.json');
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
  writeJsonAtomic(usersFile, users);
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
  return ensureGuestUser();
}

function writeJsonAtomic(file, value) {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  fs.renameSync(tmp, file);
}

function knownUserIds() {
  return new Set(readUsers().map((item) => item.id));
}

function claimOwnedRecords(user, readFn, writeFn) {
  if (!user) return;
  const list = readFn();
  let changed = false;
  for (const item of list) {
    if (!item.user || item.user === 'local-web') {
      item.user = user.id;
      changed = true;
    }
  }
  if (changed) writeFn(list);
}

function recountTags(user) {
  const store = readConvos();
  const list = readTags();
  let changed = false;
  for (const item of list) {
    if (user && item.user && item.user !== user.id && item.user !== 'local-web') continue;
    const count = Object.values(store.conversations).filter((convo) => {
      if (user && !conversationBelongsTo(convo, user)) return false;
      return Array.isArray(convo.tags) && convo.tags.includes(item.tag);
    }).length;
    if (item.count !== count) {
      item.count = count;
      changed = true;
    }
  }
  if (changed) writeTags(list);
}

function conversationBelongsTo(item, user) {
  if (!item || !user) return false;
  if (item.user === user.id) return true;
  if (item.email && user.email && item.email === user.email) return true;
  if (!item.user || item.user === 'local-web') return true;
  return false;
}

function claimConversations(user) {
  if (!user) return;
  const store = readConvos();
  const known = knownUserIds();
  let changed = false;
  for (const item of Object.values(store.conversations)) {
    const orphan = item.user && item.user !== 'local-web' && !known.has(item.user);
    if (conversationBelongsTo(item, user) || orphan) {
      if (item.user !== user.id || item.email !== user.email) {
        item.user = user.id;
        item.email = user.email;
        changed = true;
      }
    }
  }
  if (changed) writeConvos(store);
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
    pbmp: { startup: true, chatMenu: true, isOAuth: false, customUserVars: {} },
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
  google: { userProvide: false, order: 1, type: 'google' },
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
  WEB_SEARCH: { USE: false },
  PEOPLE_PICKER: { VIEW_USERS: true, VIEW_GROUPS: true, VIEW_ROLES: true },
  MARKETPLACE: { USE: true },
  FILE_SEARCH: { USE: true },
  FILE_CITATIONS: { USE: true },
};

const MCP_URL = process.env.PBMP_MCP_URL || 'http://127.0.0.1:5202';
const PBMP_SYSTEM =
  'You are the PBMP assistant for Grow24 / HBMP. PBMP means Personal & Business Management Platform, not pharmacy benefit management. ' +
  'Use PBMP tools for sales, projects, customers, requirements and risks. Call get_sales, get_project, get_customer, get_project_actuals, get_project_risks before quoting rupees. ' +
  'If PBMP INTERNAL facts are in this prompt, copy those rupee figures exactly. Do not invent different numbers. ' +
  'Product X last-12-month sample: Mumbai ₹18.2 Cr ROI 24% Medium; Delhi ₹15.7 Cr ROI 19% Low; Bangalore ₹13.6 Cr ROI 16% Medium. ' +
  'Use file_search for company documents (policy, catalogue, customers, marketing, contract, business case, sales CSV) and for files the user just uploaded. Cite the filename. ' +
  'If File Search snippets are in this prompt, use those document facts and cite the filename (for example 08-business-policy.md, 04-customers.md). ' +
  'If the user attached a file, its content is in the message. Read it and answer. Never say you cannot access, open, or interpret attached files. ' +
  'Use execute_code for arithmetic, totals, ROI, percentages and tables. Print the result. Never invent a calculated figure. ' +
  'When the user asks for a dashboard, canvas, chart, mermaid, image, video or management table, emit LibreChat artifact blocks after a short intro. ' +
  'Use this form exactly:\n:::artifact{identifier="id" type="text/html" title="Title"}\nHTML here\n:::\n' +
  'Other types: text/markdown (rich brief), application/vnd.mermaid (flowchart), image/svg+xml (diagram), application/vnd.react (interactive UI). ' +
  'Never say you cannot render a canvas. The right-side Artifacts panel displays these blocks.';

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

const PBMP_STORE = {
  projects: [
    {
      name: 'Product X Market Entry',
      status: 'planning',
      geography: ['Mumbai', 'Delhi', 'Bangalore'],
      summary: 'Proposed launch of Product X in three Indian metro markets.',
      planRevenueCr: 50,
      planRoiPct: 22,
    },
    {
      name: 'Project Alpha',
      status: 'in_progress',
      geography: ['India'],
      summary: 'Existing delivery programme used for actuals-vs-plan review.',
      planRevenueCr: 12,
      planRoiPct: 18,
      scheduleVariancePct: -18,
      costVariancePct: 9,
      benefits: 'on_plan',
    },
  ],
  customers: [
    { name: 'Tata Motors', segment: 'Enterprise', region: 'Mumbai', status: 'active' },
    { name: 'Delhi Metro Corp', segment: 'Public', region: 'Delhi', status: 'active' },
    { name: 'Bengaluru Tech Parks', segment: 'Enterprise', region: 'Bangalore', status: 'prospect' },
  ],
  sales: [
    { product: 'Product X', geography: 'Mumbai', period: 'last_12_months', revenueCr: 18.2, roiPct: 24, risk: 'Medium', units: 410 },
    { product: 'Product X', geography: 'Delhi', period: 'last_12_months', revenueCr: 15.7, roiPct: 19, risk: 'Low', units: 355 },
    { product: 'Product X', geography: 'Bangalore', period: 'last_12_months', revenueCr: 13.6, roiPct: 16, risk: 'Medium', units: 298 },
  ],
  actuals: {
    'Project Alpha': {
      planCostCr: 8.4,
      actualCostCr: 9.16,
      planScheduleMonths: 14,
      elapsedMonths: 16.5,
      revenueRecognizedCr: 6.1,
    },
    'Product X Market Entry': {
      planCostCr: 22,
      actualCostCr: 4.1,
      planScheduleMonths: 18,
      elapsedMonths: 3,
      revenueRecognizedCr: 0,
    },
  },
  requirements: [],
  risks: [
    { id: 'R-1', project: 'Project Alpha', title: 'Vendor delay', severity: 'High', status: 'open' },
    { id: 'R-2', project: 'Project Alpha', title: 'Cost escalation', severity: 'Medium', status: 'open' },
    { id: 'R-3', project: 'Project Alpha', title: 'Resource shortage', severity: 'Medium', status: 'open' },
  ],
};
let pbmpReqSeq = 1;
let pbmpRiskSeq = 4;

function normPbmp(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function pbmpToolName(name) {
  return String(name || '')
    .replace(/_mcp_pbmp$/i, '')
    .replace(/^mcp_pbmp_/i, '')
    .trim();
}

function toolArgs(raw) {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return raw;
}

function findPbmpProject(name) {
  const q = normPbmp(name);
  if (!q) return PBMP_STORE.projects[0];
  return (
    PBMP_STORE.projects.find((item) => normPbmp(item.name).includes(q) || q.includes(normPbmp(item.name))) ||
    (/product x|market entry|launch/i.test(name || '') ? PBMP_STORE.projects[0] : null) ||
    (/alpha/i.test(name || '') ? PBMP_STORE.projects[1] : null)
  );
}

function findPbmpCustomer(name) {
  const q = normPbmp(name);
  if (!q) return null;
  return PBMP_STORE.customers.find(
    (item) => normPbmp(item.name).includes(q) || q.includes(normPbmp(item.name).split(' ')[0]),
  );
}

function findPbmpSales(args) {
  const product = normPbmp(args.product || args.name || args.query || 'product x');
  const geography = normPbmp(args.geography || args.city || args.market || '');
  const rows = PBMP_STORE.sales.filter((row) => {
    const rowProduct = normPbmp(row.product);
    const rowGeo = normPbmp(row.geography);
    const productMatch =
      !product || product.includes(rowProduct) || rowProduct.includes(product) || product.includes('product x');
    const geoMatch = !geography || rowGeo.includes(geography) || geography.includes(rowGeo);
    return productMatch && geoMatch;
  });
  if (rows.length) return rows;
  return PBMP_STORE.sales.filter((row) => row.product === 'Product X');
}

function runPbmpToolLocal(name, args = {}) {
  const tool = pbmpToolName(name);
  const a = toolArgs(args);
  switch (tool) {
    case 'get_project': {
      const project = findPbmpProject(a.project_name || a.project || a.name);
      return project ? { ok: true, data: project } : { ok: false, error: `Project not found: ${a.project_name || a.project}` };
    }
    case 'get_customer': {
      const customer = findPbmpCustomer(a.customer_name || a.customer || a.name);
      return customer ? { ok: true, data: customer } : { ok: false, error: `Customer not found: ${a.customer_name || a.customer}` };
    }
    case 'get_sales':
      return { ok: true, data: findPbmpSales(a) };
    case 'create_requirement': {
      const item = {
        id: `REQ-${String(pbmpReqSeq++).padStart(3, '0')}`,
        description: a.description || '',
        status: 'open',
        createdAt: new Date().toISOString(),
      };
      PBMP_STORE.requirements.push(item);
      return { ok: true, data: item };
    }
    case 'update_project_status': {
      const project = findPbmpProject(a.project || a.project_name);
      if (!project) return { ok: false, error: `Project not found: ${a.project}` };
      project.status = a.status;
      project.updatedAt = new Date().toISOString();
      return { ok: true, data: project };
    }
    case 'get_project_actuals': {
      const project = findPbmpProject(a.project_name || a.project);
      if (!project) return { ok: false, error: `Project not found: ${a.project_name}` };
      return { ok: true, data: { project: project.name, ...(PBMP_STORE.actuals[project.name] || {}) } };
    }
    case 'get_project_risks': {
      const project = findPbmpProject(a.project_name || a.project);
      if (!project) return { ok: true, data: [] };
      return { ok: true, data: PBMP_STORE.risks.filter((item) => item.project === project.name) };
    }
    case 'create_risk': {
      const project = findPbmpProject(a.project || a.project_name);
      if (!project) return { ok: false, error: `Project not found: ${a.project}` };
      const item = {
        id: `R-${pbmpRiskSeq++}`,
        project: project.name,
        title: a.title,
        severity: a.severity || 'Medium',
        status: 'open',
        createdAt: new Date().toISOString(),
      };
      PBMP_STORE.risks.push(item);
      return { ok: true, data: item };
    }
    case 'update_risk': {
      const item = PBMP_STORE.risks.find((risk) => risk.id === a.id);
      if (!item) return { ok: false, error: `Risk not found: ${a.id}` };
      if (a.status) item.status = a.status;
      if (a.title) item.title = a.title;
      if (a.severity) item.severity = a.severity;
      item.updatedAt = new Date().toISOString();
      return { ok: true, data: item };
    }
    default:
      return { ok: false, error: `Unknown tool: ${tool}` };
  }
}

function formatPbmpHits(name, result) {
  if (!result || result.ok === false) return '';
  const data = result.data;
  if (name === 'get_sales' && Array.isArray(data) && data.length) {
    const lines = data.map(
      (row) =>
        `- ${row.geography}: ₹${row.revenueCr} Cr, ROI ${row.roiPct}%, risk ${row.risk}, units ${row.units} (${row.period})`,
    );
    return (
      'PBMP get_sales INTERNAL facts. Use these rupee figures. Do not invent different numbers.\n' +
      lines.join('\n')
    );
  }
  return `PBMP ${name} INTERNAL facts: ${JSON.stringify(data)}`;
}

function prefetchPbmp(text) {
  const q = String(text || '');
  const notes = [];
  if (/product\s*x|sales|mumbai|delhi|bangalore|launch|roi|market|last 12|last twelve/i.test(q)) {
    notes.push(formatPbmpHits('get_sales', runPbmpToolLocal('get_sales', { product: 'Product X', period: 'last_12_months' })));
  }
  if (/tata|customer/i.test(q)) {
    notes.push(formatPbmpHits('get_customer', runPbmpToolLocal('get_customer', { customer_name: 'Tata Motors' })));
  }
  if (/delhi metro/i.test(q)) {
    notes.push(formatPbmpHits('get_customer', runPbmpToolLocal('get_customer', { customer_name: 'Delhi Metro' })));
  }
  if (/project alpha|actuals|variance|vendor delay/i.test(q)) {
    notes.push(formatPbmpHits('get_project_actuals', runPbmpToolLocal('get_project_actuals', { project_name: 'Project Alpha' })));
    notes.push(formatPbmpHits('get_project_risks', runPbmpToolLocal('get_project_risks', { project_name: 'Project Alpha' })));
  }
  if (/market entry|product x.*project|get_project/i.test(q)) {
    notes.push(formatPbmpHits('get_project', runPbmpToolLocal('get_project', { project_name: 'Product X Market Entry' })));
  }
  return notes.filter(Boolean).join('\n\n');
}

const FILE_SEARCH_TOOL = {
  name: 'file_search',
  description:
    'Search company knowledge documents and uploaded files (PDF, CSV, notes). Use for policy, catalogue, customers, marketing, contract, business case, sales CSV, and the user\'s attached invoice or document. Do not invent figures found in documents.',
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

function sampleFileIds() {
  return Object.values(readFiles())
    .filter((item) => item.sample)
    .sort((a, b) => String(a.filename).localeCompare(String(b.filename)))
    .map((item) => item.file_id);
}

function seedDefaultAgent() {
  const tools = ['file_search', 'execute_code', ...PBMP_TOOL_DEFS.map((tool) => `${tool.name}_mcp_pbmp`)];
  const fileIds = sampleFileIds();
  const seeded = normalizeAgent({
    id: DEFAULT_AGENT_ID,
    _id: DEFAULT_AGENT_ID,
    name: 'PBMP Executive Analyst',
    description: 'Internal facts, then recommendation for Product X markets.',
    instructions: DEFAULT_AGENT_INSTRUCTIONS,
    provider: 'google',
    model: DEFAULT_GEMINI,
    tools,
    tool_resources: {
      file_search: { file_ids: fileIds },
    },
    artifacts: 'default',
    category: 'general',
    isPublic: true,
    is_promoted: true,
    conversation_starters: [
      'We are considering launching Product X in three Indian markets. Use our internal sales and cost information, analyse the economics and risks, recommend where we should launch, and give me a management table.',
    ],
    author: 'system',
    authorName: 'HBMP AgentBot',
  });
  const list = readAgents();
  const index = list.findIndex((item) => item.id === DEFAULT_AGENT_ID || item._id === DEFAULT_AGENT_ID);
  if (index >= 0) {
    list[index] = {
      ...list[index],
      ...seeded,
      id: DEFAULT_AGENT_ID,
      _id: DEFAULT_AGENT_ID,
      author: list[index].author || 'system',
      created_at: list[index].created_at || seeded.created_at,
    };
  } else {
    list.unshift(seeded);
    console.log('[agentbot-stub] seeded PBMP Executive Analyst agent');
  }
  writeAgents(list);
}
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

const MCP_CLEAR = 'sys__clear__sys';

function pbmpEnabled(ephemeral, agentTools = []) {
  const mcp = ephemeral && ephemeral.mcp;
  if (Array.isArray(mcp)) {
    if (mcp.length === 1 && mcp[0] === MCP_CLEAR) return false;
    return mcp.includes('pbmp');
  }
  if (mcp === false) return false;
  return (agentTools || []).some((tool) => String(tool).includes('mcp_pbmp')) || mcp == null;
}

async function callPbmpTool(name, args) {
  const tool = pbmpToolName(name);
  const payload = toolArgs(args);
  const remote = await localJson(`/tools/${tool}`, payload, 'POST');
  if (remote && remote.ok === true) return remote;
  const local = runPbmpToolLocal(tool, payload);
  if (local && local.ok) return local;
  return remote && typeof remote === 'object' ? remote : local;
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
  const tools = [
    ...(extras.pbmpOn === false ? [] : PBMP_TOOL_DEFS),
    ...(extras.fileSearchOn === false ? [] : [FILE_SEARCH_TOOL]),
    ...(extras.codeOn === false ? [] : [EXECUTE_CODE_TOOL]),
  ];
  const systemText = [
    PBMP_SYSTEM,
    extras.promptPrefix,
    extras.pbmpNote,
        extras.fileSearchNote,
      extras.attachmentNote,
      extras.artifactsNote,
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
      const errMsg = String(last.json?.error?.message || last.raw || '');
      const hasInline = contents.some((item) => (item.parts || []).some((part) => part.inlineData));
      if (hasInline && /inline|pdf|image|invalid argument|unsupported|too large|payload/i.test(errMsg)) {
        contents = contents.map((item) => ({
          ...item,
          parts: (item.parts || []).filter((part) => !part.inlineData),
        }));
        continue;
      }
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
  writeJsonAtomic(convosFile, store);
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

function readTags() {
  try {
    const list = JSON.parse(fs.readFileSync(tagsFile, 'utf8'));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeTags(list) {
  fs.writeFileSync(tagsFile, JSON.stringify(list, null, 2));
}

function publicTag(item) {
  return {
    _id: item._id,
    user: item.user,
    tag: item.tag,
    description: item.description || '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    count: item.count || 0,
    position: item.position || 0,
  };
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
  const now = new Date().toISOString();
  const group = {
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
  };
  const prompt = {
    _id: 'promptver_pbmp_launch',
    groupId: 'prompt_pbmp_launch',
    author: 'system',
    prompt: DEFAULT_PROMPT_TEXT,
    type: 'text',
    createdAt: now,
    updatedAt: now,
  };
  const groupIndex = store.groups.findIndex((item) => item._id === 'prompt_pbmp_launch');
  if (groupIndex >= 0) {
    store.groups[groupIndex] = { ...store.groups[groupIndex], ...group, createdAt: store.groups[groupIndex].createdAt || now };
  } else {
    store.groups.unshift(group);
    console.log('[agentbot-stub] seeded PBMP Product X launch prompt');
  }
  const promptIndex = store.prompts.findIndex((item) => item._id === 'promptver_pbmp_launch');
  if (promptIndex >= 0) store.prompts[promptIndex] = { ...store.prompts[promptIndex], ...prompt };
  else store.prompts.push(prompt);
  writePromptStore(store);
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

const MAX_INLINE_FILE_BYTES = 8 * 1024 * 1024;

function findFileRecord(item, store = readFiles()) {
  if (!item) return null;
  if (item.file_id && store[item.file_id]) return store[item.file_id];
  const ids = [item.file_id, item.temp_file_id].filter(Boolean);
  return (
    Object.values(store).find((entry) => {
      if (ids.includes(entry.file_id) || ids.includes(entry.temp_file_id)) return true;
      if (item.filepath && entry.filepath === item.filepath) return true;
      return false;
    }) || null
  );
}

function sniffMime(buf, mime, filename) {
  if (buf && buf.length >= 5 && buf.subarray(0, 5).toString('latin1') === '%PDF-') {
    return 'application/pdf';
  }
  if (buf && buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return 'image/jpeg';
  }
  if (buf && buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50) {
    return 'image/png';
  }
  return guessMime(filename, mime) || mime || 'application/octet-stream';
}

function decodePdfLiteral(inner) {
  return String(inner || '')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\([()\\])/g, '$1');
}

function textFromPdfContent(content) {
  const out = [];
  const re = /\(((?:\\.|[^\\)])*)\)/g;
  let match;
  while ((match = re.exec(String(content || '')))) {
    const value = decodePdfLiteral(match[1]).replace(/\0/g, '').trim();
    if (value.length < 2 || value.length > 400) continue;
    let printable = 0;
    for (let i = 0; i < value.length; i += 1) {
      const code = value.charCodeAt(i);
      if ((code >= 32 && code <= 126) || code === 10 || code === 9) printable += 1;
    }
    if (printable / value.length < 0.8 || !/[A-Za-z0-9]/.test(value)) continue;
    out.push(value);
  }
  return out.join(' ');
}

function inflatePdfStream(raw) {
  const attempts = [raw];
  if (raw.length > 1) attempts.push(raw.subarray(1), raw.subarray(2));
  for (const slice of attempts) {
    try {
      return zlib.inflateSync(slice);
    } catch {
      /* try raw deflate */
    }
    try {
      return zlib.inflateRawSync(slice);
    } catch {
      /* next */
    }
  }
  return null;
}

function extractPdfWithPdftotext(diskPath) {
  try {
    const text = execFileSync('pdftotext', ['-layout', '-q', diskPath, '-'], {
      encoding: 'utf8',
      timeout: 4000,
      maxBuffer: 2 * 1024 * 1024,
    });
    return String(text || '').trim();
  } catch {
    return '';
  }
}

function extractPdfText(buf) {
  if (!buf || !buf.length) return '';
  const max = Math.min(buf.length, MAX_INLINE_FILE_BYTES);
  const latin = buf.toString('latin1', 0, max);
  const chunks = [];
  const push = (content) => {
    const text = textFromPdfContent(content);
    if (text) chunks.push(text);
  };
  push(latin);
  let idx = 0;
  let inflated = 0;
  while (inflated < 40) {
    const startTok = latin.indexOf('stream', idx);
    if (startTok < 0) break;
    let i = startTok + 6;
    if (latin[i] === '\r') i += 1;
    if (latin[i] === '\n') i += 1;
    const endTok = latin.indexOf('endstream', i);
    if (endTok < 0) break;
    idx = endTok + 9;
    const raw = Buffer.from(latin.slice(i, endTok), 'latin1');
    const out = inflatePdfStream(raw);
    if (!out) continue;
    inflated += 1;
    push(out.toString('utf8'));
  }
  return chunks
    .join(' ')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function filesToGeminiParts(files, options = {}) {
  const allowBinary = options.allowBinary !== false;
  const textLimit = options.textLimit || (allowBinary ? 80000 : 4000);
  const parts = [];
  const store = readFiles();
  for (const item of files || []) {
    const rec = findFileRecord(item, store);
    if (!rec || !rec.diskPath || !fs.existsSync(rec.diskPath)) continue;
    const buf = fs.readFileSync(rec.diskPath);
    const mime = sniffMime(buf, rec.type || item.type, rec.filename);
    const extracted = readFileText(rec).slice(0, textLimit);
    if (extracted) {
      parts.push({ text: `\n\n--- File: ${rec.filename} ---\n${extracted}` });
    }
    if (
      allowBinary &&
      (mime.startsWith('image/') || mime === 'application/pdf') &&
      buf.length <= MAX_INLINE_FILE_BYTES
    ) {
      parts.push({ inlineData: { mimeType: mime, data: buf.toString('base64') } });
      continue;
    }
    if (!extracted) {
      parts.push({ text: `\n\n[Attached file: ${rec.filename} (${mime}, ${rec.bytes} bytes)]` });
    }
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
  seedDefaultAgent();
}

seedKnowledgeFiles();
seedDefaultAgent();

const SEARCH_STOP = new Set(
  'a an the and or of for to in on is it we our you your what does say please from with this this that than then how why who whom which are was were be been being not no do did can will would should about into over under'.split(
    ' ',
  ),
);

function isTextSearchable(rec) {
  const type = String(rec.type || '').toLowerCase();
  const name = String(rec.filename || '').toLowerCase();
  if (type.startsWith('text/') || type.includes('json') || type.includes('csv') || type.includes('markdown') || type.includes('xml') || type.includes('pdf')) {
    return true;
  }
  return /\.(md|txt|csv|json|xml|html|htm|pdf)$/i.test(name);
}

function readFileText(rec) {
  if (!rec?.diskPath || !fs.existsSync(rec.diskPath)) return '';
  const buf = fs.readFileSync(rec.diskPath);
  if (!buf.length) return '';
  const mime = sniffMime(buf, rec.type, rec.filename);
  if (mime === 'application/pdf') {
    const fromCli = extractPdfWithPdftotext(rec.diskPath);
    if (fromCli) return fromCli.slice(0, 80000);
    return extractPdfText(buf).slice(0, 80000);
  }
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
    'File Search INTERNAL documents. Copy facts from these snippets. Cite the filename. Do not invent policy numbers or customer names.\n\n' +
    blocks.join('\n\n')
  );
}

function hitsFromSampleFile(filename) {
  const rec = Object.values(readFiles()).find(
    (item) => item.sample && String(item.filename).toLowerCase() === String(filename).toLowerCase(),
  );
  if (!rec) return [];
  const text = readFileText(rec);
  if (!text) return [];
  return [{ file_id: rec.file_id, filename: rec.filename, snippet: text.slice(0, 1200), score: 100 }];
}

function prefetchFileSearch(text, user) {
  const q = String(text || '');
  const forced = [];
  if (/policy|sop|first launch|roi|18\s*%|which market|may launch/i.test(q)) {
    forced.push(...hitsFromSampleFile('08-business-policy.md'));
  }
  if (/tata|customer|delhi metro|bengaluru tech/i.test(q)) {
    forced.push(...hitsFromSampleFile('04-customers.md'));
  }
  if (/contract/i.test(q)) {
    forced.push(...hitsFromSampleFile('09-sample-contract.md'));
  }
  if (/catalogue|catalog|product x/i.test(q)) {
    forced.push(...hitsFromSampleFile('02-product-catalogue.md'));
  }
  if (/business case|project alpha|market entry/i.test(q)) {
    forced.push(...hitsFromSampleFile('10-product-x-business-case.md'));
  }
  if (/\.csv|sales csv|last 12/i.test(q)) {
    forced.push(...hitsFromSampleFile('03-sales-product-x.csv'));
  }
  const searched = searchFiles(q, user, { limit: 5, minScore: 2 });
  const seen = new Set();
  const hits = [];
  for (const hit of [...forced, ...(searched.hits || [])]) {
    const key = String(hit.filename || '').toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    hits.push(hit);
    if (hits.length >= 5) break;
  }
  return formatSearchHits({ hits });
}

function fileSearchEnabledFlag(ephemeral, agentTools = []) {
  if (ephemeral && ephemeral.file_search === false) return false;
  if (ephemeral && ephemeral.file_search === true) return true;
  return (agentTools || []).includes('file_search') || true;
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

function artifactsEnabledFlag(ephemeral, agent) {
  const value = ephemeral && ephemeral.artifacts;
  if (value === false || value === '' || value === 0) return false;
  if (typeof value === 'string' && value.length) return true;
  if (value === true) return true;
  return !!(agent && agent.artifacts);
}

function canvasArtifactsFor(query) {
  const q = String(query || '');
  if (
    !/dashboard|canvas|artifact|mermaid|management table|rich (text|media|output)|chart|visual|svg|video|image/i.test(
      q,
    )
  ) {
    return '';
  }
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
body{font-family:ui-sans-serif,system-ui,sans-serif;margin:24px;color:#111;background:#fff}
h1{font-size:20px;margin:0 0 8px}p{color:#444;margin:0 0 16px}
table{border-collapse:collapse;width:100%;margin:12px 0}
th,td{border:1px solid #ddd;padding:8px 10px;text-align:left}
th{background:#f4f4f5} .ok{color:#166534;font-weight:600}
svg{display:block;margin:16px 0}
</style></head><body>
<h1>Product X launch dashboard</h1>
<p>Last 12 months. Policy: first launch if ROI ≥ 18% or risk Low. Sequence: Mumbai → Delhi → Bangalore.</p>
<table>
<tr><th>Market</th><th>Revenue (₹ Cr)</th><th>ROI %</th><th>Risk</th></tr>
<tr><td>Mumbai</td><td>18.2</td><td>24</td><td>Medium</td></tr>
<tr><td>Delhi</td><td>15.7</td><td>19</td><td>Low</td></tr>
<tr><td>Bangalore</td><td>13.6</td><td>16</td><td>Medium</td></tr>
</table>
<p class="ok">Recommendation: launch Mumbai first.</p>
<svg viewBox="0 0 360 140" width="360" height="140" aria-label="Revenue bars">
  <text x="0" y="14" font-size="12">Revenue ₹ Cr</text>
  <rect x="20" y="40" width="182" height="18" fill="#2563eb"></rect>
  <text x="208" y="54" font-size="12">Mumbai 18.2</text>
  <rect x="20" y="70" width="157" height="18" fill="#0f766e"></rect>
  <text x="184" y="84" font-size="12">Delhi 15.7</text>
  <rect x="20" y="100" width="136" height="18" fill="#a16207"></rect>
  <text x="164" y="114" font-size="12">Bangalore 13.6</text>
</svg>
</body></html>`;
  const md = `# Product X brief\n\n- **Mumbai** ₹18.2 Cr · ROI 24% · Medium\n- **Delhi** ₹15.7 Cr · ROI 19% · Low\n- **Bangalore** ₹13.6 Cr · ROI 16% · Medium\n\nPolicy: ROI ≥ **18%** or risk **Low**. Cite \`08-business-policy.md\`.`;
  const mermaid = `flowchart LR\n  Mumbai -->|first| Delhi -->|then| Bangalore`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80">
  <rect width="320" height="80" fill="#f4f4f5"/>
  <text x="16" y="32" font-size="16" fill="#111">Product X · ₹47.5 Cr combined</text>
  <text x="16" y="56" font-size="12" fill="#444">18.2 + 15.7 + 13.6</text>
</svg>`;
  const blocks = [];
  if (/mermaid|sequence|flowchart/i.test(q)) {
    blocks.push(
      `:::artifact{identifier="px-seq" type="application/vnd.mermaid" title="Launch sequence"}\n${mermaid}\n:::`,
    );
  }
  if (/svg|image|diagram/i.test(q) && !/dashboard|canvas/i.test(q)) {
    blocks.push(
      `:::artifact{identifier="px-svg" type="image/svg+xml" title="Combined revenue"}\n${svg}\n:::`,
    );
  }
  if (/video/i.test(q)) {
    blocks.push(
      `:::artifact{identifier="px-video" type="text/html" title="Video in canvas"}\n<!DOCTYPE html><html><body style="margin:0;background:#111;color:#fff;font-family:sans-serif;padding:16px"><p>Uploaded MP4/WebM also play in the chat bubble. Canvas can embed a player:</p><video controls width="100%" src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"></video></body></html>\n:::`,
    );
  }
  if (!blocks.length || /dashboard|canvas|chart|table|rich|artifact/i.test(q)) {
    blocks.unshift(
      `:::artifact{identifier="px-dash" type="text/html" title="Product X launch dashboard"}\n${html}\n:::`,
      `:::artifact{identifier="px-brief" type="text/markdown" title="Product X markdown brief"}\n${md}\n:::`,
    );
  }
  return blocks.join('\n\n');
}

function collectRequestFiles(body) {
  const out = [];
  const seen = new Set();
  const add = (list) => {
    if (!Array.isArray(list)) return;
    for (const item of list) {
      if (!item || typeof item !== 'object') continue;
      const id = item.file_id || item.temp_file_id || item.filepath;
      if (!id || seen.has(id)) continue;
      seen.add(id);
      out.push(item);
    }
  };
  add(body && body.files);
  add(body && body.endpointOption && body.endpointOption.files);
  add(body && body.endpointOption && body.endpointOption.attachments);
  add(body && body.modelOptions && body.modelOptions.files);
  return out;
}

function toGeminiContents(history, latestText, latestFiles = []) {
  const contents = [];
  const prior = Array.isArray(history) ? [...history] : [];
  // Chat persists the current user turn before calling Gemini. Drop it here so
  // this turn's PDF/image is sent as binary instead of a history placeholder.
  if (prior.length && prior[prior.length - 1].isCreatedByUser) {
    prior.pop();
  }
  for (const item of prior) {
    if (isPoisonHistory(item)) continue;
    const part = String(item.text || '').trim();
    const fileParts = filesToGeminiParts(item.files, { allowBinary: false, textLimit: 4000 });
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
  contents.push({ role: 'user', parts: latestParts });
  return contents;
}

const server = http.createServer(async (req, res) => {
  const rawUrl = req.url || '/';
  const url = rawUrl.split('?')[0];
  const qs = new URLSearchParams(rawUrl.split('?')[1] || '');
  const method = req.method || 'GET';

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Credentials': 'true',
    });
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
    const saved = users.find((user) => user.email === email) || users[users.length - 1];
    if (saved) claimConversations(saved);
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
    claimConversations(user);
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
    claimConversations(user);
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

  if (method === 'GET' && /^\/api\/files\/agent\/[^/]+$/.test(url)) {
    const agentId = decodeURIComponent(url.slice('/api/files/agent/'.length));
    const agent = findAgent(agentId);
    const store = readFiles();
    const ids = (agent && agent.tool_resources && agent.tool_resources.file_search && agent.tool_resources.file_search.file_ids) || [];
    const fromAgent = ids.map((id) => store[id]).filter(Boolean);
    const list = (fromAgent.length ? fromAgent : Object.values(store).filter((item) => item.sample)).map(publicFile);
    send(res, 200, list);
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
    const user = sessionUser(req);
    if (user) claimOwnedRecords(user, readPresets, writePresets);
    const list = readPresets().filter((item) => !user || item.user === user.id || !item.user);
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
    const code = String(
      body.code || body.python || (body.args && (body.args.code || body.args.python)) || '',
    );
    const result = await executePython(code);
    send(res, 200, {
      result: result.ok
        ? result.stdout || 'Code ran with no output.'
        : result.stderr || result.error || 'Code failed.',
    });
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

  if (method === 'POST' && url === '/api/user/plugins') {
    const user = userFromReq(req) || (sameSiteRequest(req) ? guestUser() : null);
    if (!user) {
      send(res, 401, { message: 'Unauthorized' });
      return;
    }
    send(res, 200, publicUser(user));
    return;
  }

  if (method === 'GET' && url === '/api/models') {
    send(res, 200, models);
    return;
  }

  if (method === 'GET' && (url === '/api/convos' || url === '/api/convos/')) {
    const user = sessionUser(req);
    if (user) claimConversations(user);
    const archived = qs.get('isArchived') === 'true';
    const store = readConvos();
    const tagFilter = [...qs.getAll('tags'), ...(String(qs.get('tags') || '').split(','))]
      .map((item) => String(item || '').trim())
      .filter(Boolean);
    const uniqueTags = [...new Set(tagFilter)];
    const conversations = Object.values(store.conversations)
      .filter((item) => (user ? conversationBelongsTo(item, user) : false))
      .filter((item) => !!item.isArchived === archived)
      .filter((item) => {
        if (!uniqueTags.length) return true;
        const itemTags = Array.isArray(item.tags) ? item.tags : [];
        return uniqueTags.some((tag) => itemTags.includes(tag));
      })
      .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
      .map((item) => ({
        ...item,
        conversationId: item.conversationId,
        title: item.title || 'New Chat',
        endpoint: item.endpoint || 'google',
        model: item.model || DEFAULT_GEMINI,
        tags: Array.isArray(item.tags) ? item.tags : [],
        createdAt: item.createdAt || item.updatedAt || new Date().toISOString(),
        updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
      }));
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
    const user = sessionUser(req);
    const store = readConvos();
    const current = store.conversations[update.conversationId] || {
      conversationId: update.conversationId,
      title: 'New Chat',
      endpoint: update.endpoint || 'google',
      model: update.model || DEFAULT_GEMINI,
      createdAt: new Date().toISOString(),
    };
    const next = {
      ...current,
      ...update,
      conversationId: update.conversationId || current.conversationId,
      user: (user && user.id) || current.user,
      email: (user && user.email) || current.email,
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

  if (method === 'POST' && /\/api\/agents\/chat\/(?:[^/]+\/)?abort$/.test(url)) {
    send(res, 200, { success: true, final: true });
    return;
  }

  if (method === 'POST' && url.startsWith('/api/agents/chat/')) {
    const body = await readBody(req);
    const user = sessionUser(req);
    if (!user) {
      send(res, 401, { text: 'Unauthorized. Please sign in again.', error: true });
      return;
    }
    claimConversations(user);

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
    const attachedFiles = collectRequestFiles(body);
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

    const persistConversation = (extra = {}, extraMessages = []) => {
      const store = readConvos();
      const previous = store.conversations[conversationId] || {};
      store.conversations[conversationId] = {
        ...previous,
        conversationId,
        title: extra.title || previous.title || (text || 'New Chat').slice(0, 48),
        endpoint,
        model,
        agent_id: chatAgentId || previous.agent_id,
        createdAt: previous.createdAt || now,
        updatedAt: extra.updatedAt || new Date().toISOString(),
        user: user.id,
        email: user.email,
      };
      if (extraMessages.length) {
        const existing = store.messages[conversationId] || [];
        const seen = new Set(existing.map((item) => item.messageId));
        store.messages[conversationId] = [
          ...existing,
          ...extraMessages.filter((item) => item && item.messageId && !seen.has(item.messageId)),
        ];
      }
      writeConvos(store);
      return store.conversations[conversationId];
    };

    sseStart(res);
    sseWrite(res, { created: true, message: userMessage });
    persistConversation({}, [userMessage]);

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
      const conversation = persistConversation({ title, updatedAt: responseMessage.updatedAt }, [
        responseMessage,
      ]);
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
      const fileSearchOn = fileSearchEnabledFlag(ephemeral, agentTools);
      const fileSearchNote = fileSearchOn ? prefetchFileSearch(text, user) : '';
      const artifactsOn = artifactsEnabledFlag(ephemeral, savedAgent);
      const artifactsNote = artifactsOn
        ? 'Artifacts/canvas is ON. If the user wants a dashboard, chart, mermaid, image or video, emit :::artifact blocks (text/html, text/markdown, application/vnd.mermaid, image/svg+xml).'
        : '';
      const attachmentNote = attachedFiles.length
        ? 'The user attached file(s) in this message. File content is included in the user message (text extract and/or the original PDF/image). Read those files and answer. Never say you cannot access, open, or interpret attached files.'
        : '';
      const pbmpOn = pbmpEnabled(ephemeral, agentTools);
      const pbmpNote = pbmpOn ? prefetchPbmp(text) : '';
      const codeOn = ephemeral.execute_code !== false || agentTools.includes('execute_code');
      const codeNote = codeOn
        ? 'Code Interpreter is ON. For any arithmetic, total, ROI, percentage or table of numbers, call execute_code and print the result. Do not guess the calculated figure.'
        : '';
      const result = await generateGeminiWithPbmp(key, model, toGeminiContents(history, text, attachedFiles), {
        promptPrefix,
        generationConfig,
        fileSearchNote,
        fileSearchOn,
        attachmentNote,
        artifactsNote,
        artifactsOn,
        pbmpNote,
        pbmpOn,
        codeNote,
        codeOn,
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
      if (artifactsOn && !reply.includes(':::artifact')) {
        const extra = canvasArtifactsFor(text);
        if (extra) reply = `${reply}\n\n${extra}`;
      }
      finish(reply, false);
    } catch (error) {
      finish(error.message || 'Failed to reach Gemini.', true);
    }
    return;
  }

  if (method === 'GET' && (url === '/api/roles' || url.startsWith('/api/roles/'))) {
    const raw = decodeURIComponent((url.split('/')[3] || 'USER').split('?')[0] || 'USER');
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

  if (method === 'GET' && /^\/api\/mcp\/connection\/status\/[^/]+$/.test(url)) {
    const serverName = decodeURIComponent(url.split('/').pop());
    send(res, 200, {
      success: true,
      serverName,
      connectionStatus: 'connected',
      requiresOAuth: false,
    });
    return;
  }

  if (method === 'POST' && /^\/api\/mcp\/[^/]+\/reinitialize$/.test(url)) {
    const serverName = decodeURIComponent(url.split('/')[3]);
    send(res, 200, {
      success: true,
      message: `${serverName} is ready`,
      oauthUrl: null,
      serverName,
      oauthRequired: false,
    });
    return;
  }

  if (method === 'GET' && /^\/api\/mcp\/[^/]+\/auth-values$/.test(url)) {
    const serverName = decodeURIComponent(url.split('/')[3]);
    send(res, 200, { success: true, serverName, authValueFlags: {} });
    return;
  }

  if (method === 'POST' && /^\/api\/mcp\/oauth\/cancel\/[^/]+$/.test(url)) {
    send(res, 200, { success: true });
    return;
  }

  if (method === 'GET' && url === '/api/tags') {
    const user = sessionUser(req);
    if (user) claimOwnedRecords(user, readTags, writeTags);
    const list = readTags().filter((item) => !user || item.user === user.id || !item.user);
    send(res, 200, list.map(publicTag));
    return;
  }

  if (method === 'POST' && url === '/api/tags') {
    const user = userFromReq(req) || (sameSiteRequest(req) ? guestUser() : null);
    const body = await readBody(req);
    const tagName = String(body.tag || '').trim();
    if (!tagName) {
      send(res, 400, { error: 'Tag name is required' });
      return;
    }
    const list = readTags();
    const existing = list.find(
      (item) => item.tag === tagName && (!user || item.user === user.id),
    );
    if (existing) {
      send(res, 200, publicTag(existing));
      return;
    }
    const now = new Date().toISOString();
    const tag = {
      _id: `tag_${crypto.randomBytes(6).toString('hex')}`,
      user: (user && user.id) || 'local-web',
      tag: tagName,
      description: String(body.description || ''),
      createdAt: now,
      updatedAt: now,
      count: body.addToConversation ? 1 : 0,
      position: list.filter((item) => !user || item.user === user.id).length + 1,
    };
    list.push(tag);
    writeTags(list);
    send(res, 200, publicTag(tag));
    return;
  }

  if (method === 'PUT' && /^\/api\/tags\/convo\/[^/]+$/.test(url)) {
    const conversationId = decodeURIComponent(url.split('/').pop());
    const body = await readBody(req);
    const tags = (Array.isArray(body.tags) ? body.tags : []).map((item) => String(item || '').trim()).filter(Boolean);
    const user = sessionUser(req);
    const store = readConvos();
    const current = store.conversations[conversationId];
    if (current) {
      current.tags = tags;
      current.updatedAt = new Date().toISOString();
      if (user) {
        current.user = user.id;
        current.email = user.email;
      }
      writeConvos(store);
    }
    recountTags(user);
    send(res, 200, tags);
    return;
  }

  if ((method === 'PUT' || method === 'DELETE') && /^\/api\/tags\/[^/]+$/.test(url)) {
    const tagName = decodeURIComponent(url.slice('/api/tags/'.length));
    const user = userFromReq(req);
    const list = readTags();
    const index = list.findIndex(
      (item) => item.tag === tagName && (!user || item.user === user.id),
    );
    if (index < 0) {
      send(res, 404, { error: 'Tag not found' });
      return;
    }
    if (method === 'DELETE') {
      const removed = list.splice(index, 1)[0];
      writeTags(list);
      send(res, 200, publicTag(removed));
      return;
    }
    const body = await readBody(req);
    list[index] = {
      ...list[index],
      ...body,
      tag: body.tag || list[index].tag,
      _id: list[index]._id,
      updatedAt: new Date().toISOString(),
    };
    writeTags(list);
    send(res, 200, publicTag(list[index]));
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

  if (method === 'POST' && (url === '/api/prompts' || url === '/api/prompts/')) {
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

  if (method === 'PATCH' && /^\/api\/prompts\/[^/]+\/tags\/production$/.test(url)) {
    const id = decodeURIComponent(url.split('/')[3]);
    const store = readPromptStore();
    const prompt = store.prompts.find((item) => item._id === id);
    if (!prompt) {
      send(res, 404, { message: 'Prompt not found' });
      return;
    }
    const group = store.groups.find((item) => item._id === prompt.groupId);
    if (group) {
      group.productionId = prompt._id;
      group.productionPrompt = { prompt: prompt.prompt };
      group.updatedAt = new Date().toISOString();
    }
    writePromptStore(store);
    send(res, 200, prompt);
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

if (process.argv.includes('--selftest-pbmp')) {
  const sales = runPbmpToolLocal('get_sales_mcp_pbmp', { product: 'Product X last 12 months' });
  const cities = (sales.data || []).map((row) => `${row.geography}:${row.revenueCr}`).join(',');
  const tata = runPbmpToolLocal('get_customer', { customer_name: 'Tata Motors' });
  const risks = runPbmpToolLocal('get_project_risks', { project_name: 'Project Alpha actuals' });
  const actuals = runPbmpToolLocal('get_project_actuals', { project_name: 'alpha' });
  const note = prefetchPbmp('Product X last 12 months sales Mumbai Delhi Bangalore');
  const policyNote = prefetchFileSearch(
    'What does our business policy say about which market we may launch first?',
    { id: 'sample' },
  );
  const tataNote = prefetchFileSearch('Tata Motors customer', { id: 'sample' });
  const invoicePdf = Buffer.from(
    '%PDF-1.1\n1 0 obj<<>>endobj\nstream\nBT (Invoice S4ZRTSPC Amount 12500 INR) Tj ET\nendstream\n%%EOF\n',
    'binary',
  );
  const invoiceId = 'selftest-invoice-pdf';
  const invoicePath = path.join(filesDir, invoiceId);
  fs.writeFileSync(invoicePath, invoicePdf);
  const filesStore = readFiles();
  filesStore[invoiceId] = {
    file_id: invoiceId,
    temp_file_id: invoiceId,
    user: 'sample',
    filename: 'Invoice-S4ZRTSPC-0001.pdf',
    filepath: `/HBMP_AgentBot/api/files/download/sample/${invoiceId}`,
    diskPath: invoicePath,
    type: 'application/octet-stream',
    bytes: invoicePdf.length,
  };
  writeFiles(filesStore);
  const invoiceText = readFileText(filesStore[invoiceId]);
  const persistedUser = {
    isCreatedByUser: true,
    text: 'Please explain what is mentioned in this invoice to me.',
    files: [{ file_id: invoiceId, filepath: filesStore[invoiceId].filepath, type: 'application/pdf' }],
  };
  const geminiTurn = toGeminiContents([persistedUser], persistedUser.text, persistedUser.files);
  const lastUser = geminiTurn[geminiTurn.length - 1];
  const lastBlob = JSON.stringify(lastUser || {});
  const attachOk =
    invoiceText.includes('S4ZRTSPC') &&
    invoiceText.includes('12500') &&
    lastUser &&
    lastUser.role === 'user' &&
    lastBlob.includes('S4ZRTSPC') &&
    lastBlob.includes('inlineData') &&
    geminiTurn.filter((item) => item.role === 'user').length === 1;
  const dash = canvasArtifactsFor('Give me a management dashboard for Product X');
  const mermaidArt = canvasArtifactsFor('Show a mermaid flowchart of the launch sequence');
  const canvasOk =
    dash.includes(':::artifact') &&
    dash.includes('text/html') &&
    dash.includes('18.2') &&
    mermaidArt.includes('application/vnd.mermaid');
  const fileOk =
    policyNote.includes('08-business-policy.md') &&
    policyNote.includes('18%') &&
    tataNote.includes('04-customers.md') &&
    tataNote.includes('Tata Motors') &&
    fileSearchEnabledFlag({}) === true &&
    fileSearchEnabledFlag({ file_search: false }) === false;
  const toggleOn = pbmpEnabled({ mcp: ['pbmp'] }) === true;
  const toggleOff = pbmpEnabled({ mcp: [] }) === false;
  const toggleClear = pbmpEnabled({ mcp: [MCP_CLEAR] }) === false;
  const toggleDefault = pbmpEnabled({}) === true;
  const knowledgeCount = Object.values(readFiles()).filter((item) => item.sample).length;
  const analyst = findAgent(DEFAULT_AGENT_ID);
  const promptGroup = readPromptStore().groups.find((item) => item._id === 'prompt_pbmp_launch');
  const agentOk =
    knowledgeCount === 10 &&
    analyst &&
    (analyst.tool_resources.file_search.file_ids || []).length === 10 &&
    analyst.tools.includes('file_search') &&
    analyst.tools.includes('execute_code') &&
    promptGroup &&
    promptGroup.command === 'pbmp-launch' &&
    String(promptGroup.productionPrompt && promptGroup.productionPrompt.prompt).includes('18.2');
  const ok =
    cities === 'Mumbai:18.2,Delhi:15.7,Bangalore:13.6' &&
    tata.data?.name === 'Tata Motors' &&
    (risks.data || []).some((item) => item.title === 'Vendor delay') &&
    actuals.data?.actualCostCr === 9.16 &&
    note.includes('18.2') &&
    note.includes('15.7') &&
    note.includes('13.6') &&
    fileOk &&
    agentOk &&
    toggleOn &&
    toggleOff &&
    toggleClear &&
    toggleDefault &&
    attachOk &&
    canvasOk;
  console.log(ok ? 'pbmp selftest ok' : 'pbmp selftest FAIL');
  console.log({
    cities,
    tata: tata.data?.name,
    risks: (risks.data || []).map((r) => r.title),
    actuals: actuals.data,
    fileOk,
    agentOk,
    knowledgeCount,
    policy: policyNote.includes('18%'),
    tataFile: tataNote.includes('Tata Motors'),
    attachOk,
    canvasOk,
    invoiceText: invoiceText.slice(0, 120),
  });
  process.exit(ok ? 0 : 1);
}

server.listen(PORT, HOST, () => {
  console.log(`[agentbot-stub] listening on ${HOST}:${PORT}`);
});

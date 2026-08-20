#!/usr/bin/env node
/**
 * Local AgentBot API for grow24.ai.
 * Stores users on disk so register/login work without MongoDB.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 5188);
const HOST = process.env.HOST || '0.0.0.0';
const serverDomain = process.env.DOMAIN_CLIENT || 'https://www.grow24.ai';
const dataDir = process.env.AGENTBOT_DATA_DIR || '/app/data';
const usersFile = path.join(dataDir, 'agentbot-users.json');
const secretFile = path.join(dataDir, 'agentbot-secret.txt');

fs.mkdirSync(dataDir, { recursive: true });

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
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(next, 'hex'));
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

function bearer(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/(?:^|;\s*)refreshToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

function userFromReq(req) {
  const payload = verifyJwt(bearer(req));
  if (!payload?.id) return null;
  return readUsers().find((user) => user.id === payload.id) || null;
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
};

const endpoints = {
  agents: {
    userProvide: false,
    capabilities: ['execute_code', 'file_search', 'web_search', 'actions', 'artifacts'],
    order: 1,
    disableBuilder: false,
  },
  google: { userProvide: false, order: 5 },
};

const models = {
  google: ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'],
  agents: ['gemini-2.5-flash'],
};

function authHeaders(token) {
  return {
    'Set-Cookie': `refreshToken=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`,
  };
}

const server = http.createServer(async (req, res) => {
  const url = (req.url || '/').split('?')[0];
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
    if (!users.some((user) => user.email === email)) {
      const now = new Date().toISOString();
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
      writeUsers(users);
    }
    send(res, 200, { message: 'Registration successful. You can now sign in.' });
    return;
  }

  if (method === 'POST' && url === '/api/auth/login') {
    const body = await readBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const user = readUsers().find((item) => item.email === email);
    if (!user || !verifyPassword(password, user.password)) {
      send(res, 401, { message: 'Invalid email or password.' });
      return;
    }
    const token = signJwt({ id: user.id, email: user.email }, 60 * 60 * 24 * 7);
    send(res, 200, { token, user: publicUser(user) }, authHeaders(token));
    return;
  }

  if (method === 'POST' && url === '/api/auth/logout') {
    send(res, 200, { message: 'Logout successful', redirect: '/login' }, {
      'Set-Cookie': 'refreshToken=; HttpOnly; Path=/; Max-Age=0',
    });
    return;
  }

  if (method === 'POST' && url.startsWith('/api/auth/refresh')) {
    const user = userFromReq(req);
    if (!user) {
      send(res, 200, 'Refresh token not provided');
      return;
    }
    const token = signJwt({ id: user.id, email: user.email }, 60 * 60 * 24 * 7);
    send(res, 200, { token, user: publicUser(user) }, authHeaders(token));
    return;
  }

  if (method === 'GET' && url === '/api/user') {
    const user = userFromReq(req);
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

  if (method === 'GET' && url === '/api/models') {
    send(res, 200, models);
    return;
  }

  if (method === 'GET' && url.startsWith('/api/convos')) {
    send(res, 200, { conversations: [], pageNumber: '1', pageSize: 25, pages: 1 });
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

  send(res, 404, { message: `Route ${method} ${url} not found` });
});

server.listen(PORT, HOST, () => {
  console.log(`[agentbot-stub] listening on ${HOST}:${PORT}`);
});

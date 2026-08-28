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
const NO_PARENT = '00000000-0000-0000-0000-000000000000';

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
  google: [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-1.5-flash-lite',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
  ],
  agents: ['gemini-2.5-flash'],
};

function resolveGeminiModel(model) {
  const aliases = {
    'gemini-1.5-flash-lite': 'gemini-2.0-flash',
    'gemini-1.5-flash': 'gemini-2.0-flash',
    'gemini-1.5-pro': 'gemini-2.5-flash',
    'gemini-2.0-flash-lite': 'gemini-2.0-flash',
  };
  return aliases[model] || model;
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

function toGeminiContents(history, latestText) {
  const contents = [];
  for (const item of history) {
    const part = String(item.text || '').trim();
    if (!part) continue;
    contents.push({
      role: item.isCreatedByUser ? 'user' : 'model',
      parts: [{ text: part }],
    });
  }
  if (!contents.length || contents[contents.length - 1].role !== 'user') {
    contents.push({ role: 'user', parts: [{ text: latestText || 'Hello' }] });
  }
  return contents;
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
    const user = userFromReq(req);
    if (!user) {
      send(res, 401, { token: null, user: null, message: 'Refresh token not provided' });
      return;
    }
    const token = signJwt({ id: user.id, email: user.email }, 60 * 60 * 24 * 7);
    send(res, 200, { token, user: publicUser(user) }, authHeaders(token, req));
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

  if (method === 'GET' && url === '/api/files') {
    send(res, 200, []);
    return;
  }

  if (method === 'GET' && url === '/api/files/config') {
    send(res, 200, { endpoints: {} });
    return;
  }

  if (method === 'GET' && url === '/api/presets') {
    send(res, 200, []);
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
    const store = readConvos();
    const conversations = Object.values(store.conversations)
      .filter((item) => !user || item.user === user.id)
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
      model: 'gemini-2.0-flash',
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
    const model = resolveGeminiModel(
      String(body.model || body.modelOptions?.model || 'gemini-2.0-flash').replace(/^google\//, ''),
    );
    const endpoint = String(body.endpoint || url.split('/').pop() || 'google');
    let conversationId = body.conversationId;
    if (!conversationId || conversationId === 'new') {
      conversationId = crypto.randomUUID();
    }
    const parentMessageId = body.parentMessageId || NO_PARENT;
    const userMessageId = body.messageId || crypto.randomUUID();
    const responseMessageId = crypto.randomUUID();
    const now = new Date().toISOString();
    const userMessage = {
      messageId: userMessageId,
      conversationId,
      parentMessageId,
      text,
      sender: 'User',
      isCreatedByUser: true,
      endpoint,
      model,
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
      const result = await httpsJson(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`,
        { contents: toGeminiContents(history, text) },
      );
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

  send(res, 404, { text: `Route ${method} ${url} not found`, message: `Route ${method} ${url} not found` });
});

server.listen(PORT, HOST, () => {
  console.log(`[agentbot-stub] listening on ${HOST}:${PORT}`);
});

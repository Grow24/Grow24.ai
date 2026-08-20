#!/usr/bin/env node
/**
 * PID 1 for the Grow24 web image. Zeabur sometimes skips shell entrypoints;
 * this Node supervisor always starts Caddy plus local API stubs.
 */
const { spawn } = require('child_process');
const fs = require('fs');

function run(name, command, args, options = {}) {
  console.log(`[start-all] starting ${name}: ${command} ${args.join(' ')}`);
  const child = spawn(command, args, {
    stdio: 'inherit',
    ...options,
  });
  child.on('exit', (code, signal) => {
    console.error(`[start-all] ${name} exited code=${code} signal=${signal}`);
  });
  child.on('error', (err) => {
    console.error(`[start-all] ${name} failed to spawn`, err);
  });
  return child;
}

fs.mkdirSync('/app/data', { recursive: true });

if (fs.existsSync('/app/docs-api/fallback.cjs')) {
  run('docs-api', 'node', ['/app/docs-api/fallback.cjs'], {
    cwd: '/app/docs-api',
    env: {
      ...process.env,
      PORT: process.env.HBMP_DOCS_API_PORT || '4000',
      DATABASE_URL: process.env.DATABASE_URL || 'file:/app/data/docs.db',
      CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://www.grow24.ai',
    },
  });
} else {
  console.error('[start-all] /app/docs-api/fallback.cjs missing');
}

run('agentbot-stub', 'node', ['/app/agentbot-stub.cjs'], {
  env: {
    ...process.env,
    PORT: process.env.AGENTBOT_STUB_PORT || '5188',
  },
});

const caddy = run('caddy', 'caddy', [
  'run',
  '--config',
  '/etc/caddy/Caddyfile',
  '--adapter',
  'caddyfile',
]);

caddy.on('exit', (code) => {
  process.exit(code || 1);
});

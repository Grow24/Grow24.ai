#!/usr/bin/env node
/**
 * PID 1 for the Grow24 web image. Zeabur sometimes skips shell entrypoints;
 * this Node supervisor always starts Caddy plus local APIs.
 */
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

const docsDir = '/app/docs-api';
const docsEnv = {
  ...process.env,
  PORT: process.env.HBMP_DOCS_API_PORT || '4000',
  HOST: '0.0.0.0',
  DATABASE_URL: process.env.DATABASE_URL || 'file:/app/data/docs.db',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://www.grow24.ai',
};
const tsxCli = path.join(docsDir, 'node_modules/tsx/dist/cli.mjs');

function runQuiet(command) {
  execSync(command, { cwd: docsDir, env: docsEnv, stdio: 'inherit' });
}

if (fs.existsSync(docsDir)) {
  try {
    runQuiet('npx prisma migrate deploy');
  } catch {
    try {
      runQuiet('npx prisma db push --skip-generate --accept-data-loss');
    } catch (error) {
      console.error('[start-all] docs prisma migrate failed', error.message);
    }
  }
  if (fs.existsSync(path.join(docsDir, 'prisma/seed.ts')) && fs.existsSync(tsxCli)) {
    try {
      execSync(`node "${tsxCli}" prisma/seed.ts`, {
        cwd: docsDir,
        env: docsEnv,
        stdio: 'inherit',
      });
    } catch (error) {
      console.error('[start-all] docs seed failed', error.message);
    }
  }

  const distEntry = path.join(docsDir, 'dist/index.js');
  const srcEntry = path.join(docsDir, 'src/index.ts');
  const fallback = path.join(docsDir, 'fallback.cjs');
  if (fs.existsSync(distEntry)) {
    run('docs-api', 'node', [distEntry], { cwd: docsDir, env: docsEnv });
  } else if (fs.existsSync(srcEntry) && fs.existsSync(tsxCli)) {
    run('docs-api', 'node', [tsxCli, srcEntry], { cwd: docsDir, env: docsEnv });
  } else if (fs.existsSync(fallback)) {
    run('docs-api', 'node', [fallback], { cwd: docsDir, env: docsEnv });
  } else {
    console.error('[start-all] docs API entry missing');
  }
} else {
  console.error('[start-all] /app/docs-api missing');
}

const hbmpOneDir = '/app/hbmp-one-api';
const hbmpOneEnv = {
  ...process.env,
  PORT: process.env.HBMP_ONE_API_PORT || '4010',
  HOST: '0.0.0.0',
  DATABASE_URL: process.env.HBMP_ONE_DATABASE_URL || 'file:/app/data/hbmp-one.db',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://www.grow24.ai',
};
const hbmpTsx = path.join(hbmpOneDir, 'node_modules/tsx/dist/cli.mjs');

function runHbmpOneQuiet(command) {
  execSync(command, { cwd: hbmpOneDir, env: hbmpOneEnv, stdio: 'inherit' });
}

if (fs.existsSync(hbmpOneDir)) {
  try {
    runHbmpOneQuiet('npx prisma migrate deploy');
  } catch {
    try {
      runHbmpOneQuiet('npx prisma db push --skip-generate --accept-data-loss');
    } catch (error) {
      console.error('[start-all] hbmp-one prisma migrate failed', error.message);
    }
  }
  if (fs.existsSync(path.join(hbmpOneDir, 'prisma/seed.ts')) && fs.existsSync(hbmpTsx)) {
    try {
      execSync(`node "${hbmpTsx}" prisma/seed.ts`, {
        cwd: hbmpOneDir,
        env: hbmpOneEnv,
        stdio: 'inherit',
      });
    } catch (error) {
      console.error('[start-all] hbmp-one seed failed', error.message);
    }
  }
  const distEntry = path.join(hbmpOneDir, 'dist/index.js');
  const srcEntry = path.join(hbmpOneDir, 'src/index.ts');
  if (fs.existsSync(distEntry)) {
    run('hbmp-one-api', 'node', [distEntry], { cwd: hbmpOneDir, env: hbmpOneEnv });
  } else if (fs.existsSync(srcEntry) && fs.existsSync(hbmpTsx)) {
    run('hbmp-one-api', 'node', [hbmpTsx, srcEntry], { cwd: hbmpOneDir, env: hbmpOneEnv });
  } else {
    console.error('[start-all] hbmp-one API entry missing');
  }
  console.log('[start-all] HBMP One API: local on :4010 → /HBMP_One/api');
} else {
  console.error('[start-all] /app/hbmp-one-api missing');
}

if (fs.existsSync('/app/pbmp-mcp/index.js')) {
  run('pbmp-mcp', 'node', ['/app/pbmp-mcp/index.js', '--http'], {
    env: {
      ...process.env,
      PBMP_MCP_PORT: process.env.PBMP_MCP_PORT || '5202',
    },
  });
  console.log('[start-all] PBMP MCP HTTP: local on :5202');
} else {
  console.error('[start-all] /app/pbmp-mcp missing');
}

run('agentbot-stub', 'node', ['/app/agentbot-stub.cjs'], {
  env: {
    ...process.env,
    PORT: process.env.AGENTBOT_STUB_PORT || '5188',
    DOMAIN_CLIENT: process.env.DOMAIN_CLIENT || 'https://www.grow24.ai/HBMP_AgentBot',
  },
});
console.log('[start-all] AgentBot API: local stub on :5188');

const pbmpLibreDir = '/app/pbmp-librechat-api';
const pbmpLibreEnv = {
  ...process.env,
  PORT: process.env.PBMP_LIBRECHAT_API_PORT || '5201',
  HOST: '0.0.0.0',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://www.grow24.ai',
};
const pbmpTsx = path.join(pbmpLibreDir, 'node_modules/tsx/dist/cli.mjs');
if (fs.existsSync(pbmpLibreDir)) {
  const distEntry = path.join(pbmpLibreDir, 'dist/index.js');
  const srcEntry = path.join(pbmpLibreDir, 'src/index.ts');
  if (fs.existsSync(distEntry)) {
    run('pbmp-librechat-api', 'node', [distEntry], { cwd: pbmpLibreDir, env: pbmpLibreEnv });
  } else if (fs.existsSync(srcEntry) && fs.existsSync(pbmpTsx)) {
    run('pbmp-librechat-api', 'node', [pbmpTsx, srcEntry], { cwd: pbmpLibreDir, env: pbmpLibreEnv });
  } else {
    console.error('[start-all] pbmp-librechat API entry missing');
  }
  console.log('[start-all] PBMP_LibreChat API: local on :5201 → /PBMP_LibreChat/api');
} else {
  console.error('[start-all] /app/pbmp-librechat-api missing');
}

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

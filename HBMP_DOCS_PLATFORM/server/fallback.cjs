#!/usr/bin/env node
/**
 * Production Docs API. Uses Prisma when available so /projects can load.
 */
const { execSync } = require('child_process');
const path = require('path');

const PORT = Number(process.env.PORT || 4000);
const HOST = '0.0.0.0';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:/app/data/docs.db';

try {
  execSync('npx prisma migrate deploy', { cwd: __dirname, stdio: 'inherit' });
} catch {
  try {
    execSync('npx prisma db push --skip-generate', { cwd: __dirname, stdio: 'inherit' });
  } catch (error) {
    console.error('[docs-api] migrate failed, continuing with empty/in-memory responses', error.message);
  }
}

let prisma = null;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (error) {
  console.error('[docs-api] Prisma client unavailable', error.message);
}

const express = require('express');
const cors = require('cors');

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  }),
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/projects', async (_req, res) => {
  try {
    if (!prisma) {
      res.json({ projects: [] });
      return;
    }
    const projects = await prisma.project.findMany({
      include: { dockets: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ projects });
  } catch (error) {
    console.error('[docs-api] list projects failed', error);
    res.json({ projects: [] });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    if (!prisma) {
      res.status(503).json({ error: { message: 'Database is not ready' } });
      return;
    }
    const project = await prisma.project.create({
      data: {
        name: String(req.body?.name || '').trim() || 'Untitled project',
        description: req.body?.description || '',
        clientName: req.body?.clientName || '',
      },
    });
    res.json(project);
  } catch (error) {
    console.error('[docs-api] create project failed', error);
    res.status(500).json({ error: { message: error.message || 'Failed to create project' } });
  }
});

app.get('/api/projects/:projectId', async (req, res) => {
  try {
    if (!prisma) {
      res.status(404).json({ error: { message: 'Project not found' } });
      return;
    }
    const project = await prisma.project.findUnique({
      where: { id: req.params.projectId },
      include: { dockets: true, documents: true },
    });
    if (!project) {
      res.status(404).json({ error: { message: 'Project not found' } });
      return;
    }
    res.json(project);
  } catch (error) {
    console.error('[docs-api] get project failed', error);
    res.status(500).json({ error: { message: error.message || 'Failed to fetch project' } });
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

app.listen(PORT, HOST, () => {
  console.log(`[docs-api] listening on http://${HOST}:${PORT}`);
  console.log(`[docs-api] schema dir ${path.join(__dirname, 'prisma')}`);
});

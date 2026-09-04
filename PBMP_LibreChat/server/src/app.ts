import express from 'express';
import cors from 'cors';
import {
  AGENT_CHAINS,
  AGENTS,
  ARTIFACT_CAPABILITIES,
  ARTIFACT_RUNTIME,
  CANVAS_TREE,
  INTERPRETER_LANGUAGES,
  LAYERS,
  MCP_TOOLS,
  NATIVE_ARTIFACT_TYPES,
  PRODUCT_VS_MODEL,
  SEMANTIC_LAYER,
  SKILLS,
  STRATEGIC_POSITIONING,
} from './catalog';
import { callMcp, MCP_REGISTRY } from './services/mcp';
import { interpreterCatalog, runInterpreter } from './services/interpreter';
import { listMemory, seedMemory } from './services/memory';
import { modelGatewayStatus } from './services/models';
import { orchestrate } from './services/orchestrator';
import { runProgrammaticTools } from './services/programmatic';
import type { ChatRequest } from './types';

seedMemory();

const app = express();
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    name: 'PBMP_LibreChat',
    role: 'open-source AI workspace + model gateway + agent runtime + multi-agent orchestrator + tool runtime + generative-UI environment',
    layers: LAYERS,
  });
});

app.get('/api/catalog', (_req, res) => {
  res.json({
    layers: LAYERS,
    artifactCapabilities: ARTIFACT_CAPABILITIES,
    nativeArtifactTypes: NATIVE_ARTIFACT_TYPES,
    artifactRuntime: ARTIFACT_RUNTIME,
    canvasTree: CANVAS_TREE,
    models: modelGatewayStatus(),
    agents: AGENTS,
    skills: SKILLS,
    chains: AGENT_CHAINS,
    interpreter: interpreterCatalog(),
    mcp: { registry: MCP_REGISTRY, tools: MCP_TOOLS },
    semantic: SEMANTIC_LAYER,
    productVsModel: PRODUCT_VS_MODEL,
    strategy: STRATEGIC_POSITIONING,
  });
});

app.get('/api/models', (_req, res) => {
  res.json({ models: modelGatewayStatus(), productVsModel: PRODUCT_VS_MODEL });
});

app.get('/api/agents', (_req, res) => {
  res.json({ agents: AGENTS, skills: SKILLS, chains: AGENT_CHAINS });
});

app.get('/api/semantic', (_req, res) => {
  res.json({ entities: SEMANTIC_LAYER, owns: STRATEGIC_POSITIONING.pbmpOwns });
});

app.get('/api/memory', (_req, res) => {
  res.json({ records: listMemory() });
});

app.get('/api/tools', (_req, res) => {
  res.json({
    mcp: { registry: MCP_REGISTRY, tools: MCP_TOOLS },
    interpreter: interpreterCatalog(),
    languages: INTERPRETER_LANGUAGES,
    programmaticToolCalling: {
      description:
        'The model generates Python/code that orchestrates registered tools with loops, conditionals, retries and intermediate result processing.',
    },
  });
});

app.post('/api/mcp/:toolId', (req, res) => {
  try {
    const toolId = String(req.params.toolId);
    const result = callMcp(toolId.includes('.') ? toolId : `pbmp.${toolId}.list`, req.body || {});
    res.json({ tool: toolId, result });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

app.post('/api/interpreter', async (req, res) => {
  const { language, code } = req.body || {};
  if (!language || !code) {
    res.status(400).json({ error: 'language and code are required' });
    return;
  }
  const result = await runInterpreter(String(language), String(code));
  res.json(result);
});

app.post('/api/programmatic', (req, res) => {
  const kind = (req.body?.kind || 'profitability') as 'customers-metrics' | 'markets-blend' | 'profitability';
  res.json(runProgrammaticTools(kind));
});

app.post('/api/chat', async (req, res) => {
  try {
    const body = req.body as ChatRequest;
    if (!body?.message || typeof body.message !== 'string') {
      res.status(400).json({ error: 'message is required' });
      return;
    }
    const result = await orchestrate(body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

export default app;

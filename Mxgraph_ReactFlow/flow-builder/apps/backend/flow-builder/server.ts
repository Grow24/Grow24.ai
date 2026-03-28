import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

interface CorsOptions {
  origin: string[];
}

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] } as CorsOptions));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Flow Builder API Server',
    status: 'running',
    endpoints: {
      'GET /api/flows': 'List all flows',
      'GET /api/flows/:id': 'Get specific flow',
      'POST /api/flows': 'Create new flow',
      'PUT /api/flows/:id': 'Update flow'
    }
  });
});

// Zod schemas
const nodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.record(z.any()),
  position: z.object({ x: z.number(), y: z.number() }),
});
const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  data: z.record(z.any()).optional(),
});
const flowSchema = z.object({
  name: z.string(),
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
});

// GET /api/flows - list all flows
app.get('/api/flows', async (req, res) => {
  const flows = await prisma.flowMaster.findMany();
  res.json(flows);
});

// GET /api/flows/:id - get flow with nodes/edges
app.get('/api/flows/:id', async (req, res) => {
  const { id } = req.params;
  const flow = await prisma.flowMaster.findUnique({
    where: { id: Number(id) },
    include: {
      nodes: true,
      edges: true,
    },
  });
  if (!flow) return res.status(404).json({ error: 'Flow not found' });
  
  // Parse JSON strings back to objects
  const parsedFlow = {
    ...flow,
    nodes: flow.nodes.map((node: any) => ({
      id: node.nodeId,
      type: node.type,
      data: JSON.parse(node.data),
      position: JSON.parse(node.position),
    })),
    edges: flow.edges.map((edge: any) => ({
      id: edge.edgeId,
      source: edge.source,
      target: edge.target,
      data: edge.data ? JSON.parse(edge.data) : null,
    })),
  };
  
  res.json(parsedFlow);
});

// POST /api/flows - create new flow
app.post('/api/flows', async (req, res) => {
  const parse = flowSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error });
  const { name, nodes, edges } = parse.data;
  const flow = await prisma.flowMaster.create({
    data: {
      name,
      nodes: {
        create: nodes.map(node => ({
          nodeId: node.id,
          type: node.type,
          data: JSON.stringify(node.data),
          position: JSON.stringify(node.position),
        })),
      },
      edges: {
        create: edges.map(edge => ({
          edgeId: edge.id,
          source: edge.source,
          target: edge.target,
          data: edge.data ? JSON.stringify(edge.data) : null,
        })),
      },
    },
    include: { nodes: true, edges: true },
  });
  
  // Parse JSON strings back to objects
  const parsedFlow = {
    ...flow,
    nodes: flow.nodes.map((node: any) => ({
      id: node.nodeId,
      type: node.type,
      data: JSON.parse(node.data),
      position: JSON.parse(node.position),
    })),
    edges: flow.edges.map((edge: any) => ({
      id: edge.edgeId,
      source: edge.source,
      target: edge.target,
      data: edge.data ? JSON.parse(edge.data) : null,
    })),
  };
  
  res.status(201).json(parsedFlow);
});

// PUT /api/flows/:id - update flow
app.put('/api/flows/:id', async (req, res) => {
  const { id } = req.params;
  const parse = flowSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error });
  const { name, nodes, edges } = parse.data;
  // Delete old nodes/edges, then recreate
  await prisma.nodeMaster.deleteMany({ where: { flowId: Number(id) } });
  await prisma.edgeMaster.deleteMany({ where: { flowId: Number(id) } });
  const flow = await prisma.flowMaster.update({
    where: { id: Number(id) },
    data: {
      name,
      nodes: {
        create: nodes.map(node => ({
          nodeId: node.id,
          type: node.type,
          data: JSON.stringify(node.data),
          position: JSON.stringify(node.position),
        })),
      },
      edges: {
        create: edges.map(edge => ({
          edgeId: edge.id,
          source: edge.source,
          target: edge.target,
          data: edge.data ? JSON.stringify(edge.data) : null,
        })),
      },
    },
    include: { nodes: true, edges: true },
  });
  
  // Parse JSON strings back to objects
  const parsedFlow = {
    ...flow,
    nodes: flow.nodes.map((node: any) => ({
      id: node.nodeId,
      type: node.type,
      data: JSON.parse(node.data),
      position: JSON.parse(node.position),
    })),
    edges: flow.edges.map((edge: any) => ({
      id: edge.edgeId,
      source: edge.source,
      target: edge.target,
      data: edge.data ? JSON.parse(edge.data) : null,
    })),
  };
  
  res.json(parsedFlow);
});

app.listen(4000, () => {
  console.log('API server running on http://localhost:4000');
});

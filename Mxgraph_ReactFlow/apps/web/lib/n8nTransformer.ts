/**
 * n8n Workflow Transformer
 * Converts HBMP React Flow diagrams to n8n workflow format
 */

import { Node, Edge } from 'reactflow';

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters: Record<string, any>;
  typeVersion?: number;
}

export interface N8nConnection {
  node: string;
  type: string;
  index: number;
}

export interface N8nWorkflow {
  name: string;
  nodes: N8nNode[];
  connections: Record<string, { main: N8nConnection[][] }>;
  active: boolean;
  settings: Record<string, any>;
}

/**
 * Map HBMP node types to n8n node types
 */
const NODE_TYPE_MAP: Record<string, string> = {
  flowStart: 'n8n-nodes-base.webhook',
  flowAction: 'n8n-nodes-base.httpRequest',
  flowDecision: 'n8n-nodes-base.if',
  flowProcess: 'n8n-nodes-base.function',
  flowTable: 'n8n-nodes-base.spreadsheetFile',
  flowEnd: 'n8n-nodes-base.noOp',
  processTask: 'n8n-nodes-base.httpRequest',
  gateway: 'n8n-nodes-base.if',
  event: 'n8n-nodes-base.webhook',
  api: 'n8n-nodes-base.httpRequest',
  db: 'n8n-nodes-base.postgres',
  service: 'n8n-nodes-base.httpRequest',
};

/**
 * Transform HBMP nodes to n8n nodes
 */
function transformNodes(nodes: Node[]): N8nNode[] {
  return nodes
    .filter(node => node.type !== 'lane') // Skip swimlanes
    .map((node, index) => ({
      id: node.id,
      name: node.data?.label || `Node ${index + 1}`,
      type: NODE_TYPE_MAP[node.type || 'flowAction'] || 'n8n-nodes-base.noOp',
      position: [node.position.x, node.position.y],
      typeVersion: 1,
      parameters: transformNodeParameters(node),
    }));
}

/**
 * Transform node-specific parameters
 */
function transformNodeParameters(node: Node): Record<string, any> {
  const params: Record<string, any> = {};

  switch (node.type) {
    case 'flowStart':
    case 'event':
      params.path = 'webhook-trigger';
      params.httpMethod = 'POST';
      params.responseMode = 'onReceived';
      break;

    case 'flowAction':
    case 'api':
    case 'processTask':
      params.method = node.data?.method || 'GET';
      params.url = node.data?.endpoint || node.data?.url || 'https://api.example.com';
      params.authentication = 'none';
      break;

    case 'flowDecision':
    case 'gateway':
      params.conditions = {
        boolean: [
          {
            value1: node.data?.condition || '={{ $json.value }}',
            value2: node.data?.compareValue || 'true',
          },
        ],
      };
      break;

    case 'flowProcess':
      params.functionCode = node.data?.code || 'return items;';
      break;

    case 'db':
      params.operation = 'executeQuery';
      params.query = node.data?.query || 'SELECT * FROM table';
      break;

    default:
      params.notice = `Converted from HBMP ${node.type}`;
  }

  return params;
}

/**
 * Transform HBMP edges to n8n connections
 */
function transformConnections(
  edges: Edge[],
  nodes: Node[]
): Record<string, { main: N8nConnection[][] }> {
  const connections: Record<string, { main: N8nConnection[][] }> = {};

  // Filter out edges connected to swimlanes
  const validEdges = edges.filter(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    return sourceNode?.type !== 'lane' && targetNode?.type !== 'lane';
  });

  validEdges.forEach(edge => {
    if (!connections[edge.source]) {
      connections[edge.source] = { main: [[]] };
    }

    connections[edge.source].main[0].push({
      node: edge.target,
      type: 'main',
      index: 0,
    });
  });

  return connections;
}

/**
 * Main transformer function
 */
export function transformToN8n(
  nodes: Node[],
  edges: Edge[],
  workflowName: string = 'HBMP Workflow'
): N8nWorkflow {
  const n8nNodes = transformNodes(nodes);
  const n8nConnections = transformConnections(edges, nodes);

  return {
    name: workflowName,
    nodes: n8nNodes,
    connections: n8nConnections,
    active: false,
    settings: {
      executionOrder: 'v1',
    },
  };
}

/**
 * Export workflow as downloadable JSON
 */
export function downloadN8nWorkflow(workflow: N8nWorkflow): void {
  const blob = new Blob([JSON.stringify(workflow, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${workflow.name.replace(/\s+/g, '-').toLowerCase()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate workflow summary for display
 */
export function getWorkflowSummary(workflow: N8nWorkflow): string {
  const nodeCount = workflow.nodes.length;
  const connectionCount = Object.keys(workflow.connections).length;
  const nodeTypes = [...new Set(workflow.nodes.map(n => n.type))];

  return `
📊 Workflow Summary:
- Name: ${workflow.name}
- Nodes: ${nodeCount}
- Connections: ${connectionCount}
- Node Types: ${nodeTypes.length}

Ready to import into n8n!
  `.trim();
}

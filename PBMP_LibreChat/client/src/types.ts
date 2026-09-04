export type ArtifactKind =
  | 'markdown'
  | 'html'
  | 'react'
  | 'svg'
  | 'mermaid'
  | 'dashboard'
  | 'chart'
  | 'form'
  | 'calendar'
  | 'scene3d'
  | 'video'
  | 'audio'
  | 'iframe';

export interface Artifact {
  id: string;
  kind: ArtifactKind;
  title: string;
  support: 'native' | 'extension' | 'restricted';
  content: string;
  data?: any;
}

export interface AgentRun {
  id: string;
  agentId: string;
  parentRunId?: string;
  kind: 'parent' | 'subagent' | 'self-spawn' | 'chain-step';
  modelId: string;
  status: string;
  input: string;
  output: string;
  toolsUsed: string[];
}

export interface ChatResponse {
  conversationId: string;
  messageId: string;
  reply: string;
  modelUsed: string;
  intelligenceSource: string;
  orchestration: {
    semanticMatches: Array<{ id: string; name: string; kind: string; description: string }>;
    agentRuns: AgentRun[];
    chain?: { id: string; name: string; steps: string[] };
    interpreter?: { language: string; code: string; stdout: string; stderr: string; ok: boolean };
    programmatic?: { code: string; calls: Array<{ tool: string; result: unknown }>; dataset?: unknown; notes?: string };
    mcpCalls: Array<{ tool: string; args: unknown; result: unknown }>;
    web?: { query: string; results: Array<{ title: string; url: string; snippet: string }> };
    memoryWritten: Array<{ id: string; scope: string; key: string; value: string }>;
  };
  artifacts: Artifact[];
}

export interface Catalog {
  layers: Record<string, { name: string; role: string; notes: string }>;
  artifactCapabilities: Array<{ form: string; support: string; how: string; native: boolean }>;
  nativeArtifactTypes: string[];
  artifactRuntime: string[];
  canvasTree: any;
  models: any[];
  agents: any[];
  skills: any[];
  chains: any[];
  interpreter: any[];
  mcp: any;
  semantic: any[];
  productVsModel: { modelLevel: string; productLevel: string };
  strategy: any;
}

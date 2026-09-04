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

export type ArtifactSupport = 'native' | 'extension' | 'restricted';

export type ModelProvider = 'openai' | 'anthropic' | 'google' | 'perplexity' | 'qwen';

export interface ModelSpec {
  id: string;
  alias?: string;
  name: string;
  provider: ModelProvider;
  role: string;
  apiModel: string;
  flagship?: boolean;
}

export interface AgentSkill {
  id: string;
  name: string;
  description: string;
}

export interface AgentDef {
  id: string;
  name: string;
  role: string;
  instructions: string;
  modelId: string;
  skills: string[];
  tools: string[];
  mcpServers: string[];
  allowSelf: boolean;
  spawnable: boolean;
  files: string[];
}

export interface AgentChain {
  id: string;
  name: string;
  description: string;
  steps: string[];
}

export interface SemanticEntity {
  id: string;
  name: string;
  kind: 'process' | 'element' | 'relationship' | 'action' | 'template' | 'rule' | 'component' | 'intention';
  description: string;
  related: string[];
}

export interface McpTool {
  id: string;
  server: string;
  name: string;
  description: string;
  inputSchema: Record<string, string>;
}

export interface InterpreterLanguage {
  id: string;
  name: string;
  runtime: string;
  binary?: string;
}

export interface MemoryRecord {
  id: string;
  scope: 'user' | 'agent' | 'workspace' | 'conversation';
  key: string;
  value: string;
  updatedAt: string;
}

export interface Artifact {
  id: string;
  kind: ArtifactKind;
  title: string;
  support: ArtifactSupport;
  content: string;
  data?: unknown;
}

export interface AgentRun {
  id: string;
  agentId: string;
  parentRunId?: string;
  kind: 'parent' | 'subagent' | 'self-spawn' | 'chain-step';
  modelId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  input: string;
  output: string;
  toolsUsed: string[];
  startedAt: string;
  finishedAt?: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  agentId?: string;
  modelId?: string;
  allowSubagents?: boolean;
  allowSelfSpawn?: boolean;
  allowCodeInterpreter?: boolean;
  allowProgrammaticTools?: boolean;
  allowWeb?: boolean;
}

export interface ChatResponse {
  conversationId: string;
  messageId: string;
  reply: string;
  modelUsed: string;
  intelligenceSource: string;
  orchestration: {
    semanticMatches: SemanticEntity[];
    agentRuns: AgentRun[];
    chain?: AgentChain;
    interpreter?: { language: string; code: string; stdout: string; stderr: string; ok: boolean };
    programmatic?: { code: string; calls: Array<{ tool: string; result: unknown }>; dataset?: unknown };
    mcpCalls: Array<{ tool: string; args: unknown; result: unknown }>;
    web?: { query: string; results: Array<{ title: string; url: string; snippet: string }> };
    memoryWritten: MemoryRecord[];
  };
  artifacts: Artifact[];
}

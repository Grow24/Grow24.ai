import type {
  AgentChain,
  AgentDef,
  AgentSkill,
  ArtifactKind,
  ArtifactSupport,
  InterpreterLanguage,
  McpTool,
  ModelSpec,
  SemanticEntity,
} from './types';

export const LAYERS = {
  presentation: {
    name: 'Artifact / Canvas',
    role: 'presentation',
    notes: 'LibreChat Artifacts / Generative UI. Richer than a rich-text editor: Agents generate React, HTML, Markdown, SVG and Mermaid in a separate panel.',
  },
  intelligence: {
    name: 'LLM',
    role: 'intelligence / natural-language understanding',
    notes: 'LibreChat itself is NOT an LLM. It is the orchestration shell. Intelligence comes from the attached model (GPT-5.6 Sol, Claude, Gemini, Qwen, Perplexity).',
  },
  execution: {
    name: 'Agents + tools + code interpreter',
    role: 'backend execution',
    notes: 'Subagents, Agent Chains, self-spawn, Code Interpreter, Programmatic Tool Calling and MCP.',
  },
} as const;

export const ARTIFACT_CAPABILITIES: Array<{
  form: string;
  support: ArtifactSupport;
  how: string;
  kind?: ArtifactKind;
  native: boolean;
}> = [
  { form: 'Formatted text', support: 'native', how: 'Markdown / HTML', kind: 'markdown', native: true },
  { form: 'Headings, lists, tables', support: 'native', how: 'Markdown / HTML', kind: 'markdown', native: true },
  { form: 'Hyperlinks', support: 'native', how: 'Standard Markdown links / HTML', kind: 'markdown', native: true },
  { form: 'Code', support: 'native', how: 'Markdown / HTML', kind: 'markdown', native: true },
  { form: 'Flowcharts / process diagrams', support: 'native', how: 'Mermaid', kind: 'mermaid', native: true },
  { form: 'SVG graphics', support: 'native', how: 'Native artifact type', kind: 'svg', native: true },
  { form: 'Buttons / controls', support: 'native', how: 'React / HTML', kind: 'react', native: true },
  { form: 'Forms / selectors', support: 'native', how: 'React', kind: 'form', native: true },
  { form: 'Interactive dashboards', support: 'native', how: 'React + Recharts', kind: 'dashboard', native: true },
  { form: 'Line / bar / pie charts', support: 'native', how: 'Recharts is pre-installed', kind: 'chart', native: true },
  { form: 'Calendar / date interfaces', support: 'native', how: 'date-fns, react-day-picker', kind: 'calendar', native: true },
  { form: 'Icons', support: 'native', how: 'lucide-react', native: true },
  { form: 'Polished UI components', support: 'native', how: 'shadcn/ui', native: true },
  { form: '3D content', support: 'native', how: 'Three.js is available', kind: 'scene3d', native: true },
  { form: 'Video', support: 'extension', how: 'Not a native artifact type. HTML/React <video> only if sandbox, CSP and media source permit.', kind: 'video', native: false },
  { form: 'Audio', support: 'extension', how: 'Not a native artifact type. Controlled embedding/integration.', kind: 'audio', native: false },
  { form: 'Arbitrary external websites', support: 'restricted', how: 'Restricted by sandbox/CSP. Integration/iframe rules required.', kind: 'iframe', native: false },
];

export const NATIVE_ARTIFACT_TYPES: ArtifactKind[] = ['markdown', 'html', 'react', 'svg', 'mermaid'];

export const ARTIFACT_RUNTIME = [
  'React',
  'Tailwind',
  'Lucide',
  'date-fns',
  'react-day-picker',
  'shadcn/ui',
  'Recharts',
  'Three.js',
];

export const CANVAS_TREE = {
  document: ['Text', 'Tables', 'Links', 'Images/graphics', 'Diagrams'],
  interactiveUi: ['Forms', 'Buttons', 'Filters', 'Charts', 'Dashboards', '2D graphics', '3D scenes'],
  externalRichMedia: [
    { name: 'Video', note: 'extension/integration' },
    { name: 'Audio', note: 'extension/integration' },
    { name: 'External app', note: 'integration/iframe rules' },
  ],
};

export const MODELS: ModelSpec[] = [
  {
    id: 'gpt-5.6-sol',
    alias: 'gpt-5.6',
    name: 'GPT-5.6 Sol',
    provider: 'openai',
    role: 'Flagship model for complex professional reasoning and coding. Powers knowledge work, research, coding, science, computer use and design.',
    apiModel: 'gpt-5.6-sol',
    flagship: true,
  },
  {
    id: 'claude-sonnet',
    name: 'Claude',
    provider: 'anthropic',
    role: 'Contracts, critique, long-context synthesis.',
    apiModel: 'claude-sonnet-4-5',
  },
  {
    id: 'gemini-pro',
    name: 'Gemini',
    provider: 'google',
    role: 'Multimodal analysis and broad knowledge work.',
    apiModel: 'gemini-2.5-pro',
  },
  {
    id: 'perplexity-sonar',
    name: 'Perplexity',
    provider: 'perplexity',
    role: 'Live web research.',
    apiModel: 'sonar-pro',
  },
  {
    id: 'qwen-plus',
    name: 'Qwen',
    provider: 'qwen',
    role: 'Open-weight alternative for cost-efficient reasoning.',
    apiModel: 'qwen-plus',
  },
];

export const SKILLS: AgentSkill[] = [
  { id: 'pbmp-semantics', name: 'PBMP Semantics', description: 'Map user intent onto processes, elements, relationships, actions, templates and rules.' },
  { id: 'executive-synthesis', name: 'Executive Synthesis', description: 'Combine specialist outputs into a decision-ready brief.' },
  { id: 'web-research', name: 'Web Research', description: 'Current-market and competitive research via web/search tools.' },
  { id: 'quantitative', name: 'Quantitative Analysis', description: 'Python/JS modelling, ratios, forecasts and sensitivity.' },
  { id: 'risk-contracts', name: 'Risk & Contracts', description: 'Legal, contractual and operational risk review.' },
  { id: 'generative-ui', name: 'Generative UI', description: 'Produce React/Markdown/Mermaid/SVG/Recharts artifacts.' },
  { id: 'code-orchestration', name: 'Programmatic Tool Calling', description: 'Write a program that loops MCP tools instead of one-shot API calls.' },
  { id: 'workbench', name: 'PBMP Workbench', description: 'Governed templates, workbench functionality and business data.' },
];

export const AGENTS: AgentDef[] = [
  {
    id: 'main-pbmp',
    name: 'Main PBMP Agent',
    role: 'Parent orchestrator',
    instructions:
      'You are the Main PBMP Agent. You never pretend to be multiple personas in one prompt. When a task is large, spawn isolated subagents or a self-copy. Combine their results into an executive synthesis and emit artifacts.',
    modelId: 'gpt-5.6-sol',
    skills: ['pbmp-semantics', 'executive-synthesis', 'generative-ui', 'code-orchestration', 'workbench'],
    tools: ['web', 'code-interpreter', 'programmatic-tools', 'memory', 'artifacts'],
    mcpServers: ['pbmp'],
    allowSelf: true,
    spawnable: false,
    files: ['pbmp-operating-model.md', 'governed-templates.json'],
  },
  {
    id: 'strategy',
    name: 'Strategy Agent',
    role: 'Investment and market strategy',
    instructions: 'Lead market attractiveness, investment recommendation and synthesis of research + internal data + financial modelling.',
    modelId: 'gpt-5.6-sol',
    skills: ['pbmp-semantics', 'executive-synthesis', 'generative-ui'],
    tools: ['web', 'code-interpreter', 'programmatic-tools'],
    mcpServers: ['pbmp'],
    allowSelf: true,
    spawnable: true,
    files: [],
  },
  {
    id: 'research',
    name: 'Research Agent',
    role: 'External research',
    instructions: 'Collect current web data. Prefer Perplexity. Return sources and structured findings only.',
    modelId: 'perplexity-sonar',
    skills: ['web-research'],
    tools: ['web'],
    mcpServers: [],
    allowSelf: false,
    spawnable: true,
    files: [],
  },
  {
    id: 'finance',
    name: 'Finance Agent',
    role: 'Financial analysis',
    instructions: 'Run Python/quantitative analysis on internal and modelled numbers. Do not calculate mentally when Code Interpreter is available.',
    modelId: 'gpt-5.6-sol',
    skills: ['quantitative'],
    tools: ['code-interpreter', 'programmatic-tools'],
    mcpServers: ['pbmp'],
    allowSelf: false,
    spawnable: true,
    files: ['finance-playbook.md'],
  },
  {
    id: 'risk',
    name: 'Risk Agent',
    role: 'Risk and contracts',
    instructions: 'Review contracts, operational and regulatory risk. Use Claude when available.',
    modelId: 'claude-sonnet',
    skills: ['risk-contracts'],
    tools: ['memory'],
    mcpServers: ['pbmp'],
    allowSelf: false,
    spawnable: true,
    files: ['contract-library.md'],
  },
  {
    id: 'market-research',
    name: 'Market Research Subagent',
    role: 'India / regional market scan',
    instructions: 'Find attractive markets using live web research.',
    modelId: 'perplexity-sonar',
    skills: ['web-research'],
    tools: ['web'],
    mcpServers: [],
    allowSelf: false,
    spawnable: true,
    files: [],
  },
  {
    id: 'internal-data',
    name: 'Internal Data Subagent',
    role: 'Company data via PBMP MCP',
    instructions: 'Read customers, transactions and operating metrics through PBMP MCP. Prefer programmatic loops over one-shot calls.',
    modelId: 'gpt-5.6-sol',
    skills: ['code-orchestration', 'workbench'],
    tools: ['programmatic-tools'],
    mcpServers: ['pbmp'],
    allowSelf: false,
    spawnable: true,
    files: [],
  },
  {
    id: 'financial-model',
    name: 'Financial Modelling Subagent',
    role: 'Python modelling',
    instructions: 'Use GPT-5.6 + Python Code Interpreter for forecasts, conversion, NPV-style comparisons.',
    modelId: 'gpt-5.6-sol',
    skills: ['quantitative'],
    tools: ['code-interpreter'],
    mcpServers: [],
    allowSelf: false,
    spawnable: true,
    files: [],
  },
  {
    id: 'quantitative',
    name: 'Quantitative Analysis Agent',
    role: 'Specialist quantitative agent with Code Interpreter',
    instructions: 'Specialist Agent spawned instead of ad-hoc Python. Owns Code Interpreter.',
    modelId: 'gpt-5.6-sol',
    skills: ['quantitative'],
    tools: ['code-interpreter'],
    mcpServers: ['pbmp'],
    allowSelf: false,
    spawnable: true,
    files: [],
  },
  {
    id: 'critic',
    name: 'Critic Agent',
    role: 'Chain critic',
    instructions: 'Challenge assumptions, missing risks and weak evidence before the report is issued.',
    modelId: 'claude-sonnet',
    skills: ['risk-contracts', 'executive-synthesis'],
    tools: ['memory'],
    mcpServers: [],
    allowSelf: false,
    spawnable: true,
    files: [],
  },
  {
    id: 'analysis',
    name: 'Analysis Agent',
    role: 'Chain analyst',
    instructions: 'Turn research into structured analysis against PBMP processes and rules.',
    modelId: 'gpt-5.6-sol',
    skills: ['pbmp-semantics', 'quantitative'],
    tools: ['code-interpreter'],
    mcpServers: ['pbmp'],
    allowSelf: false,
    spawnable: true,
    files: [],
  },
  {
    id: 'report',
    name: 'Report Agent',
    role: 'Chain reporter',
    instructions: 'Produce the final report plus dashboard/map artifacts.',
    modelId: 'gpt-5.6-sol',
    skills: ['generative-ui', 'executive-synthesis'],
    tools: ['artifacts'],
    mcpServers: [],
    allowSelf: false,
    spawnable: true,
    files: ['report-template.md'],
  },
];

export const AGENT_CHAINS: AgentChain[] = [
  {
    id: 'research-to-report',
    name: 'Research → Analysis → Critic → Report',
    description: 'Predefined graph-level multi-agent workflow (Agent Chain), not runtime delegation.',
    steps: ['research', 'analysis', 'critic', 'report'],
  },
  {
    id: 'acquisition',
    name: 'Acquisition analysis chain',
    description: 'Research, finance and risk specialists then executive synthesis.',
    steps: ['research', 'finance', 'risk', 'main-pbmp'],
  },
];

export const INTERPRETER_LANGUAGES: InterpreterLanguage[] = [
  { id: 'python', name: 'Python', runtime: 'python-sandbox', binary: 'python3' },
  { id: 'javascript', name: 'JavaScript', runtime: 'node-vm' },
  { id: 'typescript', name: 'TypeScript', runtime: 'node-vm' },
  { id: 'go', name: 'Go', runtime: 'go-sandbox', binary: 'go' },
  { id: 'c', name: 'C', runtime: 'c-sandbox', binary: 'gcc' },
  { id: 'cpp', name: 'C++', runtime: 'cpp-sandbox', binary: 'g++' },
  { id: 'java', name: 'Java', runtime: 'java-sandbox', binary: 'java' },
  { id: 'php', name: 'PHP', runtime: 'php-sandbox', binary: 'php' },
  { id: 'rust', name: 'Rust', runtime: 'rust-sandbox', binary: 'rustc' },
  { id: 'fortran', name: 'Fortran', runtime: 'fortran-sandbox', binary: 'gfortran' },
  { id: 'r', name: 'R', runtime: 'r-sandbox', binary: 'Rscript' },
];

export const MCP_TOOLS: McpTool[] = [
  {
    id: 'pbmp.customers.list',
    server: 'pbmp',
    name: 'customers',
    description: 'List PBMP customers with region, product and attractiveness score.',
    inputSchema: { region: 'string?', product: 'string?' },
  },
  {
    id: 'pbmp.transactions.list',
    server: 'pbmp',
    name: 'transactions',
    description: 'List transactions for a customer or period.',
    inputSchema: { customerId: 'string?', month: 'string?' },
  },
  {
    id: 'pbmp.markets.scan',
    server: 'pbmp',
    name: 'markets',
    description: 'Internal view of Indian markets and coverage.',
    inputSchema: { country: 'string?' },
  },
  {
    id: 'pbmp.contracts.list',
    server: 'pbmp',
    name: 'contracts',
    description: 'Contract corpus for risk review.',
    inputSchema: { counterparty: 'string?' },
  },
  {
    id: 'pbmp.pipeline.byRegion',
    server: 'pbmp',
    name: 'pipeline',
    description: 'Sales pipeline by region and product.',
    inputSchema: { product: 'string?' },
  },
];

export const SEMANTIC_LAYER: SemanticEntity[] = [
  { id: 'intention-analyse-profit', name: 'Analyse profitability deterioration', kind: 'intention', description: 'User wants causal analysis of falling profitability.', related: ['process-performance', 'action-spawn-finance', 'template-exec-brief'] },
  { id: 'intention-acquisition', name: 'Prepare acquisition analysis', kind: 'intention', description: 'Delegate research, finance and risk then synthesise.', related: ['process-acquisition', 'action-spawn-subagents', 'template-acquisition'] },
  { id: 'intention-markets-india', name: 'Find attractive India markets', kind: 'intention', description: 'Market research + internal data + financial modelling + artifacts.', related: ['process-market-entry', 'action-spawn-strategy-tree', 'template-investment'] },
  { id: 'intention-dashboard', name: 'Create interactive sales dashboard', kind: 'intention', description: 'Generative UI dashboard, not a picture of a dashboard.', related: ['component-dashboard', 'action-artifact-engine', 'template-sales-dashboard'] },
  { id: 'process-performance', name: 'Performance management', kind: 'process', description: 'Connects goals, operating metrics and value realisation.', related: ['element-kpi', 'rule-governed-numbers'] },
  { id: 'process-acquisition', name: 'Acquisition diligence', kind: 'process', description: 'Research, finance, risk, executive synthesis.', related: ['element-target', 'rule-segregation-of-agents'] },
  { id: 'process-market-entry', name: 'Market entry / investment', kind: 'process', description: 'Attractiveness, coverage, modelling, recommendation.', related: ['element-market', 'rule-evidence-before-bet'] },
  { id: 'element-kpi', name: 'KPI / conversion / margin', kind: 'element', description: 'Measurable operating and commercial metrics.', related: ['relationship-intent-to-value'] },
  { id: 'element-target', name: 'Acquisition target', kind: 'element', description: 'Company or asset under diligence.', related: ['relationship-research-finance-risk'] },
  { id: 'element-market', name: 'Geographic market', kind: 'element', description: 'Region or city cluster for product expansion.', related: ['relationship-web-to-internal'] },
  { id: 'relationship-intent-to-value', name: 'Intent → value', kind: 'relationship', description: 'PBMP bridge from intention-triggered workflow to value realisation.', related: [] },
  { id: 'relationship-research-finance-risk', name: 'Research ⊕ Finance ⊕ Risk', kind: 'relationship', description: 'Runtime delegation, not persona-prompting.', related: [] },
  { id: 'relationship-web-to-internal', name: 'Web research ⊕ company data', kind: 'relationship', description: 'Perplexity/web plus PBMP MCP.', related: [] },
  { id: 'action-spawn-subagents', name: 'Spawn isolated child agents', kind: 'action', description: 'Each child gets own context, tools, model, skills, MCP.', related: [] },
  { id: 'action-spawn-self', name: 'Self-spawn copies', kind: 'action', description: 'allowSelf: parent creates isolated copies of itself.', related: [] },
  { id: 'action-spawn-finance', name: 'Spawn Finance / Quantitative agent', kind: 'action', description: 'Option A specialist agent or Option B direct Code Interpreter.', related: [] },
  { id: 'action-spawn-strategy-tree', name: 'Strategy tree: market + internal + financial', kind: 'action', description: 'Subagents + Python + MCP then artifact engine.', related: [] },
  { id: 'action-artifact-engine', name: 'Emit generative UI artifacts', kind: 'action', description: 'Report, dashboard, map/chart in the canvas.', related: [] },
  { id: 'template-exec-brief', name: 'Executive profitability brief', kind: 'template', description: 'Governed template for causal profit analysis.', related: [] },
  { id: 'template-acquisition', name: 'Acquisition memo', kind: 'template', description: 'Governed diligence memo.', related: [] },
  { id: 'template-investment', name: 'Investment recommendation', kind: 'template', description: 'Five-market recommendation with dashboard and map.', related: [] },
  { id: 'template-sales-dashboard', name: 'Sales pipeline dashboard', kind: 'template', description: 'Interactive UI with product switcher.', related: [] },
  { id: 'rule-not-llm-api-only', name: 'Do not wire PBMP → LLM API only', kind: 'rule', description: 'Too primitive. PBMP supplies semantics; LibreChat is the agent runtime.', related: [] },
  { id: 'rule-intelligence-from-model', name: 'Intelligence comes from the model', kind: 'rule', description: 'LibreChat does not understand language at GPT-5.6 quality by itself.', related: [] },
  { id: 'rule-chatgpt-not-identical', name: 'API ≠ ChatGPT product', kind: 'rule', description: 'Same model family can be close; ChatGPT adds proprietary orchestration.', related: [] },
  { id: 'rule-segregation-of-agents', name: 'Real runtime delegation', kind: 'rule', description: 'Subagents are isolated runs, not prompt-personas.', related: [] },
  { id: 'rule-governed-numbers', name: 'Do not calculate mentally', kind: 'rule', description: 'Use Code Interpreter when numbers matter.', related: [] },
  { id: 'rule-evidence-before-bet', name: 'Evidence before investment bets', kind: 'rule', description: 'Web + internal MCP + model before recommendation.', related: [] },
  { id: 'component-dashboard', name: 'Workbench dashboard component', kind: 'component', description: 'Governed interactive dashboard in the artifact canvas.', related: [] },
];

export const PRODUCT_VS_MODEL = {
  modelLevel: 'Potentially very close if GPT-5.6 Sol is attached — same model family.',
  productLevel:
    'Not automatic. ChatGPT product = GPT-5.6 Sol + context + orchestration (web, files, code, tools, memory, agents). LibreChat → GPT-5.6 Sol gives the underlying intelligence. Matching ChatGPT also needs system instructions, tools, web, file search, memory, code execution, subagents, context management and MCP.',
};

export const STRATEGIC_POSITIONING = {
  antiPattern: 'PBMP → LLM API',
  pattern: 'PBMP → Business Semantic Layer → LibreChat (agent runtime) → Model layer + Execution (MCP / Code / Web)',
  pbmpOwns: [
    'Business semantics',
    'Components',
    'Relationships',
    'Intentions',
    'Processes',
    'Governed templates',
    'Workbench functionality',
    'Business data',
  ],
  libreChatOwns: [
    'Open-source AI workspace',
    'Model gateway',
    'Agent runtime',
    'Multi-agent orchestrator',
    'Tool runtime',
    'Generative-UI environment',
  ],
  directAnswers: [
    { q: 'Can the Canvas contain rich information?', a: 'Yes. Text, links, tables, interactive UI, dashboards, charts, diagrams, SVG and even 3D. Video/audio are not first-class Artifact types and may require controlled embedding/integration.' },
    { q: 'Can it understand natural language as well as GPT-5.6?', a: 'Yes, if you attach GPT-5.6 Sol — but the intelligence comes from GPT-5.6, not LibreChat. Exact ChatGPT product behaviour is not guaranteed.' },
    { q: 'Can it spawn backend workers/Agents?', a: 'Yes. Subagents, Agent Chains, self-spawning agents, Code Interpreter, Programmatic Tool Calling and MCP are all available.' },
    { q: 'Can it run Python itself?', a: 'Yes. In an isolated Code Interpreter sandbox.' },
    { q: 'Can Python then orchestrate business tools?', a: 'Yes. Programmatic Tool Calling can expose selected MCP tools to sandbox-generated code.' },
    { q: 'Can different spawned Agents use different models/tools?', a: 'Yes. A child Agent can have a different model, instructions, Skills, files and tools.' },
  ],
};

export const CUSTOMERS = [
  { id: 'c-north', name: 'North Retail Co', region: 'North', product: 'PBMP One', attractiveness: 0.82, margin: 0.18 },
  { id: 'c-west', name: 'West Manufacturing', region: 'West', product: 'PBMP One', attractiveness: 0.74, margin: 0.11 },
  { id: 'c-south', name: 'South Hospitals', region: 'South', product: 'PBMP Workbench', attractiveness: 0.91, margin: 0.24 },
  { id: 'c-east', name: 'East Logistics', region: 'East', product: 'PBMP Workbench', attractiveness: 0.66, margin: 0.09 },
  { id: 'c-central', name: 'Central Agri Co-op', region: 'Central', product: 'PBMP One', attractiveness: 0.71, margin: 0.14 },
];

export const TRANSACTIONS = [
  { id: 't1', customerId: 'c-north', month: '2026-01', revenue: 420, cogs: 310 },
  { id: 't2', customerId: 'c-north', month: '2026-02', revenue: 405, cogs: 318 },
  { id: 't3', customerId: 'c-north', month: '2026-03', revenue: 388, cogs: 329 },
  { id: 't4', customerId: 'c-west', month: '2026-01', revenue: 510, cogs: 430 },
  { id: 't5', customerId: 'c-west', month: '2026-02', revenue: 495, cogs: 441 },
  { id: 't6', customerId: 'c-west', month: '2026-03', revenue: 470, cogs: 448 },
  { id: 't7', customerId: 'c-south', month: '2026-01', revenue: 610, cogs: 420 },
  { id: 't8', customerId: 'c-south', month: '2026-02', revenue: 640, cogs: 430 },
  { id: 't9', customerId: 'c-south', month: '2026-03', revenue: 655, cogs: 428 },
  { id: 't10', customerId: 'c-east', month: '2026-01', revenue: 280, cogs: 240 },
  { id: 't11', customerId: 'c-east', month: '2026-02', revenue: 265, cogs: 247 },
  { id: 't12', customerId: 'c-east', month: '2026-03', revenue: 250, cogs: 249 },
  { id: 't13', customerId: 'c-central', month: '2026-01', revenue: 190, cogs: 150 },
  { id: 't14', customerId: 'c-central', month: '2026-02', revenue: 185, cogs: 152 },
  { id: 't15', customerId: 'c-central', month: '2026-03', revenue: 176, cogs: 155 },
];

export const PIPELINE = [
  { region: 'North', product: 'PBMP One', pipeline: 1200, monthly: [80, 92, 88, 101, 97, 110], conversion: 0.22 },
  { region: 'West', product: 'PBMP One', pipeline: 980, monthly: [70, 74, 69, 77, 81, 76], conversion: 0.18 },
  { region: 'South', product: 'PBMP One', pipeline: 1540, monthly: [110, 118, 125, 130, 128, 141], conversion: 0.31 },
  { region: 'East', product: 'PBMP One', pipeline: 640, monthly: [40, 38, 42, 39, 44, 41], conversion: 0.14 },
  { region: 'North', product: 'PBMP Workbench', pipeline: 860, monthly: [55, 58, 61, 60, 66, 70], conversion: 0.27 },
  { region: 'West', product: 'PBMP Workbench', pipeline: 720, monthly: [48, 51, 49, 54, 57, 59], conversion: 0.21 },
  { region: 'South', product: 'PBMP Workbench', pipeline: 1320, monthly: [90, 95, 99, 104, 110, 118], conversion: 0.34 },
  { region: 'East', product: 'PBMP Workbench', pipeline: 410, monthly: [28, 26, 30, 29, 31, 33], conversion: 0.16 },
];

export const INDIA_MARKETS = [
  { id: 'blr', name: 'Bengaluru', attractiveness: 0.93, demand: 'High SaaS / GCCs', coverage: 0.41, capex: 18 },
  { id: 'mum', name: 'Mumbai / MMR', attractiveness: 0.9, demand: 'BFSI + conglomerates', coverage: 0.36, capex: 22 },
  { id: 'hyd', name: 'Hyderabad', attractiveness: 0.87, demand: 'Pharma + GCCs', coverage: 0.22, capex: 14 },
  { id: 'del', name: 'Delhi NCR', attractiveness: 0.86, demand: 'Public + enterprise HQ', coverage: 0.33, capex: 20 },
  { id: 'che', name: 'Chennai', attractiveness: 0.81, demand: 'Manufacturing + IT', coverage: 0.19, capex: 13 },
  { id: 'pune', name: 'Pune', attractiveness: 0.78, demand: 'Auto + engineering', coverage: 0.28, capex: 12 },
  { id: 'ahm', name: 'Ahmedabad', attractiveness: 0.74, demand: 'Industry + mid-market', coverage: 0.11, capex: 10 },
];

export const CONTRACTS = [
  { id: 'k1', counterparty: 'West Manufacturing', clause: 'Price indexation lag of 9 months', risk: 'high' },
  { id: 'k2', counterparty: 'East Logistics', clause: 'Volume commitment without cost pass-through', risk: 'high' },
  { id: 'k3', counterparty: 'North Retail Co', clause: 'Standard MSA with annual uplift', risk: 'low' },
];

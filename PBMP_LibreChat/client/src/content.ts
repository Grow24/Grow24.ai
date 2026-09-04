export const BRIEF = {
  version: 'LibreChat v0.8.7',
  oneLiner:
    'LibreChat is not an AI model. It is an open-source, self-hostable AI operating/workspace layer that sits between your users and multiple AI models, company knowledge, software tools and business systems.',
  frontDoor:
    'Instead of an organisation separately giving employees ChatGPT, Claude, Gemini, local models, search tools, document-AI tools, etc., LibreChat can provide a single controlled AI front door to all of them.',
  notAClone:
    'That, rather than “open-source ChatGPT clone,” is the useful way to think about the current platform.',
  pbmpNote:
    'LibreChat’s Agents / Skills / MCP / Projects / Artifacts overlap with several things already being designed in PBMP, but they sit at different architectural levels. LibreChat could potentially be treated as the AI Interaction + Agent Runtime layer underneath PBMP, rather than PBMP attempting to rebuild all of this functionality itself.',
};

export const FAMILIES = [
  {
    id: 'model-hub',
    n: 1,
    name: 'AI Model Hub',
    provides: 'Connect to many AI models/providers',
    meaning: 'One AI portal instead of separate ChatGPT/Claude/Gemini/etc. experiences',
  },
  {
    id: 'workspace',
    n: 2,
    name: 'AI Chat Workspace',
    provides: 'Conversations, projects, history, branching, comparison, search, sharing',
    meaning: "The employee's day-to-day AI workbench",
  },
  {
    id: 'agents',
    n: 3,
    name: 'AI Agents',
    provides: 'Build specialist assistants with instructions, knowledge and tools',
    meaning: 'Create digital employees / specialised AI workers',
  },
  {
    id: 'orchestration',
    n: 4,
    name: 'Agent Orchestration',
    provides: 'Skills, sub-agents, chains, handoffs, tools',
    meaning: 'Allow AI workers to collaborate and divide work',
  },
  {
    id: 'knowledge',
    n: 5,
    name: 'Knowledge & Research',
    provides: 'Files, RAG, web search, OCR, memory',
    meaning: 'Give AI access to company and external knowledge',
  },
  {
    id: 'tools',
    n: 6,
    name: 'Tools & Business-System Integration',
    provides: 'MCP, APIs, Actions, external systems',
    meaning: 'Allow AI to do things, not merely answer questions',
  },
  {
    id: 'production',
    n: 7,
    name: 'Analysis & Content Production',
    provides: 'Code execution, artifacts, diagrams, images, speech',
    meaning: 'AI becomes an analytical and production environment',
  },
  {
    id: 'sharing',
    n: 8,
    name: 'Sharing & Organisational Reuse',
    provides: 'Shared agents, prompts, skills, marketplace, projects',
    meaning: 'Turn individual AI know-how into organisational assets',
  },
  {
    id: 'governance',
    n: 9,
    name: 'Governance & Administration',
    provides: 'SSO, roles, groups, permissions, moderation, usage/cost controls',
    meaning: 'Operate AI centrally like an enterprise platform',
  },
];

export const OFFICIAL_GROUPS = ['Agentic AI', 'Search & Knowledge', 'Media', 'Chat', 'Security'];

export const MODEL_HUB = {
  providers: [
    'OpenAI',
    'Azure OpenAI',
    'Anthropic',
    'Google',
    'AWS Bedrock',
    'OpenAI-compatible providers',
  ],
  compatible: ['OpenRouter', 'Groq', 'Mistral', 'Ollama', 'DeepSeek', 'Perplexity', 'others'],
  today: ['ChatGPT', 'Claude', 'Gemini', 'DeepSeek', 'internal AI'],
  withLibreChat: 'Employee → LibreChat → whichever AI/model is appropriate',
  approvedConfigs:
    'LibreChat can simplify the model menu by defining approved model configurations so that users do not have to understand model names and technical parameters.',
  multiConvo:
    'LibreChat’s multiConvo functionality can stream answers from two AI models at the same time. Example: “Analyse this acquisition target” could simultaneously go to Claude and GPT. This makes LibreChat a vendor-neutral AI layer.',
};

export const WORKSPACE = {
  moreThanQA:
    'At the base level LibreChat provides the familiar conversational AI environment—but considerably more than simple question/answer chat.',
  conversation: [
    'Conversation history',
    'Message editing and rerunning',
    'Branching / forking conversations',
    'Importing previous conversations',
    'Sharing conversations',
    'Resilient streaming that can continue after a connection interruption',
  ],
  projects: {
    definition:
      'Users can organise related conversations into Projects. LibreChat describes Projects as personal workspaces for long-running workstreams, clients, classes or topics.',
    exampleName: 'Project: Tata Motors Market Entry',
    exampleChats: [
      'Market research chat',
      'Competitor analysis chat',
      'Financial analysis chat',
      'Customer research chat',
      'Presentation drafting chat',
    ],
  },
  other: [
    'Prompts',
    'Bookmarks',
    'Feedback controls',
    'Conversation search',
    'Project search',
    'Custom welcome screens',
    'File citations',
    'Temporary conversations',
  ],
  temporary:
    'Temporary chats can be excluded from history/search and automatically deleted after a configurable retention period.',
};

export const EXAMPLE_AGENTS = [
  { name: 'Sales Proposal Agent', purpose: 'Prepare customer proposals' },
  { name: 'Procurement Agent', purpose: 'Analyse vendors and quotations' },
  { name: 'Finance Analyst', purpose: 'Analyse financial statements' },
  { name: 'HR Policy Assistant', purpose: 'Answer employee policy questions' },
  { name: 'Market Research Agent', purpose: 'Conduct structured research' },
  { name: 'Business Analyst Agent', purpose: 'Convert needs into requirements' },
  { name: 'Customer Support Agent', purpose: 'Diagnose customer issues' },
  { name: 'Legal Review Agent', purpose: 'Perform first-pass contract analysis' },
];

export const AGENT_ANATOMY = [
  'identity',
  'purpose',
  'instructions',
  'AI model',
  'documents',
  'memory',
  'tools',
  'permissions',
];

export const AGENT_SHARING = [
  'Privately owned',
  'Shared with individual users',
  'Shared with groups or roles',
  'Made public within the LibreChat environment, depending on permission settings',
];

export const SKILLS = {
  definition:
    'LibreChat Skills are reusable sets of instructions, procedures, rules, references, scripts and assets that agents can use.',
  translation: 'An Agent is who does the job. A Skill is how a particular job should be done.',
  exampleAgent: 'Marketing Agent',
  exampleSkills: [
    'Brand Guidelines',
    'Competitor Analysis Method',
    'Campaign Review Checklist',
    'Customer Persona Method',
    'SEO Research Method',
    'Board Presentation Style',
  ],
  docsExamples: ['Brand / writing guidelines', 'Internal review checklists', 'Standard research workflows'],
  invoke: ['Manually by a user', 'Automatically by the AI when relevant', 'Always applied'],
  github: 'They can also be centrally deployed and synchronised from GitHub.',
  meaning: 'This is an embryonic organisational knowledge/process library, not merely prompt storage.',
};

export const ORCHESTRATION = {
  beyond: 'LibreChat is moving beyond “one AI answers one user.”',
  subagents: {
    title: 'Subagents',
    text: 'A primary agent can delegate a specialised task to another AI worker. The child task gets its own working context, and sends the result back to the main agent.',
    example: [
      'Strategy Agent asks Research Agent to research competitors',
      'asks Finance Agent to model economics',
      'asks Risk Agent to identify risks',
      'combines their results',
    ],
  },
  chains: {
    title: 'Agent Chains',
    text: 'Agents can be configured into a sequence where one agent’s results feed another. LibreChat describes this as a Mixture-of-Agents architecture.',
    sequence: ['Research Agent', 'Analysis Agent', 'Critic Agent', 'Executive Summary Agent'],
  },
  handoffs: {
    title: 'Handoffs',
    text: 'An agent can also transfer work to another specialist agent when required.',
  },
  takeaway: 'LibreChat contains the beginnings of an AI workforce orchestration layer. That is significantly different from a normal ChatGPT-style interface.',
};

export const KNOWLEDGE = [
  { mechanism: 'Conversation context', purpose: 'Understand what is being discussed now' },
  { mechanism: 'User Memory', purpose: 'Remember selected user information across conversations' },
  { mechanism: 'File Context', purpose: 'Permanently give an Agent selected documents/instructions' },
  { mechanism: 'RAG / File Search', purpose: 'Search large document collections for relevant passages' },
  { mechanism: 'Web Search', purpose: 'Obtain current external information' },
  { mechanism: 'OCR', purpose: 'Read scanned documents/images' },
  { mechanism: 'Message Search', purpose: 'Find earlier conversations' },
];

export const KNOWLEDGE_NOTES = {
  memory: 'LibreChat’s Memory is a structured persistent store rather than simply searching every historical conversation.',
  rag: 'Its RAG service lets uploaded documents be indexed so that the AI can retrieve relevant portions when answering questions.',
  ocr: 'OCR can extract information from scanned PDFs and images as well as ordinary documents.',
  web: 'Web Search adds current internet information, using a search + scraping + optional reranking process.',
  internal: ['Policies', 'Manuals', 'Contracts', 'Reports', 'Research', 'SOPs', 'Project files'],
  external: ['Web', 'News', 'Market information'],
};

export const MCP = {
  usb: 'The documentation describes MCP as effectively a “USB-C for AI”: a common connection mechanism between AI and external tools/data/services.',
  instead: 'Instead of LibreChat having to custom-build every integration.',
  examples: ['Salesforce', 'Google Drive', 'Database', 'your own internal business application'],
  perUser: 'LibreChat supports per-user MCP connections and authentication so different users can have their own authorised access.',
  restrict: 'Agents can also be restricted to selected MCP tools rather than giving them unrestricted access.',
  shift: 'An AI moves from “Here is what you should do.” to “I have done it.” That is the transition from Generative AI → Agentic AI.',
};

export const ACTIONS = {
  text: 'LibreChat Agents can also connect directly to services through API Actions.',
  examples: [
    'CRM API',
    'ERP API',
    'ticketing system',
    'payment system',
    'internal PBMP API',
    'customer database',
    'analytics API',
  ],
  domains: 'The organisation can control which domains are permitted.',
  vsMcp: 'MCP is the more standardised mechanism, while Actions provide a more direct API-based integration route.',
};

export const CODE_INTERPRETER = {
  meaning:
    'From a business user’s perspective, forget the programming languages. LibreChat can give an AI a private analytical computer on which to perform calculations and manipulate data.',
  languages: ['Python', 'JavaScript/TypeScript', 'Go', 'C/C++', 'Java', 'PHP', 'Rust', 'Fortran', 'R'],
  files: 'and process uploaded/generated files.',
  example:
    '“Take these 14 Excel/CSV files, consolidate the data, calculate profitability by customer and produce the results.” The Agent can calculate rather than merely describe how to calculate.',
  experimental:
    'LibreChat is also introducing stateful code sessions, programmatic tool calling and background tool execution, although some of these are explicitly marked experimental/opt-in.',
};

export const ARTIFACTS = {
  types: ['interactive React components', 'HTML pages', 'SVGs', 'Markdown documents', 'Mermaid diagrams'],
  beside: 'These can appear as interactive outputs beside the conversation.',
  examples: [
    'Create an interactive profitability dashboard.',
    'Draw the order-to-cash process.',
    'Create the user interface for this application.',
  ],
  meaning: 'This moves LibreChat closer to an AI production workspace, rather than just a chat interface.',
};

export const MEDIA = {
  images:
    'Agents can generate and edit images through models/services including OpenAI image models and other image-generation systems.',
  documents: [
    'uploaded directly as text',
    'processed using OCR',
    'stored as Agent context',
    'indexed using RAG',
    'processed using Code Interpreter',
  ],
  stt: 'Speech-to-Text: speak instead of typing.',
  tts: 'Text-to-Speech: AI responses can be spoken.',
  voiceProviders: 'It supports browser speech as well as external providers such as OpenAI and ElevenLabs.',
};

export const SHARING = {
  permissionWith: ['individual users', 'groups', 'roles', 'or the wider LibreChat instance'],
  marketplace: 'It also contains an Agent Marketplace capability for discovering and sharing agents.',
  without: '100 employees independently discover 100 clever prompts. The knowledge disappears into private conversations.',
  with: 'those can evolve into: Prompts → Skills → Agents → shared organisational AI assets',
};

export const GOVERNANCE = {
  threeLevels: [
    { control: 'Feature permissions', meaning: 'Who may use/create/share particular capabilities' },
    { control: 'Resource ACLs', meaning: 'Who may see/edit a particular Agent, prompt, MCP server, file, etc.' },
    { control: 'System grants', meaning: 'Who receives specific administrative powers' },
  ],
  associated: 'Permissions can be associated with users, groups and roles.',
  exampleRoles: ['Management', 'Sales', 'Finance', 'HR', 'External Consultant', 'Developer', 'AI Administrator'],
  auth: [
    'email/password',
    'OAuth/social login',
    'OpenID Connect',
    'SAML',
    'LDAP / Active Directory',
    'two-factor authentication',
  ],
  identityFit:
    'This means it can potentially fit behind an organisation’s existing identity system rather than creating another independent employee identity silo.',
  cost: {
    records: 'LibreChat records supported model usage and can show context usage and costs.',
    balance:
      'It also provides a balance system through which administrators can give users AI credits and optionally refill those credits periodically.',
    example: [
      { group: 'Management', budget: '₹10,000 equivalent/month' },
      { group: 'Analysts', budget: '₹5,000' },
      { group: 'Sales', budget: '₹2,000' },
      { group: 'Interns', budget: '₹500' },
    ],
    note: 'The implementation works in token-credit terms rather than being a finished corporate chargeback application, but the underlying accounting/control mechanism exists.',
  },
  admin: {
    panel: 'LibreChat now has a dedicated browser-based Admin Panel.',
    manage: [
      'users',
      'groups',
      'roles',
      'configuration',
      'role/group-specific configuration overrides',
      'permissions',
      'system-level administrative grants',
    ],
    overrides:
      'Research Team can get additional models, higher agent limits, web search and advanced tools, while General Employees receive only approved models, no external tools and smaller usage limits.',
    preview:
      'The Admin Panel is currently labelled Preview in the documentation, so distinguish it from long-established core features when evaluating production maturity.',
  },
  moderation: [
    'excessive login attempts',
    'mass registrations',
    'message-rate limits',
    'concurrent requests',
    'file uploads',
    'conversation imports/forks',
    'speech usage',
    'tool calls',
    'password resets and other suspicious behaviour',
  ],
  block: 'It can temporarily block users/IPs when configured thresholds are exceeded.',
  notReplacement:
    'This is not a replacement for enterprise cyber-security infrastructure—LibreChat itself recommends external protections such as Cloudflare/DDoS protection—but provides application-level controls.',
};

export const TECH_STACK = [
  { layer: 'Frontend', tech: 'React + TypeScript SPA', purpose: 'What users interact with in the browser' },
  { layer: 'Frontend build/UI tooling', tech: 'Vite, Tailwind-related tooling', purpose: 'Builds and styles the web application' },
  { layer: 'Backend', tech: 'Node.js + Express', purpose: 'Main application/server logic' },
  { layer: 'Backend language direction', tech: 'TypeScript; some legacy JavaScript remains', purpose: 'Core application development' },
  { layer: 'Main database', tech: 'MongoDB', purpose: 'Users, chats, agents, settings and application data' },
  { layer: 'Conversation search', tech: 'Meilisearch', purpose: 'Fast search across historical conversations' },
  { layer: 'RAG / document AI service', tech: 'Python + FastAPI + LangChain', purpose: 'Processes and searches document knowledge' },
  { layer: 'RAG vector database', tech: 'PostgreSQL + pgvector', purpose: 'Stores searchable semantic representations of documents' },
  { layer: 'Code execution', tech: 'ClickHouse/code-interpreter service', purpose: 'Secure environment for AI-generated computation' },
  { layer: 'Code isolation', tech: 'NsJail / microVM via libkrun', purpose: 'Separates executed AI code from the main server' },
  { layer: 'Multi-instance streaming', tech: 'Redis optional', purpose: 'Synchronises streams when running multiple servers' },
  { layer: 'External AI connectivity', tech: 'Provider APIs + OpenAI-compatible APIs', purpose: 'Connects AI models' },
  { layer: 'Tool connectivity', tech: 'MCP + OpenAPI Actions', purpose: 'Connects external business applications' },
  { layer: 'Deployment', tech: 'Docker / Docker Compose', purpose: 'Most common deployment model' },
  { layer: 'Scale deployment', tech: 'Kubernetes / Helm supported', purpose: 'Larger enterprise deployments' },
  { layer: 'Reverse proxy', tech: 'Nginx available in deployment architecture', purpose: 'Routes web traffic' },
  { layer: 'Admin UI', tech: 'Separate browser service; docs describe Bun + Vite', purpose: 'Platform administration' },
  { layer: 'Observability', tech: 'Langfuse integration available', purpose: 'AI tracing/usage monitoring' },
];

export const NOT_MONOLITH = [
  'MongoDB',
  'Meilisearch',
  'RAG Service (FastAPI / Python + PostgreSQL / pgvector)',
  'Code Interpreter',
  'Redis [when needed]',
  'MCP Servers',
  'AI Providers (OpenAI, Anthropic, Google, Bedrock, local models, others)',
];

export const FOUR_PRODUCTS = [
  { product: 'Universal AI Client', equivalent: 'ChatGPT/Claude/Gemini-style interface' },
  { product: 'Enterprise AI Gateway', equivalent: 'Single controlled entry point to many models' },
  { product: 'Agent Platform', equivalent: 'Build agents + skills + tools + multi-agent orchestration' },
  { product: 'AI Governance Platform', equivalent: 'Identity + sharing + permissions + cost + administration' },
];

export const FIFTH_PRODUCT = {
  layer: 'AI Application/Execution Platform',
  meaning: 'Artifacts + Code Interpreter + MCP + Actions allow AI to generate things and operate external systems',
};

export const EXECUTIVE_DESCRIPTION =
  'LibreChat is an open-source enterprise AI interaction and orchestration platform that provides a common workspace across models, people, knowledge, AI agents and business systems—with the organisation retaining control over deployment, permissions and usage.';

export const VIDEO_GAPS = {
  heading: 'What is NOT adequately demonstrated in these videos',
  important: 'This is important. LibreChat has advanced substantially since several of these videos.',
  notFound:
    'I haven’t yet found good recent walkthroughs covering the following current capabilities together.',
  whyItMatters:
    'This gap matters because LibreChat’s 2026 releases are significantly more capable than what that 2024 Agent video shows. For example, the current product documentation describes Skills, Subagents and much richer agent tooling; the Admin Panel is an entirely new management surface.',
  coverage: [
    { capability: 'Basic chat/UI', video: 'covered', note: 'Good recent video' },
    { capability: 'Multiple LLMs', video: 'covered', note: 'Good recent video' },
    { capability: 'Local models', video: 'covered', note: 'Good recent video' },
    { capability: 'Documents/RAG', video: 'covered', note: 'Good recent video' },
    { capability: 'Web search', video: 'covered', note: 'Good recent video' },
    { capability: 'Memory', video: 'covered', note: 'Good recent video' },
    { capability: 'Agents', video: 'older', note: 'Video exists, but older' },
    { capability: 'Code Interpreter', video: 'older', note: 'Video exists, but older' },
    { capability: 'MCP', video: 'covered', note: 'Good recent video' },
    { capability: 'Artifacts', video: 'older', note: 'Video exists, but older' },
    { capability: 'Reusable prompts', video: 'covered', note: 'Good recent video' },
    { capability: 'Skills', video: 'missing', note: 'No good current walkthrough found' },
    { capability: 'Subagents', video: 'missing', note: 'No good current walkthrough found' },
    { capability: 'Agent Chains / orchestration', video: 'missing', note: 'No good current walkthrough found' },
    { capability: 'Human-in-the-loop agent behaviour', video: 'missing', note: 'No good current walkthrough found' },
    { capability: 'Projects', video: 'limited', note: 'Limited' },
    { capability: 'Agent Marketplace', video: 'limited', note: 'Limited' },
    { capability: 'Group-level sharing/ACL', video: 'missing', note: 'No good current walkthrough found' },
    { capability: 'Current Admin Panel', video: 'missing', note: 'No good current walkthrough found' },
    { capability: 'Role/group configuration overrides', video: 'missing', note: 'No good current walkthrough found' },
    { capability: 'Current enterprise governance', video: 'missing', note: 'No good current walkthrough found' },
  ],
  sequenceIntro:
    'Therefore, the recommended viewing sequence is only about 30–40 minutes. After those five, you’ll have seen perhaps 70–80% of the strategically important LibreChat concepts, even though several newer 2026 enterprise/agent-orchestration features aren’t yet well covered by video.',
  sequence: [
    {
      n: 1,
      title: 'May 2026 overview',
      why: 'Understand what LibreChat looks like today.',
      priority: true,
    },
    {
      n: 2,
      title: 'Official 3-minute Agents/Code/MCP video',
      why: 'Understand its platform architecture.',
      priority: false,
    },
    {
      n: 3,
      title: 'ClickHouse MCP demo',
      why: 'Understand why LibreChat can become much more than a chatbot.',
      priority: true,
    },
    {
      n: 4,
      title: 'Custom Prompt/Artifact video',
      why: 'Understand reusable organisational AI assets.',
      priority: false,
    },
    {
      n: 5,
      title: 'Artifact video',
      why: 'Understand its ability to generate actual Forms/applications.',
      priority: true,
    },
  ],
  watchFirst:
    'Particularly watch #1, #3 and #5. Those three are most useful for answering the bigger question: “Which parts of the PBMP AI layer should we actually build ourselves, versus simply use LibreChat for?”',
};

export const MODEL_SUPPLY = {
  headline: 'Ollama is not needed for LibreChat',
  onlyOneWay:
    'Ollama is only one way to supply AI models to LibreChat, specifically when you want to run open-source models yourself, usually locally or on your own server. LibreChat can instead connect directly to OpenAI, Anthropic/Claude, Google/Gemini, Azure OpenAI, AWS Bedrock, OpenRouter and many other providers.',
  simplest: 'The simplest architecture has no Ollama anywhere: User → LibreChat → OpenAI / Claude / Gemini / etc.',
  ollamaWhen:
    'Ollama becomes relevant only if you want: User → LibreChat → Ollama → Llama / Qwen / Mistral / DeepSeek-type open model. LibreChat treats Ollama as an OpenAI-compatible custom endpoint.',
  compatiblePoint:
    'LibreChat supports OpenAI-compatible endpoints. So LibreChat isn’t tightly coupled to Ollama. Many alternative model servers and gateways can sit underneath it.',
  alternatives: [
    { option: 'OpenAI API', where: 'OpenAI cloud', pay: 'Usage-based', best: 'Easiest, high capability' },
    { option: 'Anthropic API', where: 'Anthropic cloud', pay: 'Usage-based', best: 'Claude models' },
    { option: 'Gemini API', where: 'Google cloud', pay: 'Usage-based', best: 'Gemini models' },
    { option: 'OpenRouter', where: 'Cloud gateway', pay: 'Usage-based', best: 'One API giving access to many model providers' },
    { option: 'AWS Bedrock', where: 'AWS', pay: 'Usage-based', best: 'Enterprise/AWS environments' },
    { option: 'Azure OpenAI', where: 'Azure', pay: 'Usage-based', best: 'Enterprise/Microsoft environments' },
    { option: 'Ollama', where: 'Your computer/server', pay: 'Hardware/server cost', best: 'Simple self-hosted open models' },
    { option: 'vLLM', where: 'Your GPU server/cloud GPU', pay: 'GPU infrastructure', best: 'Serious/high-volume self-hosting' },
    { option: 'LM Studio', where: 'Your computer', pay: 'Usually hardware cost', best: 'Easy desktop local AI' },
    { option: 'llama.cpp', where: 'Your hardware', pay: 'Hardware cost', best: 'Lightweight/local deployments' },
    { option: 'LocalAI', where: 'Your infrastructure', pay: 'Infrastructure', best: 'Open-source OpenAI-compatible local gateway' },
  ],
  notStartOllama:
    'For the PBMP use case, do not start with Ollama. Immediate problem is not running an LLM. It is building the higher-value layer: PBMP business knowledge + Agents + Skills + Components + MCP + workflows + governance.',
  opsProblems: [
    'GPU capacity',
    'model downloading',
    'model upgrades',
    'speed',
    'memory requirements',
    'scaling',
    'concurrent users',
    'monitoring',
    'model quality',
  ],
  opsWithout:
    'Running your own model adds another operational problem without necessarily giving PBMP any additional business functionality.',
  initial:
    'Initial build: PBMP user → LibreChat → OpenAI, Claude, Gemini (and potentially OpenRouter) + PBMP via MCP/API.',
  privacyWhen:
    'Ollama becomes attractive when a customer says: “Our contracts and internal documents must never be sent to OpenAI, Google or Anthropic.” Then deploy inside the customer environment: PBMP → LibreChat → Ollama / vLLM → Qwen / Llama / Mistral / another open model. Data and inference can remain inside their environment. That is a useful deployment option for PBMP rather than the default architecture.',
  ollamaVsVllm:
    'Very simplistically: Ollama = easiest way to get local models running. vLLM = more appropriate when you are building a serious shared AI service serving many users. Personal/development → Ollama. Small local deployment → Ollama can work well. Large PBMP customer (10 / 100 / 1000 users) → vLLM on a GPU server / GPU cloud. That isn’t a hard technical rule, but it is a useful business rule of thumb.',
  openRouter:
    'OpenRouter is perhaps the most interesting alternative. Instead of separately integrating OpenAI, Claude, Gemini, DeepSeek, Mistral, Qwen, etc., LibreChat can go to OpenRouter and reach those families through one API. LibreChat explicitly supports OpenRouter as a custom endpoint. Some providers can still be connected directly where desirable.',
  modes: [
    {
      n: 1,
      name: 'Cloud AI',
      commercial: 'Bring your own AI key: simplest.',
      stack: 'OpenAI, Claude, Gemini, etc.',
    },
    {
      n: 2,
      name: 'AI Gateway',
      commercial: 'PBMP-managed AI: one common model gateway, central billing/governance.',
      stack: 'OpenRouter → OpenAI, Claude, Gemini, Qwen, and others',
    },
    {
      n: 3,
      name: 'Private AI',
      commercial: 'Customer-controlled/self-hosted models for privacy/security-sensitive deployments.',
      stack: 'Ollama or vLLM → Llama, Qwen, Mistral',
    },
  ],
  punchline:
    'LibreChat is the important architectural piece here; Ollama is merely one interchangeable model-provider option underneath it. Think in three deployment modes, not commit PBMP to Ollama.',
};

export const PERPLEXITY = {
  headline: 'Perplexity fits — in a different role from Ollama',
  distinction:
    'Ollama = a way to run AI models yourself. Perplexity = a cloud AI/search provider, especially strong at live web research. LibreChat = the user workspace/orchestration layer that can sit above either of them.',
  supported:
    'LibreChat explicitly recognizes Perplexity as a supported custom endpoint, so you can connect a Perplexity API key directly into LibreChat.',
  path: 'User → LibreChat → Perplexity API → Live web search + AI reasoning + citations',
  noOllama: 'You absolutely do not need Ollama to use Perplexity.',
  useful:
    "Perplexity's current API platform is heavily focused on real-time, web-grounded intelligence. Its API offering now includes an Agent API, Search API and Embeddings API; the Agent API can use web search, URL fetching and different frontier models.",
  questions: [
    'What changed in the Indian EV market in the last 30 days?',
    'Research these five competitors and cite every important claim.',
    'Find the latest RBI regulations relevant to this business case.',
    'Research this company using current web information.',
  ],
  differentFromGpt:
    'That is where Perplexity is substantially different from simply attaching GPT or Claude to LibreChat.',
  simultaneous:
    "LibreChat could have all of these simultaneously. You don't really have to choose one. A user could simply choose the appropriate capability.",
  simultaneousLanes: [
    { name: 'OpenAI', role: 'General reasoning, coding, agents' },
    { name: 'Perplexity', role: 'Live web research' },
    { name: 'Claude', role: 'Reasoning / analysis' },
    { name: 'Gemini', role: 'Google models' },
    { name: 'Ollama / vLLM', role: 'Private / local models' },
  ],
  roles: [
    { service: 'OpenAI', role: 'General-purpose intelligence, reasoning, coding, agents' },
    { service: 'Claude', role: 'Deep reasoning, writing, long documents, coding' },
    { service: 'Gemini', role: 'Google models, multimodal/large-context work' },
    { service: 'Perplexity', role: 'Current external research/search with citations' },
    { service: 'OpenRouter', role: 'Gateway giving access to many model providers' },
    { service: 'Ollama', role: 'Run open-source models privately' },
    { service: 'vLLM', role: 'Run open models at larger scale' },
  ],
  opposite:
    'That is a more useful comparison than Perplexity vs Ollama, because they solve almost opposite problems.',
  complication:
    'There is one complication: Perplexity itself is becoming more like LibreChat. Perplexity in 2026 is no longer only “Google search + an LLM.” Its current platform describes itself as supporting multi-model orchestration, web-first agentic AI, autonomous agents, and access to frontier models. Its consumer product also gives users access to models from providers such as OpenAI, Anthropic, Google, xAI and others, depending on the subscription tier.',
  lookalikeNote:
    'Superficially Perplexity (Sonar, GPT, Claude, Gemini, Grok, others) starts looking like LibreChat (OpenAI, Claude, Gemini, Perplexity, Ollama, others). But their core purposes are still different.',
  vs: [
    { topic: 'Core purpose', perplexity: 'Research / answer engine', librechat: 'Enterprise AI workspace/platform' },
    { topic: 'Live web research', perplexity: 'Excellent / core capability', librechat: 'Available through integrations' },
    { topic: 'Citations', perplexity: 'Core capability', librechat: 'Depends on source/tool/model' },
    { topic: 'Multiple models', perplexity: 'Yes', librechat: 'Yes, highly configurable' },
    { topic: 'Build your own agents', perplexity: 'Increasingly yes', librechat: 'Core capability' },
    { topic: 'Skills', perplexity: 'More limited/different concept', librechat: 'Yes' },
    { topic: 'MCP integrations', perplexity: 'Evolving agent/tool platform', librechat: 'Strong native capability' },
    { topic: 'Company RAG', perplexity: 'API capabilities available', librechat: 'Built directly into platform' },
    { topic: 'Self-host LibreChat itself', perplexity: 'No', librechat: 'Yes' },
    { topic: 'Local models', perplexity: 'Not its principal purpose', librechat: 'Ollama/vLLM/etc. supported' },
    { topic: 'Enterprise UI you control', perplexity: "Limited to Perplexity's product", librechat: 'You own/control deployment' },
    { topic: 'White-label/custom platform potential', perplexity: 'Low', librechat: 'High' },
    { topic: 'PBMP integration flexibility', perplexity: 'API integration', librechat: 'Very high' },
  ],
  traditional:
    'Perplexity itself says its traditional product is primarily designed for finding and delivering accurate information, rather than extended conversation.',
  include:
    'For PBMP, definitely include Perplexity. Structure the AI layer: PBMP → LibreChat, then three lanes — Think / Create (OpenAI / Claude / Gemini etc.), Research Web (Perplexity → current sources, news/websites, market intelligence, citations), and Private AI (Ollama/vLLM). Then PBMP can intelligently route different intentions.',
  routingExample: {
    intention: 'Create a Business Case',
    steps: [
      'Internal company data → PBMP/RAG',
      'Current market research → Perplexity',
      'Financial reasoning → GPT/Claude',
      'Confidential analysis → private model',
    ],
  },
  morePowerful: 'That is much more powerful than deciding on one “best model.”',
  apiOption:
    'You don’t necessarily even have to use the Perplexity consumer application. PBMP/LibreChat can use the Perplexity API directly. Perplexity currently offers its Agent API specifically so applications can embed its web search/research capability. Users could remain entirely inside PBMP → LibreChat while Perplexity works invisibly underneath when live external research is required. That is probably the more interesting architecture.',
};

export const CURRENT_UI = {
  headline: 'Current LibreChat desktop frontend — v0.8.7',
  release: 'The latest stable LibreChat release is v0.8.7, released 23 June 2026. The newer v0.8.8-rc1 is a release candidate, so it is excluded.',
  source:
    "This is the current LibreChat desktop frontend shown on LibreChat's own website, reflecting the redesigned interface used in the current stable generation.",
  seeing:
    'The screen is essentially a left sidebar plus a main area. The left sidebar has Search conversations, Chat history, Projects, Agents etc., and User/Profile. The main area is branded LibreChat, with a centred composer: “Message LibreChat…”, plus 🎙, Tools, Search, Actions, MCP.',
  evaluation:
    'An important point for evaluation: the UI was substantially redesigned in v0.8.5. LibreChat specifically introduced the new unified sidebar/icon-strip design, refreshed Prompts UI and redesigned tool-call display there; v0.8.6 and v0.8.7 then added Skills, Subagents, Projects and other functionality on top of that UI generation.',
  betterThanVideos:
    'So this is a much better representation of present-day LibreChat than many of the older YouTube screenshots linked earlier.',
  screenshotOffer:
    'Four or five screenshots of the current frontend covering the different screens would give a much better understanding of the complete UI rather than just the home screen.',
  screenshots: [
    { n: 1, screen: 'normal Chat' },
    { n: 2, screen: 'Agent Builder' },
    { n: 3, screen: 'Projects' },
    { n: 4, screen: 'MCP/Tools' },
    { n: 5, screen: 'Admin Panel' },
  ],
  notYet: 'Those screenshots have been offered; they are not in this brief yet.',
};

export const LIBRARIES = {
  headline: 'LibreChat has two different meanings of “libraries”',
  lead: 'Both are worth distinguishing: (1) user-facing reusable capability libraries, and (2) the software/code packages LibreChat itself is built from.',
  userFacing: [
    {
      library: 'Agent Library / Marketplace',
      contains: 'Reusable AI agents',
      meaning: 'Catalogue of specialist AI workers',
    },
    {
      library: 'Tool Library',
      contains: 'Built-in tools, MCP servers and Actions',
      meaning: 'Catalogue of things an AI worker is allowed to do',
    },
    {
      library: 'Skills Library',
      contains: 'Reusable instructions/procedures',
      meaning: 'Catalogue of organisational know-how / SOPs',
    },
    {
      library: 'Prompt Library',
      contains: 'Reusable prompts and prompt templates',
      meaning: 'Catalogue of standard requests/templates',
    },
    {
      library: 'MCP Library',
      contains: 'Connected MCP servers and their tools',
      meaning: 'Catalogue of connected external systems',
    },
    {
      library: 'Actions Library',
      contains: 'API-based actions created by users/admins',
      meaning: 'Reusable business-system operations',
    },
    {
      library: 'Files / Knowledge',
      contains: 'Files attached for context, RAG or code processing',
      meaning: 'Knowledge available to AI',
    },
    {
      library: 'Projects',
      contains: 'Collections of related conversations/work',
      meaning: 'Workspaces rather than a true library',
    },
  ],
  toolLibraryImportant:
    "The Tool Library is particularly important. LibreChat's current Agent Builder presents a searchable catalogue with filters for Official, Tools, MCP and Actions; users can also see items they created themselves and keep favourites.",
  conceptual:
    'Conceptually: LibreChat holds Agents (AI workers), Skills (how-to-do knowledge) and Prompts (standard requests). Agents use the Tool Library, which splits into built-in tools (Search, Calculator, Images, Code etc.), MCP (Salesforce, PBMP, Drive, databases) and Actions (APIs, ERP, CRM, etc.).',
  toolSubs:
    'The Tool Library itself contains several sub-libraries. This is probably the part most relevant to the earlier question.',
  builtin:
    'A. Built-in / Official Tools. Examples include: web/search tools, calculator, Wolfram, image generation/editing, OpenWeather, Google Search, Tavily, Azure AI Search, Code Interpreter-related capability. LibreChat documents these as tools that can be attached to Agents.',
  mcp:
    'B. MCP Servers. Each MCP server is effectively a bundle of tools. Example: Spotify MCP — Search songs, Play, Pause, Create playlist, etc. Similarly, a future PBMP MCP — Find Business Case, Create Requirement, Update Requirement, Find Project, Generate Report, Get Customer, etc. LibreChat lets the Agent designer select the MCP server and then enable/disable individual tools within it.',
  actions:
    'C. Actions. These are API-based integrations defined specifically for LibreChat agents. Think: MCP = standardised connector/tool mechanism versus Action = explicitly configured API operation. Both appear in the Agent Tool Library.',
  skillsSeparate:
    'Skills Library is separate from Tools. A Skill is not normally an external operation. It is reusable knowledge about how to perform something.',
  skillExamples: [
    'Competitive Analysis',
    'Financial Ratio Analysis',
    'Business Case Preparation',
    'McKinsey MECE Analysis',
    'Barbara Minto Pyramid',
    'PBMP Requirements Method',
    'Brand Writing Guidelines',
    'Risk Assessment Method',
  ],
  skillsReuse: 'Then different Agents can reuse those same Skills.',
  skillsPicker:
    "LibreChat's current Agent Builder has a dedicated Skills picker rather than mixing Skills indiscriminately into ordinary tools. Skills can also be discovered automatically by the model or invoked manually.",
  whoHow:
    'This distinction is extremely useful: Agent = Who. Skill = Knows how. Tool = Can do. Knowledge/File = Knows what. That is a very clean architecture.',
  marketplace:
    'LibreChat has an Agent Marketplace, which can be enabled for users. It allows reusable agents to be discovered rather than every person building one from scratch. Permissions determine who can use, edit or own/share individual agents.',
  agentOrg: [
    { group: 'Finance', agents: ['FP&A Analyst', 'Accounts Analyst', 'Investment Analyst'] },
    { group: 'Marketing', agents: ['Market Researcher', 'Campaign Analyst', 'Content Writer'] },
    { group: 'Sales', agents: ['Proposal Assistant', 'Account Researcher', 'Sales Coach'] },
    { group: 'Technology', agents: ['Business Analyst', 'Developer', 'Tester', 'Solution Architect'] },
  ],
  promptExamples: [
    'Analyse a competitor',
    'Create a Business Case',
    'Summarise a meeting',
    'Generate BRD',
    'Prepare Board Summary',
    'Perform SWOT',
  ],
  promptsSimpler: 'These are simpler than Skills.',
  hierarchy:
    'A useful hierarchy is: PROMPT → single reusable instruction. SKILL → method / procedure / rules + possibly supporting material. AGENT → persistent AI worker possessing several Skills and Tools.',
  promptPerms:
    "LibreChat's permission model explicitly treats Prompts as a separately governable resource—use, creation, sharing and public availability can be controlled.",
  knowledgeNotDam:
    'LibreChat does not yet look like a full enterprise DAM/DMS-style Knowledge Library in the way SharePoint or PBMP might. Files are principally managed as resources associated with: chats, Agents, File Search/RAG, File Context, Code Interpreter.',
  fileUses: [
    { use: 'Image', meaning: 'Give an image directly to a vision model' },
    { use: 'Upload as Text', meaning: 'Put the complete file contents into the current conversation' },
    { use: 'File Search', meaning: 'Put documents into RAG and retrieve relevant pieces' },
    { use: 'Code Interpreter file', meaning: 'Allow the AI to computationally process the file' },
  ],
  fileContext:
    'Agents can also have persistent File Context. So call this a Knowledge Resource capability, rather than yet treating it as a sophisticated “Document Library.”',
  codeIntro:
    'And then there are the software/code libraries LibreChat itself is built from. If by “libraries” you meant its code libraries/packages, LibreChat’s current codebase is organised into several major internal packages. LibreChat officially describes this as a monorepo, with clearly separated frontend, backend, data and shared-library boundaries.',
  packages: [
    { pkg: '/client', purpose: 'Main React user interface' },
    { pkg: '/packages/client', purpose: 'Shared frontend utilities' },
    { pkg: '/packages/api', purpose: 'New TypeScript backend services' },
    { pkg: '/api', purpose: 'Older/legacy Express backend layer' },
    { pkg: '/packages/data-provider', purpose: 'Shared API definitions, types and data access' },
    { pkg: '/packages/data-schemas', purpose: 'Database models and schemas' },
    { pkg: '@librechat/agents', purpose: 'Agent runtime/orchestration library' },
  ],
  softwareTree:
    'Underneath the business product: Frontend = client + packages/client. Shared = data-provider. Backend = packages/api, api [legacy], @librechat/agents. Data = data-schemas.',
  pbmpTerms: [
    { concept: 'Agent Library', meaning: 'WHO can perform work' },
    { concept: 'Skill Library', meaning: 'HOW work should be performed' },
    { concept: 'Tool Library', meaning: 'WHAT capabilities can be invoked' },
    { concept: 'MCP Library', meaning: 'WHICH systems can be interacted with' },
    { concept: 'Action Library', meaning: 'WHICH explicit business operations can be executed' },
    { concept: 'Prompt Library', meaning: 'Reusable instructions/questions' },
    { concept: 'Knowledge Library', meaning: 'WHAT information the Agent can know/retrieve' },
    { concept: 'Model Library', meaning: 'WHICH underlying intelligence/model executes the work' },
  ],
  modelLibraryNote:
    'Add Model Library even though LibreChat generally exposes this through its endpoint/model selector rather than calling it a “library”.',
  resourceArch:
    'That produces a very strong general architecture: AI resource libraries — Agents, then Skills, Knowledge and Prompts; Tools underneath Agents split into MCP and Actions into business systems; plus Models (GPT / Claude / Gemini / Perplexity / Qwen / etc.).',
  punchline:
    'This is actually one of LibreChat’s strongest architectural ideas for PBMP to reuse: do not put Agents, Skills, Tools, Prompts, Knowledge and Models into one undifferentiated “AI library.” They represent different types of reusable assets and should be governed separately.',
};

export const THREE_LAYERS = {
  headline: 'Three layers: Canvas, intelligence, and execution',
  possible:
    'The architecture you are imagining is broadly possible with LibreChat, but it helps to separate three layers: Artifact/Canvas = presentation. LLM = intelligence / natural-language understanding. Agents + tools + code interpreter = backend execution.',
  canvasTitle: '1. How rich can the LibreChat “canvas” be?',
  canvasIntro:
    'LibreChat calls this area Artifacts / Generative UI. It is considerably richer than a normal rich-text editor: an Agent can generate React components, HTML pages, Markdown, SVG and Mermaid diagrams in the separate artifact panel.',
  artifactTable: [
    { info: 'Formatted text', support: 'yes', how: 'Markdown / HTML' },
    { info: 'Headings, lists, tables', support: 'yes', how: 'Markdown / HTML' },
    { info: 'Hyperlinks', support: 'yes', how: 'Standard Markdown links / HTML' },
    { info: 'Code', support: 'yes', how: 'Markdown / HTML' },
    { info: 'Flowcharts/process diagrams', support: 'yes', how: 'Mermaid' },
    { info: 'SVG graphics', support: 'yes', how: 'Native artifact type' },
    { info: 'Buttons / controls', support: 'yes', how: 'React / HTML' },
    { info: 'Forms / selectors', support: 'yes', how: 'React' },
    { info: 'Interactive dashboards', support: 'yes-very', how: 'React + Recharts' },
    { info: 'Line/bar/pie/etc. charts', support: 'yes', how: 'Recharts is pre-installed' },
    { info: 'Calendar/date interfaces', support: 'yes', how: 'date-fns, react-day-picker' },
    { info: 'Icons', support: 'yes', how: 'lucide-react' },
    { info: 'Polished UI components', support: 'yes', how: 'shadcn/ui' },
    { info: '3D content', support: 'yes', how: 'Three.js is available' },
    { info: 'Video', support: 'warn', how: 'Not a native artifact type' },
    { info: 'Audio', support: 'warn', how: 'Not a native artifact type' },
    { info: 'Arbitrary external websites', support: 'warn', how: 'Restricted by sandbox/CSP' },
  ],
  runtime:
    "LibreChat's current artifact runtime specifically makes Recharts and Three.js available, as well as React, Tailwind, Lucide, date-fns, react-day-picker and shadcn/ui components.",
  dashboardExample:
    'That means a request such as: “Create a sales dashboard showing pipeline by region, monthly sales, conversion rate, and let me switch between products.” can produce an actual interactive UI in the artifact panel—not merely a picture of a dashboard.',
  videoLimit:
    'Important limitation regarding video: do not describe video as a first-class LibreChat Artifact capability today. The documented native types are Markdown, HTML, React, SVG, Mermaid — not video/mp4, YouTube, audio, etc. You could potentially create an HTML/React <video> or embedded player if your deployment’s sandbox, CSP and media source permit it, but treat that as an extension/configuration question rather than a standard guaranteed capability. LibreChat deliberately sandboxes generated HTML/JS through CodeSandbox Sandpack, and the default artifact instructions restrict some external resources.',
  pbmpFit:
    'So for PBMP think: Document (text, tables, links, images/graphics, diagrams); Interactive UI (forms, buttons, filters, charts, dashboards, 2D graphics, 3D scenes); External rich media (video, audio, external app) as extension/integration / iframe rules. This fits rather well with the Functionality/Form architecture being developed for PBMP.',
  intelligenceTitle: '2. Where does LibreChat’s natural-language intelligence come from?',
  notLlm:
    'This is perhaps the most important point: LibreChat itself does NOT understand language at GPT-5.6 quality. LibreChat isn’t an LLM. LibreChat is effectively the orchestration shell around the intelligence.',
  flow:
    'You type a request → LibreChat adds context / instructions / tools / memory / files / agent configuration → sends everything to GPT-5.6 Sol or Claude or Gemini or Qwen or another model → the model understands/reasons → LibreChat displays the result.',
  plugTitle: '3. Can I actually plug GPT-5.6 Sol into LibreChat?',
  plugYes:
    'Yes. GPT-5.6 Sol is now available through the OpenAI API as gpt-5.6-sol, with gpt-5.6 as its alias. OpenAI currently describes it as its flagship model for complex professional reasoning and coding. Therefore PBMP → LibreChat → OpenAI API → GPT-5.6 Sol is a perfectly valid architecture. LibreChat says that Artifacts can use any model available to the configured Agent.',
  qualityTitle: '4. Will that give exactly the same quality as using ChatGPT 5.6 here?',
  modelLevel:
    'At the MODEL level: potentially yes, very close, because you can use the same GPT-5.6 Sol model family.',
  productLevel:
    'At the PRODUCT level: not automatically. What you experience as “ChatGPT 5.6” is more like the ChatGPT product: GPT-5.6 Sol + context + orchestration (web, files, code, tools, memory, agents, etc.). OpenAI describes GPT-5.6 Sol in ChatGPT as powering complex work across knowledge work, research, coding, science, computer use and design, while the API exposes the underlying model plus tools such as functions, web search, file search and computer use.',
  notIdentical:
    'So connecting LibreChat → GPT-5.6 Sol gives you the underlying intelligence. But achieving LibreChat experience ≈ complete ChatGPT experience also requires configuring the surrounding: system instructions + tools + web + file search + memory + code execution + subagents + context management + MCP integrations. LibreChat now has equivalents for a surprisingly large part of that stack, but the orchestration is not automatically identical to OpenAI’s proprietary ChatGPT product.',
  spawnTitle: '5. Can LibreChat spawn other Agents?',
  subagents:
    'Yes — it now has genuine Subagents. LibreChat’s current Subagents capability allows a parent Agent to spawn isolated child-Agent runs during execution. Each child gets: its own context window, its own tool execution, potentially a different model, different instructions, different Skills, different MCP servers/tools — and then returns its result to the parent Agent. That is real runtime delegation, rather than merely pretending through a prompt that several personas are talking.',
  acquisitionExample:
    'Example: Main PBMP Agent “Prepare acquisition analysis” → Research Agent (Perplexity / web data), Finance Agent (GPT-5.6 / Python), Risk Agent (Claude / contracts) → Main PBMP Agent executive synthesis.',
  selfSpawnTitle: '6. It can even spawn a copy of itself',
  selfSpawn:
    'LibreChat supports self-spawn. The main Agent can essentially decide: “This task is large. I’ll create a fresh isolated copy of myself to analyse part B.” Parent Agent → Self copy #1 analyse customer, #2 competition, #3 financials, #4 identify risks → Parent combines the four results. LibreChat explicitly supports this with allowSelf in its Subagents capability. This is very close to the multi-worker pattern being described.',
  chainsTitle: '7. And it separately has Agent Chains',
  twoForms:
    'LibreChat actually offers two forms of multi-Agent architecture. A. Subagents — spawned dynamically while an Agent is working (Agent decides it needs help → spawn Research Agent). B. Agent Chains — predefined multi-Agent workflow (Research → Analysis → Critic → Report). LibreChat describes Agent Chains as a graph-level multi-Agent workflow, while Subagents are runtime delegation from inside a parent’s reasoning loop. That distinction is useful for PBMP.',
  pythonTitle: '8. And what about the Python example?',
  pythonChange:
    'Change the terminology slightly. Rather than “spawn a Python Agent” there are two possibilities. Option A — spawn a specialist Agent: Main Agent → spawn Quantitative Analysis Agent, which could itself have Code Interpreter. Option B — simply execute Python: Main Agent → Code Interpreter → Python sandbox → calculation → result.',
  languages:
    'LibreChat’s Code Interpreter currently supports: Python, JavaScript/TypeScript, Go, C/C++, Java, PHP, Rust, Fortran and R. So the Agent can decide: “I shouldn’t calculate this mentally.” and generate/run Python instead.',
  ptcTitle: '9. This is considerably more than merely executing one code snippet',
  ptc:
    'LibreChat now supports Programmatic Tool Calling. This means the model can generate Python/code that orchestrates other registered tools: write a program that calls PBMP MCP for customers, loops through customers, calls PBMP MCP for transactions, calculates metrics, compares results, retries failures, and produces a final dataset. LibreChat explicitly supports loops, conditionals, retries and intermediate result processing before returning the final answer. This is a major capability. It means the LLM doesn’t have to individually reason through every tiny API call. It can effectively say: “I’ll write a small program to perform this workflow.”',
  combineTitle: '10. It can combine Subagents + Python + MCP',
  combine:
    'That’s when the architecture becomes extremely powerful. Example: “Find the five most attractive markets for our product in India and create an investment recommendation.” Strategy Agent (GPT-5.6 Sol) can spawn Market Research (Perplexity / current web), Internal Data (PBMP MCP / company data), Financial (GPT-5.6 + Python modelling), combine conclusions, then Artifact Engine → Report, Dashboard, Map/chart. LibreChat already possesses all the basic classes of machinery shown here: model selection, Agents, Subagents, Code Interpreter, MCP, web/search integrations and Artifacts.',
  pbmpTitle: '11. But this distinction matters enormously for PBMP',
  notPrimitive:
    'Therefore do not build PBMP’s AI architecture as PBMP → LLM API. That is too primitive.',
  instead:
    'Instead: PBMP → Business Semantic Layer (Processes / Elements / Relationships / Actions / Templates / Rules) → LibreChat AI Orchestration Layer (Agents, Skills, Memory, Tools, Artifacts; Subagents; MCP, Code, Web) → Model Layer (GPT-5.6, Claude, Gemini, Perplexity, Qwen) and Execution.',
  roles:
    'For PBMP, LibreChat can potentially become the generic Agent Runtime, while PBMP supplies the more valuable and differentiated layer: business semantics, Components, relationships, intentions, processes, governed templates, workbench functionality and business data.',
  qa: [
    {
      q: 'Can the Canvas contain rich information?',
      a: 'Yes. Text, links, tables, interactive UI, dashboards, charts, diagrams, SVG and even 3D. Video/audio aren’t currently first-class Artifact types and may require controlled embedding/integration.',
    },
    {
      q: 'Can it understand natural language as well as GPT-5.6?',
      a: 'Yes, if you attach GPT-5.6 Sol—but the intelligence comes from GPT-5.6, not LibreChat. Exact ChatGPT product behaviour isn’t guaranteed because ChatGPT adds its own orchestration layer.',
    },
    {
      q: 'Can it spawn backend workers/Agents?',
      a: 'Yes. Subagents, Agent Chains, self-spawning agents, Code Interpreter, Programmatic Tool Calling and MCP are all available.',
    },
    {
      q: 'Can it run Python itself?',
      a: 'Yes. In an isolated Code Interpreter sandbox.',
    },
    {
      q: 'Can Python then orchestrate business tools?',
      a: 'Yes. Programmatic Tool Calling can expose selected MCP tools to sandbox-generated code.',
    },
    {
      q: 'Can different spawned Agents use different models/tools?',
      a: 'Yes. A child Agent can have a different model, instructions, Skills, files and tools.',
    },
  ],
  stronger:
    'So the answer is considerably stronger than “LibreChat is a UI on top of an LLM.” The current product is much closer to: LibreChat = open-source AI workspace + model gateway + agent runtime + multi-agent orchestrator + tool runtime + generative-UI environment. And that makes it potentially much more strategically significant for PBMP than it first appeared.',
};

export const CANVAS_VIDEOS = {
  headline: 'Videos where the Canvas/Artifact becomes a rich user interface',
  lead: 'After looking specifically for LibreChat videos where the generated Canvas/Artifact becomes an actual rich user interface, these are the ones worth watching.',
  items: [
    {
      n: 1,
      title: 'Best example — 2026: interactive financial dashboard generated inside LibreChat',
      watch: 'Agentic Data Stack – Capital Markets / Interactive LibreChat UI',
      first: true,
      body: 'This is the closest match. Benjamin Wootton demonstrates an agentic analytics application using LibreChat + ClickHouse + MCP. He starts by asking questions about equity-trading data, drills into broker orders, and then has the system generate an interactive UI for analysing the results. His description explicitly says the workflow goes from data exploration to building an interactive UI, using LibreChat as the frontend. Watch this first.',
      flow: 'Natural language question → Agent queries actual data → Analyses the results → GENERATES THE USER EXPERIENCE → Interactive dashboard / data application',
      whyPbmp:
        'That is much closer to the PBMP concept of dynamically choosing/creating the appropriate Form for information than simply showing Markdown beside a chat.',
    },
    {
      n: 2,
      title: 'Official LibreChat Artifacts demo — still the best visual showcase',
      watch: 'Official Artifacts demonstration (embedded in current 2026 Artifacts documentation)',
      first: false,
      body: 'This is older, from 28 August 2024, but interestingly LibreChat’s current 2026 Artifacts documentation still embeds this as its official demonstration video. This is probably the broadest visual demonstration of what the Canvas can actually render. It shows: interactive React applications, HTML interfaces, animations, 3D visualisations, interactive games, Mermaid diagrams, dynamically generated UI, iterative modification by continuing the conversation. The key part isn’t the coding—it is that the right side becomes an application surface, rather than merely a document viewer.',
      flow: '',
      whyPbmp: '',
    },
    {
      n: 3,
      title: 'Very recent — June 2026: Agents + Skills + Artifacts + data',
      watch: 'Building Agentic RAG Systems with ClickHouse — Dustin Healy / AI Council — 16 June 2026',
      first: false,
      body: 'This is longer and more technical, but importantly it uses the current-generation LibreChat Agent system. The demonstration covers: Agent Builder → Skills → MCP → Artifacts → Subagents → actual data. The current-session summary specifically describes the presenter enabling Artifacts and having LibreChat output HTML that renders as an interactive chart/UI for data visualisation. Skip through the Docker/setup portions and watch the LibreChat sections.',
      flow: '',
      whyPbmp: '',
    },
    {
      n: 4,
      title: 'Current ClickHouse/LibreChat Agentic Data Stack demo',
      watch: 'Current ClickHouse Agentic Data Stack demo (embedded on their AI platform page)',
      first: false,
      body: 'Since ClickHouse acquired LibreChat, it has increasingly been demonstrating LibreChat as the front end for conversational/agentic analytics. Their current AI platform page has a dedicated embedded Agentic Data Stack demonstration using LibreChat + Agents + MCP + ClickHouse data → Interactive agentic analytics. ClickHouse explicitly describes LibreChat as the modern chat/user interface through which users interact with models and data. This one is useful to understand where LibreChat itself appears to be heading commercially after joining ClickHouse.',
      flow: '',
      whyPbmp: '',
    },
    {
      n: 5,
      title: 'Artifact panel + reusable structured prompts — May 2025',
      watch: 'From approximately 05:24 onward for the Artifact side panel',
      first: false,
      body: 'This isn’t as visually spectacular as #1/#2, but it demonstrates something else relevant to PBMP: structured inputs feeding structured Artifact output. It shows long-form generated output separated from the conversation and then iteratively developed/exported.',
      flow: '',
      whyPbmp: '',
    },
  ],
  orderIntro:
    'For the specific question about how rich the Canvas can become, don’t spend time watching every LibreChat tutorial.',
  order: [
    { n: 1, watch: '#1 Capital Markets 2026', stars: 5, why: 'Best demonstration of generated interactive business UI/dashboard' },
    { n: 2, watch: '#2 Official Artifacts demo', stars: 5, why: 'Best demonstration of the range of UI forms: React, 3D, animation, apps' },
    { n: 3, watch: '#3 June 2026 Agentic RAG', stars: 4, why: 'Shows Canvas integrated with the current Agent/Skills/Subagent architecture' },
    { n: 4, watch: '#4 ClickHouse current demo', stars: 4, why: 'Shows where LibreChat is heading as an agentic analytics UX' },
    { n: 5, watch: '#5 Prompt/Artifact', stars: 3, why: 'Mainly useful for structured prompt → document workflows' },
  ],
  conclusion:
    'There is an important conclusion from these demonstrations. The LibreChat Canvas isn’t really a “rich-text canvas.” That’s an unnecessarily narrow interpretation. The current documentation describes Artifacts as Generative UI and officially supports interactive React, HTML, SVG, Markdown and Mermaid, with a fullscreen presentation mode.',
  formArch:
    'Architecturally the Canvas/Artifact is FORM: Document (Markdown, HTML), Diagram (Mermaid, SVG), Chart (React, Recharts), Dashboard (React, HTML), Application (React, HTML with interactive controls).',
  whyOne:
    'And this is why video #1 is particularly important for PBMP: it shows that LibreChat can potentially serve not merely as PBMP’s chatbot, but as a dynamically generated presentation/Form layer where the AI decides that a particular answer is better represented as a table, chart, dashboard or interactive application rather than paragraphs of text.',
  gap:
    'There is still an important gap, however: native rich media such as video/audio and arbitrary PBMP components are not automatically first-class Artifact types. Those would need to be deliberately added to the React/HTML artifact environment or exposed through PBMP-specific components. That extension layer is precisely where the existing PBMP Form/Style Template architecture could become valuable.',
};

export const LOCAL_DEVICE = {
  headline: 'Local laptop/desktop — three levels, not one chat box',
  lead: 'There is quite a lot you can do at the local laptop/desktop layer, but architect it in three levels.',
  levels: [
    {
      n: 1,
      name: 'Standard LibreChat',
      meaning: 'Browser settings + microphone + speakers + files/images',
    },
    {
      n: 2,
      name: 'Enhanced LibreChat client',
      meaning: 'Camera + richer voice commands + local AI/media libraries',
    },
    {
      n: 3,
      name: 'Device/OS integration',
      meaning: 'Keyboard/mouse automation + Bluetooth/USB devices + screen/camera streams',
    },
  ],
  whisperCorrection:
    'One terminology correction first: Whisper is Speech-to-Text (STT) — it converts your voice into text. It does not produce natural voice playback. For natural voice output, LibreChat supports TTS systems such as OpenAI TTS, ElevenLabs, browser TTS, and self-hosted Piper/Coqui.',
  webApp:
    'LibreChat itself is fundamentally a web application, not a native Windows/macOS/Linux desktop application. Therefore, many “device-level” abilities are actually provided through the browser and the hardware connected to it.',
  capabilities: [
    { cap: 'Microphone input', today: 'yes', todayNote: 'Native', add: 'Better microphone / headset' },
    { cap: 'Voice → text', today: 'yes', todayNote: 'Yes', add: 'Whisper/local STT' },
    { cap: 'Natural voice response', today: 'yes', todayNote: 'Yes', add: 'ElevenLabs/OpenAI/local TTS' },
    { cap: 'Continuous voice conversation', today: 'yes', todayNote: 'Yes', add: 'Tune VAD/silence threshold' },
    { cap: 'Image upload + analysis', today: 'yes', todayNote: 'Yes', add: 'Vision-capable model' },
    { cap: 'Laptop camera snapshot', today: 'warn', todayNote: 'Not a major native UX', add: 'Add browser camera capture' },
    { cap: 'Continuous camera/video understanding', today: 'no', todayNote: 'Not standard', add: 'MediaPipe/ONNX/OpenCV' },
    { cap: 'Screen capture', today: 'warn', todayNote: 'Can be extended', add: 'Browser Screen Capture API' },
    { cap: 'Keyboard shortcuts', today: 'yes', todayNote: 'Some', add: 'Custom command layer' },
    { cap: 'Voice → keyboard commands', today: 'no', todayNote: 'Not standard', add: 'Easy to add' },
    { cap: '3D rendering', today: 'yes', todayNote: 'Artifacts', add: 'Hardware acceleration/WebGL' },
    { cap: 'Local ML inference', today: 'no', todayNote: 'Not core LibreChat', add: 'ONNX/Transformers.js/TF.js' },
    { cap: 'Bluetooth/USB devices', today: 'no', todayNote: 'Not core', add: 'Browser/OS APIs' },
    { cap: 'Offline/local voice', today: 'yes', todayNote: 'Possible', add: 'Whisper/Piper/Coqui locally' },
  ],
  voiceInput:
    'LibreChat already has a fairly sophisticated speech layer. STT: browser speech recognition, OpenAI Whisper, Azure Whisper, OpenAI-compatible STT, locally hosted Whisper. It also supports conversation mode, automatic transcription, voice/silence detection threshold, automatic sending after transcription, user-selectable speech settings.',
  voiceFlow:
    'Microphone → LibreChat browser → STT (browser or Whisper, local or cloud) → TEXT → LLM.',
  maxQuality:
    'For maximum quality, use a good USB/headset mic → Whisper-quality STT → GPT / Claude / Gemini, rather than relying entirely on the browser’s built-in dictation.',
  tts:
    'LibreChat supports automatic TTS playback and configuration of voice, language, playback rate and audio caching. LLM response → text → TTS (browser, OpenAI, ElevenLabs) → speakers. If the objective is natural human-sounding speech, test: 1. ElevenLabs 2. OpenAI TTS 3. local Piper/Coqui if privacy/offline operation is important. LibreChat supports all of these classes of TTS providers.',
  cameraToday:
    'LibreChat already supports uploading images directly to vision-capable models. Therefore this works today: Camera → take photograph → upload image → LibreChat → GPT/Gemini/Claude vision model → “What am I looking at?”',
  cameraGap:
    'What LibreChat does not currently document as a major first-class feature is a permanent Live Camera button comparable to an AI-native mobile application. But adding it is straightforward because modern browsers provide camera access.',
  cameraExt:
    'The extension would look like: laptop webcam → Browser getUserMedia() → take snapshot (Vision LLM via existing image-upload pipeline) or video stream (local vision processing: MediaPipe / ONNX / OpenCV / YOLO etc.). LibreChat already has client-side image resizing configuration, so large camera images can be resized/compressed before upload.',
  continuous:
    'Continuous camera understanding is more interesting. Suppose a security/industrial user points a webcam and asks: “Tell me whenever somebody enters this area.” You don’t want to send 30 video frames per second to GPT. Instead: CAMERA → LOCAL CLIENT → MediaPipe / YOLO / ONNX → detect meaningful EVENT (person entered, object disappeared, gesture detected, abnormal condition) → LibreChat → Agent. This is exactly the sort of thing for which adding client-side AI libraries becomes very useful.',
  voiceKeys:
    'Can voice commands be linked to keyboard functions? Absolutely. But this is not currently a general LibreChat feature. It would be a relatively small extension to the LibreChat React frontend.',
  slashDelete:
    'Example “Slash Delete” means: delete one previous word every second until I say STOP. Implement as: microphone → STT → command interpreter → normal speech inserts text, or command “/delete” starts DELETE-WORD STATE → every 1 second deleteWord() until “STOP”. Do not actually simulate Backspace repeatedly inside LibreChat. Instead tell the editor itself: delete previous word, wait 1 sec, … until STOP is recognised. That is more reliable.',
  voiceCommands: [
    { spoken: 'Slash delete', action: 'Start deleting backwards' },
    { spoken: 'Stop', action: 'Stop current continuous action' },
    { spoken: 'Slash undo', action: 'Undo' },
    { spoken: 'Slash redo', action: 'Redo' },
    { spoken: 'Slash new line', action: 'Insert line break' },
    { spoken: 'Slash select paragraph', action: 'Select current paragraph' },
    { spoken: 'Slash bold', action: 'Bold selected text' },
    { spoken: 'Slash copy', action: 'Copy selection' },
    { spoken: 'Slash paste', action: 'Paste' },
    { spoken: 'Slash send', action: 'Send prompt' },
    { spoken: 'Slash cancel', action: 'Cancel current operation' },
    { spoken: 'Slash agent Finance', action: 'Switch to Finance Agent' },
    { spoken: 'Slash search', action: 'Turn web search on' },
    { spoken: 'Slash canvas', action: 'Open Artifact/Canvas' },
    { spoken: 'Slash fullscreen', action: 'Full-screen current artifact' },
    { spoken: 'Slash listen', action: 'Read answer aloud' },
    { spoken: 'Slash camera', action: 'Activate camera' },
    { spoken: 'Slash capture', action: 'Take camera snapshot' },
    { spoken: 'Slash analyse', action: 'Send current image to vision model' },
  ],
  vui:
    'Then VOICE → STT → INTENT → ACTION starts to become a proper Voice User Interface, rather than merely speech dictation.',
  case1:
    'Case 1 — control LibreChat: easy. Voice → LibreChat JavaScript → LibreChat action. For example “Slash delete” can control the LibreChat editor.',
  case2:
    'Case 2 — control Microsoft Word/Excel/Chrome/your entire computer: a normal webpage is intentionally prevented from freely controlling other applications. Voice → LibreChat → DELETE SOMETHING IN EXCEL cannot safely be implemented through ordinary browser JavaScript alone. You need a local companion/OS automation layer.',
  osLayers: [
    { os: 'Windows', layer: 'AutoHotkey / PowerShell / accessibility APIs' },
    { os: 'macOS', layer: 'AppleScript / Shortcuts / Hammerspoon / Accessibility API' },
    { os: 'Linux', layer: 'xdotool / ydotool / accessibility APIs' },
    { os: 'Cross-platform', layer: 'Custom local Node/Python companion service' },
  ],
  deviceController:
    'Then: LibreChat → MCP / local API → DEVICE CONTROLLER → Keyboard, Mouse, Applications. This is a much more powerful architecture.',
  threeMeanings:
    'A very large number of libraries can be installed on the client side. But there are three distinct meanings of client-side library.',
  artifactLibs:
    'A. Libraries already available to LibreChat Artifacts: React, Tailwind, shadcn/ui, Lucide React, Recharts, Three.js, date-fns, react-day-picker. UI / Charts / 3D / Icons / Dates. That’s why the LibreChat Canvas can already create surprisingly sophisticated UIs.',
  extraIntro:
    'B. Additional libraries you could install into a customized LibreChat client. This is where the possibilities become much broader.',
  extraCats: [
    {
      name: '1. Voice / audio',
      libs: 'VAD, Whisper clients, Web Audio API wrappers, WaveSurfer.js, RecordRTC, Tone.js, local wake-word engines',
      enables: '“Hey PBMP”, “Slash delete”, “Stop”, “Continue”, “Read this”, and richer audio visualisations.',
    },
    {
      name: '2. Computer vision',
      libs: 'MediaPipe (face landmarks, hand tracking, body pose, gestures, object detection); ONNX Runtime Web; TensorFlow.js; OpenCV.js; Transformers.js',
      enables:
        'WEBCAM → browser → MediaPipe / ONNX → local understanding → only interesting result → LibreChat Agent. Vastly cheaper and faster than sending everything to the cloud.',
    },
    {
      name: '3. Rich dashboards / visualisation',
      libs: 'Beyond Recharts: ECharts, D3.js, Plotly, Vega / Vega-Lite, Highcharts, Chart.js, AG Grid, TanStack Table',
      enables: 'For PBMP, pay particular attention to ECharts + React + TanStack Table given the sort of dashboards and analytical Forms being built.',
    },
    {
      name: '4. 2D / diagramming / modelling',
      libs: 'React Flow, Cytoscape.js, JointJS, GoJS, Fabric.js, Konva, Mermaid, Excalidraw',
      enables:
        'Canvas could conceivably generate process diagram, business architecture, value chain, network map, UML-like model, organisation chart, decision tree, mind map as live interactive Forms. Overlaps significantly with PBMP’s existing modelling architecture.',
    },
    {
      name: '5. 3D / XR',
      libs: 'LibreChat already exposes Three.js. Additionally: React Three Fiber, Drei, Babylon.js, Rapier, Cannon, WebXR',
      enables: '3D scenes, 3D dashboards, digital twins, product models, physics simulations, VR, AR, spatial interfaces.',
    },
    {
      name: '6. Video',
      libs: 'Video.js, HLS.js, dash.js, MediaRecorder, WebRTC, ffmpeg.wasm',
      enables:
        'Turn Artifact/Canvas into a video player with subtitles, markers, annotations, chapters, object overlays, transcription, AI analysis. One way to overcome video not being a first-class Artifact type.',
    },
    {
      name: '7. Local data analytics',
      libs: 'DuckDB-Wasm, sql.js, Papa Parse, SheetJS, Arquero',
      enables:
        'Especially interesting. Upload a 300 MB CSV: rather than 300 MB → LLM, run DuckDB-Wasm locally, SQL/query/filter, only 25 relevant rows → LLM. Potentially much cheaper and more private.',
    },
    {
      name: '8. Documents / editors',
      libs: 'Tiptap, Lexical, ProseMirror, Monaco Editor, CodeMirror, PDF.js, Mammoth, SheetJS',
      enables: 'Canvas could become a genuine document editor, spreadsheet viewer, PDF viewer, code editor, Markdown editor, structured form editor — rather than merely displaying an answer.',
    },
    {
      name: '9. Device interaction',
      libs: 'Camera/Microphone MediaDevices, Screen Capture, Web Audio, WebRTC, Web Bluetooth, WebUSB, Web Serial, Gamepad API, Clipboard API, Geolocation, Fullscreen API',
      enables:
        'Some powerful capabilities don’t even need libraries because browsers already expose these APIs. Browser support and user permissions vary; sensitive device APIs deliberately require explicit user permission. Architecturally this is very significant.',
    },
    {
      name: '10. Local AI itself',
      libs: 'MediaPipe, local STT, Transformers.js, DuckDB-Wasm, ONNX',
      enables:
        'Make parts of LibreChat intelligent before anything reaches GPT: Camera → MediaPipe; Voice → local STT; Text → Transformers.js; CSV → DuckDB-Wasm; Image → ONNX → LOCAL CONTEXT → LibreChat → GPT / Claude. Potentially a much stronger architecture than trying to make the LLM perform every single task.',
    },
  ],
  sandpack:
    'LibreChat Artifacts currently run through a Sandpack-based environment. LibreChat’s frontend dependency tree includes @codesandbox/sandpack-react, and additional npm packages may be fetched externally. LibreChat’s maintainer has explained that if you want private/internal packages completely locally bundled, you need a customized Sandpack setup/pre-bundling approach.',
  installLevels: [
    {
      n: 1,
      name: 'Artifact library',
      meaning: 'Used by generated Canvas applications, e.g. Recharts, Three.js',
    },
    {
      n: 2,
      name: 'LibreChat client library',
      meaning: 'Permanently modifies the LibreChat frontend, e.g. MediaPipe, voice-command engine. Requires source customization/build.',
    },
    {
      n: 3,
      name: 'Local device service',
      meaning: 'Runs outside browser, e.g. OS keyboard automation, local Whisper, Python, hardware drivers',
    },
  ],
  workstation:
    'Maximum-capability PBMP workstation: User laptop has Voice Layer (STT + VAD), Vision Layer (MediaPipe/ONNX), Capture Layer, feeding LibreChat Client (Voice Commands, Canvas with React/Recharts/Three.js, Local Data with DuckDB-Wasm), plus Local Device Controller (keyboard / mouse / apps / devices). Then LibreChat → GPT / Claude / Gemini and Agents/MCP → PBMP.',
  implication:
    'The important design implication is that LibreChat does not have to remain simply a chat box. With relatively modest frontend work, it can become a multimodal device interface: voice + keyboard + mouse + camera + screen + rich Canvas + local AI + cloud AI + business applications.',
  eca:
    'And the /delete … STOP example is exactly the kind of interaction to implement as a reusable Event → Condition → Action mechanism rather than hard-code as a special voice feature. That would allow Voice, Keyboard, Mouse, Camera and other device events all to trigger the same underlying PBMP/LibreChat Action library.',
};

export const ECC = {
  headline: 'ECC is an OS/toolbox for a coding agent — not a product UI',
  inspected:
    'The actual ECC repository was inspected rather than treating it as a generic Claude Code add-on. The key point is that ECC is not really a standalone “product UI.” It is better thought of as an operating system/toolbox for an AI coding agent.',
  loop: 'plan → test → implement → review → verify → remember → improve',
  packages:
    'It packages specialist agents, hundreds of SKILL.md skills, commands, hooks, rules, memory/continuous-learning mechanisms and AgentShield security around an underlying coding agent.',
  version:
    'The latest published stable release found is ECC 2.2.0, released August 28, 2026. It is moving very quickly, so most videos show an earlier but conceptually similar version.',
  videos: [
    {
      n: 1,
      title: 'April 2026 complete walkthrough (~9½ minutes)',
      why: 'Best complete walkthrough found. Installs ECC live and demonstrates the Plan workflow, Test-Driven Development workflow and AgentShield rather than merely discussing the repository. Useful chapters approximately: installation 0:21, Plan 3:05, TDD 5:23, actual result 7:24 and AgentShield 8:10.',
    },
    {
      n: 2,
      title: 'Broader video — ECC segment ~6:49',
      why: 'Broader rather than ECC-only, but the ECC segment is useful because it explains ECC in the context of other Claude Code skill systems.',
    },
    {
      n: 3,
      title: 'ECC v1.6.0 February 2026 1080p demo/promo',
      why: 'Professional 1080p demonstration/promo with real demo footage as part of the February 2026 v1.6.0 release. Older, but useful for getting the basic idea visually.',
    },
  ],
  snapshotWarning:
    'One warning when watching these: don’t pay too much attention to claims such as “13 agents” or “43 skills”. Those videos are snapshots. The repository has expanded enormously since then; the current plugin metadata on main describes 68 agents, 286 skills and 94 legacy command shims.',
  notPluginInstall:
    'Can ECC be set up on LibreChat? Yes — but not by running /plugin install ecc@ecc. That installation command is specifically for Claude Code’s plugin system. However, ECC and LibreChat have converged architecturally to an almost surprising degree.',
  mapping: [
    { ecc: 'Skills (SKILL.md)', librechat: 'LibreChat Skills', how: 'Very high', tone: 'high' },
    { ecc: 'Specialist Agents', librechat: 'LibreChat Agents', how: 'High', tone: 'high' },
    { ecc: 'Subagents', librechat: 'LibreChat Subagents', how: 'High', tone: 'high' },
    { ecc: 'Rules', librechat: 'Always-applied Skills / Agent instructions', how: 'High', tone: 'high' },
    { ecc: 'MCP configurations', librechat: 'LibreChat MCP', how: 'High', tone: 'high' },
    { ecc: 'Commands /plan, /tdd, etc.', librechat: 'Skill invocation / Agent actions', how: 'Medium-high', tone: 'medium' },
    { ecc: 'Code execution', librechat: 'LibreChat Code Interpreter', how: 'High', tone: 'high' },
    { ecc: 'Agent orchestration', librechat: 'Subagents / Agent Chains / Handoffs', how: 'High', tone: 'high' },
    { ecc: 'Hooks', librechat: 'LibreChat Agent Plugin hooks', how: 'Requires adaptation / newest experimental functionality', tone: 'medium' },
    { ecc: 'ECC memory system', librechat: 'LibreChat Memory + persistent data', how: 'Conceptually similar, not identical', tone: 'medium' },
    { ecc: 'Continuous learning / instincts', librechat: 'Custom workflow needed', how: 'Medium', tone: 'medium' },
    { ecc: 'Git worktrees / direct repo operations', librechat: 'GitHub/filesystem MCP + code environment', how: 'Significant integration', tone: 'medium' },
    { ecc: 'AgentShield', librechat: 'External CLI/GitHub Action/MCP integration', how: 'Medium', tone: 'medium' },
    { ecc: 'Claude Code terminal harness itself', librechat: 'No direct equivalent', how: 'Not transferable', tone: 'low' },
  ],
  skillSync:
    'Particularly important discovery: ECC Skills could potentially be connected almost directly from GitHub. ECC puts its reusable capabilities into SKILL.md. LibreChat also now uses SKILL.md as its native Skill format. LibreChat can furthermore synchronize Skills automatically from a GitHub repository. It scans a configured GitHub path for SKILL.md, imports them and keeps them synchronized as the upstream repository changes.',
  githubPath: 'GitHub affaan-m/ECC → /skills/**/SKILL.md → LibreChat GitHub Skill Sync → LIBRECHAT SKILL LIBRARY (TDD, Security Review, Backend Patterns, Research, Python Patterns, Frontend, Architecture, Documentation, …)',
  betterThanCopy:
    'This is substantially better than manually copying hundreds of prompts. Some ECC Skills will still require adaptation because they assume Claude-Code-specific tool names or filesystem behaviour, but the basic file format is already compatible in concept. LibreChat also preserves unknown SKILL.md metadata rather than automatically rejecting it, which helps when importing skills from another ecosystem.',
  agents:
    'ECC has specialist roles such as planners, architects, reviewers, security agents, build-fix agents and domain specialists. Those can be recreated as LibreChat Agents: Master Agent spawning Planner, Architect, Developer, TDD Agent, Reviewer, Build Fixer, Security Reviewer. LibreChat’s current Subagent architecture is explicitly designed for this: a parent can spawn isolated specialist Agents, each with its own model, instructions, tools and skills.',
  mapsNaturally:
    'So ECC’s conceptual Main Claude session → Planner → Implementation → Reviewer → Security maps quite naturally into LibreChat Parent Agent → ECC-derived Planner → Developer → Reviewer → Security Agent.',
  multiModel:
    'And you are no longer limited to Claude. You could potentially have Planner → GPT, Developer → Claude, Reviewer → GPT, Researcher → Perplexity, Security → Gemini/Claude while retaining ECC’s workflow instructions. That is actually a potentially interesting improvement over ECC being tightly centred on one coding harness.',
  commands:
    'What happens to /plan, /tdd, /review, etc.? This is also manageable. ECC itself explicitly provides a Manual Adaptation Guide for non-native chat-style harnesses. Its recommendation is that where the host does not have ECC’s native slash-command system, commands should become explicit invocation handles mapping onto the corresponding Skills.',
  dollarSkills:
    'LibreChat already has something better than plain prompt simulation: $ tdd-workflow, $ security-review, $ backend-patterns. LibreChat Skills can be manually invoked, automatically selected by the model, or always applied. So you might translate ECC /plan /tdd /review /verify into LibreChat $plan $tdd-workflow $code-review $verification-loop — or simply let the Agent activate the appropriate Skill automatically.',
  hooks:
    'Hooks are the most interesting recent development. ECC makes very heavy use of hooks. For example, its repository contains PreToolUse hooks that can run before Bash, Write/Edit and other operations, plus hooks around session lifecycle, compaction, observations and governance.',
  hooksObstacle:
    'Historically this would have been the biggest obstacle to moving ECC onto LibreChat. But LibreChat is now introducing Agent Plugins which bundle Plugin → Skills, MCP servers, Command Hooks — and, very significantly, the LibreChat hook system sends Claude-compatible event payloads and even recognizes ${CLAUDE_PLUGIN_ROOT} as a plugin-path alias.',
  hooksCaveat:
    'That doesn’t mean ECC’s hooks.json can simply be copied unchanged. ECC has a substantial hook runtime and some hooks expect specific Claude Code tool names and filesystem semantics. But architecturally ECC Claude Plugin (SKILL.md, MCP, Hooks, Scripts) → conversion → LibreChat Agent Plugin (SKILL.md, MCP, Hooks, Scripts) is now a legitimate engineering path. One caveat: LibreChat Agent Plugins are explicitly experimental, and the newest Agent Plugin work is appearing in the v0.8.8 release-candidate line, rather than being something to rely upon as mature v0.8.7 production functionality today.',
  notReplace:
    'Where LibreChat will NOT simply replace Claude Code: this distinction is critical. Claude Code is a coding harness with privileged access to your project workspace: Read files, Edit files, Run shell, Run tests, Git, Worktrees, npm, deploy etc. LibreChat is primarily an AI application/orchestration platform. Giving a LibreChat Agent Skills + Subagents + Code Interpreter doesn’t automatically give it safe access to your Git repo, npm install, git branch, git worktree, git commit, deployment server, CI pipeline.',
  mcpLayer:
    'For full ECC-like software development, add an MCP execution layer: LibreChat → ECC Master Agent → Skills / Subagents / Memory → MCP TOOL LAYER → GitHub, Filesystem, Terminal → PROJECT REPO → Git / Tests / Build. At that point LibreChat starts becoming a genuine coding-agent harness, rather than merely an AI chat frontend.',
  notPretend:
    'Do not put Claude Code inside LibreChat and try to make LibreChat pretend to be Claude Code. Instead separate the valuable ECC intellectual assets from the Claude-specific runtime: ECC METHODS (Skills, Rules) + WORKERS (Agents, Subagents) + CONTROLS (Hooks, Security) → LibreChat → GPT/Claude, MCP Tools (GitHub/PBMP/etc.), Artifacts → work actually done.',
  pbmp:
    'For PBMP in particular: LibreChat provides the generic multi-model AI runtime. ECC contributes a large ready-made library of engineering Skills, Agents and workflow discipline. PBMP contributes the business ontology, Components, Intention/Process model, governance and business applications.',
  answer:
    'The answer is not merely “ECC can be installed on LibreChat.” It’s more accurately: a substantial part of ECC can be ported into LibreChat, and the overlap has become unusually strong because both ecosystems now use Skills, agents, subagents, MCP and increasingly compatible hook/plugin concepts. The Skills layer may require surprisingly little adaptation; full ECC parity would require an ECC→LibreChat adapter for Agents, Commands, Hooks, filesystem/Git execution and memory/learning. That adapter looks feasible enough that it is worth evaluating seriously rather than dismissing LibreChat as “just a chat UI.”',
};

export const DEVICE_MODES = {
  headline: 'Three operating modes: device-local, private/LAN, cloud',
  lead: 'The cleanest way to think about this is to distinguish three operating modes: Device-local = runs on the laptop itself. Local-network/local-server = no internet needed, but LibreChat talks to software running on that laptop or your LAN. Cloud/online = requires internet and an external provider.',
  stack:
    'LibreChat already supports local installation, including its own database/search/RAG infrastructure, so a substantial part of the stack can be made independent of the public internet.',
  pbmpLabels: [
    { name: 'Offline', meaning: 'Everything required exists on the device.' },
    { name: 'Private/LAN', meaning: 'No public internet, but services exist on an office/customer server.' },
    { name: 'Cloud', meaning: 'Internet services are used.' },
  ],
  labelsBetter: 'That distinction is more useful than only Online/Offline.',
  capabilities: [
    { cap: 'Normal text chat', exp: 'Ask questions, write, reason, summarize', off: 'both', how: 'Local LLM for offline; GPT/Claude/Gemini for online' },
    { cap: 'Natural-language agents', exp: 'Specialist assistants for finance, coding, research, etc.', off: 'both', how: 'Local or cloud model' },
    { cap: 'Speech-to-text', exp: 'Speak instead of typing', off: 'both', how: 'Browser speech/local Whisper, or cloud Whisper' },
    { cap: 'Text-to-speech', exp: 'AI speaks its response', off: 'both', how: 'Browser/Piper/Coqui/local TTS, or OpenAI/ElevenLabs' },
    { cap: 'High-quality local TTS', exp: 'More natural voices, voice cloning, expressive speech', off: 'offline', how: 'Kokoro, Chatterbox, Piper etc. through a local service' },
    { cap: 'Camera capture', exp: 'Take a picture from laptop/mobile camera', off: 'offline', how: 'PWA/browser camera permission' },
    { cap: 'Image analysis', exp: '“What is in this image?”', off: 'both', how: 'Local vision model or cloud GPT/Gemini/Claude vision' },
    { cap: 'Continuous camera intelligence', exp: 'Person/object/gesture detection', off: 'offline', how: 'Local MediaPipe/ONNX/vision model' },
    { cap: 'Microphone/audio analysis', exp: 'Voice, sound, acoustic event processing', off: 'both', how: 'Local browser/model or cloud service' },
    { cap: 'Document reading', exp: 'PDF, Word, text, spreadsheets', off: 'both', how: 'Local processing/RAG or cloud models' },
    { cap: 'Knowledge/RAG', exp: 'Ask questions about company documents', off: 'offline', how: 'LibreChat can run its RAG stack locally' },
    { cap: 'Conversation/history search', exp: 'Search previous conversations', off: 'offline', how: 'Local MongoDB/Meilisearch deployment' },
    { cap: 'Web research', exp: 'Current news, websites, live market information', off: 'online', how: 'Search providers/Web' },
    { cap: 'Perplexity-style research', exp: 'Current sourced answers', off: 'online', how: 'External service' },
    { cap: 'Dashboards/charts', exp: 'Interactive charts and dashboards in Canvas', off: 'offline', how: 'React/HTML/JS executes locally in browser' },
    { cap: 'Diagrams/SVG/Mermaid', exp: 'Processes, flows, visual models', off: 'offline', how: 'Browser-side rendering' },
    { cap: '3D scenes', exp: 'Interactive 3D forms/visualization', off: 'offline', how: 'WebGL/WebGPU/Three.js locally' },
    { cap: 'Local data analysis', exp: 'Analyse CSV/data without uploading everything', off: 'offline', how: 'DuckDB-Wasm/JS libraries' },
    { cap: 'Code execution', exp: 'Run Python/JS etc.', off: 'both', how: 'Local execution service or remote sandbox' },
    { cap: 'Image generation', exp: 'Create/edit images', off: 'both', how: 'Local image model or cloud image API' },
    { cap: 'MCP/business systems', exp: 'Access PBMP, CRM, ERP, databases', off: 'both', how: 'Depends where the target system lives' },
    { cap: 'Keyboard/voice commands', exp: '“Slash delete”, “send”, “open agent”', off: 'offline', how: 'Client/PWA logic' },
    { cap: 'Screen capture', exp: 'Share/analyse current screen', off: 'offline', how: 'Browser Screen Capture API' },
    { cap: 'Bluetooth/USB/serial devices', exp: 'Sensors, instruments, external equipment', off: 'offline', how: 'Browser APIs where supported' },
    { cap: 'Offline memory/preferences', exp: 'Retain settings locally', off: 'offline', how: 'Local browser/database' },
    { cap: 'Cloud model intelligence', exp: 'GPT/Claude/Gemini frontier reasoning', off: 'online', how: 'External API' },
  ],
  sttTtsDocs:
    'LibreChat explicitly supports local and cloud STT/TTS. Its documentation lists browser speech and local Whisper for STT, and browser, Piper and Coqui for local TTS, alongside OpenAI, Azure and ElevenLabs cloud services.',
  canvasLocal:
    'LibreChat’s Canvas/Artifacts can render interactive React, HTML, SVG, Markdown and Mermaid locally in the browser. By default its Sandpack renderer uses a public CodeSandbox CDN, but LibreChat supports self-hosting that bundler specifically for isolated/offline environments. Its document/RAG layer can also be hosted locally using PostgreSQL/pgvector/FastAPI.',
  pwaNotEnough:
    'The important qualification about “offline LibreChat”: a cached PWA screen by itself is not enough. For genuinely offline operation you would want LibreChat / PBMP PWA on the laptop (camera, microphone, local TTS/STT/vision, browser-side libraries) talking to a LOCAL LIBRECHAT SERVER with Local LLM (Ollama/vLLM), Local RAG (documents), and Local MCP (PBMP). Then internet disappears from the critical path. LibreChat itself can be installed locally with MongoDB, Meilisearch, RAG API and vector DB.',
  pwaSense:
    'Can a PWA sense the hardware and select the right capability? Yes — this is absolutely feasible. But not as precisely as a native desktop program. A PWA/browser can establish a device capability profile: GPU/WebGPU available? approximate RAM? CPU/thread capacity? camera? microphone? Bluetooth? screen capture? performance benchmark → DEVICE CAPABILITY TIER.',
  browserApis:
    'Web browsers can expose whether WebGPU is available and allow the application to request a GPU adapter. They also expose an estimate of available CPU concurrency. And some browsers expose approximate device RAM, deliberately rounded for privacy. So the idea is sound.',
  ttsProfiles:
    'Example automatic TTS selection: Discrete GPU / CUDA + high memory → HIGH TTS PROFILE (Chatterbox, richer model, voice cloning). Apple Silicon / moderate GPU → MEDIUM PROFILE (Chatterbox Nano/Turbo, Kokoro). CPU only / limited memory → LIGHT PROFILE (Kokoro-82M, Piper, Browser TTS). That is a very sensible architecture.',
  chatterboxNotSimple:
    'The Chatterbox/Kokoro example is directionally correct, but do not define the policy simply as GPU → Chatterbox, CPU → Kokoro, because even Chatterbox now has a CPU-oriented Nano version. Define quality tiers instead.',
  chatterboxFamily: [
    { version: 'Nano', size: '110M', use: 'CPU/on-device' },
    { version: 'Turbo', size: '350M', use: 'Higher-quality realtime agents' },
    { version: 'Multilingual V3', size: '500M', use: 'Rich multilingual TTS' },
  ],
  chatterboxNotes:
    'Chatterbox specifically says its Nano model targets CPU/on-device inference and can run faster than real time on an 8-core CPU. Turbo uses less compute/VRAM than earlier models. It also explicitly supports devices including CUDA GPUs, CPU and Apple MPS. Kokoro, meanwhile, is only 82M parameters and is deliberately designed to be lightweight and efficient.',
  tiers: [
    {
      n: 1,
      name: 'Basic device',
      hw: 'CPU, 4–8 GB RAM, no useful WebGPU/GPU',
      use: 'Kokoro-82M / Chatterbox Nano / Piper',
    },
    {
      n: 2,
      name: 'Good laptop',
      hw: 'Strong multicore CPU, Apple Silicon / integrated GPU, 8–16+ GB RAM',
      use: 'Kokoro / Chatterbox Nano / possibly Turbo',
    },
    {
      n: 3,
      name: 'AI-capable workstation',
      hw: 'NVIDIA CUDA or strong Apple GPU, 16–32+ GB RAM, good benchmark score',
      use: 'Chatterbox Turbo / Multilingual V3 / better Whisper / local vision models / larger local LLMs',
    },
  ],
  fingerprint:
    'A significant browser limitation: a PWA cannot safely ask “Tell me exactly which NVIDIA card this user has and exactly how much VRAM exists.” Browsers intentionally hide/blur some hardware detail to prevent device fingerprinting. RAM is deliberately reported approximately, and browsers can report fewer CPU cores than actually exist. So do not rely solely on hardware detection.',
  betterArch:
    'The better architecture is HARDWARE DETECTION + SHORT PERFORMANCE TEST → CAPABILITY SCORE. On first launch: Test 1 WebGPU available? +20; Test 2 CPU threads +10; Test 3 memory estimate +10; Test 4 synthesize 2 sec audio +30; Test 5 small vision inference +30 → 100. Then 0–30 Light, 31–60 Standard, 61–80 Advanced, 81–100 High-performance. This is much more reliable than trying to identify the exact laptop model.',
  cannotInstall:
    'One especially important point: the PWA cannot silently “install Chatterbox”. A PWA is sandboxed. It cannot simply say NVIDIA GPU detected → pip install chatterbox → install CUDA → start Python service without a separate native/local installation mechanism.',
  option1:
    'Option 1 — Everything browser-native: PWA → WASM, WebGPU, ONNX Runtime Web, browser-based models. Advantage: no software installation. But not every Python/PyTorch model can run this way.',
  option2:
    'Option 2 — PBMP local companion service. This is the architecture to favour. PBMP / LibreChat PWA → localhost → PBMP DEVICE AGENT (local small service) → TTS (Chatterbox, Kokoro), Vision (ONNX/OpenCV), STT (Whisper) on GPU / CPU / Apple MPS. The local Device Agent could detect hardware properly, including exact CPU, exact GPU, CUDA capability, VRAM, Apple Metal/MPS, available RAM, disk, installed drivers, microphones, cameras — and then expose a simple capability interface to the PWA. This is much more reliable than browser-only hardware sensing.',
  manager:
    'Therefore build a Device Capability Manager — a reusable PBMP/LibreChat layer. HARDWARE (CPU / GPU / RAM, Camera / mic, Bluetooth) + SOFTWARE (Models/libs installed, versions) + PERMISSIONS (Camera allowed? Mic allowed? Bluetooth?) → CAPABILITY PROFILE → LIGHT (Kokoro/Piper, tiny vision, small models) / STANDARD (Chatterbox Nano, medium Whisper, moderate vision) / HIGH (Chatterbox Turbo, Multilingual, large vision). Then LibreChat doesn’t need to understand hardware. It simply asks: “Give me the best available TTS engine.” and the Device Capability Manager replies Chatterbox-Turbo or Kokoro-82M depending on the machine.',
  beyondTts: [
    { fn: 'TTS', weak: 'Kokoro/Piper', strong: 'Chatterbox Turbo/V3' },
    { fn: 'STT', weak: 'Whisper tiny/base', strong: 'Whisper large' },
    { fn: 'Image recognition', weak: 'small MobileNet/YOLO', strong: 'larger YOLO/vision model' },
    { fn: 'Local LLM', weak: '1–3B model', strong: '7B/14B/30B model' },
    { fn: 'Embeddings', weak: 'small model', strong: 'larger embedding model' },
    { fn: 'OCR', weak: 'lightweight OCR', strong: 'richer multimodal model' },
    { fn: '3D rendering', weak: 'reduced geometry', strong: 'full detail/effects' },
    { fn: 'Video analysis', weak: '1 frame/sec', strong: '10–30 frames/sec' },
    { fn: 'Background agents', weak: '1 concurrent', strong: 'several concurrent' },
    { fn: 'Local analytics', weak: 'limited dataset', strong: 'large dataset' },
  ],
  dynamic:
    'That makes the device itself part of PBMP’s dynamic capability architecture, rather than treating every laptop identically.',
  permissions:
    'Camera and microphone can also be sensed/accessed through a PWA, but access always requires user permission and HTTPS/localhost. Browsers are explicitly designed so the user must approve camera/microphone use. Bluetooth, USB and serial access are also possible in supporting browsers, although browser compatibility is less universal and those APIs require secure contexts.',
  formalize:
    'So the architecture is feasible, and formalize it as: Detect → Benchmark → Classify Device → Load/activate best available capability → fall back gracefully to a lighter local engine or cloud engine. That is much stronger than manually asking every user which TTS/model they want.',
};



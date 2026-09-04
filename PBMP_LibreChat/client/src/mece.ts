export type MeceRow = {
  l2: string;
  l3: string;
  desc: string;
  status: string;
  offline: string;
  online: string;
  hybrid: string;
  client: string;
  improves: string;
};

export type MeceFamily = {
  n: number;
  name: string;
  rows: MeceRow[];
};

export const MECE = {
  headline: 'Master MECE functionality table — LibreChat v0.8.x',
  lead:
    'Re-checked against current LibreChat v0.8.x official documentation. This is a MECE functional architecture, not merely a reproduction of LibreChat’s menu. LibreChat’s own feature index currently spans Agentic AI, Search & Knowledge, Media, Chat and Security; those are reorganized here into business-facing capability families so that, for example, all image/video/audio capabilities sit together, while dashboards and rich interactive outputs sit under a separate Presentation/Generative-UI family.',
  convention:
    'Native = current LibreChat functionality. Configured = supported by LibreChat but needs a provider/service to be configured. Extension = feasible to embed into a LibreChat/PWA deployment but is not currently a standard LibreChat function. Experimental/Preview = LibreChat currently labels it as such.',
  offlineMeaning:
    'For Offline/Online/Hybrid, Offline means no public Internet is required; a local LibreChat server or local AI service on the laptop/LAN is allowed. LibreChat’s local Docker deployment can bundle MongoDB, Meilisearch, RAG and the vector database.',
  families: [] as MeceFamily[],
  threeArch:
    'The crucial distinction: “offline” does not mean “everything runs inside the browser.” There are three architectures: 1. DEVICE-LOCAL — PWA/browser + local services on same laptop. 2. PRIVATE / LAN — PWA → LibreChat server → AI/RAG/TTS/etc. on office/customer LAN. 3. CLOUD / HYBRID — PWA → LibreChat with local/private services and GPT / Claude / Gemini / Perplexity / ElevenLabs / etc. LibreChat’s local installation already supports the core private infrastructure—MongoDB, Meilisearch, RAG API and vector DB—and custom endpoints allow local/private AI services to be added.',
  tiersIntro:
    'Hardware tiers: rather than coding rules such as “GPU = Chatterbox, CPU = Kokoro”, create a general Device Capability Profile.',
  tiers: [
    {
      cls: 'Light',
      hw: '4–8 GB RAM, ordinary CPU, no useful GPU acceleration',
      enable: 'Browser/Kokoro/Piper-class TTS; browser/small Whisper STT; cloud LLM; basic camera snapshot; ordinary dashboards',
    },
    {
      cls: 'Standard',
      hw: 'Modern 8+ core CPU, 8–16 GB RAM, integrated GPU/Apple Silicon',
      enable: 'Better local STT/TTS; light local LLMs; local OCR; camera vision; richer dashboards/3D',
    },
    {
      cls: 'Advanced',
      hw: '16–32 GB+ RAM, capable Apple GPU / NVIDIA GPU',
      enable: 'Larger Whisper; richer Chatterbox-class TTS; 7B–14B-class local models; higher-quality local vision; substantial 3D',
    },
    {
      cls: 'AI Workstation',
      hw: '32–64 GB+ RAM and strong GPU/VRAM',
      enable: 'Larger local LLMs; several concurrent agents; high-frame-rate video analysis; image generation; sophisticated local multimodal AI',
    },
  ],
  pwaLimit:
    'The PWA itself can detect some GPU/CPU/memory capability, but browser APIs deliberately do not expose a perfect inventory of the computer. WebGPU is also not universal. Therefore the stronger architecture is LibreChat / PBMP PWA combining browser capability detection (WebGPU, CPU estimate, RAM estimate, Camera, Mic, Screen) with an optional Local Device Agent (exact GPU, VRAM, CUDA/Metal, RAM, Drivers, Installed models) → DEVICE PROFILE → LIGHT / STANDARD / ADVANCED.',
  fourLayers:
    'The most important architectural conclusion: LibreChat should be thought of as having four layers: (1) USER EXPERIENCE — Chat, Voice, Media, Projects, Dashboards, Artifacts. (2) AI ORCHESTRATION — Agents, Skills, Subagents, Chains, Memory, Scheduling. (3) CAPABILITIES / EXECUTION — RAG, Code, MCP, APIs, Search, Image, Speech. (4) EXECUTION LOCATION — Device ↔ LAN/private server ↔ Cloud.',
  manager:
    'The hardware-adaptive Device Capability Manager is not something LibreChat currently gives you out of the box. But it fits cleanly underneath LibreChat and could automatically choose the most suitable local/cloud implementation of each capability—TTS, STT, local LLM, vision, OCR, 3D rendering, video analysis, etc.—without the user needing to understand the technology.',
};

MECE.families = [
  {
    n: 1,
    name: 'Conversation & Workspace',
    rows: [
      { l2: 'Conversation', l3: 'Natural-language chat', desc: 'Ask ordinary questions such as “Why did sales fall in Q2?”, draft documents, analyse problems, brainstorm, translate, summarise etc. The quality comes primarily from the selected AI model.', status: 'Native', offline: '✅ with local model', online: '✅', hybrid: '✅', client: 'Any modern laptop/browser', improves: 'CPU sufficient for UI; GPU matters only if AI runs locally' },
      { l2: 'Conversation', l3: 'Model selection', desc: 'User can select different AIs for different jobs. Examples: GPT, Claude, Gemini, AWS Bedrock models, Ollama/OpenAI-compatible models, Mistral, DeepSeek, Perplexity, OpenRouter, Groq.', status: 'Native/configured', offline: '✅ local endpoints', online: '✅', hybrid: '✅', client: 'Minimal client requirements', improves: 'GPU useful for self-hosted/local LLMs' },
      { l2: 'Conversation', l3: 'Streaming responses', desc: 'Answer appears progressively rather than waiting for the complete response. Supported across all principal endpoint types.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Any', improves: 'Mainly server/network dependent' },
      { l2: 'Conversation', l3: 'Resumable/smooth streaming', desc: 'If connectivity briefly drops, conversations can reconnect/resume; streaming can also be visually smoothed.', status: 'Native/configured', offline: '✅ LAN', online: '✅', hybrid: '✅', client: 'Any', improves: 'Redis useful in scaled deployments' },
      { l2: 'Conversation', l3: 'Multi-model conversation', desc: 'Run/compare more than one AI conversation/model rather than committing everything to one model. LibreChat exposes MULTI_CONVO as a separately governed capability.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Any', improves: 'More server/model capacity because several models may run' },
      { l2: 'Conversation', l3: 'Context/cost visibility', desc: 'Show how much context is being consumed and estimated cost; administrators can control whether these are visible.', status: 'Native/configurable', offline: '✅', online: '✅', hybrid: '✅', client: 'None special', improves: 'None' },
      { l2: 'Message handling', l3: 'Edit and rerun', desc: 'Change an earlier question or answer and regenerate from that point. Example: change “India” → “India and UAE” and rerun.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Any', improves: 'None' },
      { l2: 'Message handling', l3: 'Fork/branch conversations', desc: 'Take one conversation in several directions without losing the original. Example: branch the same business case into Conservative / Base / Aggressive versions.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Any', improves: 'None' },
      { l2: 'Message handling', l3: 'Quote/select context', desc: 'Select an excerpt from an earlier answer and explicitly add it to the next question.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Mouse/touch/keyboard', improves: 'None' },
      { l2: 'Message handling', l3: 'Copy/download/run code', desc: 'Copy answers; copy/download code blocks; execute supported code where Code Interpreter is configured.', status: 'Native/configured', offline: '✅', online: '✅', hybrid: '✅', client: 'Any', improves: 'Code server for execution' },
      { l2: 'Message handling', l3: 'Attachment-only messages', desc: 'Send files without having to type artificial placeholder text.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Local storage access', improves: 'None' },
      { l2: 'Message handling', l3: 'Long-paste handling', desc: 'A very long paste can automatically become a text attachment rather than making the chat box unwieldy.', status: 'Native/preference', offline: '✅', online: '✅', hybrid: '✅', client: 'Any', improves: 'None' },
      { l2: 'Organisation', l3: 'Conversation history', desc: 'Retain and reopen previous conversations.', status: 'Native', offline: '✅ local DB', online: '✅', hybrid: '✅', client: 'Storage', improves: 'MongoDB' },
      { l2: 'Organisation', l3: 'Search history', desc: 'Search previous chat titles, tags and indexed message contents with typo-tolerant results.', status: 'Native/configured', offline: '✅', online: '✅', hybrid: '✅', client: 'Any', improves: 'Meilisearch' },
      { l2: 'Organisation', l3: 'Pin/bookmark', desc: 'Keep important chats/items readily accessible rather than finding them repeatedly. LibreChat exposes bookmarks/pinned chats through the navigation.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'None special', improves: 'None' },
      { l2: 'Organisation', l3: 'Archive conversations', desc: 'Move old chats out of normal history without deleting them.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'None' },
      { l2: 'Organisation', l3: 'Import conversations', desc: 'Bring supported exported conversations into LibreChat.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Storage', improves: 'None' },
      { l2: 'Organisation', l3: 'Share conversations', desc: 'Publish/manage shareable conversation links, subject to permissions.', status: 'Native', offline: 'LAN only if isolated', online: '✅', hybrid: '✅', client: 'None', improves: 'Network/web server' },
      { l2: 'Organisation', l3: 'Temporary/private chat', desc: 'Run conversations that are intentionally not treated like normal persistent history; governed separately by permissions/retention.', status: 'Native/configurable', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'None' },
      { l2: 'Projects', l3: 'Project workspaces', desc: 'Group related chats by client, programme, subject etc. Example “Tata Motors Market Entry” containing research, finance and presentation chats. Projects support search, sorting and moving chats.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'None special', improves: 'Database' },
      { l2: 'Preferences', l3: 'General preferences', desc: 'Per-user/browser controls such as 12/24-hour clock, week starting day, browser-tab title, mobile layout.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Browser local storage', improves: 'None' },
      { l2: 'Preferences', l3: 'Chat presentation preferences', desc: 'Auto-scroll, collapse long messages, LaTeX parsing, resize images before upload, long-paste behaviour.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Browser CPU', improves: 'None' },
      { l2: 'Preferences', l3: 'Keyboard preferences', desc: 'View, enable/disable and customise keyboard shortcuts. Bindings are stored in the browser.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Keyboard', improves: 'None' },
      { l2: 'Preferences', l3: 'Data controls', desc: 'Manage files, imports, shared chats, provider API keys, TTS cache, archived chats and deletion of conversations.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Local/browser storage', improves: 'Server storage where applicable' },
    ],
  },
  {
    n: 2,
    name: 'AI Intelligence & Agentic Work',
    rows: [
      { l2: 'Models', l3: 'Cloud frontier models', desc: 'Use externally hosted AI intelligence. Examples: OpenAI GPT family, Anthropic Claude, Google Gemini, Azure OpenAI, AWS Bedrock.', status: 'Native/configured', offline: '—', online: '✅', hybrid: '✅', client: 'Very light client', improves: 'Cloud does heavy computation' },
      { l2: 'Models', l3: 'Local/private models', desc: 'Keep inference locally/private. Example architecture: LibreChat → Ollama/vLLM/LocalAI → Llama, Qwen, Mistral, DeepSeek-family models. LibreChat explicitly supports OpenAI-compatible custom endpoints including Ollama.', status: 'Configured', offline: '✅', online: '✅ if remotely hosted', hybrid: '✅', client: 'CPU for small quantized models', improves: 'GPU/VRAM greatly improves larger local models' },
      { l2: 'Models', l3: 'Model specifications/presets', desc: 'Hide technical complexity behind business-friendly choices; e.g. “Research – High Quality”, “Fast Draft”, “Private Local” rather than exposing every parameter.', status: 'Native/configurable', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'Depends on selected model' },
      { l2: 'Agents', l3: 'Specialist AI Agents', desc: 'Build reusable AI workers such as Finance Analyst, Sales Proposal Agent, HR Policy Assistant, Developer, Market Researcher with a chosen model, instructions, tools and skills.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Depends on underlying model', improves: 'GPU if local' },
      { l2: 'Agents', l3: 'Agent versioning', desc: "Inspect the Agent's previous configurations and restore an earlier version.", status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'Database' },
      { l2: 'Agents', l3: 'Agent model preferences', desc: 'Configure creativity, context size, output size, image detail and provider-specific parameters.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'Model dependent' },
      { l2: 'Skills', l3: 'Reusable Skills', desc: 'Capture “how we do this”: brand rules, approval checklist, TDD procedure, market-research methodology, PBMP business-case process. Skills can carry instructions, scripts and references.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'Depends on skill tools' },
      { l2: 'Skills', l3: 'Skill invocation', desc: 'Agent can use a Skill manually, automatically when relevant, or on every turn.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'None' },
      { l2: 'Skills', l3: 'Central skill deployment', desc: 'Administrators can deploy centrally controlled Skills rather than each user reinventing instructions.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Server storage', improves: 'None' },
      { l2: 'Multi-agent', l3: 'Subagents', desc: 'Main Agent delegates isolated work to another AI worker. Example: Strategy Agent spawns Research, Finance and Risk subagents, then combines the results.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Depends on models', improves: 'More CPU/GPU/API capacity for concurrent agents' },
      { l2: 'Multi-agent', l3: 'Agent Chains', desc: 'Predefine a multi-agent sequence. Example Research → Analysis → Critic → Executive Summary.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Model dependent', improves: 'Additional model capacity' },
      { l2: 'Multi-agent', l3: 'Parent/child context isolation', desc: "Child worker can perform verbose/tool-heavy work without filling the parent Agent's context with every intermediate step.", status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'None special', improves: 'Server memory/context capacity' },
      { l2: 'Human oversight', l3: 'Ask User', desc: 'Agent can stop and ask structured questions/choices before continuing. Example: “Should I use FY25 actuals or FY26 budget?”', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Any', improves: 'None' },
      { l2: 'Human oversight', l3: 'Tool approval', desc: 'Require human review before selected tool actions execute; useful for higher-risk writes or business-system actions.', status: 'Native/configured', offline: '✅', online: '✅', hybrid: '✅', client: 'Any', improves: 'None' },
    ],
  },
  {
    n: 3,
    name: 'Knowledge, Search & Information',
    rows: [
      { l2: 'Personal context', l3: 'User Memory', desc: 'AI can remember structured facts/preferences between chats; e.g. “Use INR”, “I prefer concise board summaries.” Users can manually edit/delete memory and optional automatic extraction can update it.', status: 'Native/configured', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'Database' },
      { l2: 'Files', l3: 'Upload as Text', desc: 'Drop in PDF, spreadsheet or code file and let LibreChat extract the whole text into the current conversation.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'CPU/storage', improves: 'None for ordinary text documents' },
      { l2: 'Files', l3: 'Agent File Context', desc: 'Give an Agent persistent reference material. Example HR Agent always carries the HR Policy Manual. Handles tables, equations, multilingual/structured text.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Storage', improves: 'OCR improves scanned documents' },
      { l2: 'Files', l3: 'File Search / RAG', desc: 'Ask questions across large document sets without placing every page into every prompt. Example “Find clauses dealing with termination across these 400 contracts.”', status: 'Native/configured', offline: '✅', online: '✅', hybrid: '✅', client: 'Basic client only', improves: 'PostgreSQL/pgvector; embedding compute benefits from CPU/GPU' },
      { l2: 'Files', l3: 'File citations', desc: 'Show which source/file supported an answer, where endpoint/configuration supports it.', status: 'Native/configurable', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'RAG/search service' },
      { l2: 'OCR', l3: 'Document/image OCR', desc: 'Extract text from scans, screenshots and complex PDFs; LibreChat can fall back to normal parsing where OCR is absent.', status: 'Configured enhancement', offline: '✅ if self-hosted', online: '✅', hybrid: '✅', client: 'CPU sufficient for light OCR', improves: 'GPU improves heavier OCR/vision' },
      { l2: 'Search', l3: 'Web Search', desc: 'Give the AI live/current web information, with search + page retrieval and optional reranking. Providers include options such as SearXNG, Tavily, Serper, Keenable, Firecrawl, Jina/Cohere in different roles.', status: 'Native/configured', offline: '⚠️ only intranet/local index; not the public web', online: '✅', hybrid: '✅', client: 'None', improves: 'Network access; search/scraping services' },
      { l2: 'Search', l3: 'External research provider', desc: 'Use custom endpoints such as Perplexity for web-grounded research while remaining inside LibreChat. Perplexity is explicitly included among OpenAI-compatible custom endpoint examples.', status: 'Configured', offline: '—', online: '✅', hybrid: '✅', client: 'None', improves: 'Internet/API' },
    ],
  },
  {
    n: 4,
    name: 'Media & Multimodal',
    rows: [
      { l2: 'Image', l3: 'Image input / visual understanding', desc: 'Give a vision-capable model an image and ask “What is wrong with this chart?”, “Identify equipment in this photograph”, “Compare these two screenshots.” Vision depends on the selected model.', status: 'Native/model-dependent', offline: '✅ with local vision model', online: '✅', hybrid: '✅', client: 'Storage/display', improves: 'GPU useful for local vision models' },
      { l2: 'Image', l3: 'Image upload preprocessing', desc: 'Large JPEG/PNG/WebP images can be resized in the browser before upload, controlled by a user preference or administrator policy.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Client CPU/RAM', improves: 'Faster CPU improves resizing' },
      { l2: 'Image', l3: 'Image generation', desc: 'Tell an Agent “Create a product hero image”. LibreChat has built-in Agent image tools; OpenAI’s image tooling is one native route.', status: 'Native/configured', offline: '⚠️ with custom/self-hosted image backend', online: '✅', hybrid: '✅', client: 'None if cloud', improves: 'Significant GPU/VRAM for local diffusion/image models' },
      { l2: 'Image', l3: 'Image editing', desc: 'Upload an existing image and ask the Agent to modify it, where configured image tool supports editing.', status: 'Native/configured', offline: '⚠️ local backend', online: '✅', hybrid: '✅', client: 'Display/storage', improves: 'GPU for local generation/editing' },
      { l2: 'Image', l3: 'Camera snapshot', desc: 'User presses Camera, takes a photograph, then sends it through existing vision analysis.', status: 'Extension to PWA; not standard LibreChat camera UX', offline: '✅', online: '✅', hybrid: '✅', client: 'Webcam/camera required', improves: 'GPU only if processing locally' },
      { l2: 'Image', l3: 'Live camera intelligence', desc: 'Examples: detect people, hands, gestures, objects or events continuously before escalating meaningful frames to an AI Agent.', status: 'Extension', offline: '✅', online: '✅', hybrid: '✅', client: 'Camera + CPU', improves: 'GPU/NPU strongly improves real-time vision; MediaPipe/ONNX etc.' },
      { l2: 'Video', l3: 'Video playback/embedding', desc: 'Show/play an MP4/HLS/video element in a richer PBMP/LibreChat surface.', status: 'Extension; video is not a native LibreChat Artifact type', offline: '✅', online: '✅', hybrid: '✅', client: 'Display + hardware video decoding', improves: 'GPU improves high-resolution decoding' },
      { l2: 'Video', l3: 'Video analysis', desc: 'Sample frames/audio from video and ask AI to summarise, classify or detect events. Example security video → “Highlight when anyone enters restricted area.”', status: 'Extension/integration', offline: '✅ with local vision/STT', online: '✅', hybrid: '✅', client: 'CPU + storage', improves: 'GPU highly desirable for continuous/high-FPS analysis' },
      { l2: 'Video', l3: 'Webcam/live video streaming', desc: 'Continuous user camera feed with event-based analysis rather than manually uploading images.', status: 'Extension', offline: '✅', online: '✅', hybrid: '✅', client: 'Camera', improves: 'GPU/NPU helpful' },
      { l2: 'Audio & Voice', l3: 'Speech-to-text', desc: 'Talk rather than type. LibreChat officially supports browser STT, local Whisper/LocalAI, OpenAI Whisper, Azure Whisper and OpenAI-compatible STT.', status: 'Native/configured', offline: '✅', online: '✅', hybrid: '✅', client: 'Microphone', improves: 'CPU works for small Whisper; GPU improves larger/faster local transcription' },
      { l2: 'Audio & Voice', l3: 'Conversation voice mode', desc: 'Configure speech conversation mode, automatic transcription, silence/decibel threshold and automatic sending.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Mic', improves: 'Better mic/headset improves accuracy' },
      { l2: 'Audio & Voice', l3: 'Text-to-speech', desc: 'AI reads responses aloud. Official options include browser TTS, Piper, Coqui, OpenAI TTS, Azure and ElevenLabs.', status: 'Native/configured', offline: '✅', online: '✅', hybrid: '✅', client: 'Speakers/headphones', improves: 'CPU for Piper/light models; cloud requires little local compute' },
      { l2: 'Audio & Voice', l3: 'TTS preference settings', desc: 'User can choose provider/engine, voice, language, automatic playback, playback speed and caching where configured.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Speakers', improves: 'None' },
      { l2: 'Audio & Voice', l3: 'Higher-end local TTS', desc: 'Examples discussed in this thread: Kokoro-82M, Chatterbox-family TTS. These are not named native LibreChat backends; they would be exposed via a compatible/local service. LibreChat officially supports custom OpenAI/ElevenLabs-compatible TTS URLs.', status: 'Extension/configured local service', offline: '✅', online: '✅ if remotely hosted', hybrid: '✅', client: 'Speakers', improves: 'Strong CPU works for lighter model; GPU can enable richer/larger models' },
      { l2: 'Audio & Voice', l3: 'Voice command control', desc: 'Example “slash delete” → delete one word/sec until “STOP”; “slash send”; “slash camera”.', status: 'Extension to client/PWA', offline: '✅', online: '✅', hybrid: '✅', client: 'Mic + keyboard', improves: 'Minimal compute beyond STT' },
    ],
  },
  {
    n: 5,
    name: 'Presentation, Dashboards & Generative UI',
    rows: [
      { l2: 'Documents', l3: 'Rich rendered documents', desc: 'Generate a separately rendered Markdown/HTML result rather than leaving everything inside chat. Example board memo, structured report, policy page.', status: 'Native via Artifacts', offline: '✅*', online: '✅', hybrid: '✅', client: 'Browser', improves: '*Offline rendering requires local availability of artifact dependencies' },
      { l2: 'Diagrams', l3: 'Mermaid/process diagrams', desc: 'Generate flow diagrams/process diagrams directly from natural language. Example “Draw procure-to-pay with approval gates.”', status: 'Native', offline: '✅*', online: '✅', hybrid: '✅', client: 'Browser', improves: 'Client CPU/GPU for rendering' },
      { l2: 'Graphics', l3: 'SVG/HTML visualizations', desc: 'Generate scalable graphics, infographics, cards and visual components.', status: 'Native', offline: '✅*', online: '✅', hybrid: '✅', client: 'Browser', improves: 'CPU/GPU for complex graphics' },
      { l2: 'Interactive UI', l3: 'React components', desc: 'Generate actual interactive user-interface components, not just static pictures. Example sliders, selectors, data cards, forms.', status: 'Native', offline: '✅*', online: '✅', hybrid: '✅', client: 'Browser', improves: 'Faster CPU/RAM for complex UIs' },
      { l2: 'Dashboards', l3: 'Dashboard creation', desc: 'Agent can generate a React/HTML dashboard containing KPIs, charts, tables, filters and drill-down controls because Artifacts support interactive React/HTML.', status: 'Native capability via Artifacts', offline: '✅*', online: '✅', hybrid: '✅', client: 'Modern browser', improves: 'GPU helpful for very complex visualizations' },
      { l2: 'Dashboards', l3: 'Dashboard rendering', desc: 'Render the generated dashboard in the dedicated Artifact view and interact with it separately from the chat.', status: 'Native', offline: '✅*', online: '✅', hybrid: '✅', client: 'Browser/display', improves: 'Hardware acceleration improves large visualizations' },
      { l2: 'Dashboards', l3: 'Dashboard iteration', desc: 'Say “make the regional chart a bar chart”, “add a profitability filter”, “make it board-ready” and regenerate the Artifact conversationally.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Any', improves: 'Model does most work' },
      { l2: 'Interactive UI', l3: 'Polished application UI', desc: 'Artifact mode can use standard instructions or shadcn/ui guidance to produce a more polished application-like experience.', status: 'Native', offline: '✅*', online: '✅', hybrid: '✅', client: 'Browser', improves: 'None special' },
      { l2: '3D / advanced visuals', l3: '3D scenes/digital twins', desc: 'Three.js/advanced 3D can be added to a customised Artifact/client stack; suitable for product models, spatial dashboards, simulations.', status: 'Extension/custom Artifact environment', offline: '✅', online: '✅', hybrid: '✅', client: 'GPU/WebGL/WebGPU strongly preferred', improves: 'Discrete/integrated GPU determines quality/frame rate' },
    ],
  },
  {
    n: 6,
    name: 'Execution, Integration & Automation',
    rows: [
      { l2: 'Code', l3: 'Code Interpreter', desc: 'AI can actually calculate/process information instead of merely explaining how: Python, JS/TS, Go, C/C++, Java, PHP, Rust, Fortran, R.', status: 'Native/configured service', offline: '✅ self-hosted', online: '✅ remote service', hybrid: '✅', client: 'Client unimportant', improves: 'CPU; GPU may be needed by code workloads' },
      { l2: 'Code', l3: 'File processing', desc: 'Upload files into sandbox, process them and download outputs. Example consolidate CSVs, calculate KPIs, create output file.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'Storage', improves: 'RAM/CPU proportional to data size' },
      { l2: 'Code', l3: 'Stateful code environment', desc: 'Preserve workspace/files/packages across iterative Agent executions, with user/agent/conversation scope options. LibreChat labels this highly experimental.', status: 'Experimental', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'Local/remote VM' },
      { l2: 'Code', l3: 'Personal attached worker', desc: 'User can pair an outbound code worker on their own VM and select it as the execution environment. Currently experimental.', status: 'Experimental', offline: '✅', online: '✅', hybrid: '✅', client: 'User workstation/server', improves: 'Exact CPU/GPU becomes usable by Agent' },
      { l2: 'Integration', l3: 'MCP', desc: 'Standard mechanism for letting Agents use external tools/data. Example PBMP MCP → find project, create requirement, fetch customer; Spotify MCP → search/play/manage playlists.', status: 'Native', offline: '✅ if local/LAN systems', online: '✅', hybrid: '✅', client: 'None', improves: 'Depends on connected system' },
      { l2: 'Integration', l3: 'Selective MCP tools', desc: 'An administrator/Agent designer can allow only specific operations from a connected system rather than granting everything.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'None' },
      { l2: 'Integration', l3: 'Deferred tool loading', desc: 'Allow access to very large tool libraries but only load tools when needed, preserving the model’s context.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'None' },
      { l2: 'Integration', l3: 'API Actions', desc: 'Give an Agent explicit API operations such as create ticket, fetch CRM record, submit approval.', status: 'Native through Agents', offline: '✅ for LAN/local APIs', online: '✅', hybrid: '✅', client: 'None', improves: 'Destination API' },
      { l2: 'Integration', l3: 'Programmatic tool calling', desc: 'AI writes sandbox code that can loop over approved MCP tools, retry, paginate, compare results and transform them before answering.', status: 'Native/opt-in', offline: '✅', online: '✅', hybrid: '✅', client: 'Client unimportant', improves: 'Code sandbox capacity' },
      { l2: 'Automation', l3: 'Background tool execution', desc: 'Long-running code/MCP/Action work can continue while the Agent proceeds and deliver results later in the same workflow.', status: 'Native/opt-in', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'Persistent server process; Redis useful at scale' },
      { l2: 'Automation', l3: 'Scheduled Agent runs', desc: 'Automatically run a saved Agent hourly/daily/weekday/weekly/custom. Examples morning sales report, weekly competitor research, month-end reminder. Currently experimental and disabled by default.', status: 'Experimental', offline: '✅ if local services', online: '✅', hybrid: '✅', client: 'None', improves: 'Server must remain running' },
      { l2: 'Extensibility', l3: 'Agent Plugins', desc: 'Bundle centrally deployed Skills, MCP servers and optional command hooks as installable packages. Currently experimental.', status: 'Experimental', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'LibreChat server' },
      { l2: 'Extensibility', l3: 'Lifecycle hooks', desc: 'Trusted plugin code can intercept Agent lifecycle events, e.g. block an unsafe write before it occurs.', status: 'Experimental', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'Server-side process' },
    ],
  },
  {
    n: 7,
    name: 'Governance, Administration & Organisational Reuse',
    rows: [
      { l2: 'Identity', l3: 'Authentication/login', desc: 'Multi-user deployment with enterprise authentication including local credentials and SSO options. LibreChat documents OAuth/OIDC/SAML/LDAP and 2FA capabilities.', status: 'Native/configured', offline: '✅ local accounts/LDAP', online: '✅', hybrid: '✅', client: 'None', improves: 'Identity provider if SSO' },
      { l2: 'Authorization', l3: 'Feature permissions', desc: 'Decide which roles may use/create/share Agents, Prompts, MCP servers, Skills, schedules, memory, web search, code etc.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'Database' },
      { l2: 'Authorization', l3: 'Resource-level ACL', desc: 'Control a specific Agent, Prompt, MCP server, file or project independently: who can view/edit/share it.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'Database' },
      { l2: 'Authorization', l3: 'Users/groups/roles', desc: 'Organise people into groups and custom roles; users can have multiple roles. Example Research, Finance Admin, External Contractor.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'Database/identity integration' },
      { l2: 'Reuse', l3: 'Prompt library', desc: 'Create and govern reusable prompts rather than everybody inventing their own. Interface permissions separately cover prompt use/create/share/public.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'Database' },
      { l2: 'Reuse', l3: 'Agent/Tool marketplace', desc: 'Discover reusable Agents/tools where marketplace access is enabled. Marketplace has its own permission.', status: 'Native/configurable', offline: '✅ internal instance', online: '✅', hybrid: '✅', client: 'None', improves: 'Database' },
      { l2: 'Administration', l3: 'Admin Panel', desc: 'Browser UI for managing users, groups, roles, grants and configuration rather than editing YAML manually. Currently labelled Preview.', status: 'Preview', offline: '✅', online: '✅', hybrid: '✅', client: 'Any admin browser', improves: 'LibreChat API + MongoDB' },
      { l2: 'Administration', l3: 'Group/role-specific configuration', desc: 'Example: Research gets more models/tools/higher recursion while contractors get a restricted interface.', status: 'Native/admin UI preview', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'Database' },
      { l2: 'Administration', l3: 'System grants/delegated admin', desc: 'Give someone limited admin authority such as manage users or read usage without making them a super-admin.', status: 'Native', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'None' },
      { l2: 'Security', l3: 'Automated moderation/rate limiting', desc: 'Protect against brute-force login, excessive messages, uploads, forks, TTS/STT/tool calls etc.; temporarily block abusive users/IPs.', status: 'Native/configurable', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'Cache/database; perimeter security still advisable' },
      { l2: 'Governance', l3: 'Privacy/terms', desc: 'Display organisation-specific Privacy Policy/Terms and require acceptance where configured.', status: 'Native/configurable', offline: '✅', online: '✅', hybrid: '✅', client: 'None', improves: 'None' },
      { l2: 'Cost governance', l3: 'Usage/context/cost', desc: 'Show context/cost information, manage user-provided provider keys and build organisational usage controls around model consumption.', status: 'Native/configurable', offline: '✅ local usage accounting', online: '✅', hybrid: '✅', client: 'None', improves: 'Database' },
    ],
  },
  {
    n: 8,
    name: 'Device-local & Hardware-Adaptive Layer',
    rows: [
      { l2: 'Hardware detection', l3: 'CPU capability detection', desc: 'PWA can obtain an approximate level of CPU parallelism and use it as one signal in choosing local workloads. Browser reporting can deliberately differ from the machine’s exact hardware.', status: 'PWA extension; not LibreChat-native policy engine', offline: '✅', online: '✅', hybrid: '✅', client: 'CPU', improves: 'Useful for choosing lighter/heavier local models' },
      { l2: 'Hardware detection', l3: 'GPU/WebGPU capability', desc: 'PWA can determine whether WebGPU is available and request a GPU adapter in supporting secure-context browsers. WebGPU is not universally supported.', status: 'Extension', offline: '✅', online: '✅', hybrid: '✅', client: 'GPU', improves: 'Enables client-side ML/3D acceleration' },
      { l2: 'Hardware detection', l3: 'Approximate RAM', desc: 'Browser can expose limited/approximate device-memory information in supporting browsers rather than exact physical RAM.', status: 'Extension', offline: '✅', online: '✅', hybrid: '✅', client: 'RAM', improves: 'Helps capability-tier selection' },
      { l2: 'Hardware detection', l3: 'Performance benchmark', desc: 'Rather than trusting hardware names, run short tests: TTS synthesis speed, ML inference speed, GPU availability etc. and assign Light / Standard / Advanced device class.', status: 'Recommended extension', offline: '✅', online: '—', hybrid: '✅', client: 'CPU/GPU/RAM', improves: 'Most reliable adaptation approach' },
      { l2: 'Hardware adaptation', l3: 'Automatic TTS choice', desc: 'Example policy: weak CPU → browser/Piper/Kokoro-like light service; better local hardware → richer Chatterbox-like service; cloud fallback → ElevenLabs/OpenAI. LibreChat already supports multiple configured speech providers and lets users choose among them.', status: 'Extension policy on top of native speech', offline: '✅', online: '✅', hybrid: '✅', client: 'CPU/GPU + speakers', improves: 'GPU allows richer local models' },
      { l2: 'Hardware adaptation', l3: 'Automatic STT choice', desc: 'Example: low-spec → browser/small Whisper; workstation → larger local Whisper; otherwise cloud Whisper. LibreChat supports browser, local Whisper and cloud STT.', status: 'Extension policy', offline: '✅', online: '✅', hybrid: '✅', client: 'Mic + CPU/GPU', improves: 'GPU significantly accelerates large Whisper' },
      { l2: 'Device access', l3: 'Microphone', desc: 'Browser/PWA accesses microphone for speech after user permission.', status: 'Native speech + browser permission', offline: '✅', online: '✅', hybrid: '✅', client: 'Mic required', improves: 'Quality mic improves recognition' },
      { l2: 'Device access', l3: 'Camera', desc: 'PWA can request camera access through browser media APIs, with user permission.', status: 'Extension', offline: '✅', online: '✅', hybrid: '✅', client: 'Camera required', improves: 'GPU for local vision' },
      { l2: 'Device access', l3: 'Screen capture', desc: 'PWA can request the display/window/tab stream in supporting browsers, enabling “analyse what is on my screen.”', status: 'Extension', offline: '✅', online: '✅', hybrid: '✅', client: 'Display', improves: 'GPU useful for continuous processing' },
      { l2: 'Device access', l3: 'Keyboard → commands', desc: 'Native LibreChat already supports configurable keyboard shortcuts; an extended client can add new semantic actions.', status: 'Native shortcuts + Extension commands', offline: '✅', online: '✅', hybrid: '✅', client: 'Keyboard', improves: 'None' },
      { l2: 'Device access', l3: 'Voice → keyboard/action mapping', desc: 'Example: “slash delete” → delete previous word every second → “STOP” stops it. Best implemented as a LibreChat editor Action rather than synthesising OS keyboard presses.', status: 'Extension', offline: '✅', online: '✅', hybrid: '✅', client: 'Mic', improves: 'STT engine' },
      { l2: 'Device/OS bridge', l3: 'Control other desktop applications', desc: 'Example voice instruction from LibreChat causing action in Excel, filesystem or another native app. Browser sandbox prevents unrestricted OS control, so use a trusted local companion agent/MCP service.', status: 'Extension/local companion', offline: '✅', online: '✅', hybrid: '✅', client: 'Depends on target app/device', improves: 'Native companion gives exact GPU/CPU/driver/device access' },
    ],
  },
];

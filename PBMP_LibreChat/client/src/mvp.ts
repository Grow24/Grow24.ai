export const FIRST_MVP = {
  headline: 'First MVP — resist installing everything',
  objective:
    'In 15–20 minutes, demonstrate that LibreChat can understand a business request, use internal and external knowledge, analyse data, call a business system, create a rich dashboard/output, and interact through voice/image—not just chat.',
  blocks:
    "LibreChat's current v0.8.x already supports the key building blocks for this: Agents, Skills, RAG/File Search, MCP, Code Interpreter and Artifacts/Generative UI.",
  items: [
    { n: 1, setup: 'LibreChat base installation', min: 'One server; 1 Admin + 2–3 test users', demo: 'Professional multi-user AI workspace, chat history, projects, settings', why: 'Establishes the platform', pri: 'Must' },
    { n: 2, setup: '2–3 AI models', min: 'GPT-5.6 Sol + Claude; optionally Perplexity/web-search capability', demo: 'Ask same problem using different intelligence; route different work to appropriate models', why: 'Shows LibreChat is model-independent, not another ChatGPT clone', pri: 'Must' },
    { n: 3, setup: 'One strong business Agent', min: 'e.g. “PBMP Executive Analyst”', demo: 'User says: “Analyse this business situation and recommend what management should do”', why: 'Demonstrates persistent specialist AI rather than generic chat', pri: 'Must' },
    { n: 4, setup: '3–5 Skills', min: 'e.g. Executive Summary, Business Case, Financial Analysis, Risk Analysis, MECE Analysis', demo: "Agent automatically follows the organisation's preferred method", why: 'Shows reusable organisational intelligence', pri: 'Must' },
    { n: 5, setup: 'Internal Knowledge/RAG', min: 'Load perhaps 10–20 good sample documents', demo: '“Answer this using our policies/reports/contracts and show the relevant information”', why: 'This is usually the first major enterprise “wow”', pri: 'Must' },
    { n: 6, setup: 'Web/current research', min: 'LibreChat Web Search or Perplexity endpoint', demo: '“Compare our internal position with what is happening in the market today”', why: 'Demonstrates internal + external intelligence', pri: 'Must' },
    { n: 7, setup: 'Code Interpreter', min: 'Enable on the Agent', demo: 'Upload Excel/CSV → calculate → analyse → generate outputs', why: 'Proves the AI can do analytical work, not merely talk', pri: 'Must' },
    { n: 8, setup: 'Artifacts / Canvas', min: 'Enable Artifacts', demo: 'Generate report + chart + interactive dashboard from the analysis', why: "Probably the strongest visual demonstration of LibreChat's potential", pri: 'Must' },
    { n: 9, setup: 'One MCP integration', min: 'Connect to one simple PBMP/API/database/service', demo: '“Fetch the project/customer/requirement” or “update this record”', why: 'Shows transition from AI answering → AI taking action', pri: 'Must' },
    { n: 10, setup: 'Voice', min: 'Microphone STT + good TTS provider', demo: 'Speak request; AI responds naturally by voice', why: 'Makes it immediately feel like a new user interface', pri: 'Highly desirable' },
    { n: 11, setup: 'Image understanding', min: 'Use vision-capable GPT/Claude/Gemini model', demo: 'Upload screenshot/chart/photo: “What is wrong here?”', why: 'Demonstrates multimodality', pri: 'Highly desirable' },
    { n: 12, setup: 'Basic governance', min: 'One Admin role + normal User; restrict one capability', demo: 'Show that Admin decides who can use models/tools/agents', why: 'Prevents client perception that this is an uncontrolled AI toy', pri: 'Highly desirable' },
  ],
  builder:
    "LibreChat's Agent Builder lets you combine a model with instructions, Tools, MCP, Skills, Code Interpreter, File Search and File Context in one Agent.",
  oneAgent:
    'Build only ONE sophisticated Agent initially. Don’t start by making 20 Agents. Create PBMP Executive Analyst. Its job: understand a management question, examine internal information, obtain current external information where needed, perform quantitative analysis, use PBMP/business-system tools, and present the answer in the most suitable form.',
  agentParts: {
    model: ['GPT-5.6 Sol', 'possibly alternate Claude'],
    skills: ['Executive Analysis', 'MECE', 'Business Case', 'Financial Analysis', 'Risk Analysis'],
    knowledge: ['Sample company documents'],
    tools: ['Web Search', 'Code Interpreter', 'PBMP MCP'],
    output: ['Chat', 'Report', 'Table', 'Chart', 'Dashboard'],
  },
  seventy: 'That one Agent demonstrates perhaps 70% of the strategically important platform.',
  demoPrompt:
    '“We are considering launching Product X in three Indian markets. Use our internal sales and cost information, research the current external market, analyse the economics and risks, recommend where we should launch, and give me a management dashboard.”',
  demoInstead:
    'Instead of demonstrating functionality feature-by-feature, give LibreChat one realistic executive problem. The client watches: user speaks “Should we launch Product X?” → PBMP Executive Analyst uses Internal Knowledge (RAG/files), Current Web (Search/Perplexity), PBMP MCP (sales/projects/customer data), Code Interpreter (Python) → Recommendation as Narrative, Table, Dashboard, plus Voice summary. That is much stronger than “Here is Agents / MCP / RAG.” The technology disappears and the client sees a business outcome.',
  dashboardNote:
    'Keep the dashboard simple enough that it reliably renders. LibreChat’s Artifacts system is specifically intended to generate interactive React/HTML-style outputs alongside chat, so this is a natural MVP use rather than a separate dashboard application.',
  markets: [
    { market: 'Mumbai', revenue: '₹18.2 Cr', roi: '24%', risk: 'Medium' },
    { market: 'Delhi', revenue: '₹15.7 Cr', roi: '19%', risk: 'Low' },
    { market: 'Bangalore', revenue: '₹13.6 Cr', roi: '16%', risk: 'Medium' },
  ],
  rec: 'Launch Mumbai → Delhi → Bangalore',
  docs: [
    { doc: 'Company profile', purpose: 'Gives context' },
    { doc: 'Product catalogue', purpose: 'Product knowledge' },
    { doc: 'Sales CSV/XLSX', purpose: 'Quantitative analysis' },
    { doc: 'Customer list', purpose: 'Segmentation' },
    { doc: 'Cost/pricing sheet', purpose: 'Profitability' },
    { doc: 'Marketing plan', purpose: 'Strategy' },
    { doc: 'Competitor note', purpose: 'Competitive context' },
    { doc: 'Business policy/SOP', purpose: 'Demonstrate RAG' },
    { doc: 'One contract', purpose: 'Demonstrate document interrogation' },
    { doc: 'One project/business case', purpose: 'Demonstrate PBMP context' },
  ],
  docsNote:
    'You do not need a massive PBMP knowledge base for MVP. Even a carefully designed small corpus is sufficient. LibreChat’s File Search performs semantic RAG across uploaded documents, while File Context can permanently attach smaller reference material to an Agent.',
  mcp:
    'MCP: don’t integrate the whole of PBMP yet. For MVP, expose only 3–5 PBMP operations. Then demonstrate: “Get sales for Product X in Mumbai for the last 12 months.” LibreChat calls PBMP. Then: “Create a requirement that we add distributor profitability analysis.” LibreChat creates something in PBMP. MCP tools can be selectively enabled per Agent, which is useful here: the demo Agent does not need access to the entire application.',
  mcpOps: [
    'get_project(project_name)',
    'get_customer(customer_name)',
    'get_sales(product, geography, period)',
    'create_requirement(description)',
    'update_project_status(project, status)',
  ],
  voice:
    'Voice: use cloud first, not Chatterbox/Kokoro. For this MVP do not yet build the hardware-adaptive local speech architecture. Microphone → OpenAI Whisper / supported STT → LibreChat → OpenAI TTS / ElevenLabs → Speaker. That gets the user experience working quickly. LibreChat already supports configurable STT/TTS including browser/local and cloud providers. Hardware-adaptive local TTS is Phase 2, not MVP.',
  image:
    'Camera should initially mean Image Upload. Don’t build live-video intelligence yet. Demo: take a photo/screenshot → drag into LibreChat → “Explain what you see.” Examples: dashboard screenshot → “Identify the three worrying KPIs and explain why.” Invoice photograph → “Extract the important information and flag inconsistencies.” That proves the business value of visual intelligence without building camera/video infrastructure. Live camera is Phase 2.',
  notIn: [
    { item: 'Ollama/local LLM', why: 'Cloud model proves the concept much faster' },
    { item: 'vLLM', why: 'Production-scale problem' },
    { item: 'Chatterbox/Kokoro auto-selection', why: 'Valuable later; adds local runtime complexity' },
    { item: 'Hardware Capability Manager', why: 'Architecture is sound but not necessary to validate LibreChat' },
    { item: 'Live camera/video', why: 'Significantly more complexity than image upload' },
    { item: 'Bluetooth/USB devices', why: 'Separate device-integration problem' },
    { item: 'OS-level voice control', why: 'Not needed to prove AI workspace' },
    { item: '3D', why: 'Great capability, wrong first proof' },
    { item: '20+ Agents', why: 'Creates confusion' },
    { item: 'Hundreds of Skills', why: 'Start with 3–5 excellent ones' },
    { item: 'Full PBMP MCP', why: 'Expose only 3–5 operations' },
    { item: 'Full enterprise SSO', why: 'Simple login adequate for first demonstration' },
    { item: 'Agent Plugins', why: 'Currently experimental' },
    { item: 'Stateful code sessions', why: 'Current docs explicitly call them highly experimental.' },
    { item: 'Scheduled Agents', why: 'Useful later, not necessary for the first “wow”' },
    { item: 'Sophisticated local/offline deployment', why: 'Demonstrate after client sees value' },
  ],
  stack:
    'The actual MVP stack is surprisingly small: LibreChat → GPT-5.6, Claude, Web Search/Perplexity → PBMP Executive Agent → Skills (3–5), RAG (10–20 docs), PBMP MCP (3–5 tools), Code Interpreter, Artifact/interactive dashboard, plus Voice and Image upload.',
  ruthless:
    'If ruthless, eight things: LibreChat; GPT-5.6 + Claude; one PBMP Executive Agent; 3–5 Skills; 10–20 RAG documents; Code Interpreter; Artifacts/dashboard; one small PBMP MCP. Then add voice and image upload because they are relatively low incremental effort and make the demonstration much more impressive.',
  proposition:
    'The result will demonstrate the central proposition: a user can express an intention naturally; LibreChat/PBMP can understand it, obtain the right knowledge, choose specialist capabilities, perform work, interact with business systems, and return the result in the most useful Form—not merely as text. That is enough to decide whether LibreChat deserves to become a major part of the PBMP AI architecture before investing in the more ambitious local-device, offline, camera/video and hardware-adaptive layers.',
  runtime:
    'Integration assets are in the repo, not another architecture page. Wire them in AgentBot (Gemini is the live model on this install).',
  runtimeAssets: [
    { path: 'PBMP_LibreChat/mcp/', use: 'PBMP MCP (stdio for AgentBot, HTTP :5202 for curl/TrueForge)' },
    { path: 'PBMP_LibreChat/skills/', use: '6 SKILL.md files — attach as Agent File Context' },
    { path: 'PBMP_LibreChat/knowledge/', use: '10 sample docs + sales CSV — upload to File Search' },
    { path: 'PBMP_LibreChat/agents/pbmp-executive-analyst.md', use: 'Paste into Agent Builder' },
    { path: 'HBMP_AgentBot/librechat.yaml', use: 'mcpServers.pbmp + agents capabilities tools/context' },
    { path: 'npm run dev:pbmp-mcp', use: 'HTTP sample API on port 5202' },
  ],
};

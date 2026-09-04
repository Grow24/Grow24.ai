export const TF_MVP = {
  headline: 'TrueForge MVP — much narrower than the LibreChat MVP',
  purpose:
    'Prove: “Can an AI Agent take a meaningful business objective, break it into steps, use tools and data, execute work safely, ask for approval where necessary, and return a completed result?”',
  noLibreChat:
    'TrueForge already includes a bundled chat UI, Agent runtime, MCP tools, Skills, sandboxed execution, human approvals, Subagents and session state, so we do not need LibreChat in the first TrueForge proof.',
  items: [
    { n: 1, setup: 'Local TrueForge', config: 'Run locally on one laptop/server using its bundled UI', proves: 'We can get the Agent platform operating quickly', pri: 'Must' },
    { n: 2, setup: 'One strong LLM', config: 'GPT / Claude / Gemini', proves: 'Gives the Agent its reasoning ability', pri: 'Must' },
    { n: 3, setup: 'One reusable Agent', config: 'e.g. PBMP Business Analyst Agent', proves: 'TrueForge can create a persistent specialised worker', pri: 'Must' },
    { n: 4, setup: '3–5 Skills', config: 'e.g. Business Analysis, MECE, Financial Analysis, Risk Review, Verification', proves: 'Agent follows a repeatable business methodology', pri: 'Must' },
    { n: 5, setup: 'One MCP connection', config: 'PBMP or a simple database/API', proves: 'Agent can retrieve real information and perform an actual action', pri: 'Must' },
    { n: 6, setup: 'Sandbox / code execution', config: "Enable TrueForge's isolated execution environment", proves: 'Agent can calculate/process files rather than merely talk', pri: 'Must' },
    { n: 7, setup: 'One human approval point', config: 'e.g. require approval before changing PBMP data', proves: 'Shows safe Agent autonomy rather than uncontrolled automation', pri: 'Must' },
    { n: 8, setup: 'One Subagent', config: 'e.g. Research or Financial Analysis worker', proves: 'Shows delegation and separation of work', pri: 'Highly desirable' },
    { n: 9, setup: 'Generative UI', config: 'Make the final result visually useful', proves: 'Demonstrates that results need not be plain text', pri: 'Highly desirable' },
    { n: 10, setup: 'Session persistence', config: 'Start task, continue it later', proves: 'Demonstrates that this is a working Agent, not a disposable prompt', pri: 'Highly desirable' },
  ],
  localMode:
    'TrueForge’s local mode is deliberately very lightweight: one process + SQLite, with no Postgres, Redis or authentication required. The project itself recommends this mode specifically for personal use and evaluation. So the infrastructure MVP can genuinely be very small.',
  oneAgent:
    'Exactly as with LibreChat, don’t create 20 Agents initially. Build one: PBMP Business Analyst Agent. TrueForge is specifically designed to let an Agent pick from connected models, MCP servers, Skills and a sandbox, while adding approval and context/session handling around the work.',
  parts: {
    model: ['Claude / GPT'],
    skills: ['Business Analysis', 'MECE Analysis', 'Financial Analysis', 'Risk Analysis', 'Verification'],
    tools: ['PBMP MCP'],
    sandbox: ['Python / data processing'],
    subagent: ['Research / Finance worker'],
    approval: ['User approves write/change'],
  },
  job: '“Review this project. Compare actual performance to plan, identify the three biggest problems, calculate their financial impact, propose corrective actions, and update the project risk register after I approve.”',
  flow:
    'That single instruction should trigger: USER → PBMP Business Analyst → PBMP MCP (project, actuals, risks) → Finance Subagent → Sandbox (variances) → Main Agent (root causes) → proposes changes → “Shall I update the risk register?” → HUMAN APPROVAL → PBMP MCP → UPDATE COMPLETED → EXECUTIVE RESULT. That demonstrates almost everything important about TrueForge in one workflow.',
  approvalWhy:
    'Without the approval step, the demonstration risks looking like “Chatbot that can call APIs.” With it, the client sees: AI understands → investigates → calculates → proposes an action → HUMAN decides → AI executes. TrueForge calls these human checkpoints and provides tool approval and ask-user mechanisms specifically for this purpose. That is much closer to a real digital worker.',
  sandboxWhy:
    'Suppose the project has a CSV containing 50,000 transactions. A plain LLM might try to reason over the text. TrueForge can instead have the Agent use its isolated execution environment: 50,000 transactions → Sandbox → Python / processing → Revenue variance, Margin variance, Customer outliers → Agent reasons over results. TrueForge deliberately treats the sandbox as a tool, provisioning isolated code/file execution when necessary. Include this in the MVP.',
  skillsOnly:
    'Skills: only 3–5. Don’t start with a huge library. Use: 1. business-analysis 2. financial-analysis 3. root-cause-analysis 4. risk-analysis 5. verification. TrueForge Skills are Git-backed SKILL.md instruction packs that are loaded when required rather than stuffing every methodology into every prompt. That lets you demonstrate: same Agent + different reusable methods.',
  mcp:
    'MCP: expose only 4–5 PBMP functions. Not all of PBMP. This is enough to demonstrate Read (“Get Project Alpha.”), Analyse (“Why is it behind plan?”), Write (“Add this as a High risk.”). That is the critical transition from information assistant to working Agent.',
  mcpOps: ['get_project()', 'get_project_actuals()', 'get_project_risks()', 'create_risk()', 'update_risk()'],
  subagent:
    'Subagent: just ONE initially. Create Financial Analyst. Main Agent says “Analyse the financial performance of this project” and delegates that part. TrueForge explicitly supports Subagents as part of its context-management architecture. That’s enough to show the concept. Don’t create a swarm yet.',
  genui:
    'Generative UI: useful, but second priority. If time permits, make the final answer look like PROJECT HEALTH (Schedule 🔴 -18%, Cost 🟠 +9%, Benefits 🟢 On plan), TOP RISKS, Recommended actions with [Approve Risk Updates] / [Request More Analysis]. TrueForge supports Generative UI in chat. But for the very first technical proof, prioritize Agent → MCP → sandbox → approval → action over polishing the UI. LibreChat is stronger for showcasing the complete end-user experience; TrueForge should prove that the execution engine works.',
  notIn: [
    { item: 'LibreChat integration', why: 'First prove TrueForge independently' },
    { item: 'TrueFoundry Gateway', why: 'Useful later for enterprise governance/model routing' },
    { item: '10 different models', why: 'One excellent model is enough' },
    { item: '20 Agents', why: 'Makes debugging and demonstration harder' },
    { item: '100 Skills', why: 'Not required to prove architecture' },
    { item: 'Multiple MCP servers', why: 'One PBMP MCP proves the point' },
    { item: 'Kubernetes', why: 'Massive overkill for POC' },
    { item: 'Postgres + Redis', why: 'Local mode already uses SQLite' },
    { item: 'OIDC/SSO', why: 'Not needed for local POC' },
    { item: 'Multiple sandbox providers', why: 'Daytona/default path is enough' },
    { item: 'Complex context optimisation', why: 'TrueForge handles much of this internally' },
    { item: 'Production monitoring', why: 'Phase 2' },
    { item: 'Hardware/offline AI', why: 'Separate architectural problem' },
  ],
  infraNote:
    'TrueForge itself draws the same infrastructure distinction: local mode for trying it out uses SQLite and no extra infrastructure; hosted/team mode adds Postgres and Redis.',
  six:
    'The absolute minimum is only six building blocks: TrueForge → one Main Agent → one model, 3–5 Skills, PBMP MCP (real PBMP data), Sandbox, Human approval, Action executed. Then add one Subagent and Generative UI if the demonstration should be visually stronger.',
  vsLibre: [
    { libre: '“Look how users can interact with AI.”', tf: '“Look how an Agent can actually perform work.”' },
    { libre: 'Chat', tf: 'Execution' },
    { libre: 'Voice/image', tf: 'Tools' },
    { libre: 'Documents/RAG', tf: 'Business-system access' },
    { libre: 'Projects', tf: 'Durable Agent state' },
    { libre: 'Rich dashboard', tf: 'Sandbox/calculation' },
    { libre: 'Multiple models', tf: 'Agent orchestration' },
    { libre: 'User experience', tf: 'Human approval' },
    { libre: 'AI workspace', tf: 'Digital worker runtime' },
  ],
  close:
    'If we build both POCs, they shouldn’t duplicate each other. LibreChat MVP = front-office AI experience. TrueForge MVP = backend Agent execution. Once those two are independently proven, then connecting them becomes meaningful.',
};

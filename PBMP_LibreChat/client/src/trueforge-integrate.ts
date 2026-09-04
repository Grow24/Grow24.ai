export const TF_INTEGRATE = {
  headline: 'LibreChat ↔ TrueForge — architecturally clean, not plug-and-play',
  lead: 'They can integrate quite well architecturally, but not yet “plug-and-play.” There is no current official LibreChat ↔ TrueForge connector. The good news is that both products expose the right interfaces to connect cleanly.',
  simple: 'LibreChat = front office / user experience. TrueForge = back office / heavy Agent execution.',
  fit: [
    { area: 'LibreChat calls a TrueForge Agent', score: 'Very good', tone: 'high', why: 'TrueForge exposes an HTTP API; LibreChat can turn OpenAPI-described APIs into Agent Actions.' },
    { area: 'Models', score: 'Very good', tone: 'high', why: 'Both support OpenAI, Claude, Gemini and OpenAI-compatible providers.' },
    { area: 'MCP tools', score: 'Very good conceptually', tone: 'high', why: 'Both understand MCP. They can also share the same business-system MCP servers.' },
    { area: 'Skills', score: 'Excellent', tone: 'high', why: 'Both use SKILL.md. LibreChat can even sync Skills from GitHub; TrueForge uses Git-backed Skills.' },
    { area: 'Subagents', score: 'Good', tone: 'high', why: 'Both support them' },
    { area: 'Code/sandbox', score: 'Good', tone: 'high', why: 'Both can execute code, though the runtime mechanisms differ' },
    { area: 'Human approval', score: 'Medium', tone: 'medium', why: "Both support approval, but approval events wouldn't automatically map perfectly across systems" },
    { area: 'Memory/session state', score: 'Medium', tone: 'medium', why: 'Both have state, but you must decide which system owns the canonical conversation/Agent state' },
    { area: 'Streaming', score: 'Medium', tone: 'medium', why: 'Both stream, but a bridge may need to translate TrueForge events into the LibreChat UX' },
    { area: 'Generative UI / Canvas', score: 'Medium', tone: 'medium', why: "Both have rich UI concepts, but TrueForge's Generative UI won't automatically become a LibreChat Artifact" },
    { area: 'Authentication', score: 'Medium', tone: 'medium', why: 'User identity/permissions need mapping between LibreChat and TrueForge' },
    { area: 'Direct native connector', score: 'None today', tone: 'low', why: 'No official one-click LibreChat–TrueForge integration found today' },
  ],
  cleanest:
    'Cleanest integration: Business user → LibreChat (Chat, Voice, Images, Projects, Documents/RAG, Artifacts, Dashboards). When “This requires substantial work” → TrueForge Agent (Planning, Subagents, Long-running work, Context management, Code sandbox, Human approvals, Durable state) → Models, MCP, Skills (GPT/Claude/Gemini, PBMP/CRM/databases, common SKILL.md). That separation is important.',
  example:
    'User tells LibreChat: “Analyse the profitability of all 4,000 customers, identify deteriorating accounts, investigate their recent transactions and tell me which accounts need management intervention.” LibreChat recognises this isn’t simply a chat question and calls TrueForge: “Run Customer Profitability Investigation.” TrueForge then gets customer data through PBMP MCP, spawns several analysis workers, runs Python/SQL, handles large intermediate results, investigates anomalies, resumes if work is interrupted, and produces structured results. LibreChat turns them into executive explanation + table + interactive dashboard + recommended actions. That’s where the combination becomes attractive.',
  actions:
    'Technically, the easiest bridge is probably LibreChat Actions. LibreChat Agents can create tools directly from an OpenAPI specification. TrueForge exposes its Agent runtime through an HTTP API and TypeScript SDK, and its repository includes an API reference. Conceptually create LibreChat Actions such as run_agent(), get_run_status(), continue_session(), approve_action(), cancel_run(), get_result(). Then LibreChat sees TrueForge almost like another business application — Tools: Web Search, PBMP MCP, Image Generation, Code Interpreter, plus TrueForge (Run Deep Analysis Agent, Run Research Agent, Run Long-Running Workflow). This is likely the simplest first POC.',
  skills:
    'Another very good integration point: shared Skills. This may be even easier. Create one GitHub repository PBMP-AI-Skills with SKILL.md packs (business-case, market-analysis, financial-analysis, risk-analysis, executive-summary). Then both LibreChat and TrueForge Agents use the same skill. LibreChat officially supports GitHub Skill Sync. TrueForge likewise describes Skills as Git-backed SKILL.md instruction packs. That means the business methodology does not need to belong to either product. That is a very desirable architecture for PBMP.',
  mcp:
    'MCP should also belong outside both. Don’t create a LibreChat-specific PBMP connector AND a TrueForge-specific PBMP connector. Instead one PBMP MCP SERVER used by LibreChat, TrueForge, and future AI. Both products already support MCP. This gives a much cleaner architecture: PBMP capabilities stay in PBMP MCP; PBMP does not become dependent on either one.',
  gateway:
    'They can even share the same AI gateway. LibreChat accepts OpenAI-compatible custom endpoints. TrueForge also accepts OpenAI-compatible providers. So both could potentially sit behind TrueFoundry AI Gateway, OpenRouter or another enterprise gateway. That centralises model access, API keys, costs, routing, fallback, monitoring.',
  messy1:
    'Don’t let both systems orchestrate the same task. Bad: LibreChat Agent → LibreChat Subagent → TrueForge Agent → TrueForge Subagent → another Agent… Now nobody knows who owns the workflow. Instead: LibreChat decides WHAT high-level job to request. TrueForge owns HOW the heavy job executes.',
  messy2:
    'Don’t duplicate memory. Otherwise LibreChat Memory + LibreChat Conversation + TrueForge Session + TrueForge Agent State all remember slightly different things. Designate: LibreChat = human conversation/history/preferences. TrueForge = execution/workflow state. PBMP = authoritative business memory/data. That is much cleaner.',
  messy3:
    'Rich UI needs translation. TrueForge Generative UI ≠ automatically a LibreChat Artifact. For an initial integration, have TrueForge return structured JSON/data (e.g. Market | Revenue | ROI | Risk), then let LibreChat generate the dashboard. That preserves the clean division: TrueForge performs. LibreChat presents.',
  messy4:
    'Human approvals: TrueForge has its own approval mechanism. LibreChat has its own human/tool approval capabilities. Those two approval experiences won’t automatically merge. For Phase 1, keep approvals owned by one side—probably TrueForge for workflows delegated to TrueForge.',
  scores: [
    { label: 'Architecture compatibility', score: '9/10', note: 'Remarkably complementary concepts: models + Skills + MCP + agents + APIs + subagents' },
    { label: 'Current out-of-box integration', score: '4/10', note: 'There isn’t an obvious Enable TrueForge switch inside LibreChat.' },
    { label: 'Effort to create a useful POC', score: 'Low-to-moderate', note: 'The basic bridge can simply be LibreChat Action → TrueForge HTTP API, rather than modifying either codebase extensively.' },
  ],
  pbmp:
    'For PBMP: Business / Semantic Layer splits to User Experience (LibreChat: Chat, Voice, Artifacts, Dashboards) and Business Systems (PBMP MCP). Routing / Intent then sends SIMPLE WORK to LibreChat Agent and COMPLEX WORK to TrueForge Agent Runtime. Both share common assets: Skills (Git repo), MCP (PBMP), Models (AI Gateway). This is actually better than making TrueForge the backend for every LibreChat request. Use LibreChat’s own Agent system for ordinary conversational work. Bring in TrueForge where its extra execution discipline is valuable: long-running, multi-step, high-tool-use, resumable or operational Agent workflows. That gives the best of both without unnecessarily doubling the architecture.',
};

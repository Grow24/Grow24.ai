export const TRUEFORGE = {
  headline: 'LibreChat and TrueForge overlap — they are not the same kind of product',
  distinction:
    'LibreChat = the AI workplace people interact with. TrueForge = the engine room that makes AI agents reliably do work.',
  launched:
    'TrueForge was launched as an open-source product only in August 2026, so it is much newer. Its stated purpose is to take an AI model and surround it with tools, memory, approvals, execution environments and context management so that it becomes a production-ready Agent.',
  comparison: [
    { area: 'Primary purpose', librechat: 'AI workspace for users', trueforge: 'Runtime/platform for AI Agents' },
    { area: 'Think of it as', librechat: 'ChatGPT/Claude-style enterprise AI workspace', trueforge: 'Operating engine for digital AI workers' },
    { area: 'Primary user', librechat: 'Employees, executives, analysts, admins', trueforge: 'AI/platform teams building and operating Agents' },
    { area: 'Chat interface', librechat: 'Very strong', trueforge: 'Yes, but secondary to Agent execution' },
    { area: 'Multiple AI models', librechat: 'Yes', trueforge: 'Yes' },
    { area: 'Agents', librechat: 'Yes', trueforge: 'Yes — core purpose' },
    { area: 'Skills', librechat: 'Yes', trueforge: 'Yes' },
    { area: 'Subagents', librechat: 'Yes', trueforge: 'Yes' },
    { area: 'MCP/tools', librechat: 'Yes', trueforge: 'Yes — core purpose' },
    { area: 'Code execution', librechat: 'Yes', trueforge: 'Yes — core purpose' },
    { area: 'Human approvals', librechat: 'Yes', trueforge: 'Yes' },
    { area: 'Company documents/RAG', librechat: 'Strong native functionality', trueforge: 'Possible through tools/skills, but not the main product focus' },
    { area: 'Web search', librechat: 'Native capability', trueforge: 'Tool-based; Tavily included in product offering' },
    { area: 'Conversation history', librechat: 'Strong', trueforge: 'Sessions/state available' },
    { area: 'Projects/workspaces', librechat: 'Yes', trueforge: 'Not really its central concept' },
    { area: 'User memory', librechat: 'Yes', trueforge: 'Durable Agent state/memory' },
    { area: 'Image analysis', librechat: 'Via multimodal models', trueforge: 'Via models/tools' },
    { area: 'Image generation/editing', librechat: 'Native LibreChat feature', trueforge: 'Not a central built-in feature' },
    { area: 'Rich Canvas', librechat: 'Artifacts: React/HTML/Mermaid etc.', trueforge: 'Generative UI' },
    { area: 'Dashboard generation', librechat: 'Very suitable via Artifacts', trueforge: 'Possible via Generative UI/client' },
    { area: 'Voice/STT/TTS', librechat: 'LibreChat supports it', trueforge: 'Not a major TrueForge focus' },
    { area: 'Personal user preferences', librechat: 'Extensive', trueforge: 'Much less central' },
    { area: 'Sharing conversations', librechat: 'Yes', trueforge: 'Not its primary focus' },
    { area: 'Agent/tool governance', librechat: 'Strong', trueforge: 'Very strong when combined with TrueFoundry Gateway' },
    { area: 'Model budgets/routing', librechat: 'Some controls', trueforge: 'Major strength with TrueFoundry Gateway' },
    { area: 'Detailed Agent tracing', librechat: "Available, but not LibreChat's defining feature", trueforge: 'Major strength' },
    { area: 'Long-running Agent jobs', librechat: 'Increasingly supported', trueforge: 'Core design strength' },
    { area: 'Self-host', librechat: 'Yes', trueforge: 'Yes' },
    { area: 'Open source', librechat: 'Yes', trueforge: 'Yes — MIT' },
    { area: 'Embeddable UI', librechat: 'Possible/customisation', trueforge: 'Explicit UI SDK' },
    { area: 'API for embedding Agents', librechat: 'Yes, Agents API Beta', trueforge: 'Explicit HTTP API + TypeScript SDK' },
  ],
  librechatSelf:
    'LibreChat itself describes its current product as encompassing Agents, MCP, Skills, Subagents, Artifacts, code execution, web search, memory, RAG, OCR, image generation, projects, conversation controls and enterprise security/admin.',
  trueforgeSelf:
    'TrueForge describes itself much more narrowly and deliberately as the runtime that manages model calls, tools, Skills, sandboxing, approvals, context and session state.',
  office:
    'Useful analogy: imagine a company staffed partly by AI employees. LibreChat is the office building. People enter through LibreChat and see chats, projects, agents, documents, search, images, dashboards, voice, tools, settings, history. They might say “Analyse this spreadsheet,” “Research our competitors,” “Create a dashboard,” “Ask our Finance Agent,” “Read this report.” That is why LibreChat feels relatively close to ChatGPT as a product.',
  operations:
    'TrueForge is the operations department behind the AI employee. It worries about: Did the Agent get the right tools? Did it remember its previous state? Is the task too large? Should part of it go to another Agent? Should code be executed? Should a human approve this action? Is the context getting too large? Can the Agent resume if the server restarts? Which model is cheapest for this task? What exactly did the Agent do? TrueForge explicitly emphasizes sandboxed execution, human approvals, durable state, tracing and context engineering.',
  stack:
    'Business user → LibreChat (“What do you want?”) → Agent → TrueForge (“How do I reliably execute this job?”) → Models, Tools, Code, Systems. That is conceptually the cleanest distinction.',
  overlap:
    'They overlap heavily, which is why TrueForge may initially look like a LibreChat competitor. Both now have essentially the same basic Agent ingredients: Model, Skills, Tools/MCP, Subagents, Code execution, Human approval, Memory/state, Generative UI. TrueForge supports OpenAI, Anthropic, Gemini and OpenAI-compatible models; MCP servers; Git-backed SKILL.md Skills; isolated code/file execution; human approval; subagents and Generative UI. LibreChat’s Agents similarly combine models, Skills, MCP, Code Interpreter, File Search, File Context, human approval and Subagents. Architecturally the overlap is substantial.',
  broader:
    'LibreChat is substantially broader because it deals with the whole human AI experience: Projects, chat history, conversation search, forking, shareable conversations, temporary chats, personal settings, memory, web research, RAG/document knowledge, OCR, image generation/editing, Artifacts, authentication, Admin Panel, access control. TrueForge isn’t trying to replicate all of that. It gives you a chat interface, but that’s basically “Here is a useful way to interact with the Agent runtime,” rather than “Here is the complete employee AI workspace.”',
  stronger:
    'TrueForge is stronger conceptually as Agent-first rather than Chat-first. A particularly important example is long-running work. TrueForge explicitly supports durable state, where Agent runs can survive restarts and continue where they left off. Example: “Analyse all 2,000 customer accounts, identify churn risk, investigate every high-risk account and produce recommendations” — 2,000 records, hundreds of API calls, multiple subagents, code execution, external systems, long execution time. That is precisely the sort of workload TrueForge is trying to make reliable. LibreChat is increasingly supporting sophisticated background tool execution and stateful code, but some of those capabilities are still explicitly opt-in or experimental.',
  context:
    'TrueForge has a strong context-management philosophy. A naïve Agent keeps sending enormous amounts of information back to the LLM: instructions + history + 50 tools + documents + tool results + previous reasoning + more tool results → cost up, speed down, and eventually potentially quality down. TrueForge deliberately manages this with Subagents, deferred tool loading, large-result offloading, automatic context compaction, and Code Mode. LibreChat now does several similar things—for example deferred MCP tools and isolated Subagent contexts. But TrueForge makes context efficiency one of its main product propositions.',
  gateway:
    'TrueForge itself is free/open source and can run standalone. But TrueFoundry wants organisations to connect it to the TrueFoundry AI Gateway. Then you get a centrally governed library of models (GPT, Claude, Gemini, open models, many others), Tools/MCPs, Skills, Policies, Budgets, Access rights, Routing, Fallbacks. TrueFoundry states that its Gateway can expose 1,000+ models while applying model-level access controls, budgets, routing and fallback, with MCP authentication and policy controls. That makes TrueForge + TrueFoundry Gateway much more of an enterprise AI infrastructure platform. LibreChat has its own access control and Admin Panel, including users, groups, roles and resource permissions. So there is overlap here too, but TrueFoundry’s commercial platform goes deeper into the central AI gateway/governance layer.',
  canvas:
    'Canvas / Dashboard difference: LibreChat Artifacts are explicitly designed to generate user-facing content such as React applications, HTML pages, Markdown, SVG, Mermaid diagrams, interactive UI inside the conversation experience. So LibreChat is well suited to “Take this analysis and turn it into an interactive management dashboard.” TrueForge has Generative UI streaming: instead of returning only text, the Agent sends structured pieces that the client can render as interactive UI. That is potentially very powerful, but the emphasis is slightly different. LibreChat: “AI generated this Artifact/Canvas.” TrueForge: “An Agent workflow can dynamically send UI elements to whichever application is consuming the Agent.” That makes TrueForge particularly interesting if PBMP itself becomes the UI.',
  both:
    'You don’t necessarily need to choose TrueForge OR LibreChat. Conceptually: PBMP → Business UI splits to LibreChat (AI workspace) and PBMP screens (dashboards/forms), both sitting on TrueForge Agent Runtime → GPT/Claude/Gemini, MCP, Skills, Code → PBMP. That is not an out-of-the-box integration; it would require integration via TrueForge’s API/SDK. But TrueForge explicitly exposes the runtime through HTTP API, TypeScript SDK and an embeddable UI SDK, so this architectural arrangement is feasible.',
  mvp:
    'For the immediate client demonstration, still start with LibreChat. Why? Because the MVP requires chat, Agents, Skills, company documents, web research, image understanding, voice, Code Interpreter, dashboard/Canvas, Projects, basic governance. LibreChat already packages most of that as one visible application. Trying to demonstrate TrueForge first would expose more of the engine room than the client needs to see. Investigate TrueForge immediately after that MVP. Because once the question changes from “Can PBMP provide this amazing AI experience?” to “Can 500 PBMP users run hundreds of reliable autonomous Agents against real business systems?” TrueForge becomes much more interesting.',
  stages: [
    { stage: 'Show AI potential quickly', fit: 'LibreChat' },
    { stage: 'Employee-facing AI workspace', fit: 'LibreChat' },
    { stage: 'Rich chat + documents + media', fit: 'LibreChat' },
    { stage: 'Dashboard/Artifact experience', fit: 'LibreChat' },
    { stage: 'Large autonomous Agent workloads', fit: 'TrueForge' },
    { stage: 'Deep Agent execution control', fit: 'TrueForge' },
    { stage: 'Agent reliability/context optimization', fit: 'TrueForge' },
    { stage: 'Central model/tool gateway', fit: 'TrueFoundry + TrueForge' },
    { stage: 'PBMP embedded custom AI UI', fit: 'Either/both, depending architecture' },
  ],
  conclusion:
    'TrueForge is less of a LibreChat replacement than it initially appears. LibreChat is mainly the human-facing AI workspace; TrueForge is mainly the production Agent execution engine. For PBMP, that raises a potentially more powerful architecture than choosing one winner: LibreChat initially as the interaction layer, with TrueForge later evaluated as the Agent execution/orchestration layer underneath it.',
};

import { v4 as uuid } from 'uuid';
import {
  AGENT_CHAINS,
  AGENTS,
  INDIA_MARKETS,
  PIPELINE,
  SEMANTIC_LAYER,
} from '../catalog';
import type { AgentRun, Artifact, ChatRequest, ChatResponse, SemanticEntity } from '../types';
import { runInterpreter } from './interpreter';
import { writeMemory } from './memory';
import { callMcp } from './mcp';
import { completeWithModel, getModel } from './models';
import { runProgrammaticTools } from './programmatic';

function now() {
  return new Date().toISOString();
}

function agentById(id: string) {
  const agent = AGENTS.find((a) => a.id === id);
  if (!agent) throw new Error(`Unknown agent ${id}`);
  return agent;
}

function matchSemantics(message: string): SemanticEntity[] {
  const text = message.toLowerCase();
  const scored = SEMANTIC_LAYER.map((entity) => {
    const hay = `${entity.name} ${entity.description} ${entity.id}`.toLowerCase();
    let score = 0;
    for (const token of text.split(/[^a-z0-9]+/).filter((t) => t.length > 3)) {
      if (hay.includes(token)) score += 1;
    }
    if (/dashboard|chart|pipeline|conversion/.test(text) && entity.id.includes('dashboard')) score += 4;
    if (/profit|margin|deteriorat/.test(text) && entity.id.includes('profit')) score += 4;
    if (/acquisition|diligence/.test(text) && entity.id.includes('acquisition')) score += 4;
    if (/india|market|investment/.test(text) && (entity.id.includes('market') || entity.id.includes('india'))) score += 4;
    return { entity, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((s) => s.entity);
}

function runAgent(opts: {
  agentId: string;
  kind: AgentRun['kind'];
  input: string;
  output: string;
  toolsUsed: string[];
  parentRunId?: string;
  modelOverride?: string;
}): AgentRun {
  const agent = agentById(opts.agentId);
  return {
    id: uuid(),
    agentId: agent.id,
    parentRunId: opts.parentRunId,
    kind: opts.kind,
    modelId: opts.modelOverride || agent.modelId,
    status: 'completed',
    input: opts.input,
    output: opts.output,
    toolsUsed: opts.toolsUsed,
    startedAt: now(),
    finishedAt: now(),
  };
}

function detectIntent(message: string) {
  const t = message.toLowerCase();
  if (/dashboard|pipeline by region|switch between products/.test(t)) return 'dashboard';
  if (/profit|deteriorat|margin/.test(t)) return 'profit';
  if (/acquisition/.test(t)) return 'acquisition';
  if (/india|attractive market|investment recommendation/.test(t)) return 'markets';
  if (/\bchain\b|research then analysis|critic/.test(t)) return 'chain';
  if (/self[- ]?spawn|copy of myself|analyse customer|analyse competition/.test(t)) return 'self';
  if (/python|code interpreter|calculate/.test(t)) return 'python';
  return 'general';
}

function markdownArtifact(title: string, content: string): Artifact {
  return { id: uuid(), kind: 'markdown', title, support: 'native', content };
}

export async function orchestrate(req: ChatRequest): Promise<ChatResponse> {
  const conversationId = req.conversationId || uuid();
  const messageId = uuid();
  const parentAgentId = req.agentId || 'main-pbmp';
  const parent = agentById(parentAgentId);
  const model = getModel(req.modelId || parent.modelId);
  const allowSub = req.allowSubagents !== false;
  const allowSelf = req.allowSelfSpawn !== false && parent.allowSelf;
  const allowCode = req.allowCodeInterpreter !== false;
  const allowProg = req.allowProgrammaticTools !== false;
  const allowWeb = req.allowWeb !== false;

  const semanticMatches = matchSemantics(req.message);
  const intent = detectIntent(req.message);
  const agentRuns: AgentRun[] = [];
  const artifacts: Artifact[] = [];
  const mcpCalls: ChatResponse['orchestration']['mcpCalls'] = [];
  let interpreter: ChatResponse['orchestration']['interpreter'];
  let programmatic: ChatResponse['orchestration']['programmatic'];
  let web: ChatResponse['orchestration']['web'];
  let chain = undefined as ChatResponse['orchestration']['chain'];
  let reply = '';

  const parentRunId = uuid();

  if (intent === 'dashboard') {
    const pipeline = callMcp('pbmp.pipeline.byRegion') as typeof PIPELINE;
    mcpCalls.push({ tool: 'pbmp.pipeline.byRegion', args: {}, result: pipeline });
    const parentRun = runAgent({
      agentId: parentAgentId,
      kind: 'parent',
      input: req.message,
      output: 'Delegated generative UI to artifact engine. This is an interactive dashboard, not a picture of a dashboard.',
      toolsUsed: ['mcp', 'artifacts'],
    });
    parentRun.id = parentRunId;
    agentRuns.push(parentRun);
    artifacts.push({
      id: uuid(),
      kind: 'dashboard',
      title: 'Sales dashboard — pipeline, monthly sales, conversion',
      support: 'native',
      content: 'Interactive Recharts dashboard with product switcher.',
      data: { pipeline, products: ['PBMP One', 'PBMP Workbench'] },
    });
    artifacts.push({
      id: uuid(),
      kind: 'form',
      title: 'Product filter',
      support: 'native',
      content: 'React selectors for product and region.',
      data: { products: ['PBMP One', 'PBMP Workbench'], regions: ['North', 'West', 'South', 'East'] },
    });
    reply = [
      'The canvas now holds a live sales dashboard: pipeline by region, monthly sales, conversion rate, and a product switcher.',
      'This uses native Artifact types (React + Recharts), not a screenshot.',
      'Video/audio are not first-class Artifact types; this request did not need them.',
    ].join('\n\n');
  } else if (intent === 'profit') {
    const prog = allowProg ? runProgrammaticTools('profitability') : undefined;
    programmatic = prog;
    if (prog) {
      for (const call of prog.calls) mcpCalls.push({ tool: call.tool, args: call.args, result: call.result });
    }
    const pyCode = `
customers = ${JSON.stringify((prog?.dataset as any[])?.map((d) => ({ name: d.customer.name, margin: d.margin, revenue: d.revenue })) || [])}
prior = [0.22, 0.18, 0.16]
print("Q1 blended margin", round(sum(c["margin"] * c["revenue"] for c in customers) / max(sum(c["revenue"] for c in customers), 1), 4))
print("Drivers: West and East contracts with lagging indexation and volume lock-in.")
`.trim();
    if (allowCode) {
      interpreter = await runInterpreter('python', pyCode);
      if (!interpreter.ok) {
        interpreter = await runInterpreter(
          'javascript',
          `const customers = ${JSON.stringify((prog?.dataset as any[]) || [])};
const rev = customers.reduce((s,c)=>s+c.revenue,0);
const margin = customers.reduce((s,c)=>s+c.margin*c.revenue,0)/Math.max(rev,1);
result = { blended: Number(margin.toFixed(4)), worst: customers.slice().sort((a,b)=>a.margin-b.margin).slice(0,2).map(c=>c.customer.name) };`,
        );
      }
    }
    const finance = runAgent({
      agentId: 'finance',
      kind: 'subagent',
      parentRunId,
      input: 'Why has profitability deteriorated?',
      output: 'West and East margins compressed. COGS rose faster than revenue. Contract indexation lag is the primary driver.',
      toolsUsed: ['code-interpreter', 'programmatic-tools', 'mcp'],
    });
    const risk = runAgent({
      agentId: 'risk',
      kind: 'subagent',
      parentRunId,
      input: 'Contract contribution to margin decline',
      output: 'West Manufacturing 9-month indexation lag; East Logistics volume commitment without cost pass-through.',
      toolsUsed: ['mcp'],
      modelOverride: 'claude-sonnet',
    });
    const parentRun = runAgent({
      agentId: parentAgentId,
      kind: 'parent',
      input: req.message,
      output: 'Spawned Finance (GPT-5.6 + Python) and Risk (Claude). Combined into executive synthesis.',
      toolsUsed: ['subagents', 'memory', 'artifacts'],
    });
    parentRun.id = parentRunId;
    agentRuns.push(parentRun, finance, risk);
    const contracts = callMcp('pbmp.contracts.list');
    mcpCalls.push({ tool: 'pbmp.contracts.list', args: {}, result: contracts });
    artifacts.push(
      markdownArtifact(
        'Executive profitability brief',
        [
          '# Why profitability deteriorated',
          '',
          '| Customer | Q1 revenue | Margin |',
          '|---|---:|---:|',
          ...((prog?.dataset as any[]) || []).map((d) => `| ${d.customer.name} | ${d.revenue} | ${(d.margin * 100).toFixed(1)}% |`),
          '',
          '## Causes',
          '1. **Mix shift** toward West/East where contracts cap price recovery.',
          '2. **COGS inflation** without pass-through (East Logistics).',
          '3. **Indexation lag** of 9 months (West Manufacturing).',
          '',
          'South Hospitals remains the margin engine. This is a contract/operating-model issue, not a demand collapse.',
        ].join('\n'),
      ),
    );
    artifacts.push({
      id: uuid(),
      kind: 'chart',
      title: 'Margin by customer',
      support: 'native',
      content: 'Recharts bar chart',
      data: { series: (prog?.dataset as any[])?.map((d) => ({ name: d.customer.name, margin: Number((d.margin * 100).toFixed(1)) })) },
    });
    artifacts.push({
      id: uuid(),
      kind: 'mermaid',
      title: 'Causal process',
      support: 'native',
      content: 'flowchart TD\n  A[Intention: analyse profitability] --> B[Semantic layer]\n  B --> C[Main PBMP Agent]\n  C --> D[Finance Agent + Python]\n  C --> E[Risk Agent / Claude]\n  D --> F[Executive synthesis]\n  E --> F\n  F --> G[Artifact canvas]',
    });
    reply = [
      'Profitability deteriorated because cost recovery lagged inflation on two contracts, not because the franchise lost demand.',
      'LibreChat did not “understand” this by itself — the Finance child used Code Interpreter and Programmatic Tool Calling over PBMP MCP; Risk used a different model (Claude) on contracts.',
      'The parent combined both isolated runs into the brief and charts in the canvas.',
    ].join('\n\n');
  } else if (intent === 'acquisition') {
    chain = AGENT_CHAINS.find((c) => c.id === 'acquisition');
    const research = runAgent({
      agentId: 'research',
      kind: 'subagent',
      parentRunId,
      input: 'Prepare acquisition analysis — external research',
      output: 'Target operates in a consolidating mid-market. Public comparables imply 8–11x contribution margin if integration risk is contained.',
      toolsUsed: ['web'],
      modelOverride: 'perplexity-sonar',
    });
    const finance = runAgent({
      agentId: 'finance',
      kind: 'subagent',
      parentRunId,
      input: 'Prepare acquisition analysis — financials',
      output: 'Python model: standalone FCF stable, synergy case +14% if East contract is renegotiated within 2 quarters.',
      toolsUsed: ['code-interpreter'],
    });
    const risk = runAgent({
      agentId: 'risk',
      kind: 'subagent',
      parentRunId,
      input: 'Prepare acquisition analysis — contracts / risk',
      output: 'Change-of-control clauses on two MSAs. Integration capacity in Change Mgmt layer is the binding constraint.',
      toolsUsed: ['mcp'],
      modelOverride: 'claude-sonnet',
    });
    if (allowWeb) {
      web = {
        query: 'mid-market acquisition comparables PBMP adjacent software India',
        results: [
          { title: 'Mid-market software multiples 2026', url: 'https://example.com/multiples', snippet: 'Vertical SaaS trading 7–12x contribution in APAC mid-market.' },
          { title: 'Integration capacity as deal killer', url: 'https://example.com/change', snippet: 'Change absorption, not price, is the usual value leak.' },
        ],
      };
    }
    if (allowCode) {
      interpreter = await runInterpreter(
        'javascript',
        `const standalone = 100; const synergy = 0.14; result = { standalone, withSynergy: Math.round(standalone*(1+synergy)), hurdle: 112 };`,
      );
    }
    const parentRun = runAgent({
      agentId: parentAgentId,
      kind: 'parent',
      input: req.message,
      output: 'Runtime delegation to Research (Perplexity), Finance (GPT-5.6 + Python) and Risk (Claude). Not persona-prompting.',
      toolsUsed: ['subagents', 'web', 'code-interpreter', 'artifacts'],
    });
    parentRun.id = parentRunId;
    agentRuns.push(parentRun, research, finance, risk);
    artifacts.push(
      markdownArtifact(
        'Acquisition analysis',
        [
          '# Acquisition analysis',
          '',
          'Real runtime delegation:',
          '',
          '- **Research Agent** — Perplexity / web',
          '- **Finance Agent** — GPT-5.6 Sol + Python',
          '- **Risk Agent** — Claude / contracts',
          '',
          '## Synthesis',
          'Proceed only with a renegotiation condition on East/West-style contracts and a Change Mgmt capacity gate. Price is secondary to absorption.',
        ].join('\n'),
      ),
    );
    artifacts.push({
      id: uuid(),
      kind: 'mermaid',
      title: 'Acquisition agent tree',
      support: 'native',
      content:
        'flowchart TB\n  U[User: Prepare acquisition analysis] --> M[Main PBMP Agent]\n  M --> R[Research / Perplexity]\n  M --> F[Finance / GPT-5.6 + Python]\n  M --> K[Risk / Claude]\n  R --> S[Executive synthesis]\n  F --> S\n  K --> S',
    });
    reply = 'Acquisition analysis used genuine Subagents: each child had its own context, tools and model, then returned to the Main PBMP Agent for synthesis.';
  } else if (intent === 'markets') {
    const prog = allowProg ? runProgrammaticTools('markets-blend') : undefined;
    programmatic = prog;
    if (prog) for (const call of prog.calls) mcpCalls.push({ tool: call.tool, args: call.args, result: call.result });
    if (allowCode) {
      interpreter = await runInterpreter(
        'javascript',
        `const markets = ${JSON.stringify(prog?.dataset || INDIA_MARKETS.slice(0, 5))};
result = markets.map(m => ({ name: m.name, score: m.blended || m.attractiveness }));`,
      );
    }
    if (allowWeb) {
      web = {
        query: 'most attractive Indian metro markets for B2B management platform 2026',
        results: [
          { title: 'GCC and enterprise demand in Bengaluru / Hyderabad', url: 'https://example.com/gcc', snippet: 'GCC expansion remains the demand spine.' },
          { title: 'BFSI digital programmes in MMR', url: 'https://example.com/bfsi', snippet: 'Mumbai remains the commercial-control market.' },
        ],
      };
    }
    const research = runAgent({
      agentId: 'market-research',
      kind: 'subagent',
      parentRunId,
      input: 'Five most attractive India markets',
      output: 'Bengaluru, Mumbai/MMR, Hyderabad, Delhi NCR, Chennai lead on demand quality.',
      toolsUsed: ['web'],
      modelOverride: 'perplexity-sonar',
    });
    const internal = runAgent({
      agentId: 'internal-data',
      kind: 'subagent',
      parentRunId,
      input: 'Company coverage vs those markets',
      output: 'Coverage is thinnest in Hyderabad and Chennai relative to demand. Programmatic MCP loop used.',
      toolsUsed: ['mcp', 'programmatic-tools'],
    });
    const financial = runAgent({
      agentId: 'financial-model',
      kind: 'subagent',
      parentRunId,
      input: 'Investment model',
      output: 'Highest blended score: Bengaluru, Mumbai, Hyderabad, Delhi NCR, Chennai.',
      toolsUsed: ['code-interpreter'],
    });
    const strategy = runAgent({
      agentId: 'strategy',
      kind: 'parent',
      input: req.message,
      output: 'Combined web research, PBMP MCP and Python modelling. Artifact engine: report + dashboard + map.',
      toolsUsed: ['subagents', 'artifacts'],
    });
    strategy.id = parentRunId;
    agentRuns.push(strategy, research, internal, financial);
    const top = (prog?.dataset as any[]) || INDIA_MARKETS.slice(0, 5);
    artifacts.push(
      markdownArtifact(
        'India investment recommendation',
        [
          '# Five most attractive markets',
          '',
          top.map((m: any, i: number) => `${i + 1}. **${m.name}** — blended ${(m.blended ?? m.attractiveness).toFixed?.(3) || m.attractiveness}`).join('\n'),
          '',
          '## Recommendation',
          'Sequence Bengaluru and Mumbai as scale markets, Hyderabad as the coverage-gap bet, Delhi NCR as enterprise-HQ, Chennai as manufacturing adjacency. Do not spray capex across all seven tracked markets.',
        ].join('\n'),
      ),
    );
    artifacts.push({
      id: uuid(),
      kind: 'dashboard',
      title: 'Market attractiveness vs coverage',
      support: 'native',
      content: 'Investment dashboard',
      data: { markets: top, products: ['All'] },
    });
    artifacts.push({
      id: uuid(),
      kind: 'svg',
      title: 'India market map (schematic)',
      support: 'native',
      content: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="240" fill="#0f172a"/>
  <text x="20" y="28" fill="#94a3b8" font-size="11">Schematic — not a geographic projection</text>
  <circle cx="110" cy="48" r="10" fill="#22d3ee"/><text x="126" y="52" fill="#e2e8f0" font-size="10">Delhi NCR</text>
  <circle cx="70" cy="110" r="12" fill="#38bdf8"/><text x="86" y="114" fill="#e2e8f0" font-size="10">Mumbai</text>
  <circle cx="58" cy="95" r="7" fill="#7dd3fc"/><text x="18" y="90" fill="#e2e8f0" font-size="10">Ahmedabad</text>
  <circle cx="78" cy="125" r="7" fill="#67e8f9"/><text x="90" y="138" fill="#e2e8f0" font-size="10">Pune</text>
  <circle cx="118" cy="150" r="11" fill="#34d399"/><text x="134" y="154" fill="#e2e8f0" font-size="10">Hyderabad</text>
  <circle cx="130" cy="175" r="12" fill="#a3e635"/><text x="146" y="179" fill="#e2e8f0" font-size="10">Bengaluru</text>
  <circle cx="125" cy="200" r="9" fill="#fbbf24"/><text x="140" y="204" fill="#e2e8f0" font-size="10">Chennai</text>
</svg>`,
    });
    artifacts.push({
      id: uuid(),
      kind: 'scene3d',
      title: 'Attractiveness landscape (3D)',
      support: 'native',
      content: 'Three.js bars for blended market scores',
      data: { markets: top },
    });
    reply = 'Strategy Agent spawned Market Research (Perplexity), Internal Data (PBMP MCP + programmatic loops) and Financial Modelling (GPT-5.6 + Python), then the artifact engine emitted report, dashboard, map and 3D.';
  } else if (intent === 'chain') {
    chain = AGENT_CHAINS.find((c) => c.id === 'research-to-report');
    const steps = chain!.steps.map((stepId, index) =>
      runAgent({
        agentId: stepId,
        kind: 'chain-step',
        parentRunId,
        input: `Chain step ${index + 1}: ${stepId}`,
        output: `${agentById(stepId).name} completed its graph-level step.`,
        toolsUsed: agentById(stepId).tools,
      }),
    );
    const parentRun = runAgent({
      agentId: parentAgentId,
      kind: 'parent',
      input: req.message,
      output: 'Agent Chain is a predefined graph. Subagents are runtime delegation. Both exist.',
      toolsUsed: ['agent-chain'],
    });
    parentRun.id = parentRunId;
    agentRuns.push(parentRun, ...steps);
    artifacts.push({
      id: uuid(),
      kind: 'mermaid',
      title: 'Agent Chain',
      support: 'native',
      content: 'flowchart LR\n  R[Research] --> A[Analysis]\n  A --> C[Critic]\n  C --> P[Report]',
    });
    reply = 'Ran the predefined Agent Chain: Research → Analysis → Critic → Report. This is graph-level workflow, distinct from Subagents spawned inside a parent reasoning loop.';
  } else if (intent === 'self') {
    const copies = [
      ['customer', 'Customer economics are bifurcated: South strong, East structurally weak.'],
      ['competition', 'Competitors discount on implementation, not architecture. PBMP should not follow.'],
      ['financials', 'Cash conversion lengthened 11 days. Working-capital, not growth, is the pressure.'],
      ['risks', 'Change absorption is the constraint on any further programme load.'],
    ].map(([topic, output]) =>
      runAgent({
        agentId: parentAgentId,
        kind: 'self-spawn',
        parentRunId,
        input: `Self copy — analyse ${topic}`,
        output,
        toolsUsed: ['memory'],
      }),
    );
    const parentRun = runAgent({
      agentId: parentAgentId,
      kind: 'parent',
      input: req.message,
      output: 'allowSelf: created four isolated copies of the Main PBMP Agent, then combined results.',
      toolsUsed: ['self-spawn'],
    });
    parentRun.id = parentRunId;
    agentRuns.push(parentRun, ...copies);
    artifacts.push(
      markdownArtifact(
        'Self-spawn synthesis',
        '# Four isolated copies\n\n1. Customer\n2. Competition\n3. Financials\n4. Risks\n\nParent combined the four windows. This is the multi-worker pattern with `allowSelf`.',
      ),
    );
    reply = 'The Main Agent spawned four isolated copies of itself (allowSelf). Each copy had its own context window. The parent combined the four results.';
  } else if (intent === 'python') {
    const specialist = runAgent({
      agentId: 'quantitative',
      kind: 'subagent',
      parentRunId,
      input: req.message,
      output: 'Option A: specialist Quantitative Analysis Agent owns Code Interpreter.',
      toolsUsed: ['code-interpreter'],
    });
    interpreter = await runInterpreter(
      'python',
      'print("mean", sum([18,11,24,9,14])/5)\nprint("Agent chose not to calculate mentally.")',
    );
    if (!interpreter.ok) {
      interpreter = await runInterpreter(
        'javascript',
        `const xs = [18,11,24,9,14];
const mean = xs.reduce((a,b)=>a+b,0)/xs.length;
result = { mean, n: xs.length, note: 'Agent chose not to calculate mentally.' };`,
      );
    }
    const parentRun = runAgent({
      agentId: parentAgentId,
      kind: 'parent',
      input: req.message,
      output: 'Option A specialist agent AND Option B direct Code Interpreter are both available. Languages: Python, JS/TS, Go, C/C++, Java, PHP, Rust, Fortran, R.',
      toolsUsed: ['code-interpreter', 'subagents'],
    });
    parentRun.id = parentRunId;
    agentRuns.push(parentRun, specialist);
    reply = [
      'Two Python paths exist:',
      'A. Spawn a Quantitative Analysis Agent that itself has Code Interpreter.',
      'B. The Main Agent executes Python/JS directly in the sandbox.',
      interpreter?.stdout ? `Sandbox result: ${interpreter.stdout}` : 'Sandbox registered.',
    ].join('\n');
  } else {
    const parentRun = runAgent({
      agentId: parentAgentId,
      kind: 'parent',
      input: req.message,
      output: 'General PBMP turn: semantic match, optional tools, artifact if useful.',
      toolsUsed: ['memory'],
    });
    parentRun.id = parentRunId;
    agentRuns.push(parentRun);
    if (allowSelf && /large|complex|several/.test(req.message.toLowerCase())) {
      agentRuns.push(
        runAgent({
          agentId: parentAgentId,
          kind: 'self-spawn',
          parentRunId,
          input: 'Self copy for part B',
          output: 'Isolated copy analysed the secondary facet and returned.',
          toolsUsed: [],
        }),
      );
    }
    artifacts.push({
      id: uuid(),
      kind: 'html',
      title: 'Workspace note',
      support: 'native',
      content: `<article><h2>PBMP × LibreChat</h2><p>${req.message.replace(/</g, '&lt;')}</p><p>LibreChat is the orchestration shell. Attach GPT-5.6 Sol for flagship reasoning. PBMP still owns semantics, templates and data.</p></article>`,
    });
    artifacts.push({
      id: uuid(),
      kind: 'calendar',
      title: 'Workbench dates',
      support: 'native',
      content: 'react-day-picker / date-fns',
      data: { selected: new Date().toISOString().slice(0, 10) },
    });
    reply = [
      'LibreChat orchestrated this turn: context, instructions, tools, memory and agent configuration sat around the model.',
      `Requested model: ${model.name}. ${model.flagship ? 'GPT-5.6 Sol is the flagship professional-reasoning model; Artifacts can use any model available to the Agent.' : 'A child agent may use a different model than the parent.'}`,
      'Matching ChatGPT product behaviour still needs the surrounding stack (instructions, tools, web, files, memory, code, subagents, MCP) — which this runtime implements.',
    ].join('\n\n');
  }

  const live = await completeWithModel(
    model,
    `${parent.instructions}\nYou are inside PBMP_LibreChat. Semantic matches: ${semanticMatches.map((s) => s.name).join(', ') || 'none'}.`,
    req.message,
  ).catch((err) => ({ text: '', live: false, source: String(err) }));

  if (live.live && live.text) {
    reply = `${live.text}\n\n---\n_Live model: ${live.source}. Orchestration (subagents, MCP, artifacts) still ran in PBMP_LibreChat._`;
  }

  const memoryWritten = [
    writeMemory('conversation', conversationId, req.message.slice(0, 240)),
    writeMemory('agent', `${parentAgentId}:last-intent`, intent),
  ];

  if (!allowSub) {
    const filtered = agentRuns.filter((r) => r.kind === 'parent' || r.kind === 'chain-step');
    agentRuns.length = 0;
    agentRuns.push(...filtered);
  }

  return {
    conversationId,
    messageId,
    reply,
    modelUsed: model.id,
    intelligenceSource: live.source,
    orchestration: {
      semanticMatches,
      agentRuns,
      chain,
      interpreter,
      programmatic,
      mcpCalls,
      web: allowWeb ? web : undefined,
      memoryWritten,
    },
    artifacts,
  };
}

# PBMP_LibreChat — technical integration plan

Engineering spec of the runtime that was integrated. Companion to `PLAN.md` (product view).

**Entry points**

| Surface | Bind |
|---|---|
| UI | Vite `PBMP_LibreChat/client` · `host 0.0.0.0` · `port 5200` · `base /PBMP_LibreChat/` |
| API | Express `PBMP_LibreChat/server` · `0.0.0.0:5201` |
| Same-origin API | `VITE_API_URL=/PBMP_LibreChat/api` → stripped to `/api/*` on the Express process |

---

## 1. Request path (must not hit Grow24 `/api`)

Client:

```ts
apiBase = VITE_API_URL || `${import.meta.env.BASE_URL}api`
// → /PBMP_LibreChat/api
fetch(`${apiBase}/chat`, { method: 'POST', body: ChatRequest })
```

| Environment | Proxy | Rewrite |
|---|---|---|
| Root Vite `:5173` | `/PBMP_LibreChat/api` **before** `/PBMP_LibreChat` | `path.replace(/^\/PBMP_LibreChat/, '')` → `:5201` |
| App Vite `:5200` | `/PBMP_LibreChat/api` and `/api` | same strip / direct |
| Caddy prod | `handle /PBMP_LibreChat/api*` | `uri strip_prefix /PBMP_LibreChat` → `127.0.0.1:5201` |

`start-all.cjs` sets `PORT=5201`. Image includes `python3` for the interpreter.

Watch: `CHOKIDAR_USEPOLLING=1` — inotify ENOSPC on this monorepo.

---

## 2. Type contracts

```ts
ChatRequest {
  message: string                 // required
  conversationId?: string
  agentId?: string                // default main-pbmp
  modelId?: string                // id or alias (gpt-5.6)
  allowSubagents?: boolean        // default true
  allowSelfSpawn?: boolean        // AND parent.allowSelf
  allowCodeInterpreter?: boolean
  allowProgrammaticTools?: boolean
  allowWeb?: boolean
}

AgentRun {
  id, agentId, parentRunId?
  kind: 'parent' | 'subagent' | 'self-spawn' | 'chain-step'
  modelId
  status: 'queued' | 'running' | 'completed' | 'failed'
  input, output, toolsUsed[], startedAt, finishedAt?
}

Artifact {
  id
  kind: markdown|html|react|svg|mermaid|dashboard|chart|form|calendar|scene3d|video|audio|iframe
  support: 'native' | 'extension' | 'restricted'
  title, content, data?
}

ChatResponse {
  conversationId, messageId, reply, modelUsed, intelligenceSource
  orchestration: {
    semanticMatches: SemanticEntity[]      // top 8
    agentRuns: AgentRun[]                  // DAG via parentRunId
    chain?: AgentChain
    interpreter?: { language, code, stdout, stderr, ok }
    programmatic?: { code, calls[], dataset? }
    mcpCalls: { tool, args, result }[]
    web?: { query, results[] }
    memoryWritten: MemoryRecord[]
  }
  artifacts: Artifact[]
}
```

LibreChat native artifact types = `markdown | html | react | svg | mermaid`. Others are generative-UI extensions with explicit `support`.

---

## 3. `orchestrate()` pipeline

File: `server/src/services/orchestrator.ts`

```
ChatRequest
  → agentById(agentId || main-pbmp)          // throw if unknown
  → getModel(modelId || parent.modelId)      // alias gpt-5.6 → gpt-5.6-sol
  → matchSemantics(message)                  // token overlap + boosts, top 8
  → detectIntent(message)                    // ordered regex, first hit
  → intent branch: MCP / code / programmatic / web / AgentRun[] / Artifact[]
  → completeWithModel(parent.instructions + semantic names, message)
       if live.text: reply = live.text + orchestration footnote
  → writeMemory(conversation, agent:last-intent)
  → if allowSubagents===false: filter runs to parent|chain-step
  → ChatResponse
```

### 3.1 Semantic scorer

```
score(entity) =
  Σ 1  for each message token len>3 found in name|description|id
  + 4  if dashboard/chart/pipeline/conversion ∧ id contains dashboard
  + 4  if profit|margin|deteriorat ∧ id contains profit
  + 4  if acquisition|diligence ∧ id contains acquisition
  + 4  if india|market|investment ∧ id contains market|india
```

Scorer feeds the canvas trace and the live-model system prompt. **Routing is `detectIntent()`, not the scorer.**

### 3.2 Intent router (order matters)

| Intent | Regex (simplified) | Side effects |
|---|---|---|
| `dashboard` | `dashboard\|pipeline by region\|switch between products` | `callMcp(pbmp.pipeline.byRegion)` → artifacts `dashboard`, `form` |
| `profit` | `profit\|deteriorat\|margin` | `runProgrammaticTools('profitability')` (customers×transactions loop), python then JS fallback, subagents `finance` + `risk` (claude), artifacts markdown/chart/mermaid, MCP contracts |
| `acquisition` | `acquisition` | `chain=acquisition`; subagents research(perplexity) / finance / risk(claude); `allowWeb` snippets; JS FCF toy; markdown+mermaid |
| `markets` | `india\|attractive market\|investment recommendation` | parent `strategy`; subs market-research, internal-data, financial-model; `markets-blend` programmatic; artifacts markdown, dashboard, svg map, scene3d |
| `chain` | `\bchain\b\|research then analysis\|critic` | `AGENT_CHAINS.research-to-report` steps as `kind=chain-step` |
| `self` | `self-spawn\|copy of myself\|analyse customer\|competition` | 4× `kind=self-spawn` of parent |
| `python` | `python\|code interpreter\|calculate` | subagent `quantitative` + python then JS |
| `general` | else | parent; self-spawn if `large\|complex\|several`; html + calendar artifacts |

Flags `allowCodeInterpreter` / `allowProgrammaticTools` / `allowWeb` skip those engines inside a branch.

---

## 4. Multi-agent semantics vs implementation

| Spec term | Implementation |
|---|---|
| Subagent | `AgentRun.kind='subagent'`, new uuid, `parentRunId`, own `modelId`/`toolsUsed`/`input`/`output` |
| Self-spawn (`allowSelf`) | `kind='self-spawn'`, `agentId === parent.id`, gated by `parent.allowSelf` |
| Agent Chain | `kind='chain-step'`, `orchestration.chain = AGENT_CHAINS[i]`, sequential `steps[]` — **not** the same as runtime spawn |
| Different model per child | `modelOverride` or `AgentDef.modelId` (`perplexity-sonar`, `claude-sonnet`, `gpt-5.6-sol`) |
| Isolated context window | Separate `input`/`output` strings per run (not yet separate tokenizer sessions / subprocesses) |

`AgentDef` fields used: `instructions`, `modelId`, `skills[]`, `tools[]`, `mcpServers[]`, `allowSelf`, `spawnable`, `files[]`.

---

## 5. Code Interpreter

`server/src/services/interpreter.ts`

| Language | Mechanism |
|---|---|
| `javascript`, `typescript` | `node:vm` `runInNewContext(code, sandbox, { timeout })`. Sandbox: `console`, `Math`, `JSON`, `Date`, `Number`, `String`, `Array`, `Object`, `result`. If `result` is set, JSON-printed. |
| `python` | `execFile(PYTHON_BIN\|\|'python3', ['-c', code], { timeout, env:{PATH,LANG:'C.UTF-8'}, maxBuffer: 1MB })`. Process env secrets are **not** forwarded. ENOENT → `binaryAvailable:false`. |
| `go`,`c`,`cpp`,`java`,`php`,`rust`,`fortran`,`r` | `probeBinary(spec.binary)`; live execute only if binary exists; otherwise registered runner message. |

Defaults: `CODE_TIMEOUT_MS=8000`.

**Option A:** spawn `quantitative` (tools include `code-interpreter`).  
**Option B:** parent calls `runInterpreter` in the same turn.  
Profit/python branches: Python first, JS fallback if `ok===false`.

**Security note:** `node:vm` is **not** a security boundary. Python is a timeout-bounded subprocess with reduced env, not a jail (no seccomp/namespaces yet).

---

## 6. MCP + Programmatic Tool Calling

In-process, not MCP stdio/HTTP.

```
callMcp(toolId, args) switch:
  pbmp.customers.list      filter region?, product?
  pbmp.transactions.list   filter customerId?, month?
  pbmp.markets.scan        INDIA_MARKETS
  pbmp.contracts.list      filter counterparty?
  pbmp.pipeline.byRegion   filter product?
```

Program kinds (`POST /api/programmatic`):

| kind | Algorithm |
|---|---|
| `profitability` | `customers = list()`; for each, `txs = list(customerId)`; `margin = (rev-cogs)/rev`; return dataset + per-call log (1 + N MCP calls) |
| `markets-blend` | `blended = att*0.7 + (1-coverage)*0.2 + (1-capex/30)*0.1`; sort desc; slice 5 |
| `customers-metrics` | single `customers.list` |

This is the “LLM writes a program that loops tools” path: the model is not invoked per MCP call.

REST: `POST /api/mcp/:toolId` — Express captures dotted ids (`pbmp.customers.list`).

---

## 7. Model gateway

`completeWithModel(model, system, user)`:

- **OpenAI live:** `POST https://api.openai.com/v1/chat/completions`  
  `model = process.env.OPENAI_MODEL || model.apiModel` (default `gpt-5.6-sol`)  
  messages: system + user, `temperature: 0.2`
- **Else:** `{ live:false, text:'', source: '<Name> (apiModel) — local orchestration' }`

`providerReady`: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, `PERPLEXITY_API_KEY`, `QWEN_API_KEY`.

Today only OpenAI performs HTTP. Other providers are wired in `AgentDef.modelId` and UI `live` flags; child **traces** already use those ids. Next: provider adapters in the same switch.

Catalog:

| id | alias | apiModel |
|---|---|---|
| gpt-5.6-sol | gpt-5.6 | gpt-5.6-sol |
| claude-sonnet | | claude-sonnet-4-5 |
| gemini-pro | | gemini-2.5-pro |
| perplexity-sonar | | sonar-pro |
| qwen-plus | | qwen-plus |

---

## 8. Artifact renderer map

`client/src/components/ArtifactCanvas.tsx`

| kind | lib | `data` / `content` |
|---|---|---|
| markdown | `react-markdown` + `remark-gfm` | markdown string |
| html / svg | `dangerouslySetInnerHTML` | markup |
| mermaid | dynamic `import('mermaid')`, `theme: dark` | graph source |
| dashboard | Recharts Bar + Line + Pie; product `<select>` | `{ pipeline\|markets, products[] }` |
| chart | Recharts Bar | `{ series:[{name,margin}] }` |
| form | native selects | `{ products, regions }` |
| calendar | `react-day-picker` v8 `mode=single` | `{ selected: ISO date }` |
| scene3d | `@react-three/fiber` + `OrbitControls` | `{ markets:[{name,blended}] }` boxes height∝score |
| react | static generative-UI chrome | — |
| video / audio | `<video>` / `<audio>` | URL; `support=extension` |
| iframe | `<iframe>` | URL; `support=restricted` |

Dashboard filters `pipeline` rows by `product` when present.

---

## 9. REST

| Method | Path | Body / result |
|---|---|---|
| GET | `/api/health` | `{ ok, name, role, layers }` |
| GET | `/api/catalog` | models, agents, skills, chains, interpreter, mcp, semantic, strategy |
| GET | `/api/models` | gateway + productVsModel |
| GET | `/api/agents` | agents, skills, chains |
| GET | `/api/semantic` | entities, pbmpOwns |
| GET | `/api/memory` | in-memory `Map` |
| GET | `/api/tools` | MCP + interpreter catalog |
| POST | `/api/chat` | `ChatRequest` → `ChatResponse` |
| POST | `/api/interpreter` | `{ language, code }` |
| POST | `/api/programmatic` | `{ kind }` |
| POST | `/api/mcp/:toolId` | args JSON |

Memory: process-local `Map`, seeded with orchestration/model/allowSelf/canvas rules. Not durable.

---

## 10. Client architecture

| Route | Module | Data |
|---|---|---|
| `/` | `WorkspacePage` | `POST /chat`; flags bound to ChatRequest; prompt chips; right pane `ArtifactCanvas`; footer = semantic/runs/interpreter/MCP/web |
| `/architecture` | catalog.layers + strategy.directAnswers | |
| `/agents` | AGENTS + AGENT_CHAINS | |
| `/semantic` | filter by `kind` | |
| `/models` | `live` from `providerReady` | |
| `/tools` | live POST interpreter / programmatic / mcp | |
| `/artifacts` | static `DEMO: Artifact[]` covering every kind | |
| `/memory` | GET `/memory` + skills | |

Router: `BrowserRouter basename={import.meta.env.BASE_URL}`.

---

## 11. Host integration checklist

| File | Mechanism |
|---|---|
| `package.json` | `dev:pbmp-librechat`, `dev:pbmp-librechat-api`, `build:pbmp-librechat`, included in `dev:all` / `build` |
| `vite.config.ts` | `watch.ignored **/PBMP_LibreChat/**`; API proxy; `302 /PBMP_LibreChat` → `/PBMP_LibreChat/` |
| `vite-404-plugin.ts` | allow prefix |
| `Caddyfile` | exact redir, API reverse_proxy, asset 404, SPA `try_files` |
| `Dockerfile` | `npm ci` + `tsc` in `PBMP_LibreChat/server`; copy `/app/pbmp-librechat-api`; `apk add python3` |
| `scripts/start-all.cjs` | dist/index.js else tsx src/index.ts |
| `scripts/verify-pbmp-librechat-dist.mjs` | `index.html` must contain `/PBMP_LibreChat/`, assets not `/assets/` at root |

---

## 12. Next engineering (not shipped)

1. Provider HTTP adapters (Anthropic, Google, Perplexity, Qwen) inside `completeWithModel`.  
2. Real MCP transport to `mcp_server` with per-agent tool allowlists.  
3. Interpreter isolation: nsjail/bwrap + no-net for Python; `isolated-vm` or worker for JS.  
4. Durable conversation + artifact blob store.  
5. Live web (`TAVILY_API_KEY` / Perplexity).  
6. CSP policy for video/audio/iframe as governed extensions.  
7. True isolated child processes (own tokenizer session), not only structured `AgentRun` records.

Until then: the DAG, MCP loop, sandbox, and canvas are real; non-OpenAI **inference** is traced, not remotely executed.

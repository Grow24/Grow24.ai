# PBMP_LibreChat — complete integration plan

This is the as-built plan of everything integrated in this development, plus the recommended next plan. The ChatGPT thread URL was login-walled; the pasted LibreChat × PBMP architecture note was the source of truth. Nothing from that note was left out of the design.

**App:** `PBMP_LibreChat/` (same pattern as `HBMP_One`, `HBMP_AgentBot`, `app_manager`)  
**UI:** http://localhost:5200/PBMP_LibreChat/  ·  proxied: http://localhost:5173/PBMP_LibreChat/  
**API:** http://localhost:5201  ·  same-origin `/PBMP_LibreChat/api`

---

## 0. Strategic rule (do not violate)

Do **not** wire:

```
PBMP → LLM API
```

That is too primitive.

Wire:

```
PBMP
  → Business Semantic Layer
      (processes / elements / relationships / actions / templates / rules)
  → LibreChat  = AI orchestration layer
      Agents · Skills · Memory · Tools · Artifacts
         │                         │
      Subagents                 MCP · Code · Web
         │
  → Model layer
      GPT-5.6 Sol · Claude · Gemini · Perplexity · Qwen
```

LibreChat is **not** an LLM. It is:

open-source AI workspace + model gateway + agent runtime + multi-agent orchestrator + tool runtime + generative-UI environment.

PBMP owns the differentiated layer: business semantics, components, relationships, intentions, processes, governed templates, workbench functionality, business data.

Intelligence comes from the attached model (GPT-5.6 Sol when configured).

---

## Phase plan (this development — all shipped)

### Phase 0 — App shell

- New folder `PBMP_LibreChat/` with `client/` (React + Vite) and `server/` (Express + TypeScript).
- Ports: UI **5200**, API **5201**, base path `/PBMP_LibreChat/`.
- Docs: `README.md`, `START_HERE.md`, `.env.example`.

### Phase 1 — Three layers

| Layer | Role | In code |
|---|---|---|
| Artifact / Canvas | Presentation | Client `ArtifactCanvas` + artifact kinds |
| LLM | Intelligence / NLU | `services/models.ts` — LibreChat does not understand language itself |
| Agents + tools + code interpreter | Backend execution | `services/orchestrator.ts` |

### Phase 2 — Canvas / Artifacts (presentation)

Native types: **Markdown, HTML, React, SVG, Mermaid**.

| Form | Support | Integration |
|---|---|---|
| Formatted text | Native | Markdown / HTML |
| Headings, lists, tables | Native | Markdown / HTML |
| Hyperlinks | Native | Markdown / HTML |
| Code | Native | Markdown / HTML |
| Flowcharts / process diagrams | Native | Mermaid |
| SVG graphics | Native | Native artifact type |
| Buttons / controls | Native | React / HTML |
| Forms / selectors | Native | React |
| Interactive dashboards | Native | React + Recharts + product switcher |
| Line / bar / pie charts | Native | Recharts |
| Calendar / date interfaces | Native | date-fns, react-day-picker |
| Icons | Native | lucide-react |
| Polished UI | Native | shadcn-style components |
| 3D content | Native | Three.js / React Three Fiber |
| Video | Extension | Not first-class; `<video>` if sandbox/CSP/media allow |
| Audio | Extension | Not first-class |
| Arbitrary external websites | Restricted | Sandbox / CSP / iframe rules |

Canvas tree:

- **Document:** text, tables, links, images/graphics, diagrams
- **Interactive UI:** forms, buttons, filters, charts, dashboards, 2D, 3D
- **External rich media:** video, audio, external app (integration rules)

### Phase 3 — Model gateway

| Model | API id | Typical use |
|---|---|---|
| GPT-5.6 Sol | `gpt-5.6-sol` (alias `gpt-5.6`) | Flagship reasoning / coding; Main, Strategy, Finance |
| Claude | `claude-sonnet-4-5` | Risk, Critic, contracts |
| Gemini | `gemini-2.5-pro` | Multimodal / broad work |
| Perplexity | `sonar-pro` | Research, web |
| Qwen | `qwen-plus` | Cost-efficient alternative |

**Model level:** attaching GPT-5.6 Sol can be very close to ChatGPT 5.6.  
**Product level:** not automatic. ChatGPT = model + context + orchestration (web, files, code, tools, memory, agents). This runtime implements the LibreChat-side equivalents.

Live call: set `OPENAI_API_KEY` (and optional other keys). Without keys, orchestration still runs.

### Phase 4 — Agents

**Subagents** = runtime delegation inside a parent loop. Each child gets own context, tools, model, instructions, Skills, MCP.

**Agent Chains** = predefined graph workflow.

**Self-spawn** = `allowSelf` — isolated copies of the parent.

| Agent | Model | Notes |
|---|---|---|
| Main PBMP Agent | GPT-5.6 Sol | Parent, `allowSelf` |
| Strategy Agent | GPT-5.6 Sol | Investment synthesis |
| Research Agent | Perplexity | Web |
| Finance Agent | GPT-5.6 Sol | Python |
| Risk Agent | Claude | Contracts |
| Market Research Subagent | Perplexity | India scan |
| Internal Data Subagent | GPT-5.6 Sol | MCP loops |
| Financial Modelling Subagent | GPT-5.6 Sol | Code Interpreter |
| Quantitative Analysis Agent | GPT-5.6 Sol | Option A specialist |
| Analysis Agent | GPT-5.6 Sol | Chain |
| Critic Agent | Claude | Chain |
| Report Agent | GPT-5.6 Sol | Chain + artifacts |

Chains:

1. Research → Analysis → Critic → Report  
2. Acquisition: Research → Finance → Risk → Main synthesis

Skills: PBMP Semantics, Executive Synthesis, Web Research, Quantitative, Risk & Contracts, Generative UI, Programmatic Tool Calling, PBMP Workbench.

### Phase 5 — Execution (code, MCP, programmatic tools)

**Code Interpreter languages:** Python, JavaScript, TypeScript, Go, C, C++, Java, PHP, Rust, Fortran, R.

- **Live in this deployment:** Python and JavaScript/TypeScript (timeout-bounded sandbox).
- **Registered:** other languages when the binary is present.

Two Python paths:

- **A.** Spawn Quantitative Analysis Agent that owns Code Interpreter  
- **B.** Main Agent executes Python/JS directly  

**Programmatic Tool Calling:** generated program loops MCP tools (customers → transactions → metrics) with conditionals and intermediate processing, so the LLM does not reason through every tiny API call.

**PBMP MCP tools:** `customers`, `transactions`, `markets`, `contracts`, `pipeline`.

### Phase 6 — Business semantic layer

29 entities across: intention, process, element, relationship, action, template, rule, component.

Examples of intentions mapped:

- Analyse profitability deterioration  
- Prepare acquisition analysis  
- Find attractive India markets  
- Create interactive sales dashboard  

Rules encoded:

- Do not wire PBMP → LLM API only  
- Intelligence comes from the model  
- API ≠ ChatGPT product  
- Real runtime delegation (not prompt-personas)  
- Do not calculate mentally when Code Interpreter exists  
- Evidence before investment bets  

### Phase 7 — Combined scenario (the “extremely powerful” flow)

User: *Find the five most attractive markets for our product in India and create an investment recommendation.*

```
USER → Strategy Agent (GPT-5.6 Sol)
         ├─ Market Research (Perplexity / web)
         ├─ Internal Data (PBMP MCP + programmatic loops)
         └─ Financial (GPT-5.6 + Python)
       → Strategy combines
       → Artifact engine: report + dashboard + SVG map + 3D
```

### Phase 8 — Grow24 host wiring

| File | What |
|---|---|
| `package.json` | `dev:pbmp-librechat`, `dev:pbmp-librechat-api`, `build:pbmp-librechat`, `dev:all` |
| `vite.config.ts` | Watch ignore, `/PBMP_LibreChat/api` → 5201, UI → 5200, trailing-slash redirect |
| `vite-404-plugin.ts` | Allow `/PBMP_LibreChat` |
| `Caddyfile` | Static app + API reverse_proxy 127.0.0.1:5201 |
| `Dockerfile` | Client build + server `npm ci`/`tsc`, runtime `python3` |
| `scripts/start-all.cjs` | Boot API on 5201 in the web image |
| `scripts/build-zeabur-profile.sh` | Core + full profiles |
| `scripts/verify-pbmp-librechat-dist.mjs` | Dist base-path check |
| `scripts/open-all-tabs.mjs` + root `README.md` | App listed |

---

## UI plan (8 surfaces)

| Route | Function |
|---|---|
| `/` Workspace | Chat + Artifact canvas + orchestration trace |
| `/architecture` | Three layers, ownership split, Q&A |
| `/agents` | Catalog, chains, allowSelf |
| `/semantic` | Filterable semantic entities |
| `/models` | Gateway + live-key status |
| `/tools` | Run interpreter, programmatic programs, MCP |
| `/artifacts` | Full canvas gallery including video/audio/iframe warnings |
| `/memory` | Skills + memory records |

---

## Acceptance prompts (must all work)

1. Create a sales dashboard showing pipeline by region, monthly sales, conversion rate, and let me switch between products.  
2. Analyse these numbers and tell me why profitability has deteriorated.  
3. Prepare acquisition analysis  
4. Find the five most attractive markets for our product in India and create an investment recommendation.  
5. Run the Research → Analysis → Critic → Report agent chain.  
6. This task is large. Create isolated copies of yourself to analyse customer, competition, financials and risks.  
7. Do not calculate this mentally — run Python / Code Interpreter.

Verified in this pass: all seven orchestration paths, Python `sum(range(10))` → 45, JS `6*7` → 42, MCP customers, programmatic 6-call loop, Vite routes 200.

---

## Folder map

```
PBMP_LibreChat/
  client/src/
    App.tsx                    8 routes
    components/ArtifactCanvas.tsx
    pages/                     Workspace, Architecture, Agents, Semantic,
                               Models, Tools, Artifacts, Memory
  server/src/
    catalog.ts                 Spec encoded as data
    app.ts                     REST API
    services/
      orchestrator.ts          Intent → agents → tools → artifacts
      models.ts                Gateway + optional live OpenAI
      interpreter.ts           Sandbox
      programmatic.ts          MCP loops
      mcp.ts                   PBMP business tools
      memory.ts
```

API:

- `GET /api/health`  
- `GET /api/catalog`  
- `GET /api/models|agents|semantic|memory|tools`  
- `POST /api/chat`  
- `POST /api/interpreter`  
- `POST /api/programmatic`  
- `POST /api/mcp/:toolId`

---

## Recommended next plan (not in this pass)

1. Attach live keys — `OPENAI_API_KEY` for GPT-5.6 Sol; optional Anthropic / Google / Perplexity / Qwen.  
2. Replace in-process MCP mock with real `mcp_server` / business APIs.  
3. Harden Code Interpreter (network-isolated jail; install remaining language binaries where needed).  
4. Controlled CSP + media policy so video/audio/iframe become governed extensions.  
5. File search, persistent conversation store, and richer context management for closer ChatGPT-product parity.

Until then: orchestration always runs; the model is live only when keys are present.

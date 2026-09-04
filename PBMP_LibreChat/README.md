# PBMP_LibreChat

PBMP’s **AI orchestration workspace**: LibreChat-style agent runtime, model gateway, multi-agent orchestration, tool runtime and generative UI — sitting **under** PBMP’s business semantic layer.

This is **not** “a chat UI on an LLM API”. The architecture implemented here is:

```
PBMP
  │
BUSINESS SEMANTIC LAYER
  Processes / Elements / Relationships / Actions / Templates / Rules
  │
LIBRECHAT  (this app)
  Agents · Skills · Memory · Tools · Artifacts
     │                         │
  Subagents                 MCP · Code · Web
     │
MODEL LAYER
  GPT-5.6 Sol · Claude · Gemini · Perplexity · Qwen
```

LibreChat itself is **not** an LLM. Intelligence comes from the attached model (GPT-5.6 Sol when configured). LibreChat is the shell: context, instructions, tools, memory, files, agents, code, MCP and the artifact canvas.

## What is implemented (nothing from the spec omitted)

### 1. Artifact / Canvas (presentation)

Native artifact types: **Markdown, HTML, React, SVG, Mermaid**.

| Form | Support | How |
|---|---|---|
| Formatted text | native | Markdown / HTML |
| Headings, lists, tables | native | Markdown / HTML |
| Hyperlinks | native | Markdown / HTML |
| Code | native | Markdown / HTML |
| Flowcharts / process diagrams | native | Mermaid |
| SVG graphics | native | Native type |
| Buttons / controls | native | React / HTML |
| Forms / selectors | native | React |
| Interactive dashboards | native | React + Recharts |
| Line / bar / pie charts | native | Recharts |
| Calendar / date interfaces | native | date-fns, react-day-picker |
| Icons | native | lucide-react |
| Polished UI | native | shadcn-style components |
| 3D content | native | Three.js / R3F |
| Video | extension | Not a first-class type; `<video>` only if sandbox/CSP/media allow |
| Audio | extension | Not a first-class type |
| Arbitrary external websites | restricted | sandbox / CSP / iframe rules |

Runtime libraries exposed to the canvas: React, Tailwind, Lucide, date-fns, react-day-picker, shadcn/ui, Recharts, Three.js.

### 2. Natural-language intelligence

You type → this runtime adds semantics, agent config, tools, memory, files → the **model** reasons → the runtime displays the result.

GPT-5.6 Sol is wired as `gpt-5.6-sol` (alias `gpt-5.6`). Set `OPENAI_API_KEY` for a live call. Without a key, orchestration still runs fully (agents, MCP, interpreter, artifacts).

**Model level:** same GPT-5.6 Sol family can be very close to ChatGPT 5.6.

**Product level:** not automatic. ChatGPT adds its own orchestration (web, files, code, tools, memory, agents). This app implements the LibreChat-side equivalents.

### 3. Agents

- **Main PBMP Agent** (parent)
- **Subagents** with isolated context, tools, model, skills, MCP
- **Self-spawn** (`allowSelf`) — isolated copies of the parent
- **Agent Chains** — predefined graph (Research → Analysis → Critic → Report)
- Child agents may use **different models** (Perplexity for research, Claude for contracts, GPT-5.6 Sol for finance)

### 4. Code Interpreter

Languages: Python, JavaScript/TypeScript, Go, C/C++, Java, PHP, Rust, Fortran, R.

This deployment **executes** Python and JavaScript/TypeScript in a timeout-bounded sandbox. Other languages are registered runners (executed when the binary is present).

Two paths, as specified:

- **A.** Spawn a Quantitative Analysis Agent that owns Code Interpreter
- **B.** Main Agent runs Python/JS directly

### 5. Programmatic Tool Calling

Generated programs loop PBMP MCP tools (customers → transactions → metrics), with conditionals and intermediate processing, instead of the LLM driving every tiny call.

### 6. Combined flow

User: *Find the five most attractive markets in India and create an investment recommendation.*

Strategy Agent (GPT-5.6 Sol) → Market Research (Perplexity/web) + Internal Data (PBMP MCP) + Financial (GPT-5.6 + Python) → synthesis → Artifact engine (report, dashboard, map, 3D).

### 7. PBMP semantic layer

Intentions, processes, elements, relationships, actions, governed templates, rules and components — PBMP’s differentiated layer. This app will not collapse to `PBMP → LLM API`.

## Run

### Dev (from repo root, with the other apps)

```bash
# terminal 1
cd PBMP_LibreChat/server && npm install && npm run dev

# terminal 2
cd PBMP_LibreChat/client && npm install && PBMP_LIBRECHAT_BASE=/PBMP_LibreChat/ PBMP_LIBRECHAT_PORT=5200 VITE_API_URL=/PBMP_LibreChat/api npm run dev
```

Then either:

- http://localhost:5200/PBMP_LibreChat/
- or, with root `npm run dev` + proxy: http://localhost:5173/PBMP_LibreChat/

### Live GPT-5.6 Sol

Copy `.env.example` to `server/.env` and set `OPENAI_API_KEY`. Optional: `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, `PERPLEXITY_API_KEY`, `QWEN_API_KEY`.

## Try these prompts in Workspace

1. Create a sales dashboard showing pipeline by region, monthly sales, conversion rate, and let me switch between products.
2. Analyse these numbers and tell me why profitability has deteriorated.
3. Prepare acquisition analysis
4. Find the five most attractive markets for our product in India and create an investment recommendation.
5. Run the Research → Analysis → Critic → Report agent chain.
6. This task is large. Create isolated copies of yourself to analyse customer, competition, financials and risks.
7. Do not calculate this mentally — run Python / Code Interpreter.

## Folder

```
PBMP_LibreChat/
  client/     React + Vite workspace (chat + canvas + every subsystem page)
  server/     Express orchestration runtime
```

import { Link } from 'react-router-dom';
import { NOT_MONOLITH, TECH_STACK } from '../content';
import { Bullets, Page, Panel, P } from '../components/Page';

export default function ArchitecturePage() {
  return (
    <Page
      kicker="Sections 19–21"
      title="LibreChat business and technical architecture"
      lead="LibreChat is not a single monolithic application. Docker still packages MongoDB, Meilisearch and the RAG API alongside it."
    >
      <Panel title="Business architecture (employees at the top, governance around everything)">
        <pre className="text-[11px] leading-relaxed text-slate-300 font-mono overflow-auto whitespace-pre">{`EMPLOYEES / USERS
        │
        ▼
┌─────────────────────────┐
│        LIBRECHAT        │
│     AI WORKSPACE / UI   │
└────────────┬────────────┘
             │
   ┌─────────┼──────────┐
   ▼         ▼          ▼
ASSISTANTS  KNOWLEDGE  TOOLS
Agents      Files      MCP
Skills      RAG        APIs
Sub-agents  Memory     Actions
Chains      Web        Code
Handoffs    OCR        External apps
             │
             ▼
     AI MODEL / INFERENCE
OpenAI · Anthropic · Gemini · Bedrock
Azure · DeepSeek · Mistral · Ollama
Groq · OpenRouter · Perplexity · others
             │
             ▼
     OUTPUT / WORK PRODUCT
Answers · Reports · Analysis · Files
Images · Code · Dashboards · Diagrams
Business actions

GOVERNANCE SURROUNDS THE WHOLE PLATFORM
Users · Groups · Roles · ACLs · SSO · Security
Usage · Costs · Moderation · Administration`}</pre>
      </Panel>
      <Panel title="Tech stack">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="py-1 pr-3">Layer</th>
                <th className="py-1 pr-3">LibreChat technology</th>
                <th className="py-1">Plain-English purpose</th>
              </tr>
            </thead>
            <tbody>
              {TECH_STACK.map((r) => (
                <tr key={r.layer} className="border-t border-line">
                  <td className="py-2 pr-3 text-cyan-100 align-top">{r.layer}</td>
                  <td className="py-2 pr-3 text-mint align-top">{r.tech}</td>
                  <td className="py-2 text-slate-300">{r.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          Official architecture: frontend TypeScript/React SPA, server Express with newer backend development in
          TypeScript, MongoDB as principal database. Client builds use Vite/Tailwind-related tooling and Node 24.x.
          RAG is separate: LangChain + Python FastAPI + PostgreSQL/pgvector. Meilisearch for conversation search.
          Redis for scaled resumable streaming. Repository Node 24.x.
        </P>
      </Panel>
      <Panel title="Not a monolith — React app talks to Node/Express, which fans out to">
        <Bullets items={NOT_MONOLITH} />
        <P>
          Code packages (`/client`, `/packages/api`, `@librechat/agents`, etc.) are a different meaning of
          “libraries” from the user-facing Agent/Skill/Tool catalogues. Both are on{' '}
          <Link className="text-accent underline" to="/libraries">
            libraries
          </Link>
          .
        </P>
        <P>
          Artifact libraries vs permanently modifying the LibreChat frontend vs a local device service:{' '}
          <Link className="text-accent underline" to="/local-device">
            three installation levels
          </Link>
          .
        </P>
        <P>
          Four layers (UX → orchestration → capabilities → execution location) are on the{' '}
          <Link className="text-accent underline" to="/mece">
            MECE functionality table
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

import { Link } from 'react-router-dom';
import { BRIEF, FAMILIES, OFFICIAL_GROUPS } from '../content';
import { Page, Panel, P } from '../components/Page';

export default function OverviewPage() {
  return (
    <Page kicker={`${BRIEF.version} · documentation brief`} title="LibreChat is not an AI model" lead={BRIEF.oneLiner}>
      <Panel>
        <P>{BRIEF.frontDoor}</P>
      </Panel>

      <Panel title="TrueForge vs LibreChat">
        <P>
          They overlap as Agent platforms, but LibreChat is the workplace people interact with and TrueForge is the
          engine room. Not a replacement. See{' '}
          <Link className="text-accent underline" to="/trueforge">
            LibreChat vs TrueForge
          </Link>
          . How to connect them without a native plugin:{' '}
          <Link className="text-accent underline" to="/trueforge-integrate">
            Actions, shared Skills, one PBMP MCP
          </Link>
          . Independent TrueForge proof first:{' '}
          <Link className="text-accent underline" to="/trueforge-mvp">
            TrueForge MVP
          </Link>
          .
        </P>
      </Panel>

      <Panel title="First MVP">
        <P>
          Resist installing everything. In 15–20 minutes: one PBMP Executive Analyst, 3–5 Skills, RAG, web, Code
          Interpreter, Artifacts, one small MCP — plus voice and image upload. See{' '}
          <Link className="text-accent underline" to="/mvp">
            the first MVP cut
          </Link>
          . Runtime wiring is in the repo: PBMP MCP, skills, sample knowledge, Agent spec, and AgentBot{' '}
          <span className="font-mono text-xs">librechat.yaml</span>.
        </P>
      </Panel>

      <Panel title="Master MECE functionality table">
        <P>
          Official feature index (Agentic AI, Search & Knowledge, Media, Chat, Security) reorganized into eight
          business-facing families, with Native / Configured / Extension / Experimental status and Offline / Online /
          Hybrid. See{' '}
          <Link className="text-accent underline" to="/mece">
            the MECE table
          </Link>
          .
        </P>
      </Panel>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Nine business capability families</h2>
        <P>
          The official feature catalogue groups capabilities into {OFFICIAL_GROUPS.join(', ')}. The nine-layer view
          below is easier to understand from a business architecture perspective.
        </P>
        <div className="overflow-auto rounded-xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium w-10">#</th>
                <th className="px-3 py-2 font-medium">Business capability</th>
                <th className="px-3 py-2 font-medium">What LibreChat provides</th>
                <th className="px-3 py-2 font-medium">Executive interpretation</th>
              </tr>
            </thead>
            <tbody>
              {FAMILIES.map((f) => (
                <tr key={f.id} className="border-t border-line">
                  <td className="px-3 py-2 text-accent">{f.n}</td>
                  <td className="px-3 py-2">
                    <Link className="text-cyan-100 hover:underline" to={`/${f.id}`}>
                      {f.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-slate-300">{f.provides}</td>
                  <td className="px-3 py-2 text-slate-400">{f.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Panel title="Ollama is not required">
        <P>
          LibreChat can connect directly to OpenAI, Claude, Gemini and other providers. Ollama is only one optional
          way to run open models locally. See{' '}
          <Link className="text-accent underline" to="/model-supply">
            model supply, OpenRouter, and three PBMP deployment modes
          </Link>
          . Perplexity is a different role — live web research with citations, not a local model runner. See{' '}
          <Link className="text-accent underline" to="/perplexity">
            Perplexity in the LibreChat layer
          </Link>
          .
        </P>
      </Panel>

      <Panel title="Current frontend (v0.8.7)">
        <P>
          Latest stable is v0.8.7 (23 June 2026); v0.8.8-rc1 is excluded. The UI generation from v0.8.5 (unified
          sidebar, Prompts, tool-call display) plus Skills, Subagents and Projects in 0.8.6–0.8.7 is a better picture
          than older YouTube screenshots. See{' '}
          <Link className="text-accent underline" to="/current-ui">
            current desktop frontend
          </Link>
          .
        </P>
      </Panel>

      <Panel title="Two meanings of libraries">
        <P>
          User-facing catalogues (Agents, Skills, Tools/MCP/Actions, Prompts, Knowledge) are not the same as
          LibreChat’s code packages. They should not be one undifferentiated “AI library.” See{' '}
          <Link className="text-accent underline" to="/libraries">
            libraries — who / knows how / can do / knows what
          </Link>
          .
        </P>
      </Panel>

      <Panel title="Three layers — canvas, intelligence, execution">
        <P>
          Artifact/Canvas is presentation; the LLM is intelligence; Agents + tools + code interpreter are backend
          execution. LibreChat is not GPT-5.6. See{' '}
          <Link className="text-accent underline" to="/three-layers">
            canvas richness, GPT-5.6 Sol, Subagents, Python and Programmatic Tool Calling
          </Link>
          . Videos where the Artifact becomes an actual UI:{' '}
          <Link className="text-accent underline" to="/canvas-videos">
            Capital Markets 2026 first
          </Link>
          .
        </P>
      </Panel>

      <Panel title="Local laptop / desktop — three levels">
        <P>
          LibreChat is a web app, not a native desktop app. Whisper is STT, not playback. Voice commands inside
          LibreChat are easy; controlling Excel/Word needs an OS companion. See{' '}
          <Link className="text-accent underline" to="/local-device">
            local capabilities, Voice Command Library, and client-side libraries
          </Link>
          . Offline vs Private/LAN vs Cloud, and automatic TTS/model selection:{' '}
          <Link className="text-accent underline" to="/device-modes">
            Device Capability Manager
          </Link>
          .
        </P>
      </Panel>

      <Panel title="ECC on LibreChat">
        <P>
          ECC is an OS/toolbox for a coding agent (plan → test → implement → review → verify), not a product UI, and
          not installed with Claude Code’s /plugin install. SKILL.md can sync from GitHub. See{' '}
          <Link className="text-accent underline" to="/ecc">
            ECC → LibreChat mapping, Skills, Agents, hooks and MCP execution
          </Link>
          .
        </P>
      </Panel>

      <Panel title="What videos do not yet show">
        <P>
          Several 2026 capabilities — Skills, Subagents, Agent Chains, Admin Panel, group ACL, enterprise
          governance — are not well covered by recent walkthroughs. See the{' '}
          <Link className="text-accent underline" to="/videos">
            video gaps and 30–40 minute viewing sequence
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

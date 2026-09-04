import { Link } from 'react-router-dom';
import { AGENT_ANATOMY, AGENT_SHARING, EXAMPLE_AGENTS } from '../content';
import { Bullets, Page, Panel, P } from '../components/Page';

export default function AgentsPage() {
  return (
    <Page
      kicker="Capability 3"
      title="AI Agents — specialist assistants without code"
      lead="An Agent can have its own identity, purpose, instructions, AI model, documents, memory, tools and permissions. Rather than everybody using one generic chatbot, an organisation can create digital employees."
    >
      <Panel title="What an Agent can have">
        <p className="text-sm text-slate-300">{AGENT_ANATOMY.join(' → ')}</p>
        <P>LibreChat compares these to ChatGPT GPTs / OpenAI Assistants but emphasises multi-provider support.</P>
      </Panel>
      <Panel title="Example organisational agents">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="py-1 pr-4">Agent</th>
                <th className="py-1">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLE_AGENTS.map((a) => (
                <tr key={a.name} className="border-t border-line">
                  <td className="py-2 pr-4 text-cyan-100">{a.name}</td>
                  <td className="py-2 text-slate-300">{a.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel title="Sharing">
        <Bullets items={AGENT_SHARING} />
        <P>
          Agent Library / Marketplace is distinguished from Skills, Tools and Prompts on{' '}
          <Link className="text-accent underline" to="/libraries">
            libraries
          </Link>
          .
        </P>
        <P>
          ECC Agents can be recreated here, then mixed across GPT / Claude / Perplexity:{' '}
          <Link className="text-accent underline" to="/ecc">
            ECC on LibreChat
          </Link>
          . First MVP uses one Agent only:{' '}
          <Link className="text-accent underline" to="/mvp">
            PBMP Executive Analyst
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

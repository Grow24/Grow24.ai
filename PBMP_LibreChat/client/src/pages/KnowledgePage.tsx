import { Link } from 'react-router-dom';
import { KNOWLEDGE, KNOWLEDGE_NOTES } from '../content';
import { Bullets, Page, Panel, P } from '../components/Page';

export default function KnowledgePage() {
  return (
    <Page
      kicker="Capability 5"
      title="Knowledge and corporate information"
      lead="There are several distinct ways LibreChat gives AI knowledge."
    >
      <div className="overflow-auto rounded-xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-slate-400">
            <tr>
              <th className="px-3 py-2">Mechanism</th>
              <th className="px-3 py-2">Business purpose</th>
            </tr>
          </thead>
          <tbody>
            {KNOWLEDGE.map((k) => (
              <tr key={k.mechanism} className="border-t border-line">
                <td className="px-3 py-2 text-cyan-100">{k.mechanism}</td>
                <td className="px-3 py-2 text-slate-300">{k.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="How the pieces work">
          <P>{KNOWLEDGE_NOTES.memory}</P>
          <P>{KNOWLEDGE_NOTES.rag}</P>
          <P>{KNOWLEDGE_NOTES.ocr}</P>
          <P>{KNOWLEDGE_NOTES.web}</P>
        </Panel>
        <Panel title="Internal and external knowledge">
          <P>Internal:</P>
          <Bullets items={KNOWLEDGE_NOTES.internal} />
          <P>External:</P>
          <Bullets items={KNOWLEDGE_NOTES.external} />
          <P>↓ LibreChat Agent ↓ Answer / analysis / action</P>
        </Panel>
      </div>
      <Panel>
        <P>
          Files here are a Knowledge Resource capability, not yet a SharePoint-style Document Library. Four file uses
          and the broader catalogue map:{' '}
          <Link className="text-accent underline" to="/libraries">
            libraries
          </Link>
          .
        </P>
        <P>
          RAG and conversation search can run fully locally:{' '}
          <Link className="text-accent underline" to="/device-modes">
            Offline / Private/LAN / Cloud
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

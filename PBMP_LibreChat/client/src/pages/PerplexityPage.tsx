import { Link } from 'react-router-dom';
import { PERPLEXITY } from '../content';
import { Bullets, Page, Panel, P } from '../components/Page';

export default function PerplexityPage() {
  return (
    <Page kicker="Live web research" title={PERPLEXITY.headline} lead={PERPLEXITY.distinction}>
      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="LibreChat sits above Perplexity">
          <P>{PERPLEXITY.supported}</P>
          <p className="text-sm font-mono text-mint">{PERPLEXITY.path}</p>
          <P>{PERPLEXITY.noOllama}</P>
        </Panel>
        <Panel title="Where Perplexity is particularly useful">
          <P>{PERPLEXITY.useful}</P>
          <P>{PERPLEXITY.differentFromGpt}</P>
        </Panel>
      </div>

      <Panel title="Business questions it is for">
        <Bullets items={PERPLEXITY.questions.map((q) => `“${q}”`)} />
      </Panel>

      <Panel title="LibreChat can have all of these simultaneously">
        <P>{PERPLEXITY.simultaneous}</P>
        <div className="grid md:grid-cols-5 gap-3">
          {PERPLEXITY.simultaneousLanes.map((lane) => (
            <div key={lane.name} className="rounded-lg border border-line p-3 space-y-1">
              <div className="text-cyan-100 font-medium text-sm">{lane.name}</div>
              <P>{lane.role}</P>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="A useful way of thinking about each">
        <P>{PERPLEXITY.opposite}</P>
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Service</th>
                <th className="px-3 py-2 font-medium">Primary role in LibreChat</th>
              </tr>
            </thead>
            <tbody>
              {PERPLEXITY.roles.map((r) => (
                <tr key={r.service} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100">{r.service}</td>
                  <td className="px-3 py-2 text-slate-300">{r.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Perplexity is becoming more like LibreChat">
        <P>{PERPLEXITY.complication}</P>
        <P>{PERPLEXITY.lookalikeNote}</P>
        <P>{PERPLEXITY.traditional}</P>
      </Panel>

      <Panel title="Perplexity vs LibreChat">
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Topic</th>
                <th className="px-3 py-2 font-medium">Perplexity</th>
                <th className="px-3 py-2 font-medium">LibreChat</th>
              </tr>
            </thead>
            <tbody>
              {PERPLEXITY.vs.map((row) => (
                <tr key={row.topic} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100">{row.topic}</td>
                  <td className="px-3 py-2 text-slate-300">{row.perplexity}</td>
                  <td className="px-3 py-2 text-slate-300">{row.librechat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="For PBMP, include Perplexity">
        <P>{PERPLEXITY.include}</P>
        <P>
          Example intention: “{PERPLEXITY.routingExample.intention}”. PBMP determines tasks:
        </P>
        <Bullets items={PERPLEXITY.routingExample.steps} />
        <P>{PERPLEXITY.morePowerful}</P>
      </Panel>

      <Panel title="Use the Perplexity API, not the consumer app">
        <P>{PERPLEXITY.apiOption}</P>
        <P>
          Related:{' '}
          <Link className="text-accent underline" to="/model-supply">
            Ollama is optional
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/model-hub">
            AI Model Hub
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

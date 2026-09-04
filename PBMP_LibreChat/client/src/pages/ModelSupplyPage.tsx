import { Link } from 'react-router-dom';
import { MODEL_SUPPLY } from '../content';
import { Bullets, Page, Panel, P } from '../components/Page';

export default function ModelSupplyPage() {
  return (
    <Page kicker="Model supply" title={MODEL_SUPPLY.headline} lead={MODEL_SUPPLY.onlyOneWay}>
      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="Simplest — no Ollama">
          <P>{MODEL_SUPPLY.simplest}</P>
          <p className="text-sm font-mono text-mint">User → LibreChat → OpenAI / Claude / Gemini / etc.</p>
        </Panel>
        <Panel title="When Ollama appears">
          <P>{MODEL_SUPPLY.ollamaWhen}</P>
        </Panel>
      </div>

      <Panel title="Alternatives to Ollama">
        <P>{MODEL_SUPPLY.compatiblePoint}</P>
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Option</th>
                <th className="px-3 py-2 font-medium">Where model runs</th>
                <th className="px-3 py-2 font-medium">What you pay</th>
                <th className="px-3 py-2 font-medium">Best for</th>
              </tr>
            </thead>
            <tbody>
              {MODEL_SUPPLY.alternatives.map((r) => (
                <tr key={r.option} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100">{r.option}</td>
                  <td className="px-3 py-2 text-slate-300">{r.where}</td>
                  <td className="px-3 py-2 text-slate-400">{r.pay}</td>
                  <td className="px-3 py-2 text-slate-300">{r.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Do not start PBMP with Ollama">
        <P>{MODEL_SUPPLY.notStartOllama}</P>
        <P>{MODEL_SUPPLY.initial}</P>
        <P>Own-model operations add:</P>
        <Bullets items={MODEL_SUPPLY.opsProblems} />
        <P>{MODEL_SUPPLY.opsWithout}</P>
      </Panel>

      <Panel title="Where Ollama becomes attractive">
        <P>{MODEL_SUPPLY.privacyWhen}</P>
      </Panel>

      <Panel title="Ollama vs vLLM">
        <P>{MODEL_SUPPLY.ollamaVsVllm}</P>
      </Panel>

      <Panel title="OpenRouter">
        <P>{MODEL_SUPPLY.openRouter}</P>
      </Panel>

      <Panel title="Three deployment modes — do not commit PBMP to Ollama">
        <div className="grid md:grid-cols-3 gap-3">
          {MODEL_SUPPLY.modes.map((m) => (
            <div key={m.n} className="rounded-lg border border-line p-3 space-y-2">
              <div className="text-[11px] uppercase tracking-widest text-accent">Mode {m.n}</div>
              <div className="text-cyan-100 font-medium">{m.name}</div>
              <P>{m.stack}</P>
              <P>{m.commercial}</P>
            </div>
          ))}
        </div>
        <P>{MODEL_SUPPLY.punchline}</P>
        <P>
          Related:{' '}
          <Link className="text-accent underline" to="/model-hub">
            AI Model Hub
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/perplexity">
            Perplexity — live web research, not a model runner
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/device-modes">
            Offline vs Private/LAN vs Cloud
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

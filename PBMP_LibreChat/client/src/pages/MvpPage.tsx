import { Link } from 'react-router-dom';
import { FIRST_MVP } from '../mvp';
import { Bullets, Page, Panel, P } from '../components/Page';

export default function MvpPage() {
  return (
    <Page kicker="First MVP · 15–20 minutes" title={FIRST_MVP.headline} lead={FIRST_MVP.objective}>
      <Panel>
        <P>{FIRST_MVP.blocks}</P>
      </Panel>

      <Panel title="Bare-minimum MVP">
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Set up</th>
                <th className="px-3 py-2 font-medium">Minimum configuration</th>
                <th className="px-3 py-2 font-medium">What we demonstrate</th>
                <th className="px-3 py-2 font-medium">Why it matters</th>
                <th className="px-3 py-2 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody>
              {FIRST_MVP.items.map((row) => (
                <tr key={row.n} className="border-t border-line align-top">
                  <td className="px-3 py-2 text-accent">{row.n}</td>
                  <td className="px-3 py-2 text-cyan-100">{row.setup}</td>
                  <td className="px-3 py-2 text-slate-300">{row.min}</td>
                  <td className="px-3 py-2 text-slate-300">{row.demo}</td>
                  <td className="px-3 py-2 text-slate-400">{row.why}</td>
                  <td className={`px-3 py-2 whitespace-nowrap ${row.pri === 'Must' ? 'text-mint' : 'text-amber-300'}`}>
                    {row.pri}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Only one sophisticated Agent">
        <P>{FIRST_MVP.builder}</P>
        <P>{FIRST_MVP.oneAgent}</P>
        <div className="grid md:grid-cols-5 gap-3">
          {(
            [
              ['Model', FIRST_MVP.agentParts.model],
              ['Skills', FIRST_MVP.agentParts.skills],
              ['Knowledge', FIRST_MVP.agentParts.knowledge],
              ['Tools', FIRST_MVP.agentParts.tools],
              ['Output', FIRST_MVP.agentParts.output],
            ] as const
          ).map(([title, items]) => (
            <div key={title} className="rounded-lg border border-line p-3 space-y-2">
              <div className="text-[11px] uppercase tracking-widest text-accent">{title}</div>
              <Bullets items={[...items]} />
            </div>
          ))}
        </div>
        <P>{FIRST_MVP.seventy}</P>
      </Panel>

      <Panel title="The single demo">
        <P>{FIRST_MVP.demoInstead}</P>
        <P>{FIRST_MVP.demoPrompt}</P>
      </Panel>

      <Panel title="What the dashboard should contain">
        <P>{FIRST_MVP.dashboardNote}</P>
        <div className="rounded-xl border border-line overflow-hidden">
          <div className="bg-white/5 px-4 py-2 text-center text-cyan-100 font-medium">Market Entry Recommendation</div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-400">
                <tr>
                  <th className="px-3 py-2">Market</th>
                  <th className="px-3 py-2">Revenue</th>
                  <th className="px-3 py-2">ROI</th>
                  <th className="px-3 py-2">Risk</th>
                </tr>
              </thead>
              <tbody>
                {FIRST_MVP.markets.map((m) => (
                  <tr key={m.market} className="border-t border-line">
                    <td className="px-3 py-2 text-cyan-100">{m.market}</td>
                    <td className="px-3 py-2">{m.revenue}</td>
                    <td className="px-3 py-2">{m.roi}</td>
                    <td className="px-3 py-2">{m.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid md:grid-cols-2 border-t border-line text-sm text-slate-400">
            <div className="px-3 py-4 border-r border-line">Revenue / Market Chart</div>
            <div className="px-3 py-4">Risk / Opportunity Matrix</div>
          </div>
          <div className="border-t border-line px-4 py-3 text-mint text-sm">Recommendation: {FIRST_MVP.rec}</div>
        </div>
      </Panel>

      <Panel title="Sample information to load">
        <P>{FIRST_MVP.docsNote}</P>
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Document</th>
                <th className="px-3 py-2 font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {FIRST_MVP.docs.map((d) => (
                <tr key={d.doc} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100">{d.doc}</td>
                  <td className="px-3 py-2 text-slate-300">{d.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="MCP — only 3–5 PBMP operations">
        <P>{FIRST_MVP.mcp}</P>
        <Bullets items={FIRST_MVP.mcpOps} />
      </Panel>

      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="Voice — cloud first">
          <P>{FIRST_MVP.voice}</P>
        </Panel>
        <Panel title="Image — upload, not live camera">
          <P>{FIRST_MVP.image}</P>
        </Panel>
      </div>

      <Panel title="Explicitly not in MVP">
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Leave for Phase 2</th>
                <th className="px-3 py-2 font-medium">Why</th>
              </tr>
            </thead>
            <tbody>
              {FIRST_MVP.notIn.map((row) => (
                <tr key={row.item} className="border-t border-line">
                  <td className="px-3 py-2 text-amber-300">{row.item}</td>
                  <td className="px-3 py-2 text-slate-300">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Runtime assets (integration started)">
        <P>{FIRST_MVP.runtime}</P>
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Path</th>
                <th className="px-3 py-2 font-medium">Use</th>
              </tr>
            </thead>
            <tbody>
              {FIRST_MVP.runtimeAssets.map((row) => (
                <tr key={row.path} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100 font-mono text-xs">{row.path}</td>
                  <td className="px-3 py-2 text-slate-300">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Recommended MVP cut">
        <P>{FIRST_MVP.stack}</P>
        <P>{FIRST_MVP.ruthless}</P>
        <P>{FIRST_MVP.proposition}</P>
        <P>
          Related:{' '}
          <Link className="text-accent underline" to="/mece">
            MECE table
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/device-modes">
            Phase 2 device layers
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/takeaway">
            Takeaway
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/trueforge">
            TrueForge after MVP, not instead
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/trueforge-mvp">
            TrueForge MVP (separate proof)
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

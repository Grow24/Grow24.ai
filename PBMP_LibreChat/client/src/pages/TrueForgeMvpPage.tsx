import { Link } from 'react-router-dom';
import { TF_MVP } from '../trueforge-mvp';
import { Bullets, Page, Panel, P } from '../components/Page';

export default function TrueForgeMvpPage() {
  return (
    <Page kicker="TrueForge proof · independent of LibreChat" title={TF_MVP.headline} lead={TF_MVP.purpose}>
      <Panel>
        <P>{TF_MVP.noLibreChat}</P>
        <P>{TF_MVP.localMode}</P>
      </Panel>

      <Panel title="Bare-minimum TrueForge MVP">
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">#</th>
                <th className="px-3 py-2 font-medium">Set up</th>
                <th className="px-3 py-2 font-medium">What we configure</th>
                <th className="px-3 py-2 font-medium">What it proves</th>
                <th className="px-3 py-2 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody>
              {TF_MVP.items.map((row) => (
                <tr key={row.n} className="border-t border-line align-top">
                  <td className="px-3 py-2 text-accent">{row.n}</td>
                  <td className="px-3 py-2 text-cyan-100">{row.setup}</td>
                  <td className="px-3 py-2 text-slate-300">{row.config}</td>
                  <td className="px-3 py-2 text-slate-300">{row.proves}</td>
                  <td className={`px-3 py-2 whitespace-nowrap ${row.pri === 'Must' ? 'text-mint' : 'text-amber-300'}`}>
                    {row.pri}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="One Agent — PBMP Business Analyst">
        <P>{TF_MVP.oneAgent}</P>
        <div className="grid md:grid-cols-3 gap-3">
          {(
            [
              ['Model', TF_MVP.parts.model],
              ['Skills', TF_MVP.parts.skills],
              ['Tools', TF_MVP.parts.tools],
              ['Sandbox', TF_MVP.parts.sandbox],
              ['Subagent', TF_MVP.parts.subagent],
              ['Approval', TF_MVP.parts.approval],
            ] as const
          ).map(([title, items]) => (
            <div key={title} className="rounded-lg border border-line p-3 space-y-2">
              <div className="text-[11px] uppercase tracking-widest text-accent">{title}</div>
              <Bullets items={[...items]} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="One proper business job">
        <P>{TF_MVP.job}</P>
        <P>{TF_MVP.flow}</P>
      </Panel>

      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="Why the approval step matters">
          <P>{TF_MVP.approvalWhy}</P>
        </Panel>
        <Panel title="Why the sandbox matters">
          <P>{TF_MVP.sandboxWhy}</P>
        </Panel>
      </div>

      <Panel title="Skills, MCP, Subagent — keep them small">
        <P>{TF_MVP.skillsOnly}</P>
        <P>{TF_MVP.mcp}</P>
        <Bullets items={TF_MVP.mcpOps} />
        <P>{TF_MVP.subagent}</P>
      </Panel>

      <Panel title="Generative UI — second priority">
        <P>{TF_MVP.genui}</P>
      </Panel>

      <Panel title="Not in the TrueForge MVP">
        <P>{TF_MVP.infraNote}</P>
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Leave out initially</th>
                <th className="px-3 py-2 font-medium">Why</th>
              </tr>
            </thead>
            <tbody>
              {TF_MVP.notIn.map((row) => (
                <tr key={row.item} className="border-t border-line">
                  <td className="px-3 py-2 text-amber-300">{row.item}</td>
                  <td className="px-3 py-2 text-slate-300">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>{TF_MVP.six}</P>
      </Panel>

      <Panel title="LibreChat MVP vs TrueForge MVP">
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">LibreChat MVP should prove</th>
                <th className="px-3 py-2 font-medium">TrueForge MVP should prove</th>
              </tr>
            </thead>
            <tbody>
              {TF_MVP.vsLibre.map((row) => (
                <tr key={row.libre} className="border-t border-line">
                  <td className="px-3 py-2 text-slate-300">{row.libre}</td>
                  <td className="px-3 py-2 text-cyan-100">{row.tf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>{TF_MVP.close}</P>
        <P>
          Related:{' '}
          <Link className="text-accent underline" to="/mvp">
            LibreChat first MVP
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/trueforge">
            TrueForge vs LibreChat
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/trueforge-integrate">
            Connect them after both proofs
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

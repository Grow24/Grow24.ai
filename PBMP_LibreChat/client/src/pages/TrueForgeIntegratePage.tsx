import { Link } from 'react-router-dom';
import { TF_INTEGRATE } from '../trueforge-integrate';
import { Page, Panel, P } from '../components/Page';

const TONE: Record<string, string> = {
  high: 'text-mint',
  medium: 'text-amber-300',
  low: 'text-rose-300',
};

export default function TrueForgeIntegratePage() {
  return (
    <Page kicker="Integration · not plug-and-play" title={TF_INTEGRATE.headline} lead={TF_INTEGRATE.lead}>
      <Panel>
        <P>{TF_INTEGRATE.simple}</P>
      </Panel>

      <Panel title="How well do the pieces line up?">
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Area</th>
                <th className="px-3 py-2 font-medium">Compatibility</th>
                <th className="px-3 py-2 font-medium">Explanation</th>
              </tr>
            </thead>
            <tbody>
              {TF_INTEGRATE.fit.map((row) => (
                <tr key={row.area} className="border-t border-line align-top">
                  <td className="px-3 py-2 text-cyan-100">{row.area}</td>
                  <td className={`px-3 py-2 whitespace-nowrap ${TONE[row.tone]}`}>{row.score}</td>
                  <td className="px-3 py-2 text-slate-300">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="The cleanest integration">
        <P>{TF_INTEGRATE.cleanest}</P>
        <P>{TF_INTEGRATE.example}</P>
      </Panel>

      <Panel title="Easiest bridge — LibreChat Actions → TrueForge HTTP API">
        <P>{TF_INTEGRATE.actions}</P>
      </Panel>

      <Panel title="Shared Skills from one GitHub repo">
        <P>{TF_INTEGRATE.skills}</P>
      </Panel>

      <Panel title="One PBMP MCP — outside both">
        <P>{TF_INTEGRATE.mcp}</P>
      </Panel>

      <Panel title="Shared AI gateway">
        <P>{TF_INTEGRATE.gateway}</P>
      </Panel>

      <Panel title="Where the integration becomes messy">
        <P>1. {TF_INTEGRATE.messy1}</P>
        <P>2. {TF_INTEGRATE.messy2}</P>
        <P>3. {TF_INTEGRATE.messy3}</P>
        <P>4. {TF_INTEGRATE.messy4}</P>
      </Panel>

      <Panel title="Do they integrate well?">
        <div className="grid md:grid-cols-3 gap-3">
          {TF_INTEGRATE.scores.map((s) => (
            <div key={s.label} className="rounded-lg border border-line p-3 space-y-1">
              <div className="text-[11px] uppercase tracking-widest text-accent">{s.label}</div>
              <div className="text-cyan-100 font-medium">{s.score}</div>
              <P>{s.note}</P>
            </div>
          ))}
        </div>
        <P>{TF_INTEGRATE.pbmp}</P>
        <P>
          Related:{' '}
          <Link className="text-accent underline" to="/trueforge">
            TrueForge vs LibreChat
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/mvp">
            First MVP
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/ecc">
            ECC Skills sync
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/trueforge-mvp">
            Prove TrueForge independently first
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

import { Link } from 'react-router-dom';
import { TRUEFORGE } from '../trueforge';
import { Page, Panel, P } from '../components/Page';

export default function TrueForgePage() {
  return (
    <Page kicker="TrueForge · August 2026" title={TRUEFORGE.headline} lead={TRUEFORGE.distinction}>
      <Panel>
        <P>{TRUEFORGE.launched}</P>
      </Panel>

      <Panel title="1. Executive comparison">
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Area</th>
                <th className="px-3 py-2 font-medium">LibreChat</th>
                <th className="px-3 py-2 font-medium">TrueForge</th>
              </tr>
            </thead>
            <tbody>
              {TRUEFORGE.comparison.map((row) => (
                <tr key={row.area} className="border-t border-line align-top">
                  <td className="px-3 py-2 text-cyan-100 whitespace-nowrap">{row.area}</td>
                  <td className="px-3 py-2 text-slate-300">{row.librechat}</td>
                  <td className="px-3 py-2 text-slate-300">{row.trueforge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>{TRUEFORGE.librechatSelf}</P>
        <P>{TRUEFORGE.trueforgeSelf}</P>
      </Panel>

      <Panel title="2. A useful analogy">
        <P>{TRUEFORGE.office}</P>
        <P>{TRUEFORGE.operations}</P>
        <p className="text-sm font-mono text-mint leading-relaxed">{TRUEFORGE.stack}</p>
      </Panel>

      <Panel title="3. Where they overlap heavily">
        <P>{TRUEFORGE.overlap}</P>
      </Panel>

      <Panel title="4. Where LibreChat is substantially broader">
        <P>{TRUEFORGE.broader}</P>
      </Panel>

      <Panel title="5. Where TrueForge is stronger conceptually">
        <P>{TRUEFORGE.stronger}</P>
      </Panel>

      <Panel title="6. Context management">
        <P>{TRUEFORGE.context}</P>
      </Panel>

      <Panel title="7. TrueForge + TrueFoundry Gateway">
        <P>{TRUEFORGE.gateway}</P>
      </Panel>

      <Panel title="8. Canvas / Dashboard difference">
        <P>{TRUEFORGE.canvas}</P>
      </Panel>

      <Panel title="9. An option for PBMP — not necessarily OR">
        <P>{TRUEFORGE.both}</P>
      </Panel>

      <Panel title="10. Which one for the MVP we just discussed?">
        <P>{TRUEFORGE.mvp}</P>
        <div className="overflow-auto rounded-lg border border-line mt-2">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Stage</th>
                <th className="px-3 py-2 font-medium">Best fit</th>
              </tr>
            </thead>
            <tbody>
              {TRUEFORGE.stages.map((row) => (
                <tr key={row.stage} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100">{row.stage}</td>
                  <td className="px-3 py-2 text-slate-300">{row.fit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>{TRUEFORGE.conclusion}</P>
        <P>
          Related:{' '}
          <Link className="text-accent underline" to="/mvp">
            First MVP
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/three-layers">
            Agent runtime
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/takeaway">
            Takeaway
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/trueforge-integrate">
            How they integrate (not plug-and-play)
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

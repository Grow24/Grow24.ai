import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MECE } from '../mece';
import { Page, Panel, P } from '../components/Page';

function statusClass(status: string) {
  const s = status.toLowerCase();
  if (s.includes('experimental') || s === 'preview') return 'text-rose-300';
  if (s.includes('extension') || s.includes('recommended')) return 'text-amber-300';
  if (s.includes('configured') || s.includes('configurable') || s.includes('preference')) return 'text-sky-300';
  return 'text-mint';
}

export default function MecePage() {
  const [family, setFamily] = useState<number | 'all'>('all');
  const shown = useMemo(
    () => (family === 'all' ? MECE.families : MECE.families.filter((f) => f.n === family)),
    [family],
  );
  const count = MECE.families.reduce((n, f) => n + f.rows.length, 0);

  return (
    <Page kicker="MECE · v0.8.x official docs" title={MECE.headline} lead={MECE.lead}>
      <Panel title="Convention">
        <P>{MECE.convention}</P>
        <P>{MECE.offlineMeaning}</P>
        <P>
          {count} L3 capabilities across {MECE.families.length} L1 families. Official index was Agentic AI, Search
          & Knowledge, Media, Chat and Security — reorganized here for business architecture.
        </P>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => setFamily('all')}
            className={`rounded-full border px-3 py-1 text-xs ${
              family === 'all' ? 'border-accent bg-cyan-500/15 text-accent' : 'border-line text-slate-400'
            }`}
          >
            All families
          </button>
          {MECE.families.map((f) => (
            <button
              key={f.n}
              type="button"
              onClick={() => setFamily(f.n)}
              className={`rounded-full border px-3 py-1 text-xs ${
                family === f.n ? 'border-accent bg-cyan-500/15 text-accent' : 'border-line text-slate-400'
              }`}
            >
              {f.n}. {f.name}
            </button>
          ))}
        </div>
      </Panel>

      {shown.map((f) => (
        <Panel key={f.n} title={`${f.n}. ${f.name}`}>
          <div className="overflow-auto rounded-lg border border-line">
            <table className="w-full text-xs min-w-[1100px]">
              <thead className="bg-white/5 text-left text-slate-400">
                <tr>
                  <th className="px-2 py-2 font-medium">L2</th>
                  <th className="px-2 py-2 font-medium">L3 capability</th>
                  <th className="px-2 py-2 font-medium">Business / example</th>
                  <th className="px-2 py-2 font-medium">Status</th>
                  <th className="px-2 py-2 font-medium">Offline</th>
                  <th className="px-2 py-2 font-medium">Online</th>
                  <th className="px-2 py-2 font-medium">Hybrid</th>
                  <th className="px-2 py-2 font-medium">Client hardware</th>
                  <th className="px-2 py-2 font-medium">Improves with</th>
                </tr>
              </thead>
              <tbody>
                {f.rows.map((row) => (
                  <tr key={`${row.l2}-${row.l3}`} className="border-t border-line align-top">
                    <td className="px-2 py-2 text-slate-400 whitespace-nowrap">{row.l2}</td>
                    <td className="px-2 py-2 text-cyan-100">{row.l3}</td>
                    <td className="px-2 py-2 text-slate-300 min-w-[280px]">{row.desc}</td>
                    <td className={`px-2 py-2 ${statusClass(row.status)}`}>{row.status}</td>
                    <td className="px-2 py-2 text-slate-300">{row.offline}</td>
                    <td className="px-2 py-2 text-slate-300">{row.online}</td>
                    <td className="px-2 py-2 text-slate-300">{row.hybrid}</td>
                    <td className="px-2 py-2 text-slate-400">{row.client}</td>
                    <td className="px-2 py-2 text-slate-400">{row.improves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      ))}

      <Panel title="Offline does not mean everything runs inside the browser">
        <P>{MECE.threeArch}</P>
      </Panel>

      <Panel title="Hardware tiers">
        <P>{MECE.tiersIntro}</P>
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Device class</th>
                <th className="px-3 py-2 font-medium">Indicative hardware</th>
                <th className="px-3 py-2 font-medium">Enable by default</th>
              </tr>
            </thead>
            <tbody>
              {MECE.tiers.map((t) => (
                <tr key={t.cls} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100">{t.cls}</td>
                  <td className="px-3 py-2 text-slate-300">{t.hw}</td>
                  <td className="px-3 py-2 text-slate-400">{t.enable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>{MECE.pwaLimit}</P>
      </Panel>

      <Panel title="Four layers">
        <P>{MECE.fourLayers}</P>
        <P>{MECE.manager}</P>
        <P>
          Related:{' '}
          <Link className="text-accent underline" to="/device-modes">
            Offline / LAN / Cloud
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/libraries">
            Libraries
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/takeaway">
            Takeaway
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/mvp">
            First MVP
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

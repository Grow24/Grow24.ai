import { Link } from 'react-router-dom';
import { VIDEO_GAPS } from '../content';
import { Page, Panel, P } from '../components/Page';

const TONE: Record<string, { label: string; className: string }> = {
  covered: { label: 'Yes', className: 'text-mint' },
  older: { label: 'Yes, but older', className: 'text-amber-300' },
  limited: { label: 'Limited', className: 'text-amber-300' },
  missing: { label: 'No', className: 'text-rose-300' },
};

export default function VideosPage() {
  return (
    <Page kicker="Video evidence gap" title={VIDEO_GAPS.heading} lead={VIDEO_GAPS.important}>
      <Panel>
        <P>{VIDEO_GAPS.notFound}</P>
      </Panel>

      <div className="overflow-auto rounded-xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-slate-400">
            <tr>
              <th className="px-3 py-2 font-medium">Current capability</th>
              <th className="px-3 py-2 font-medium">Good recent video?</th>
              <th className="px-3 py-2 font-medium">Note</th>
            </tr>
          </thead>
          <tbody>
            {VIDEO_GAPS.coverage.map((row) => {
              const tone = TONE[row.video];
              return (
                <tr key={row.capability} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100">{row.capability}</td>
                  <td className={`px-3 py-2 ${tone.className}`}>{tone.label}</td>
                  <td className="px-3 py-2 text-slate-400">{row.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Panel title="Why this gap matters">
        <P>{VIDEO_GAPS.whyItMatters}</P>
      </Panel>

      <Panel title="Recommended viewing — about 30–40 minutes">
        <P>{VIDEO_GAPS.sequenceIntro}</P>
        <ol className="space-y-3 mt-2">
          {VIDEO_GAPS.sequence.map((item) => (
            <li key={item.n} className="rounded-lg border border-line px-4 py-3">
              <div className="flex items-baseline gap-2">
                <span className="text-accent text-sm">{item.n}.</span>
                <span className="text-cyan-100">{item.title}</span>
                {item.priority && <span className="text-[11px] text-mint">Watch first for PBMP</span>}
              </div>
              <p className="text-sm text-slate-400 mt-1 pl-5">{item.why}</p>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="If the question is build vs use LibreChat">
        <P>{VIDEO_GAPS.watchFirst}</P>
        <P>
          That question also sits on the{' '}
          <Link className="text-accent underline" to="/takeaway">
            strategic takeaway
          </Link>
          : LibreChat as AI Interaction + Agent Runtime under PBMP, not a chatbot clone. The{' '}
          <Link className="text-accent underline" to="/current-ui">
            v0.8.7 desktop frontend
          </Link>{' '}
          (redesigned in v0.8.5) is a better representation of present-day LibreChat than many older YouTube
          screenshots.
        </P>
        <P>
          For Canvas/Artifact as an actual rich UI, watch a different sequence:{' '}
          <Link className="text-accent underline" to="/canvas-videos">
            Capital Markets 2026 first, then the official Artifacts demo
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

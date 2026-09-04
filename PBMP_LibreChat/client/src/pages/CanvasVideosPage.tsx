import { Link } from 'react-router-dom';
import { CANVAS_VIDEOS } from '../content';
import { Page, Panel, P } from '../components/Page';

function Stars({ n }: { n: number }) {
  return <span className="text-mint text-xs tracking-tight">{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>;
}

export default function CanvasVideosPage() {
  return (
    <Page kicker="Canvas / Artifact videos" title={CANVAS_VIDEOS.headline} lead={CANVAS_VIDEOS.lead}>
      {CANVAS_VIDEOS.items.map((item) => (
        <Panel key={item.n} title={`${item.n}. ${item.title}`}>
          {item.first && <P>This is the one to watch first.</P>}
          <P>{item.body}</P>
          {item.flow && <p className="text-sm font-mono text-mint leading-relaxed">{item.flow}</p>}
          {item.whyPbmp && <P>{item.whyPbmp}</P>}
          <P>Watch: {item.watch}</P>
        </Panel>
      ))}

      <Panel title="What to watch, in order">
        <P>{CANVAS_VIDEOS.orderIntro}</P>
        <div className="overflow-auto rounded-lg border border-line mt-2">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Watch</th>
                <th className="px-3 py-2 font-medium">Why</th>
              </tr>
            </thead>
            <tbody>
              {CANVAS_VIDEOS.order.map((row) => (
                <tr key={row.n} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100 whitespace-nowrap">
                    {row.watch} <Stars n={row.stars} />
                  </td>
                  <td className="px-3 py-2 text-slate-300">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="The Canvas isn’t really a “rich-text canvas”">
        <P>{CANVAS_VIDEOS.conclusion}</P>
        <P>{CANVAS_VIDEOS.formArch}</P>
        <P>{CANVAS_VIDEOS.whyOne}</P>
        <P>{CANVAS_VIDEOS.gap}</P>
        <P>
          Related:{' '}
          <Link className="text-accent underline" to="/three-layers">
            canvas / intelligence / execution
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/videos">
            video gaps
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/production">
            Artifacts
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/local-device">
            Video.js / ffmpeg.wasm as a client-library extension
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

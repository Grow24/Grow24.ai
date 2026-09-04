import { Link } from 'react-router-dom';
import { CURRENT_UI } from '../content';
import { Page, Panel, P } from '../components/Page';

export default function CurrentUiPage() {
  return (
    <Page kicker="v0.8.7 stable · 23 June 2026" title={CURRENT_UI.headline} lead={CURRENT_UI.release}>
      <Panel>
        <P>{CURRENT_UI.source}</P>
      </Panel>

      <Panel title="What you are seeing">
        <P>{CURRENT_UI.seeing}</P>
        <div className="mt-3 rounded-xl border border-line overflow-hidden grid grid-cols-[200px_1fr] min-h-[320px] bg-ink">
          <aside className="border-r border-line p-3 space-y-3 text-sm">
            <div className="text-[11px] uppercase tracking-widest text-slate-500">Left sidebar</div>
            <div className="rounded-md border border-line px-2 py-1.5 text-slate-400">Search conversations</div>
            <div className="text-slate-300">Chat history</div>
            <div className="text-slate-300">Projects</div>
            <div className="text-slate-300">Agents etc.</div>
            <div className="pt-8 text-slate-400">User/Profile</div>
          </aside>
          <div className="flex flex-col items-center justify-center gap-6 p-6">
            <div className="text-xl font-semibold text-slate-200">LibreChat</div>
            <div className="w-full max-w-md rounded-2xl border border-line bg-panel px-4 py-3 space-y-3">
              <div className="text-slate-400 text-sm">Message LibreChat...</div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="rounded-full border border-line px-2 py-1">🎙</span>
                <span className="rounded-full border border-line px-2 py-1">Tools</span>
                <span className="rounded-full border border-line px-2 py-1">Search</span>
                <span className="rounded-full border border-line px-2 py-1">Actions</span>
                <span className="rounded-full border border-line px-2 py-1">MCP</span>
              </div>
            </div>
          </div>
        </div>
        <pre className="mt-4 overflow-auto rounded-lg border border-line bg-black/30 p-3 text-[11px] leading-snug text-slate-400 font-mono">{`┌─────────────────────────────────────────────────────────────┐
│ LEFT SIDEBAR │                MAIN AREA                     │
│              │                                              │
│ Search       │                  LibreChat                   │
│ conversations│                                              │
│              │            ┌──────────────────────┐          │
│ Chat history │            │ Message LibreChat... │          │
│              │            │                      │          │
│ Projects     │            │ 🎙  Tools   Search   │          │
│              │            │     Actions  MCP     │          │
│ Agents etc.  │            └──────────────────────┘          │
│              │                                              │
│ User/Profile │                                              │
└─────────────────────────────────────────────────────────────┘`}</pre>
      </Panel>

      <Panel title="v0.8.5 redesigned the UI; 0.8.6–0.8.7 added capability">
        <P>{CURRENT_UI.evaluation}</P>
        <P>{CURRENT_UI.betterThanVideos}</P>
        <P>
          Older video coverage is listed under{' '}
          <Link className="text-accent underline" to="/videos">
            video gaps & viewing
          </Link>
          .
        </P>
      </Panel>

      <Panel title="Complete UI — screens still to add">
        <P>{CURRENT_UI.screenshotOffer}</P>
        <ol className="space-y-2 mt-2">
          {CURRENT_UI.screenshots.map((s) => (
            <li key={s.n} className="rounded-lg border border-line px-4 py-2 text-sm flex gap-3">
              <span className="text-accent">{s.n}.</span>
              <span className="text-cyan-100">{s.screen}</span>
              <span className="text-slate-500">not in this brief yet</span>
            </li>
          ))}
        </ol>
        <P>{CURRENT_UI.notYet}</P>
      </Panel>
    </Page>
  );
}

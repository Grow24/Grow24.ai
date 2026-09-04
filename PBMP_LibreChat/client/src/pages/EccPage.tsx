import { Link } from 'react-router-dom';
import { ECC } from '../content';
import { Page, Panel, P } from '../components/Page';

const TONE: Record<string, string> = {
  high: 'text-mint',
  medium: 'text-amber-300',
  low: 'text-rose-300',
};

export default function EccPage() {
  return (
    <Page kicker="ECC 2.2.0 · 28 August 2026" title={ECC.headline} lead={ECC.inspected}>
      <Panel>
        <p className="text-sm font-mono text-mint">{ECC.loop}</p>
        <P>{ECC.packages}</P>
        <P>{ECC.version}</P>
      </Panel>

      <Panel title="Videos worth watching">
        <ol className="space-y-3">
          {ECC.videos.map((v) => (
            <li key={v.n} className="rounded-lg border border-line px-4 py-3">
              <div className="text-cyan-100">
                {v.n}. {v.title}
              </div>
              <p className="text-sm text-slate-400 mt-1">{v.why}</p>
            </li>
          ))}
        </ol>
        <P>{ECC.snapshotWarning}</P>
      </Panel>

      <Panel title="Can ECC be set up on LibreChat?">
        <P>{ECC.notPluginInstall}</P>
        <div className="overflow-auto rounded-lg border border-line mt-2">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">ECC</th>
                <th className="px-3 py-2 font-medium">LibreChat equivalent</th>
                <th className="px-3 py-2 font-medium">How transferable?</th>
              </tr>
            </thead>
            <tbody>
              {ECC.mapping.map((row) => (
                <tr key={row.ecc} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100">{row.ecc}</td>
                  <td className="px-3 py-2 text-slate-300">{row.librechat}</td>
                  <td className={`px-3 py-2 ${TONE[row.tone]}`}>{row.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="ECC Skills from GitHub — SKILL.md sync">
        <P>{ECC.skillSync}</P>
        <p className="text-sm font-mono text-mint leading-relaxed">{ECC.githubPath}</p>
        <P>{ECC.betterThanCopy}</P>
      </Panel>

      <Panel title="What happens to ECC’s 68 Agents?">
        <P>{ECC.agents}</P>
        <P>{ECC.mapsNaturally}</P>
        <P>{ECC.multiModel}</P>
      </Panel>

      <Panel title="What happens to /plan, /tdd, /review?">
        <P>{ECC.commands}</P>
        <P>{ECC.dollarSkills}</P>
      </Panel>

      <Panel title="Hooks — the most interesting recent development">
        <P>{ECC.hooks}</P>
        <P>{ECC.hooksObstacle}</P>
        <P>{ECC.hooksCaveat}</P>
      </Panel>

      <Panel title="Where LibreChat will not simply replace Claude Code">
        <P>{ECC.notReplace}</P>
        <P>{ECC.mcpLayer}</P>
      </Panel>

      <Panel title="View for this architecture">
        <P>{ECC.notPretend}</P>
        <P>{ECC.pbmp}</P>
        <P>{ECC.answer}</P>
        <P>
          Related:{' '}
          <Link className="text-accent underline" to="/skills">
            Skills / GitHub sync
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/orchestration">
            Subagents
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/tools">
            MCP
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/three-layers">
            Agent runtime
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

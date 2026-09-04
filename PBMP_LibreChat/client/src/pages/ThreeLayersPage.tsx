import { Link } from 'react-router-dom';
import { THREE_LAYERS } from '../content';
import { Page, Panel, P } from '../components/Page';

const SUPPORT: Record<string, { label: string; className: string }> = {
  yes: { label: 'Yes', className: 'text-mint' },
  'yes-very': { label: 'Yes, very much so', className: 'text-mint' },
  warn: { label: 'Not first-class', className: 'text-amber-300' },
};

export default function ThreeLayersPage() {
  return (
    <Page kicker="Canvas · intelligence · execution" title={THREE_LAYERS.headline} lead={THREE_LAYERS.possible}>
      <Panel title={THREE_LAYERS.canvasTitle}>
        <P>{THREE_LAYERS.canvasIntro}</P>
        <div className="overflow-auto rounded-lg border border-line mt-2">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Information / Form</th>
                <th className="px-3 py-2 font-medium">Support</th>
                <th className="px-3 py-2 font-medium">How</th>
              </tr>
            </thead>
            <tbody>
              {THREE_LAYERS.artifactTable.map((row) => {
                const tone = SUPPORT[row.support];
                return (
                  <tr key={row.info} className="border-t border-line">
                    <td className="px-3 py-2 text-cyan-100">{row.info}</td>
                    <td className={`px-3 py-2 ${tone.className}`}>{tone.label}</td>
                    <td className="px-3 py-2 text-slate-300">{row.how}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <P>{THREE_LAYERS.runtime}</P>
        <P>{THREE_LAYERS.dashboardExample}</P>
        <P>{THREE_LAYERS.videoLimit}</P>
        <P>{THREE_LAYERS.pbmpFit}</P>
      </Panel>

      <Panel title={THREE_LAYERS.intelligenceTitle}>
        <P>{THREE_LAYERS.notLlm}</P>
        <P>{THREE_LAYERS.flow}</P>
      </Panel>

      <Panel title={THREE_LAYERS.plugTitle}>
        <P>{THREE_LAYERS.plugYes}</P>
        <p className="text-sm font-mono text-mint">PBMP → LibreChat → OpenAI API → GPT-5.6 Sol</p>
      </Panel>

      <Panel title={THREE_LAYERS.qualityTitle}>
        <P>{THREE_LAYERS.modelLevel}</P>
        <P>{THREE_LAYERS.productLevel}</P>
        <P>{THREE_LAYERS.notIdentical}</P>
      </Panel>

      <Panel title={THREE_LAYERS.spawnTitle}>
        <P>{THREE_LAYERS.subagents}</P>
        <P>{THREE_LAYERS.acquisitionExample}</P>
      </Panel>

      <Panel title={THREE_LAYERS.selfSpawnTitle}>
        <P>{THREE_LAYERS.selfSpawn}</P>
      </Panel>

      <Panel title={THREE_LAYERS.chainsTitle}>
        <P>{THREE_LAYERS.twoForms}</P>
      </Panel>

      <Panel title={THREE_LAYERS.pythonTitle}>
        <P>{THREE_LAYERS.pythonChange}</P>
        <P>{THREE_LAYERS.languages}</P>
      </Panel>

      <Panel title={THREE_LAYERS.ptcTitle}>
        <P>{THREE_LAYERS.ptc}</P>
      </Panel>

      <Panel title={THREE_LAYERS.combineTitle}>
        <P>{THREE_LAYERS.combine}</P>
      </Panel>

      <Panel title={THREE_LAYERS.pbmpTitle}>
        <P>{THREE_LAYERS.notPrimitive}</P>
        <P>{THREE_LAYERS.instead}</P>
        <P>{THREE_LAYERS.roles}</P>
      </Panel>

      <Panel title="Direct answers">
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Question</th>
                <th className="px-3 py-2 font-medium">Answer</th>
              </tr>
            </thead>
            <tbody>
              {THREE_LAYERS.qa.map((row) => (
                <tr key={row.q} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100 align-top">{row.q}</td>
                  <td className="px-3 py-2 text-slate-300">{row.a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>{THREE_LAYERS.stronger}</P>
        <P>
          Related:{' '}
          <Link className="text-accent underline" to="/production">
            Artifacts & Code Interpreter
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/orchestration">
            Subagents & Chains
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/takeaway">
            Takeaway
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/canvas-videos">
            Canvas videos (#1 Capital Markets first)
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

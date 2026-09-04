import { GOVERNANCE } from '../content';
import { Bullets, Page, Panel, P } from '../components/Page';

export default function GovernancePage() {
  return (
    <Page
      kicker="Capability 9"
      title="Governance, identity, cost, admin and moderation"
      lead="LibreChat has moved quite far on enterprise governance. Operate AI centrally like an enterprise platform."
    >
      <Panel title="Access control — three levels">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="py-1 pr-4">Control</th>
              <th className="py-1">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {GOVERNANCE.threeLevels.map((r) => (
              <tr key={r.control} className="border-t border-line">
                <td className="py-2 pr-4 text-cyan-100">{r.control}</td>
                <td className="py-2 text-slate-300">{r.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <P>{GOVERNANCE.associated}</P>
        <P>Example roles: {GOVERNANCE.exampleRoles.join(', ')} — each with different models, agents, knowledge and capabilities.</P>
      </Panel>
      <Panel title="Enterprise login / identity">
        <Bullets items={GOVERNANCE.auth} />
        <P>{GOVERNANCE.identityFit}</P>
      </Panel>
      <Panel title="Cost and usage">
        <P>{GOVERNANCE.cost.records}</P>
        <P>{GOVERNANCE.cost.balance}</P>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="py-1">User/group</th>
              <th className="py-1">Allowed budget</th>
            </tr>
          </thead>
          <tbody>
            {GOVERNANCE.cost.example.map((r) => (
              <tr key={r.group} className="border-t border-line">
                <td className="py-2 text-cyan-100">{r.group}</td>
                <td className="py-2">{r.budget}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <P>{GOVERNANCE.cost.note}</P>
      </Panel>
      <Panel title="Administration">
        <P>{GOVERNANCE.admin.panel}</P>
        <P>Administrators can manage:</P>
        <Bullets items={GOVERNANCE.admin.manage} />
        <P>{GOVERNANCE.admin.overrides}</P>
        <P>{GOVERNANCE.admin.preview}</P>
      </Panel>
      <Panel title="Moderation and abuse prevention">
        <Bullets items={GOVERNANCE.moderation} />
        <P>{GOVERNANCE.block}</P>
        <P>{GOVERNANCE.notReplacement}</P>
      </Panel>
    </Page>
  );
}

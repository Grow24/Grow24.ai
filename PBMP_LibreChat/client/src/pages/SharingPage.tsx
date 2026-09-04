import { Link } from 'react-router-dom';
import { SHARING } from '../content';
import { Bullets, Page, Panel, P } from '../components/Page';

export default function SharingPage() {
  return (
    <Page
      kicker="Capability 8"
      title="Sharing, reuse and an AI Marketplace"
      lead="Once people start building useful Agents, Prompts and Skills, LibreChat allows those assets to become reusable."
    >
      <Panel title="Permission model — share with">
        <Bullets items={SHARING.permissionWith} />
        <P>{SHARING.marketplace}</P>
      </Panel>
      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="Without such a platform">
          <P>{SHARING.without}</P>
        </Panel>
        <Panel title="With LibreChat">
          <P>{SHARING.with}</P>
        </Panel>
      </div>
      <Panel>
        <P>
          Agent Marketplace, Prompt Library and Skills are separately governable catalogues — see{' '}
          <Link className="text-accent underline" to="/libraries">
            libraries
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

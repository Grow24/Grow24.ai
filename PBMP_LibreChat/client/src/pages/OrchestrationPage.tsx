import { Link } from 'react-router-dom';
import { ORCHESTRATION } from '../content';
import { Bullets, Page, Panel, P } from '../components/Page';

export default function OrchestrationPage() {
  return (
    <Page
      kicker="Capability 4 · multi-agent"
      title="Multi-agent working"
      lead={ORCHESTRATION.beyond}
    >
      <Panel title={ORCHESTRATION.subagents.title}>
        <P>{ORCHESTRATION.subagents.text}</P>
        <Bullets items={ORCHESTRATION.subagents.example} />
      </Panel>
      <Panel title={ORCHESTRATION.chains.title}>
        <P>{ORCHESTRATION.chains.text}</P>
        <p className="text-sm text-mint font-mono">{ORCHESTRATION.chains.sequence.join(' → ')}</p>
      </Panel>
      <Panel title={ORCHESTRATION.handoffs.title}>
        <P>{ORCHESTRATION.handoffs.text}</P>
      </Panel>
      <Panel>
        <P>{ORCHESTRATION.takeaway}</P>
        <P>
          Subagents vs Agent Chains, allowSelf, and Programmatic Tool Calling:{' '}
          <Link className="text-accent underline" to="/three-layers">
            canvas / intelligence / execution
          </Link>
          .
        </P>
        <P>
          ECC specialist roles map onto this parent/child pattern:{' '}
          <Link className="text-accent underline" to="/ecc">
            ECC on LibreChat
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

import { Link } from 'react-router-dom';
import { ACTIONS, MCP } from '../content';
import { Bullets, Page, Panel, P } from '../components/Page';

export default function ToolsPage() {
  return (
    <Page
      kicker="Capability 6"
      title="MCP and API Actions — AI that can do things"
      lead="This may ultimately be the most strategically important LibreChat capability."
    >
      <Panel title="MCP — USB-C for AI">
        <P>{MCP.usb}</P>
        <P>{MCP.instead}</P>
        <p className="text-sm font-mono text-mint">LibreChat ↔ MCP ↔ {MCP.examples.join(' / ')}</p>
        <P>{MCP.perUser}</P>
        <P>{MCP.restrict}</P>
        <P>{MCP.shift}</P>
      </Panel>
      <Panel title="API Actions">
        <P>{ACTIONS.text}</P>
        <Bullets items={ACTIONS.examples} />
        <P>{ACTIONS.domains}</P>
        <P>{ACTIONS.vsMcp}</P>
        <P>
          Built-in tools, MCP servers and Actions all sit in the Tool Library — see{' '}
          <Link className="text-accent underline" to="/libraries">
            libraries
          </Link>
          .
        </P>
        <P>
          Full ECC-like coding still needs GitHub / filesystem / terminal MCP:{' '}
          <Link className="text-accent underline" to="/ecc">
            ECC on LibreChat
          </Link>
          . TrueForge POC via OpenAPI Actions, one shared PBMP MCP:{' '}
          <Link className="text-accent underline" to="/trueforge-integrate">
            LibreChat ↔ TrueForge
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

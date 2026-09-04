import { Link } from 'react-router-dom';
import { MODEL_HUB } from '../content';
import { Bullets, Page, Panel, P } from '../components/Page';

export default function ModelHubPage() {
  return (
    <Page
      kicker="Capability 1"
      title="AI Model Hub — one front door to many AIs"
      lead="This is one of LibreChat’s most important capabilities. The organisation can control what appears."
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="Today">
          <P>Employee goes separately to each product:</P>
          <Bullets items={MODEL_HUB.today.map((n) => `Employee → ${n}`)} />
        </Panel>
        <Panel title="With LibreChat">
          <P>{MODEL_HUB.withLibreChat}</P>
          <P>Approved model configurations hide technical names and parameters from users.</P>
        </Panel>
      </div>
      <Panel title="Model services it can connect">
        <Bullets items={MODEL_HUB.providers} />
        <P>OpenAI-compatible covering:</P>
        <Bullets items={MODEL_HUB.compatible} />
        <P>{MODEL_HUB.approvedConfigs}</P>
      </Panel>
      <Panel title="Compare models — multiConvo">
        <P>{MODEL_HUB.multiConvo}</P>
      </Panel>
      <Panel title="Ollama is not required">
        <P>
          Ollama is only one interchangeable way to supply models. LibreChat can talk to OpenAI, Claude, Gemini and
          others with no Ollama anywhere. See{' '}
          <Link className="text-accent underline" to="/model-supply">
            model supply, OpenRouter, and three PBMP deployment modes
          </Link>
          . Perplexity is a live-web research provider, not a local runner — see{' '}
          <Link className="text-accent underline" to="/perplexity">
            Perplexity in the LibreChat layer
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

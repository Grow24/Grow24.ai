import { Link } from 'react-router-dom';
import { ARTIFACTS, CODE_INTERPRETER, MEDIA } from '../content';
import { Bullets, Page, Panel, P } from '../components/Page';

export default function ProductionPage() {
  return (
    <Page
      kicker="Capability 7"
      title="Analysis and content production"
      lead="Code Interpreter, Artifacts, images, documents and speech — AI as an analytical and production environment."
    >
      <Panel title="Code Interpreter">
        <P>{CODE_INTERPRETER.meaning}</P>
        <P>Languages: {CODE_INTERPRETER.languages.join(', ')} — {CODE_INTERPRETER.files}</P>
        <P>{CODE_INTERPRETER.example}</P>
        <P>{CODE_INTERPRETER.experimental}</P>
      </Panel>
      <Panel title="Artifacts">
        <P>LibreChat can generate more than text. Supported:</P>
        <Bullets items={ARTIFACTS.types} />
        <P>{ARTIFACTS.beside}</P>
        <Bullets items={ARTIFACTS.examples.map((e) => `“${e}”`)} />
        <P>{ARTIFACTS.meaning}</P>
        <P>
          Native artifact types, Recharts/Three.js runtime, and why video is not first-class:{' '}
          <Link className="text-accent underline" to="/three-layers">
            canvas / intelligence / execution
          </Link>
          . Demonstrations of generated interactive UI:{' '}
          <Link className="text-accent underline" to="/canvas-videos">
            Canvas/Artifact videos
          </Link>
          .
        </P>
      </Panel>
      <div className="grid md:grid-cols-3 gap-4">
        <Panel title="Images">
          <P>{MEDIA.images}</P>
        </Panel>
        <Panel title="Documents">
          <P>Files can be:</P>
          <Bullets items={MEDIA.documents} />
        </Panel>
        <Panel title="Voice">
          <P>{MEDIA.stt}</P>
          <P>{MEDIA.tts}</P>
          <P>{MEDIA.voiceProviders}</P>
          <P>
            Whisper is STT only. TTS, camera, voice→keyboard, and OS automation:{' '}
            <Link className="text-accent underline" to="/local-device">
              local laptop / desktop
            </Link>
            . Device-local vs cloud, Chatterbox/Kokoro tiers:{' '}
            <Link className="text-accent underline" to="/device-modes">
              operating modes
            </Link>
            .
          </P>
        </Panel>
      </div>
    </Page>
  );
}

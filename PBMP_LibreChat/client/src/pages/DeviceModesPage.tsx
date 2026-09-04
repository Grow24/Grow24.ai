import { Link } from 'react-router-dom';
import { DEVICE_MODES } from '../content';
import { Page, Panel, P } from '../components/Page';

const OFF: Record<string, { label: string; className: string }> = {
  both: { label: 'Offline / online', className: 'text-mint' },
  offline: { label: 'Offline', className: 'text-mint' },
  online: { label: 'Online', className: 'text-amber-300' },
};

export default function DeviceModesPage() {
  return (
    <Page kicker="Offline · Private/LAN · Cloud" title={DEVICE_MODES.headline} lead={DEVICE_MODES.lead}>
      <Panel>
        <P>{DEVICE_MODES.stack}</P>
      </Panel>

      <div className="grid md:grid-cols-3 gap-3">
        {DEVICE_MODES.pbmpLabels.map((l) => (
          <div key={l.name} className="rounded-xl border border-line bg-panel p-4 space-y-2">
            <div className="text-cyan-100 font-medium">{l.name}</div>
            <P>{l.meaning}</P>
          </div>
        ))}
      </div>
      <P>{DEVICE_MODES.labelsBetter}</P>

      <Panel title="A. Capabilities that can be embedded — offline vs online">
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Capability</th>
                <th className="px-3 py-2 font-medium">What the user experiences</th>
                <th className="px-3 py-2 font-medium">Offline?</th>
                <th className="px-3 py-2 font-medium">How</th>
              </tr>
            </thead>
            <tbody>
              {DEVICE_MODES.capabilities.map((row) => {
                const tone = OFF[row.off];
                return (
                  <tr key={row.cap} className="border-t border-line">
                    <td className="px-3 py-2 text-cyan-100">{row.cap}</td>
                    <td className="px-3 py-2 text-slate-300">{row.exp}</td>
                    <td className={`px-3 py-2 whitespace-nowrap ${tone.className}`}>{tone.label}</td>
                    <td className="px-3 py-2 text-slate-400">{row.how}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <P>{DEVICE_MODES.sttTtsDocs}</P>
        <P>{DEVICE_MODES.canvasLocal}</P>
        <P>{DEVICE_MODES.pwaNotEnough}</P>
      </Panel>

      <Panel title="B. Can a PWA sense hardware and select the right capability?">
        <P>{DEVICE_MODES.pwaSense}</P>
        <P>{DEVICE_MODES.browserApis}</P>
        <P>{DEVICE_MODES.ttsProfiles}</P>
      </Panel>

      <Panel title="Chatterbox / Kokoro — quality tiers, not GPU vs CPU">
        <P>{DEVICE_MODES.chatterboxNotSimple}</P>
        <P>{DEVICE_MODES.chatterboxNotes}</P>
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Chatterbox version</th>
                <th className="px-3 py-2 font-medium">Size</th>
                <th className="px-3 py-2 font-medium">Intended use</th>
              </tr>
            </thead>
            <tbody>
              {DEVICE_MODES.chatterboxFamily.map((row) => (
                <tr key={row.version} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100">{row.version}</td>
                  <td className="px-3 py-2 text-slate-300">{row.size}</td>
                  <td className="px-3 py-2 text-slate-300">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid md:grid-cols-3 gap-3 mt-3">
          {DEVICE_MODES.tiers.map((t) => (
            <div key={t.n} className="rounded-lg border border-line p-3 space-y-2">
              <div className="text-[11px] uppercase tracking-widest text-accent">Tier {t.n}</div>
              <div className="text-cyan-100 font-medium">{t.name}</div>
              <P>{t.hw}</P>
              <P>{t.use}</P>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Do not rely solely on hardware detection">
        <P>{DEVICE_MODES.fingerprint}</P>
        <P>{DEVICE_MODES.betterArch}</P>
      </Panel>

      <Panel title="The PWA cannot silently install Chatterbox">
        <P>{DEVICE_MODES.cannotInstall}</P>
        <P>{DEVICE_MODES.option1}</P>
        <P>{DEVICE_MODES.option2}</P>
      </Panel>

      <Panel title="Device Capability Manager">
        <P>{DEVICE_MODES.manager}</P>
        <P>The same idea applies far beyond TTS:</P>
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Function</th>
                <th className="px-3 py-2 font-medium">Weak device</th>
                <th className="px-3 py-2 font-medium">Strong device</th>
              </tr>
            </thead>
            <tbody>
              {DEVICE_MODES.beyondTts.map((row) => (
                <tr key={row.fn} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100">{row.fn}</td>
                  <td className="px-3 py-2 text-slate-300">{row.weak}</td>
                  <td className="px-3 py-2 text-slate-300">{row.strong}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>{DEVICE_MODES.dynamic}</P>
        <P>{DEVICE_MODES.permissions}</P>
        <P>{DEVICE_MODES.formalize}</P>
        <P>
          Related:{' '}
          <Link className="text-accent underline" to="/local-device">
            Local laptop / desktop
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/model-supply">
            Ollama / private AI
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/perplexity">
            Perplexity (online research)
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/mece">
            MECE functionality table
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

import { Link } from 'react-router-dom';
import { LOCAL_DEVICE } from '../content';
import { Page, Panel, P } from '../components/Page';

const TODAY: Record<string, string> = {
  yes: 'text-mint',
  warn: 'text-amber-300',
  no: 'text-rose-300',
};

export default function LocalDevicePage() {
  return (
    <Page kicker="Local laptop / desktop" title={LOCAL_DEVICE.headline} lead={LOCAL_DEVICE.lead}>
      <div className="grid md:grid-cols-3 gap-3">
        {LOCAL_DEVICE.levels.map((l) => (
          <div key={l.n} className="rounded-xl border border-line bg-panel p-4 space-y-2">
            <div className="text-[11px] uppercase tracking-widest text-accent">Level {l.n}</div>
            <div className="text-cyan-100 font-medium">{l.name}</div>
            <P>{l.meaning}</P>
          </div>
        ))}
      </div>

      <Panel title="Whisper is STT, not voice playback">
        <P>{LOCAL_DEVICE.whisperCorrection}</P>
      </Panel>

      <Panel title="1. What can be configured on the local laptop/desktop?">
        <P>{LOCAL_DEVICE.webApp}</P>
        <div className="overflow-auto rounded-lg border border-line mt-2">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Local capability</th>
                <th className="px-3 py-2 font-medium">LibreChat today</th>
                <th className="px-3 py-2 font-medium">What to add</th>
              </tr>
            </thead>
            <tbody>
              {LOCAL_DEVICE.capabilities.map((row) => (
                <tr key={row.cap} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100">{row.cap}</td>
                  <td className={`px-3 py-2 ${TODAY[row.today]}`}>{row.todayNote}</td>
                  <td className="px-3 py-2 text-slate-300">{row.add}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="A. Voice input">
        <P>{LOCAL_DEVICE.voiceInput}</P>
        <p className="text-sm font-mono text-mint leading-relaxed">{LOCAL_DEVICE.voiceFlow}</p>
        <P>{LOCAL_DEVICE.maxQuality}</P>
      </Panel>

      <Panel title="B. Natural voice response">
        <P>{LOCAL_DEVICE.tts}</P>
      </Panel>

      <Panel title="C. Camera → image analysis">
        <P>{LOCAL_DEVICE.cameraToday}</P>
        <P>{LOCAL_DEVICE.cameraGap}</P>
        <P>{LOCAL_DEVICE.cameraExt}</P>
      </Panel>

      <Panel title="D. Continuous camera understanding">
        <P>{LOCAL_DEVICE.continuous}</P>
      </Panel>

      <Panel title="2. Can voice commands be linked to keyboard functions?">
        <P>{LOCAL_DEVICE.voiceKeys}</P>
        <P>{LOCAL_DEVICE.slashDelete}</P>
        <P>You could create an entire Voice Command Library:</P>
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Spoken instruction</th>
                <th className="px-3 py-2 font-medium">LibreChat action</th>
              </tr>
            </thead>
            <tbody>
              {LOCAL_DEVICE.voiceCommands.map((row) => (
                <tr key={row.spoken} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100">{row.spoken}</td>
                  <td className="px-3 py-2 text-slate-300">{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>{LOCAL_DEVICE.vui}</P>
      </Panel>

      <Panel title="Browser vs whole computer">
        <P>{LOCAL_DEVICE.case1}</P>
        <P>{LOCAL_DEVICE.case2}</P>
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">OS</th>
                <th className="px-3 py-2 font-medium">Possible local automation layer</th>
              </tr>
            </thead>
            <tbody>
              {LOCAL_DEVICE.osLayers.map((row) => (
                <tr key={row.os} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100">{row.os}</td>
                  <td className="px-3 py-2 text-slate-300">{row.layer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>{LOCAL_DEVICE.deviceController}</P>
      </Panel>

      <Panel title="3. What libraries can be installed on the client side?">
        <P>{LOCAL_DEVICE.threeMeanings}</P>
        <P>{LOCAL_DEVICE.artifactLibs}</P>
        <P>{LOCAL_DEVICE.extraIntro}</P>
        <div className="space-y-3">
          {LOCAL_DEVICE.extraCats.map((c) => (
            <div key={c.name} className="rounded-lg border border-line p-3 space-y-1">
              <div className="text-cyan-100 font-medium text-sm">{c.name}</div>
              <P>{c.libs}</P>
              <P>{c.enables}</P>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Three installation levels — this separation is extremely important">
        <P>{LOCAL_DEVICE.sandpack}</P>
        <div className="grid md:grid-cols-3 gap-3">
          {LOCAL_DEVICE.installLevels.map((l) => (
            <div key={l.n} className="rounded-lg border border-line p-3 space-y-2">
              <div className="text-[11px] uppercase tracking-widest text-accent">{l.n}. {l.name}</div>
              <P>{l.meaning}</P>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Maximum-capability PBMP workstation">
        <P>{LOCAL_DEVICE.workstation}</P>
        <P>{LOCAL_DEVICE.implication}</P>
        <P>{LOCAL_DEVICE.eca}</P>
        <P>
          Related:{' '}
          <Link className="text-accent underline" to="/production">
            Speech & Artifacts
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/three-layers">
            Canvas / LLM / Agents
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/libraries">
            Libraries
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/device-modes">
            Offline / LAN / Cloud and Device Capability Manager
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

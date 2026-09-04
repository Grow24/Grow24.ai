import { NavLink, Route, Routes } from 'react-router-dom';
import OverviewPage from './pages/OverviewPage';
import ModelHubPage from './pages/ModelHubPage';
import WorkspacePage from './pages/WorkspacePage';
import AgentsPage from './pages/AgentsPage';
import SkillsPage from './pages/SkillsPage';
import OrchestrationPage from './pages/OrchestrationPage';
import KnowledgePage from './pages/KnowledgePage';
import ToolsPage from './pages/ToolsPage';
import ProductionPage from './pages/ProductionPage';
import SharingPage from './pages/SharingPage';
import GovernancePage from './pages/GovernancePage';
import ArchitecturePage from './pages/ArchitecturePage';
import TakeawayPage from './pages/TakeawayPage';
import VideosPage from './pages/VideosPage';
import ModelSupplyPage from './pages/ModelSupplyPage';
import PerplexityPage from './pages/PerplexityPage';
import CurrentUiPage from './pages/CurrentUiPage';
import LibrariesPage from './pages/LibrariesPage';
import ThreeLayersPage from './pages/ThreeLayersPage';
import CanvasVideosPage from './pages/CanvasVideosPage';
import LocalDevicePage from './pages/LocalDevicePage';
import EccPage from './pages/EccPage';
import DeviceModesPage from './pages/DeviceModesPage';
import MecePage from './pages/MecePage';
import MvpPage from './pages/MvpPage';
import TrueForgePage from './pages/TrueForgePage';
import TrueForgeIntegratePage from './pages/TrueForgeIntegratePage';
import TrueForgeMvpPage from './pages/TrueForgeMvpPage';

const links = [
  { to: '/', label: '1–9 Overview', end: true },
  { to: '/mece', label: 'MECE functionality' },
  { to: '/mvp', label: 'First MVP' },
  { to: '/trueforge', label: 'TrueForge vs LibreChat' },
  { to: '/trueforge-integrate', label: 'TrueForge integration' },
  { to: '/trueforge-mvp', label: 'TrueForge MVP' },
  { to: '/model-hub', label: '1 Model Hub' },
  { to: '/model-supply', label: 'Ollama is optional' },
  { to: '/perplexity', label: 'Perplexity' },
  { to: '/current-ui', label: 'v0.8.7 frontend' },
  { to: '/libraries', label: 'Libraries' },
  { to: '/three-layers', label: 'Canvas / LLM / Agents' },
  { to: '/canvas-videos', label: 'Canvas videos' },
  { to: '/local-device', label: 'Local laptop / desktop' },
  { to: '/ecc', label: 'ECC on LibreChat' },
  { to: '/device-modes', label: 'Offline / LAN / Cloud' },
  { to: '/workspace', label: '2 Chat Workspace' },
  { to: '/agents', label: '3 Agents' },
  { to: '/skills', label: '5 Skills' },
  { to: '/orchestration', label: '6 Multi-agent' },
  { to: '/knowledge', label: '7 Knowledge' },
  { to: '/tools', label: '8–9 MCP & Actions' },
  { to: '/production', label: '10–12 Production' },
  { to: '/sharing', label: '13 Sharing' },
  { to: '/governance', label: '14–18 Governance' },
  { to: '/architecture', label: '19–21 Architecture' },
  { to: '/takeaway', label: '22 Takeaway' },
  { to: '/videos', label: 'Video gaps & viewing' },
];

export default function App() {
  return (
    <div className="h-full grid grid-cols-[220px_1fr]">
      <aside className="border-r border-line bg-panel flex flex-col">
        <div className="px-4 py-5 border-b border-line">
          <div className="text-[11px] uppercase tracking-[0.2em] text-accent">LibreChat v0.8.7</div>
          <div className="text-base font-semibold mt-1 leading-snug">AI workspace layer — documentation brief</div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Not an AI model. One controlled front door to models, knowledge, tools and business systems.
          </p>
        </div>
        <nav className="p-2 space-y-0.5 flex-1 overflow-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `block rounded-md px-3 py-1.5 text-[13px] ${
                  isActive ? 'bg-cyan-500/15 text-accent' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 text-[11px] text-slate-500 border-t border-line">
          Content is only the shared LibreChat brief. Further parts can be added later.
        </div>
      </aside>
      <main className="min-w-0 overflow-hidden">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/mece" element={<MecePage />} />
          <Route path="/mvp" element={<MvpPage />} />
          <Route path="/trueforge" element={<TrueForgePage />} />
          <Route path="/trueforge-integrate" element={<TrueForgeIntegratePage />} />
          <Route path="/trueforge-mvp" element={<TrueForgeMvpPage />} />
          <Route path="/model-hub" element={<ModelHubPage />} />
          <Route path="/model-supply" element={<ModelSupplyPage />} />
          <Route path="/perplexity" element={<PerplexityPage />} />
          <Route path="/current-ui" element={<CurrentUiPage />} />
          <Route path="/libraries" element={<LibrariesPage />} />
          <Route path="/three-layers" element={<ThreeLayersPage />} />
          <Route path="/canvas-videos" element={<CanvasVideosPage />} />
          <Route path="/local-device" element={<LocalDevicePage />} />
          <Route path="/ecc" element={<EccPage />} />
          <Route path="/device-modes" element={<DeviceModesPage />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/orchestration" element={<OrchestrationPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/production" element={<ProductionPage />} />
          <Route path="/sharing" element={<SharingPage />} />
          <Route path="/governance" element={<GovernancePage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/takeaway" element={<TakeawayPage />} />
          <Route path="/videos" element={<VideosPage />} />
        </Routes>
      </main>
    </div>
  );
}

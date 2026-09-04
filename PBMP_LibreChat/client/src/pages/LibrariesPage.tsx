import { Link } from 'react-router-dom';
import { LIBRARIES } from '../content';
import { Bullets, Page, Panel, P } from '../components/Page';

export default function LibrariesPage() {
  return (
    <Page kicker="Two meanings of libraries" title={LIBRARIES.headline} lead={LIBRARIES.lead}>
      <Panel title="1. User-facing libraries inside LibreChat">
        <P>These are the reusable capability libraries a normal user or administrator works with.</P>
        <div className="overflow-auto rounded-lg border border-line mt-2">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">Library</th>
                <th className="px-3 py-2 font-medium">What it contains</th>
                <th className="px-3 py-2 font-medium">Business interpretation</th>
              </tr>
            </thead>
            <tbody>
              {LIBRARIES.userFacing.map((row) => (
                <tr key={row.library} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100">{row.library}</td>
                  <td className="px-3 py-2 text-slate-300">{row.contains}</td>
                  <td className="px-3 py-2 text-slate-400">{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>{LIBRARIES.toolLibraryImportant}</P>
        <P>{LIBRARIES.conceptual}</P>
      </Panel>

      <Panel title="2. The Tool Library contains several sub-libraries">
        <P>{LIBRARIES.toolSubs}</P>
        <P>{LIBRARIES.builtin}</P>
        <P>{LIBRARIES.mcp}</P>
        <P>{LIBRARIES.actions}</P>
      </Panel>

      <Panel title="3. Skills Library — separate from Tools">
        <P>{LIBRARIES.skillsSeparate}</P>
        <Bullets items={LIBRARIES.skillExamples} />
        <P>{LIBRARIES.skillsReuse}</P>
        <P>{LIBRARIES.skillsPicker}</P>
        <P>{LIBRARIES.whoHow}</P>
      </Panel>

      <Panel title="4. Agent Library / Marketplace">
        <P>{LIBRARIES.marketplace}</P>
        <div className="grid md:grid-cols-4 gap-3">
          {LIBRARIES.agentOrg.map((g) => (
            <div key={g.group} className="rounded-lg border border-line p-3 space-y-2">
              <div className="text-cyan-100 font-medium text-sm">{g.group}</div>
              <Bullets items={g.agents} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="5. Prompt Library">
        <P>LibreChat also supports reusable prompts. For example:</P>
        <Bullets items={LIBRARIES.promptExamples.map((p) => `“${p}”`)} />
        <P>{LIBRARIES.promptsSimpler}</P>
        <P>{LIBRARIES.hierarchy}</P>
        <P>{LIBRARIES.promptPerms}</P>
      </Panel>

      <Panel title="6. Knowledge/File Library — slightly different">
        <P>{LIBRARIES.knowledgeNotDam}</P>
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">File use</th>
                <th className="px-3 py-2 font-medium">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {LIBRARIES.fileUses.map((row) => (
                <tr key={row.use} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100">{row.use}</td>
                  <td className="px-3 py-2 text-slate-300">{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>{LIBRARIES.fileContext}</P>
      </Panel>

      <Panel title="7. Software/code libraries LibreChat is built from">
        <P>{LIBRARIES.codeIntro}</P>
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">LibreChat internal package/workspace</th>
                <th className="px-3 py-2 font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {LIBRARIES.packages.map((row) => (
                <tr key={row.pkg} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100 font-mono text-xs">{row.pkg}</td>
                  <td className="px-3 py-2 text-slate-300">{row.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>{LIBRARIES.softwareTree}</P>
      </Panel>

      <Panel title="The more important architecture for PBMP">
        <P>For what you are working on, use this terminology:</P>
        <div className="overflow-auto rounded-lg border border-line">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-slate-400">
              <tr>
                <th className="px-3 py-2 font-medium">PBMP / LibreChat concept</th>
                <th className="px-3 py-2 font-medium">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {LIBRARIES.pbmpTerms.map((row) => (
                <tr key={row.concept} className="border-t border-line">
                  <td className="px-3 py-2 text-cyan-100">{row.concept}</td>
                  <td className="px-3 py-2 text-slate-300">{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>{LIBRARIES.modelLibraryNote}</P>
        <P>{LIBRARIES.resourceArch}</P>
        <P>{LIBRARIES.punchline}</P>
        <P>
          Related:{' '}
          <Link className="text-accent underline" to="/agents">
            Agents
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/skills">
            Skills
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/tools">
            MCP & Actions
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/sharing">
            Marketplace
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/knowledge">
            Knowledge
          </Link>
          {' · '}
          <Link className="text-accent underline" to="/architecture">
            Architecture
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

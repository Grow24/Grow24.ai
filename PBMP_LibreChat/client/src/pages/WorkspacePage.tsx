import { WORKSPACE } from '../content';
import { Bullets, Page, Panel, P } from '../components/Page';

export default function WorkspacePage() {
  return (
    <Page kicker="Capability 2" title="The AI Chat Workspace" lead={WORKSPACE.moreThanQA}>
      <Panel title="Conversation functions">
        <Bullets items={WORKSPACE.conversation} />
      </Panel>
      <Panel title="Projects">
        <P>{WORKSPACE.projects.definition}</P>
        <P>
          Example: <span className="text-cyan-100">{WORKSPACE.projects.exampleName}</span> could contain:
        </P>
        <Bullets items={WORKSPACE.projects.exampleChats} />
      </Panel>
      <Panel title="Other workspace functions">
        <Bullets items={WORKSPACE.other} />
        <P>{WORKSPACE.temporary}</P>
      </Panel>
    </Page>
  );
}

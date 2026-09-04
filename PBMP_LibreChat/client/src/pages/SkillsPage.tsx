import { Link } from 'react-router-dom';
import { SKILLS } from '../content';
import { Bullets, Page, Panel, P } from '../components/Page';

export default function SkillsPage() {
  return (
    <Page
      kicker="Capability 4 · Skills"
      title="Skills — reusable organisational know-how"
      lead={SKILLS.definition}
    >
      <Panel>
        <P>{SKILLS.translation}</P>
      </Panel>
      <div className="grid md:grid-cols-2 gap-4">
        <Panel title={`Agent: ${SKILLS.exampleAgent}`}>
          <P>Skills available to it:</P>
          <Bullets items={SKILLS.exampleSkills} />
        </Panel>
        <Panel title="How skills are invoked">
          <Bullets items={SKILLS.invoke} />
          <P>{SKILLS.github}</P>
          <P>
            ECC’s SKILL.md library can potentially sync the same way:{' '}
            <Link className="text-accent underline" to="/ecc">
              ECC on LibreChat
            </Link>
            . A shared PBMP-AI-Skills Git repo can also feed TrueForge:{' '}
            <Link className="text-accent underline" to="/trueforge-integrate">
              LibreChat ↔ TrueForge
            </Link>
            .
          </P>
        </Panel>
      </div>
      <Panel title="Documented examples">
        <Bullets items={SKILLS.docsExamples} />
        <P>{SKILLS.meaning}</P>
        <P>
          Skill = Knows how; Tool = Can do. Full catalogue map:{' '}
          <Link className="text-accent underline" to="/libraries">
            libraries
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

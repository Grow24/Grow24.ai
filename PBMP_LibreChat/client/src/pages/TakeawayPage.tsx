import { Link } from 'react-router-dom';
import { BRIEF, EXECUTIVE_DESCRIPTION, FIFTH_PRODUCT, FOUR_PRODUCTS } from '../content';
import { Page, Panel, P } from '../components/Page';

export default function TakeawayPage() {
  return (
    <Page
      kicker="Section 22"
      title="Strategic takeaway"
      lead="From a business architecture viewpoint, LibreChat actually contains four products in one — and increasingly a fifth."
    >
      <Panel>
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="py-1 pr-4">Product hiding inside LibreChat</th>
              <th className="py-1">Equivalent concept</th>
            </tr>
          </thead>
          <tbody>
            {FOUR_PRODUCTS.map((r) => (
              <tr key={r.product} className="border-t border-line">
                <td className="py-2 pr-4 text-cyan-100">{r.product}</td>
                <td className="py-2 text-slate-300">{r.equivalent}</td>
              </tr>
            ))}
            <tr className="border-t border-line">
              <td className="py-2 pr-4 text-accent">{FIFTH_PRODUCT.layer}</td>
              <td className="py-2 text-slate-300">{FIFTH_PRODUCT.meaning}</td>
            </tr>
          </tbody>
        </table>
      </Panel>
      <Panel title="Do not categorise LibreChat simply as “Chatbot UI”">
        <P>{EXECUTIVE_DESCRIPTION}</P>
        <P>{BRIEF.notAClone}</P>
      </Panel>
      <Panel title="Implication for PBMP">
        <P>{BRIEF.pbmpNote}</P>
        <P>
          If useful, the logical next step is a LibreChat vs PBMP functionality map — Reuse as-is / Extend /
          PBMP should own / Not required. The LibreChat side of that map is now the{' '}
          <Link className="text-accent underline" to="/mece">
            MECE functionality table
          </Link>
          .
        </P>
        <P>
          Until that map exists, the{' '}
          <Link className="text-accent underline" to="/videos">
            recommended videos #1, #3 and #5
          </Link>{' '}
          are the most useful for answering: which parts of the PBMP AI layer we should build ourselves, versus
          simply use LibreChat for. One reuse idea already documented:{' '}
          <Link className="text-accent underline" to="/libraries">
            keep Agents, Skills, Tools, Prompts, Knowledge and Models as separately governed libraries
          </Link>
          . Stronger than “UI on an LLM”:{' '}
          <Link className="text-accent underline" to="/three-layers">
            LibreChat as workspace + gateway + agent runtime + generative UI
          </Link>
          . Porting engineering discipline without pretending to be Claude Code:{' '}
          <Link className="text-accent underline" to="/ecc">
            ECC Skills/Agents into LibreChat
          </Link>
          . Before investing in local-device and offline layers, run the{' '}
          <Link className="text-accent underline" to="/mvp">
            15–20 minute first MVP
          </Link>
          . After that, evaluate TrueForge as execution engine rather than LibreChat replacement:{' '}
          <Link className="text-accent underline" to="/trueforge">
            LibreChat vs TrueForge
          </Link>
          .
        </P>
      </Panel>
    </Page>
  );
}

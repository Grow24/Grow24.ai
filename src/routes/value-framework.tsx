import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/value-framework')({
  component: ValueFrameworkPage,
})

const sections = [
  'P&L (Income Statement): revenue growth, gross margin, operating income, net income',
  'Balance Sheet: cash, receivables, inventory, payables, debt, assets and liabilities',
  'Cash Flow: cash from operations, investing, financing, and ultimately free cash flow',
  'Narrative and trust artifacts: annual letter, quarterly updates, audit outcomes, risk posture, stakeholder confidence',
]

function ValueFrameworkPage() {
  return (
    <div className="min-h-screen bg-[#efefef] text-[#111] mt-[-70px]">
      <main className="mx-auto w-full max-w-[1400px] px-2 md:px-3 lg:px-4 py-8">
        <section className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Professional Value — What Is It, How It&apos;s Created, Measured, and Repeated
          </h1>

          <div className="flex justify-center py-2 md:py-4">
            <div className="relative w-full max-w-[760px] flex items-center justify-center">
              <div className="text-[#77a8e8] text-[72px] sm:text-[96px] md:text-[124px] leading-none font-medium tracking-wide select-none">
                VALUE
              </div>
              <span
                aria-hidden
                className="absolute right-[16%] bottom-[10%] text-3xl sm:text-4xl md:text-5xl rotate-12 select-none"
              >
                ✍️
              </span>
              <div className="absolute left-[14%] right-[14%] bottom-[2%] border-b-[6px] md:border-b-[7px] border-[#77a8e8] rounded-full" />
            </div>
          </div>

          <p className="text-2xl leading-relaxed">
            Professional value is one of those phrases that gets used everywhere—boardrooms, quarterly reviews,
            team meetings, even performance appraisals—yet people often mean different things by it.
          </p>
          <p className="text-2xl leading-relaxed">
            A CEO might think of value as cash flow and profitability. A functional head might think in terms of
            market share or pipeline. An employee might think of value as completing meaningful work that moves
            outcomes forward.
          </p>
          <p className="text-2xl leading-relaxed">
            All of those are valid lenses. The useful question is: <strong>how do these lenses connect?</strong>
            {' '}How does the work done across teams become the kinds of outcomes that appear in company-level
            reality—financial results, resilience, trust, and momentum?
          </p>
          <p className="text-2xl leading-relaxed">
            A practical way to answer that is to treat value not as a vague concept, but as something that is
            {' '}<strong>produced by execution of value chains.</strong>
          </p>
        </section>

        <section className="pt-12 space-y-6">
          <h2 className="text-5xl font-bold">1) What &quot;Professional Value&quot; actually means</h2>
          <p className="text-2xl">At the most universal level, professional value means <strong>improving the organization&apos;s outcomes at a desired point in time.</strong></p>
          <p className="text-2xl">Those outcomes show up in the organization&apos;s most &quot;official&quot; documents and decisions:</p>
          <ul className="list-disc pl-12 space-y-4 text-2xl">
            {sections.map((item) => (
              <li key={item}><strong>{item.split(':')[0]}:</strong>{item.substring(item.indexOf(':') + 1)}</li>
            ))}
          </ul>
        </section>

        <section className="pt-12 space-y-6">
          <h2 className="text-5xl font-bold">2) Value is produced by execution of Value Chains</h2>
          <p className="text-2xl">A <strong>value chain</strong> is a logical, sequential grouping of processes that moves something from <strong>abstract → tangible → measurable.</strong></p>
          <p className="text-2xl">Think of familiar examples:</p>
          <ul className="list-disc pl-12 space-y-4 text-2xl">
            <li><strong>Order-to-Cash:</strong> order captured → fulfilled → invoiced → cash collected</li>
            <li><strong>Idea-to-Market:</strong> idea generated → specified → designed → built → launched</li>
            <li><strong>Source-to-Receive:</strong> supplier selected → PO issued → inbound logistics → goods received and accepted</li>
            <li><strong>Issue-to-Resolution:</strong> issue logged → diagnosed → resolved → closed with prevention loop</li>
          </ul>
        </section>

        <section className="pt-12 space-y-6">
          <h2 className="text-5xl font-bold">3) The backbone inside every serious value chain: Goal → Strategy → Objectives → Plan → Projects → Operations</h2>
          <p className="text-2xl">Across industries, the most consistent structure for professional work is the same backbone:</p>
          <ol className="list-decimal pl-12 space-y-4 text-2xl">
            <li><strong>Goal</strong> — What outcome do we want, and why does it matter?</li>
            <li><strong>Strategy</strong> — Where will we play and how will we win?</li>
            <li><strong>Objectives</strong> — What measurable outcomes will prove the strategy is working?</li>
            <li><strong>Plan</strong> — What will we do, when, with what resources?</li>
            <li><strong>Projects</strong> — When new capabilities must be built or upgraded</li>
            <li><strong>Operations</strong> — The steady-state running of processes where adoption happens and value is accrued</li>
          </ol>
        </section>

        <section className="pt-12 space-y-6">
          <h2 className="text-5xl font-bold">4) Dependency is not bureaucracy — it&apos;s how value chains stay aligned</h2>
          <p className="text-2xl">A practical dependency pattern is:</p>
          <ol className="list-decimal pl-12 space-y-4 text-2xl">
            <li><strong>Corporate first:</strong> Corporate Goal2Plan</li>
            <li><strong>Then Functions:</strong> Marketing Goal2Plan, Sales Goal2Plan, Finance Goal2Plan, Supply Chain Goal2Plan</li>
            <li><strong>Then Programs:</strong> cross-functional programs like ESG, Business Transformation, Digital Modernization</li>
            <li><strong>Portfolio governs Projects:</strong> selecting and funding the work that builds capabilities</li>
            <li><strong>Projects Plan2Operations:</strong> ensures new capabilities actually land in operations</li>
            <li><strong>Operations:</strong> day-to-day execution producing measurable outcomes</li>
          </ol>
        </section>

        <section className="pt-12 space-y-6">
          <h2 className="text-5xl font-bold">5) The Corporate lens: professional value as company outcomes</h2>
          <p className="text-2xl">From a corporate perspective, value is the ability to make the organization stronger and more sustainable.</p>
          <ul className="list-disc pl-12 space-y-4 text-2xl">
            <li>the corporate goal and supporting points</li>
            <li>a few enterprise metrics that define success</li>
            <li>targets and guardrails (what must improve and what must not break)</li>
            <li>budget and capacity boundaries</li>
            <li>governance cadence (how the organization reviews progress and adapts)</li>
          </ul>
        </section>

        <section className="pt-12 space-y-6">
          <h2 className="text-5xl font-bold">6) The Functional lens: value is created by contributing to Corporate outcomes</h2>
          <p className="text-2xl">Marketing creates professional value when its outputs reliably feed the next value chains downstream, such as Sales and Finance.</p>
          <ul className="list-disc pl-12 space-y-4 text-2xl">
            <li><strong>Insight-to-Positioning:</strong> learn what matters to the market and define a message that resonates</li>
            <li><strong>Brand-to-Demand:</strong> build trust and preference so demand becomes easier and cheaper</li>
            <li><strong>Campaign-to-Response:</strong> execute campaigns that generate measurable responses</li>
            <li><strong>Response-to-Qualified Demand:</strong> qualify, nurture, and hand off demand in a sales-ready way</li>
            <li><strong>Sales Prospect-to-Order:</strong> convert qualified demand into orders</li>
            <li><strong>Finance Quote-to-Cash:</strong> invoice, collect, and turn booked revenue into actual cash</li>
          </ul>
        </section>

        <section className="pt-12 space-y-6">
          <img
            src="/value-framework/Website_16_-ae42d8ae-47f4-4fdb-9540-e8823f028e22.png"
            alt="Sales ladders up to corporate value"
            className="w-full h-auto block rounded-sm"
            loading="lazy"
            draggable={false}
          />
          <img
            src="/value-framework/Website_15_-34707049-4aad-46c2-be92-29a462e6cd0d.png"
            alt="Marketing ladders up to corporate value"
            className="w-full h-auto block rounded-sm"
            loading="lazy"
            draggable={false}
          />
        </section>

        <section className="pt-12 space-y-6">
          <h2 className="text-5xl font-bold">7) Projects and Operations: where value becomes repeatable</h2>
          <p className="text-2xl">Professional value becomes durable when the organization can <strong>repeat</strong> value creation with less friction and less rework.</p>
          <ul className="list-disc pl-12 space-y-4 text-2xl">
            <li><strong>Projects</strong> that create or upgrade capability</li>
            <li><strong>Operations</strong> that run those capabilities consistently, with adoption, monitoring, and continuous improvement</li>
          </ul>

          <h2 className="text-5xl font-bold pt-4">8) Measuring value: leading indicators and end metrics should connect</h2>
          <ul className="list-disc pl-12 space-y-4 text-2xl">
            <li><strong>End metrics</strong> live in corporate reality (financial statements, risk posture, trust outcomes)</li>
            <li><strong>Leading indicators</strong> live inside value chains (conversion rates, cycle times, defect rates, forecast accuracy)</li>
          </ul>
        </section>

        <section className="pt-12 space-y-6">
          <h2 className="text-5xl font-bold">9) Repeating value: the loop that matters</h2>
          <p className="text-2xl">Professional value is not a one-time achievement. It is a cycle:</p>
          <ul className="list-disc pl-12 space-y-4 text-2xl">
            <li>define the goal</li>
            <li>choose the strategy</li>
            <li>set objectives</li>
            <li>create the plan</li>
            <li>build capabilities through projects when needed</li>
            <li>run operations with adoption</li>
            <li>measure outcomes</li>
            <li>learn and improve</li>
            <li>repeat</li>
          </ul>
        </section>

        <section className="pt-12 pb-16 space-y-6">
          <h2 className="text-5xl font-bold">Closing thought</h2>
          <p className="text-2xl">A practical way to think about professional value is this:</p>
          <p className="text-2xl font-bold leading-relaxed">
            If you want value, identify the value chains that produce it, ensure those chains are aligned to Goal → Strategy → Objectives → Plan → Projects → Operations, and enforce the right dependency order—Corporate first, then Functions, then Programs—so execution stays coherent.
          </p>
          <p className="text-2xl">That is how value becomes created, measured, and repeated—not as abstract ambition, but as an operational reality.</p>
        </section>
      </main>
    </div>
  )
}

export default ValueFrameworkPage

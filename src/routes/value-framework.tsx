import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/value-framework')({
  component: ValueFrameworkPage,
})

function ValueFrameworkPage() {
  return (
    <div className="min-h-screen bg-white text-black pt-24 sm:pt-28">
      <main className="max-w-[1700px] mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <section className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold leading-[1.08] mb-4">
            Professional Value - What Is It, How It&apos;s Created, Measured, and Repeated
          </h1>
          <div className="flex justify-center mb-5">
            <img
              src="/value-framework.png"
              alt="Value Framework"
              className="w-full max-w-[740px] h-auto"
            />
          </div>
          <p className="text-[28px] leading-[1.45] mb-3">
            Professional value is one of those phrases that gets used everywhere-boardrooms, quarterly reviews, team meetings,
            even performance appraisals-yet people often mean different things by it. A CEO might think of value as cash flow and
            profitability. A functional head might think in terms of market share or pipeline. An employee might think of value as
            completing meaningful work that moves outcomes forward.
          </p>
          <p className="text-[28px] leading-[1.45] mb-3">
            All of those are valid lenses. The useful question is:
            {' '}
            <span className="font-bold">how do these lenses connect?</span>
            {' '}
            How does the work done across teams become the kinds of outcomes that
            appear in company-level reality-financial results, resilience, trust, and momentum?
          </p>
          <p className="text-[28px] leading-[1.45]">
            A practical way to answer that is to treat value not as a vague concept, but as something that is
            {' '}
            <span className="font-bold">produced by execution of value chains.</span>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-[52px] font-bold leading-tight mb-3">1) What &quot;Professional Value&quot; actually means</h2>
          <p className="text-[28px] leading-[1.45] mb-3">
            At the most universal level, professional value means
            {' '}
            <span className="font-bold">improving the organization&apos;s outcomes at a desired point in time.</span>
          </p>
          <p className="text-[28px] leading-[1.45] mb-3">
            Those outcomes show up in the organization&apos;s most &quot;official&quot; documents and decisions:
          </p>
          <ul className="list-disc pl-10 space-y-2 text-[28px] leading-[1.45]">
            <li><span className="font-bold">P&amp;L (Income Statement):</span> revenue growth, gross margin, operating income, net income</li>
            <li><span className="font-bold">Balance Sheet:</span> cash, receivables, inventory, payables, debt, assets and liabilities</li>
            <li><span className="font-bold">Cash Flow:</span> cash from operations, investing, financing, and ultimately free cash flow</li>
            <li><span className="font-bold">Narrative and trust artifacts:</span> annual letter, quarterly updates, audit outcomes, risk posture, stakeholder confidence</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-[52px] font-bold leading-tight mb-3">2) Value is produced by execution of Value Chains</h2>
          <p className="text-[28px] leading-[1.45] mb-3">
            A
            {' '}
            <span className="font-bold">value chain</span>
            {' '}
            is a logical, sequential grouping of processes that moves something from
            {' '}
            <span className="font-bold">abstract -&gt; tangible -&gt; measurable.</span>
          </p>
          <p className="text-[28px] leading-[1.45] mb-2">Think of familiar examples:</p>
          <ul className="list-disc pl-10 space-y-2 text-[28px] leading-[1.45] mb-4">
            <li><span className="font-bold">Order-to-Cash:</span> order captured -&gt; fulfilled -&gt; invoiced -&gt; cash collected</li>
            <li><span className="font-bold">Idea-to-Market:</span> idea generated -&gt; specified -&gt; designed -&gt; built -&gt; launched</li>
            <li><span className="font-bold">Source-to-Receive:</span> supplier selected -&gt; PO issued -&gt; inbound logistics -&gt; goods received and accepted</li>
            <li><span className="font-bold">Issue-to-Resolution:</span> issue logged -&gt; diagnosed -&gt; resolved -&gt; closed with prevention loop</li>
          </ul>
          <p className="text-[28px] leading-[1.45] mb-3">
            These are not just process maps. They are
            {' '}
            <span className="font-bold">value production lines.</span>
            {' '}
            Each process in the chain produces an output that
            becomes the input to the next process, and the chain continues until value becomes measurable.
          </p>
          <p className="text-[28px] leading-[1.45]">
            If you want to understand professional value in a way that is usable-especially across industries and functions-this is one
            of the best anchors:
            {' '}
            <span className="font-bold">value chains produce value through execution.</span>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-[52px] font-bold leading-tight mb-3">3) The backbone inside every serious value chain: Goal -&gt; Strategy -&gt; Objectives -&gt; Plan -&gt; Projects -&gt; Operations</h2>
          <p className="text-[28px] leading-[1.45] mb-2">
            Across industries, the most consistent structure for professional work is the same backbone:
          </p>
          <ol className="list-decimal pl-10 space-y-2 text-[28px] leading-[1.45] mb-4">
            <li><span className="font-bold">Goal</span> - What outcome do we want, and why does it matter?</li>
            <li><span className="font-bold">Strategy</span> - Where will we play and how will we win?</li>
            <li><span className="font-bold">Objectives</span> - What measurable outcomes will prove the strategy is working?</li>
            <li><span className="font-bold">Plan</span> - What will we do, when, with what resources?</li>
            <li><span className="font-bold">Projects</span> - When new capabilities must be built or upgraded (this step is optional, but often decisive)</li>
            <li><span className="font-bold">Operations</span> - The steady-state running of processes where adoption happens and value is accrued</li>
          </ol>
          <p className="text-[28px] leading-[1.45] mb-3">
            This sequence matters because value doesn&apos;t become real just because a goal is written down. Value becomes real when the
            goal is translated into strategy, then into measurable objectives, then into a plan, and finally executed through
            operations-sometimes with projects bridging capability gaps.
          </p>
          <p className="text-[28px] leading-[1.45] mb-2">A simple rule makes it clear:</p>
          <ul className="list-disc pl-10 space-y-2 text-[28px] leading-[1.45]">
            <li>If the needed capability already exists, we can move quickly into <span className="font-bold">Operations</span> (with change management).</li>
            <li>If the capability does not exist, <span className="font-bold">Projects</span> must build it first, then hand over to Operations.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-[52px] font-bold leading-tight mb-3">4) Dependency is not bureaucracy - it&apos;s how value chains stay aligned</h2>
          <p className="text-[28px] leading-[1.45] mb-3">
            Organizations don&apos;t run one value chain in isolation. They run dozens, often hundreds, at the same time.
            The work stays coherent when value chains have the right dependency order.
          </p>
          <p className="text-[28px] leading-[1.45] mb-2">A practical dependency pattern is:</p>
          <ol className="list-decimal pl-10 space-y-2 text-[28px] leading-[1.45] mb-4">
            <li><span className="font-bold">Corporate first:</span> Corporate Goal2Plan</li>
            <li><span className="font-bold">Then Functions:</span> Marketing Goal2Plan, Sales Goal2Plan, Finance Goal2Plan, Supply Chain Goal2Plan, and so on</li>
            <li><span className="font-bold">Then Programs:</span> cross-functional programs like ESG, Business Transformation, Digital Modernization</li>
            <li><span className="font-bold">Portfolio governs Projects:</span> selecting and funding the work that builds capabilities</li>
            <li><span className="font-bold">Projects Plan2Operations:</span> ensures new capabilities actually land in operations</li>
            <li><span className="font-bold">Operations:</span> is where day-to-day execution produces the measurable outcomes</li>
          </ol>
          <p className="text-[28px] leading-[1.45] mb-2">Why does this dependency matter?</p>
          <p className="text-[28px] leading-[1.45] mb-2">
            Because without it, functions may optimize locally but not collectively. Marketing might chase volume, Sales might
            discount to close, Finance might tighten controls, Supply Chain might cut inventory, Customer Service might focus on speed-all
            reasonable on their own. But without a shared direction and constraints, the combined result may not improve the company&apos;s
            actual end outcomes.
          </p>
          <p className="text-[28px] leading-[1.45]">
            The dependency order prevents that. It creates a consistent structure so every function can contribute in a way that ladders up.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-[52px] font-bold leading-tight mb-3">5) The Corporate lens: professional value as company outcomes</h2>
          <p className="text-[28px] leading-[1.45] mb-3">
            From a corporate perspective, value is the ability to make the organization stronger and more sustainable.
          </p>
          <p className="text-[28px] leading-[1.45] mb-3">
            Corporate value chains exist to convert direction into plans that other parts of the organization can execute.
            The most important output at this level is not a &quot;strategy document&quot; in isolation-it&apos;s a plan envelope that drives execution.
          </p>
          <p className="text-[28px] leading-[1.45] mb-2">That envelope includes:</p>
          <ul className="list-disc pl-10 space-y-2 text-[28px] leading-[1.45] mb-4">
            <li>the corporate goal and supporting points</li>
            <li>a few enterprise metrics that define success</li>
            <li>targets and guardrails (what must improve and what must not break)</li>
            <li>budget and capacity boundaries</li>
            <li>governance cadence (how the organization reviews progress and adapts)</li>
          </ul>
          <p className="text-[28px] leading-[1.45]">
            Corporate is the source of alignment. It sets the frame that other value chains operate within.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-[52px] font-bold leading-tight mb-3">6) The Functional lens: value is created by contributing to Corporate outcomes</h2>
          <p className="text-[28px] leading-[1.45] mb-3">
            Functional value is easiest to understand when we treat it as a ladder, not a separate world.
          </p>
          <p className="text-[28px] leading-[1.45] mb-3">Let&apos;s use Marketing as a clean example.</p>
          <p className="text-[28px] leading-[1.45] mb-3">
            Marketing is often measured with leading indicators-reach, traffic, engagement, leads. Those are useful, but they are not the
            end of the story.
          </p>
          <p className="text-[28px] leading-[1.45] mb-2">
            Marketing creates professional value when its outputs reliably feed the next value chains downstream, such as Sales and Finance.
            A simplified ladder looks like this:
          </p>
          <ul className="list-disc pl-10 space-y-2 text-[28px] leading-[1.45] mb-4">
            <li><span className="font-bold">Insight-to-Positioning:</span> learn what matters to the market and define a message that resonates</li>
            <li><span className="font-bold">Brand-to-Demand:</span> build trust and preference so demand becomes easier and cheaper</li>
            <li><span className="font-bold">Campaign-to-Response:</span> execute campaigns that generate measurable responses</li>
            <li><span className="font-bold">Response-to-Qualified Demand:</span> qualify, nurture, and hand off demand in a sales-ready way</li>
            <li><span className="font-bold">Sales Prospect-to-Order:</span> convert qualified demand into orders</li>
            <li><span className="font-bold">Finance Quote-to-Cash:</span> invoice, collect, and turn booked revenue into actual cash</li>
          </ul>
          <p className="text-[28px] leading-[1.45] mb-5">
            Marketing&apos;s professional value, therefore, is not simply &quot;running campaigns.&quot; It is enabling predictable downstream conversion
            and improving the economics of growth-conversion rates, discounting discipline, customer acquisition cost, and ultimately
            durable revenue.
          </p>
          <div className="overflow-hidden rounded-xl border border-slate-300">
            <img
              src="/value-framework-marketing-map.png"
              alt="Professional value marketing ladder map"
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-[52px] font-bold leading-tight mb-3">7) Projects and Operations: where value becomes repeatable</h2>
          <p className="text-[28px] leading-[1.45] mb-3">
            A common challenge in organizations is that value is sometimes treated as a one-time effort: a transformation program,
            a rollout, a big launch.
          </p>
          <p className="text-[28px] leading-[1.45] mb-3">
            Those are important, but professional value becomes durable when the organization can
            {' '}
            <span className="font-bold">repeat</span>
            {' '}
            value creation with less friction and less rework.
          </p>
          <p className="text-[28px] leading-[1.45] mb-2">That repeatability comes from two things:</p>
          <ul className="list-disc pl-10 space-y-2 text-[28px] leading-[1.45] mb-4">
            <li><span className="font-bold">Projects</span> that create or upgrade capability (new systems, new training, new processes, new infrastructure)</li>
            <li><span className="font-bold">Operations</span> that run those capabilities consistently, with adoption, monitoring, and continuous improvement</li>
          </ul>
          <p className="text-[28px] leading-[1.45]">
            If operations aren&apos;t designed to absorb the change, value stalls. If projects don&apos;t build what operations actually needs, value
            also stalls. The connection between Projects Plan2Operations is what closes that gap.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-[52px] font-bold leading-tight mb-3">8) Measuring value: leading indicators and end metrics should connect</h2>
          <p className="text-[28px] leading-[1.45] mb-3">
            Professional value measurement becomes simpler when you accept a basic structure:
          </p>
          <ul className="list-disc pl-10 space-y-2 text-[28px] leading-[1.45] mb-4">
            <li><span className="font-bold">End metrics</span> live in corporate reality (financial statements, risk posture, trust outcomes)</li>
            <li><span className="font-bold">Leading indicators</span> live inside value chains (conversion rates, cycle times, defect rates, forecast accuracy, stockouts, retention signals)</li>
          </ul>
          <p className="text-[28px] leading-[1.45] mb-2">
            These should not be tracked as unrelated dashboards. They need an explicit bridge:
          </p>
          <p className="text-[28px] leading-[1.45]">
            metric by metric, which leading indicator influences which end metric, over what time lag, and through which process.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-[52px] font-bold leading-tight mb-3">9) Repeating value: the loop that matters</h2>
          <p className="text-[28px] leading-[1.45] mb-2">Professional value is not a one-time achievement. It is a cycle:</p>
          <ul className="list-disc pl-10 space-y-2 text-[28px] leading-[1.45] mb-4">
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
          <p className="text-[28px] leading-[1.45] mb-5">
            When an organization can run this loop with clarity and consistency, it becomes much harder for competitors to catch up-not
            because of one brilliant strategy, but because of disciplined execution through value chains.
          </p>
          <div className="overflow-hidden rounded-xl border border-slate-300">
            <img
              src="/value-framework-sales-map.png"
              alt="Professional value sales ladder map"
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>
        </section>

        <section className="pb-8">
          <h2 className="text-[52px] font-bold leading-tight mb-3">Closing thought</h2>
          <p className="text-[28px] leading-[1.45] mb-3">A practical way to think about professional value is this:</p>
          <p className="text-[32px] font-bold leading-[1.35] mb-3">
            If you want value, identify the value chains that produce it, ensure those chains are aligned to Goal -&gt; Strategy -&gt;
            Objectives -&gt; Plan -&gt; Projects -&gt; Operations, and enforce the right dependency order-Corporate first, then Functions, then
            Programs-so execution stays coherent.
          </p>
          <p className="text-[28px] leading-[1.45]">
            That is how value becomes created, measured, and repeated-not as abstract ambition, but as an operational reality.
          </p>
        </section>
      </main>
    </div>
  )
}

export default ValueFrameworkPage

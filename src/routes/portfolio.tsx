import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/portfolio')({
  component: PortfolioPage,
})

function PortfolioPage() {
  const [isActionsOpen, setIsActionsOpen] = useState(true)
  const [isShareOpen, setIsShareOpen] = useState(true)
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(true)

  return (
    <div
      className="min-h-screen text-[#202124] mt-[-70px]"
      style={{
        fontFamily: '"Henderson Sans", Arial, "Helvetica Neue", Helvetica, sans-serif',
      }}
    >
      <main className="mx-auto w-full max-w-[1577px] px-2 md:px-4 pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px] gap-8 relative">
          {!isActionsOpen && (
            <button
              type="button"
              onClick={() => setIsActionsOpen(true)}
              className="hidden xl:flex absolute -right-14 top-4 w-7 h-7 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-500 shadow-sm"
              aria-label="Open actions section"
            >
              +
            </button>
          )}

          <article className="relative space-y-8 max-w-[980px]">
            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h1 className="text-[48px] leading-[1.08] font-semibold text-slate-900">
                Portfolio Management: How Leaders Choose the Right Change, Not Just More Change
              </h1>
            </section>

            <section className="relative pt-2">
              <div className="overflow-hidden rounded-[2px] relative border border-slate-200/70">
                <img
                  src="/portfolio-hero6.png"
                  alt="Portfolio management visual"
                  className="w-full h-auto block object-contain bg-white"
                />
              </div>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Executive Summary</h2>
              <p>Most organizations do not struggle because they lack ideas. They struggle because they are trying to do too many things at once, with limited money, limited leadership attention, limited execution capacity, and uneven clarity on what really matters. That is why Portfolio Management matters.</p>
              <p>Portfolio Management is the discipline of choosing, governing, balancing, and continuously optimizing the right mix of change initiatives so the organization can achieve strategic objectives, realize value, balance risk, and use scarce resources well. It is not just a list of projects, and it is not only a reporting mechanism for the PMO. It is the management system that connects strategy to controlled execution.</p>
              <p>For CEOs and CXOs, Portfolio Management brings clarity to investment choices, trade-offs, sequencing, and value realization. For function leaders, it creates transparency on how initiatives are evaluated and prioritized. For the Portfolio / Program / Project Office, it provides the structure for governance, monitoring, balancing, and course correction. The PMI standard frames portfolio management as the centralized management of one or more portfolios to achieve strategic objectives, and emphasizes strategic alignment, governance, capacity and capability, stakeholder engagement, value, and risk as core concerns.</p>
              <p>In PBMP, Portfolio Management sits in the Business Mgmt layer as the mechanism that translates goals, strategies, objectives, and plans into governed change initiatives, which then create new or expanded capability and ultimately improve operations and value realization. That makes it one of the most important bridges between intent and results.</p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">The Blog</h2>
              <p>Every leadership team says some version of the same thing: there is too much to do, not enough capacity, and too much pressure to move fast. One function wants technology modernization. Another wants customer growth initiatives. A third wants compliance and controls strengthened. Operations wants stability. Finance wants discipline. Everyone believes their work is important, and often they are right.</p>
              <p>The problem is not that the organization has bad ideas. The problem is that it cannot treat all ideas as equally urgent.</p>
              <p>That is where Portfolio Management enters.</p>
              <p className="font-semibold text-slate-900">[Insert Image 1 here - Executive summary infographic on Portfolio Management]</p>
              <p>Image 1: Executive summary view showing what Portfolio Management is, where it fits in the business flow, what a portfolio contains, the core decision loop, six major management areas, and the overall takeaway.</p>
              <p>Portfolio Management is the business discipline of selecting and governing the right mix of projects, programs, sub-portfolios, and related change work so the organization can achieve strategic objectives. PMI defines a portfolio as a collection of projects, programs, subsidiary portfolios, and operations managed as a group to achieve strategic objectives, and defines portfolio management as the centralized management of one or more portfolios to achieve those objectives.</p>
              <p>This is an important distinction. Portfolio Management is not just about "managing all current projects." It is about deciding which initiatives should exist in the first place, which should be accelerated, which should be delayed, which should be merged, and which should be stopped. It is about making deliberate choices under conditions of scarcity.</p>
              <p>A good leadership team does not merely ask, "How many projects are in flight?" It asks sharper questions:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>Which initiatives are most aligned to strategy?</li>
                <li>Which ones create the highest value?</li>
                <li>Which ones consume disproportionate capacity?</li>
                <li>Which ones expose us to risk?</li>
                <li>Which ones should not be funded right now?</li>
                <li>Which ones must move from change into stable operations?</li>
              </ul>
              <p>That is why Portfolio Management is needed. Strategy alone does not execute itself. An annual plan alone does not resolve collisions between functions. A PMO dashboard alone does not tell leaders whether the enterprise is investing in the right mix of change. Portfolio Management provides the mechanism for those decisions. The standard explicitly positions portfolio management as aligned to organizational strategy and concerned with identifying, categorizing, evaluating, selecting, prioritizing, optimizing, authorizing, monitoring, controlling, and terminating portfolio components.</p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <img
                src="/portfolio-image-2.png"
                alt="Image 2 - Portfolio structure and what a portfolio contains"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
              <p>For many executives, one useful mental shift is this: a portfolio is not the same as a program, and it is not the same as a project. A project delivers a defined output. A program coordinates related work to realize benefits. A portfolio sits above them and decides the overall investment mix in service of strategy. The components inside a portfolio may be related or unrelated, but they compete for limited resources and are evaluated in terms of strategic contribution and value.</p>
              <p>Seen this way, Portfolio Management is really the bridge between strategy and execution.</p>
              <p>A simple business flow makes that visible:</p>
              <p className="font-semibold text-slate-900">Goal -&gt; Strategy -&gt; Plan -&gt; Portfolio -&gt; Programs / Projects -&gt; Operations / Outcomes / Value</p>
              <p>This is not just a neat diagram. It reflects the practical role of portfolio decision-making. Once leadership defines where the organization wants to go, Portfolio Management helps determine which initiatives deserve resources, oversight, and attention. It sits between planning and execution, while also continuing throughout execution as a governance and optimization capability.</p>
              <img
                src="/portfolio-image-3.png"
                alt="Image 3 - Where Portfolio fits in the business flow"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <p>In your PBMP architecture, this positioning becomes even stronger. Portfolio Management belongs primarily in the Business Mgmt layer. It connects the intention-triggered workflow, goals, strategies, objectives, plans, portfolios/programs/projects, operating model, resources, performance management, and business operations. It is therefore not a narrow PMO tool. It is the connected-business mechanism that turns strategic intent into governed change. It also links directly to Change Mgmt, which means it governs not only project throughput but the enterprise's overall capacity to absorb change.</p>
              <p className="font-semibold text-slate-900">[Insert Image 4 here - PBMP overall architecture]</p>
              <p>Image 4: PBMP architecture showing Portfolio Management in the Business Mgmt layer and its relationships to capability, solution, application, and service layers.</p>
              <p>Once leaders understand where Portfolio Management sits, the next question is: what does it actually do?</p>
              <p>At its core, Portfolio Management is a repeatable cycle of executive decisions. The logic is straightforward: identify candidate initiatives, categorize them, evaluate them, select the right ones, prioritize them, balance them, authorize them, monitor them, optimize the mix, and transition or terminate components when needed. This reflects the ongoing life-cycle view in the standard, where portfolio management is not a one-time annual exercise but a continuing process of review, optimization, and control.</p>
              <p className="font-semibold text-slate-900">[Insert Image 5 here - Core portfolio decision loop]</p>
              <p>Image 5: Identify -&gt; Categorize -&gt; Evaluate -&gt; Select -&gt; Prioritize -&gt; Balance -&gt; Authorize -&gt; Monitor -&gt; Optimize -&gt; Transition / Terminate.</p>
              <p>This decision loop matters because leadership is always balancing competing forces. The organization wants value, but must manage risk. It wants ambition, but has limited capacity. It wants strategic fit, but also speed. It wants innovation, but cannot ignore regulatory or operational obligations. Portfolio Management is the discipline that balances these tensions deliberately instead of letting them collide informally.</p>
              <p>That is why the standard's major management areas are so useful. Good Portfolio Management is not a single committee meeting. It rests on six major areas: strategic management, governance, capacity and capability management, stakeholder engagement, value management, and risk management. These are reflected directly in the PMI structure of the standard.</p>
              <img
                src="/portfolio-image-6.png"
                alt="Image 6 - Six major management areas in portfolio management"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
              <p>Strategic management ensures the initiative mix remains aligned to the organization's goals and direction. Governance clarifies who decides, who reviews, who approves, and who escalates. Capacity and capability management address a question that executives often underestimate: not just "Do we want this?" but "Can we actually deliver this well?" Stakeholder engagement keeps leadership, functions, sponsors, and delivery teams aligned. Value management keeps attention on the business outcome rather than only schedule compliance. Risk management looks across the whole investment mix, not only isolated project risks. The standard treats all of these as central to effective portfolio management.</p>
              <p>A practical way to begin Portfolio Management is simpler than many organizations assume.</p>
              <p>Start with strategic intent. Be clear on goals, strategies, objectives, and plan themes. Then build a single enterprise-wide inventory of initiatives: projects, programs, mandatory work, transformation work, capability-building efforts, and major operations-related change. Next, define a common set of evaluation criteria. These might include strategic fit, expected value, urgency, regulatory requirement, customer impact, dependency, risk, and capacity consumption. Then categorize and score initiatives on a common basis.</p>
              <p>After that comes the most leadership-intensive part: balancing the portfolio. This means deciding across tensions such as short-term versus long-term, growth versus run-the-business, mandatory versus discretionary, value versus risk, and ambition versus execution capacity. Once that is done, governance cadence matters. Monthly portfolio reviews, quarterly rebalancing, exception-based escalations, and explicit stop/defer/resequence decisions are usually far more effective than passive status collection.</p>
              <p>Finally, track value, not just activity. The standard's value management emphasis is especially important here: expected value needs to be negotiated, maximized, assured, realized, measured, and reported. A portfolio that delivers many projects but weak value is not a high-performing portfolio.</p>
              <p className="font-semibold text-slate-900">[Insert Image 7 here - Value, risk, strategic fit, and resource capacity balancing]</p>
              <p>Image 7: Visual balancing of Value, Risk, Strategic Fit, and Resource Capacity.</p>
            </section>

            <section className="border-t border-b border-slate-300 pt-8 pb-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <p>A simple example makes this concrete.</p>
              <p>Imagine a mid-sized manufacturing company with 22 active initiatives. These include an ERP upgrade, plant automation, CRM rollout, cybersecurity improvements, ESG reporting, quality analytics, procurement digitization, a dealer portal, and a customer complaint platform. Each initiative has a sponsor. Each sponsor believes their work is urgent. Technology capacity is stretched. Plant leaders want faster execution. Finance wants cost control. Compliance deadlines are approaching. Leadership has no single view of strategic fit, value, dependencies, and resource impact.</p>
              <p>Without Portfolio Management, all 22 initiatives remain "important," and the organization slowly overloads itself.</p>
              <p>With Portfolio Management, leadership takes a different path. First, the initiatives are grouped: mandatory, growth, efficiency, risk reduction, and capability building. Next, they are evaluated against strategy, expected value, urgency, dependencies, and capacity consumption. Then leadership makes explicit choices. Six initiatives become immediate priorities. Five are sequenced for the next wave. Four are merged because they overlap. Three are paused because they consume too much scarce capability for too little near-term value. Two are terminated. Two are shifted into normal operations rather than treated as ongoing change.</p>
              <p>Nothing magical happened. The organization simply moved from unmanaged initiative accumulation to governed choice.</p>
              <p>That is the real promise of Portfolio Management.</p>
              <p>For the CEO and CXO, it creates a decision framework for where the enterprise will place its scarce bets. For function leaders, it makes trade-offs transparent and fairer. For the Portfolio / Program / Project Office, it provides a disciplined basis for evaluation, sequencing, governance, and monitoring. And inside PBMP, it becomes even more powerful because it links strategy, capability, solution evolution, operational absorption, and value realization inside one connected architecture.</p>
              <p>The simplest way to remember it is this:</p>
              <p>Portfolio Management is not about having more projects under observation. It is about helping leadership choose the right change, sequence it intelligently, govern it properly, and realize value with discipline. PMI's standard makes clear that portfolio management exists to align investments and work with strategic objectives, and your PBMP architecture gives that discipline a larger enterprise home.</p>
              <p>In a world of constant pressure, limited capacity, and competing priorities, that is not administrative overhead. It is leadership discipline.</p>
            </section>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-3">
              {isActionsOpen && (
                <div className="rounded-2xl border border-slate-300 bg-white p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</span>
                    <button
                      type="button"
                      onClick={() => setIsActionsOpen(false)}
                      className="text-slate-500"
                      aria-label="Close actions section"
                    >
                      ×
                    </button>
                  </div>
                  <button className="w-full text-left text-xs py-2 border-b border-slate-200">💾 Save it for later</button>
                  <button className="w-full text-left text-xs py-2">⇩ Download article</button>
                </div>
              )}
              {isShareOpen ? (
                <div className="rounded-2xl border border-slate-300 bg-white p-4">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Share</p>
                    <button
                      type="button"
                      onClick={() => setIsShareOpen(false)}
                      className="text-slate-500"
                      aria-label="Close share section"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex gap-3 text-slate-700 text-sm">
                    <button>✉</button><button>🔗</button><button>f</button><button>𝕏</button><button>in</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={() => setIsShareOpen(true)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-500 shadow-sm"
                    aria-label="Open share section"
                  >
                    +
                  </button>
                </div>
              )}
              {isSubscribeOpen ? (
                <div className="rounded-2xl border border-slate-300 bg-white p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Subscribe</p>
                    <button
                      type="button"
                      onClick={() => setIsSubscribeOpen(false)}
                      className="text-slate-500"
                      aria-label="Close subscribe section"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">Stay ahead with gro24.ai insights on marketing and sales</p>
                  <div className="flex items-center rounded-lg bg-white border border-slate-300 overflow-hidden h-9">
                    <input className="px-3 flex-1 text-xs outline-none" placeholder="Enter Email" />
                    <button className="w-10 h-full bg-[#7cf267]">→</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={() => setIsSubscribeOpen(true)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-500 shadow-sm"
                    aria-label="Open subscribe section"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default PortfolioPage

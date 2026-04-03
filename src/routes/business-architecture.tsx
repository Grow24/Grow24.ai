import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/business-architecture')({
  component: BusinessArchitecturePage,
})

function BusinessArchitecturePage() {
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
            <section className="space-y-5">
              <h1 className="text-[48px] leading-[1.08] font-semibold text-slate-900">What Is Business Architecture?</h1>
              <p className="text-[36px] leading-[1.2] font-semibold text-slate-900">
                A practical explanation for senior business leaders
              </p>
            </section>

            <section className="relative pt-2">
              <div className="overflow-hidden rounded-[2px] relative border border-slate-200/70">
                <img
                  src="/business-architecture-page-hero.png"
                  alt="Business architecture hero visual"
                  className="w-full h-auto block object-contain bg-slate-950"
                />
              </div>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <p>
                In most organizations, strategy does not fail because leaders lack ambition. It struggles because the
                business is not always viewed, designed, and changed as one connected system.
              </p>
              <p>
                Corporate leadership may set growth priorities. Marketing may launch campaigns. Sales may push
                conversion. Finance may tighten controls. Operations may focus on efficiency. Technology may support
                delivery. Each function may be doing reasonable work. Yet the organization still experiences familiar
                problems: fragmented execution, overlapping initiatives, weak handoffs, local optimization, and limited
                visibility into how change in one area affects value in another.
              </p>
              <p>
                This is where <strong>Business Architecture</strong> becomes important.
              </p>
              <p>
                Business Architecture gives leadership a structured view of the business. It helps answer questions
                such as: How does the enterprise actually create value? What must the business be good at? Where do
                functions depend on one another? Which information matters most? Which initiatives truly deserve
                investment? What exactly must change if strategy changes?
              </p>
              <p>
                It is not a technology blueprint. It is not just process mapping. It is not just an org chart. It is
                not a list of projects. It is the <strong>business blueprint of the enterprise.</strong>
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Business Architecture, in simple language</h2>
              <p>
                Business Architecture is the structured representation of how an organization creates, delivers, and
                sustains value.
              </p>
              <p>It does this by connecting a few core ideas:</p>
              <p>
                <strong>Capabilities</strong> are what the business must be able to do.
                <br />
                <strong>Value streams</strong> show how value flows from trigger to outcome.
                <br />
                <strong>Organization</strong> shows who performs, owns, or governs the work.
                <br />
                <strong>Information</strong> identifies what business information is required.
                <br />
                <strong>Strategy, initiatives, products, policies, stakeholders, and metrics</strong> provide the broader context
                that shapes priorities and change.
              </p>
              <p>A useful way to think about it is this:</p>
              <p className="font-semibold text-slate-900">
                If strategy says where the business wants to go, Business Architecture helps show what the business is,
                how it works, where it creates value, and what must change to get there.
              </p>
              <p>
                That is why it matters to senior leaders. It turns strategy from an aspiration into something that can
                be analyzed, scoped, governed, and executed.
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">What Business Architecture is not</h2>
              <p>Because the term sounds formal, it is often misunderstood.</p>
              <p>
                Business Architecture is not just a process map. It is not just an organization chart. It is not just
                a technology architecture exercise. It is not just a transformation-office deliverable.
              </p>
              <p>It is not just a set of PowerPoint diagrams. And it is not just another way of saying operating model.</p>
              <p>
                A process map shows flow. An org chart shows reporting relationships. A strategy deck shows intent. A
                portfolio list shows projects. An operating model shows broad design choices.
              </p>
              <p>
                Business Architecture connects these into a coherent business view. It shows the enterprise not as
                disconnected functions, but as a system for value creation.
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Why senior leaders should care</h2>
              <p>
                For a senior executive, the real benefit of Business Architecture is not theoretical neatness. It is
                decision quality.
              </p>
              <p>
                Without a business architecture view, organizations often face familiar problems. A growth initiative
                is launched, but no one is clear which capabilities need strengthening. A transformation program
                starts, but the scope is defined by organizational politics rather than business impact. Marketing
                improves acquisition, but Sales and Service are not ready to absorb the downstream effect. Finance
                pushes control measures, but the business does not fully understand which customer journeys, commercial
                capabilities, or service commitments will be affected.
              </p>
              <p>Business Architecture helps prevent this by creating shared visibility.</p>
              <p>
                It gives leadership a structured way to ask: Where is value being created? Where is value leaking?
                Which capabilities matter most? Which initiatives affect the same business areas? Which functions need
                to move together? What should be standardized, and what should remain flexible?
              </p>
              <p>
                That is why it matters not only to Corporate leaders, but equally to Marketing, Sales, Finance, HR,
                Supply Chain, and Transformation teams.
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                A practical example: a consumer goods company pursuing profitable growth
              </h2>
              <p>Let us explain the concept through one example.</p>
              <p>
                Imagine a consumer goods company with a national presence. The CEO and leadership team want to improve
                three outcomes over the next 18 months:
              </p>
              <ul className="list-disc pl-7 space-y-1">
                <li>profitable revenue growth</li>
                <li>stronger customer retention</li>
                <li>lower working-capital pressure</li>
              </ul>
              <p>At first glance, this sounds straightforward. But each function interprets the challenge differently.</p>
              <p>
                Marketing says the issue is weak segmentation and inconsistent campaign targeting. Sales says the issue
                is lead quality, poor opportunity conversion, uneven account planning, and discount leakage. Finance
                says the issue is margin pressure, credit discipline, and slow receivables. Supply Chain says customer
                service levels are inconsistent because demand signals and inventory planning are misaligned. Customer
                Service says retention is being hurt by poor issue resolution and fragmented account visibility.
              </p>
              <p>All of them may be right. But the organization still needs one common business view.</p>
              <p>This is what Business Architecture provides.</p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                Step 1: Understand the business in terms of capabilities
              </h2>
              <p>
                The first question is not, "Which project should we run?" The first question is:{' '}
                <strong>What must this business be good at?</strong>
              </p>
              <p>
                In this example, the company may need capabilities such as Market Segmentation, Campaign Management,
                Lead Management, Opportunity Management, Pricing Management, Account Management, Order Fulfillment,
                Credit Management, Collections Management, Customer Service, and Performance Management.
              </p>
              <p>
                This is powerful because capabilities are more stable than projects and more reusable than temporary
                initiatives. They provide a business-centered way to understand the enterprise.
              </p>
              <p>
                For example, if profitable growth is the priority, the leadership team can now ask whether the business
                is weak at segmentation, pricing, account planning, collections, service recovery, or fulfillment
                reliability. That is a far better conversation than simply asking which department is underperforming.
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Step 2: Understand how value flows</h2>
              <p>
                The second question is: <strong>How does value move through the business?</strong>
              </p>
              <p>This is where value streams come in.</p>
              <p>In our example, the company's value flow might look something like this:</p>
              <p>
                Identify market need -&gt; attract prospect -&gt; convert opportunity -&gt; fulfill order -&gt; service customer -&gt;
                collect payment -&gt; retain and grow account
              </p>
              <p>
                That sequence is not merely an operational workflow. It is the business-level path through which value
                is created and realized.
              </p>
              <p>
                Once this value flow is visible, leaders can see where different capabilities contribute. Market
                Segmentation and Campaign Management shape how prospects are attracted. Lead Management and Opportunity
                Management shape conversion quality. Pricing Management affects both conversion and margin. Order
                Fulfillment affects service reliability and customer trust. Collections Management affects cash
                realization. Customer Service affects retention and account growth.
              </p>
              <p>Now the business is beginning to make sense as a connected system.</p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4">
              <img
                src="/business-architecture-domains.png"
                alt="Conceptual view of business architecture domains"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                Step 3: Connect capabilities to the value flow
              </h2>
              <p>This is where Business Architecture becomes especially useful.</p>
              <p>
                Leadership can now cross-map the capabilities against the value stream and ask: Where are the weakest
                points in the value chain? Which capabilities are underpowered? Which stages of value delivery are
                affected by the same root issue? Where are we over-investing? Where are we exposed?
              </p>
              <p>Suppose the analysis shows the following:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>weak segmentation leads to inefficient campaigns</li>
                <li>poor lead qualification burdens Sales</li>
                <li>inconsistent pricing hurts margin quality</li>
                <li>lack of order visibility harms customer trust</li>
                <li>weak collections discipline slows cash realization</li>
                <li>fragmented service information hurts retention</li>
              </ul>
              <p>
                Notice what has happened. The business problem has moved from being vague and function-specific to
                being structured and enterprise-wide.
              </p>
              <p>That is one of the biggest contributions of Business Architecture.</p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                Step 4: Bring in organization and ownership
              </h2>
              <p>
                Once the value flow and capabilities are visible, the next question is:{' '}
                <strong>Who owns, performs, or governs these areas?</strong>
              </p>
              <p>Now the architecture can bring in the organization dimension.</p>
              <p>
                In our example, the relevant parts of the enterprise may include Corporate leadership, Marketing, Sales,
                Finance, Supply Chain, Customer Service, Data and Analytics, and Technology enablement teams.
              </p>
              <p>This makes hidden dependencies visible.</p>
              <p>
                For example, improving retention may not sit only with Customer Service. It may require changes in
                segmentation, account visibility, fulfillment performance, pricing consistency, and issue resolution.
                Similarly, improving working capital may not sit only with Finance. It may require changes in
                commercial terms, account selection, order behavior, service quality, and collections discipline.
              </p>
              <p>
                Business Architecture helps the organization see that many business outcomes are cross-functional by
                nature.
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Step 5: Bring in information</h2>
              <p>
                Another strength of Business Architecture is that it highlights the business information required to run
                and improve the enterprise.
              </p>
              <p>
                In our example, critical information objects might include customer, prospect, account, opportunity,
                product, price, order, invoice, payment, claim, complaint, and service request.
              </p>
              <p>
                This matters because many business problems are not caused only by poor execution. They are caused by
                fragmented business information.
              </p>
              <p>
                If Sales cannot see service issues, account growth will suffer. If Finance cannot see commercial
                realities, controls may become blunt. If Customer Service cannot see account history, resolution will be
                weaker. If Marketing cannot distinguish profitable segments from merely active ones, growth quality will
                deteriorate.
              </p>
              <p>
                Business Architecture helps leadership treat information as a business asset, not just as a technical
                data issue.
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4">
              <img
                src="/business-architecture-running-example.png"
                alt="Running example with value flow, capabilities, and functions"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Step 6: Define better initiatives</h2>
              <p>
                Only after the business is understood in this way should leaders ask:{' '}
                <strong>Which initiatives should we fund and prioritize?</strong>
              </p>
              <p>
                Now the organization can define much sharper initiatives, such as strengthening segmentation for
                high-value customer groups, redesigning lead qualification across Marketing and Sales, improving pricing
                discipline in selected commercial channels, creating account-level visibility across order, service, and
                receivables, strengthening collections for high-risk segments, and improving service recovery for
                strategically important accounts.
              </p>
              <p>These are far better than vague initiatives such as "improve CRM" or "optimize sales operations."</p>
              <p>Why? Because they are now scoped against the business architecture.</p>
              <p>
                That means the initiative can be tied to strategic intent, affected value streams, required
                capabilities, impacted functions, needed information, and expected business outcomes.
              </p>
              <p>This is exactly the kind of rigor senior leaders need when prioritizing change.</p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">A simple way to remember Business Architecture</h2>
              <p>
                For a senior leader, Business Architecture can be remembered through five practical questions:
              </p>
              <p>
                What value are we trying to create?
                <br />
                How does that value flow through the business?
                <br />
                What must the business be good at?
                <br />
                Who owns and performs the work?
                <br />
                What needs to change, and where should we invest first?
              </p>
              <p>
                If a discipline helps answer those questions clearly, it is useful. Business Architecture does exactly
                that.
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                What this means for different senior functions
              </h2>
              <h3 className="text-[32px] leading-[1.12] font-semibold text-slate-900">For Corporate leadership</h3>
              <p>
                Business Architecture helps leadership see the enterprise as a system rather than as a set of
                departmental updates. It improves strategic alignment, investment prioritization, governance, and change
                scoping.
              </p>
              <h3 className="text-[32px] leading-[1.12] font-semibold text-slate-900">For Marketing</h3>
              <p>
                It helps Marketing connect upstream market activity with downstream business value. It clarifies how
                segmentation, campaigns, product positioning, and lead generation affect conversion quality, service
                reliability, retention, and profitability.
              </p>
              <h3 className="text-[32px] leading-[1.12] font-semibold text-slate-900">For Sales</h3>
              <p>
                It makes visible how commercial performance depends not only on sellers, but also on pricing, account
                visibility, fulfillment, service, and information quality.
              </p>
              <h3 className="text-[32px] leading-[1.12] font-semibold text-slate-900">For Finance</h3>
              <p>
                It helps Finance engage more intelligently with the business. Instead of being seen only as a reporting
                or control function, Finance can better connect financial outcomes to the capabilities and value flows
                that actually drive them.
              </p>
              <h3 className="text-[32px] leading-[1.12] font-semibold text-slate-900">For transformation leaders</h3>
              <p>
                It provides the business frame for deciding scope, impact, dependencies, sequencing, and governance. It
                helps transformation become enterprise-driven rather than project-driven.
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                Common misconception: do we need to map the whole enterprise first?
              </h2>
              <p>No.</p>
              <p>A common fear is that Business Architecture is too large, too slow, or too academic.</p>
              <p>
                In practice, organizations do not need to map the entire enterprise before seeing value. A strong
                approach is to start where business priority is highest: a growth challenge, a customer retention
                problem, a profitability issue, a transformation program, a merger or restructuring effort, or a major
                capability redesign.
              </p>
              <p>
                The architecture can begin with the most important value streams and capabilities, and then expand over
                time.
              </p>
              <p>That makes it practical.</p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4">
              <img
                src="/business-architecture-strategy-map.png"
                alt="Strategy to initiative to outcomes mapping"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="border-t border-b border-slate-300 pt-8 pb-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Final thought</h2>
              <p>Business Architecture is not about creating pretty diagrams for their own sake.</p>
              <p>
                It is about giving leadership a clearer way to understand the business, align functions, scope change,
                and govern execution.
              </p>
              <p>
                In a world where enterprises face constant pressure to grow, adapt, digitize, and improve performance,
                that clarity becomes a strategic advantage.
              </p>
              <p>
                When done well, Business Architecture helps leaders move from fragmented action to coordinated value
                creation.
              </p>
              <p>And that may be the most important reason it matters.</p>
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

export default BusinessArchitecturePage

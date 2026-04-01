import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/transformation')({
  component: TransformationPage,
})

const AUTHORS = [
  {
    name: 'Sandeep Seth',
    title: 'Co-founder • IIT Delhi • IIM Bangalore',
    image: '/sandeep_seth.png',
    points: [
      'P&G experience across Sales analytics, Marketing analytics, and Supply Chain analytics.',
      'Worked with P&G’s distributors (SMEs) to improve financial outcomes—extending capability beyond enterprise boundaries.',
      'Outside P&G: delivered HR Analytics training initiatives alongside Dr. Dave Ulrich.',
      'Led and contributed to digital transformation programs.',
    ],
  },
  {
    name: 'Rishika Seth',
    title: 'Co-founder • MBA (Finance), Agra University • CFP',
    image: '/rishika_seth.jpg',
    points: [
      'MBA (Finance major) from Agra University.',
      'Certified Financial Planner (CFP).',
      'Experience in Wealth Management in client advisory roles—bringing long-term financial discipline to personal and business decisions.',
    ],
  },
]

const RELATED = [
  { title: "Agentic Commerce Is Redefining Retail—Here's How to Respond", image: '/problem-hero3.png', tag: 'Retail Industry', date: 'October 6, 2025' },
  { title: 'AI Agents Will Reshape E-Commerce. European Players Must Prepare...', image: '/solution-hero2.png', tag: 'E-Commerce', date: 'December 15, 2025' },
  { title: 'Scaling AI Requires New Processes, Not Just New Tools', image: '/toolsets-hero4.png', tag: 'AI Agents', date: 'January 20, 2026' },
  { title: 'How AI Agents Are Transforming Consumer Goods', image: '/value-framework-hero10.png', tag: 'Artificial Intelligence', date: 'September 14, 2025' },
]

function TransformationPage() {
  const [isActionsOpen, setIsActionsOpen] = useState(true)
  const [isShareOpen, setIsShareOpen] = useState(true)
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(true)

  return (
    <div
      className="min-h-screen text-[#202124] mt-[-70px]"
      style={{
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
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
          <article className="relative space-y-10">
            <section className="relative pt-2">
              <h1 className="text-[40px] md:text-[46px] leading-[1.06] font-light max-w-[980px] tracking-[-0.015em] text-slate-900 mb-5">
                Processes &amp; Workflows: How Lead2Order Really Gets Work Done.
              </h1>
              <div className="overflow-hidden rounded-[2px] relative border border-slate-200/70">
                <img src="/transformation/process.png" alt="Lead2Order process and workflow visual" className="w-full h-auto block object-contain bg-white" />
                <div
                  className="absolute left-8 top-9 w-[440px] max-w-[92%] rounded-2xl p-5 md:p-6 text-slate-800 shadow-[0_10px_28px_rgba(0,0,0,0.2)] border"
                  style={{
                    backgroundColor: 'rgba(245, 245, 246, 0.78)',
                    borderColor: 'rgba(255, 255, 255, 0.46)',
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)',
                  }}
                >
                  <p className="text-[12px] font-semibold tracking-wide text-slate-900 mb-3">KEY TAKEAWAYS</p>
                  <p className="text-[14px] leading-[1.45] mb-3">
                    Growth does not come only from having more leads, more salespeople, or more systems. It comes from converting commercial intent into disciplined execution. That is why leaders need to understand the difference between a process and a workflow.
                  </p>
                  <p className="text-[14px] leading-[1.45] mb-3">
                    A process is the broader business structure that defines how an organization produces an outcome. A workflow is the specific movement of work through tasks, decisions, handoffs, and approvals inside that structure.
                  </p>
                  <p className="text-[14px] leading-[1.45] mb-3">
                    The distinction sounds simple, but it is strategically important. Many organizations try to improve performance by automating individual steps while leaving the larger business design unclear. The result is faster activity, but not necessarily better outcomes.
                  </p>
                  <p className="text-[14px] leading-[1.45] mb-3">
                    In the Lead2Order value stream, this distinction becomes very practical. The business is not trying merely to move leads around a CRM. It is trying to convert market interest into profitable, valid, bookable customer orders. That requires both a strong end-to-end process and well-designed workflows within it.
                  </p>
                  <p className="text-[14px] leading-[1.45]">
                    This article explains the difference, shows how the two interact, and illustrates both through the Lead2Order example. For CXOs and their direct reports, the central message is this: a process gives structure to value creation; a workflow gives motion to execution. You need both to scale performance.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative space-y-6 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px]">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Why This Topic Matters to Leadership</h2>
              <p>In many boardrooms and management meetings, teams speak about &quot;fixing the process&quot; when what they are really discussing is a delay in approvals, a broken handoff, a CRM routing rule, or a missed task. In other cases, teams say they are &quot;automating workflows&quot; when the larger business process itself has not been defined clearly.</p>
              <p>That confusion is costly.</p>
              <p>When the distinction between processes and workflows is blurred, organizations typically face four problems. First, they optimize local activity while the end-to-end commercial result remains weak. Second, they automate fragmented steps without redesigning the broader operating model. Third, functions such as Marketing, Sales, Finance, Legal, and Operations work in sequence but not in alignment. Fourth, metrics become activity-heavy and outcome-light.</p>
              <p>For an executive team, this matters because <strong>Lead2Order is not a technical flow alone; it is a commercial value stream.</strong> It influences growth, conversion, customer experience, margin quality, control, forecast reliability, and operational readiness.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">What Is a Process?</h2>
              <p><strong>A process</strong> is a structured set of related activities designed to achieve a defined business outcome. It is broader than an individual task or transaction. It sets the business context within which work is performed.</p>
              <p>A process typically defines:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>the business purpose</li>
                <li>the start and end boundaries</li>
                <li>the major stages</li>
                <li>the participating roles or functions</li>
                <li>the business rules and controls</li>
                <li>the inputs and outputs</li>
                <li>the metrics that indicate performance</li>
              </ul>
              <p>In Lead2Order, the process is the broader mechanism that takes market interest and converts it into a confirmed order.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">What Is a Workflow?</h2>
              <p><strong>A workflow</strong> is the detailed movement of a specific unit of work through tasks, decisions, routing rules, handoffs, and completion points.</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>what happens first</li>
                <li>who acts next</li>
                <li>what decision determines the next path</li>
                <li>what approval is needed</li>
                <li>what happens if the item is rejected, delayed, or incomplete</li>
                <li>when is the work considered done</li>
              </ul>
              <p>If a process describes the business design, a workflow describes the <strong>execution path</strong> within that design.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">The Difference Between a Process and a Workflow</h2>
              <p><strong>A process is the business structure for achieving an outcome.</strong><br /><strong>A workflow is the execution flow that moves work through that structure.</strong></p>
              <ol className="list-decimal pl-7 space-y-3">
                <li><strong>Business outcome versus work movement</strong> - A process is defined by the outcome it is meant to produce. A workflow is defined by how a work item moves from one point to another.</li>
                <li><strong>Broad scope versus narrow scope</strong> - A process is broader and spans multiple stages. A workflow is narrower and tied to a specific operational thread.</li>
                <li><strong>Governance versus routing</strong> - A process includes rules, controls, ownership, policy context, and outcome measures. A workflow includes routing logic, decision points, task sequences, and status changes.</li>
                <li><strong>End-to-end visibility versus operational detail</strong> - A process gives leadership the full view. A workflow gives teams practical execution guidance.</li>
                <li><strong>Strategic performance versus transactional execution</strong> - A process is used to judge whether the commercial engine is healthy. A workflow is used to move work reliably and repeatedly.</li>
              </ol>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Lead2Order as the Running Example</h2>
              <p>At the highest level, the <strong>Lead2Order process</strong> may include stages such as lead capture, lead qualification, opportunity creation, discovery and needs analysis, solution configuration, proposal and pricing, negotiation, approval, and order booking.</p>
              <p>Now take one part of that broader process: <strong>lead qualification</strong>. A lead qualification workflow might include entry, record creation, scoring, threshold-based routing, validation, and either opportunity creation or closure.</p>
              <p>This is the relationship: <strong>Lead2Order</strong> is the broader value stream context; <strong>Lead2Order process</strong> is the structured business mechanism; <strong>lead qualification workflow and quote approval workflow</strong> are execution flows within it.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">How Processes and Workflows Work Together</h2>
              <p>A useful hierarchy is: <strong>Value Stream -&gt; Process -&gt; Workflow -&gt; Task</strong>.</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>the value stream is Lead2Order</li>
                <li>the process is the structured path from lead to order</li>
                <li>the workflows include lead qualification, quote approval, and order creation</li>
                <li>the tasks include assign, review, approve, update, and notify</li>
              </ul>
              <p>This hierarchy matters because leadership problems and operational problems do not always sit at the same level.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Why Leaders Need the Process View</h2>
              <p>Leaders are accountable for outcomes, not just activity. A process view allows executives to ask if the company is converting the right leads, engaging the right functions at the right time, protecting value through controls, and aligning the end-to-end path with market goals.</p>
              <p>These are business design questions, not workflow questions alone.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Why Teams Need the Workflow View</h2>
              <p>Execution teams need operational clarity: what triggers work, what data is mandatory, who owns the next step, what rules determine progression, what happens when exceptions arise, and when the item is complete.</p>
              <p>Workflows make work visible, repeatable, and governable. They reduce ambiguity, support accountability, and create the foundation for automation.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Common Mistakes Organizations Make</h2>
              <ol className="list-decimal pl-7 space-y-2">
                <li><strong>They mistake workflow documentation for process design.</strong></li>
                <li><strong>They define the process conceptually but do not operationalize it.</strong></li>
                <li><strong>They automate before redesigning.</strong></li>
              </ol>
              <p>In all three cases, the organization appears busy, but performance remains inconsistent.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Metrics: Process Metrics and Workflow Metrics</h2>
              <p><strong>Process metrics</strong> tell leadership whether the business outcome is being achieved. <strong>Workflow metrics</strong> tell teams whether operational movement is efficient.</p>
              <p>In Lead2Order, process metrics may include lead-to-order conversion rate, average sales cycle duration, win rate, average deal value, and order accuracy. Workflow metrics may include lead response time, quote approval turnaround, rework rate, exception volume, and task aging.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Process Improvement versus Workflow Automation</h2>
              <p>Process improvement asks whether the overall design is right. Workflow automation asks whether routing, approvals, notifications, and escalations can be executed systematically.</p>
              <p>The right order is usually: clarify the outcome, define the process, simplify the design, standardize the workflows, and automate where appropriate.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">A PBMP View of Processes and Workflows</h2>
              <p>From a PBMP perspective, processes and workflows are not isolated operational artifacts. They sit inside a broader management logic that connects intent to value: Goals, Strategy, Objectives, Plans, Processes, Workflows, and Operations.</p>
              <p>In a commercial value stream such as Lead2Order, the process is a strategic asset. It shapes growth quality, conversion discipline, speed, customer confidence, and operational readiness.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-b border-slate-300 pt-8 pb-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Closing Thought</h2>
              <p>A process and a workflow are not the same thing, and that is precisely why both matter.</p>
              <p>The <strong>process</strong> gives the business an end-to-end structure for creating an outcome. The <strong>workflow</strong> gives work a defined path through tasks, decisions, and handoffs.</p>
              <p>Organizations that focus only on workflows often become locally efficient but strategically fragmented. Organizations that focus only on processes may sound coherent at the top but remain weak in execution.</p>
            </section>

            <section className="relative">
              <h2 className="text-5xl md:text-[72px] leading-[1.05] font-light mb-6">Authors</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {AUTHORS.map((author) => (
                  <article key={author.name} className="rounded-2xl border border-slate-300 bg-white p-4">
                    <div className="flex gap-3 mb-3">
                      <img
                        src={author.image}
                        alt={author.name}
                        className="w-14 h-14 rounded-xl bg-slate-200 object-cover"
                      />
                      <div>
                        <h3 className="text-[32px] leading-[1.05] font-semibold text-slate-900">{author.name}</h3>
                        <p className="text-sm text-slate-600">{author.title}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-[15px] leading-[1.45] text-slate-700">
                      {author.points.map((point) => (
                        <p key={point}>{point}</p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="relative rounded-2xl bg-[#2f3034] px-6 py-8 max-w-[980px]">
              <h2 className="text-5xl md:text-[64px] leading-[1.05] font-light text-white mb-6">Related Content</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {RELATED.map((item) => (
                  <article key={item.title} className="overflow-hidden rounded-xl bg-white/10 border border-white/20">
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="p-3 text-white">
                      <p className="text-[10px] uppercase tracking-wide mb-1">{item.tag}</p>
                      <p className="text-[10px] uppercase text-white/80 mb-2">Article {item.date}</p>
                      <h3 className="text-base font-light leading-tight line-clamp-3">{item.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
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

export default TransformationPage

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

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Executive Summary</h2>
              <p>Growth does not come only from having more leads, more salespeople, or more systems. It comes from converting commercial intent into disciplined execution. That is why leaders need to understand the difference between <strong>a process</strong> and <strong>a workflow</strong>.</p>
              <p><strong>A process</strong> is the broader business structure that defines how an organization produces an outcome. A <strong>workflow</strong> is the specific movement of work through tasks, decisions, handoffs, and approvals inside that structure.</p>
              <p>The distinction sounds simple, but it is strategically important. Many organizations try to improve performance by automating individual steps while leaving the larger business design unclear. The result is faster activity, but not necessarily better outcomes.</p>
              <p>In the <strong>Lead2Order</strong> value stream, this distinction becomes very practical. The business is not trying merely to move leads around a CRM. It is trying to convert market interest into profitable, valid, bookable customer orders. That requires both a strong end-to-end process and well-designed workflows within it.</p>
              <p>This article explains the difference, shows how the two interact, and illustrates both through the Lead2Order example. For CXOs and their direct reports, the central message is this: <strong>a process gives structure to value creation; a workflow gives motion to execution. You need both to scale performance.</strong></p>
              <img
                src="/transformation/image-1.png"
                alt="Process vs Workflow in Lead2Order"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Why This Topic Matters to Leadership</h2>
              <p>In many boardrooms and management meetings, teams speak about &quot;fixing the process&quot; when what they are really discussing is a delay in approvals, a broken handoff, a CRM routing rule, or a missed task. In other cases, teams say they are &quot;automating workflows&quot; when the larger business process itself has not been defined clearly.</p>
              <p>That confusion is costly.</p>
              <p>When the distinction between processes and workflows is blurred, organizations typically face four problems. First, they optimize local activity while the end-to-end commercial result remains weak. Second, they automate fragmented steps without redesigning the broader operating model. Third, functions such as Marketing, Sales, Finance, Legal, and Operations work in sequence but not in alignment. Fourth, metrics become activity-heavy and outcome-light.</p>
              <p>For an executive team, this matters because <strong>Lead2Order is not a technical flow alone; it is a commercial value stream.</strong> It influences growth, conversion, customer experience, margin quality, control, forecast reliability, and operational readiness.</p>
              <p>A company can have good people and good systems and still struggle if the process is weak. Likewise, it can have a well-documented process and still struggle if the workflows are clumsy, slow, or inconsistent. That is why this topic sits at the intersection of strategy, governance, execution, and performance management.</p>
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
              <p>In other words, a process is not merely a sequence of actions. It is the <strong>operating design</strong> through which the organization reliably produces a result.</p>
              <p>In the commercial world, the result is rarely just &quot;complete the steps.&quot; The result is something of business value: win a qualified customer, issue a compliant quote, book a profitable order, reduce cycle time, or improve conversion quality.</p>
              <p>In <strong>Lead2Order</strong>, the process is the broader mechanism that takes market interest and converts it into a confirmed order. It includes the commercial stages, the cross-functional interactions, the approval logic, the controls, and the measures that tell leadership whether the company is performing well.</p>
              <p>The process view therefore answers questions such as:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>Where does Lead2Order begin and end?</li>
                <li>Which functions participate?</li>
                <li>What are the major commercial stages?</li>
                <li>What policies govern progression?</li>
                <li>What metrics matter to leadership?</li>
              </ul>
              <p>A process is the larger frame within which work happens.</p>
              <img
                src="/transformation/image-2.png"
                alt="Lead Qualification Workflow"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">What Is a Workflow?</h2>
              <p><strong>A workflow</strong> is the detailed movement of a specific unit of work through tasks, decisions, routing rules, handoffs, and completion points. It is narrower than a process and more operational in nature.</p>
              <p>A workflow answers questions such as:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>What happens first?</li>
                <li>Who acts next?</li>
                <li>What decision determines the next path?</li>
                <li>What approval is needed?</li>
                <li>What happens if the item is rejected, delayed, or incomplete?</li>
                <li>When is the work considered done?</li>
              </ul>
              <p>If a process describes the business design, a workflow describes the <strong>execution path</strong> within that design.</p>
              <p>This makes workflows especially useful for operational clarity and automation. They translate broad intent into something executable. A workflow can be assigned, routed, tracked, escalated, measured, and improved.</p>
              <p>In Lead2Order, there are many possible workflows. For example:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>lead qualification workflow</li>
                <li>lead assignment workflow</li>
                <li>quote preparation workflow</li>
                <li>discount approval workflow</li>
                <li>contract review workflow</li>
                <li>order creation workflow</li>
              </ul>
              <p>Each of these handles a specific kind of work item. A workflow does not represent the entire commercial journey. It represents one flow within it.</p>
              <p>That is why workflows are often the place where organizations first feel pain. A manager notices delays in approvals, lost ownership, repeated rework, missing information, or late escalations. These are often workflow issues. But whether they are isolated execution problems or symptoms of a larger design problem depends on the process context.</p>
              <img
                src="/transformation/image-3.png"
                alt="Lead2Order metrics: process vs workflow"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">The Difference Between a Process and a Workflow</h2>
              <p>The simplest way to frame the difference is this:</p>
              <p><strong>A process is the business structure for achieving an outcome.</strong><br /><strong>A workflow is the execution flow that moves work through that structure.</strong></p>
              <p>This distinction becomes clearer when viewed through practical lenses.</p>
              <p><strong>1. Business outcome versus work movement</strong></p>
              <p>A process is defined by the outcome it is meant to produce. A workflow is defined by how a work item moves from one point to another.</p>
              <p>In Lead2Order, the process is about converting demand into valid, revenue-bearing orders. A workflow is about moving a lead, quote, approval, or order from one stage to the next.</p>
              <p><strong>2. Broad scope versus narrow scope</strong></p>
              <p>A process is broader, often cross-functional, and usually spans multiple stages. A workflow is narrower and usually tied to a specific operational thread.</p>
              <p>Lead2Order as a process may involve Marketing, Sales, Finance, Legal, and Operations. A quote approval workflow may involve only Sales and Finance.</p>
              <p><strong>3. Governance versus routing</strong></p>
              <p>A process includes business rules, controls, ownership, policy context, and outcome measures. A workflow includes routing logic, decision points, task sequences, and status changes.</p>
              <p><strong>4. End-to-end visibility versus operational detail</strong></p>
              <p>A process gives leadership the end-to-end view. A workflow gives teams detailed operational guidance.</p>
              <p><strong>5. Strategic performance versus transactional execution</strong></p>
              <p>A process is what leaders use to judge whether the commercial engine is working. A workflow is what teams use to move work reliably and repeatedly.</p>
              <p>The two are related, but they are not interchangeable.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Lead2Order as the Running Example</h2>
              <p>To make this distinction concrete, consider a company selling enterprise solutions. A potential customer responds to a campaign, fills a web form, or is identified through a channel partner. That early commercial signal now needs to move through a series of business steps before it becomes a confirmed order.</p>
              <p>At the highest level, the <strong>Lead2Order process</strong> may include the following stages:</p>
              <ol className="list-decimal pl-7 space-y-1">
                <li>Lead capture</li>
                <li>Lead qualification</li>
                <li>Opportunity creation</li>
                <li>Discovery and needs analysis</li>
                <li>Solution configuration</li>
                <li>Proposal and pricing</li>
                <li>Negotiation</li>
                <li>Approval</li>
                <li>Order booking</li>
              </ol>
              <p>This is the <strong>process view</strong>. It shows the end-to-end commercial path from demand to order.</p>
              <p>Now take one part of that broader process: <strong>lead qualification.</strong></p>
              <p>A <strong>lead qualification workflow</strong> might be:</p>
              <ol className="list-decimal pl-7 space-y-1">
                <li>Lead enters the system</li>
                <li>CRM record is created</li>
                <li>Lead is scored</li>
                <li>If below threshold, route to nurture</li>
                <li>If above threshold, assign to inside sales</li>
                <li>Contact and requirement are validated</li>
                <li>If qualified, create opportunity</li>
                <li>If not qualified, close the lead</li>
              </ol>
              <p>This is the <strong>workflow view</strong>. It shows how one specific unit of work moves through operational steps and decisions.</p>
              <p>In the same way, <strong>quote approval</strong> could be another workflow within the same Lead2Order process. It may involve pricing rules, discount thresholds, finance review, legal review, and release of the approved commercial offer.</p>
              <p>So the relationship is clear:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li><strong>Lead2Order</strong> is the broader value stream context</li>
                <li><strong>Lead2Order process</strong> is the structured business mechanism</li>
                <li><strong>lead qualification workflow and quote approval workflow</strong> are execution flows within it</li>
              </ul>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">How Processes and Workflows Work Together</h2>
              <p>Processes and workflows should not be seen as competing ideas. They operate at different levels and complement one another.</p>
              <p>A useful hierarchy is:</p>
              <p><strong>Value Stream -&gt; Process -&gt; Workflow -&gt; Task</strong></p>
              <p>The <strong>value stream</strong> represents the end-to-end value creation logic.<br />
              The <strong>process</strong> defines how a major business outcome is achieved.<br />
              The <strong>workflow</strong> defines the movement of specific work items.<br />
              The <strong>task</strong> is the individual unit of action.</p>
              <p>In the Lead2Order context:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>the value stream is Lead2Order</li>
                <li>the process is the structured business path from lead to order</li>
                <li>the workflows include lead qualification, quote approval, and order creation</li>
                <li>the tasks include assign, review, approve, update, and notify</li>
              </ul>
              <p>This hierarchy matters because leadership problems and operational problems do not always sit at the same level.</p>
              <p>For example:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>if the company has poor lead quality entering the funnel, that is not solved by workflow automation alone</li>
                <li>if quotes are delayed because approvers are not notified on time, that may be a workflow issue</li>
                <li>if the company does not know where Lead2Order begins and ends, that is a process design issue</li>
                <li>if teams keep repeating manual updates across systems, that may be a workflow and tool integration issue</li>
              </ul>
              <p>The key is to diagnose at the correct level.</p>
              <p>[Insert Image 5 here]</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Why Leaders Need the Process View</h2>
              <p>Leaders are accountable for outcomes, not just activity. That is why the process view is so important.</p>
              <p>A process view allows executives to ask:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>Are we converting the right leads?</li>
                <li>Are we engaging the right functions at the right time?</li>
                <li>Where do deals stall structurally?</li>
                <li>Are approvals protecting value or slowing growth unnecessarily?</li>
                <li>Do our controls support profitable execution?</li>
                <li>Is the end-to-end path aligned with how we want to win in the market?</li>
              </ul>
              <p>These are not workflow questions alone. They are business design questions.</p>
              <p>In Lead2Order, the process view helps leadership see whether the commercial model is functioning coherently. For example, a company might discover that it generates many leads but very few of them convert. Or it may discover that deal cycles are long not because approvals are slow, but because discovery is weak and proposals are repeatedly reworked. In another case, the company may see that orders are booked quickly but contain frequent downstream errors because order readiness checks are poorly designed.</p>
              <p>None of these issues can be solved sustainably by looking only at isolated steps. They require a process lens.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Why Teams Need the Workflow View</h2>
              <p>While leaders need the process view, execution teams need the workflow view.</p>
              <p>Teams need operational clarity:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>what triggers the work</li>
                <li>what data is mandatory</li>
                <li>who owns the next step</li>
                <li>what rules determine progression</li>
                <li>what happens when exceptions arise</li>
                <li>when the item is complete</li>
              </ul>
              <p>This is where workflows become powerful. They make work visible, repeatable, and governable. They reduce ambiguity. They support accountability. They also create the foundation for automation.</p>
              <p>In Lead2Order, a good workflow ensures that:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>qualified leads do not sit unassigned</li>
                <li>quotes do not move forward without required margin checks</li>
                <li>commercial exceptions are escalated correctly</li>
                <li>orders are not booked with missing data</li>
                <li>teams can see status, age, and bottlenecks in real time</li>
              </ul>
              <p>This is not only about efficiency. It is also about control and customer experience.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Common Mistakes Organizations Make</h2>
              <p>Organizations usually fall into one of three traps.</p>
              <p><strong>1. They mistake workflow documentation for process design</strong></p>
              <p>They create a flowchart of steps and believe the process has been fully defined. But a process also needs scope, ownership, controls, policies, and metrics.</p>
              <p><strong>2. They define the process conceptually but do not operationalize it</strong></p>
              <p>The company has a policy deck or a process handbook, but the actual work still happens through scattered email chains, spreadsheets, phone calls, and informal follow-ups.</p>
              <p><strong>3. They automate before redesigning</strong></p>
              <p>They invest in routing, reminders, approvals, and system automation before simplifying the broader process. This produces faster motion inside a weak design.</p>
              <p>In all three cases, the organization appears busy, but performance remains inconsistent.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Metrics: Process Metrics and Workflow Metrics</h2>
              <p>This distinction becomes especially valuable when thinking about measurement.</p>
              <p><strong>Process metrics</strong> tell leadership whether the business outcome is being achieved.<br />
              <strong>Workflow metrics</strong> tell teams whether operational movement is efficient.</p>
              <p>In Lead2Order, process metrics may include:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>lead-to-order conversion rate</li>
                <li>average sales cycle duration</li>
                <li>win rate</li>
                <li>average deal value</li>
                <li>order accuracy</li>
              </ul>
              <p>These indicate end-to-end commercial performance.</p>
              <p>Workflow metrics may include:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>lead response time</li>
                <li>quote approval turnaround time</li>
                <li>rework rate</li>
                <li>exception volume</li>
                <li>task aging</li>
              </ul>
              <p>These indicate how efficiently work is flowing operationally.</p>
              <p>A company can improve workflow metrics and still remain weak at the process level. For example, quote approvals may become faster, but if the leads entering the process are poor quality, overall conversion may still remain low. Conversely, the company may define an excellent process but fail to deliver results because day-to-day workflows are slow, confusing, or inconsistent.</p>
              <p>That is why both measurement layers matter.</p>
              <img
                src="/transformation/image-4.png"
                alt="From value stream to task"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Process Improvement versus Workflow Automation</h2>
              <p>These two are closely related, but they are not the same.</p>
              <p><strong>Process improvement asks:</strong></p>
              <ul className="list-disc pl-7 space-y-1">
                <li>Is the overall design right?</li>
                <li>Are the stages necessary and well sequenced?</li>
                <li>Are the handoffs aligned with business needs?</li>
                <li>Are responsibilities clear?</li>
                <li>Are the controls proportionate?</li>
              </ul>
              <p><strong>Workflow automation asks:</strong></p>
              <ul className="list-disc pl-7 space-y-1">
                <li>Can routing be automated?</li>
                <li>Can approvals be triggered systemically?</li>
                <li>Can notifications and escalations happen automatically?</li>
                <li>Can repetitive manual actions be reduced?</li>
              </ul>
              <p>The right order is usually:</p>
              <ol className="list-decimal pl-7 space-y-1">
                <li>clarify the outcome</li>
                <li>define the process</li>
                <li>simplify the design</li>
                <li>standardize the workflows</li>
                <li>automate where appropriate</li>
              </ol>
              <p>In Lead2Order, there is little benefit in automating a quote approval path that has too many layers, inconsistent policies, or unclear authority. Design comes first. Automation comes after.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">A PBMP View of Processes and Workflows</h2>
              <p>From a PBMP perspective, processes and workflows are not isolated operational artifacts. They sit inside a broader management logic that connects intent to value.</p>
              <p>At a high level:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li><strong>Goals</strong> define what the organization wants to achieve</li>
                <li><strong>Strategy</strong> defines where to play and how to win</li>
                <li><strong>Objectives</strong> translate intent into measurable targets</li>
                <li><strong>Plans</strong> define what will be done</li>
                <li><strong>Processes</strong> define how value-producing work is structured</li>
                <li><strong>Workflows</strong> define how work moves in execution</li>
                <li><strong>Operations</strong> sustain repeatable delivery at scale</li>
              </ul>
              <p>This makes processes and workflows deeply relevant to senior leadership. They are not back-office mechanics. They are part of how strategy becomes execution and how execution becomes measurable value.</p>
              <p>In a commercial value stream such as Lead2Order, the process is a strategic asset. It shapes growth quality, conversion discipline, speed, customer confidence, and operational readiness. The workflows within it are the levers through which execution is made reliable.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-b border-slate-300 pt-8 pb-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Closing Thought</h2>
              <p>A process and a workflow are not the same thing, and that is precisely why both matter.</p>
              <p>The <strong>process</strong> gives the business an end-to-end structure for creating an outcome.<br />
              The <strong>workflow</strong> gives work a defined path through tasks, decisions, and handoffs.</p>
              <p>In <strong>Lead2Order</strong>, the process tells us how the company converts market interest into confirmed orders. The workflows tell us how individual leads, quotes, approvals, and order items actually move through that system.</p>
              <p>Organizations that focus only on workflows often become locally efficient but strategically fragmented. Organizations that focus only on processes may sound coherent at the top but remain weak in execution. The strongest organizations are the ones that can design the process well, run the workflows cleanly, measure both, and improve both over time.</p>
              <p>That is how commercial intent turns into repeatable business performance.</p>
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

import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/toolsets')({
  component: ToolsetsPage,
})

function ToolsetsPage() {
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
                Skills, Capabilities and Competencies: the Foundation for Professional Growth Cycle
              </h1>
              <div className="overflow-hidden rounded-[2px] relative border border-slate-200/70">
                <img
                  src="/toolsets-hero4.png"
                  alt="Skills, capabilities, and competencies"
                  className="w-full h-auto block object-contain bg-white"
                />
                <div
                  className="absolute left-8 top-9 w-[440px] max-w-[92%] rounded-2xl p-5 md:p-6 text-slate-800 shadow-[0_10px_28px_rgba(0,0,0,0.2)] border"
                  style={{
                    backgroundColor: 'rgba(245, 245, 246, 0.78)',
                    borderColor: 'rgba(255, 255, 255, 0.46)',
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)',
                  }}
                >
                  <p className="text-[12px] font-semibold tracking-wide text-slate-900 mb-3">EXECUTIVE SUMMARY</p>
                  <ul className="list-disc pl-5 space-y-2 text-[14px] leading-[1.45]">
                    <li>
                      The Professional Growth Cycle works through connected stages: Problem Statement, Goals, Strategy,
                      Objectives, Plan, Projects, and Operations, with Change Management acting across all.
                    </li>
                    <li>
                      Capabilities define what the enterprise must be able to do; competencies define what roles and
                      teams must be able to perform well; skills are the specific abilities that support those
                      competencies.
                    </li>
                    <li>
                      This logic applies across the whole organization, including the Board, CEO, CXOs, function heads,
                      program leaders, support specialists, and operations leaders.
                    </li>
                    <li>
                      Using a common capability such as Customer Onboarding Management, different roles such as Business
                      Analyst and Operations Manager require different competency maps because they contribute in
                      different ways.
                    </li>
                    <li>
                      When leaders connect skills, competencies, and capabilities clearly, they improve role design,
                      workforce planning, learning priorities, execution readiness, and operational performance across
                      the full cycle.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Executive Summary</h2>
              <p>
                Every organization moves through a Professional Growth Cycle: <strong>Problem Statement</strong>,
                <strong> Goals</strong>, <strong>Strategy</strong>, <strong>Objectives</strong>, <strong>Plan</strong>,
                <strong> Projects</strong>, and <strong>Operations</strong>, with <strong>Change Management</strong> acting across all of them.
                To perform that cycle well, the enterprise needs the right capabilities at the organization level, the right competencies at the role level, and the right skills at the individual level.
                A capability is what the enterprise must be able to do. A competency is the integrated readiness a role needs to perform effectively. Skills are the specific abilities that make that competency real.
                When leaders map these properly, they get a much clearer view of execution readiness, hiring priorities, role design, learning needs, and operational strength.
                BIZBOK&apos;s business architecture view is useful here because it connects capabilities with organization, value delivery, information, and change.
              </p>
              <p>
                Organizations usually spend a great deal of effort discussing growth, performance, execution, transformation, and talent.
                Yet many of these discussions happen in separate rooms, with separate vocabularies.
                Strategy may be discussed at the Board and CEO level. Projects may be discussed in PMO reviews. Operations may be discussed in service reviews.
                Talent may be discussed by HR and line leaders. Process issues may be discussed elsewhere.
                The result is often fragmentation, not because any one part is missing, but because the relationships between them are not explicit enough.
              </p>
              <p>That is where skills, capabilities, and competencies become foundational.</p>
              <p>They provide a practical language for answering three connected questions:</p>
              <p>
                What must the enterprise be able to do?
                <br />
                What must specific roles and teams be able to perform well?
                <br />
                What individual abilities make that performance possible?
              </p>
              <p>
                These questions matter across the entire Professional Growth Cycle:
                <br />
                <span className="font-semibold text-slate-900">
                  Problem Statement -&gt; Goals -&gt; Strategy -&gt; Objectives -&gt; Plan -&gt; Projects -&gt; Operations
                </span>
              </p>
              <p>And because no enterprise stands still, Change Management must work across all of these stages.</p>
              <p>
                This is not just a topic for HR. It is relevant to the Board, CEO, CXOs, Function Heads, Program Leaders, Support Leaders, and Operations Leaders.
                It is also highly relevant to the CHRO, because workforce readiness becomes far more valuable when it is tied directly to enterprise capabilities and execution needs.
              </p>
              <img
                src="/skills-growth-cycle-image.png"
                alt="Professional growth cycle with change management and skill-competency-capability flow"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">What is a capability?</h2>
              <p>
                A capability is what the enterprise must be able to do. TOGAF defines capability broadly as an ability an organization, person, or system possesses,
                and BIZBOK treats capabilities as stable business abilities that can be mapped to organization and change.
              </p>
              <p>A capability is not the same as:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>a department</li>
                <li>a job title</li>
                <li>a software application</li>
                <li>a single process</li>
                <li>a current org chart box</li>
              </ul>
              <p>
                Capabilities are more enduring than those structures. Systems may change, reporting lines may change,
                but the enterprise still needs certain abilities to function and grow.
              </p>
              <p>Examples of capabilities include:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>Customer Onboarding Management</li>
                <li>Strategy Formulation</li>
                <li>Performance Management</li>
                <li>Change Management</li>
                <li>Operations Management</li>
                <li>Business Analysis</li>
                <li>Process Management</li>
              </ul>
              <p>
                Seen this way, capabilities help leadership describe the enterprise in terms of what it must consistently be able to do, rather than how it happens to be arranged today.
              </p>
              <p>
                That is why capability maps are useful. They create a common language across corporate, functions, programs, support areas, projects, and operations.
                They also create a stable reference point for change.
              </p>
              <img
                src="/skills-capability-map-image.png"
                alt="Enterprise capability map across the professional growth cycle"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">What is a competency?</h2>
              <p>
                A competency is the integrated readiness needed to perform effectively in a given role or context.
                BIZBOK describes Competency Management as the ability to define, design, profile, rate, and validate the skills and knowledge necessary to do something.
              </p>
              <p>Competency is broader than just knowledge. It usually includes some mix of:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>knowledge</li>
                <li>judgment</li>
                <li>applied skill</li>
                <li>role behavior</li>
                <li>decision quality</li>
                <li>ability to perform consistently in context</li>
              </ul>
              <p>
                This is important because competencies are not limited to junior or mid-level staff. Senior leadership roles also require competencies, though they are of a different kind.
              </p>
              <p>For example:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>the Board may require governance, oversight, and strategic judgment competencies</li>
                <li>the CEO may require enterprise prioritization, capital allocation, and performance steering competencies</li>
                <li>a CXO may require function strategy, cross-functional alignment, and execution governance competencies</li>
                <li>a Program Leader may require orchestration, dependency management, and benefits tracking competencies</li>
                <li>an Operations Manager may require service level management, escalation handling, and continuous improvement competencies</li>
                <li>a Business Analyst may require requirements analysis, process analysis, and acceptance design competencies</li>
              </ul>
              <p>
                Competencies therefore help the organization move from a broad enterprise ability to the readiness expected of specific role groups.
              </p>
              <img
                src="/skills-competency-map-image.png"
                alt="Enterprise competency map for role groups and required competencies"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">What are skills?</h2>
              <p>Skills are the more granular abilities that contribute to a competency.</p>
              <p>Examples of skills include:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>interviewing</li>
                <li>workshop facilitation</li>
                <li>process modeling</li>
                <li>KPI interpretation</li>
                <li>queue management</li>
                <li>root-cause analysis</li>
                <li>stakeholder communication</li>
                <li>use case writing</li>
                <li>workflow design</li>
                <li>coaching</li>
                <li>data interpretation</li>
              </ul>
              <p>
                Skills are the building blocks. Competencies are the integrated role-readiness built from those blocks.
                Capabilities are the higher-level enterprise abilities those roles and teams help deliver.
              </p>
              <p>In simple terms:</p>
              <p className="font-semibold text-slate-900">
                Capability = what the enterprise must be able to do
                <br />
                Competency = what a role or team must be able to perform well
                <br />
                Skills = the specific individual abilities that support that competency
              </p>
              <p>
                This distinction is simple, but very powerful. It helps leaders avoid a common problem: discussing talent, process, and execution without a shared structure.
              </p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                Why all three matter across the full Professional Growth Cycle
              </h2>
              <p>The Professional Growth Cycle is not one decision or one document. It is a connected system of management and execution.</p>
              <p>At the Problem Statement stage, the organization needs the capability to frame issues well, and the people involved need competencies in analysis, clarification, and stakeholder understanding.</p>
              <p>At the Goals stage, the organization needs the capability to set direction, and leaders need competencies in prioritization, judgment, and measurement thinking.</p>
              <p>At the Strategy stage, the organization needs the capability to choose where to play and how to win, and leaders need competencies in strategic reasoning, market interpretation, and resource choice.</p>
              <p>At the Objectives stage, the organization needs the capability to translate direction into measurable targets, and managers need competencies in alignment, decomposition, and metric design.</p>
              <p>At the Plan stage, the organization needs the capability to convert intent into actionable work, and teams need competencies in planning, sequencing, dependency handling, and estimation.</p>
              <p>At the Projects stage, the organization needs the capability to create or improve solutions, and teams need competencies in requirements, design, build, testing, rollout, and governance.</p>
              <p>At the Operations stage, the organization needs the capability to run consistently and improve steadily, and leaders need competencies in service management, issue handling, performance review, and continuous improvement.</p>
              <p>
                Across all of this, Change Management is essential. Every change in goals, rules, process, technology, roles, data, or service levels places new demands on enterprise capabilities and on the competencies of the people involved.
              </p>
              <p>
                The point is not that one stage matters more than another. Each has its place. The real question is whether the organization has the right combination of capabilities, competencies, and skills to perform each stage well.
              </p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">The enterprise-wide scope</h2>
              <p>Capability and competency must be considered across the whole enterprise, not only inside one function.</p>
              <p>That means covering:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>Corporate</li>
                <li>Functional</li>
                <li>Program</li>
                <li>Support</li>
                <li>and the full execution chain into Projects and Operations</li>
              </ul>
              <p>At the Corporate level, this includes the Board, CEO, and CXOs.</p>
              <p>At the Functional level, it includes Sales, Marketing, Finance, HR, IT, Supply Chain, R&amp;D, Customer, and other business functions.</p>
              <p>At the Program level, it includes transformation, ESG, cross-functional initiatives, and other coordinated change efforts.</p>
              <p>
                At the Support level, it includes areas such as Business Analysis, Process Modeling, Portfolio/Project/Program Management, Solution Management, Operations Management, and Change Management.
              </p>
              <p>
                This is where BIZBOK is especially helpful. It treats business architecture as a connected view of capabilities, organization, value delivery, and information, and uses those relationships to improve transparency for decision-making and change.
              </p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                Customer Onboarding Management example
              </h2>
              <p>
                To make the distinction practical, consider one enterprise capability: <strong>Customer Onboarding Management</strong>.
              </p>
              <p>
                BIZBOK itself uses customer onboarding as a useful example because onboarding often cuts across multiple business units and requires a coordinated approach across several supporting capabilities.
              </p>
              <p>
                Customer onboarding is a good example because it is rarely owned by one team alone. It can involve:
              </p>
              <ul className="list-disc pl-7 space-y-1">
                <li>Sales or Front Office</li>
                <li>Operations</li>
                <li>Product</li>
                <li>Customer Service</li>
                <li>Risk or Compliance</li>
                <li>Support Services</li>
                <li>Technology teams</li>
              </ul>
              <p>The capability, at the enterprise level, is straightforward:</p>
              <p className="font-semibold text-slate-900">
                The organization must be able to take a customer from initial commitment to successful activation in a controlled, efficient, and compliant manner.
              </p>
              <p>But once we move below that capability, different roles require different competencies.</p>
              <img
                src="/skills-customer-onboarding-map-image.png"
                alt="Customer onboarding management cross-functional enterprise capability map"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Role 1: Business Analyst</h2>
              <p>Competencies:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>requirements analysis</li>
                <li>process analysis</li>
                <li>business rules definition</li>
                <li>stakeholder alignment</li>
                <li>traceability</li>
                <li>acceptance criteria design</li>
              </ul>
              <p>Skills:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>interviewing users</li>
                <li>facilitating workshops</li>
                <li>documenting requirements</li>
                <li>writing use cases</li>
                <li>modeling processes</li>
                <li>identifying gaps</li>
                <li>clarifying rules</li>
              </ul>
              <p>A simple competency map for the Business Analyst might look like this in prose:</p>
              <p className="font-semibold text-slate-900">
                Capability: Customer Onboarding Management
                <br />
                Role: Business Analyst
                <br />
                Competencies: Requirements Analysis, Process Analysis, Stakeholder Alignment, Rules Definition, Acceptance Design
                <br />
                Skills: Interviewing, workshop facilitation, process modeling, requirements writing, traceability management, gap analysis
              </p>
              <p>The Business Analyst is especially relevant in the earlier and change-heavy stages of the Growth Cycle:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>Problem Statement</li>
                <li>Objectives</li>
                <li>Plan</li>
                <li>Projects</li>
                <li>Change Management</li>
              </ul>
              <p>The BA helps define and improve how onboarding should work.</p>
              <img
                src="/skills-ba-competency-map-image.png"
                alt="Business Analyst competency map under customer onboarding management"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Role 2: Operations Manager</h2>
              <p>Competencies:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>workflow execution management</li>
                <li>service level management</li>
                <li>issue resolution</li>
                <li>workload balancing</li>
                <li>team supervision</li>
                <li>continuous improvement</li>
              </ul>
              <p>Skills:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>queue management</li>
                <li>escalation handling</li>
                <li>KPI monitoring</li>
                <li>root-cause analysis</li>
                <li>coaching</li>
                <li>SOP adherence</li>
                <li>workload allocation</li>
                <li>operational review</li>
              </ul>
              <p>A simple competency map for the Operations Manager might look like this:</p>
              <p className="font-semibold text-slate-900">
                Capability: Customer Onboarding Management
                <br />
                Role: Operations Manager
                <br />
                Competencies: Workflow Execution Management, SLA Management, Issue Resolution, Team Supervision, Continuous Improvement
                <br />
                Skills: Queue management, escalation handling, KPI review, root-cause analysis, coaching, SOP management
              </p>
              <p>The Operations Manager is especially relevant in:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>Plan</li>
                <li>Projects transition</li>
                <li>Operations</li>
                <li>Change Management</li>
              </ul>
              <p>The Operations Manager helps run onboarding reliably and at scale.</p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Why this distinction matters</h2>
              <p>Both the Business Analyst and the Operations Manager support the same capability. But their competency maps are different because their contribution is different.</p>
              <p>The Business Analyst is more focused on:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>defining</li>
                <li>structuring</li>
                <li>analyzing</li>
                <li>clarifying</li>
                <li>improving design logic</li>
              </ul>
              <p>The Operations Manager is more focused on:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>running</li>
                <li>stabilizing</li>
                <li>supervising</li>
                <li>measuring</li>
                <li>improving live execution</li>
              </ul>
              <p>
                This is exactly why one generic competency model is not enough. The organization needs role-specific competency maps under a shared capability architecture.
              </p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                Four competency families to model
              </h2>
              <p>For practical use, most enterprises should explicitly model at least four competency families.</p>
              <p><strong>1. Common enterprise competencies</strong></p>
              <ul className="list-disc pl-7 space-y-1">
                <li>business analysis</li>
                <li>communication</li>
                <li>problem solving</li>
                <li>stakeholder management</li>
                <li>planning and organizing</li>
                <li>analytical thinking</li>
              </ul>
              <p><strong>2. Function-specific competencies</strong></p>
              <ul className="list-disc pl-7 space-y-1">
                <li>pricing analytics in Marketing</li>
                <li>forecasting in Sales</li>
                <li>financial control in Finance</li>
                <li>workforce architecture in HR</li>
                <li>application architecture in IT</li>
              </ul>
              <p><strong>3. Program-specific competencies</strong></p>
              <ul className="list-disc pl-7 space-y-1">
                <li>dependency management</li>
                <li>benefits realization</li>
                <li>program governance</li>
                <li>adoption planning</li>
                <li>cross-functional coordination</li>
              </ul>
              <p><strong>4. Support-specific competencies</strong></p>
              <ul className="list-disc pl-7 space-y-1">
                <li>process modeling</li>
                <li>requirements definition</li>
                <li>architecture development</li>
                <li>testing strategy</li>
                <li>service management</li>
                <li>change impact analysis</li>
              </ul>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">How to build a competency map</h2>
              <ol className="list-decimal pl-7 space-y-1">
                <li>Choose the capability.</li>
                <li>Identify business units, functions, programs, and support roles involved.</li>
                <li>Identify what each role must actually do within that capability.</li>
                <li>Define competencies required for each role.</li>
                <li>List specific skills supporting each competency.</li>
                <li>Assign target proficiency levels.</li>
                <li>Assess current versus required state.</li>
                <li>Convert gaps into action.</li>
              </ol>
              <p>Those actions may include:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>hiring</li>
                <li>role redesign</li>
                <li>training</li>
                <li>coaching</li>
                <li>process simplification</li>
                <li>tooling improvements</li>
                <li>governance changes</li>
                <li>centralizing expertise</li>
                <li>outsourcing selected work</li>
              </ul>
              <p>
                This last point matters. Not every competency gap should be solved by training alone. Sometimes the right response is better tools, better process design, clearer governance, or different role structure.
              </p>
              <img
                src="/skills-how-to-build-competency-map-image.png"
                alt="How to build a competency map: practical enterprise method"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                Why this matters to CEO, CXOs, and CHRO
              </h2>
              <p>For the CEO and Board, this approach creates a clearer picture of execution readiness. It becomes easier to ask:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>Which enterprise abilities matter most now?</li>
                <li>Where are the real constraints?</li>
                <li>Are our leaders and teams ready for the changes we are asking them to make?</li>
              </ul>
              <p>For CXOs and Function Heads, it improves cross-functional alignment and makes it easier to connect growth ambitions to actual readiness in teams, roles, projects, and operations.</p>
              <p>For the CHRO, it creates a stronger bridge between:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>workforce planning</li>
                <li>role design</li>
                <li>leadership development</li>
                <li>learning investment</li>
                <li>succession planning</li>
                <li>readiness for transformation</li>
              </ul>
              <p>
                This is why capability and competency should not be treated as separate from business architecture. When connected properly, they help leadership move from general ambition to structured enterprise readiness.
              </p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-b border-slate-300 pt-8 pb-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Common mistakes to avoid</h2>
              <p>A few mistakes appear frequently.</p>
              <p>One is confusing capabilities with the org chart. A capability is an enterprise ability, not a department name.</p>
              <p>Another is treating competency as only a training topic. Competency is broader; it concerns effective performance in role and context.</p>
              <p>Another is listing skills without linking them back to capabilities. That often produces a fragmented skill catalog instead of a useful readiness model.</p>
              <p>Another is creating one generic competency map for all roles. As the customer onboarding example shows, different roles under the same capability need different competency maps.</p>
              <p>Another is ignoring operations. Competency work that focuses only on strategy or projects but not on steady-state execution will miss a large part of enterprise reality.</p>
              <p>Another is ignoring change management. Changes in process, policy, technology, or organization place new demands on competencies.</p>
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Closing thought</h2>
              <p>
                The Professional Growth Cycle works best when the enterprise knows three things clearly:
                what capabilities it needs, what competencies each role requires, and what skills make those competencies real.
              </p>
              <p>
                That clarity matters from Problem Statement through Operations, and across Corporate, Functional, Program, Support, and Change Management.
              </p>
              <p>
                Capabilities tell you what the enterprise must do. Competencies tell you what specific roles and teams must be able to perform well. Skills tell you what individual abilities support that performance.
              </p>
              <p>
                When those three are connected well, growth becomes more structured, execution becomes more realistic, and readiness becomes easier to see and improve.
              </p>
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

export default ToolsetsPage

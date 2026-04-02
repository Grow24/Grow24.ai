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
                  <p className="text-[12px] font-semibold tracking-wide text-slate-900 mb-3">KEY TAKEAWAYS</p>
                  <p className="text-[14px] leading-[1.45] mb-3">
                    High-performing organizations do not rely on isolated tools or disconnected talent discussions.
                    They align enterprise <strong>capabilities</strong>, role-level <strong>competencies</strong>, and
                    individual <strong>skills</strong> across the full growth cycle.
                  </p>
                  <p className="text-[14px] leading-[1.45] mb-3">
                    A capability defines what the organization must consistently be able to do. A competency defines the
                    readiness a role needs to perform in context. Skills are the practical abilities that make that
                    readiness real.
                  </p>
                  <p className="text-[14px] leading-[1.45]">
                    When these three are mapped together, leaders gain clearer execution visibility, stronger
                    cross-functional alignment, and better decisions across problem framing, planning, projects,
                    operations, and change management.
                  </p>
                </div>
              </div>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Executive Summary</h2>
              <p>
                Every organization moves through a Professional Growth Cycle: <strong>Problem Statement</strong>,
                <strong> Goals</strong>, <strong>Strategy</strong>, <strong>Objectives</strong>, <strong>Plan</strong>,
                <strong> Projects</strong>, and <strong>Operations</strong>, with <strong>Change Management</strong> acting across all of them.
              </p>
              <p>
                To perform that cycle well, the enterprise needs the right <strong>capabilities</strong> at the organization level,
                the right <strong>competencies</strong> at the role level, and the right <strong>skills</strong> at the individual level.
              </p>
              <p>
                A capability is what the enterprise must be able to do. A competency is the integrated readiness a role
                needs to perform effectively. Skills are the specific abilities that make that competency real.
              </p>
              <p>
                When leaders map these properly, they gain a clearer view of execution readiness, hiring priorities,
                role design, learning needs, and operational strength.
              </p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">What is a capability?</h2>
              <p>
                A <strong>capability</strong> is what the enterprise must be able to do. It is not the same as a department,
                a job title, a software application, a single process, or a current org chart box.
              </p>
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
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">What is a competency?</h2>
              <p>
                A <strong>competency</strong> is the integrated readiness needed to perform effectively in a given role
                or context. It is broader than knowledge and usually includes:
              </p>
              <ul className="list-disc pl-7 space-y-1">
                <li>knowledge</li>
                <li>judgment</li>
                <li>applied skill</li>
                <li>role behavior</li>
                <li>decision quality</li>
                <li>ability to perform consistently in context</li>
              </ul>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">What are skills?</h2>
              <p>Skills are the granular abilities that support a competency.</p>
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
                Capability is what the enterprise must do. Competency is what a role must do well.
                Skills are the individual abilities that support that competency.
              </p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                Why all three matter across the full Professional Growth Cycle
              </h2>
              <p>These distinctions matter across:</p>
              <p className="font-semibold text-slate-900">
                Problem Statement -&gt; Goals -&gt; Strategy -&gt; Objectives -&gt; Plan -&gt; Projects -&gt; Operations
              </p>
              <p>
                At each stage, the organization needs the right capability and people need the right competencies.
                Across all stages, change management is essential because every change in policy, process, technology,
                or organization places new competency demands.
              </p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">The enterprise-wide scope</h2>
              <p>Capability and competency should be modeled across the enterprise, not one function only:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>Corporate</li>
                <li>Functional</li>
                <li>Program</li>
                <li>Support</li>
                <li>Projects and Operations execution chain</li>
              </ul>
              <p>
                This helps leadership connect business architecture, value delivery, organization, and information
                into one coherent decision framework.
              </p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                Customer Onboarding Management example
              </h2>
              <p>
                Consider one enterprise capability: <strong>Customer Onboarding Management</strong>.
                It is usually cross-functional and can involve Sales, Operations, Product, Customer Service,
                Risk/Compliance, Support Services, and Technology teams.
              </p>
              <p className="font-semibold text-slate-900">
                The organization must be able to take a customer from initial commitment to successful activation
                in a controlled, efficient, and compliant manner.
              </p>
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
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                Four competency families to model
              </h2>
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
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-slate-300 pt-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                Why this matters to CEO, CXOs, and CHRO
              </h2>
              <p>For leadership, this model clarifies execution readiness and supports better enterprise decisions.</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>Which enterprise abilities matter most now?</li>
                <li>Where are the real constraints?</li>
                <li>Are leaders and teams ready for required changes?</li>
              </ul>
              <p>
                It also strengthens the bridge between workforce planning, role design, leadership development,
                learning investment, succession planning, and transformation readiness.
              </p>
            </section>

            <section className="relative space-y-5 text-[17px] leading-[1.48] text-slate-700 font-normal max-w-[980px] border-t border-b border-slate-300 pt-8 pb-8">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Common mistakes to avoid</h2>
              <ul className="list-disc pl-7 space-y-1">
                <li>Confusing capabilities with the org chart</li>
                <li>Treating competency only as a training topic</li>
                <li>Listing skills without linking them to capabilities</li>
                <li>Using one generic competency map for all roles</li>
                <li>Ignoring operations in favor of only strategy/projects</li>
                <li>Ignoring change management</li>
              </ul>
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Closing thought</h2>
              <p>
                The Professional Growth Cycle works best when the enterprise knows clearly what capabilities it needs,
                what competencies each role requires, and what skills make those competencies real.
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

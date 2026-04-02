import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/project')({
  component: ProjectPage,
})

function ProjectPage() {
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
                Project Management: Turning Plans into Delivered Results
              </h1>
              <p>
                Organizations do not create value through intent alone. They create value when intent is converted into
                coordinated action, and when that action leads to a usable outcome.
              </p>
              <p>
                Many initiatives begin with clarity of ambition, executive approval, and capable teams. Yet a surprising
                number still slow down, drift, or under-deliver. The reason is often not lack of effort. It is lack of
                disciplined execution.
              </p>
              <p>
                For business professionals, Project Management helps move an initiative from approved plan to delivered
                result. For project professionals, it is the structured discipline of planning, sequencing, governing,
                monitoring, and steering a temporary effort toward a defined outcome.
              </p>
              <p>
                Within PBMP, Project Management is not treated as an isolated scheduling activity. It is part of a
                connected business flow that links goals, strategy, planning, delivery, and operations.
              </p>
            </section>

            <section className="relative pt-2">
              <div className="overflow-hidden rounded-[2px] relative border border-slate-200/70">
                <img
                  src="/project-hero8.png"
                  alt="Project management visual"
                  className="w-full h-auto block object-contain bg-white"
                />
                <img
                  src="/project-key-takeaways.png"
                  alt="Project key takeaways"
                  className="absolute left-8 top-9 w-[440px] max-w-[92%] h-auto rounded-2xl border border-white/40 shadow-[0_10px_28px_rgba(0,0,0,0.2)]"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                Why Project Management Matters to Business Professionals
              </h2>
              <p>
                Business leaders do not usually want Project Management for its own sake. They want execution visibility,
                predictability, accountability, and results.
              </p>
              <p>
                They want approved initiatives to move forward in a controlled and intelligible way, with fewer
                surprises, earlier warning signals, and better decisions when issues arise.
              </p>
              <p>
                Without Project Management, organizations often confuse motion with progress. Teams stay busy, meetings
                continue, and documents multiply, but key dependencies may remain unresolved and critical decisions may
                not happen at the speed required.
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">What Project Management Actually Means</h2>
              <p>
                Project Management is the structured management of a temporary effort undertaken to deliver a defined
                output, capability, product, service, or business change.
              </p>
              <p>
                Real Project Management is about integration. It brings together scope, time, dependencies, resources,
                costs, risks, stakeholders, decisions, and changes into one managed execution system.
              </p>
              <p>
                A project rarely struggles because there is no activity. It struggles because activity is not connected,
                prioritized, and governed well enough to produce the intended outcome.
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                The Core Elements of Good Project Management
              </h2>
              <p>Strong Project Management rests on several connected elements.</p>
              <p>
                The first is scope: shared understanding of what is included, excluded, and what constitutes completion.
              </p>
              <p>
                The second is time and sequencing: milestones matter, but the real discipline is understanding sequence.
              </p>
              <p>
                The third is resources: projects need people, skills, budget, tools, and sometimes external support.
              </p>
              <p>
                The fourth is risk and issue management: uncertainty must be identified, assessed, and actively managed.
              </p>
              <p>
                The fifth is governance: who approves scope changes, who resolves cross-functional conflicts, and who
                decides trade-offs between schedule, cost, and features.
              </p>
              <p>
                The sixth is stakeholder alignment: sponsors, delivery teams, dependent functions, and users need shared
                expectations and decision clarity.
              </p>
              <p>
                The seventh is progress and control: status tracking, variance analysis, reforecasting, and change
                control to know whether delivery is moving as intended.
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Why Projects Struggle in the Real World</h2>
              <p>
                Projects often struggle for reasons that are both common and preventable: unclear scope, shifting
                priorities without disciplined replanning, unrealistic timelines, unresolved risks, and weak control.
              </p>
              <p>
                There is also a recurring gap between business and delivery perspectives. Business stakeholders may focus
                on urgency, while delivery teams focus on feasibility and sequence.
              </p>
              <p>
                Most projects do not fail because teams are careless. They struggle because complexity is underestimated
                and interdependencies are not made visible early enough.
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                Why Dependencies and Critical Path Matter
              </h2>
              <p>
                Not all tasks carry equal schedule importance. Some directly constrain the completion date because other
                work depends on them.
              </p>
              <p>
                The critical path is the sequence of dependent tasks that determines the overall finish date. If one
                slips and no corrective action is taken, the end date slips too.
              </p>
              <p>
                Good Project Management is not only about monitoring how much work is done. It is about monitoring
                whether the right work is done at the right time in the right sequence.
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                What Modern Project Management Should Look Like
              </h2>
              <p>
                Modern Project Management should be dynamic, connected, and decision-oriented. It should provide live
                visibility into dependencies, ownership, progress, decision points, changes, and risks.
              </p>
              <p>
                It should move beyond static planning documents and fragmented follow-up, and quickly connect delays to
                downstream impact and required decisions.
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                Where Project Management Fits in the Bigger Business Flow
              </h2>
              <p className="font-semibold text-slate-900">
                Goal -&gt; Strategy -&gt; Objectives -&gt; Plan -&gt; Project -&gt; Operations
              </p>
              <p>
                Projects are not operations. Projects are temporary and change-oriented; operations are ongoing and
                repeatable. A project builds or enables capability, and operations then use that capability at scale.
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">How PBMP Supports Project Management</h2>
              <p>
                Within PBMP, Project Management sits inside a broader management and execution ecosystem. It helps teams
                define work clearly, assign ownership, structure schedules, visualize dependencies, monitor progress, and
                handle changes in a controlled way.
              </p>
              <p>
                This linkage lets projects be understood in relation to plans, objectives, and strategic intent from
                which they originated.
              </p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">
                Project Management Is Both a Discipline and a Capability
              </h2>
              <p>
                Project Management is often associated with project managers and PMOs. That is correct, but incomplete.
                In mature organizations, it is also a capability that improves confidence in delivery and cross-functional
                transparency.
              </p>
            </section>

            <section className="border-t border-b border-slate-300 pt-8 pb-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">Closing Thought</h2>
              <p>
                Whether the initiative is a rollout, launch, redesign, or expansion, the same challenge remains: moving
                from approved intent to coordinated execution and delivered results.
              </p>
              <p>
                Within PBMP, Project Management becomes part of a connected flow that links goals, strategy, plans,
                projects, and operations into one coherent management system.
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

export default ProjectPage

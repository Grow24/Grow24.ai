import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/toolset')({
  component: ToolsetPage,
})

function ToolsetPage() {
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
            <section className="space-y-2">
              <p className="text-[36px] leading-[1.2] font-semibold text-slate-900">
                How CXOs use Tools, Techniques, Templates, Artifacts, Rules, and Channels to turn intention into
                business outcomes
              </p>
            </section>

            <section className="relative pt-2">
              <div className="overflow-hidden rounded-[2px] relative border border-slate-200/70">
                <img
                  src="/toolset-main-hero.png"
                  alt="Toolset main visual"
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
                    A toolset is not just an app stack. It is a purposeful combination of tools, techniques,
                    templates, artifacts, and rules used by roles through channels to fulfill intents and produce outcomes.
                  </p>
                  <p className="text-[14px] leading-[1.45] mb-3">
                    Business value comes from how the full set works together in operations, not from isolated software usage.
                  </p>
                  <p className="text-[14px] leading-[1.45]">
                    The right roles, using the right toolset, through the right channels, create measurable execution performance.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">1. Opening: why "toolset" is often misunderstood</h2>
              <p>Start by challenging the usual view.</p>
              <p>Most people think a toolset is just:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>a bundle of software,</li>
                <li>a stack of apps,</li>
                <li>or a set of subscriptions.</li>
              </ul>
              <p>But for a CXO, that is not enough. A real toolset is what enables an organization to fulfill an intention properly, repeatedly, and at scale.</p>
              <p>Use the sales example immediately:</p>
              <p>A Sales Head does not need "just a CRM."<br />They need a way to improve sales productivity, territory coverage, conversion, forecast quality, travel efficiency, and ROI.</p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">2. What is a Toolset?</h2>
              <p>Introduce the core definition early.</p>
              <p>A <strong>Toolset</strong> is a purposeful collection of:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li><strong>Tools</strong></li>
                <li><strong>Techniques</strong></li>
                <li><strong>Templates</strong></li>
                <li><strong>Artifacts</strong></li>
                <li><strong>Rules / Constraints</strong></li>
              </ul>
              <p>used by Roles, through Channels, to fulfill Intents.</p>
              <p>Then simplify it:<br />A toolset is the complete working arrangement needed to get important work done well.</p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">3. The five building blocks of a Toolset</h2>
              <p>Explain each one with the running sales example.</p>

              <h3 className="text-[32px] leading-[1.12] font-semibold text-slate-900">Tools</h3>
              <p>What is used to do the work.<br />Examples in sales:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>web app</li>
                <li>dashboard</li>
                <li>mobile app</li>
                <li>spreadsheet</li>
                <li>presentation tool</li>
                <li>CRM</li>
              </ul>

              <h3 className="text-[32px] leading-[1.12] font-semibold text-slate-900">Techniques</h3>
              <p>What brings logic into the work.<br />Examples:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>territory design logic</li>
                <li>sales productivity analysis</li>
                <li>pipeline analysis</li>
                <li>ROI calculation</li>
                <li>lead scoring</li>
                <li>forecast logic</li>
              </ul>

              <h3 className="text-[32px] leading-[1.12] font-semibold text-slate-900">Templates</h3>
              <p>What gives reusable structure.<br />Examples:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>account review template</li>
                <li>territory plan template</li>
                <li>sales forecast template</li>
                <li>sales call report template</li>
                <li>incentive plan template</li>
              </ul>

              <h3 className="text-[32px] leading-[1.12] font-semibold text-slate-900">Artifacts</h3>
              <p>What gets created, updated, reviewed, stored, and transmitted.<br />Examples:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>territory plan</li>
                <li>opportunity record</li>
                <li>sales forecast sheet</li>
                <li>dashboard snapshot</li>
                <li>route plan</li>
                <li>review presentation</li>
                <li>ROI analysis report</li>
              </ul>

              <h3 className="text-[32px] leading-[1.12] font-semibold text-slate-900">Rules / Constraints</h3>
              <p>What governs what is allowed, required, or conditional.<br />Examples:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>deal approval thresholds</li>
                <li>mandatory fields before forecast submission</li>
                <li>role-based access</li>
                <li>territory assignment rules</li>
                <li>pricing exception rules</li>
              </ul>
              <img
                src="/toolset-structure-image-1.png"
                alt="Image 1 - The Toolset Structure"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">4. Interwoven example: Sales Performance and Territory Optimization</h2>
              <p>Introduce the full example clearly.</p>
              <p>A CXO or Sales Head wants to improve:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>revenue productivity,</li>
                <li>territory balance,</li>
                <li>pipeline quality,</li>
                <li>coverage efficiency,</li>
                <li>forecast reliability,</li>
                <li>and salesforce ROI.</li>
              </ul>
              <p>That cannot be done through one app alone. It needs a toolset.</p>
              <p>This section establishes the business context before deeper explanation.</p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">5. Why a Toolset is more than Tools</h2>
              <p>Use the example to show why software alone is insufficient.</p>
              <p>A dashboard alone cannot improve sales performance.<br />A forecast sheet alone cannot improve forecast quality.<br />A territory plan template alone cannot rebalance coverage.<br />A CRM alone cannot guarantee better sales productivity.</p>
              <p>What matters is the combination:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>tools to capture and view,</li>
                <li>techniques to analyze and decide,</li>
                <li>templates to structure,</li>
                <li>artifacts to carry the work,</li>
                <li>rules to govern it.</li>
              </ul>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">6. Where Channels come in</h2>
              <p>Now introduce Channels clearly.</p>
              <p>A Toolset does not operate in isolation. It is used through <strong>Channels</strong>.</p>
              <p>Explain simply:<br />A Channel is the source-to-destination path through which Resources flow.</p>
              <p>Apply it to sales:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>a Sales Rep updates opportunity data through a <strong>Web App or Mobile App</strong></li>
                <li>a manager reviews a forecast through a <strong>Web browser</strong></li>
                <li>approvals may move through <strong>Emailing and Web App approval</strong></li>
                <li>system updates may happen through <strong>API</strong></li>
                <li>presentations may be shared through <strong>Meeting / presentation channels</strong></li>
                <li>field visits happen through <strong>Road / physical transport channel</strong></li>
              </ul>
              <p>Also mention channel sequence lightly:<br />A sales review may involve:<br />Mobile App entry -&gt; API update -&gt; Dashboard refresh -&gt; Email alert -&gt; Web App approval</p>
              <img
                src="/toolset-channels-image-2.png"
                alt="Image 2 - How a Toolset Works Through Channels"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">7. Role -&gt; Intent -&gt; Toolset -&gt; Channel -&gt; Outcome</h2>
              <p>This is the central explanatory section.</p>
              <p>Show that a Role fulfills an Intent by:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>using Tools,</li>
                <li>applying Techniques,</li>
                <li>following Templates,</li>
                <li>creating/updating Artifacts,</li>
                <li>under Rules,</li>
                <li>through Channels.</li>
              </ul>
              <p>Use several small sales examples in prose:</p>
              <p>A Sales Rep wants to update customer visit outcomes.<br />A Regional Manager wants to review territory performance.<br />A Sales Head wants to compare forecast vs target.<br />A Finance partner wants to evaluate sales ROI.<br />An operations team wants to rebalance territories.</p>
              <p>This section should make the model feel real.</p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">8. Toolsets across lifecycle and operations</h2>
              <p>Show that the toolset is not only for planning.</p>
              <p>In the sales example, the toolset is used across:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>defining targets,</li>
                <li>designing territories,</li>
                <li>building reports/apps,</li>
                <li>deploying workflows,</li>
                <li>and then most importantly in <strong>Operations</strong>.</li>
              </ul>
              <p>In Operations, users:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>access dashboards,</li>
                <li>fill forms,</li>
                <li>update opportunities,</li>
                <li>traverse workflows,</li>
                <li>review forecasts,</li>
                <li>trigger approvals,</li>
                <li>create apps/configurations,</li>
                <li>raise exceptions,</li>
                <li>and monitor outcomes.</li>
              </ul>
              <p>This is where value is actually created.</p>
              <img
                src="/toolset-operational-image-3.png"
                alt="Image 3 - Toolset in Operational Use"
                className="w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">9. Toolsets are purposeful, not random</h2>
              <p>Make the design point.</p>
              <p>A toolset is not just a list of whatever software happens to exist.<br />It is a purposeful collection arranged around a business intention.</p>
              <p>For sales performance, the intention is not "use CRM."<br />The intention is "improve sales productivity and business performance."</p>
              <p>That is why the pieces must work together coherently.</p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">10. What a Toolset is not</h2>
              <p>Short cleanup section.</p>
              <p>A toolset is not:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>just an app stack,</li>
                <li>just a license bundle,</li>
                <li>just a feature list,</li>
                <li>just dashboards,</li>
                <li>just templates,</li>
                <li>or just data.</li>
              </ul>
              <p>It is the working combination needed to fulfill real business intent.</p>
            </section>

            <section className="border-t border-slate-300 pt-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">11. Why this matters in PBMP</h2>
              <p>Now connect to PBMP.</p>
              <p>In PBMP, users should not think only in terms of applications.<br />They should think in terms of intentions and the toolsets needed to fulfill them.</p>
              <p>For a Sales Head, that means not just "sales software," but a toolset that supports:</p>
              <ul className="list-disc pl-7 space-y-1">
                <li>planning,</li>
                <li>review,</li>
                <li>execution,</li>
                <li>governance,</li>
                <li>and operational value creation.</li>
              </ul>
            </section>

            <section className="border-t border-b border-slate-300 pt-8 pb-8 space-y-4 text-[17px] leading-[1.45] text-slate-700">
              <h2 className="text-[42px] leading-[1.1] font-semibold text-slate-900">12. Closing</h2>
              <p>End with a strong line.</p>
              <p>A toolset is not the software an organization owns.<br />It is the structured capability an organization uses to turn intent into results.</p>
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

export default ToolsetPage

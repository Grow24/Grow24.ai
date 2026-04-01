import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/toolsets')({
  component: ToolsetsPage,
})

function ToolsetsPage() {
  return (
    <div className="min-h-screen bg-[#efefef] text-[#111] mt-[-70px]">
      <main className="mx-auto w-full max-w-[1400px] px-2 md:px-3 lg:px-4 py-8">
        <section className="mx-auto max-w-[740px] space-y-9 text-[22px] leading-[1.55]">
          <div className="space-y-3">
            <h2 className="text-[44px] font-bold leading-tight">1. Opening: why &quot;toolset&quot; is often misunderstood</h2>
            <p>Start by challenging the usual view.</p>
            <p>Most people think a toolset is just:</p>
            <ul className="list-disc pl-8 space-y-1">
              <li>a bundle of software,</li>
              <li>a stack of apps,</li>
              <li>or a set of subscriptions.</li>
            </ul>
            <p>But for a CXO, that is not enough. A real toolset is what enables an organization to fulfill an intention properly, repeatedly, and at scale.</p>
            <p>Use the sales example immediately:</p>
            <p>A Sales Head does not need &quot;just a CRM.&quot;<br />They need a way to improve sales productivity, territory coverage, conversion, forecast quality, travel efficiency, and ROI.</p>
          </div>

          <hr className="border-slate-300" />

          <div className="space-y-3">
            <h2 className="text-[44px] font-bold leading-tight">2. What is a Toolset?</h2>
            <p>Introduce the core definition early.</p>
            <p>A <strong>Toolset</strong> is a purposeful collection of:</p>
            <ul className="list-disc pl-8 space-y-1">
              <li><strong>Tools</strong></li>
              <li><strong>Techniques</strong></li>
              <li><strong>Templates</strong></li>
              <li><strong>Artifacts</strong></li>
              <li><strong>Rules / Constraints</strong></li>
            </ul>
            <p>used by Roles, through Channels, to fulfill Intents.</p>
            <p>Then simplify it:<br />A toolset is the complete working arrangement needed to get important work done well.</p>
          </div>

          <hr className="border-slate-300" />

          <div className="space-y-4">
            <h2 className="text-[44px] font-bold leading-tight">3. The five building blocks of a Toolset</h2>
            <p>Explain each one with the running sales example.</p>

            <div>
              <h3 className="text-[34px] font-bold">Tools</h3>
              <p>What is used to do the work.<br />Examples in sales:</p>
              <ul className="list-disc pl-8 space-y-1">
                <li>web app</li>
                <li>dashboard</li>
                <li>mobile app</li>
                <li>spreadsheet</li>
                <li>presentation tool</li>
                <li>CRM</li>
              </ul>
            </div>

            <div>
              <h3 className="text-[34px] font-bold">Techniques</h3>
              <p>What brings logic into the work.<br />Examples:</p>
              <ul className="list-disc pl-8 space-y-1">
                <li>territory design logic</li>
                <li>sales productivity analysis</li>
                <li>pipeline analysis</li>
                <li>ROI calculation</li>
                <li>lead scoring</li>
                <li>forecast logic</li>
              </ul>
            </div>

            <div>
              <h3 className="text-[34px] font-bold">Templates</h3>
              <p>What gives reusable structure.<br />Examples:</p>
              <ul className="list-disc pl-8 space-y-1">
                <li>account review template</li>
                <li>territory plan template</li>
                <li>sales forecast template</li>
                <li>sales call report template</li>
                <li>incentive plan template</li>
              </ul>
            </div>

            <div>
              <h3 className="text-[34px] font-bold">Artifacts</h3>
              <p>What gets created, updated, reviewed, stored, and transmitted.<br />Examples:</p>
              <ul className="list-disc pl-8 space-y-1">
                <li>territory plan</li>
                <li>opportunity record</li>
                <li>sales forecast sheet</li>
                <li>dashboard snapshot</li>
                <li>route plan</li>
                <li>review presentation</li>
                <li>ROI analysis report</li>
              </ul>
            </div>

            <div>
              <h3 className="text-[34px] font-bold">Rules / Constraints</h3>
              <p>What governs what is allowed, required, or conditional.<br />Examples:</p>
              <ul className="list-disc pl-8 space-y-1">
                <li>deal approval thresholds</li>
                <li>mandatory fields before forecast submission</li>
                <li>role-based access</li>
                <li>territory assignment rules</li>
                <li>pricing exception rules</li>
              </ul>
              <img
                src="/toolsets-image-1.png"
                alt="How a Sales Toolset Works Through Channels"
                className="mt-5 block w-full h-auto rounded-sm border border-slate-300"
                loading="lazy"
                draggable={false}
              />
            </div>
          </div>

          <hr className="border-slate-300" />

          <div className="space-y-3">
            <h2 className="text-[44px] font-bold leading-tight">4. Interwoven example: Sales Performance and Territory Optimization</h2>
            <p>Introduce the full example clearly.</p>
            <p>A CXO or Sales Head wants to improve:</p>
            <ul className="list-disc pl-8 space-y-1">
              <li>revenue productivity,</li>
              <li>territory balance,</li>
              <li>pipeline quality,</li>
              <li>coverage efficiency,</li>
              <li>forecast reliability,</li>
              <li>and salesforce ROI.</li>
            </ul>
            <p>That cannot be done through one app alone. It needs a toolset.</p>
            <p>This section establishes the business context before deeper explanation.</p>
          </div>

          <hr className="border-slate-300" />

          <div className="space-y-3">
            <h2 className="text-[44px] font-bold leading-tight">5. Why a Toolset is more than Tools</h2>
            <p>Use the example to show why software alone is insufficient.</p>
            <p>A dashboard alone cannot improve sales performance.<br />A forecast sheet alone cannot improve forecast quality.<br />A territory plan template alone cannot rebalance coverage.<br />A CRM alone cannot guarantee better sales productivity.</p>
            <p>What matters is the combination:</p>
            <ul className="list-disc pl-8 space-y-1">
              <li>tools to capture and view,</li>
              <li>techniques to analyze and decide,</li>
              <li>templates to structure,</li>
              <li>artifacts to carry the work,</li>
              <li>rules to govern it.</li>
            </ul>
          </div>

          <hr className="border-slate-300" />

          <div className="space-y-3">
            <h2 className="text-[44px] font-bold leading-tight">6. Where Channels come in</h2>
            <p>Now introduce Channels clearly.</p>
            <p>A Toolset does not operate in isolation. It is used through <strong>Channels</strong>.</p>
            <p>Explain simply:<br />A Channel is the source-to-destination path through which Resources flow.</p>
            <p>Apply it to sales:</p>
            <ul className="list-disc pl-8 space-y-1">
              <li>a Sales Rep updates opportunity data through a <strong>Web App or Mobile App</strong></li>
              <li>a manager reviews a forecast through a <strong>Web browser</strong></li>
              <li>approvals may move through <strong>Emailing and Web App approval</strong></li>
              <li>system updates may happen through <strong>API</strong></li>
              <li>presentations may be shared through <strong>Meeting / presentation channels</strong></li>
              <li>field visits happen through <strong>Road / physical transport channel</strong></li>
            </ul>
            <p>Also mention channel sequence lightly:<br />A sales review may involve:<br />Mobile App entry -&gt; API update -&gt; Dashboard refresh -&gt; Email alert -&gt; Web App approval</p>
            <p><strong>Image 2</strong><br /><strong>Image name:</strong> Image 2 - How a Toolset Works Through Channels</p>
          </div>

          <hr className="border-slate-300" />

          <div className="space-y-3">
            <h2 className="text-[44px] font-bold leading-tight">7. Role -&gt; Intent -&gt; Toolset -&gt; Channel -&gt; Outcome</h2>
            <p>This is the central explanatory section.</p>
            <p>Show that a Role fulfills an Intent by:</p>
            <ul className="list-disc pl-8 space-y-1">
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
          </div>

          <hr className="border-slate-300" />

          <div className="space-y-3">
            <h2 className="text-[44px] font-bold leading-tight">8. Toolsets across lifecycle and operations</h2>
            <p>Show that the toolset is not only for planning.</p>
            <p>In the sales example, the toolset is used across:</p>
            <ul className="list-disc pl-8 space-y-1">
              <li>defining targets,</li>
              <li>designing territories,</li>
              <li>building reports/apps,</li>
              <li>deploying workflows,</li>
              <li>and then most importantly in <strong>Operations</strong>.</li>
            </ul>
            <p>In Operations, users:</p>
            <ul className="list-disc pl-8 space-y-1">
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
          </div>

          <hr className="border-slate-300" />

          <div className="space-y-3">
            <h2 className="text-[44px] font-bold leading-tight">9. Toolsets are purposeful, not random</h2>
            <p>Make the design point.</p>
            <p>A toolset is not just a list of whatever software happens to exist.<br />It is a purposeful collection arranged around a business intention.</p>
            <p>For sales performance, the intention is not &quot;use CRM.&quot;<br />The intention is &quot;improve sales productivity and business performance.&quot;</p>
            <p>That is why the pieces must work together coherently.</p>
          </div>

          <hr className="border-slate-300" />

          <div className="space-y-3">
            <h2 className="text-[44px] font-bold leading-tight">10. What a Toolset is not</h2>
            <p>Short cleanup section.</p>
            <p>A toolset is not:</p>
            <ul className="list-disc pl-8 space-y-1">
              <li>just an app stack,</li>
              <li>just a license bundle,</li>
              <li>just a feature list,</li>
              <li>just dashboards,</li>
              <li>just templates,</li>
              <li>or just data.</li>
            </ul>
            <p>It is the working combination needed to fulfill real business intent.</p>
          </div>

          <hr className="border-slate-300" />

          <div className="space-y-3">
            <h2 className="text-[44px] font-bold leading-tight">11. Why this matters in PBMP</h2>
            <p>Now connect to PBMP.</p>
            <p>In PBMP, users should not think only in terms of applications.<br />They should think in terms of intentions and the toolsets needed to fulfill them.</p>
            <p>For a Sales Head, that means not just &quot;sales software,&quot; but a toolset that supports:</p>
            <ul className="list-disc pl-8 space-y-1">
              <li>planning,</li>
              <li>review,</li>
              <li>execution,</li>
              <li>governance,</li>
              <li>and operational value creation.</li>
            </ul>
          </div>

          <hr className="border-slate-300" />

          <div className="space-y-3 pb-6">
            <h2 className="text-[44px] font-bold leading-tight">12. Closing</h2>
            <p>End with a strong line.</p>
            <p>A toolset is not the software an organization owns.<br />It is the structured capability an organization uses to turn intent into results.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ToolsetsPage

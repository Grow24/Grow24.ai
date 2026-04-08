import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/project-management')({
  component: ProjectManagementPage,
})

function MappingCard({
  title,
  points,
}: {
  title: string
  points: string[]
}) {
  return (
    <div className="rounded-xl border border-slate-300 bg-white p-4">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <ul className="list-disc pl-5 space-y-1 text-base leading-relaxed text-slate-700">
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </div>
  )
}

function UberSolutionOutcomesMap() {
  return (
    <div className="rounded-xl border border-slate-300 bg-white overflow-hidden">
      <div className="bg-slate-900 text-white px-5 py-4">
        <h3 className="text-2xl font-bold">Solution-to-Outcomes Mapping</h3>
        <p className="text-sm text-slate-200">Example: Uber</p>
      </div>

      <div className="px-4 md:px-5 py-4 md:py-5 space-y-5">
        <div className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3">
          <p className="text-sm font-semibold text-slate-800 mb-1">Top Governing Thought</p>
          <p className="text-sm text-slate-700">
            Uber created a better transport-access solution by replacing uncertainty, friction, and weak trust
            with a digitally enabled, transparent, repeatable process. This improved customer outcomes and strengthened
            business metrics such as revenue growth, operating leverage, cash conversion, and brand equity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <MappingCard
            title="1) Why a Better Solution Was Needed"
            points={[
              'Target audience: urban commuters and travelers',
              'Needs: reliability, convenience, speed, ETA visibility, trust, safety',
              'Gap in As-Is: uncertain discovery, unclear arrival/fare, payment friction',
              'Conclusion: existing process did not adequately meet user needs',
            ]}
          />
          <MappingCard
            title="2) What Changed in the Better Solution"
            points={[
              'Instant digital ride discovery',
              'ETA and route visibility',
              'Seamless in-app digital payment',
              'Driver identity, ratings, and trip history',
              'Reduced uncertainty and improved repeatability',
            ]}
          />
          <MappingCard
            title="3) Why This Mattered to Outcomes"
            points={[
              'Customer: easier access, faster booking, stronger confidence',
              'Operating: improved matching and higher completion rates',
              'Enterprise: stronger revenue, cash logic, and brand equity',
              'Conclusion: better process drove stronger business performance',
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MappingCard
            title="As-Is Process Effects"
            points={[
              'Low predictability and low transparency',
              'Weak trust and inconsistent experience',
              'Lower demand conversion and repeat usage',
              'Lost rides and weaker service consistency',
            ]}
          />
          <MappingCard
            title="To-Be Process Effects"
            points={[
              'Higher transparency and higher trust',
              'Better friction control and completion ease',
              'More repeat usage and stronger platform continuity',
              'Improved rider and driver experience',
            ]}
          />
        </div>

        <div className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3">
          <p className="text-sm font-semibold text-slate-800 mb-2">How Process Improvements Link to Company Metrics</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2.5 text-sm">
            <div className="rounded-md border border-slate-300 bg-white p-2.5"><strong>Revenue / P&amp;L:</strong> better conversion and repeat usage support stronger growth.</div>
            <div className="rounded-md border border-slate-300 bg-white p-2.5"><strong>Operating Efficiency:</strong> better matching and lower friction improve utilization.</div>
            <div className="rounded-md border border-slate-300 bg-white p-2.5"><strong>Cash Flow:</strong> digital payments improve visibility and collection speed.</div>
            <div className="rounded-md border border-slate-300 bg-white p-2.5"><strong>Capital Logic:</strong> scalable platform model can operate with lighter assets.</div>
            <div className="rounded-md border border-slate-300 bg-white p-2.5"><strong>Brand Equity:</strong> transparency and trust strengthen loyalty and recall.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectManagementPage() {
  return (
    <div className="min-h-screen bg-white text-[#111] mt-[-70px]">
      <main className="mx-auto w-full max-w-[1400px] px-2 md:px-3 lg:px-4 py-8 space-y-12">
        <section className="space-y-6">
          <h1 className="text-5xl font-bold">What Is a Solution?</h1>
          <div className="overflow-hidden rounded-[2px] relative border border-slate-200/70">
            <img
              src="/project-management/solution-key-takeaways.png"
              alt="Solution key takeaways visual"
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
                A solution is not just software, dashboards, or workflow screens. Those can be components, but the real
                solution is the full To-Be arrangement that helps a target audience move from an unsatisfactory As-Is
                state to a better, measurable To-Be state.
              </p>
              <p className="text-[14px] leading-[1.45] mb-3">
                Every meaningful solution begins with a gap: audience needs and wants are not being adequately addressed
                by the current solution. That gap can be about downside risk, upside opportunity, or both.
              </p>
              <p className="text-[14px] leading-[1.45] mb-3">
                Strong solution design goes beyond features. It must show how the To-Be process closes the As-Is gap and
                improves customer outcomes, operating outcomes, and enterprise outcomes.
              </p>
              <p className="text-[14px] leading-[1.45]">
                In practical terms, if we cannot clearly explain target audience, gap, As-Is, To-Be, and outcome impact,
                we have not yet earned the right to call it a solution.
              </p>
            </div>
          </div>
          <p className="text-2xl leading-relaxed">
            When people hear the word <strong>solution</strong>, they often think of software.
          </p>
          <p className="text-2xl leading-relaxed">
            A screen.<br />
            A dashboard.<br />
            A workflow.<br />
            A mobile app.<br />
            A portal with a login page and a few reports.
          </p>
          <p className="text-2xl leading-relaxed">
            But that is not yet a real solution.
          </p>
          <p className="text-2xl leading-relaxed">
            Software may be part of a solution. So may documents, workflows, rules, metrics, interfaces, and operating procedures.
            But none of those, by themselves, are enough. A solution is something larger and more purposeful.
          </p>
          <p className="text-2xl leading-relaxed">
            A solution exists because a specific <strong>target audience</strong> has <strong>needs and/or wants</strong> that are not being adequately
            addressed by the <strong>current solution</strong>. That inadequacy creates a <strong>gap</strong>. And that gap matters because it is linked
            either to covering an existing or upcoming downside, or to leveraging an existing or upcoming upside.
          </p>
          <p className="text-2xl leading-relaxed">
            That is the right place to begin.
          </p>
          <p className="text-2xl leading-relaxed">
            A solution is not simply something you build. It is something you design so that a target audience can move from an
            unsatisfactory <strong>As-Is</strong> state to a better <strong>To-Be</strong> state.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-5xl font-bold">Every Solution Begins with a Gap</h2>
          <p className="text-2xl leading-relaxed">
            A lot of people define problems too loosely. They say things like, &quot;We need an app,&quot; or &quot;We need a better dashboard,&quot; or
            &quot;We need a system for this.&quot; But that jumps too early into implementation. It confuses the visible artifact with the real need.
          </p>
          <p className="text-2xl leading-relaxed">
            The better way is to begin with the audience and the gap.
          </p>
          <p className="text-2xl leading-relaxed">
            A target audience has needs and/or wants. The current solution does not meet them well enough. That creates a gap.
          </p>
          <p className="text-2xl leading-relaxed">
            That gap may be linked to <strong>downside</strong>. For example, the current solution may expose the audience to weaknesses,
            diminishing strengths, threats, or fading opportunities. Or the gap may be linked to <strong>upside</strong>. New strengths may be emerging.
            Weaknesses may be shrinking. Threats may be declining. New opportunities may be opening up. But the current solution is
            not equipped to capture that upside.
          </p>
          <p className="text-2xl leading-relaxed">
            This is important because it broadens the meaning of &quot;problem.&quot;
          </p>
          <p className="text-2xl leading-relaxed">
            A problem is not always something broken, failing, or negative. Sometimes the problem is that the current solution is too weak,
            slow, fragmented, or outdated to help people capture a new advantage.
          </p>
          <p className="text-2xl leading-relaxed">
            In that sense, a good solution does two things. It protects against downside. And it helps capture upside.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-5xl font-bold">Uber Is a Good Example</h2>
          <p className="text-2xl leading-relaxed">To understand what a solution really is, it helps to look at a familiar example.</p>
          <p className="text-2xl leading-relaxed">Take Uber.</p>
          <p className="text-2xl leading-relaxed">
            At a superficial level, one might say Uber solved the problem of &quot;getting a taxi.&quot; But that is too shallow. People did not merely need
            a taxi. They needed and wanted a transport experience that was reliable, convenient, transparent, safe, predictable, and easy to complete.
          </p>
          <p className="text-2xl leading-relaxed">
            The real issue was not transport in the abstract. It was the quality of the <strong>transport-access process.</strong>
          </p>
          <p className="text-2xl leading-relaxed">
            In the <strong>current solution</strong>, which was the traditional As-Is experience in many places, a person often had to physically search
            for a taxi or stand roadside and wait. Availability was uncertain. Wait time was unclear. Fare confidence was weak.
            Driver identity and route visibility were limited. Payment was often inconvenient. And the overall experience did not always
            create trust, repeatability, or ease.
          </p>
          <p className="text-2xl leading-relaxed">
            That is the kind of gap a real solution addresses.
          </p>
          <p className="text-2xl leading-relaxed">
            The current solution was not adequately serving the audience&apos;s needs and wants. It exposed them to downside in the form of
            friction, uncertainty, weak trust, and inconsistency. At the same time, it was not capturing the upside made possible by mobile
            connectivity, location awareness, real-time matching, digital payments, and scalable platform-based trust.
          </p>
          <p className="text-2xl leading-relaxed">
            This is why Uber is a useful example. It shows that a solution is not merely an app layered over an old process.
            A real solution changes the process itself.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-5xl font-bold">The As-Is Process and the To-Be Process</h2>
          <p className="text-2xl leading-relaxed">
            Once you start thinking in terms of solutions, one distinction becomes essential: <strong>current solution (As-Is)</strong> versus{' '}
            <strong>better solution (To-Be)</strong>.
          </p>
          <p className="text-2xl leading-relaxed">
            The As-Is process is the current way in which the audience attempts to get the outcome. It may work partially. It may work inconsistently.
            It may work at high cost, low speed, low trust, or low scale. But it is the present reality.
          </p>
          <p className="text-2xl leading-relaxed">
            The To-Be process is the better arrangement designed to close the gap.
          </p>
          <p className="text-2xl leading-relaxed">
            For Uber, the As-Is process looked something like this: a person needs a ride, searches physically or waits roadside, faces
            uncertainty about taxi availability, has weak visibility into arrival and fare confidence, completes the trip with friction around payment,
            and leaves the experience with limited trust memory and little repeatable continuity.
          </p>
          <p className="text-2xl leading-relaxed">
            The To-Be process was different. A rider opens the app and requests a ride. Nearby drivers are discovered instantly. Estimated arrival
            time, route, and fare visibility are provided. Rider and driver are matched digitally. The ride is tracked in real time. Payment is
            completed seamlessly. Rating, feedback, and trip history are captured.
          </p>
          <p className="text-2xl leading-relaxed">Notice what changed.</p>
          <p className="text-2xl leading-relaxed">
            The solution did not simply digitize one step. It restructured the entire experience. It changed discovery. It changed matching.
            It changed visibility. It changed payment. It changed trust. And because it changed the process, it changed the outcomes.
          </p>
          <p className="text-2xl leading-relaxed">That is what solutions do.</p>
        </section>

        <section className="space-y-6">
          <h2 className="text-5xl font-bold">Better Customer Outcomes Are Only the Beginning</h2>
          <p className="text-2xl leading-relaxed">
            The first visible effect of a good solution is usually at the customer level.
          </p>
          <p className="text-2xl leading-relaxed">
            For Uber, the immediate customer outcomes were obvious: easier access to rides, faster booking, better visibility,
            stronger confidence, smoother payment, and a more repeatable experience.
          </p>
          <p className="text-2xl leading-relaxed">
            But that is only the first layer. A real solution also changes operating outcomes and eventually enterprise outcomes.
          </p>
          <p className="text-2xl leading-relaxed">
            Because the To-Be process was more digital, structured, and repeatable, Uber could improve rider-driver matching efficiency,
            increase the conversion of ride intent into completed rides, improve service consistency, and build stronger network effects
            across its platform.
          </p>
          <p className="text-2xl leading-relaxed">And beyond that lies the enterprise level.</p>
          <p className="text-2xl leading-relaxed">This is why the linkage to company metrics must be made clear.</p>
          <p className="text-2xl leading-relaxed">
            A better solution should not only feel better. It should be capable of producing better business outcomes.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-5xl font-bold">A Solution Must Be Mapped to Outcomes</h2>
          <p className="text-2xl leading-relaxed">
            This is where many descriptions of solutions remain weak. They stop at features.
          </p>
          <p className="text-2xl leading-relaxed">
            A stronger explanation shows the chain from process improvement to business impact. That is what a{' '}
            <strong>Solutions-to-Outcomes Mapping</strong> is for.
          </p>
          <p className="text-2xl leading-relaxed">
            The idea is simple. A better solution should make it clear how the To-Be process closes the gap created by the As-Is process,
            and how that closure creates better outcomes.
          </p>
          <p className="text-2xl leading-relaxed">Using Uber, the logic becomes much clearer.</p>
          <p className="text-2xl leading-relaxed">
            Uncertain taxi discovery becomes instant digital ride discovery. That improves ride access and increases the likelihood that a transport
            need becomes a completed ride.
          </p>
          <p className="text-2xl leading-relaxed">
            Unclear arrival timing becomes ETA visibility and live trip tracking. That improves predictability and customer confidence.
          </p>
          <p className="text-2xl leading-relaxed">
            Fare opacity becomes transparent fare logic and digital records. That improves trust and reduces friction.
          </p>
          <p className="text-2xl leading-relaxed">
            Weak trust becomes driver identity, ratings, and traceable trip memory. That improves perceived safety, repeatability, and confidence.
          </p>
          <p className="text-2xl leading-relaxed">
            Payment friction becomes seamless in-app payment. That improves completion ease and reduces transactional inconvenience.
          </p>
          <p className="text-2xl leading-relaxed">
            Weak repeatability becomes app-based history, feedback, and a reusable platform experience. That strengthens reuse and habit formation.
          </p>
        </section>

        <section className="space-y-4">
          <p className="text-xl font-semibold">
            Figure: Uber Solution-to-Outcomes Mapping — how a better To-Be process closes the As-Is gap and improves customer, operating,
            and enterprise outcomes.
          </p>
          <UberSolutionOutcomesMap />
        </section>

        <section className="space-y-6">
          <h2 className="text-5xl font-bold">How a Better Solution Links to Business Metrics</h2>
          <p className="text-2xl leading-relaxed">
            When the To-Be process is designed properly, its impact should eventually be visible in the company&apos;s metrics.
          </p>
          <p className="text-2xl leading-relaxed">
            In Uber&apos;s case, the linkage becomes much easier to understand when you connect it directly to the process changes.
          </p>
          <ul className="list-disc pl-12 space-y-3 text-2xl leading-relaxed">
            <li>At the <strong>Revenue / P&amp;L</strong> level, better ride conversion and better repeat usage support stronger revenue growth potential and better monetization of transport demand.</li>
            <li>At the <strong>operating efficiency</strong> level, better digital matching and lower friction improve utilization and operating leverage. The system can coordinate supply and demand more effectively than a fragmented manual model.</li>
            <li>At the <strong>cash flow</strong> level, digital payment improves transaction visibility, collection speed, and control. The cash characteristics of the business become more structured and measurable.</li>
            <li>At the <strong>balance sheet / capital logic</strong> level, a scalable platform model allows growth with lighter asset intensity than a traditional transport operator that directly owns and manages large physical fleets. Even when the accounting details vary, the logic of scalability and capital deployment is different.</li>
            <li>At the <strong>brand equity</strong> level, better transparency, trust, repeatability, and convenience strengthen loyalty, recall, and market position.</li>
          </ul>
          <p className="text-2xl leading-relaxed">
            This is one of the most important tests of a solution: can you explain how a better process influences outcomes and metrics that matter?
          </p>
          <p className="text-2xl leading-relaxed">
            If you cannot, then you may have described a feature. But you have not yet fully described a solution.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-5xl font-bold">So, What Is a Solution?</h2>
          <p className="text-2xl leading-relaxed">Now we can define it more clearly.</p>
          <p className="text-2xl leading-relaxed">
            A <strong>solution</strong> is a structured <strong>To-Be arrangement</strong> designed for a specific target audience whose needs
            and/or wants are not being adequately met by the current solution because a gap exists. That gap may be linked to covering
            an existing or upcoming downside, or to leveraging an existing or upcoming upside. The solution closes that gap by improving
            the process, experience, logic, and governance required to create better outcomes in a repeatable and credible manner.
          </p>
          <p className="text-2xl leading-relaxed">
            In simpler language, a solution is a better way of getting something important done.
          </p>
          <p className="text-2xl leading-relaxed">
            Not merely a screen.<br />
            Not merely a workflow.<br />
            Not merely a feature set.<br />
            But a better arrangement that helps people move from an inadequate present to a better future.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-5xl font-bold">Why This Matters in PBMP</h2>
          <p className="text-2xl leading-relaxed">
            This way of thinking matters because PBMP is not meant to be a random collection of screens and functions.
          </p>
          <p className="text-2xl leading-relaxed">
            In PBMP, users sign up for <strong>Solutions</strong>. Each solution is meant to serve a defined target audience. Each one addresses
            needs and/or wants that are not being adequately met by the current solution. Each one helps move the user from As-Is to To-Be.
            And each one should be explainable in terms of the outcomes it creates.
          </p>
          <p className="text-2xl leading-relaxed">That is the standard.</p>
          <p className="text-2xl leading-relaxed">If something cannot clearly identify:</p>
          <ul className="list-disc pl-12 space-y-3 text-2xl leading-relaxed">
            <li>who it is for,</li>
            <li>what gap it closes,</li>
            <li>what the current solution gets wrong,</li>
            <li>what the better solution changes,</li>
            <li>and how outcomes improve,</li>
          </ul>
          <p className="text-2xl leading-relaxed">then it has not yet earned the right to be called a solution.</p>
        </section>

        <section className="space-y-6">
          <h2 className="text-5xl font-bold">What a Solution Is Not</h2>
          <p className="text-2xl leading-relaxed">It is also helpful to be clear about what a solution is not.</p>
          <p className="text-2xl leading-relaxed">
            A solution is not just software.<br />
            It is not just a template.<br />
            It is not just automation.<br />
            It is not just a dashboard.<br />
            It is not just a process map.<br />
            It is not just a document.<br />
            And it is not just a list of features.
          </p>
          <p className="text-2xl leading-relaxed">
            Any of those may be part of a solution. But none of them alone deserves to be called the solution.
          </p>
          <p className="text-2xl leading-relaxed">
            The true solution is the full To-Be arrangement that closes the gap and improves outcomes.
          </p>
        </section>

        <section className="pb-10 space-y-6">
          <h2 className="text-5xl font-bold">Final Thought</h2>
          <p className="text-2xl leading-relaxed">
            The easiest way to recognize a real solution
            <br />
            is to ask a few disciplined questions.
          </p>
          <p className="text-2xl leading-relaxed">
            Who is the audience?
            <br />
            What do they need and want?
            <br />
            What gap exists in the current solution?
            <br />
            What downside must be covered, or what
            <br />
            upside must be captured?
            <br />
            What does the As-Is process look like?
            <br />
            What does the To-Be process look like?
            <br />
            And how does the better process create
            <br />
            better customer, operating, and enterprise
            <br />
            outcomes?
          </p>
          <p className="text-2xl leading-relaxed">
            If those questions can be answered clearly,
            <br />
            you are no longer looking at a mere feature
            <br />
            or interface.
          </p>
          <p className="text-2xl leading-relaxed">You are looking at a solution.</p>
          <p className="text-2xl leading-relaxed">
            And that is the level of clarity every serious
            <br />
            product, platform, and business initiative
            <br />
            should aim for.
          </p>
        </section>
      </main>
    </div>
  )
}

export default ProjectManagementPage

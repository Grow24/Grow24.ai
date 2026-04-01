import type { ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/problem')({
  component: ProblemPage,
})

function TextColumn({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[42rem] px-6 py-12 md:py-14 ${className}`}>
      {children}
    </div>
  )
}

function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl md:text-3xl font-bold text-black mb-6 leading-tight">{children}</h2>
}

function ProblemPage() {
  return (
    <div className="min-h-screen bg-white text-black mt-[-70px]">
      {/* 1 — What Is a Problem? (intro) */}
      <TextColumn>
        <h1 className="text-3xl md:text-4xl font-bold mb-8">What Is a Problem?</h1>
        <div className="space-y-6 text-base md:text-lg leading-relaxed text-black">
          <p>Most people begin too late.</p>
          <p>
            They notice a complaint, a delay, a bad experience, a missed target, or a visible inefficiency, and they call that the
            problem. But by that point, they are already looking at the surface. A real problem usually begins earlier and deeper. It
            begins with a target audience, what that audience needs and wants, how aware they are of those needs and wants, and whether
            the current solution is actually able to serve them well enough.
          </p>
          <p>
            That is why a problem should not be defined too casually. If we define it weakly, we design weak solutions. If we define it
            clearly, the path to a better solution becomes much easier to see.
          </p>
          <p>
            This page explains what a problem really is, what makes a strong problem statement, and why this matters. We use Uber
            throughout as the main example.
          </p>
        </div>
      </TextColumn>

      {/* 2 — Needs and wants */}
      <TextColumn className="border-t border-slate-200">
        <SectionHeading>A problem begins with needs and wants</SectionHeading>
        <div className="space-y-6 text-base md:text-lg leading-relaxed">
          <p>
            Before we can talk about a problem, we need to talk about <strong>needs</strong> and <strong>wants</strong>.
          </p>
          <p>
            People often use these words loosely, as though they are interchangeable. They are related, but they are not the same. A{' '}
            <strong>need</strong> is typically more essential to achieving, preserving, or protecting an important outcome. A{' '}
            <strong>want</strong> is something desirable, valuable, or attractive, but not always essential at the same level.
          </p>
          <p>That sounds simple, but in practice it is more contextual than absolute.</p>
          <p>
            A requirement can feel very different depending on who the target audience is. The same thing may be a need for one audience
            and only a want for another. For one person, fast ride pickup may be essential. For another, it may merely be nice to have.
            For one rider, fare transparency may be a need because budget control matters.
          </p>
        </div>
      </TextColumn>

      {/* 3 — Same requirement */}
      <TextColumn className="border-t border-slate-200">
        <SectionHeading>The same requirement can mean different things to different people</SectionHeading>
        <div className="space-y-6 text-base md:text-lg leading-relaxed">
          <p>Uber is a useful example because transport is a universal category, but the quality of the requirement varies sharply by audience.</p>
          <p>
            Take <strong>fast ride pickup</strong>. For a commuter rushing to an important meeting or trying to catch a flight, fast pickup
            may be a clear need. For a leisure traveler with flexible time, it may be more of a want. Take <strong>fare transparency</strong>.
            For a budget-conscious rider, it may be a need because the rider has to manage spend carefully. For a premium traveler, it may
            still matter, but perhaps not with the same intensity. Take <strong>ride availability late at night</strong>. For someone traveling
            alone in an unfamiliar area, that may be a need. For a daytime occasional rider in a low-pressure context, it may be less critical.
          </p>
          <p>
            This is why problem thinking must remain audience-specific. The same market category can still produce different requirements
            for different audiences.
          </p>
        </div>
      </TextColumn>

      {/* 4 — Understanding Needs and Wants (infographic) */}
      <section className="border-t border-slate-200 bg-[#fdfbf7] px-4 py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-black mb-2">Understanding Needs and Wants</h2>
          <p className="text-center text-base md:text-lg text-slate-800 mb-8">
            How to classify requirements before defining a Problem.
          </p>

          <div className="rounded-lg border border-slate-400 bg-[#f2f2f2] p-4 md:p-6 mb-6">
            <p className="text-center text-sm md:text-base leading-relaxed">
              <strong>Main Idea:</strong> A Need and a Want are not always the same. Their classification depends on the target group, the
              urgency and importance of the requirement, the intensity of the requirement, and the time and cost required to fulfil it.
            </p>
          </div>

          <div className="rounded-lg border border-slate-400 bg-white p-4 md:p-6 mb-8">
            <h3 className="text-center font-bold text-lg mb-4">Urgent vs Important Lens</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm md:text-base">
              <div className="rounded border border-slate-300 bg-slate-100 p-3">
                <p className="font-bold mb-1">Urgent + Important</p>
                <p className="text-slate-800">Typically stronger candidates for Need</p>
              </div>
              <div className="rounded border border-slate-300 bg-slate-100 p-3">
                <p className="font-bold mb-1">Not Urgent + Important</p>
                <p className="text-slate-800">Can be Need or Want, depending on target group and context</p>
              </div>
              <div className="rounded border border-slate-300 bg-slate-100 p-3">
                <p className="font-bold mb-1">Urgent + Not Important</p>
                <p className="text-slate-800">Often situational demand, not always a true Need</p>
              </div>
              <div className="rounded border border-slate-300 bg-slate-100 p-3">
                <p className="font-bold mb-1">Not Urgent + Not Important</p>
                <p className="text-slate-800">Typically weaker candidate for Need</p>
              </div>
            </div>
            <p className="text-center text-sm mt-4 text-slate-700">
              Need / Want classification should not be made casually. It should be evaluated in context.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="rounded-lg border border-slate-400 bg-white p-4">
              <h3 className="font-bold mb-3 text-center">Same Requirement, Different Target Groups</h3>
              <div className="overflow-x-auto text-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="text-left py-2 pr-2">Requirement</th>
                      <th className="text-left py-2 pr-2">Target Group A</th>
                      <th className="text-left py-2">Target Group B</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 pr-2">Fast ride pickup</td>
                      <td className="py-2 pr-2">Need for time-sensitive commuter</td>
                      <td className="py-2">Want for leisure traveler</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 pr-2">Fare transparency</td>
                      <td className="py-2 pr-2">Need for budget-conscious rider</td>
                      <td className="py-2">Want for premium convenience rider</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-2">Ride availability late at night</td>
                      <td className="py-2 pr-2">Need for late-night traveler</td>
                      <td className="py-2">Want for daytime occasional rider</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-center mt-3 text-slate-700">A Need for one audience may be only a Want for another.</p>
            </div>
            <div className="rounded-lg border border-slate-400 bg-white p-4">
              <h3 className="font-bold mb-3 text-center">Requirement Intensity and Fulfillment Effort</h3>
              <div className="overflow-x-auto text-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="text-left py-2 pr-2">Requirement</th>
                      <th className="text-left py-2 pr-2">Intensity</th>
                      <th className="text-left py-2 pr-2">Time</th>
                      <th className="text-left py-2">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 pr-2">Fast ride pickup</td>
                      <td className="py-2 pr-2">High</td>
                      <td className="py-2 pr-2">Low to Medium</td>
                      <td className="py-2">Medium</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-2 pr-2">Fare transparency</td>
                      <td className="py-2 pr-2">Medium to High</td>
                      <td className="py-2 pr-2">Low</td>
                      <td className="py-2">Low</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-2">Ride safety confidence</td>
                      <td className="py-2 pr-2">Very High</td>
                      <td className="py-2 pr-2">Medium</td>
                      <td className="py-2">Medium to High</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-center mt-3 text-slate-700">
                Two requirements may both be Needs, but not with the same intensity or fulfillment effort.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-400 bg-[#f2f2f2] p-4 md:p-6">
            <h3 className="font-bold text-center mb-4">How to Think About Needs and Wants</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs md:text-sm">
              {[
                { t: 'Audience-specific', d: 'Start with the target group.' },
                { t: 'Context-specific', d: 'Look at urgency and importance.' },
                { t: 'Relative', d: 'A Need for one group may be a Want for another.' },
                { t: 'Weighted', d: 'Intensity can vary across requirements.' },
                { t: 'Costed and Timed', d: 'Fulfillment effort matters.' },
              ].map((x) => (
                <div key={x.t} className="rounded border border-slate-300 bg-white p-2 text-center">
                  <p className="font-semibold mb-1">{x.t}</p>
                  <p className="text-slate-700">{x.d}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded bg-[#fff9c4] px-3 py-2 text-center text-sm md:text-base">
              A disciplined Needs/Wants sheet should include target group, requirement, Need/Want classification, urgency, importance,
              weight, time to fulfill, and cost to fulfill.
            </p>
          </div>
        </div>
      </section>

      {/* 5 — Latent needs */}
      <TextColumn className="border-t border-slate-200">
        <SectionHeading>People may not even know their own needs and wants fully</SectionHeading>
        <div className="space-y-6 text-base md:text-lg leading-relaxed">
          <p>
            Even after we understand that needs and wants differ by audience, there is another layer: people may or may not be fully aware
            of what they need or want.
          </p>
          <p>
            Some needs are clearly known and easily articulated. People know what they want, and they can say it directly. Other needs are
            only partially understood. People feel friction, but cannot describe the missing requirement precisely. Still others are latent.
            The need exists, but it becomes visible only after a better solution appears.
          </p>
          <p>This happens more often than we think.</p>
          <p>
            A classic example is photocopying. Before convenient photocopiers became available, many people did not walk around saying,
            &quot;What I really need is fast, easy, on-demand copying.&quot; They were living with slow, inconvenient workarounds—and the
            gap was real long before it was easy to name.
          </p>
        </div>
      </TextColumn>

      {/* 6 — Awareness infographic */}
      <section className="border-t border-slate-200 bg-[#f5f2e9] px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl bg-slate-100 border border-slate-300 p-6 mb-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold">Awareness of Needs and Wants</h2>
            <p className="mt-2 text-slate-800">Why some problems are obvious only after a better solution appears.</p>
          </div>
          <div className="rounded-xl bg-slate-200/80 border border-slate-300 p-4 mb-8 text-sm md:text-base text-center leading-relaxed">
            People do not always know or articulate their own Needs and Wants clearly. Some are visible now. Others become visible only
            when a new solution reveals what was previously missing.
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div className="space-y-3">
              <p className="font-bold text-sm text-center lg:text-left">Example: Xerox / Photocopying</p>
              <div className="rounded-lg bg-[#1d2b3a] text-white p-3 text-sm">
                <p className="font-semibold mb-2">Before Better Solution</p>
                <ul className="list-disc pl-4 space-y-1 text-white/95">
                  <li>Copying was slow and inconvenient</li>
                  <li>People worked around the limitation</li>
                  <li>The hidden need was not fully articulated</li>
                </ul>
              </div>
              <div className="rounded-lg bg-[#5b7083] text-white p-3 text-sm">
                <p className="font-semibold mb-1">What Changed</p>
                <p>Easy on-demand photocopying became possible.</p>
              </div>
              <div className="rounded-lg bg-[#5e8b8e] text-white p-3 text-sm">
                <p className="font-semibold mb-1">What Became Visible</p>
                <p>Fast, repeatable document copying was a real Need.</p>
              </div>
              <p className="text-xs text-slate-700 text-center">
                A new solution can convert hidden expectations into clearly recognized requirements.
              </p>
            </div>

            <div className="rounded-xl border-2 border-slate-400 bg-[#faf8f3] p-4">
              <h3 className="text-center font-bold text-sm md:text-base mb-3">Known / Unknown Awareness Matrix</h3>
              <p className="text-xs text-center text-slate-600 mb-3">Rows: ability to articulate · Columns: awareness of need/want</p>
              <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                <div className="rounded bg-[#1a2b3c] text-white p-3">
                  <p className="font-bold">Clearly Known</p>
                  <p className="mt-1 opacity-95">People know what they need and can express it clearly.</p>
                </div>
                <div className="rounded bg-[#4a7c8c] text-white p-3">
                  <p className="font-bold">Latent but Discoverable</p>
                  <p className="mt-1 opacity-95">The need exists, but people do not yet express it fully.</p>
                </div>
                <div className="rounded bg-[#6b8f8f] text-white p-3">
                  <p className="font-bold">Felt but Poorly Articulated</p>
                  <p className="mt-1 opacity-95">People sense friction, but cannot define the exact requirement.</p>
                </div>
                <div className="rounded bg-[#1a2b3c] text-white p-3">
                  <p className="font-bold">Unknown / Unrecognized</p>
                  <p className="mt-1 opacity-95">The need becomes visible only after a new solution appears.</p>
                </div>
              </div>
              <p className="text-center text-xs mt-3 text-slate-700">
                A better solution can reveal a need that users were already living without.
              </p>
            </div>

            <div className="space-y-3">
              <p className="font-bold text-sm text-center lg:text-left">Example: Uber / Ride Experience</p>
              <div className="rounded-lg bg-[#1d2b3a] text-white p-3 text-sm">
                <p className="font-semibold mb-2">Before Better Solution</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Riders knew they needed transport</li>
                  <li>Real-time visibility and digital convenience were not always articulated</li>
                </ul>
              </div>
              <div className="rounded-lg bg-[#5b7083] text-white p-3 text-sm">
                <p className="font-semibold mb-1">What Changed</p>
                <p>App-based discovery, ETA, route visibility, digital payment, ratings.</p>
              </div>
              <div className="rounded-lg bg-[#5e8b8e] text-white p-3 text-sm">
                <p className="font-semibold mb-1">What Became Visible</p>
                <p>Transparency, repeatability, and trust became clearly recognized Needs/Wants.</p>
              </div>
              <p className="text-xs text-slate-700 text-center">
                A new solution can convert hidden expectations into clearly recognized requirements.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {[
              { h: 'Do not assume awareness', b: 'Users may not fully know what they need' },
              { h: 'Look for hidden friction', b: 'Unarticulated pain still matters' },
              { h: 'Watch for emerging possibility', b: 'New capabilities can reveal new expectations' },
              { h: 'Separate expressed from latent need', b: 'What users say is not the whole story' },
              { h: 'Better solutions can educate the market', b: 'The solution can reveal the problem' },
            ].map((c) => (
              <div key={c.h} className="rounded-lg overflow-hidden border border-slate-400">
                <div className="bg-[#1d2b3a] text-white text-xs font-bold px-2 py-2 text-center">{c.h}</div>
                <div className="bg-slate-100 text-xs px-2 py-2 text-center text-slate-800">{c.b}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center font-bold text-sm md:text-base px-2">
            Before writing a Problem Statement, understand not only what users say they need, but also what they have not yet learned to
            ask for.
          </p>
        </div>
      </section>

      {/* 7 — Concept: What Is a Problem? (infographic) */}
      <section className="border-t border-slate-200 bg-slate-100 px-4 py-12 md:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl md:text-3xl font-bold">What Is a Problem?</h2>
          <p className="text-center text-slate-800 mt-2 mb-8">
            Understanding the Concept of a Problem and a Problem Statement
          </p>

          <div className="rounded-lg border border-slate-400 bg-slate-200/50 p-6 mb-8">
            <h3 className="text-center font-bold mb-3">Governing Thought</h3>
            <p className="text-center text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
              A Problem is the gap between what a target audience needs and/or wants, and what the current solution is actually able to
              deliver.
            </p>
            <p className="text-center text-sm md:text-base leading-relaxed max-w-3xl mx-auto mt-2">
              A Problem Statement expresses that gap clearly, along with why it matters.
            </p>
          </div>

          <h3 className="text-center font-bold mb-4">Concept of a Problem</h3>
          <div className="flex flex-wrap items-stretch justify-center gap-2 md:gap-1 mb-6">
            {[
              { title: 'Target Audience', sub: 'Who is affected?', c: 'bg-[#1c2d41]' },
              { title: 'Needs and/or Wants', sub: 'What matters to them?', c: 'bg-[#3d5a73]' },
              { title: 'Current Solution (As-Is)', sub: 'How is it addressed today?', c: 'bg-[#4a6670]' },
              { title: 'Gap', sub: 'Why is the current solution inadequate?', c: 'bg-[#5e8b8e]' },
              { title: 'Impact', sub: 'Why does the gap matter?', c: 'bg-[#6b7280]' },
            ].map((step, i) => (
              <div key={step.title} className="flex items-center gap-1">
                <div className={`w-[140px] md:w-[120px] rounded overflow-hidden border border-slate-600 shadow-sm`}>
                  <div className={`${step.c} text-white text-xs font-bold px-2 py-2 text-center`}>{step.title}</div>
                  <div className="bg-slate-100 text-[11px] px-2 py-2 text-center text-slate-800 leading-snug">{step.sub}</div>
                </div>
                {i < 4 && <span className="text-slate-500 hidden sm:inline" aria-hidden>→</span>}
              </div>
            ))}
          </div>
          <div className="rounded-full border border-slate-400 bg-white px-4 py-3 text-center text-sm max-w-2xl mx-auto">
            Problem = Target Audience + Needs/Wants + Inadequate Current Solution + Gap + Impact
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="rounded-lg border border-slate-400 bg-white p-4">
              <h4 className="font-bold text-center mb-3">Problem Can Be About Covering Downside</h4>
              <div className="space-y-2">
                {['Existing weaknesses', 'Diminishing strengths', 'Existing threats', 'Diminishing opportunities'].map((row) => (
                  <div key={row} className="rounded bg-slate-300/80 px-3 py-2 text-sm text-slate-900">
                    {row}
                  </div>
                ))}
              </div>
              <p className="text-sm text-center mt-3 text-slate-700">The current solution is too weak to protect against downside.</p>
            </div>
            <div className="rounded-lg border border-slate-400 bg-white p-4">
              <h4 className="font-bold text-center mb-3">Problem Can Also Be About Leveraging Upside</h4>
              <div className="space-y-2">
                {['Diminishing weaknesses', 'Arising strengths', 'Diminishing threats', 'Arising opportunities'].map((row) => (
                  <div key={row} className="rounded bg-teal-100/80 px-3 py-2 text-sm text-slate-900">
                    {row}
                  </div>
                ))}
              </div>
              <p className="text-sm text-center mt-3 text-slate-700">The current solution is too weak to capture upside.</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-400 bg-slate-200/50 p-6 mt-10">
            <h3 className="text-center font-bold mb-4">What a Good Problem Statement Must Contain</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 text-xs">
              {[
                ['Target Audience', 'Clearly state who is affected'],
                ['Needs and/or Wants', 'State what matters to them'],
                ['Current Solution', 'Describe the As-Is reality'],
                ['Gap', 'Explain what is not working well enough'],
                ['Downside / Upside Logic', 'Show what risk must be covered or what opportunity must be captured'],
                ['Impact', 'Show why it matters to outcomes'],
              ].map(([h, b]) => (
                <div key={h} className="rounded border border-slate-400 overflow-hidden bg-white">
                  <div className="bg-slate-600 text-white font-semibold px-2 py-2 text-center">{h}</div>
                  <div className="px-2 py-2 text-slate-800 leading-snug">{b}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded bg-slate-700 text-white text-center text-sm px-3 py-3">
              A good Problem Statement does not jump to features or tools. It first clarifies the audience, the gap, and the impact.
            </div>
          </div>
        </div>
      </section>

      {/* 8 — Good problem statement (text) */}
      <TextColumn className="border-t border-slate-200">
        <SectionHeading>What makes a good problem statement?</SectionHeading>
        <div className="space-y-6 text-base md:text-lg leading-relaxed">
          <p>A good problem statement should contain a few essential parts.</p>
          <p>
            It should identify the <strong>target audience</strong> clearly. A problem always belongs to someone.
          </p>
          <p>
            It should state the <strong>needs and/or wants</strong> that matter. These should not be vague or assumed.
          </p>
          <p>
            It should describe the <strong>current solution</strong>, or As-Is reality. How is the audience trying to get the outcome today?
          </p>
          <p>
            It should make the <strong>gap</strong> explicit. Why is the current solution not good enough?
          </p>
          <p>
            It should explain whether the gap relates to <strong>downside protection</strong>, <strong>upside capture</strong>, or both.
          </p>
          <p>
            And it should show the <strong>impact</strong>. Why does this matter? What consequences follow if the gap remains unresolved?
          </p>
        </div>
      </TextColumn>

      {/* 9 — Definition */}
      <TextColumn className="border-t border-slate-200">
        <SectionHeading>So, what is a problem?</SectionHeading>
        <div className="space-y-6 text-base md:text-lg leading-relaxed">
          <p>Now we can define it properly.</p>
          <p>
            A <strong>problem</strong> exists when a specific <strong>target audience</strong> has <strong>needs and/or wants</strong> that are
            not being adequately addressed by the <strong>current solution</strong>, because a meaningful <strong>gap</strong> exists.
          </p>
          <p>That is the heart of it.</p>
          <p>
            The current solution may exist and still be inadequate. Or there may be no real solution at all. In either case, the problem lies
            in the gap between what matters to the audience and what current reality is able to deliver.
          </p>
          <p>
            This gap may be linked to <strong>covering downside</strong> or <strong>leveraging upside</strong>.
          </p>
          <p>
            On the downside side, the current solution may expose the audience to weaknesses, diminishing strengths, threats, or diminishing
            opportunities. In plain language, things may be fragile, declining, risky, or increasingly insufficient.
          </p>
        </div>
      </TextColumn>

      {/* 10 — Uber framing */}
      <TextColumn className="border-t border-slate-200">
        <SectionHeading>Uber: what was the real problem?</SectionHeading>
        <div className="space-y-6 text-base md:text-lg leading-relaxed">
          <p>This is the right moment to apply the definition to Uber.</p>
          <p>
            A weak framing would say: <strong>people needed taxis.</strong>
          </p>
          <p>That is true in a literal sense, but it is not the real problem. It is too shallow and too generic.</p>
          <p>
            The stronger framing is this: urban commuters, travelers, and time-sensitive riders had needs and wants for transport that was{' '}
            <strong>reliable, convenient, transparent, safe, predictable, and easy to complete.</strong> But the <strong>current solution</strong>{' '}
            for accessing transport did not adequately meet those needs and wants.
          </p>
          <p>
            That is much stronger because it puts the emphasis where it belongs: not on the generic category of transport, but on the gap
            between what mattered to riders and what the fragmented As-Is experience could reliably deliver.
          </p>
        </div>
      </TextColumn>

      {/* 11 — As-Is */}
      <TextColumn className="border-t border-slate-200">
        <SectionHeading>The problem lives in the As-Is process</SectionHeading>
        <div className="space-y-6 text-base md:text-lg leading-relaxed">
          <p>A problem does not exist only as a sentence. It usually lives in a process.</p>
          <p>
            That is why it is useful to look at the <strong>current solution (As-Is)</strong> not only as a concept, but as a sequence.
          </p>
          <p>
            For Uber, the As-Is process looked something like this. A rider needs a ride. The rider searches physically or waits roadside.
            Taxi availability is uncertain. Arrival timing and fare confidence are weak. The ride itself may proceed with limited transparency.
            Payment may involve friction. The trip ends without much continuity, memory, or platform-based trust.
          </p>
          <p>Once we see it that way, the gap becomes much easier to understand.</p>
          <p>
            The weakness was not in one isolated step. It was spread across discovery, availability, visibility, trust, payment, and
            repeatability.
          </p>
        </div>
      </TextColumn>

      {/* 12 — Downside / upside */}
      <TextColumn className="border-t border-slate-200">
        <SectionHeading>Uber&apos;s problem involved both downside and upside</SectionHeading>
        <div className="space-y-6 text-base md:text-lg leading-relaxed">
          <p>Uber is also a strong example because it shows both sides of the problem clearly: downside and upside.</p>
          <p>
            On the downside side, the As-Is transport experience exposed riders and operators to friction, uncertainty, weak transparency,
            inconsistent trust, and lost demand. A weak process meant that transport need did not always become completed transport. That
            had consequences not just for customer experience, but for the economics of the system.
          </p>
          <p>
            On the upside side, a new world was becoming possible. Mobile connectivity, location services, digital maps, app-based matching,
            digital payments, and scalable rating systems created the possibility of a much better transport-access process. So the problem
            was not only that the old system was painful. It was also that the current solution was not able to capture a major new upside.
          </p>
        </div>
      </TextColumn>

      {/* 13 — Business outcomes */}
      <TextColumn className="border-t border-slate-200">
        <SectionHeading>Why this matters to business outcomes</SectionHeading>
        <div className="space-y-6 text-base md:text-lg leading-relaxed">
          <p>
            A poorly defined problem leads to poor investment, poor prioritization, and superficial solution design. People jump to
            features. They build tools too early. They optimize the wrong thing.
          </p>
          <p>
            A clearly defined problem, on the other hand, creates a line of sight from audience need to process gap to solution logic to
            business outcomes.
          </p>
          <p>
            In Uber&apos;s case, the unresolved problem affected much more than convenience. It affected conversion from ride need to ride
            completion. It affected repeat usage. It affected utilization efficiency. It affected revenue potential. It influenced the cash
            characteristics of the transaction model. And it influenced trust and brand strength.
          </p>
          <p>
            This is why a problem statement matters. It is not a formality. It is the disciplined expression of what is wrong, for whom,
            why it matters, and what outcomes are at stake if the gap remains unresolved.
          </p>
        </div>
      </TextColumn>

      {/* 14 — Filled template */}
      <section className="border-t border-slate-200 bg-slate-50 px-4 py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2c3e50] mb-6">Filled Problem Statement Template</h2>

          <div className="flex flex-col sm:flex-row rounded-lg overflow-hidden border border-slate-400 mb-8">
            <div className="bg-[#2c3e50] text-white font-bold px-4 py-3 sm:w-40 shrink-0 flex items-center justify-center">Main Idea</div>
            <div className="bg-slate-200/80 px-4 py-3 text-sm md:text-base leading-relaxed flex-1">
              A strong Problem Statement does not jump to features or tools. It first defines the audience, the needs and wants, the current
              solution, the gap, the downside / upside logic, and the impact.
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {[
              'Target Audience',
              'Needs and Wants',
              'Current Solution (As-Is)',
              'Gap',
              'Downside / Upside Logic',
              'Impact',
            ].map((label, i, arr) => (
              <div key={label} className="flex items-center gap-2">
                <span className="rounded px-3 py-2 text-xs font-bold text-white bg-[#2c3e50] shadow-sm">{label}</span>
                {i < arr.length - 1 && <span className="text-slate-500">→</span>}
              </div>
            ))}
          </div>

          <div className="rounded-xl border-2 border-slate-400 bg-white overflow-hidden mb-8">
            <div className="bg-slate-100 px-4 py-3 font-bold border-b border-slate-300">Filled Problem Statement for Uber</div>
            {[
              ['Target Audience', 'Urban commuters, travelers, and time-sensitive riders'],
              ['Needs and Wants', 'Reliable, convenient, transparent, safe, and easy-to-complete transport access'],
              [
                'Current Solution (As-Is)',
                'Ride access was often fragmented, uncertain, weak in visibility, inconvenient in payment, and inconsistent in trust',
              ],
              [
                'Gap',
                'The current solution did not adequately meet rider needs and wants for predictable, transparent, and repeatable transport access',
              ],
              [
                'Downside / Upside Logic',
                'Downside: friction, lost rides, poor predictability, weaker repeatability. Upside: mobile connectivity, real-time matching, digital payments, scalable trust mechanisms.',
              ],
              [
                'Impact',
                'A meaningful gap existed between what riders needed and what the current solution could reliably deliver',
              ],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-1 sm:grid-cols-[11rem_1fr] border-b border-slate-200 last:border-b-0">
                <div className="bg-[#2c3e50] text-white text-sm font-semibold px-3 py-3">{k}</div>
                <div className="px-3 py-3 text-sm md:text-base leading-relaxed bg-white">{v}</div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-amber-300 bg-[#fef9e7] p-4 md:p-6">
            <h3 className="font-bold text-lg mb-3">Final Problem Statement</h3>
            <p className="text-sm md:text-base leading-relaxed">
              Urban commuters, travelers, and time-sensitive riders had needs and wants for transport that was reliable, convenient,
              transparent, safe, and easy to complete. However, the current solution for accessing rides did not adequately meet those
              needs and wants because the As-Is transport-access process was fragmented, uncertain, weak in visibility, inconvenient in
              payment, and inconsistent in trust. This created downside in the form of friction, lost rides, poor predictability, and weaker
              repeatability, while also failing to capture the upside made possible by mobile connectivity, real-time matching, digital
              payments, and scalable trust. As a result, a meaningful gap existed between what riders needed and what the current solution
              could reliably deliver.
            </p>
          </div>
          <p className="text-center text-sm text-slate-600 mt-6">
            This is what a disciplined Problem Statement looks like when the template is fully filled.
          </p>
        </div>
      </section>

      {/* 15 — PBMP */}
      <TextColumn className="border-t border-slate-200">
        <SectionHeading>Why this matters in PBMP</SectionHeading>
        <div className="space-y-6 text-base md:text-lg leading-relaxed">
          <p>In PBMP, solutions should not begin with screens, templates, or tools. They should begin with disciplined problem definition.</p>
          <p>That means understanding:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>who the target audience is,</li>
            <li>what they need and want,</li>
            <li>how aware they are of those needs and wants,</li>
            <li>what the current solution looks like,</li>
            <li>where the gap lies,</li>
            <li>whether the gap is linked to downside, upside, or both,</li>
            <li>and why the gap matters to outcomes.</li>
          </ul>
          <p>Only then can a solution be designed with real clarity.</p>
        </div>
      </TextColumn>

      {/* 16 — Final thought */}
      <TextColumn className="border-t border-slate-200 pb-20">
        <SectionHeading>Final thought</SectionHeading>
        <div className="space-y-6 text-base md:text-lg leading-relaxed">
          <p>A problem is not merely what is going wrong.</p>
          <p>It is the meaningful gap between what a target audience needs or wants and what the current solution can truly deliver.</p>
          <p>Sometimes that gap hurts because of downside. Sometimes it matters because of upside. Often it is both.</p>
          <p>And that is why defining the problem well is not a small step. It is the foundation of everything that follows.</p>
        </div>
      </TextColumn>
    </div>
  )
}

export default ProblemPage

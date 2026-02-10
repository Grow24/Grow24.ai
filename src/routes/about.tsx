import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="min-h-screen bg-emerald-50/40 dark:bg-slate-950/95 py-10 sm:py-12 md:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <div className="mb-4 text-sm">
          <a
            href="/#home"
            className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 underline-offset-4 hover:underline"
          >
            ← Back to Grow24.ai
          </a>
        </div>

        {/* Main card */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-emerald-100/70 dark:border-slate-800 overflow-hidden">
          {/* Top brand bar (matches Privacy theme) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 sm:px-8 py-4 sm:py-5 border-b border-emerald-100/70 dark:border-slate-800 bg-emerald-50/80 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <img
                src="/grow.svg"
                alt="Grow24.ai"
                className="h-8 w-auto object-contain"
              />
              <div>
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  Grow24.ai
                </p>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
                  Personal &amp; Business Management Platform
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white border border-emerald-700 font-semibold">
                About Us
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 sm:px-8 md:px-10 py-6 sm:py-8 md:py-10 space-y-10 text-sm sm:text-base text-slate-700 dark:text-slate-200">
            {/* Mission & vision */}
            <section className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Helping you grow with clarity, discipline, and confidence.
              </h1>
              <p>
                Grow24.ai exists to bridge the gap between ambition and execution. Individuals and
                organizations often know where they want to go, but struggle to translate that into
                clear goals, realistic plans, and measurable progress. We built Grow24.ai to make
                that journey structured, transparent, and repeatable.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-2">
                <div className="space-y-2">
                  <h2 className="text-base sm:text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                    Our mission
                  </h2>
                  <p>
                    To provide a single, integrated platform that aligns your personal and
                    professional goals, plans, and metrics—so you can grow in all dimensions of
                    life without losing focus or control.
                  </p>
                </div>
                <div className="space-y-2">
                  <h2 className="text-base sm:text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                    Our vision
                  </h2>
                  <p>
                    A world where individuals, teams, and organizations use structured management
                    practices—once reserved for large enterprises—to design, execute, and refine
                    their growth journeys.
                  </p>
                </div>
              </div>
            </section>

            {/* How Grow24 works */}
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                How Grow24.ai supports your growth
              </h2>
              <p>
                Grow24.ai combines the Value Cycle (You), the PBMP cycle, and decision-science
                principles into one practical system. Instead of juggling spreadsheets, notes, and
                disconnected tools, you move through clear, repeatable steps.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <article className="space-y-2">
                  <h3 className="text-base font-semibold text-emerald-800 dark:text-emerald-300">
                    Value Cycle (You)
                  </h3>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Identify personal &amp; professional goals that truly matter.</li>
                    <li>Craft strategies around focused areas and approaches.</li>
                    <li>Define objectives and key results with clear time horizons.</li>
                  </ul>
                </article>
                <article className="space-y-2">
                  <h3 className="text-base font-semibold text-emerald-800 dark:text-emerald-300">
                    PBMP cycle
                  </h3>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Plan initiatives across multiple time periods.</li>
                    <li>Build actionable roadmaps, activities, and responsibilities.</li>
                    <li>Measure outcomes against KPIs and refine your plans.</li>
                  </ul>
                </article>
                <article className="space-y-2">
                  <h3 className="text-base font-semibold text-emerald-800 dark:text-emerald-300">
                    Decision science &amp; WiKID
                  </h3>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Turn raw data into information, knowledge, and wisdom.</li>
                    <li>Use evidence, not guesswork, to adjust strategies.</li>
                    <li>Capture learnings so each cycle is smarter than the last.</li>
                  </ul>
                </article>
              </div>
            </section>

            {/* Who we serve */}
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                Who we are building for
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-emerald-800 dark:text-emerald-300">
                    Individuals &amp; professionals
                  </h3>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>People who want structure around personal and career goals.</li>
                    <li>Founders, managers, and freelancers balancing many priorities.</li>
                    <li>Anyone who wants a single view of plans, progress, and learning.</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-emerald-800 dark:text-emerald-300">
                    Teams &amp; organizations
                  </h3>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Leadership teams aligning strategy, execution, and KPIs.</li>
                    <li>Sales, marketing, and operations teams running structured plans.</li>
                    <li>Organizations that want an auditable, data-driven growth engine.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Principles */}
            <section className="space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                Principles that guide Grow24.ai
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <span className="font-medium">Clarity before complexity:</span> every feature should
                    make goals, plans, and data easier to understand.
                  </li>
                  <li>
                    <span className="font-medium">Integrated life view:</span> personal and professional
                    growth are connected, so we design for both.
                  </li>
                  <li>
                    <span className="font-medium">Evidence-first decisions:</span> progress is measured, not
                    assumed.
                  </li>
                </ul>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <span className="font-medium">Privacy &amp; control:</span> you decide what is captured,
                    how it is used, and when it is deleted.
                  </li>
                  <li>
                    <span className="font-medium">Continuous improvement:</span> the platform, just like your
                    plans, gets better with each cycle.
                  </li>
                  <li>
                    <span className="font-medium">Human-centered design:</span> tools should adapt to the way
                    people think and work, not the other way around.
                  </li>
                </ul>
              </div>
            </section>

            {/* Close */}
            <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                What&apos;s next for Grow24.ai
              </h2>
              <p>
                We are continuously expanding Grow24.ai with deeper analytics, richer collaboration
                features, and more guided workflows built on proven management practices. Our goal is
                simple: to be the trusted system of record and execution for your growth journey.
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AboutPage


import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/value-definition')({
  component: ValueDefinitionPage,
})

function ValueDefinitionPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 mt-[-70px]">
      <main className="max-w-6xl mx-auto px-4 lg:px-6 pt-0 lg:pt-0 pb-10 lg:pb-14">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 px-6 sm:px-8 lg:px-10 py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.5fr)] gap-10 lg:gap-14">
          {/* Left column */}
          <section>
          <p className="text-sm font-semibold text-purple-700 mb-3 tracking-wide uppercase">PBMP</p>
          <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold leading-tight mb-4">
            What Is Value? A Practical Definition for Real Life.
          </h1>
          <p className="text-slate-600 mb-4 text-sm">
            Value isn&apos;t just money or happiness—it&apos;s a measurable improvement in life quality.
          </p>
          <p className="text-xs text-slate-500 mb-6">6–7 min read • Personal Value</p>

          <div className="flex flex-wrap gap-3 mb-8">
            <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-purple-700 text-white text-sm font-semibold shadow-sm hover:bg-purple-800 transition-colors">
              Take the Personal Value Assessment
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-slate-100 text-slate-900 text-sm font-semibold hover:bg-slate-200 transition-colors">
              See the PBMP Value Map
            </button>
          </div>

          <div className="mb-10">
            <figure className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 text-slate-800 text-base sm:text-lg relative">
              <span className="absolute -top-5 left-6 text-4xl text-purple-300">“</span>
              <blockquote className="relative z-10">
                If value was only money, every raise would make us better off.
              </blockquote>
              <span className="absolute -bottom-6 right-8 text-4xl text-purple-200">”</span>
            </figure>
          </div>

          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm px-6 py-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold">
                ⬢
              </span>
              PBMP Definition of Value:
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              Value is an improvement in life quality—how life feels, how life works, how much choice you have,
              and how sustainable it is—across the areas of life that matter to you.
            </p>
            <p className="text-xs font-medium text-slate-500">
              Personal • Contextual • Measurable
            </p>
          </section>
          </section>

          {/* Right column */}
          <aside className="space-y-5 lg:space-y-6">
          {/* Minimalist graphic: centered at top of right column, matching reference position */}
          <div className="flex flex-col items-center justify-center text-center">
            <svg
              viewBox="0 0 160 80"
              className="w-40 h-20 text-slate-700"
              aria-hidden="true"
            >
              <path
                d="M20 65 L55 20 L90 55 L125 25"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="55" cy="20" r="4" fill="currentColor" />
              <circle cx="90" cy="55" r="4" fill="currentColor" />
              <circle cx="125" cy="25" r="4" fill="currentColor" />
            </svg>
            <p className="mt-1 text-[11px] text-slate-500">
              Minimalist graphim graphic
            </p>
          </div>

          <section className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">The 4 Lenses of Value</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                'How life feels',
                'How life works',
                'Choice & control',
                'Sustainable over time',
              ].map((label) => (
                <button
                  key={label}
                  className="flex flex-col items-start gap-1 px-3 py-2 rounded-xl bg-white text-xs text-slate-800 border border-slate-200 hover:border-purple-400 hover:shadow-sm transition-colors"
                >
                  <span className="font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Domains Section</h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                'Health & Energy',
                'Mind & Emotions',
                'Relationships',
                'Work & Contribution',
                'Financial Stability',
                'Purpose & Meaning',
                'Environment & Safety',
                'Habits & Self-Regulation',
              ].map((label) => (
                <button
                  key={label}
                  className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-[11px] leading-snug hover:border-purple-400 hover:shadow-sm transition-colors text-left"
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Worked Example Section</h3>
              <p className="text-xs text-slate-700 mb-1 font-medium">New job with a 30% raise</p>
              <p className="text-xs text-slate-600">
                Value is an improvement in life quality—how life feels, how life works, how much choice you have,
                and how sustainable it is—across the areas of life that matter to you.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-700">
              <p className="font-semibold mb-1">Premium mini-score</p>
              <div className="space-y-1.5">
                {['Feel', 'Work', 'Choice', 'Sustain'].map((label) => (
                  <div key={label} className="flex items-center justify-between gap-2">
                    <span>{label}</span>
                    <div className="flex gap-1">
                      <span className="w-4 h-1 rounded-full bg-slate-200" />
                      <span className="w-4 h-1 rounded-full bg-purple-500" />
                      <span className="w-4 h-1 rounded-full bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-slate-950 text-white rounded-2xl px-5 py-5 space-y-3">
            <p className="text-xs font-semibold text-purple-200 uppercase tracking-wide">
              Bottom CTA Banner
            </p>
            <h3 className="text-sm font-semibold">
              Build your Personal Value Map
            </h3>
            <p className="text-xs text-slate-200">
              Private by design • Clear scoring • Actionable steps
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button className="px-4 py-2 rounded-full bg-purple-500 text-xs font-semibold hover:bg-purple-400 transition-colors">
                Start Assessment
              </button>
              <button className="px-4 py-2 rounded-full bg-white text-xs font-semibold text-slate-900 hover:bg-slate-100 transition-colors">
                Explore PBMP
              </button>
            </div>
          </section>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default ValueDefinitionPage


import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/survey')({
  component: SurveyLandingPage,
})

function SurveyLandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-20">
        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(148,163,184,0.25)_0,transparent_40%),radial-gradient(circle_at_80%_0,rgba(129,140,248,0.35)_0,transparent_45%),radial-gradient(circle_at_50%_100%,rgba(56,189,248,0.25)_0,transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(248,250,252,0.35)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-10 sm:pt-16">
          {/* Top nav */}
          <div className="flex items-center justify-between text-xs sm:text-sm mb-10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-slate-800 flex items-center justify-center text-[10px] font-bold tracking-wide">
                <span className="text-emerald-400">DEV</span>
              </div>
              <span className="text-slate-300 font-medium">Developer Survey</span>
            </div>
            <div className="flex items-center gap-6 text-slate-300/80">
              <span className="hidden sm:inline cursor-default">Prizes &amp; Rewards</span>
              <span className="hidden sm:inline cursor-default">Partners</span>
              <span className="hidden sm:inline cursor-default">Terms &amp; Conditions</span>
            </div>
          </div>

          {/* Main hero content */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
                Collaboratively administrate empowered markets
                <br className="hidden sm:block" /> via plug-and-play networks.
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl">
                Efficiently unleash cross-media information without cross-media value.
                Quickly maximize timely deliverables for real-time schemas.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center justify-center rounded-full border border-slate-600/80 bg-slate-900/70 px-4 py-2 text-xs sm:text-sm text-slate-100 shadow-sm hover:bg-slate-800/90 transition-colors">
                  LANGUAGE: <span className="ml-1 font-semibold">ENGLISH</span>
                </button>
                <button className="inline-flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2 text-xs sm:text-sm shadow-lg shadow-emerald-500/40 transition-colors">
                  TAKE THE SURVEY NOW
                </button>
              </div>
            </div>

            {/* Floating characters */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm">
                <div className="absolute -left-6 top-6 hidden sm:block animate-float-slow">
                  <div className="w-28 h-32 rounded-2xl bg-slate-800 flex flex-col items-center justify-end shadow-xl shadow-slate-900/70">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-b from-indigo-300 to-violet-500 mb-2" />
                    <div className="w-20 h-3 rounded-t-full bg-slate-900" />
                  </div>
                </div>
                <div className="absolute -right-4 -top-4 hidden sm:block animate-float-fast">
                  <div className="w-24 h-28 rounded-2xl bg-slate-800 flex flex-col items-center justify-end shadow-xl shadow-slate-900/70">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-b from-amber-300 to-pink-500 mb-2" />
                    <div className="w-16 h-3 rounded-t-full bg-slate-900" />
                  </div>
                </div>
                <div className="mt-10 sm:mt-0 h-48 sm:h-60 rounded-3xl bg-slate-900/70 border border-slate-700/70 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-slate-950/70">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Developer Pulse 2026</p>
                    <p className="mt-3 text-lg font-semibold text-slate-50">Tell us how you build.</p>
                    <p className="mt-2 text-xs text-slate-400 max-w-xs mx-auto">
                      We&apos;ll use your feedback to shape smarter tools and experiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wavy divider */}
          <div className="mt-16">
            <div className="h-16 bg-gradient-to-t from-white to-transparent rounded-t-[40%]" />
          </div>
        </div>
      </section>

      {/* Content section */}
      <section className="bg-white text-slate-900 py-10 sm:py-14 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-4">
            Why take this survey? <span className="text-slate-400 text-base sm:text-lg">(TL;DR)</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto text-center mb-10">
            Whether you&apos;re sharing insights with the dev community or just exploring what&apos;s new,
            this survey is for you. It&apos;s open to anyone building modern software experiences.
          </p>

          <div className="grid gap-8 sm:grid-cols-3 text-center text-sm sm:text-base">
            <div className="space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-500">
                💬
              </div>
              <h3 className="font-semibold">It&apos;s YOUR survey</h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Your feedback shapes the roadmap for tools, docs, and workflows we build next.
              </p>
            </div>
            <div className="space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                ⏱
              </div>
              <h3 className="font-semibold">It only takes minutes</h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Short, focused questions designed so you can complete it in one quick sitting.
              </p>
            </div>
            <div className="space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
                🎁
              </div>
              <h3 className="font-semibold">There&apos;s recognition</h3>
              <p className="text-xs sm:text-sm text-slate-600">
                We&apos;ll highlight key insights (and a few standout contributors) in our community recap.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default SurveyLandingPage


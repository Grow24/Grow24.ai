import { useRef, useEffect, useCallback, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useBlogTabs, type BlogTabId } from '../contexts/BlogTabsContext'

export const Route = createFileRoute('/blog')({
  component: BlogPage,
})

const authors: { name: string; title: string; location: string }[] = [
  { name: 'Antti Belt', title: 'Managing Director & Partner', location: 'Helsinki' },
  { name: 'Antti Kaskela', title: 'Partner', location: 'Helsinki' },
  { name: 'Joonas Päivärinta', title: 'Director - Low Carbon Solutions, BCG Vantage', location: 'Düsseldorf' },
  { name: 'Balázs Kotnyek', title: 'Partner and Associate Director', location: 'Budapest' },
  { name: 'Oxana Dankova', title: 'Partner and Director', location: 'Dubai' },
  { name: 'Marc Kolb', title: 'Partner and Associate Director', location: 'San Francisco - Bay Area' },
  { name: 'Zsófia Beck', title: 'Managing Director & Partner', location: 'Budapest' },
]

type RelatedItem = {
  eyebrow: string
  category: string
  kind: string
  date: string
  title: string
  description: string
  cta: string
}

const relatedContent: RelatedItem[] = [
  {
    eyebrow: 'Renewables and Low-Carbon Solutions',
    category: 'Renewables and Low-Carbon Solutions',
    kind: 'Slideshow',
    date: 'December 17, 2021',
    title: 'Rising to the Challenges of Integrating Solar and Wind at Scale',
    description:
      'As the share of variable renewable energy climbs, tackling four challenges will become an urgent task for system operators and designers.',
    cta: 'Learn more',
  },
  {
    eyebrow: 'Energy',
    category: 'Energy',
    kind: 'Article',
    date: 'September 8, 2025',
    title: 'What Wind Energy Teaches Us About Scaling Renewables',
    description:
      'Headlines may suggest climate investing is dead, but a confluence of tailwinds is creating opportunities in low-carbon technologies.',
    cta: 'Learn more',
  },
  {
    eyebrow: 'Energy Transition',
    category: 'Energy Transition',
    kind: 'Article',
    date: 'August 21, 2025',
    title: 'Offshore Wind Industry Update',
    description:
      'A comprehensive update on offshore wind, detailing current challenges, shifting strategies, and evolving government support frameworks.',
    cta: 'Learn more',
  },
  {
    eyebrow: 'Climate Change and Sustainability',
    category: 'Climate Change and Sustainability',
    kind: 'Article',
    date: 'November 3, 2021',
    title: 'Why Your Company Needs to Be an Electricity Trader',
    description:
      'Variable renewable generation will transform electricity systems and increase volatility—companies need to be more flexible in how they consume electricity.',
    cta: 'Learn more',
  },
  {
    eyebrow: 'Energy',
    category: 'Energy',
    kind: 'Article',
    date: 'April 4, 2022',
    title: 'Will Electricity Be Free? Not When You Really Need It',
    description:
      'As economies decarbonize, volatility will surge. Players can use levers to mitigate it—but must act carefully to avoid damaging competitiveness.',
    cta: 'Learn more',
  },
]

// Tab is selected based on the section intersecting this horizontal "selection line"
// under the fixed header. Larger = highlights earlier while scrolling.
const SPY_OFFSET = 380

function BlogPage() {
  const blogTabs = useBlogTabs()
  const heroRef = useRef<HTMLElement>(null)
  const sectionIntroRef = useRef<HTMLElement>(null)
  const sectionRiseRef = useRef<HTMLElement>(null)
  const sectionFlexibilityRef = useRef<HTMLElement>(null)
  const sectionFinlandRef = useRef<HTMLElement>(null)
  const sectionFutureRef = useRef<HTMLElement>(null)
  const sectionAuthorsRef = useRef<HTMLElement>(null)
  const sectionRelatedRef = useRef<HTMLElement>(null)
  const relatedRailRef = useRef<HTMLDivElement>(null)
  const [activeRelatedIndex, setActiveRelatedIndex] = useState(0)

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  })
  const imageScale = useTransform(heroProgress, [0, 0.4], [1, 1.18])

  const scrollToSection = useCallback((tabId: BlogTabId) => {
    const refMap = {
      intro: sectionIntroRef,
      rise: sectionRiseRef,
      flexibility: sectionFlexibilityRef,
      finland: sectionFinlandRef,
      future: sectionFutureRef,
      authors: sectionAuthorsRef,
      related: sectionRelatedRef,
    }
    const el = refMap[tabId].current
    if (!el) return
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--header-offset').trim()
    let offsetPx = 128
    if (raw.endsWith('rem')) {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      offsetPx = parseFloat(raw) * rem
    } else if (raw.endsWith('px')) {
      offsetPx = parseFloat(raw)
    } else if (raw) {
      offsetPx = parseFloat(raw) || 128
    }
    // Nudge the landing position upward so the new section starts immediately under the tabs.
    // (Without this, a few lines from the previous section can remain visible above.)
    const NUDGE_UP_PX = 24
    const effectiveOffset = Math.max(0, offsetPx - NUDGE_UP_PX)
    const rect = el.getBoundingClientRect()
    const targetScrollY = window.scrollY + rect.top - effectiveOffset
    window.scrollTo({ top: Math.max(0, targetScrollY), behavior: 'smooth' })
  }, [])

  // Register scroll handler once on mount so header tab clicks work; refs are stable so no deps needed
  useEffect(() => {
    if (!blogTabs) return
    return blogTabs.registerScrollToSection(scrollToSection)
  }, [blogTabs?.registerScrollToSection, scrollToSection])

  // Scroll-spy: set active tab when section enters view (use ref so we don't re-run effect when activeTab changes)
  const blogTabsRef = useRef(blogTabs)
  blogTabsRef.current = blogTabs
  useEffect(() => {
    const refList: { id: BlogTabId; ref: typeof sectionIntroRef }[] = [
      { id: 'intro', ref: sectionIntroRef },
      { id: 'rise', ref: sectionRiseRef },
      { id: 'flexibility', ref: sectionFlexibilityRef },
      { id: 'finland', ref: sectionFinlandRef },
      { id: 'future', ref: sectionFutureRef },
      { id: 'authors', ref: sectionAuthorsRef },
      { id: 'related', ref: sectionRelatedRef },
    ]
    const onScroll = () => {
      const setActiveTab = blogTabsRef.current?.setActiveTab
      if (!setActiveTab) return
      // Prefer the section that currently spans the selection line.
      for (let i = 0; i < refList.length; i++) {
        const el = refList[i].ref.current
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= SPY_OFFSET && rect.bottom > SPY_OFFSET) {
          setActiveTab(refList[i].id)
          return
        }
      }
      // Fallback: last section whose top has passed the selection line.
      for (let i = refList.length - 1; i >= 0; i--) {
        const el = refList[i].ref.current
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= SPY_OFFSET) {
          setActiveTab(refList[i].id)
          return
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const rail = relatedRailRef.current
    if (!rail) return
    const onRailScroll = () => {
      const cardWidth = rail.firstElementChild ? (rail.firstElementChild as HTMLElement).offsetWidth : 1
      const idx = Math.round(rail.scrollLeft / Math.max(cardWidth, 1))
      setActiveRelatedIndex(Math.max(0, Math.min(relatedContent.length - 1, idx)))
    }
    rail.addEventListener('scroll', onRailScroll, { passive: true })
    onRailScroll()
    return () => rail.removeEventListener('scroll', onRailScroll as any)
  }, [])

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 -mt-6 sm:-mt-8 pt-0 pb-8 sm:pb-10 md:pb-14 px-4 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Hero heading */}
        <header className="mb-6 sm:mb-8 md:mb-10">
          <div className="mb-3">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
              Energy
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-[2.7rem] leading-tight font-bold text-slate-900 dark:text-white mb-3">
            Flexibility, Not Capacity, Will Decide Renewable Energy’s Future
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-1">
            By Antti Belt, Antti Kaskela, Joonas Päivärinta, Balázs Kotnyek, Oxana Dankova, Marc Kolb, and Zsófia Beck
          </p>
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Article &nbsp;·&nbsp; February 25, 2026 &nbsp;·&nbsp; 15 MIN read
          </p>
        </header>
      </div>

      <div className="max-w-6xl mx-auto">
        <article className="max-w-3xl mx-auto text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-200">
          {/* Section: Overview (intro) */}
          <section
            id="section-intro"
            ref={sectionIntroRef}
            className="scroll-mt-blog-section space-y-8 pt-2 pb-6 sm:pb-8"
          >
                {/* Full-width hero image – Overview tab only (break out of article column to span viewport) */}
                <section
                  ref={heroRef}
                  className="w-screen max-w-[100vw] ml-[calc(-50vw+50%)] mr-[calc(-50vw+50%)] mb-10 sm:mb-12"
                >
                  <div className="relative overflow-hidden bg-slate-900/5 aspect-[16/6] w-full rounded-none">
                    <motion.div
                      style={{ scale: imageScale }}
                      className="origin-center absolute inset-0 w-full h-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 via-sky-600/50 to-slate-800 saturate-110" />
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-800/80 via-sky-600/70 to-slate-900" />
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none">
                          {[8, 14, 22, 28, 36, 42, 50, 58, 64, 72, 78, 86].map((x, i) => (
                            <rect
                              key={i}
                              x={`${x}%`}
                              y={`${70 - (i % 4) * 12}%`}
                              width="2.5%"
                              height={`${18 + (i % 5) * 8}%`}
                              fill="white"
                              opacity={0.5 + (i % 3) * 0.1}
                            />
                          ))}
                          <path
                            d="M 0 45 Q 25 35 50 42 T 100 38"
                            fill="none"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeDasharray="6 5"
                            opacity="0.6"
                          />
                          <path
                            d="M 0 75 Q 40 68 80 72 L 100 70"
                            fill="none"
                            stroke="white"
                            strokeWidth="1.2"
                            strokeDasharray="5 4"
                            opacity="0.5"
                          />
                        </svg>
                      </div>
                    </motion.div>
                    <div className="absolute left-1/2 top-4 sm:top-6 md:top-8 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-2xl mx-auto">
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-xl bg-white/95 dark:bg-slate-950/95 shadow-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-5 text-xs sm:text-sm"
                      >
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                          Key Takeaways
                        </p>
                        <p className="text-slate-700 dark:text-slate-200 mb-3">
                          Renewable energy has become so abundant that it is cannibalizing its own value. The solution
                          lies in changing how and when electricity is consumed, stored, and moved.
                        </p>
                        <ul className="space-y-2 text-slate-700 dark:text-slate-200">
                          <li>
                            In the European Union, value cannibalization reduced renewable energy producer revenues by
                            over $14 billion in 2025.
                          </li>
                          <li>
                            Tackling daily and weekly volatility will have the most impact but is also the most challenging
                            issue to solve.
                          </li>
                          <li>
                            Creating system-wide flexibility demands new market designs, network planning, and policy
                            frameworks that reward flexibility.
                          </li>
                        </ul>
                      </motion.div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                    <p>
                      Renewable energy has succeeded in overcoming its cost challenges, but systemic flexibility will be
                      critical to its value in the future. Across the globe, countries have stepped up efforts to decarbonize
                      energy production in recent times. Companies have set up wind and solar farms, which are relatively
                      inexpensive and quick to build. By the end of 2025, renewable energy had become the world’s main source
                      of electricity.
                    </p>
                    <p>
                      However, renewable energy has become so abundant that it is cannibalizing its own value. Large amounts of
                      renewably generated electricity enter power grids at the same time, depressing prices when demand is low
                      and reducing producer revenues when their output is highest. These spikes have triggered unprecedented
                      volatility in wholesale electricity prices. Consequently, despite the sector’s past success and future
                      importance, there is an increasing risk that investments in renewable energy could dry up if the issue is
                      not addressed.
                    </p>
                    <p>
                      Green subsidies and price guarantees address the problem’s symptoms rather than the causes, leaving the
                      mismatch between electricity supply and demand unresolved. Ensuring system-wide flexibility has become
                      critical to tackling the problem. Market-based flexibility solutions change how and when electricity is
                      consumed, stored, and moved, which will help renewable energy to regain its value.
                    </p>
                  </section>

                  {/* Subscription strip for mobile / tablet */}
                  <section className="lg:hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-emerald-50/80 dark:bg-emerald-900/20 p-4 space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                      Weekly Insights Subscription
                    </p>
                    <p className="text-sm text-slate-800 dark:text-slate-100">
                      Stay ahead with insights on energy and flexibility—delivered straight to your inbox.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        placeholder="Enter Email"
                        className="flex-1 rounded-full border border-emerald-200 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow"
                      >
                        →
                      </button>
                    </div>
                  </section>
          </section>

          {/* Section: Market Value Cannibalization */}
          <section
            id="section-rise"
            ref={sectionRiseRef}
            className="scroll-mt-blog-section space-y-4 pt-12 sm:pt-14 pb-10 sm:pb-12 border-t border-slate-200/70 dark:border-slate-800/70"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
              The Rise in Renewables Results in Market Value Cannibalization
            </h2>
            <p>
              Once renewable energy accounts for a large share of a country’s electricity output, its market value
              often falls below producers’ breakeven costs, threatening their financial viability. This also happens in
              regions that generate a great deal of wind or solar power but do not consume much electricity locally,
              especially in nodal markets.
            </p>
            <p>
              In Europe, wind energy value factors in the worst-hit markets have fallen to between 0.55 and 0.65,
              meaning producers capture only 55% to 60% of average power-market prices. Solar value factors have fallen
              to between 0.45 and 0.65. Negative-price hours have more than doubled since 2020, largely when
              renewables are generating power. Altogether, value cannibalization reduced EU renewable revenues by more
              than $14 billion in 2025.
            </p>
            <p>
              Weather-dependent generation that rises and falls together, distributed rooftop solar that displaces
              utility-scale demand, and grid bottlenecks that strand power in oversupplied areas all erode value. When
              curtailment is not an option, prices can even turn negative, forcing producers to pay customers to take
              electricity. The result is a vicious circle: the faster a system decarbonizes, the greater the risk of
              value decline—and the weaker the investment case for new renewable capacity.
            </p>
          </section>

          {/* Section: Systemic Flexibility */}
          <section
            id="section-flexibility"
            ref={sectionFlexibilityRef}
            className="scroll-mt-blog-section space-y-4 pt-12 sm:pt-14 pb-10 sm:pb-12 border-t border-slate-200/70 dark:border-slate-800/70"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
              Tackling the Value Trap with Systemic Flexibility
            </h2>
            <p>
              Flexibility in how and when electricity is consumed, stored, and moved is emerging as the best way to
              align renewable supply with demand. Done properly, it strengthens affordability, reliability, and
              sustainability simultaneously.
            </p>
            <p>
              Flexibility is needed across timeframes from seconds to seasons, but daily and weekly volatility will
              matter most. In the shortest intervals, grid-forming inverters, batteries, flexible reserve capacity, and
              dynamic tariffs will be crucial. Over a day, batteries and virtual power plants that aggregate
              distributed resources will dominate, arbitraging low- and high-price hours and soaking up excess
              generation.
            </p>
            <p>
              At the weekly scale, today’s storage technologies are still expensive, but volatility will increase as
              renewables’ share rises, making business models that combine industrial demand shifting, power-to-heat,
              and hydrogen or synthetic-fuel pathways more attractive. Market designs will need to reward duration and
              capacity, not just short-term response.
            </p>
          </section>

          {/* Section: Finland Case */}
          <section
            id="section-finland"
            ref={sectionFinlandRef}
            className="scroll-mt-blog-section space-y-4 pt-12 sm:pt-14 pb-10 sm:pb-12 border-t border-slate-200/70 dark:border-slate-800/70"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
              How Finland Is Building Flexibility
            </h2>
            <p>
              Finland, where wind accounted for roughly 27% of electricity generation in 2025, has seen unprecedented
              price volatility. Market-exposed wind producers have experienced large revenue swings and falling
              returns—and the country has responded by building flexibility into its system.
            </p>
            <p>
              Players have invested in forecasting, automation, and market-integration tools, and the system operator
              has created new ancillary-service markets that stimulate reserve capacity. Batteries, hydro, and nuclear
              power all help balance supply across time horizons.
            </p>
            <p>
              A standout innovation is the rapid deployment of electric boilers connected to district-heating systems.
              About 3,000 MW of e-boiler capacity—around a quarter of peak load—now provides heat and industrial steam
              while acting as a large, controllable electrical load. When prices are low on windy days, the boilers
              run hard; when prices spike, they switch off and legacy boilers take over. This strategy is both
              financially attractive and highly effective at absorbing excess renewable generation.
            </p>
          </section>

          {/* Section: Global Next Steps */}
          <section
            id="section-future"
            ref={sectionFutureRef}
            className="scroll-mt-blog-section space-y-5 pt-12 sm:pt-14 pb-10 sm:pb-12 border-t border-slate-200/70 dark:border-slate-800/70"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
              Ensuring a Future for Renewable Energy Globally
            </h2>
            <p>
              Countries that have invested heavily in renewables must now focus on creating flexibility throughout
              their power systems. That will require rethinking market design, network planning, the role of storage
              and demand-side resources, and the way policy frameworks allocate risks and rewards.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Plan for system value, not volume.
                </h3>
                <p>
                  Renewables and batteries should be sited, sized, and timed based on how they reduce system balancing
                  costs and congestion, not just on project-level economics or capacity targets.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Actively manage renewable assets.
                </h3>
                <p>
                  Curtailment, when used strategically, can lower balancing costs and enable higher renewable
                  penetration. This demands real-time telemetry, automated dispatch, and contracts that support
                  operational flexibility.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Unlock demand-side flexibility.
                </h3>
                <p>
                  Industrial loads, buildings, data centers, EVs, and heating systems can all shift consumption in
                  response to price and grid signals. Aggregators and clear regulations around data and compensation
                  are key.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Create rules that reward flexibility.
                </h3>
                <p>
                  Wholesale, balancing, and ancillary-service markets must properly value speed, duration, and location
                  of flexible resources, and open participation to storage, demand response, and hybrid assets.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Build for resilience—and embrace volatility.
                </h3>
                <p>
                  Long-duration storage, interconnections, and strategic reserves may be used infrequently but are
                  critical during extreme events. Rather than eliminating volatility, leading systems will industrialize
                  their response to it and turn flexibility into a durable competitive advantage.
                </p>
                <p>
                  The era of treating renewable projects as standalone infrastructure is over. Tomorrow’s winners will
                  be those that extract the most value from the renewables they already produce by embedding flexibility
                  deeply into their power systems.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Authors */}
          <section
            id="section-authors"
            ref={sectionAuthorsRef}
            className="scroll-mt-blog-section space-y-8 pt-12 sm:pt-14 pb-10 sm:pb-12 border-t border-slate-200/70 dark:border-slate-800/70"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Authors
            </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {authors.map((author) => (
                    <div
                      key={author.name}
                      className="flex gap-4 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold text-lg">
                        {author.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <a
                          href="#"
                          className="text-slate-900 dark:text-white font-medium underline underline-offset-2 decoration-slate-400 hover:decoration-slate-600 dark:hover:decoration-slate-300 transition-colors"
                        >
                          {author.name}
                        </a>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                          {author.title}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {author.location}
                        </p>
                        <a
                          href="#"
                          className="mt-2 inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                          aria-label={`Email ${author.name}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
          </section>

          {/* Section: Related Content */}
          <section
            id="section-related"
            ref={sectionRelatedRef}
            className="scroll-mt-blog-section pt-12 sm:pt-14 pb-10 sm:pb-12 border-t border-slate-200/70 dark:border-slate-800/70"
          >
            {/* Mobile: use container width with horizontal padding; sm+ : full-bleed like BCG */}
            <div className="-mx-4 px-4 bg-slate-900 text-white sm:w-screen sm:max-w-[100vw] sm:ml-[calc(-50vw+50%)] sm:mr-[calc(-50vw+50%)]">
              <div className="max-w-6xl mx-auto px-0 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl sm:text-3xl font-semibold">Related Content</h2>
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => relatedRailRef.current?.scrollBy({ left: -420, behavior: 'smooth' })}
                      className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors inline-flex items-center justify-center"
                      aria-label="Scroll related content left"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => relatedRailRef.current?.scrollBy({ left: 420, behavior: 'smooth' })}
                      className="h-9 w-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors inline-flex items-center justify-center"
                      aria-label="Scroll related content right"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div
                  ref={relatedRailRef}
                  className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-4 sm:scroll-px-6 md:scroll-px-8 pb-3"
                >
                  {relatedContent.map((item) => (
                    <div
                      key={item.title}
                      className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[360px] rounded-2xl overflow-hidden bg-white/10 border border-white/15"
                    >
                      <div className="h-40 sm:h-44 md:h-48 bg-gradient-to-br from-sky-500/30 via-emerald-500/20 to-slate-950/60 relative">
                        <span className="absolute left-4 top-4 inline-flex items-center rounded-full border border-white/25 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
                          {item.eyebrow}
                        </span>
                      </div>
                      <div className="p-4 sm:p-5 space-y-3 bg-white/90 text-slate-900">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                          <span>{item.kind}</span>
                          <span>·</span>
                          <span>{item.date}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold leading-snug">{item.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{item.description}</p>
                        <div className="pt-2">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-xs font-semibold"
                          >
                            {item.cta} <span aria-hidden="true">→</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                  {relatedContent.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        const rail = relatedRailRef.current
                        if (!rail) return
                        const card = rail.children.item(i) as HTMLElement | null
                        card?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
                      }}
                      className={`h-2 w-2 rounded-full transition-colors ${i === activeRelatedIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
                      aria-label={`Go to related content item ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
  )
}

export default BlogPage


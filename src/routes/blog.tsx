import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'

export const Route = createFileRoute('/blog')({
  component: BlogPage,
})

type TabId = 'intro' | 'rise' | 'flexibility' | 'finland' | 'future'

const tabs: { id: TabId; label: string }[] = [
  { id: 'intro', label: 'Overview' },
  { id: 'rise', label: 'Market Value Cannibalization' },
  { id: 'flexibility', label: 'Systemic Flexibility' },
  { id: 'finland', label: 'Finland Case' },
  { id: 'future', label: 'Global Next Steps' },
]

function BlogPage() {
  const [activeTab, setActiveTab] = useState<TabId>('intro')

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 py-8 sm:py-10 md:py-14 px-4">
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

        {/* Hero image with overlaid key takeaways and right actions on desktop */}
        <section className="mb-10 sm:mb-12">
          <div className="lg:grid lg:grid-cols-[minmax(0,3.2fr)_minmax(260px,1.2fr)] lg:gap-8 items-start">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900/5">
              <div className="aspect-[16/6] w-full bg-gradient-to-r from-emerald-700 via-sky-500 to-slate-900 opacity-90" />
              {/* Key takeaways card overlay */}
              <div className="absolute inset-x-4 top-4 sm:top-6 md:top-8 lg:left-8 lg:inset-x-auto lg:max-w-sm">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl bg-white/95 dark:bg-slate-950/95 shadow-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-5 text-xs sm:text-sm"
                >
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
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

            {/* Right-hand action / subscribe column */}
            <div className="hidden lg:flex flex-col gap-4 pt-4">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 mb-3 uppercase tracking-wide">
                  Stay ahead with insights on energy
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                  Subscribe to receive the latest thinking on renewable energy and flexibility.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    placeholder="Enter Email"
                    className="flex-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="mb-6 sm:mb-8 overflow-x-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 dark:bg-slate-900/60 px-2 py-1 border border-slate-200 dark:border-slate-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main article body (tabbed) */}
        <article className="max-w-3xl text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-200">
          <AnimatePresence mode="wait">
            {activeTab === 'intro' && (
              <motion.section
                key="intro"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
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
            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
              Weekly Insights Subscription
            </p>
            <p className="text-sm text-slate-800 dark:text-slate-100">
              Stay ahead with insights on energy and flexibility—delivered straight to your inbox.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter Email"
                className="flex-1 rounded-full border border-emerald-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow"
              >
                →
              </button>
            </div>
          </section>
              </motion.section>
            )}

            {activeTab === 'rise' && (
              <motion.section
                key="rise"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
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
              </motion.section>
            )}

            {activeTab === 'flexibility' && (
              <motion.section
                key="flexibility"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
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
              </motion.section>
            )}

            {activeTab === 'finland' && (
              <motion.section
                key="finland"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
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
              </motion.section>
            )}

            {activeTab === 'future' && (
              <motion.section
                key="future"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
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
              </motion.section>
            )}
          </AnimatePresence>
        </article>
      </div>
    </main>
  )
}

export default BlogPage


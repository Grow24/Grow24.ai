import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComingSoon } from '../contexts/ComingSoonContext'

export const Route = createFileRoute('/become-partner')({
  component: BecomePartnerPage,
})

const TABS = [
  { id: 'identify', label: 'Identify Partner Type' },
  { id: 'benefits', label: 'Partner Benefits' },
  { id: 'journey', label: 'Partner Journey' },
  { id: 'faq', label: 'FAQ' },
] as const

const PARTNER_PROGRAMS = [
  {
    id: 'consulting',
    title: 'Consulting Partners',
    icon: 'consulting',
    description: 'Help customers improve the way they work, then implement PBMP to make those improvements real.',
    whatYouDo: 'Startups, SMBs, and enterprises that want end-to-end help:',
    bestFor: null as string | null,
    fitIf: 'A consulting firm, boutique advisory, process expert, or transformation specialist.',
  },
  {
    id: 'enterprise',
    title: 'Enterprise Delivery Partners',
    icon: 'enterprise',
    description: 'Deliver large, complex implementations across multiple departments, locations, and systems.',
    whatYouDo: null as string | null,
    bestFor: 'Large enterprises that need multi-team, multi-country deployments and professional program execution.',
    fitIf: 'A global consulting firm, managed service provider (MSP), cloud service provider, or BPM firm with cross-region capability.',
  },
  {
    id: 'channel',
    title: 'Channel Ecosystem Partners',
    icon: 'channel',
    description: 'Build and manage a network of resellers in a region.',
    whatYouDo: null as string | null,
    bestFor: 'Organizations that want to scale through a reseller network in a region.',
    fitIf: 'A distributor, master partner, or channel manager with reseller relationships.',
  },
  {
    id: 'local',
    title: 'Local Growth Partners',
    icon: 'local',
    description: 'Build PBMP and help customers succeed locally.',
    whatYouDo: null as string | null,
    bestFor: 'Customers who value local language, local support, and hands-on guidance.',
    fitIf: 'A distributor, channel enabler, or organization with an established reseller network quality, strong regional influence.',
  },
  {
    id: 'audience',
    title: 'Audience & Referral Partners',
    icon: 'audience',
    description: 'Introduce PBMP to your audience and refer customers to Grow²⁴.',
    whatYouDo: null as string | null,
    bestFor: 'Creators and organizations with trusted audiences who care about business growth, productivity, or professional development.',
    fitIf: 'A creator, educator, regional reseller, or IT services organization with an engaged audience.',
  },
  {
    id: 'marketplace',
    title: 'Solution Marketplace Partners',
    icon: 'marketplace',
    description: 'Build add-on templates, pre-built integrations, and accelerated solutions on top of PBMP.',
    whatYouDo: null as string | null,
    bestFor: 'Customers who want ready-to-use solutions for specific industries, functions, or workflows.',
    fitIf: 'A developer, independent software vendor, or marketplace builder.',
  },
]

function PartnerCardIcon({ type, className = '' }: { type: string; className?: string }) {
  const cls = `w-full h-full text-slate-500 dark:text-slate-400 ${className}`.trim()
  switch (type) {
    case 'consulting':
      return (
        <svg className={cls} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="32" cy="24" r="8" />
          <path d="M20 52c0-6.6 5.4-12 12-12s12 5.4 12 12" />
          <path d="M44 32h12l4 8v12H44V32z" />
        </svg>
      )
    case 'enterprise':
      return (
        <svg className={cls} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="12" width="48" height="36" rx="2" />
          <path d="M16 28h32M16 36h24M16 44h16" />
          <circle cx="48" cy="44" r="4" />
        </svg>
      )
    case 'channel':
      return (
        <svg className={cls} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="16" width="20" height="28" rx="2" />
          <rect x="36" y="16" width="20" height="28" rx="2" />
          <path d="M28 32h8M18 24h4M18 40h4M46 24h4M46 40h4" />
        </svg>
      )
    case 'local':
      return (
        <svg className={cls} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 36h24v16H20z" />
          <path d="M28 36v-8a4 4 0 118 0v8" />
          <circle cx="32" cy="22" r="6" />
          <path d="M32 52v4M28 56h8" />
        </svg>
      )
    case 'audience':
      return (
        <svg className={cls} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="12" y="8" width="40" height="32" rx="2" />
          <path d="M12 40h40M20 48h24M26 54h12" />
          <path d="M32 16v8M28 20h8" />
        </svg>
      )
    case 'marketplace':
      return (
        <svg className={cls} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="8" y="20" width="48" height="32" rx="2" />
          <path d="M24 20V12a4 4 0 014-4h8a4 4 0 014 4v8" />
          <circle cx="32" cy="36" r="6" />
          <path d="M28 36h8M32 32v8" />
        </svg>
      )
    default:
      return <div className={cls} />
  }
}

function BecomePartnerPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('identify')
  const { showComingSoon } = useComingSoon()

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Page title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 dark:text-white mb-8">
          Partner With Us
        </h1>

        {/* Tabs */}
        <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 border-b border-slate-200 dark:border-slate-700 pb-6 mb-8" aria-label="Partner sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 dark:border-amber-400 bg-amber-50/50 dark:bg-amber-900/20 -mb-px'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          {activeTab === 'identify' && (
            <motion.div
              key="identify"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-10"
            >
              {/* Hero – Partner with Grow²⁴ */}
              <section className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    Partner with Grow<sup className="text-lg sm:text-xl md:text-2xl align-super">24</sup>
                  </h2>
                  <p className="text-base sm:text-lg text-amber-800 dark:text-amber-200 font-medium">
                    Build, Deliver, and Scale PBMP Solutions
                  </p>
                </div>
                <div className="flex-shrink-0 w-full md:w-72 h-44 md:h-52 flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-emerald-100 dark:from-sky-900/30 dark:to-emerald-900/20">
                  <svg className="w-full h-full p-4 text-sky-600 dark:text-sky-400" viewBox="0 0 280 140" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="40" y="50" width="120" height="70" rx="4" fill="rgba(255,255,255,0.8)" stroke="currentColor" />
                    <path d="M50 65h100M50 78h80M50 91h60" />
                    <path d="M180 45h70l12 20v50H180V45z" fill="rgba(255,255,255,0.6)" stroke="currentColor" />
                    <circle cx="215" cy="95" r="12" />
                    <path d="M100 75h30v-10h-30z" />
                    <path d="M115 55v20M105 65h20" />
                    <rect x="20" y="95" width="30" height="25" rx="2" opacity="0.5" />
                    <rect x="230" y="100" width="25" height="20" rx="2" opacity="0.5" />
                    <path d="M55 35l15-10M200 35l-15-10" opacity="0.4" />
                  </svg>
                </div>
              </section>

              {/* Partner program cards grid – same layout as image */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PARTNER_PROGRAMS.map((program) => (
                  <motion.article
                    key={program.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/60 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
                  >
                    <div className="flex gap-4 mb-4">
                      <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-slate-500 dark:text-slate-400 rounded-lg bg-slate-100 dark:bg-slate-800/60">
                        <PartnerCardIcon type={program.icon} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                          {program.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {program.description}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm flex-1">
                      {program.whatYouDo != null && (
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">What you do</p>
                          <p className="text-slate-600 dark:text-slate-400">{program.whatYouDo}</p>
                        </div>
                      )}
                      {program.bestFor != null && (
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">Best for</p>
                          <p className="text-slate-600 dark:text-slate-400">{program.bestFor}</p>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">You are a fit if you are</p>
                        <p className="text-slate-600 dark:text-slate-400">{program.fitIf}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => showComingSoon('partner-explore', program.title, 'Explore this partner program.')}
                      className="mt-6 w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
                    >
                      Apply here
                    </button>
                  </motion.article>
                ))}
              </section>
            </motion.div>
          )}

          {activeTab === 'benefits' && (
            <motion.section
              key="benefits"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                Partner benefits (Grow<sup className="align-super text-lg">24</sup> / PBMP)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                {/* Left column */}
                <div className="space-y-8">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Commercial benefits</h3>
                    <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      <li><strong>Deal registration:</strong> protect partner opportunities + clear rules on who owns which lead</li>
                      <li><strong>Referral / reseller margin:</strong> structured incentives based on program type (affiliate vs VAR vs SI)</li>
                      <li><strong>Co-selling support:</strong> Grow²⁴ joins key calls, helps with demos, proposals, and executive alignment</li>
                      <li><strong>Marketplace revenue share:</strong> for templates/add-ons listed in the Solution Marketplace</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Enablement benefits</h3>
                    <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      <li><strong>Partner onboarding kit:</strong> pitch deck, demo scripts, discovery questions, objection handling</li>
                      <li><strong>Role-based training:</strong> sales, presales, implementation, customer success</li>
                      <li><strong>Certifications:</strong> Associate → Professional → Expert tracks</li>
                      <li><strong>Sandbox/demo environment:</strong> test PBMP setups + showcase workflows</li>
                    </ul>
                  </div>
                </div>
                {/* Right column */}
                <div className="space-y-8">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Go-to-market benefits</h3>
                    <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      <li><strong>Co-marketing:</strong> webinars, joint case studies, newsletter features</li>
                      <li><strong>Partner directory listing:</strong> searchable listing by region/industry/capability</li>
                      <li><strong>Campaign-in-a-box:</strong> ready-made outreach sequences + landing pages + decks</li>
                      <li><strong>Events & community access:</strong> partner-only sessions, roundtables, early roadmap previews</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Delivery & customer success benefits</h3>
                    <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      <li><strong>Implementation playbooks:</strong> standard rollout plans, governance templates, QBR templates</li>
                      <li><strong>Support escalation path:</strong> priority partner support + faster resolution SLAs</li>
                      <li><strong>Solution templates library:</strong> reusable accelerators by industry/function</li>
                      <li><strong>Quality framework:</strong> delivery standards + customer outcome measurement</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => showComingSoon('partner-benefits', 'Partner Benefits', 'Get full details on partner benefits.')}
                  className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
                >
                  Request benefits details
                </button>
              </div>
            </motion.section>
          )}

          {activeTab === 'journey' && (
            <motion.section
              key="journey"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                2) Partner journey (Apply → Verify → Enable → Co-sell → Deliver → Grow)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Left column: Steps 1–3 */}
                <div className="space-y-6">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Step 1 — Apply</h3>
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      <li>Submit partner profile: company, regions, capabilities, customer types, team size</li>
                      <li>Choose program track(s): Consulting / Enterprise Delivery / Distributor / Reseller / Affiliate / Marketplace Builder</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Step 2 — Verify</h3>
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      <li>Validation call + references (where relevant)</li>
                      <li>Capability check: sales ability, delivery ability, support readiness</li>
                      <li>Agreement: commercial terms + compliance + brand usage</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Step 3 — Enable</h3>
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      <li>Training + certification path</li>
                      <li>Access to partner portal: playbooks, templates, demo assets</li>
                      <li>Setup: deal registration, lead handoff rules, support escalation</li>
                    </ul>
                  </div>
                </div>
                {/* Right column: Steps 4–6 */}
                <div className="space-y-6">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Step 4 — Co-sell</h3>
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      <li>Joint account planning (for qualified opportunities)</li>
                      <li>Demo support + solution mapping + value case support</li>
                      <li>Proposal/pricing support + negotiation guidance</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Step 5 — Deliver</h3>
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      <li>Implementation project structure (MAP/success plan)</li>
                      <li>Adoption support: training, QBRs, KPI cadence</li>
                      <li>Customer outcomes measured and documented</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Step 6 — Grow</h3>
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      <li>Tier upgrade based on performance (revenue, CSAT, certifications, delivery quality)</li>
                      <li>Co-marketing eligibility increases</li>
                      <li>Access to advanced solutions + early roadmap + marketplace boosts</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => showComingSoon('partner-journey', 'Partner Journey', 'Start your partner application.')}
                  className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
                >
                  Start your journey
                </button>
              </div>
            </motion.section>
          )}

          {activeTab === 'faq' && (
            <motion.section
              key="faq"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">FAQs</h2>
              <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-6 shadow-sm text-left">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-base sm:text-lg">Do I have to choose only one program?</h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">You can start with one and expand as you grow capability.</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-6 shadow-sm text-left">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-base sm:text-lg">How do deal registration and lead protection work?</h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">Registered deals are protected for a defined time window with clear engagement rules.</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-6 shadow-sm text-left">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-base sm:text-lg">What support do partners get during implementation?</h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">Access to delivery playbooks, success templates, and escalation support.</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-6 shadow-sm text-left">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-base sm:text-lg">How do Marketplace Builders get featured?</h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">High-quality solutions with strong adoption and reviews get higher visibility.</p>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

export default BecomePartnerPage

import React, { useState, useEffect } from 'react'
import { Link, useSearch } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useComingSoon } from '../contexts/ComingSoonContext'

// Map dashboard block category to overview section id
const CATEGORY_TO_SECTION: Record<string, string> = {
  Goals: 'overview',
  Strategy: 'rtb',
  Objective: 'outcomes',
  Plan: 'templates',
  Project: 'process',
  Operations: 'adoption',
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'outcomes', label: 'Outcomes & KPIs' },
  { id: 'rtb', label: 'RTB Hub' },
  { id: 'questions', label: 'Questions Engine' },
  { id: 'templates', label: 'Templates' },
  { id: 'process', label: 'Process Library' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'adoption', label: 'Adoption' },
  { id: 'training', label: 'Training' },
  { id: 'integration', label: 'Integration' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'change-management', label: 'Change Management' },
  { id: 'case-studies', label: 'Case Studies' },
]

const HERO_CARDS = [
  { title: 'Key Outcomes', icon: '📊', desc: 'Primary outcomes and north-star KPIs' },
  { title: 'Reason to Believe', icon: '💡', desc: 'Proven frameworks and evidence' },
  { title: 'Q&A Engine', icon: '❓', desc: 'Strategic questions and data analysis' },
  { title: 'Case Studies', icon: '📁', desc: 'Success stories and impact' },
]

const SECTION_CTA_CLASS =
  'inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-sm font-semibold text-white transition-colors'

function SectionBlock({
  title,
  children,
  id,
  icon,
  cta,
  onCtaScroll,
  onCtaModal,
}: {
  title: string
  children: React.ReactNode
  id?: string
  icon?: string
  cta?: { label: string; scrollToId?: string; opensModal?: boolean }
  onCtaScroll?: (sectionId: string) => void
  onCtaModal?: (sectionTitle: string) => void
}) {
  return (
    <section id={id} className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          {title}
        </h3>
        {cta && (
          <button
            type="button"
            onClick={() => {
              if (cta.opensModal && onCtaModal) onCtaModal(title)
              else if (cta.scrollToId && onCtaScroll) onCtaScroll(cta.scrollToId)
            }}
            className={SECTION_CTA_CLASS}
          >
            <span>{cta.label}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
      {children}
    </section>
  )
}

export default function SolutionOverviewPage() {
  const search = useSearch({ from: '/solutions/overview' })
  const category = search?.category as string | undefined
  const initialSection = category && CATEGORY_TO_SECTION[category] ? CATEGORY_TO_SECTION[category] : 'overview'
  const [activeTab, setActiveTab] = useState(initialSection)
  const { showComingSoon } = useComingSoon()

  const scrollToSection = (id: string) => {
    setActiveTab(id)
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSectionCtaModal = (sectionTitle: string) => {
    showComingSoon(
      'solutions-overview-section',
      `${sectionTitle} – Get in touch`,
      'Enter your details and we’ll reach out with next steps or a demo.',
      { sectionTitle },
    )
  }

  // On load, scroll to the section for the category passed from the dashboard
  useEffect(() => {
    if (!category || !CATEGORY_TO_SECTION[category]) return
    const sectionId = CATEGORY_TO_SECTION[category]
    setActiveTab(sectionId)
    const el = document.getElementById(sectionId)
    if (el) {
      const t = setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return () => clearTimeout(t)
    }
  }, [category])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-slate-800 dark:bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/#solutions"
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Solution Dashboard
              </Link>
              <h1 className="text-xl md:text-2xl font-bold">1. Solution Overview</h1>
            </div>
            {/* Horizontal tabs - compact on small screens */}
            <nav className="flex overflow-x-auto gap-1 pb-1 scrollbar-thin" style={{ scrollbarWidth: 'thin' }}>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === item.id
                      ? 'bg-emerald-500 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Left sidebar - hide on small, show from lg */}
        <aside className="hidden lg:block w-56 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 min-h-[calc(100vh-4rem)] sticky top-[4.5rem]">
          <nav className="p-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === item.id
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {/* Hero banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 text-white p-8 md:p-10 shadow-xl"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Accelerate Growth with Our Corporate Strategy Solution
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {HERO_CARDS.map((card) => {
                  const sectionId = card.title === 'Key Outcomes' ? 'outcomes' : card.title === 'Reason to Believe' ? 'rtb' : card.title === 'Q&A Engine' ? 'questions' : 'case-studies'
                  return (
                  <div
                    key={card.title}
                    className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors cursor-pointer"
                    onClick={() => scrollToSection(sectionId)}
                  >
                    <div className="text-2xl mb-2">{card.icon}</div>
                    <div className="font-semibold text-sm">{card.title}</div>
                    <div className="text-xs text-white/80 mt-1">{card.desc}</div>
                  </div>
                  )
                })}
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {['1 Key Outcomes', '2 Reason To Believe', '3 Financial Linkage', '5 Case Studies'].map((label) => (
                  <button
                    key={label}
                    className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-sm font-medium transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <SectionBlock
              id="overview"
              title="Executive Overview"
              icon="📋"
              cta={{ label: 'Key Outcomes', scrollToId: 'outcomes' }}
              onCtaScroll={scrollToSection}
            >
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <p><strong className="text-slate-800 dark:text-slate-200">Value Promise:</strong> Accelerate your corporate strategy development by turning core business goals into actionable plans.</p>
                <p><strong className="text-slate-800 dark:text-slate-200">Target Audience:</strong> C-suite executives, strategy teams, business unit leaders.</p>
                <Link to="/#solutions" className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                  Key Outcomes <span>→</span>
                </Link>
              </div>
            </SectionBlock>

            <SectionBlock
              id="outcomes"
              title="Outcomes & KPIs"
              icon="📊"
              cta={{ label: 'Get Started', opensModal: true }}
              onCtaModal={handleSectionCtaModal}
            >
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Primary Outcomes: Revenue growth, operational efficiency, cost reduction</li>
                <li>• North-Star KPIs: Revenue Growth Rate, EBITDA Margin, Customer Retention</li>
              </ul>
            </SectionBlock>

            <SectionBlock
              id="rtb"
              title="Reason To Believe Hub"
              icon="💡"
              cta={{ label: 'Select Framework', opensModal: true }}
              onCtaModal={handleSectionCtaModal}
            >
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Proven Frameworks: 7Ps, OKRs, SWOT Analysis</li>
                <li>• Quality Assurance: Code priorities, case studies, content libraries</li>
              </ul>
            </SectionBlock>

            <SectionBlock
              id="questions"
              title="Questions Engine"
              icon="❓"
              cta={{ label: 'Explore Questions', opensModal: true }}
              onCtaModal={handleSectionCtaModal}
            >
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Key Strategic Questions: Exploratory, Predictive, Prescriptive</li>
                <li>• Data & Analysis: CRM, ERP, regression, clustering, Power BI</li>
              </ul>
            </SectionBlock>

            <SectionBlock
              id="templates"
              title="Templates Delivered"
              icon="📄"
              cta={{ label: 'Browse Templates', opensModal: true }}
              onCtaModal={handleSectionCtaModal}
            >
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Strategic Templates: OGSM, objectives, goals, strategy</li>
                <li>• Standard Processes: Goal mapping to lifecycle stages</li>
              </ul>
            </SectionBlock>

            <SectionBlock
              id="process"
              title="Process Library"
              icon="🔄"
              cta={{ label: 'View Processes', opensModal: true }}
              onCtaModal={handleSectionCtaModal}
            >
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Standard Processes: Goal Setting & KPIs, Market Segmentation</li>
                <li>• Step-by-Step Workflows: Inputs → Step 1 → Step 2 → Outputs</li>
              </ul>
            </SectionBlock>

            <SectionBlock
              id="analytics"
              title="Analytics & Dashboards"
              icon="📈"
              cta={{ label: 'View Dashboards', opensModal: true }}
              onCtaModal={handleSectionCtaModal}
            >
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Performance Dashboards: North-Star KPI trends</li>
                <li>• KPI Tracking: Revenue Growth, EBITDA, Retention, Churn</li>
              </ul>
            </SectionBlock>

            <SectionBlock
              id="adoption"
              title="Adoption & Operating Model"
              icon="👥"
              cta={{ label: 'View Playbook', opensModal: true }}
              onCtaModal={handleSectionCtaModal}
            >
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Operating Cadence: Weekly teams, Bi-weekly divisions, Quarterly executives</li>
                <li>• Roles & Rituals: Sponsor, Owners, RACI, Control Tower</li>
              </ul>
            </SectionBlock>

            <SectionBlock
              id="training"
              title="Roles & Training"
              icon="🎓"
              cta={{ label: 'Start Training', opensModal: true }}
              onCtaModal={handleSectionCtaModal}
            >
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Role-Based Training: Sponsor, Owners, Operators</li>
                <li>• Learning Paths: Strategy Development, Data-Informed Decisions, Agile Execution</li>
              </ul>
            </SectionBlock>

            <SectionBlock
              id="integration"
              title="Implementation & Integration"
              icon="🔗"
              cta={{ label: 'See Pricing', scrollToId: 'pricing' }}
              onCtaScroll={scrollToSection}
            >
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Data Synchronization, Workflow Automation, Single Sign-On</li>
                <li>• Connected Systems: CRM, ERP, BI Tool integration</li>
              </ul>
            </SectionBlock>

            <SectionBlock
              id="pricing"
              title="Pricing & Packages"
              icon="💰"
              cta={{ label: 'Get Pricing', opensModal: true }}
              onCtaModal={(title) => {
                showComingSoon(
                  'solutions-pricing',
                  'Get Pricing & Packages',
                  'Enter your details to receive tailored pricing options.',
                  { sectionTitle: title },
                )
              }}
            >
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <p><strong className="text-slate-800 dark:text-slate-200">Plans:</strong> Starter, Professional, Enterprise.</p>
                <p><strong className="text-slate-800 dark:text-slate-200">Starter:</strong> Up to 3 teams, standard templates & KPIs, email support.</p>
                <p><strong className="text-slate-800 dark:text-slate-200">Professional:</strong> Unlimited teams, custom frameworks & KPIs, priority support.</p>
                <p><strong className="text-slate-800 dark:text-slate-200">Enterprise:</strong> Strategic account manager, ecosystem integration, tailored support.</p>
                <p><strong className="text-slate-800 dark:text-slate-200">Add‑ons:</strong> Dedicated advisor, Outcomes concierge service, workshops.</p>
              </div>
            </SectionBlock>

            <SectionBlock
              id="change-management"
              title="Change Management"
              icon="📝"
              cta={{ label: 'See Case Studies', scrollToId: 'case-studies' }}
              onCtaScroll={scrollToSection}
            >
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Change Log: Track key decisions, scope changes, and approvals.</li>
                <li>• Audit & Compliance: Capture evidence, owner, due dates, and status for each action.</li>
                <li>• Governance: Ensure every change is linked to outcomes, KPIs, and risks.</li>
              </ul>
            </SectionBlock>

            <SectionBlock
              id="case-studies"
              title="Case Studies"
              icon="📁"
              cta={{ label: 'Read Case Studies', opensModal: true }}
              onCtaModal={handleSectionCtaModal}
            >
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Success Stories: Quantified results from real businesses</li>
                <li>• Impact Assessment: Before/after metrics</li>
              </ul>
            </SectionBlock>
          </div>

          {/* Solutions summary grid + CTA */}
          <div className="bg-slate-800 dark:bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-6">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-lg font-semibold mb-4 text-left md:text-center">Solutions</h3>
              <p className="text-sm text-slate-100/90 mb-4 text-left md:text-center">
                Integrated platform to accelerate business strategy development.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-slate-900">
                {[
                  { title: 'Outcomes & KPIs', desc: 'Set goals and track success metrics.', sectionId: 'outcomes', cta: 'Get Started' },
                  { title: 'RTB Hub', desc: 'Establish your niche and differentiation.', sectionId: 'rtb', cta: 'Select' },
                  { title: 'Questions Engine', desc: 'Find answers with the right strategic questions.', sectionId: 'questions', cta: 'Learn More' },
                  { title: 'Templates Delivered', desc: 'Access ready-to-use strategic templates.', sectionId: 'templates', cta: 'Browse Templates' },
                  { title: 'Process Library', desc: 'Standardize and optimize business workflows.', sectionId: 'process', cta: 'View Processes' },
                  { title: 'Analytics & Dashboards', desc: 'Monitor performance and gain insights.', sectionId: 'analytics', cta: 'View Dashboards' },
                  { title: 'Adoption & Operating Model', desc: 'Drive platform adoption and governance.', sectionId: 'adoption', cta: 'View Playbook' },
                  { title: 'Pricing & Packages', desc: 'Flexible plans to suit your business needs.', sectionId: 'pricing', cta: 'Get Pricing', opensModal: true },
                ].map((card) => (
                  <div
                    key={card.title}
                    className="rounded-xl bg-white/95 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-semibold mb-1">{card.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{card.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (card.opensModal) {
                          showComingSoon(
                            'solutions-pricing',
                            'Get Pricing & Packages',
                            'Enter your details to receive tailored pricing options for this solution.',
                            { sectionId: card.sectionId },
                          )
                        } else {
                          scrollToSection(card.sectionId)
                        }
                      }}
                      className="mt-auto inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white transition-colors"
                    >
                      <span>{card.cta}</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center pt-2">
              <p className="text-base md:text-lg font-semibold mb-2">
                How can we support your strategy development?
              </p>
              <Link
                to="/#solutions"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

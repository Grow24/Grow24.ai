import { createFileRoute } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import SolutionsMatrix3Panel from '../components/SolutionsMatrix3Panel'
import LibraryPage from '../components/Library'
import EmailTemplateBuilder from '../components/EmailTemplateBuilder'
import { useComingSoon } from '../contexts/ComingSoonContext'
import { useTheme } from '../contexts/ThemeContext'
import { use3DRotation } from '../lib/use3DRotation'

// SVG Icons for WhatWeOffer section
const SunIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

// 3D Hero Button Component
const HeroButton3D = ({ 
  children, 
  onClick, 
  className 
}: { 
  children: React.ReactNode
  onClick: () => void
  className: string
}) => {
  const { cardRef, rotateX, rotateY, style } = use3DRotation({ 
    intensity: 5, // Subtle rotation for buttons
    perspective: 1000 
  })

  return (
    <motion.button
      ref={cardRef}
      onClick={onClick}
      style={{
        ...style,
        rotateX,
        rotateY,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.button>
  )
}

// 3D Concept Card Component
const ConceptCard3D = ({ 
  children, 
  className,
  ...motionProps 
}: { 
  children: React.ReactNode
  className: string
  initial?: any
  animate?: any
  transition?: any
}) => {
  const { cardRef, rotateX, rotateY, style } = use3DRotation({ 
    intensity: 12, // Moderate rotation for concept cards
    perspective: 1000 
  })

  return (
    <motion.div
      ref={cardRef}
      {...motionProps}
      style={{
        ...style,
        rotateX,
        rotateY,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const Route = createFileRoute('/')({  
  component: IndexPage,
})

function IndexPage() {
  const { showComingSoon } = useComingSoon()
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState<'what' | 'why' | 'how'>('what')
  const [sectionScrollLocked, setSectionScrollLocked] = useState(true)
  const [personalBgWhite, setPersonalBgWhite] = useState(false)
  const [professionalBgWhite, setProfessionalBgWhite] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showEmailTemplateBuilder, setShowEmailTemplateBuilder] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Handle hash navigation on mount and when hash changes
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash.substring(1)
      if (hash) {
        const element = document.getElementById(hash)
        if (element) {
          // Delay so page is rendered; use longer delay on mobile for layout to settle
          const delay = typeof window !== 'undefined' && window.innerWidth < 768 ? 350 : 100
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, delay)
        }
      }
    }

    // Handle initial hash
    handleHashNavigation()

    // Handle hash changes
    window.addEventListener('hashchange', handleHashNavigation)
    
    return () => {
      window.removeEventListener('hashchange', handleHashNavigation)
    }
  }, [])

  // Cleanup video when modal closes
  useEffect(() => {
    if (!showVideoModal && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [showVideoModal])

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
  }, [])
  
  return (
    <div className="min-h-screen">
      {/* Hero Section - Home */}
      <motion.section
        id="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-start sm:items-center justify-center pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-8 scroll-mt-header"
      >
        <div className="w-full max-w-7xl mx-auto text-center mt-4 sm:mt-0">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-2 sm:mb-3"
          >
            <span className="text-gradient block">
              Identify, Develop &amp; Live
            </span>
            <span className="text-gradient block">
              to your fullest
            </span>
            <span className="text-gradient block">
              Personal &amp; Professional Potential
            </span>
            <span className="text-slate-600 dark:text-slate-400 inline-flex items-center justify-center gap-2 mt-2">
              <span>with</span>
              <img
                src={theme === 'dark' ? '/grow24_ai_icon_4.jpeg' : '/grow24_ai_icon_5.jpeg'}
                alt="Grow24.ai"
                className="h-[1.875rem] sm:h-[2.25rem] md:h-[3.75rem] lg:h-[4.5rem] w-auto align-middle"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl font-bold text-amber-600 dark:text-amber-400 max-w-2xl mx-auto mb-6 sm:mb-8 px-4"
          >
            Personal &amp; Business Management Platform
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="max-w-4xl mx-auto mb-6 sm:mb-8 px-4"
          >
            <img
              src="/fde6cb34-2c95-4556-a51d-9d651e00d435.jpeg"
              alt="Personal & Business Management Platform"
              className="w-full h-auto object-contain rounded-lg shadow-md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4 text-left"
          >
            <p className="text-emerald-700 dark:text-emerald-300 font-bold text-lg sm:text-xl mb-1">
              The Individual Growth Cycle
            </p>
            <p className="text-slate-900 dark:text-white font-bold text-base sm:text-lg mb-3">
              Why is it important
            </p>
            <ul className="text-slate-700 dark:text-slate-300 text-sm sm:text-base space-y-2 list-none">
              <li className="flex gap-2">
                <span className="text-emerald-500 dark:text-emerald-400 shrink-0">–</span>
                <span>5 steps are needed to go from Identifying your Goal through to Enjoying the Benefits</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 dark:text-emerald-400 shrink-0">–</span>
                <span>We call this the Individual Growth Cycle</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 dark:text-emerald-400 shrink-0">–</span>
                <span>The same 5 Steps work in both our Personal Life &amp; Professional Life</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 dark:text-emerald-400 shrink-0">–</span>
                <span>Personal Growth Cycle &amp; Professional Growth Cycle should be done in synergy with each other</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 dark:text-emerald-400 shrink-0">–</span>
                <span>When done properly, it creates harmony within you, and your environment</span>
              </li>
            </ul>
          </motion.div>

          {/* Individual Growth Cycle steps under the hero subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="max-w-4xl mx-auto px-4 mb-8 sm:mb-10 md:mb-12"
          >
            <div className="text-center mb-4">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
                Individual Growth Cycle
              </p>
            </div>

            {/* Stacked layout with L-shaped arrow (same on all screen sizes) */}
            <div className="relative max-w-md mx-auto text-left text-sm sm:text-base pl-12 sm:pl-14">
              {/* L-shaped return arrow: starts from center of left side of step 5 block, goes left then up, then right into step 1 */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none text-teal-600 dark:text-teal-400" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                <path d="M 12 90 L 6 90" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <path d="M 6 90 L 6 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <path d="M 6 8 L 12 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <path d="M 9 5 L 12 8 L 9 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <div className="relative flex flex-col items-stretch min-w-0">
                <div id="growth-cycle-step-1" className="w-full rounded-xl bg-white/80 dark:bg-slate-900/40 border border-teal-500/40 dark:border-teal-400/50 p-4 shadow-sm">
                  <p className="text-teal-700 dark:text-teal-300 font-semibold mb-1">1. Identify Goals</p>
                  <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
                    Personal &amp; Professional Benefits that you aspire to, articulated as goals.
                  </p>
                </div>
                <div className="flex justify-center py-1" aria-hidden>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-teal-600 dark:text-teal-400 shrink-0">
                    <path d="M12 5v14M12 19l-6-6M12 19l6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="w-full rounded-xl bg-white/80 dark:bg-slate-900/40 border border-teal-500/40 dark:border-teal-400/50 p-4 shadow-sm">
                  <p className="text-teal-700 dark:text-teal-300 font-semibold mb-1">2. Craft Strategy</p>
                  <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
                    Shortlist the focus areas and approach (i.e. how to deliver the focus area with excellence).
                  </p>
                </div>
                <div className="flex justify-center py-1" aria-hidden>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-teal-600 dark:text-teal-400 shrink-0">
                    <path d="M12 5v14M12 19l-6-6M12 19l6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="w-full rounded-xl bg-white/80 dark:bg-slate-900/40 border border-teal-500/40 dark:border-teal-400/50 p-4 shadow-sm">
                  <p className="text-teal-700 dark:text-teal-300 font-semibold mb-1">3. Define Objective</p>
                  <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
                    Within the selected approach, define clear objectives and key results.
                  </p>
                </div>
                <div className="flex justify-center py-1" aria-hidden>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-teal-600 dark:text-teal-400 shrink-0">
                    <path d="M12 5v14M12 19l-6-6M12 19l6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="w-full rounded-xl bg-white/80 dark:bg-slate-900/40 border border-teal-500/40 dark:border-teal-400/50 p-4 shadow-sm">
                  <p className="text-teal-700 dark:text-teal-300 font-semibold mb-1">4. Build Plan</p>
                  <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
                    Plan for multiple time periods so you can progress step by step.
                  </p>
                </div>
                <div className="flex justify-center py-1" aria-hidden>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-teal-600 dark:text-teal-400 shrink-0">
                    <path d="M12 5v14M12 19l-6-6M12 19l6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div id="growth-cycle-step-5" className="w-full rounded-xl bg-white/80 dark:bg-slate-900/40 border border-teal-500/40 dark:border-teal-400/50 p-4 shadow-sm">
                  <p className="text-teal-700 dark:text-teal-300 font-semibold mb-1">5. Execute Plan</p>
                  <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
                    Execute the plan and assess results, feeding learning into the next cycle.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center flex-wrap px-4 mt-8 sm:mt-6 md:mt-4"
          >
            <HeroButton3D
              onClick={() => showComingSoon('start-free-trial', 'Sign up for our Free Trial', 'Please fill in all required fields to start your free trial.')}
              className="w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl bg-gradient-to-r from-cta-green-500 to-cta-green-600 text-white text-sm sm:text-base font-bold hover:shadow-xl transition-shadow duration-300"
            >
              Sign up for our Free Trial
            </HeroButton3D>
            <HeroButton3D
              onClick={() => setShowVideoModal(true)}
              className="w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl border-2 border-info-gold-500 text-info-gold-600 bg-info-gold-50 dark:bg-info-gold-900/20 text-sm sm:text-base font-bold hover:bg-info-gold-100 dark:hover:bg-info-gold-900/30 transition-colors duration-300"
            >
              Watch Concept
            </HeroButton3D>
          </motion.div>
        </div>
      </motion.section>

      {/* The Concept Section */}
      <motion.section
        id="concept"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="min-h-screen py-12 sm:py-16 md:py-20 px-4 pb-20 sm:pb-24 overflow-visible"
      >
        <div className="max-w-7xl mx-auto min-w-0 overflow-visible">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Solutions to Plan & Manage both your Personal and Professional Life
            </h1>
            
            {/* See Detailed Concept Button */}
            <motion.button
              onClick={() => setShowVideoModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6 bg-info-gold-50 dark:bg-info-gold-900/20 hover:bg-info-gold-100 dark:hover:bg-info-gold-900/30 text-info-gold-700 dark:text-info-gold-300 font-medium rounded-full transition-all duration-300 border-2 border-info-gold-500 dark:border-info-gold-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              See Detailed Concept
            </motion.button>

            <div
              className={`flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 ${sectionScrollLocked ? 'sticky top-0 z-20 py-3 -mx-2 px-2 rounded-xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-slate-700/50' : ''}`}
            >
              <button
                onClick={() => setActiveTab('what')}
                className={`px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'what'
                    ? 'bg-info-gold-500 text-white shadow-lg shadow-info-gold-900/30'
                    : 'bg-info-gold-50 dark:bg-info-gold-900/20 text-info-gold-700 dark:text-info-gold-300 hover:bg-info-gold-100 dark:hover:bg-info-gold-900/30 border-2 border-info-gold-500 dark:border-info-gold-600'
                }`}
              >
                What
              </button>
              <button
                onClick={() => setActiveTab('why')}
                className={`px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'why'
                    ? 'bg-info-gold-500 text-white shadow-lg shadow-info-gold-900/30'
                    : 'bg-info-gold-50 dark:bg-info-gold-900/20 text-info-gold-700 dark:text-info-gold-300 hover:bg-info-gold-100 dark:hover:bg-info-gold-900/30 border-2 border-info-gold-500 dark:border-info-gold-600'
                }`}
              >
                Why
              </button>
              <button
                onClick={() => setActiveTab('how')}
                className={`px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'how'
                    ? 'bg-info-gold-500 text-white shadow-lg shadow-info-gold-900/30'
                    : 'bg-info-gold-50 dark:bg-info-gold-900/20 text-info-gold-700 dark:text-info-gold-300 hover:bg-info-gold-100 dark:hover:bg-info-gold-900/30 border-2 border-info-gold-500 dark:border-info-gold-600'
                }`}
              >
                How
              </button>
              <button
                type="button"
                onClick={() => setSectionScrollLocked((prev) => !prev)}
                className="p-2 rounded-full bg-info-gold-50 dark:bg-info-gold-900/20 text-info-gold-700 dark:text-info-gold-300 hover:bg-info-gold-100 dark:hover:bg-info-gold-900/30 border-2 border-info-gold-500 dark:border-info-gold-600 transition-colors"
                aria-label={sectionScrollLocked ? 'Unlock scroll (tabs will scroll with page)' : 'Lock scroll (tabs will stick when in view)'}
                title={sectionScrollLocked ? 'Unlock scroll' : 'Lock scroll'}
              >
                <span className="text-base leading-none" aria-hidden="true">
                  {sectionScrollLocked ? '🔐' : '🔓'}
                </span>
              </button>
            </div>
          </motion.div>

          {/* Content based on active tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'what' ? (
              <motion.div
                key="what"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="about-html max-w-4xl mx-auto"
              >
                <img
                  src="/what_tab.jpg"
                  alt="A digital platform to manage your interconnected Personal & Professional life—PBMP overview"
                  className="w-full rounded-xl mb-8 sm:mb-10"
                />
                <div className="section-inner">
                  <div className="kicker">What</div>

                  <h1 className="headline">
                    A digital platform which helps you manage all stages of your inter-connected Personal &amp; Professional Life
                  </h1>

                  <p className="subhead">
                    Provides you the confidence to define &amp; secure <span className="value-highlight">Value</span> by going through the <span className="value-highlight">Value Cycle</span>
                  </p>

                  <p className="subhead">
                    The (<span className="value-highlight">Personal, Professional</span>) <span className="value-highlight">Value Cycle</span> is :
                  </p>

                  <p className="subhead" style={{ fontWeight: 700 }}>
                    Goal Identification → Strategy Crafting → Objectives Definition → Plan Construction &amp; Execution
                  </p>

                  <ol className="subhead" style={{ listStylePosition: 'outside', paddingLeft: '1.5em', marginTop: 8 }}>
                    <li style={{ marginBottom: '0.5em' }}>Based on tried &amp; tested industry standard Knowledge (e.g BABOK for Business Analysis, PMBOK for Project Mgmt)</li>
                    <li style={{ marginBottom: '0.5em' }}>Complete ToolSet (Tools, Techniques, Templates, Case Studies, Trainings) for you to stay engaged for years</li>
                    <li style={{ marginBottom: '0.5em' }}>Has Marketplace through which accredited Solution Providers can plug into specific parts of the (Personal, Professional) Value Cycle</li>
                    <li style={{ marginBottom: '0.5em' }}>Highly Secure - run in offline mode, data transfers in encrypted manner</li>
                    <li style={{ marginBottom: '0.5em' }}>Interact with the platform through the Channel of your choosing</li>
                    <li style={{ marginBottom: '0.5em' }}>High User Engagement experience - Built using modern User Engagement principles</li>
                    <li style={{ marginBottom: '0.5em' }}>Built to live in an inter-connected ecosystem of Products &amp; Solutions</li>
                    <li style={{ marginBottom: '0.5em' }}>Built for Change - using modern, flexible architecture</li>
                  </ol>

                  <div className="section-cta">
                    <div className="tagline">
                      One platform. Full spread + AI-enabled depth. Built for years of growth.
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('why')}
                      className="btn primary"
                    >
                      <span className="dot" aria-hidden="true" />
                      See Why
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : activeTab === 'why' ? (
              <motion.div
                key="why"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="about-html max-w-4xl mx-auto"
              >
                <img
                  src="/why_tab.jpg"
                  alt="Why PBMP—Personal and Professional life, one platform"
                  className="w-full rounded-xl mb-8 sm:mb-10"
                />
                <div className="section-inner">
                  <div className="kicker">Why</div>

                  <h2 className="headline">
                    Like 2 sides of a coin, each of us have a Personal Life &amp; a Professional Life
                    <br />
                    Hence, a Platform that we rely on for Identifying &amp; Executing Decision, should reflect that
                  </h2>
                  <p className="subhead">
                    Personal and professional growth are inextricably linked. People want a single platform with the{' '}
                    <strong>spread</strong> (Vision → Mission → Goals → Strategy → Plan → Execute → Operate) and the{' '}
                    <strong>depth</strong> (AI-enabled guidance and analytics) to manage both—over years of life and
                    work.
                  </p>

                  <p className="subhead" style={{ fontWeight: 700, marginTop: 12 }}>
                    However, the current Solutions are unable to meet that need
                  </p>
                  <p className="subhead" style={{ marginTop: 4 }}>
                    The following 3 major issues exist in the Solution Landscape
                  </p>

                  <div className="grid3" role="list">
                    <div className="card" role="listitem">
                      <div className="num">01</div>
                      <h3>Separate platforms</h3>
                      <p>
                        Different platforms for Personal Management vs Professional/Business Management—forcing context
                        switching for problems that span both.
                      </p>
                    </div>

                    <div className="card" role="listitem">
                      <div className="num">02</div>
                      <h3>Fragmentation within each</h3>
                      <p>
                        Different tools for <strong>Goals</strong>, <strong>Strategy</strong>, <strong>Planning</strong>
                        , <strong>Execution</strong>, <strong>Tracking</strong>, and{' '}
                        <strong>Learning/Personal Growth</strong>.
                      </p>
                    </div>

                    <div className="card" role="listitem">
                      <div className="num">03</div>
                      <h3>Inconsistent granularity + limited transparency</h3>
                      <p>
                        Tools vary in depth and rarely reveal the body of knowledge behind their workflows. We provide
                        full transparency on how our solutions are developed.
                      </p>
                    </div>
                  </div>

                  <div className="section-cta">
                    <div className="tagline">
                      grow<sup>24</sup> connects the journey end-to-end—without losing context.
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('how')}
                      className="btn primary"
                    >
                      <span className="dot" aria-hidden="true" />
                      Who it serves
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="how"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8 md:space-y-10 min-w-0 w-full overflow-visible"
              >
                <div className="max-w-4xl mx-auto">
                  <img
                    src="/how_tab.jpg"
                    alt="How PBMP—Solutions cover Personal & Professional needs"
                    className="w-full rounded-xl mb-8 sm:mb-10"
                  />
                </div>
                {/* Solutions cover Personal & Professional Needs - Core & Support (from image) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                  className="about-html max-w-4xl mx-auto min-w-0 w-full overflow-visible"
                >
                  <div className="section-inner min-w-0 overflow-visible">
                    <div className="kicker">How</div>

                    <h2 className="headline">Solutions cover various Personal &amp; Professional Needs</h2>
                    <p className="subhead">
                      Core Solutions &amp; Support Solutions that span the <span className="value-highlight">Growth Cycle</span>.
                    </p>

                    <div className="mt-6 how-tab-table-wrap w-full min-w-0 overflow-x-auto overflow-y-visible rounded-xl border border-gray-200 dark:border-slate-600">
                      <table className="w-full min-w-[500px] border-collapse text-left text-sm sm:text-base">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-slate-600">
                            <th className="bg-gray-50 dark:bg-slate-700/50 px-4 py-3 text-base font-bold text-indigo-700 dark:text-indigo-400 w-1/2">
                              Core Solutions
                            </th>
                            <th className="bg-gray-50 dark:bg-slate-700/50 px-4 py-3 text-base font-bold text-indigo-700 dark:text-indigo-400 w-1/2 border-l border-gray-200 dark:border-slate-600">
                              Support Solutions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white/50 dark:bg-slate-800/30">
                          <tr className="border-b border-gray-200 dark:border-slate-600">
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 align-top">
                              Directly impact Company financials.
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 align-top border-l border-gray-200 dark:border-slate-600">
                              Drive effectiveness &amp; efficiency.
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-slate-600">
                            <td className="px-4 py-3 align-top">
                              <p className="font-semibold text-indigo-700 dark:text-indigo-400 text-sm mb-1">Functional Solutions</p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">E.g. Marketing Goals, Marketing Strategy, Marketing Objectives, Marketing Plan, Marketing Projects, Marketing Operation; Sales Goals, Sales Strategy, Sales Plan, Sales Operation.</p>
                            </td>
                            <td className="px-4 py-3 align-top border-l border-gray-200 dark:border-slate-600">
                              <p className="font-semibold text-indigo-700 dark:text-indigo-400 text-sm mb-1">Structure</p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">E.g. Organization Structure.</p>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-slate-600">
                            <td className="px-4 py-3 align-top">
                              <p className="font-semibold text-indigo-700 dark:text-indigo-400 text-sm mb-1">Program Solutions</p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">E.g. ESG, Business Transformation.</p>
                            </td>
                            <td className="px-4 py-3 align-top border-l border-gray-200 dark:border-slate-600">
                              <p className="font-semibold text-indigo-700 dark:text-indigo-400 text-sm mb-1">System</p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm mb-0.5"><strong>Collaboration</strong> — E.g. Office</p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm mb-0.5"><strong>Trigger &amp; Notification</strong> — E.g. Event Manager</p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm"><strong>Build Solutions</strong> — E.g. Solution Manager</p>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 align-top">&nbsp;</td>
                            <td className="px-4 py-3 align-top border-l border-gray-200 dark:border-slate-600">
                              <p className="font-semibold text-indigo-700 dark:text-indigo-400 text-sm mb-1">Processes</p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">E.g. Process Manager, Analysis Manager.</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>

                {/* Solutions conform to Grow24 Value Framework - Constituents (from image) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.08 }}
                  className="about-html max-w-4xl mx-auto"
                >
                  <div className="section-inner">
                    <h2 className="headline">
                      Solutions conform to <span className="value-highlight">grow<sup>24</sup></span> Value Framework
                    </h2>
                    <p className="subhead">
                      Constituents of the <span className="value-highlight">grow</span> Value Framework.
                    </p>
                    <p className="subhead" style={{ marginTop: 4 }}>
                      Body of Knowledge, Tools, Templates, Techniques, Competencies Trainings, Case Studies applied to
                    </p>

                    <div className="mt-6 how-tab-table-wrap w-full min-w-0 overflow-x-auto overflow-y-visible rounded-xl border border-gray-200 dark:border-slate-600">
                      <table className="w-full min-w-[500px] border-collapse text-left text-sm sm:text-base">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-slate-600">
                            <th className="bg-gray-50 dark:bg-slate-700/50 px-4 py-3 text-base font-bold text-indigo-700 dark:text-indigo-400 w-1/2">
                              Core Solutions
                            </th>
                            <th className="bg-gray-50 dark:bg-slate-700/50 px-4 py-3 text-base font-bold text-indigo-700 dark:text-indigo-400 w-1/2 border-l border-gray-200 dark:border-slate-600">
                              Support Solutions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white/50 dark:bg-slate-800/30">
                          <tr className="border-b border-gray-200 dark:border-slate-600">
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 align-top">
                              Directly impact Company financials.
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 align-top border-l border-gray-200 dark:border-slate-600">
                              Drive effectiveness &amp; efficiency.
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-slate-600">
                            <td className="px-4 py-3 align-top border-l-0">
                              <p className="font-semibold text-indigo-700 dark:text-indigo-400 text-sm mb-1">Functional Solutions</p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">Corporate, Marketing, Sales, HR.</p>
                            </td>
                            <td className="px-4 py-3 align-top border-l border-gray-200 dark:border-slate-600">
                              <p className="font-semibold text-indigo-700 dark:text-indigo-400 text-sm mb-1">Structure</p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">E.g. Organization Structure.</p>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 dark:border-slate-600">
                            <td className="px-4 py-3 align-top">
                              <p className="font-semibold text-indigo-700 dark:text-indigo-400 text-sm mb-1">Program Solutions</p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">Environmental, Social &amp; Governance; Business Transformation.</p>
                            </td>
                            <td className="px-4 py-3 align-top border-l border-gray-200 dark:border-slate-600">
                              <p className="font-semibold text-indigo-700 dark:text-indigo-400 text-sm mb-1">System</p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm mb-0.5">Collaboration — Office</p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm mb-0.5">Trigger &amp; Notification — Event Manager</p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">Build &amp; Deploy Solutions — Solution Manager</p>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 align-top">&nbsp;</td>
                            <td className="px-4 py-3 align-top border-l border-gray-200 dark:border-slate-600">
                              <p className="font-semibold text-indigo-700 dark:text-indigo-400 text-sm mb-1">Processes</p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">Process Manager — Build &amp; Manage Processes</p>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">Analysis Manager — using BABOK.</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>

                {/* Map of Solutions + Solution Approaches - matches What/Why design */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="about-html max-w-4xl mx-auto"
                >
                  <div className="section-inner">
                    <div className="kicker">How</div>

                    <h2 className="headline">Map of Solutions</h2>
                    <p className="subhead">
                      Conform to the <span className="value-highlight">grow<sup>24</sup></span> Decision Framework.
                    </p>

                    <ol className="subhead" style={{ listStylePosition: 'outside', paddingLeft: '1.5em', marginTop: 8 }}>
                      <li style={{ marginBottom: '0.5em' }}>Unified Data and MetaData layer</li>
                      <li style={{ marginBottom: '0.5em' }}>Tried and tested industry-standard <span className="value-highlight">Functional</span> Body Of Knowledge embedded (e.g. Sales, Marketing, HR)</li>
                      <li style={{ marginBottom: '0.5em' }}>Tried &amp; tested <span className="value-highlight">Supporting</span> industry-standard Body of Knowledge (e.g BABOK for Business Analysis, PMBOK for Project Mgmt, PrMBOK for Portfolio Mgmt)</li>
                      <li style={{ marginBottom: '0.5em' }}>Tried &amp; tested <span className="value-highlight">Enabling</span> solutions (e.g Collaboration through Office, Email, Whatsapp etc; Notifications through Email, Whatsapp etc)</li>
                      <li style={{ marginBottom: '0.5em' }}>Engage through our <span className="value-highlight">ChatBot</span> (through desktop, laptop, Whatsapp)</li>
                      <li style={{ marginBottom: '0.5em' }}>Growing set of Solutions for you to stay engaged, both on Personal &amp; Professional front, for years</li>
                    </ol>

                    <p className="subhead" style={{ fontWeight: 700, marginTop: 18, marginBottom: 4 }}>
                      Solution approaches
                    </p>
                    <div className="grid3" role="list">
                      <div className="card" role="listitem">
                        <div className="num">01</div>
                        <h3>Use Our Solutions</h3>
                        <p>
                          Corporate Goal, Corporate Strategy, Marketing Goal, Marketing Strategy.
                        </p>
                      </div>
                      <div className="card" role="listitem">
                        <div className="num">02</div>
                        <h3>Use Our Partners&apos; Solutions</h3>
                        <p>
                          Leverage solutions from our accredited partners within the ecosystem.
                        </p>
                      </div>
                      <div className="card" role="listitem">
                        <div className="num">03</div>
                        <h3>Build your Own Solutions</h3>
                        <p>
                          Extend and customize with your own solutions on the platform.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Grow24 Value Framework - Application of the Framework (11 steps) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.12 }}
                  className="about-html max-w-4xl mx-auto"
                >
                  <div className="section-inner">
                    <h2 className="headline">
                      Solutions conform to <span className="value-highlight">grow<sup>24</sup></span> Value Framework
                    </h2>
                    <p className="subhead" style={{ fontWeight: 600, marginTop: 4 }}>
                      Application of the Framework
                    </p>

                    <div className="mt-6">
                      {/* L-shaped arrow: same design as Individual Growth Cycle — starts at left of 1. Intent, goes left, down, right into left side of 7. Deploy */}
                      <div className="relative max-w-md mx-auto text-left text-sm sm:text-base pl-12 sm:pl-14">
                        <svg className="absolute inset-0 w-full h-full pointer-events-none text-teal-600 dark:text-teal-400" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                          {/* From center of left side of Intent (1): horizontal segment left to vertical stem */}
                          <path d="M 12 4 L 6 4" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" fill="none" />
                          {/* Vertical segment: down to level of Deploy (7) block */}
                          <path d="M 6 4 L 6 60" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" fill="none" />
                          {/* Horizontal: from stem into left side of Deploy block */}
                          <path d="M 6 60 L 12 60" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" fill="none" />
                          {/* Arrowhead at Deploy (destination), tip at left edge of block */}
                          <path d="M 9.5 58.5 L 12 60 L 9.5 61.5" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                        <div className="relative flex flex-col min-w-0">
                          {[
                            { num: 1, title: 'Intent', desc: 'Capture what the user wants to achieve and define success criteria. If the solution already exists, route directly down to Use (bypass build lifecycle).' },
                            { num: 2, title: 'Business Case', desc: 'Articulate value: baseline, benefits, costs, risks, KPIs/targets, and time horizon.' },
                            { num: 3, title: 'Requirements', desc: 'Collect detailed requirements, including acceptance criteria and non-functional requirements tied to business KPIs.' },
                            { num: 4, title: 'Plan', desc: 'Prepare the project plan: milestones, owners, budget, dependencies, rollout, and benefit-realization plan.' },
                            { num: 5, title: 'Architect', desc: 'Design the solution: architecture, data flows, integrations, security/privacy, and measurement/telemetry approach.' },
                            { num: 6, title: 'Build', desc: 'Construct and test the solution; ensure quality gates and observability are in place.' },
                            { num: 7, title: 'Deploy', desc: 'Release to users/environments; monitor initial usage; be ready to rollback quickly if issues arise.' },
                            { num: 8, title: 'Use', desc: 'Ensure correct adoption and usage as intended—this is where value starts getting generated.' },
                            { num: 9, title: 'Insight', desc: 'Convert observations into evidence-backed conclusions (trends, anomalies, opportunities) linked to KPIs.' },
                            { num: 10, title: 'Action', desc: 'Generate and track action items driven by insights (owners, due dates, expected KPI impact).' },
                            { num: 11, title: 'Result', desc: 'Measure outcomes versus Business Case targets; capture learnings and decide scale, refine, or retire.' },
                          ].map((step, i) => (
                            <div key={step.num} className="flex flex-col">
                              <div className="w-full rounded-2xl bg-teal-50/80 dark:bg-teal-900/20 border-2 border-teal-500/50 dark:border-teal-400/40 p-4 shadow-md">
                                <p className="text-teal-700 dark:text-teal-300 font-semibold mb-1">{step.num}. {step.title}</p>
                                <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm">{step.desc}</p>
                              </div>
                              {i < 10 && (
                                <div className="flex justify-center py-1.5" aria-hidden>
                                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-teal-600 dark:text-teal-400 shrink-0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14M12 19l-6-6M12 19l6-6" stroke="currentColor" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Decision Science Framework Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="glass backdrop-blur-xl bg-white/10 dark:bg-slate-800/50 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-5xl mx-auto border border-white/20 dark:border-slate-700/50"
                >
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                    Decision Science Framework
                  </h3>
                  <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 md:mb-8 px-2">
                    Direction of value: From raw data to applied wisdom
                  </p>
                  
                  <div className="relative flex flex-col md:flex-row gap-4 md:gap-6">
                    {/* Arrow on the left - Hide on mobile, show on desktop */}
                    <div className="hidden md:flex flex-shrink-0 flex-col items-center relative" style={{ width: '120px' }}>
                      {/* Direction of Value Label above arrow */}
                      <div className="mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Direction of value
                        </span>
                      </div>
                      
                      {/* Thick Black Arrow Line */}
                      <div className="relative flex-1 flex items-center justify-center" style={{ minHeight: '400px' }}>
                        <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-2 bg-black dark:bg-white"></div>
                        
                        {/* Simple Black Arrow Head at Top */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                          <svg className="w-6 h-6 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 12h6v8h8v-8h6L12 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Table Container - Make scrollable on mobile */}
                    <div className="flex-1 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse min-w-[600px]">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-slate-700/50">
                              <th className="border-b-2 border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 sm:py-3 text-left font-bold text-amber-700 dark:text-amber-400 text-xs sm:text-sm" style={{ width: '25%' }}>
                                WiKID Layer
                              </th>
                              <th className="border-b-2 border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 sm:py-3 text-left font-bold text-amber-700 dark:text-amber-400 text-xs sm:text-sm">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Wisdom Row */}
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
                                <span className="font-bold text-gray-900 dark:text-white text-sm">Wisdom</span>
                              </td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4 align-top text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                                We start with <strong>Wisdom</strong> because it is <strong>Knowledge applied over time</strong>—the accumulated learnings from past decisions, outcomes, and calibrations. It tells us <strong>what's working, what's not, why</strong>, and guides <strong>better choices going forward</strong> (e.g., which goals are realistic, which strategies succeed, which execution patterns fail).
                              </td>
                            </tr>
                            
                            {/* Knowledge Row */}
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
                                <span className="font-bold text-gray-900 dark:text-white text-sm">Knowledge</span>
                              </td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4 align-top text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                                <strong>Knowledge</strong> is the foundation for creating Wisdom. It includes <strong>best practices, tools, techniques, frameworks, templates, skills, and competencies</strong>, coming from: (i) standard <strong>Bodies of Knowledge</strong> (e.g., PMBOK, BABOK, etc.), and (ii) <strong>organization-embedded knowledge</strong>—patterns learned through experience, case histories, playbooks, and domain expertise built while operating in that area.
                              </td>
                            </tr>
                            
                            {/* Information Row */}
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
                                <span className="font-bold text-gray-900 dark:text-white text-sm">Information</span>
                              </td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4 align-top text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                                <strong>Information</strong> is sanitized, structured, and consumable data (cleaned, standardized, contextualized) that can be reliably used to form <strong>insights, comparisons, and learning</strong>—so it becomes input for building Knowledge (e.g., curated KPI definitions, validated reports, standardized dashboards).
                              </td>
                            </tr>
                            
                            {/* Data Row */}
                            <tr>
                              <td className="px-3 sm:px-4 py-3 sm:py-4 align-top">
                                <span className="font-bold text-gray-900 dark:text-white text-sm">Data</span>
                              </td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4 align-top text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                                <strong>Data</strong> is the raw signals collected from systems, markets, and people (transactions, logs, events, surveys, metrics, observations). It is unprocessed and noisy on its own, but it should ultimately be transformed into <strong>Information → Knowledge → Wisdom</strong>.
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Solutions Section */}
      <motion.section
        id="solutions"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="min-h-screen py-20 px-8"
      >
        <SolutionsMatrix3Panel />
      </motion.section>

      {/* Library Section - use initial opacity 1 so content is always visible on mobile when navigating via #library */}
      <motion.section
        id="library"
        initial={{ opacity: 1 }}
        className="min-h-screen"
      >
        <LibraryPage />
      </motion.section>

      {/* Contact Us Section - Email template builder */}
      <motion.section
        id="contact"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 px-4 sm:px-6 md:px-8 bg-slate-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-800 scroll-mt-header"
      >
        <div className="w-full max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            Contact Us
          </h2>
          <p className="text-lg mb-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create and send rich emails with subject, HTML body, attachments, audio, video, and buttons—all from here.
          </p>
          <motion.button
            onClick={() => setShowEmailTemplateBuilder(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Create email template
          </motion.button>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="py-20 px-8 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800"
      >
        <div className="w-full max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
            Ready to Transform?
          </h2>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-400">
            Join thousands of professionals and entrepreneurs using Grow24.ai to achieve their goals.
          </p>
          <motion.button
            onClick={() => showComingSoon('cta-section', 'Get Started', 'Enter your email to stay updated on our latest features and product updates.')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-lg bg-cta-green-500 hover:bg-cta-green-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            Get Started Now
          </motion.button>
        </div>
      </motion.section>

      {/* Video Modal - at root so it overlays the full viewport when open */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.pause()
                videoRef.current.currentTime = 0
              }
              setShowVideoModal(false)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.pause()
                    videoRef.current.currentTime = 0
                  }
                  setShowVideoModal(false)
                }}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="relative aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  controls
                  src="/WhatsApp Video 2026-02-17 at 3.25.00 PM.mp4"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <EmailTemplateBuilder isOpen={showEmailTemplateBuilder} onClose={() => setShowEmailTemplateBuilder(false)} />
    </div>
  )
}

export default IndexPage

import { createFileRoute } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import SolutionsMatrix3Panel from '../components/SolutionsMatrix3Panel'
import LibraryPage from '../components/Library'
import { useComingSoon } from '../contexts/ComingSoonContext'
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
  const [activeTab, setActiveTab] = useState<'what' | 'why' | 'how'>('what')
  const [personalBgWhite, setPersonalBgWhite] = useState(false)
  const [professionalBgWhite, setProfessionalBgWhite] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
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

  // Cleanup video when modal closes or component unmounts
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
        className="min-h-screen flex items-start sm:items-center justify-center pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-8"
      >
        <div className="w-full max-w-7xl mx-auto text-center mt-4 sm:mt-0">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6"
          >
            <span className="text-gradient">
              Grow Your Potential
            </span>
            <br />
            <span className="text-slate-600 dark:text-slate-400">with Grow24.ai</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4"
          >
            Secure personal & professional growth by going through multiple iterations of the Value Cycle.
          </motion.p>

          {/* Value Cycle steps under the hero subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="max-w-4xl mx-auto px-4 mb-8 sm:mb-10 md:mb-12"
          >
            <div className="text-center mb-4">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                Value cycle (You)
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 text-left text-sm sm:text-base">
              <div className="rounded-xl bg-white/80 dark:bg-slate-900/40 border border-emerald-500/40 dark:border-emerald-400/50 p-4 shadow-sm">
                <p className="text-emerald-700 dark:text-emerald-300 font-semibold mb-1">
                  1. Identify Goals
                </p>
                <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
                  Personal &amp; Professional Benefits that you aspire to, articulated as goals.
                </p>
              </div>
              <div className="rounded-xl bg-white/80 dark:bg-slate-900/40 border border-emerald-500/40 dark:border-emerald-400/50 p-4 shadow-sm">
                <p className="text-emerald-700 dark:text-emerald-300 font-semibold mb-1">
                  2. Craft Strategy
                </p>
                <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
                  Shortlist the focus areas and approach (i.e. how to deliver the focus area with excellence).
                </p>
              </div>
              <div className="rounded-xl bg-white/80 dark:bg-slate-900/40 border border-emerald-500/40 dark:border-emerald-400/50 p-4 shadow-sm">
                <p className="text-emerald-700 dark:text-emerald-300 font-semibold mb-1">
                  3. Define Objective
                </p>
                <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
                  Within the selected approach, define clear objectives and key results.
                </p>
              </div>
              <div className="rounded-xl bg-white/80 dark:bg-slate-900/40 border border-teal-500/40 dark:border-teal-400/50 p-4 shadow-sm">
                <p className="text-teal-700 dark:text-teal-300 font-semibold mb-1">
                  4. Build Plan
                </p>
                <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
                  Plan for multiple time periods so you can progress step by step.
                </p>
              </div>
              <div className="rounded-xl bg-white/80 dark:bg-slate-900/40 border border-teal-500/40 dark:border-teal-400/50 p-4 shadow-sm sm:col-span-2 lg:col-span-1">
                <p className="text-teal-700 dark:text-teal-300 font-semibold mb-1">
                  5. Execute Plan
                </p>
                <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
                  Execute the plan and assess results, feeding learning into the next cycle.
                </p>
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
              onClick={() => showComingSoon('watch-concept', 'Watch Concept', 'Watch our concept video to understand how Grow24.ai can transform your growth journey.')}
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
        className="min-h-screen py-12 sm:py-16 md:py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
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

            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
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
              >
                {/* Diagrams Container */}
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-10 md:mb-12">
                  {/* Personal Side */}
                  <ConceptCard3D
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`rounded-2xl shadow-xl p-8 border transition-all duration-300 ${
                      personalBgWhite
                        ? 'bg-white dark:bg-white border-gray-300 dark:border-gray-300'
                        : 'glass backdrop-blur-xl bg-white/10 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`text-2xl font-bold mb-2 ${
                        personalBgWhite
                          ? 'text-gray-900'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        Individual (Personal side)
                      </h2>
                      <button
                        onClick={() => setPersonalBgWhite(!personalBgWhite)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          personalBgWhite
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            : 'bg-white/20 dark:bg-slate-700/50 hover:bg-white/30 dark:hover:bg-slate-600/50 text-white border border-white/30 dark:border-slate-600'
                        }`}
                        title={personalBgWhite ? 'Switch to dark background' : 'Switch to white background'}
                      >
                        {personalBgWhite ? <MoonIcon /> : <SunIcon />}
                      </button>
                    </div>
                    <div className="flex justify-center items-center">
                      <img
                        src="/PerSide.png"
                        alt="Personal Side - PBMP Cycle"
                        className="w-full h-auto max-w-md"
                      />
                    </div>
                  </ConceptCard3D>

                  {/* Professional Side */}
                  <ConceptCard3D
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className={`rounded-2xl shadow-xl p-8 border transition-all duration-300 ${
                      professionalBgWhite
                        ? 'bg-white dark:bg-white border-gray-300 dark:border-gray-300'
                        : 'glass backdrop-blur-xl bg-white/10 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`text-2xl font-bold mb-2 ${
                        professionalBgWhite
                          ? 'text-gray-900'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        Individual (Professional side)
                      </h2>
                      <button
                        onClick={() => setProfessionalBgWhite(!professionalBgWhite)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          professionalBgWhite
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            : 'bg-white/20 dark:bg-slate-700/50 hover:bg-white/30 dark:hover:bg-slate-600/50 text-white border border-white/30 dark:border-slate-600'
                        }`}
                        title={professionalBgWhite ? 'Switch to dark background' : 'Switch to white background'}
                      >
                        {professionalBgWhite ? <MoonIcon /> : <SunIcon />}
                      </button>
                    </div>
                    <div className="flex justify-center items-center">
                      <img
                        src="/ProSide.png"
                        alt="Professional Side - PBMP Cycle"
                        className="w-full h-auto max-w-md"
                      />
                    </div>
                  </ConceptCard3D>
                </div>
              </motion.div>
            ) : activeTab === 'why' ? (
              <motion.div
                key="why"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Why Section Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="glass backdrop-blur-xl bg-white/10 dark:bg-slate-800/50 rounded-2xl shadow-xl p-8 max-w-5xl mx-auto border border-white/20 dark:border-slate-700/50"
                >
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Why This Approach?
                  </h3>
                  
                  <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        🎯 Holistic Integration
                      </h4>
                      <p className="text-sm leading-relaxed">
                        Most tools focus on either personal OR professional management, creating silos. Our PBMP (Plan-Build-Measure-Progress) cycle integrates both dimensions, recognizing that your personal goals and professional objectives are interconnected and influence each other.
                      </p>
                    </div>

                    <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        🔄 Continuous Improvement Loop
                      </h4>
                      <p className="text-sm leading-relaxed">
                        The PBMP cycle isn't linear—it's iterative. Each cycle informs the next, building wisdom from data through measurable progress. This approach ensures you're not just setting goals, but systematically achieving them and learning from every outcome.
                      </p>
                    </div>

                    <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        📊 Data-Driven Decision Making
                      </h4>
                      <p className="text-sm leading-relaxed">
                        By transforming raw data into information, knowledge, and ultimately wisdom (WiKID framework), you make informed decisions based on evidence rather than intuition alone. This scientific approach increases success rates and reduces wasted effort.
                      </p>
                    </div>

                    <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        🚀 Scalable & Adaptable
                      </h4>
                      <p className="text-sm leading-relaxed">
                        Whether you're an individual managing personal goals or an organization coordinating teams, the same fundamental principles apply. The framework scales from personal productivity to enterprise strategy, maintaining consistency while adapting to complexity.
                      </p>
                    </div>

                    <div className="bg-white/50 dark:bg-slate-700/50 rounded-xl p-6">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        ⚡ Actionable Frameworks
                      </h4>
                      <p className="text-sm leading-relaxed">
                        We don't just provide theory—we offer proven frameworks, templates, and best practices from established bodies of knowledge (PMBOK, BABOK, etc.) combined with real-world organizational learning. This gives you ready-to-use tools that have been validated through practice.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="how"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
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

        {/* Video Modal */}
        <AnimatePresence>
          {showVideoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
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
                {/* Close Button */}
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

                {/* Video Player */}
                <div className="relative aspect-video">
                  <video
                    ref={videoRef}
                    className="w-full h-full"
                    controls
                    src="/WhatsApp Video 2026-02-05 at 12.42.46 PM.mp4"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
    </div>
  )
}

export default IndexPage

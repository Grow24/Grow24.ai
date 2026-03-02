import { createFileRoute } from '@tanstack/react-router'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import SolutionsMatrix3Panel from '../components/SolutionsMatrix3Panel'
import LibraryPage from '../components/Library'
import EmailTemplateBuilder from '../components/EmailTemplateBuilder'
import { useComingSoon } from '../contexts/ComingSoonContext'
import { useTheme } from '../contexts/ThemeContext'
import { use3DRotation } from '../lib/use3DRotation'
import HeroCarousel from '../components/HeroCarousel'

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

function ConceptTabButtons({
  activeTab,
  setActiveTab,
  sectionScrollLocked,
  setSectionScrollLocked,
  scrollToSection,
}: {
  activeTab: 'what' | 'why' | 'how'
  setActiveTab: (t: 'what' | 'why' | 'how') => void
  sectionScrollLocked: boolean
  setSectionScrollLocked: (v: boolean | ((prev: boolean) => boolean)) => void
  scrollToSection?: (tab: 'what' | 'why' | 'how') => void
}) {
  const onTabClick = (tab: 'what' | 'why' | 'how') => {
    if (scrollToSection) scrollToSection(tab)
    else setActiveTab(tab)
  }
  return (
    <>
      <button
        onClick={() => onTabClick('what')}
        className={`px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
          activeTab === 'what'
            ? 'bg-info-gold-500 text-white shadow-lg shadow-info-gold-900/30'
            : 'bg-info-gold-50 dark:bg-info-gold-900/20 text-info-gold-700 dark:text-info-gold-300 hover:bg-info-gold-100 dark:hover:bg-info-gold-900/30 border-2 border-info-gold-500 dark:border-info-gold-600'
        }`}
      >
        What
      </button>
      <button
        onClick={() => onTabClick('why')}
        className={`px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
          activeTab === 'why'
            ? 'bg-info-gold-500 text-white shadow-lg shadow-info-gold-900/30'
            : 'bg-info-gold-50 dark:bg-info-gold-900/20 text-info-gold-700 dark:text-info-gold-300 hover:bg-info-gold-100 dark:hover:bg-info-gold-900/30 border-2 border-info-gold-500 dark:border-info-gold-600'
        }`}
      >
        Why
      </button>
      <button
        onClick={() => onTabClick('how')}
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
        aria-label={sectionScrollLocked ? 'Unlock scroll (tabs will stay fixed while you scroll)' : 'Lock scroll (tabs will scroll with page)'}
        title={sectionScrollLocked ? 'Unlock scroll' : 'Lock scroll'}
      >
        <span className="text-base leading-none" aria-hidden="true">
          {sectionScrollLocked ? '🔐' : '🔓'}
        </span>
      </button>
    </>
  )
}

function ConceptUnlockStack() {
  const { theme } = useTheme()
  return (
    <>
      <section id="concept-what" className="scroll-mt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-6xl lg:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          <img src={theme === 'dark' ? '/what_tab_dark_theme.jpeg' : '/what_tab_white_theme.jpeg'} alt="A digital platform to manage your interconnected Personal & Professional life—PBMP overview" className="w-full rounded-xl" />
        </motion.div>
      </section>
      <section id="concept-why" className="scroll-mt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-6xl lg:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          <img src={theme === 'dark' ? '/why_tab_dark_theme.jpeg' : '/why_tab_white_theme.jpeg'} alt="Why PBMP—Personal and Professional life, one platform" className="w-full rounded-xl" />
        </motion.div>
      </section>
      <section id="concept-how" className="scroll-mt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-6xl lg:max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
          <img src="/how_tab.jpg" alt="How PBMP—Solutions cover Personal & Professional needs" className="w-full rounded-xl" />
        </motion.div>
      </section>
    </>
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
  const conceptTabsBarRef = useRef<HTMLDivElement>(null)
  const conceptSectionRef = useRef<HTMLElement>(null)
  const conceptBarTopRef = useRef<number>(0)
  const conceptBarHeightRef = useRef<number>(56)
  const isConceptTabBarStickyRef = useRef(false)
  const [isConceptTabBarSticky, setIsConceptTabBarSticky] = useState(false)
  // Tab bar is always in the document flow so it never moves upward when Unlock/Lock is clicked

  const scrollToConceptSection = (tab: 'what' | 'why' | 'how') => {
    const el = document.getElementById(`concept-${tab}`)
    if (el) {
      setActiveTab(tab)
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

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

  // When user clicks lock, reset active tab to What.
  useEffect(() => {
    if (sectionScrollLocked) setActiveTab('what')
  }, [sectionScrollLocked])

  // When user clicks Unlock: redirect to What tab section (scroll so tab content sits just below fixed tabs; active tab = What).
  useEffect(() => {
    if (sectionScrollLocked) return
    const whatEl = document.getElementById('concept-what')
    if (!whatEl) return
    setActiveTab('what')
    const barHeight = Math.min(conceptBarHeightRef.current, 72)
    const gapBelowTabs = 32
    const scrollY = window.scrollY ?? window.pageYOffset
    const whatTop = whatEl.getBoundingClientRect().top + scrollY
    const scrollTop = Math.max(0, whatTop - barHeight - gapBelowTabs)
    if (Math.abs(scrollY - scrollTop) > 20) {
      window.scrollTo({ top: scrollTop, behavior: 'smooth' })
    }
  }, [sectionScrollLocked])

  // When user clicks lock while tab bar was sticky, scroll so the three tabs are back in view (cursor/view returns to tab bar position). On mobile, delay scroll so layout has settled.
  useEffect(() => {
    if (!sectionScrollLocked) return
    if (!isConceptTabBarStickyRef.current) return
    const getHeaderOffsetPx = () => {
      const val = typeof document !== 'undefined' && getComputedStyle(document.documentElement).getPropertyValue('--header-offset').trim()
      if (!val) return 128
      const rem = parseFloat(val)
      return Number.isNaN(rem) ? 128 : rem * 16
    }
    const barTop = conceptBarTopRef.current
    const headerOffsetPx = getHeaderOffsetPx()
    const scrollTo = Math.max(0, barTop - headerOffsetPx)
    const run = () => window.scrollTo({ top: scrollTo, behavior: 'smooth' })
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    if (isMobile) setTimeout(run, 150)
    else run()
  }, [sectionScrollLocked])

  // When unlocked: tab bar moves up to very top on scroll, stays fixed until all tab content is past, then returns when scrolling back up. Reset sticky when toggling unlock so we re-measure.
  useEffect(() => {
    if (sectionScrollLocked) {
      isConceptTabBarStickyRef.current = false
      setIsConceptTabBarSticky(false)
      return
    }
    const getHeaderOffsetPx = () => {
      const val = typeof document !== 'undefined' && getComputedStyle(document.documentElement).getPropertyValue('--header-offset').trim()
      if (!val) return 128
      const rem = parseFloat(val)
      return Number.isNaN(rem) ? 128 : rem * 16
    }
    const onScroll = () => {
      const section = conceptSectionRef.current
      const bar = conceptTabsBarRef.current
      if (!section || !bar) return
      const headerOffsetPx = getHeaderOffsetPx()
      const sectionBottom = section.offsetTop + section.offsetHeight
      const scrollY = window.scrollY ?? window.pageYOffset
      if (!isConceptTabBarStickyRef.current) {
        const rect = bar.getBoundingClientRect()
        conceptBarTopRef.current = rect.top + scrollY
        conceptBarHeightRef.current = rect.height
      }
      const barTop = conceptBarTopRef.current
      const shouldStick = scrollY >= barTop - headerOffsetPx && scrollY < sectionBottom - headerOffsetPx
      if (isConceptTabBarStickyRef.current !== shouldStick) {
        isConceptTabBarStickyRef.current = shouldStick
        setIsConceptTabBarSticky(shouldStick)
      }
      // Scroll-spy: update active tab based on which section is in view (trigger point just below header)
      const whatEl = document.getElementById('concept-what')
      const whyEl = document.getElementById('concept-why')
      const howEl = document.getElementById('concept-how')
      if (whatEl && whyEl && howEl) {
        const trigger = scrollY + headerOffsetPx + 80
        const whatTop = whatEl.getBoundingClientRect().top + scrollY
        const whyTop = whyEl.getBoundingClientRect().top + scrollY
        const howTop = howEl.getBoundingClientRect().top + scrollY
        const newTab: 'what' | 'why' | 'how' = trigger >= howTop ? 'how' : trigger >= whyTop ? 'why' : 'what'
        setActiveTab((prev) => (prev === newTab ? prev : newTab))
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [sectionScrollLocked])

  return (
    <div className="min-h-screen">
      {/* Hero Section - Home */}
      <motion.section
        id="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex items-start justify-center -mt-24 sm:-mt-20 md:-mt-24 pt-0 sm:pt-1 md:pt-2 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-8 scroll-mt-header lg:overflow-x-visible"
      >
        <div className="w-full max-w-7xl mx-auto text-center mt-0 lg:overflow-x-visible">
          {/* Grow24 hero block – above Welcome to (design from reference) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="font-jakarta -mt-1 sm:-mt-2 md:-mt-1 mb-6 sm:mb-8 md:mb-10"
          >
            <div className="flex items-center justify-center mb-0 -ml-4 sm:ml-0 mt-4 sm:mt-0">
              <img
                src={theme === 'dark' ? '/grow_icon_dark.jpeg' : '/grow24_ai_icon_5.jpeg'}
                alt="Grow24"
                className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto"
              />
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-1 sm:mb-2">
              Personal &amp; Business Management Platform
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-3 sm:mb-4 max-w-4xl mx-auto leading-tight">
              Unlocking Potential in Business and Life.
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-3 sm:mb-4">
              A unified system to identify goals, craft plans, and execute with precision across personal and professional domains.
            </p>
            <div className="w-full flex items-center justify-center mt-1">
              <div className="flex flex-row items-center justify-center gap-2 sm:gap-4">
                <motion.button
                  type="button"
                  onClick={() => document.getElementById('library')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm md:text-base text-white bg-gradient-to-r from-cta-green-500 to-cta-green-600 hover:from-cta-green-600 hover:to-cta-green-700 transition-colors shadow-md sm:shadow-lg text-center whitespace-nowrap"
                >
                  Start Your Transformation
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => document.getElementById('library')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition-colors shadow-sm sm:shadow-md text-center whitespace-nowrap"
                >
                  Explore the Grow24 Cycle
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Slider full-bleed so it can use max width and match BCG prominence; laptop: +1in each side */}
          <div className="w-full -mx-4 sm:-mx-6 md:-mx-8 px-0 lg:overflow-x-visible">
            <HeroCarousel />
          </div>

          {/* Individual Growth Cycle line - above valu_cycle image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="max-w-4xl mx-auto px-4 mb-4 text-center"
          >
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
              Individual Growth Cycle
            </p>
          </motion.div>

          {/* slide_2 images (dark / light mode) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5 }}
            className="max-w-4xl mx-auto mb-6 sm:mb-8 px-4"
          >
            <img
              src={theme === 'dark' ? '/valu_cycle_dark.jpeg' : '/valu_cycle_white.jpeg'}
              alt="Personal & Business Management Platform"
              className={`w-full h-auto object-contain rounded-lg ${theme === 'dark' ? 'shadow-md' : ''}`}
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
                <span>6 steps are needed to go from Identifying your Goal through to Enjoying the Benefits</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 dark:text-emerald-400 shrink-0">–</span>
                <span>We call this the Individual Growth Cycle</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 dark:text-emerald-400 shrink-0">–</span>
                <span>The same 6 Steps work in both our Personal Life &amp; Professional Life</span>
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
            {/* Stacked layout with L-shaped arrow (same on all screen sizes) */}
            <div className="relative max-w-md mx-auto text-left text-sm sm:text-base pl-12 sm:pl-14">
              {/* L-shaped return arrow: starts from center of left side of step 6 block, goes left then up, then right into step 1 */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none text-teal-600 dark:text-teal-400" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                <path d="M 12 92 L 6 92" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <path d="M 6 92 L 6 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
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
                  <p className="text-teal-700 dark:text-teal-300 font-semibold mb-1">5. Execute Project</p>
                  <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
                    Build and/or upgrade capabilities, and achieve a new steady state.
                  </p>
                </div>
                <div className="flex justify-center py-1" aria-hidden>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-teal-600 dark:text-teal-400 shrink-0">
                    <path d="M12 5v14M12 19l-6-6M12 19l6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div id="growth-cycle-step-6" className="w-full rounded-xl bg-white/80 dark:bg-slate-900/40 border border-teal-500/40 dark:border-teal-400/50 p-4 shadow-sm">
                  <p className="text-teal-700 dark:text-teal-300 font-semibold mb-1">6. Run Operations</p>
                  <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
                    Enjoy value as was envisioned at the Goal stage, capture learnings, and move to the next iteration.
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
        ref={conceptSectionRef}
        id="concept"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
        className="py-12 sm:py-16 md:py-20 px-4 pb-20 sm:pb-24 overflow-visible"
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
          </motion.div>

          {/* Tab bar: in flow normally. When unlocked and scrolling, it moves to the very top via portal (so no parent transform keeps it in the middle) and returns when scrolling back up. */}
          <div className="relative">
            {!sectionScrollLocked && isConceptTabBarSticky && (
              <div aria-hidden className="flex items-center justify-center gap-3 sm:gap-4 mb-0" style={{ height: Math.min(conceptBarHeightRef.current, 72), minHeight: 0 }} />
            )}
            {!sectionScrollLocked && isConceptTabBarSticky && typeof document !== 'undefined' && createPortal(
              <div
                className="fixed left-0 right-0 top-0 z-[60] bg-white dark:bg-slate-950 py-3 border-b border-gray-200 dark:border-slate-800 flex items-center justify-center"
                role="banner"
                aria-label="What, Why, How navigation"
              >
                <div className="max-w-7xl mx-auto w-full px-4 flex items-center justify-center gap-3 sm:gap-4">
                  <ConceptTabButtons activeTab={activeTab} setActiveTab={setActiveTab} sectionScrollLocked={sectionScrollLocked} setSectionScrollLocked={setSectionScrollLocked} scrollToSection={scrollToConceptSection} />
                </div>
              </div>,
              document.body
            )}
            <div
              ref={conceptTabsBarRef}
              className={`flex items-center justify-center gap-3 sm:gap-4 ${!sectionScrollLocked && isConceptTabBarSticky ? 'absolute opacity-0 pointer-events-none h-0 overflow-hidden mb-0' : 'mb-3 sm:mb-4'}`}
            >
              <ConceptTabButtons activeTab={activeTab} setActiveTab={setActiveTab} sectionScrollLocked={sectionScrollLocked} setSectionScrollLocked={setSectionScrollLocked} scrollToSection={!sectionScrollLocked ? scrollToConceptSection : undefined} />
            </div>

          {/* Lock = single tab; Unlock = What, Why, How stacked one below the other */}
          {sectionScrollLocked ? (
          <AnimatePresence mode="wait">
            {activeTab === 'what' ? (
              <motion.div
                key="what"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-6xl lg:max-w-[1400px] 2xl:max-w-[1600px] mx-auto"
              >
                <img
                  src={theme === 'dark' ? '/what_tab_dark_theme.jpeg' : '/what_tab_white_theme.jpeg'}
                  alt="A digital platform to manage your interconnected Personal & Professional life—PBMP overview"
                  className="w-full rounded-xl"
                />
              </motion.div>
            ) : activeTab === 'why' ? (
              <motion.div
                key="why"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-6xl lg:max-w-[1400px] 2xl:max-w-[1600px] mx-auto"
              >
                <img
                  src={theme === 'dark' ? '/why_tab_dark_theme.jpeg' : '/why_tab_white_theme.jpeg'}
                  alt="Why PBMP—Personal and Professional life, one platform"
                  className="w-full rounded-xl"
                />
              </motion.div>
            ) : (
              <motion.div
                key="how"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="max-w-6xl lg:max-w-[1400px] 2xl:max-w-[1600px] mx-auto"
              >
                <img
                  src="/how_tab.jpg"
                  alt="How PBMP—Solutions cover Personal & Professional needs"
                  className="w-full rounded-xl"
                />
              </motion.div>
            )}
          </AnimatePresence>
          ) : (
          <ConceptUnlockStack />
          )}
          </div>
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

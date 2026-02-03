import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from '@tanstack/react-router'
import { useComingSoon } from '../contexts/ComingSoonContext'
import { useTheme } from '../contexts/ThemeContext'

// SVG Icons - Hamburger menu icon (3 horizontal lines)
const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// SVG Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)


const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

// Menu Item Icons (matching Sidebar)
const OfferIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)


const LibraryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <line x1="8" y1="7" x2="16" y2="7" />
    <line x1="8" y1="11" x2="16" y2="11" />
    <line x1="8" y1="15" x2="14" y2="15" />
  </svg>
)

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const SolutionsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
  </svg>
)

// Theme Toggle Icons
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

interface NavItem {
  label: string
  href: string
  icon: () => JSX.Element
  badge?: string
}

const navItems: NavItem[] = [
  { label: 'Home', href: '#home', icon: HomeIcon },
  { label: 'The Concept', href: '#concept', icon: OfferIcon, badge: 'PBMP' },
  { label: 'Solutions', href: '#solutions', icon: SolutionsIcon },
  { label: 'Library', href: '#library', icon: LibraryIcon },
]

// Helper function to scroll to section
const scrollToSection = (href: string) => {
  if (href.startsWith('#')) {
    const sectionId = href.substring(1)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

interface HeaderProps {
  onMegaMenuToggle?: () => void
}

// Search index data
const searchIndex = [
  // Pages
  { type: 'page', title: 'Home', description: 'Welcome to Grow24.ai', href: '#home', keywords: ['home', 'main', 'landing'] },
  { type: 'page', title: 'The Concept', description: 'Learn about PBMP methodology', href: '#concept', keywords: ['concept', 'pbmp', 'methodology', 'plan', 'build', 'measure', 'progress'] },
  { type: 'page', title: 'Solutions', description: 'Explore our solutions', href: '#solutions', keywords: ['solutions', 'dashboard', 'corporate', 'sales', 'marketing'] },
  { type: 'page', title: 'Library', description: 'Access curated information and training resources', href: '#library', keywords: ['library', 'information', 'training', 'resources', 'content'] },
  
  // Solutions
  { type: 'solution', title: 'Strategy Goalsetting', description: 'Define measurable objectives for sustained growth', href: '/solutions/corp-goal-1', keywords: ['goals', 'strategy', 'objectives', 'growth', 'corporate'] },
  { type: 'solution', title: 'Strategy Generation', description: 'Formulate where-to-play and how-to-win strategies', href: '/solutions/corp-strat-1', keywords: ['strategy', 'generation', 'swot', 'bcg', 'matrix', 'corporate'] },
  { type: 'solution', title: 'Multi-Horizon Planning', description: 'Build stepwise plans, week + quarter - year', href: '/solutions/corp-plan-1', keywords: ['planning', 'multi-horizon', 'weekly', 'quarterly', 'annual', 'corporate'] },
  { type: 'solution', title: 'Project Portfolio', description: 'Drive strategic initiatives, programs, and projects', href: '/solutions/corp-proj-1', keywords: ['project', 'portfolio', 'initiatives', 'programs', 'corporate'] },
  { type: 'solution', title: 'KPI Monitoring', description: 'Monitor results against KPIs, targets, and activities', href: '/solutions/corp-ops-1', keywords: ['kpi', 'monitoring', 'metrics', 'performance', 'corporate'] },
  { type: 'solution', title: 'Sales Goalsetting', description: 'Align qualities, targets, and tenures for sales productivity', href: '/solutions/sales-goal-1', keywords: ['sales', 'goals', 'targets', 'quota', 'productivity'] },
  { type: 'solution', title: 'GTM Strategy', description: 'Define your go-to-market strategy with actionable tactics', href: '/solutions/sales-strat-1', keywords: ['gtm', 'go-to-market', 'sales', 'strategy', 'tactics'] },
  { type: 'solution', title: 'Marketing Goalsetting', description: 'Translate growth targets and inspirational objectives', href: '/solutions/mkt-goal-1', keywords: ['marketing', 'goals', 'growth', 'targets', 'objectives'] },
  { type: 'solution', title: 'Marketing GTM Strategy', description: 'Craft growth-oriented strategy to ignite growth', href: '/solutions/mkt-strat-1', keywords: ['marketing', 'gtm', 'strategy', 'growth'] },
]

export const Header: React.FC<HeaderProps> = ({ onMegaMenuToggle }) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const { showComingSoon } = useComingSoon()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement>(null)

  // Handle scroll to adjust translucency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Note: Search now opens/closes on hover, so we don't need click outside handler

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase().trim()
    return searchIndex
      .filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(query)
        const descMatch = item.description.toLowerCase().includes(query)
        const keywordMatch = item.keywords.some((keyword) => keyword.toLowerCase().includes(query))
        return titleMatch || descMatch || keywordMatch
      })
      .slice(0, 8) // Limit to 8 results
  }, [searchQuery])

  const handleSearchResultClick = (href: string) => {
    setSearchOpen(false)
    setSearchQuery('')
    if (href.startsWith('#')) {
      scrollToSection(href)
    } else if (href.startsWith('/solutions/')) {
      // For solution detail pages, use navigation
      navigate({ to: href })
    } else {
      // For other routes, scroll to section
      const sectionMap: Record<string, string> = {
        '/': '#home',
        '/what-we-offer': '#concept',
        '/solutions': '#solutions',
        '/library': '#library',
      }
      const sectionId = sectionMap[href] || '#home'
      scrollToSection(sectionId)
    }
  }

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 no-blur-header"
        style={{
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          filter: 'none'
        } as React.CSSProperties}
      >
        <div 
          className={`no-blur-header transition-all duration-300 ${
            scrolled
              ? 'dark:bg-slate-950/90'
              : 'dark:bg-slate-950/90'
          }`}
          style={{
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            filter: 'none'
          } as React.CSSProperties}
        >
          <div className="w-full px-3 sm:px-4 md:px-8 py-2 sm:py-3">
            <div className="flex items-center justify-between gap-1.5 sm:gap-2 md:gap-8">
              {/* Left Side: Menu Button + Logo */}
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6 flex-1 md:flex-none overflow-visible">
                {/* Hamburger Menu Button - Only visible on mobile/tablet, hidden on laptop/desktop */}
                <motion.button
                  onClick={() => setSideMenuOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all flex-shrink-0 backdrop-blur-sm md:hidden shadow-md ${
                    theme === 'dark'
                      ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-900'
                    }`}
                  aria-label="Open menu"
                >
                  <HamburgerIcon />
                </motion.button>

                {/* Logo */}
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('#home')
                  }}
                  className="flex items-center hover:opacity-80 transition-opacity shrink-0 overflow-visible -mt-1 sm:-mt-2 md:-mt-3 ml-6 sm:ml-8 md:ml-12 lg:ml-12"
                >
                  <img
                    src="/grow.svg"
                    alt="Grow24.ai Logo"
                    className="h-10 sm:h-14 md:h-20 lg:h-24 w-auto object-contain"
                    style={{ display: 'block', maxWidth: 'none' }}
                  />
                </a>
              </div>

              {/* Right Side: Search + Auth */}
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
                {/* Get a Demo - Primary - Hide text on mobile, show icon only */}
                <motion.button
                  onClick={() => showComingSoon('get-demo', 'Get a Demo', 'Enter your details to schedule a personalized demo and learn how Grow24.ai can transform your growth journey.')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-2 sm:px-3 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-cta-green-500/90 hover:bg-cta-green-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-cta-green-900/20 whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Get a Demo</span>
                  <span className="sm:hidden">Demo</span>
                </motion.button>

                {/* Theme Toggle */}
                <motion.button
                  onClick={() => {
                    console.log('🌓 Theme toggle clicked, current theme:', theme)
                    toggleTheme()
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-1.5 sm:p-2 md:p-2.5 rounded-lg transition-colors flex-shrink-0 ${
                    theme === 'dark'
                      ? 'text-white hover:bg-white/10'
                      : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  <AnimatePresence mode="wait">
                    {theme === 'dark' ? (
                      <motion.div
                        key="sun"
                        initial={{ opacity: 0, rotate: -90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      >
                        <SunIcon />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ opacity: 0, rotate: 90 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -90 }}
                        transition={{ duration: 0.2 }}
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      >
                        <MoonIcon />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Search - Hide on mobile */}
                <div 
                  className="relative hidden md:block" 
                  ref={searchRef}
                  onMouseEnter={() => setSearchOpen(true)}
                  onMouseLeave={() => setSearchOpen(false)}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2.5 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'text-white hover:bg-white/10'
                        : 'text-gray-900 hover:bg-gray-100'
                      }`}
                    aria-label="Search"
                  >
                    <SearchIcon />
                  </motion.button>

                  <AnimatePresence>
                    {searchOpen && (
                      <motion.div
                        initial={{ opacity: 0, x: 20, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: 400 }}
                        exit={{ opacity: 0, x: 20, width: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-0 glass backdrop-blur-xl bg-white/95 dark:bg-slate-800/95 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden z-[100]"
                      >
                        <div className="relative flex items-center">
                          <div className="absolute left-4 text-gray-400 dark:text-gray-500 pointer-events-none">
                            <SearchIcon />
                          </div>
                          <input
                            type="text"
                            placeholder="Type to search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && searchResults.length > 0) {
                                handleSearchResultClick(searchResults[0].href)
                              } else if (e.key === 'Escape') {
                                setSearchOpen(false)
                                setSearchQuery('')
                              }
                            }}
                            autoFocus
                            className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-0 border-0"
                          />
                        </div>
                        {searchQuery && (
                          <div className="max-h-64 overflow-y-auto border-t border-gray-200 dark:border-gray-700">
                            {searchResults.length > 0 ? (
                              <>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">
                                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                                </div>
                                {searchResults.map((result, idx) => (
                                  <motion.div
                                    key={`${result.type}-${result.href}-${idx}`}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    onClick={() => handleSearchResultClick(result.href)}
                                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full ${
                                        result.type === 'page' ? 'bg-cta-green-500' :
                                        result.type === 'solution' ? 'bg-blue-500' :
                                        'bg-info-gold-500'
                                      }`} />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
                                            {result.title}
                                          </span>
                                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 uppercase">
                                            {result.type}
                                          </span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                                          {result.description}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </>
                            ) : (
                              <div className="px-4 py-6 text-center">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                  No results found
                                </div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                  Try different keywords
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Side Menu (slides from left) */}
      <AnimatePresence>
        {sideMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSideMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />

            {/* Side Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] glass backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 shadow-2xl border-r border-gray-200 dark:border-white/10 z-[65] overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="px-6 py-8 border-b border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 dark:from-emerald-600 dark:to-emerald-800 flex items-center justify-center shadow-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Grow24.ai</h2>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Transform & Thrive</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSideMenuOpen(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400 flex-shrink-0"
                      aria-label="Close menu"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>

              {/* Menu Items */}
              <nav className="flex-1 overflow-y-auto py-6 px-4">
                <div className="space-y-1">
                  {navItems.map((item, idx) => {
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault()
                            scrollToSection(item.href)
                            setSideMenuOpen(false)
                          }}
                          className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                          <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 bg-gray-100 dark:bg-white/5 group-hover:bg-emerald-500/20 group-hover:scale-110">
                            <item.icon />
                          </div>
                          <span className="relative z-10 font-medium">{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                              {item.badge}
                            </span>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </a>
                      </motion.div>
                    )
                  })}
                </div>
              </nav>

                {/* Mobile CTA */}
                <div className="p-4 border-t border-gray-200 dark:border-white/10 mt-auto">
                  <motion.button
                    onClick={() => {
                      setSideMenuOpen(false)
                      showComingSoon('get-demo', 'Get a Demo', 'Enter your details to schedule a personalized demo and learn how Grow24.ai can transform your growth journey.')
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 bg-cta-green-500 hover:bg-cta-green-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg"
                  >
                    Get a Demo
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header

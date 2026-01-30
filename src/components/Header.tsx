import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@tanstack/react-router'
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
  href?: string
  hasDropdown?: boolean
}

const navItems: NavItem[] = [
  { label: 'The Concept', href: '/what-we-offer' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Customers', href: '#customers' },
  { label: 'Learn & Engage', href: '/resources' },
  { label: 'Partners', href: '#partners' },
  { label: 'Support', href: '#support' },
  { label: 'Company', href: '#company' },
]

interface HeaderProps {
  onMegaMenuToggle?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMegaMenuToggle }) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { showComingSoon } = useComingSoon()
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="glass backdrop-blur-md transition-all duration-300 bg-white/10 dark:bg-slate-950/40">
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
                <Link
                  to="/"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="flex items-center hover:opacity-80 transition-opacity shrink-0 overflow-visible -mt-1 sm:-mt-2 md:-mt-3 ml-6 sm:ml-8 md:ml-12 lg:ml-12"
                >
                  <img
                    src="/grow.svg"
                    alt="Grow24.ai Logo"
                    className="h-10 sm:h-14 md:h-20 lg:h-24 w-auto object-contain"
                    style={{ display: 'block', maxWidth: 'none' }}
                  />
                </Link>
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
                <div className="relative hidden md:block">
                  <motion.button
                    onClick={() => setSearchOpen(!searchOpen)}
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
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 300 }}
                        exit={{ opacity: 0, width: 0 }}
                        className="absolute right-0 top-full mt-2 glass backdrop-blur-xl bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden"
                      >
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                          className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        {searchQuery && (
                          <div className="max-h-64 overflow-y-auto border-t border-gray-200 dark:border-gray-700">
                            <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                              Search results for "{searchQuery}"
                            </div>
                            <div className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                              No results found. Try different keywords.
                            </div>
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
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] glass backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 shadow-2xl border-r border-white/20 z-[65] overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <img
                    src="/grow24.png"
                    alt="Grow24.ai Logo"
                    className="h-12 sm:h-14 w-auto object-contain flex-shrink-0"
                    style={{ display: 'block' }}
                  />
                </div>
                <button
                  onClick={() => setSideMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400 flex-shrink-0 ml-2"
                  aria-label="Close menu"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.hasDropdown ? (
                      <button
                        onClick={() => {
                          setSideMenuOpen(false)
                          onMegaMenuToggle?.()
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 flex items-center justify-between group"
                      >
                        <span>{item.label}</span>
                        <ChevronDownIcon />
                      </button>
                    ) : item.href?.startsWith('#') ? (
                      <a
                        href={item.href}
                        onClick={() => setSideMenuOpen(false)}
                        className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        to={item.href || '/'}
                        onClick={() => setSideMenuOpen(false)}
                        className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile CTA */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header

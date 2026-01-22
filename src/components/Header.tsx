import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/clerk-react'
import { useComingSoon } from '../contexts/ComingSoonContext'

// SVG Icons - Greater than symbol for menu
const GreaterThanIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
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

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

interface NavItem {
  label: string
  href?: string
  hasDropdown?: boolean
}

const navItems: NavItem[] = [
  { label: 'What we Offer', hasDropdown: true },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Customers', href: '#customers' },
  { label: 'Learn & Engage', href: '/resources' },
  { label: 'Partners', href: '#partners' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Support', href: '#support' },
  { label: 'Company', href: '#company' },
]

interface HeaderProps {
  onMegaMenuToggle?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMegaMenuToggle }) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { showComingSoon } = useComingSoon()
  const hasClerkProvider = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
                           import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== 'YOUR_PUBLISHABLE_KEY'
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50">
        <div className={`glass backdrop-blur-md transition-all duration-300 border-b ${isScrolled
          ? 'bg-white/95 dark:bg-slate-900/95 border-gray-200 dark:border-gray-700'
          : 'bg-white/10 border-white/20'
          }`}>
        <div className="w-full px-8 py-3">
          <div className="flex items-center justify-between gap-8">
              {/* Left Side: Menu Button + Logo */}
              <div className="flex items-center gap-4 flex-shrink-0">
                {/* Greater Than Menu Button */}
                <motion.button
                  onClick={() => setSideMenuOpen(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-lg transition-colors ${isScrolled
                    ? 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white hover:bg-white/10'
                    }`}
                  aria-label="Open menu"
                >
                  <GreaterThanIcon />
                </motion.button>

                {/* Logo */}
                <Link
                  to="/"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="flex items-center hover:opacity-80 transition-opacity"
                >
              <img 
                    src="/grow.svg"
                alt="Grow24.ai Logo" 
                    className="h-16 w-auto object-cover"
                style={{ display: 'block' }}
              />
                    </Link>
                </div>
            
              {/* Right Side: Search + Auth */}
              <div className="flex items-center gap-3 flex-shrink-0">
              {/* Get a Demo - Primary */}
              <motion.button
                  onClick={showComingSoon}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 bg-emerald-600/90 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-emerald-900/20"
              >
                Get a Demo
              </motion.button>
              
              {/* Search */}
              <div className="relative">
                <motion.button
                  onClick={() => setSearchOpen(!searchOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                    className={`p-2.5 rounded-lg transition-colors ${isScrolled
                      ? 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                      : 'text-white hover:bg-white/10'
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
                      className="absolute right-0 top-full mt-2 glass backdrop-blur-xl bg-white/10 rounded-lg border border-white/20 overflow-hidden"
                    >
                      <input
                        type="text"
                        placeholder="Search..."
                        autoFocus
                        className="w-full px-4 py-3 bg-transparent text-white placeholder-white/50 outline-none"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {hasClerkProvider ? (
                <>
                  <SignedOut>
                    <SignInButton mode="modal">
                        <button className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${isScrolled
                          ? 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
                          : 'text-white/90 hover:text-white'
                          }`}>
                        <UserIcon />
                        <span>Login</span>
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="px-4 py-2 bg-emerald-600/90 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-all duration-200">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: 'w-9 h-9',
                          userButtonPopoverCard: 'bg-white dark:bg-slate-800 shadow-xl',
                          userButtonPopoverActionButton: 'hover:bg-slate-100 dark:hover:bg-slate-700',
                          userButtonPopoverActionButtonText: 'text-slate-900 dark:text-white',
                          userButtonPopoverActionButtonIcon: 'text-slate-600 dark:text-slate-400',
                          userPreviewMainIdentifier: 'text-slate-900 dark:text-white font-semibold',
                          userPreviewSecondaryIdentifier: 'text-slate-600 dark:text-slate-400',
                        }
                      }}
                    />
                  </SignedIn>
                </>
              ) : (
                <a
                  href="#login"
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${isScrolled
                      ? 'text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300'
                      : 'text-white/90 hover:text-white'
                      }`}
                >
                  <UserIcon />
                  <span>Login</span>
                </a>
              )}
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
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
                <button
                  onClick={() => setSideMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
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
                    showComingSoon()
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg"
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

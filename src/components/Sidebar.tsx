import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from '@tanstack/react-router'

// Hamburger Icon (3 lines) - BCG style
const HamburgerIcon = ({ isHovered }: { isHovered?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isHovered ? "white" : "black"} strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

// Close/X Icon - BCG style (white when in green background)
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// Menu Icon - BCG style (separate icons, no overlap)
const MenuIcon = ({ isOpen, isHovered }: { isOpen: boolean; isHovered?: boolean }) => {
  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <CloseIcon />
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <HamburgerIcon isHovered={isHovered} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const OfferIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

const ResourcesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
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

const PricingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const AboutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
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

interface MenuItem {
  label: string
  href: string
  icon: () => JSX.Element
  badge?: string
}

const menuItems: MenuItem[] = [
  { label: 'Home', href: '/', icon: HomeIcon },
  { label: 'The Concept', href: '/what-we-offer', icon: OfferIcon, badge: 'PBMP' },
  { label: 'Solutions', href: '/solutions', icon: SolutionsIcon },
  { label: 'Resources', href: '/resources', icon: ResourcesIcon },
  { label: 'Library', href: '/library', icon: LibraryIcon },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const location = useLocation()

  return (
    <>
      {/* Toggle Button - Fixed on left side - Hidden on mobile since header has menu button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden md:flex fixed top-6 left-6 z-[60] w-12 h-12 rounded-lg items-center justify-center transition-all duration-200 ${
          isOpen
            ? 'bg-cta-green-500 hover:bg-cta-green-600'
            : isHovered
            ? 'bg-cta-green-500'
            : 'bg-gray-200 dark:bg-gray-300'
        }`}
        style={{
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          border: 'none',
          outline: 'none',
          backgroundColor: isOpen ? '#00C896' : undefined,
          boxShadow: 'none'
        } as React.CSSProperties}
        whileHover={isOpen ? {} : { scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Toggle menu"
      >
        <MenuIcon isOpen={isOpen} isHovered={isHovered || isOpen} />
      </motion.button>

      {/* Backdrop - No blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 z-[55]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 h-screen w-80 z-[56] glass backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 border-r border-gray-200 dark:border-white/10 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-8 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Grow24.ai11</h2>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">Transform & Thrive</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto py-6 px-4">
                <div className="space-y-1">
                  {menuItems.map((item, idx) => {
                    const isActive = location.pathname === item.href ||
                      (item.href === '/' && location.pathname === '/') ||
                      (item.href !== '/' && location.pathname.startsWith(item.href))

                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        {item.href.startsWith('#') ? (
                          <a
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${isActive
                              ? 'text-white dark:text-white bg-emerald-500/20 border border-emerald-500/30'
                              : 'text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                              }`}
                          >
                            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${isActive
                              ? 'bg-emerald-500/30 scale-110'
                              : 'bg-gray-100 dark:bg-white/5 group-hover:bg-emerald-500/20 group-hover:scale-110'
                              }`}>
                              <item.icon />
                            </div>
                            <span className="relative z-10 font-medium">{item.label}</span>
                            {item.badge && (
                              <span className="ml-auto px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                                {item.badge}
                              </span>
                            )}
                            {!isActive && (
                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            )}
                          </a>
                        ) : (
                          <Link
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${isActive
                              ? 'text-white dark:text-white bg-emerald-500/20 border border-emerald-500/30'
                              : 'text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                              }`}
                          >
                            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${isActive
                              ? 'bg-emerald-500/30 scale-110'
                              : 'bg-gray-100 dark:bg-white/5 group-hover:bg-emerald-500/20 group-hover:scale-110'
                              }`}>
                              <item.icon />
                            </div>
                            <span className="relative z-10 font-medium">{item.label}</span>
                            {item.badge && (
                              <span className="ml-auto px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                                {item.badge}
                              </span>
                            )}
                            {!isActive && (
                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            )}
                          </Link>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

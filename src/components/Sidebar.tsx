import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from '@tanstack/react-router'

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

// New menu item icons
const SupportIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
)

const EngageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="9" y1="10" x2="15" y2="10" />
    <line x1="12" y1="7" x2="12" y2="13" />
  </svg>
)

const ContactIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const PartnerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const JoinUsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
)

const PrivacyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const TermsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const CookieIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="8" cy="10" r="1" />
    <circle cx="16" cy="10" r="1" />
    <circle cx="10" cy="16" r="1" />
    <circle cx="14" cy="16" r="1" />
    <path d="M12 8v4" />
  </svg>
)

const SitemapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <line x1="6.5" y1="10" x2="17.5" y2="10" />
    <line x1="17.5" y1="14" x2="17.5" y2="10" />
    <line x1="6.5" y1="14" x2="6.5" y2="10" />
    <line x1="10" y1="17.5" x2="14" y2="17.5" />
  </svg>
)

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const PressroomIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <rect x="7" y="7" width="6" height="4" />
    <rect x="7" y="13" width="10" height="4" />
  </svg>
)

interface MenuItem {
  label: string
  href: string
  icon: () => JSX.Element
  badge?: string
}

const menuItems: MenuItem[] = [
  { label: 'Home', href: '#home', icon: HomeIcon },
  { label: 'Concept', href: '#concept', icon: OfferIcon, badge: 'PBMP' },
  { label: 'Solutions', href: '#solutions', icon: SolutionsIcon },
  { label: 'Library', href: '#library', icon: LibraryIcon },
  { label: 'Get Support', href: '#support', icon: SupportIcon },
  { label: 'Engage', href: '#engage', icon: EngageIcon },
  { label: 'Contact Us', href: '#contact', icon: ContactIcon },
  { label: 'About Us', href: '#about', icon: AboutIcon },
  { label: 'Become Partner', href: '#partner', icon: PartnerIcon },
  { label: 'Join Us', href: '#join', icon: JoinUsIcon },
  { label: 'Privacy Policy', href: '#privacy', icon: PrivacyIcon },
  { label: 'Terms of Use', href: '#terms', icon: TermsIcon },
  { label: 'Cookie Settings', href: '#cookies', icon: CookieIcon },
  { label: 'Sitemap', href: '#sitemap', icon: SitemapIcon },
  { label: 'Pressroom', href: '#pressroom', icon: PressroomIcon },
]

// Helper function to scroll to section
const scrollToSection = (href: string, navigate: any, location: any) => {
  if (href.startsWith('#')) {
    const sectionId = href.substring(1)
    
    // If we're on an inner page, navigate to home first
    if (location.pathname !== '/') {
      navigate({ to: '/' }).then(() => {
        // Wait for navigation and DOM update
        setTimeout(() => {
          const element = document.getElementById(sectionId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      })
    } else {
      // We're already on home page, just scroll
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [menuSearchQuery, setMenuSearchQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  
  // Track selected menu item based on current location/hash
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('')
  
  useEffect(() => {
    // Set selected menu item based on current hash or pathname
    const hash = window.location.hash.substring(1)
    if (hash) {
      setSelectedMenuItem(`#${hash}`)
    } else if (location.pathname === '/') {
      setSelectedMenuItem('#home')
    }
  }, [location])
  
  // Filter menu items based on search query
  const filteredMenuItems = useMemo(() => {
    if (!menuSearchQuery.trim()) {
      return menuItems
    }
    const query = menuSearchQuery.toLowerCase().trim()
    return menuItems.filter(item => 
      item.label.toLowerCase().includes(query)
    )
  }, [menuSearchQuery])

  return (
    <>
      {/* Toggle Button - Fixed on left side - Hidden when sidebar is open and hidden on mobile since header has menu button */}
      {!isOpen && (
        <motion.a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            scrollToSection('#home', navigate, location)
            setIsOpen(!isOpen)
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`hidden md:flex fixed top-6 left-6 z-[70] w-12 h-12 rounded-lg items-center justify-center transition-all duration-200 cursor-pointer ${
            isHovered
              ? 'bg-cta-green-500'
              : 'bg-gray-200 dark:bg-gray-300'
          }`}
          style={{
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            border: 'none',
            outline: 'none',
            boxShadow: 'none'
          } as React.CSSProperties}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Go to home and toggle menu"
        >
          <MenuIcon isOpen={isOpen} isHovered={isHovered || isOpen} />
        </motion.a>
      )}

      {/* Backdrop - No blur */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 z-[65]"
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
            className="fixed top-0 left-0 h-screen w-80 z-[66] glass backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 border-r border-gray-200 dark:border-white/10 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-6 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 flex-shrink-0 rounded-lg bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Close menu"
                  >
                    <CloseIcon />
                  </motion.button>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">Grow24.ai</h2>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 whitespace-nowrap">Transform & Thrive</p>
                  </div>
                </div>
                
                {/* Search Input */}
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={menuSearchQuery}
                    onChange={(e) => setMenuSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                  {menuSearchQuery && (
                    <button
                      onClick={() => setMenuSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <CloseIcon />
                    </button>
                  )}
                </div>
              </div>

              {/* Navigation - No scrollbar, all items visible */}
              <nav className="flex-1 py-4 px-4 overflow-hidden">
                <div className="space-y-1 h-full overflow-y-auto scrollbar-hide">
                  <style>{`
                    .scrollbar-hide {
                      scrollbar-width: none;
                      -ms-overflow-style: none;
                    }
                    .scrollbar-hide::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  {filteredMenuItems.length > 0 ? (
                    filteredMenuItems.map((item, idx) => {
                      const isSelected = selectedMenuItem === item.href
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                        >
                          <a
                            href={item.href}
                            onClick={(e) => {
                              e.preventDefault()
                              setSelectedMenuItem(item.href)
                              scrollToSection(item.href, navigate, location)
                              setIsOpen(false)
                            }}
                            className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 relative overflow-hidden ${
                              isSelected
                                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-semibold'
                                : 'text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                            }`}
                          >
                            <div className={`relative z-10 flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 flex-shrink-0 ${
                              isSelected
                                ? 'bg-emerald-500/30 group-hover:bg-emerald-500/40'
                                : 'bg-gray-100 dark:bg-white/5 group-hover:bg-emerald-500/20'
                            } group-hover:scale-110`}>
                              <item.icon />
                            </div>
                            <span className="relative z-10 font-medium text-sm truncate">{item.label}</span>
                            {item.badge && (
                              <span className="ml-auto px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                                {item.badge}
                              </span>
                            )}
                            {!isSelected && (
                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            )}
                          </a>
                        </motion.div>
                      )
                    })
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                      No menu items found
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

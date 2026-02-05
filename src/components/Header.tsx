import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { useComingSoon } from '../contexts/ComingSoonContext'
import { useTheme } from '../contexts/ThemeContext'
import { isValidSolutionId } from '../constants/solutions'

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

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)


const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const ChevronUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="18 15 12 9 6 15" />
  </svg>
)

const ClearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
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

const AboutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
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

const PressroomIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <rect x="7" y="7" width="6" height="4" />
    <rect x="7" y="13" width="10" height="4" />
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

// Helper function to highlight search query in text
const highlightText = (text: string, query: string): JSX.Element => {
  if (!query.trim()) {
    return <>{text}</>
  }

  // Escape special regex characters in the query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, index) => {
        // Check if this part matches the query (case-insensitive)
        const matches = part.toLowerCase() === query.toLowerCase()
        return matches ? (
          <mark 
            key={index} 
            className="bg-emerald-200 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 font-semibold px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      })}
    </>
  )
}

interface HeaderProps {
  onMegaMenuToggle?: () => void
}

// Menu labels that should be excluded from search (only menu items, not page content)
const menuOnlyLabels = new Set([
  'Become Partner',
  'Join Us',
  'Privacy Policy',
  'Terms of Use',
  'Cookie Settings',
  'Sitemap',
  'Pressroom',
])

// Solution IDs are validated using isValidSolutionId from constants/solutions.ts

// Search index data - only includes pages that actually exist in the DOM
const searchIndex = [
  // Pages (only include pages that actually exist as sections on the site)
  { type: 'page', title: 'Home', description: 'Welcome to Grow24.ai', href: '#home', keywords: ['home', 'main', 'landing'] },
  { type: 'page', title: 'Concept', description: 'Learn about PBMP methodology', href: '#concept', keywords: ['concept', 'pbmp', 'methodology', 'plan', 'build', 'measure', 'progress'] },
  { type: 'page', title: 'Solutions', description: 'Explore our solutions', href: '#solutions', keywords: ['solutions', 'dashboard', 'corporate', 'sales', 'marketing'] },
  { type: 'page', title: 'Library', description: 'Access curated information and training resources', href: '#library', keywords: ['library', 'information', 'training', 'resources', 'content'] },
  // Note: Pages like 'Get Support', 'About Us', 'Contact Us', 'Engage', etc. are excluded 
  // because they don't exist as actual page sections - they're only menu items
  
  // Solutions - only include solutions that actually exist
  { type: 'solution', title: 'Strategy Goalsetting', description: 'Define measurable objectives for sustained growth', href: '/solutions/corp-goal-1', keywords: ['goals', 'strategy', 'objectives', 'growth', 'corporate'] },
  { type: 'solution', title: 'Strategy Generation', description: 'Formulate where-to-play and how-to-win strategies', href: '/solutions/corp-strat-1', keywords: ['strategy', 'generation', 'swot', 'bcg', 'matrix', 'corporate'] },
  { type: 'solution', title: 'Multi-Horizon Planning', description: 'Build stepwise plans, week + quarter - year', href: '/solutions/corp-plan-1', keywords: ['planning', 'multi-horizon', 'weekly', 'quarterly', 'annual', 'corporate'] },
  { type: 'solution', title: 'KPI Monitoring', description: 'Monitor results against KPIs, targets, and activities', href: '/solutions/corp-ops-1', keywords: ['kpi', 'monitoring', 'metrics', 'performance', 'corporate'] },
  { type: 'solution', title: 'Sales Goalsetting', description: 'Align qualities, targets, and tenures for sales productivity', href: '/solutions/sales-goal-1', keywords: ['sales', 'goals', 'targets', 'quota', 'productivity'] },
  { type: 'solution', title: 'GTM Strategy', description: 'Define your go-to-market strategy with actionable tactics', href: '/solutions/sales-strat-1', keywords: ['gtm', 'go-to-market', 'sales', 'strategy', 'tactics'] },
  { type: 'solution', title: 'Marketing Goalsetting', description: 'Translate growth targets and inspirational objectives', href: '/solutions/mkt-goal-1', keywords: ['marketing', 'goals', 'growth', 'targets', 'objectives'] },
  { type: 'solution', title: 'Marketing GTM Strategy', description: 'Craft growth-oriented strategy to ignite growth', href: '/solutions/mkt-strat-1', keywords: ['marketing', 'gtm', 'strategy', 'growth'] },
].filter(item => {
  // Filter out menu-only items
  if (menuOnlyLabels.has(item.title)) {
    return false
  }
  // For solutions, verify they exist using the shared constant
  if (item.type === 'solution' && item.href.startsWith('/solutions/')) {
    const solutionId = item.href.replace('/solutions/', '')
    return isValidSolutionId(solutionId)
  }
  return true
})

export const Header: React.FC<HeaderProps> = ({ onMegaMenuToggle }) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [menuSearchQuery, setMenuSearchQuery] = useState('')
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('')
  const [selectedResultIndex, setSelectedResultIndex] = useState<number>(-1)
  const [highlightedElements, setHighlightedElements] = useState<HTMLElement[]>([])
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { showComingSoon } = useComingSoon()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const searchRef = useRef<HTMLDivElement>(null)

  // Check if we're on desktop (xl breakpoint: 1280px+) and mobile
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsDesktop(width >= 1280)
      setIsMobile(width < 768)
    }
    // Set initial state
    setIsDesktop(false)
    setIsMobile(window.innerWidth < 768)
    // Check immediately and on resize
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize, { passive: true })
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  
  // Track selected menu item based on current location/hash
  useEffect(() => {
    const hash = window.location.hash.substring(1)
    if (hash) {
      setSelectedMenuItem(`#${hash}`)
    } else if (location.pathname === '/') {
      setSelectedMenuItem('#home')
    }
  }, [location])
  
  // Filter menu items based on search query
  const filteredNavItems = useMemo(() => {
    if (!menuSearchQuery.trim()) {
      return navItems
    }
    const query = menuSearchQuery.toLowerCase().trim()
    return navItems.filter(item => 
      item.label.toLowerCase().includes(query)
    )
  }, [menuSearchQuery])

  // Handle scroll to adjust translucency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Click outside handler for mobile search only
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        // Only close on mobile if clicking outside
        if (window.innerWidth < 768 && searchOpen) {
          setSearchOpen(false)
        }
      }
    }

    if (searchOpen && window.innerWidth < 768) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [searchOpen])

  // Search functionality
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return []
    }

    const query = searchQuery.toLowerCase().trim()
    const results = searchIndex
      .filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(query)
        const descMatch = item.description.toLowerCase().includes(query)
        const keywordMatch = item.keywords.some((keyword) => keyword.toLowerCase().includes(query))
        return titleMatch || descMatch || keywordMatch
      })
      .slice(0, 8) // Limit to 8 results
    
    return results
  }, [searchQuery])

  // Reset selected index when results change
  useEffect(() => {
    if (searchResults.length > 0 && selectedResultIndex >= searchResults.length) {
      setSelectedResultIndex(0)
    } else if (searchResults.length === 0) {
      setSelectedResultIndex(-1)
    }
  }, [searchResults.length, selectedResultIndex])

  // Highlight search matches on the page - only highlight matching text, not entire elements
  // Re-runs when searchQuery or location changes (to re-highlight after navigation)
  useEffect(() => {
    // Use a small delay to ensure DOM is ready after navigation
    const timeoutId = setTimeout(() => {
      if (!searchQuery.trim()) {
        // Remove all highlights by unwrapping highlighted spans
        const highlightedSpans = document.querySelectorAll('.search-highlight-text')
        highlightedSpans.forEach(span => {
          const parent = span.parentNode
          if (parent) {
            parent.replaceChild(document.createTextNode(span.textContent || ''), span)
            parent.normalize() // Merge adjacent text nodes
          }
        })
        setHighlightedElements([])
        return
      }

      const query = searchQuery.trim()
      if (!query) return

      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const searchRegex = new RegExp(escapedQuery, 'gi')
      
      // First, remove any existing highlights
      const existingHighlights = document.querySelectorAll('.search-highlight-text')
      existingHighlights.forEach(span => {
        const parent = span.parentNode
        if (parent) {
          parent.replaceChild(document.createTextNode(span.textContent || ''), span)
          parent.normalize()
        }
      })
      
      // Find and highlight text nodes (excluding search box and menu)
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement
            if (!parent) return NodeFilter.FILTER_REJECT
            
            // Skip if already highlighted
            if (parent.classList.contains('search-highlight-text')) {
              return NodeFilter.FILTER_REJECT
            }
            
            // Skip search box, menu, and other UI elements
            if (parent.closest('[class*="search"]') || 
                parent.closest('[class*="menu"]') ||
                parent.closest('header') ||
                parent.closest('nav') ||
                parent.closest('aside') ||
                parent.closest('[data-result-index]')) {
              return NodeFilter.FILTER_REJECT
            }
            
            // Skip if parent is a script, style, or other non-content element
            const tagName = parent.tagName?.toLowerCase()
            if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') {
              return NodeFilter.FILTER_REJECT
            }
            
            return NodeFilter.FILTER_ACCEPT
          }
        }
      )
      
      const newHighlightedElements: HTMLElement[] = []
      const textNodes: Text[] = []
      let node: Node | null
      
      // Collect all matching text nodes first (using a fresh regex for each test)
      while (node = walker.nextNode()) {
        const text = node.textContent || ''
        const testRegex = new RegExp(escapedQuery, 'gi')
        if (testRegex.test(text)) {
          textNodes.push(node as Text)
        }
      }
      
      // Process text nodes and wrap matching text
      textNodes.forEach(textNode => {
        const text = textNode.textContent || ''
        const matchRegex = new RegExp(`(${escapedQuery})`, 'gi')
        const matches = [...text.matchAll(matchRegex)]
        
        if (matches.length === 0) return
        
        const parent = textNode.parentElement
        if (!parent) return
        
        // Create document fragment with highlighted text
        const fragment = document.createDocumentFragment()
        let lastIndex = 0
        
        matches.forEach(match => {
          if (match.index === undefined) return
          
          // Add text before match
          if (match.index > lastIndex) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)))
          }
          
          // Add highlighted match
          const highlightSpan = document.createElement('span')
          highlightSpan.className = 'search-highlight-text'
          highlightSpan.style.backgroundColor = 'rgba(16, 185, 129, 0.3)' // emerald-500 with opacity
          highlightSpan.style.borderRadius = '2px'
          highlightSpan.style.padding = '0 1px'
          highlightSpan.style.color = 'inherit'
          highlightSpan.textContent = match[0]
          fragment.appendChild(highlightSpan)
          newHighlightedElements.push(highlightSpan)
          
          lastIndex = match.index + match[0].length
        })
        
        // Add remaining text after last match
        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex)))
        }
        
        // Replace the original text node with the fragment
        parent.replaceChild(fragment, textNode)
      })
      
      setHighlightedElements(newHighlightedElements)
    }, 100) // Small delay to ensure DOM is ready after navigation
    
    // Cleanup function
    return () => {
      clearTimeout(timeoutId)
      const highlightedSpans = document.querySelectorAll('.search-highlight-text')
      highlightedSpans.forEach(span => {
        const parent = span.parentNode
        if (parent) {
          parent.replaceChild(document.createTextNode(span.textContent || ''), span)
          parent.normalize()
        }
      })
    }
  }, [searchQuery, location.pathname, location.hash]) // Re-run when query or location changes

  // Navigate to selected result
  const navigateToResult = (index: number) => {
    if (index >= 0 && index < searchResults.length) {
      setSelectedResultIndex(index)
      handleSearchResultClick(searchResults[index].href)
    }
  }

  // Handle arrow key navigation
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (searchResults.length > 0 && selectedResultIndex < searchResults.length - 1) {
        // If no result is selected, start at first result (index 0)
        // Otherwise, move to next result
        const nextIndex = selectedResultIndex < 0 ? 0 : selectedResultIndex + 1
        setSelectedResultIndex(nextIndex)
        // Scroll selected result into view
        const resultElement = document.querySelector(`[data-result-index="${nextIndex}"]`)
        resultElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (searchResults.length > 0 && selectedResultIndex > 0) {
        const prevIndex = selectedResultIndex - 1
        setSelectedResultIndex(prevIndex)
        // Scroll selected result into view
        const resultElement = document.querySelector(`[data-result-index="${prevIndex}"]`)
        resultElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    } else if (e.key === 'Enter' && selectedResultIndex >= 0 && selectedResultIndex < searchResults.length) {
      e.preventDefault()
      navigateToResult(selectedResultIndex)
    } else if (e.key === 'Escape') {
      setSearchOpen(false)
      setSearchQuery('')
      setSelectedResultIndex(-1)
    }
  }

  // Clear search - this is the only way to clear highlights
  const handleClearSearch = () => {
    setSearchQuery('')
    setSelectedResultIndex(-1)
    setSearchOpen(false)
    // Highlights will be cleared by useEffect
  }

  const handleSearchResultClick = (href: string) => {
    // Close the search dropdown but keep the query active so highlights persist
    setSearchOpen(false)
    // Don't clear searchQuery - keep it active so highlights remain on the page
    setSelectedResultIndex(-1)
    if (href.startsWith('#')) {
      scrollToSection(href, navigate, location)
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
      scrollToSection(sectionId, navigate, location)
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
                <motion.a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('#home', navigate, location)
                    setSideMenuOpen(true)
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all flex-shrink-0 backdrop-blur-sm md:hidden shadow-md cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-900'
                    }`}
                  aria-label="Go to home and open menu"
                >
                  <HamburgerIcon />
                </motion.a>

                {/* Plus Button - Opens MegaMenu - Only visible on desktop (xl: 1280px+), completely hidden on mobile/tablet */}
                {onMegaMenuToggle && isDesktop && (
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onMegaMenuToggle()
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="hidden xl:flex p-1.5 sm:p-2 rounded-lg transition-all flex-shrink-0 items-center justify-center text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-300 dark:border-white/20"
                    aria-label="Open concept menu"
                    title="Learn about PBMP Concept"
                  >
                    <PlusIcon />
                  </motion.button>
                )}

                {/* Logo */}
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('#home', navigate, location)
                  }}
                  className="flex items-center hover:opacity-80 transition-opacity shrink-0 overflow-visible -mt-1 sm:-mt-2 md:-mt-3 ml-2 sm:ml-4 md:ml-6 lg:ml-8"
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
                  className="px-2 sm:px-3 md:px-5 py-1 sm:py-1.5 md:py-2 bg-cta-green-500/90 hover:bg-cta-green-600 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-cta-green-900/20 whitespace-nowrap"
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

                {/* Search - Visible on all screen sizes, expands inline */}
                <div 
                  className="relative" 
                  ref={searchRef}
                  onMouseEnter={() => {
                    // Only auto-open on hover for desktop (md and above)
                    if (window.innerWidth >= 768) {
                      setSearchOpen(true)
                    }
                  }}
                  onMouseLeave={() => {
                    // Only auto-close on hover for desktop (md and above)
                    if (window.innerWidth >= 768) {
                      setSearchOpen(false)
                    }
                  }}
                >
                  <motion.button
                    onClick={() => {
                      // Toggle search on mobile
                      if (window.innerWidth < 768) {
                        setSearchOpen(!searchOpen)
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
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
                        animate={{ 
                          opacity: 1, 
                          x: 0, 
                          width: isMobile ? 'calc(100vw - 2rem)' : 400
                        }}
                        exit={{ opacity: 0, x: 20, width: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`glass backdrop-blur-xl rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden z-[100] ${
                          isMobile 
                            ? 'fixed right-4 left-4 top-20 bg-white dark:bg-slate-800' 
                            : 'absolute right-0 top-0 md:top-full md:mt-2 bg-white/95 dark:bg-slate-800/95 md:w-[400px]'
                        }`}
                        style={isMobile ? {
                          backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)'
                        } : undefined}
                      >
                        <div className="relative flex items-center">
                          <div className="absolute left-4 text-gray-400 dark:text-gray-500 pointer-events-none">
                            <SearchIcon />
                          </div>
                          <input
                            type="text"
                            placeholder="Type to search"
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value)
                              setSelectedResultIndex(-1)
                            }}
                            onKeyDown={handleSearchKeyDown}
                            autoFocus
                            className={`w-full pl-12 ${isMobile ? 'pr-20' : 'pr-32'} py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-0 border-0`}
                          />
                          {/* Action buttons */}
                          {searchQuery && (
                            <div className="absolute right-2 flex items-center gap-1">
                              {/* Up Arrow - Previous */}
                              <motion.button
                                onClick={() => {
                                  if (searchResults.length > 0 && selectedResultIndex > 0) {
                                    const prevIndex = selectedResultIndex - 1
                                    setSelectedResultIndex(prevIndex)
                                    const resultElement = document.querySelector(`[data-result-index="${prevIndex}"]`)
                                    resultElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                                  }
                                }}
                                whileHover={selectedResultIndex > 0 ? { scale: 1.1 } : {}}
                                whileTap={selectedResultIndex > 0 ? { scale: 0.9 } : {}}
                                disabled={selectedResultIndex <= 0 || searchResults.length === 0}
                                className={`p-1.5 rounded transition-colors ${
                                  selectedResultIndex > 0 && searchResults.length > 0
                                    ? 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer'
                                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50'
                                }`}
                                title="Previous result"
                              >
                                <ChevronUpIcon />
                              </motion.button>
                              {/* Down Arrow - Next */}
                              <motion.button
                                onClick={() => {
                                  if (searchResults.length > 0 && selectedResultIndex < searchResults.length - 1) {
                                    const nextIndex = selectedResultIndex + 1
                                    setSelectedResultIndex(nextIndex)
                                    const resultElement = document.querySelector(`[data-result-index="${nextIndex}"]`)
                                    resultElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                                  }
                                }}
                                whileHover={selectedResultIndex < searchResults.length - 1 ? { scale: 1.1 } : {}}
                                whileTap={selectedResultIndex < searchResults.length - 1 ? { scale: 0.9 } : {}}
                                disabled={selectedResultIndex >= searchResults.length - 1 || searchResults.length === 0}
                                className={`p-1.5 rounded transition-colors ${
                                  selectedResultIndex < searchResults.length - 1 && searchResults.length > 0
                                    ? 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer'
                                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50'
                                }`}
                                title="Next result"
                              >
                                <ChevronDownIcon />
                              </motion.button>
                              {/* Clear Button */}
                              <motion.button
                                onClick={handleClearSearch}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                title="Clear search"
                              >
                                <ClearIcon />
                              </motion.button>
                            </div>
                          )}
                        </div>
                        {searchQuery && (
                          <div className={`max-h-64 overflow-y-auto border-t border-gray-200 dark:border-gray-700 search-results-scrollbar ${isMobile ? 'pr-2' : 'pr-2'}`}>
                            {searchResults.length > 0 ? (
                              <>
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">
                                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                                </div>
                                {searchResults.map((result, idx) => (
                                  <motion.div
                                    key={`${result.type}-${result.href}-${idx}`}
                                    data-result-index={idx}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    onClick={() => navigateToResult(idx)}
                                    className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${
                                      selectedResultIndex === idx
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700'
                                        : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                                    }`}
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
                                            {highlightText(result.title, searchQuery)}
                                          </span>
                                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 uppercase">
                                            {result.type}
                                          </span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                                          {highlightText(result.description, searchQuery)}
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
                <div className="px-6 py-6 border-b border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-4">
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

              {/* Menu Items - No scrollbar, all items visible */}
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
                  {filteredNavItems.length > 0 ? (
                    filteredNavItems.map((item, idx) => {
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
                              setSideMenuOpen(false)
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

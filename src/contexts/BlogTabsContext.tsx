import { createContext, useContext, useState, useCallback, useRef, useMemo, ReactNode } from 'react'

export type BlogTabId = 'intro' | 'rise' | 'flexibility' | 'finland' | 'future' | 'authors' | 'related'

export const BLOG_TABS: { id: BlogTabId; label: string }[] = [
  { id: 'intro', label: 'Overview' },
  { id: 'rise', label: 'Market Value Cannibalization' },
  { id: 'flexibility', label: 'Systemic Flexibility' },
  { id: 'finland', label: 'Finland Case' },
  { id: 'future', label: 'Global Next Steps' },
  { id: 'authors', label: 'Authors' },
  { id: 'related', label: 'Related Content' },
]

export interface BlogTabsState {
  activeTab: BlogTabId
  setActiveTab: (id: BlogTabId) => void
  scrollToSection: (id: BlogTabId) => void
  registerScrollToSection: (fn: (id: BlogTabId) => void) => () => void
}

const BlogTabsContext = createContext<BlogTabsState | null>(null)

export function BlogTabsProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<BlogTabId>('intro')
  const scrollFnRef = useRef<((id: BlogTabId) => void) | null>(null)

  const registerScrollToSection = useCallback((fn: (id: BlogTabId) => void) => {
    scrollFnRef.current = fn
    return () => {
      scrollFnRef.current = null
    }
  }, [])

  const scrollToSection = useCallback((id: BlogTabId) => {
    setActiveTab(id)
    scrollFnRef.current?.(id)
  }, [])

  const value = useMemo<BlogTabsState>(
    () => ({
      activeTab,
      setActiveTab,
      scrollToSection,
      registerScrollToSection,
    }),
    [activeTab, scrollToSection, registerScrollToSection]
  )

  return (
    <BlogTabsContext.Provider value={value}>
      {children}
    </BlogTabsContext.Provider>
  )
}

export function useBlogTabs(): BlogTabsState | null {
  return useContext(BlogTabsContext)
}

import { createContext, useContext, useState, ReactNode } from 'react'

interface GlobalCTABarContextType {
  isVisible: boolean
  setIsVisible: (visible: boolean) => void
}

const GlobalCTABarContext = createContext<GlobalCTABarContextType | undefined>(undefined)

export function GlobalCTABarProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return true
    return !window.matchMedia('(max-width: 767px)').matches
  })

  return (
    <GlobalCTABarContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </GlobalCTABarContext.Provider>
  )
}

export function useGlobalCTABar() {
  const context = useContext(GlobalCTABarContext)
  if (context === undefined) {
    throw new Error('useGlobalCTABar must be used within a GlobalCTABarProvider')
  }
  return context
}

import React, { createContext, useContext, useState, ReactNode } from 'react'
import ComingSoonModal from '../components/ComingSoonModal'

interface ComingSoonContextType {
  showComingSoon: () => void
}

const ComingSoonContext = createContext<ComingSoonContextType | undefined>(undefined)

export const useComingSoon = () => {
  const context = useContext(ComingSoonContext)
  if (!context) {
    throw new Error('useComingSoon must be used within ComingSoonProvider')
  }
  return context
}

interface ComingSoonProviderProps {
  children: ReactNode
}

export const ComingSoonProvider: React.FC<ComingSoonProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const showComingSoon = () => {
    setIsOpen(true)
  }

  return (
    <ComingSoonContext.Provider value={{ showComingSoon }}>
      {children}
      <ComingSoonModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </ComingSoonContext.Provider>
  )
}

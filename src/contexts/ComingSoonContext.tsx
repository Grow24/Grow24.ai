import React, { createContext, useContext, useState, ReactNode } from 'react'
import ComingSoonModal from '../components/ComingSoonModal'

interface ComingSoonContextType {
  showComingSoon: (source?: string, title?: string, message?: string) => void
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
  const [source, setSource] = useState<string>('general')
  const [title, setTitle] = useState<string>('Get Started with Grow24.ai')
  const [message, setMessage] = useState<string>('Stay updated on our latest features and product updates. We\'ll keep you informed!')

  const showComingSoon = (modalSource?: string, modalTitle?: string, modalMessage?: string) => {
    setSource(modalSource || 'general')
    setTitle(modalTitle || 'Get Started with Grow24.ai')
    setMessage(modalMessage || 'Stay updated on our latest features and product updates. We\'ll keep you informed!')
    setIsOpen(true)
  }

  return (
    <ComingSoonContext.Provider value={{ showComingSoon }}>
      {children}
      <ComingSoonModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        source={source}
        title={title}
        message={message}
      />
    </ComingSoonContext.Provider>
  )
}

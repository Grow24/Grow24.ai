import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import LoginModal from '../components/LoginModal'

interface LoginModalContextType {
  openLoginModal: () => void
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined)

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const openLoginModal = useCallback(() => setIsOpen(true), [])

  return (
    <LoginModalContext.Provider value={{ openLoginModal }}>
      {children}
      <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </LoginModalContext.Provider>
  )
}

export function useLoginModal(): LoginModalContextType {
  const context = useContext(LoginModalContext)
  if (context === undefined) {
    return { openLoginModal: () => {} }
  }
  return context
}

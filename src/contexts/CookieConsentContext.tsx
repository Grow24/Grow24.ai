import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getStoredPreferences, CookiePreferences } from '../components/CookiePreferencesModal'

interface CookieConsentContextType {
  hasConsented: boolean
  preferences: CookiePreferences | null
  refreshConsent: () => void
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined)

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext)
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider')
  }
  return context
}

interface CookieConsentProviderProps {
  children: ReactNode
}

export const CookieConsentProvider: React.FC<CookieConsentProviderProps> = ({ children }) => {
  const [hasConsented, setHasConsented] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null)

  const refreshConsent = () => {
    const stored = getStoredPreferences()
    const consentGiven = localStorage.getItem('grow24_cookie_consent_given')
    setHasConsented(!!(stored || consentGiven))
    setPreferences(stored)
  }

  useEffect(() => {
    refreshConsent()
  }, [])

  return (
    <CookieConsentContext.Provider value={{ hasConsented, preferences, refreshConsent }}>
      {children}
    </CookieConsentContext.Provider>
  )
}

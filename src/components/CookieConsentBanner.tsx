import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getStoredPreferences, setStoredPreferences, CookiePreferences, defaultPreferences } from './CookiePreferencesModal'
import { CookiePreferencesModal } from './CookiePreferencesModal'

const CONSENT_STORAGE_KEY = 'grow24_cookie_consent_given'

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Ensure we're on the client side
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Only check after component is mounted (client-side)
    if (!isMounted) return

    const checkAndShowBanner = () => {
      try {
        // Check if localStorage is available
        if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
          // If localStorage is not available, show the banner
          setIsVisible(true)
          return
        }

        // Check if user has already given consent
        const consentGiven = localStorage.getItem(CONSENT_STORAGE_KEY)
        const hasPreferences = getStoredPreferences() !== null
        
        // Show banner if consent hasn't been given
        if (!consentGiven && !hasPreferences) {
          setIsVisible(true)
        }
      } catch (error) {
        // If localStorage is not available or there's an error, show the banner anyway
        console.warn('Error checking cookie consent, showing banner:', error)
        setIsVisible(true)
      }
    }

    // Small delay to ensure smooth animation and DOM is ready
    const timer = setTimeout(checkAndShowBanner, 300)
    return () => clearTimeout(timer)
  }, [isMounted])

  const handleAcceptAll = () => {
    try {
      const prefs: CookiePreferences = {
        ...defaultPreferences,
        performance: true,
        advertising: true,
      }
      setStoredPreferences(prefs)
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(CONSENT_STORAGE_KEY, 'true')
      }
      setIsVisible(false)
    } catch (error) {
      console.warn('Error saving cookie consent:', error)
      setIsVisible(false)
    }
  }

  const handleEssentialOnly = () => {
    try {
      const prefs: CookiePreferences = {
        ...defaultPreferences,
        performance: false,
        advertising: false,
      }
      setStoredPreferences(prefs)
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(CONSENT_STORAGE_KEY, 'true')
      }
      setIsVisible(false)
    } catch (error) {
      console.warn('Error saving cookie consent:', error)
      setIsVisible(false)
    }
  }

  const handleViewDetails = () => {
    setShowDetailsModal(true)
  }

  const handleDetailsClose = () => {
    setShowDetailsModal(false)
    // After closing details modal, check if consent was given
    // Use setTimeout to ensure localStorage is updated
    setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          const consentGiven = localStorage.getItem(CONSENT_STORAGE_KEY)
          const hasPreferences = getStoredPreferences() !== null
          if (consentGiven || hasPreferences) {
            setIsVisible(false)
          }
        }
      } catch (error) {
        // Ignore errors
      }
    }, 100)
  }

  // Listen for storage changes to hide banner when consent is given from other components
  useEffect(() => {
    if (!isMounted) return

    const handleStorageChange = () => {
      try {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          const consentGiven = localStorage.getItem(CONSENT_STORAGE_KEY)
          const hasPreferences = getStoredPreferences() !== null
          if (consentGiven || hasPreferences) {
            setIsVisible(false)
          }
        }
      } catch (error) {
        // Ignore localStorage errors
      }
    }

    // Check periodically (in case storage event doesn't fire)
    const interval = setInterval(handleStorageChange, 500)
    
    // Also listen for storage events (works across tabs)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [isMounted])

  // Allow other parts of the app (e.g. Privacy Policy page) to open the cookie preferences modal
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOpenPreferences = () => {
      setShowDetailsModal(true)
      setIsVisible(true)
    }

    window.addEventListener('open-cookie-preferences', handleOpenPreferences)

    return () => {
      window.removeEventListener('open-cookie-preferences', handleOpenPreferences)
    }
  }, [])

  // Don't render until mounted (prevents SSR issues)
  if (!isMounted) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-sm"
              aria-hidden="true"
              onClick={() => setIsVisible(false)}
            />
            
            {/* Cookie Consent Modal - Clean Professional Design */}
            <div className="fixed inset-0 z-[91] flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cookie-consent-title"
                className="w-full max-w-[640px] max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 min-h-0 px-6 sm:px-8 md:px-10 py-6 sm:py-8">
                  {/* Title */}
                  <h2
                    id="cookie-consent-title"
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight"
                  >
                    We value your privacy
                  </h2>

                  {/* Description */}
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mb-5 sm:mb-6 md:mb-8 leading-relaxed">
                    Please provide your consent for cookie usage on our website. We use the following cookie types:
                  </p>

                  {/* Cookie Types List */}
                  <div className="space-y-4 sm:space-y-5 md:space-y-6">
                    <div className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      <span className="font-semibold text-gray-900 dark:text-white">Essential Cookies</span> are necessary for the site to function and are always active. These cookies also remember the choices you make and provide a secure and enhanced experience.
                    </div>
                    <div className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      <span className="font-semibold text-gray-900 dark:text-white">Performance Cookies</span> are used to provide a better user experience on the site, such as by measuring interactions with particular content so we can continue to offer you more relevant articles.
                    </div>
                    <div className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      <span className="font-semibold text-gray-900 dark:text-white">Advertising or Targeting Cookies</span> on our site don't store any of your direct personal information but identify a unique browser or device, and are used to potentially surface relevant material from other sites, and are primarily used by select social media and other partners.
                    </div>
                  </div>
                </div>

                {/* Fixed Footer with Actions */}
                <div className="flex-shrink-0 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 px-6 sm:px-8 md:px-10 py-4 sm:py-5">
                  {/* Buttons Row */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <button
                      type="button"
                      onClick={handleAcceptAll}
                      className="flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs sm:text-sm md:text-base rounded-lg transition-all duration-200 uppercase tracking-wider shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                      Accept All and Close
                    </button>
                    <button
                      type="button"
                      onClick={handleEssentialOnly}
                      className="flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs sm:text-sm md:text-base rounded-lg transition-all duration-200 uppercase tracking-wider shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                      Essential Cookies Only
                    </button>
                  </div>

                  {/* Links Row */}
                  <div className="flex flex-row items-center justify-center sm:justify-end gap-4 sm:gap-5 md:gap-6">
                    <button
                      type="button"
                      onClick={handleViewDetails}
                      className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors duration-200 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
                    >
                      View Details
                    </button>
                    <a
                      href="/privacy-policy"
                      className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors duration-200 uppercase tracking-wider underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
                    >
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Cookie Preferences Details Modal */}
      <CookiePreferencesModal
        isOpen={showDetailsModal}
        onClose={handleDetailsClose}
      />
    </>
  )
}

export default CookieConsentBanner

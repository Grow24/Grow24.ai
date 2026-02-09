import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'grow24_cookie_preferences'

export type CookieCategory = 'essential' | 'performance' | 'advertising'

export interface CookiePreferences {
  essential: boolean // always true, not user-editable
  performance: boolean
  advertising: boolean
  updatedAt: string
}

export const defaultPreferences: CookiePreferences = {
  essential: true,
  performance: true,
  advertising: true,
  updatedAt: new Date().toISOString(),
}

export function getStoredPreferences(): CookiePreferences | null {
  try {
    // Check if localStorage is available
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null
    }
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CookiePreferences
    return {
      essential: true,
      performance: parsed.performance ?? true,
      advertising: parsed.advertising ?? true,
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export function setStoredPreferences(prefs: CookiePreferences): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prefs, updatedAt: new Date().toISOString() }))
      // Mark consent as given when preferences are set
      localStorage.setItem('grow24_cookie_consent_given', 'true')
    }
  } catch (error) {
    console.warn('Failed to save cookie preferences:', error)
  }
}

interface CookiePreferencesModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CookiePreferencesModal: React.FC<CookiePreferencesModalProps> = ({ isOpen, onClose }) => {
  const [performance, setPerformance] = useState(true)
  const [advertising, setAdvertising] = useState(true)

  useEffect(() => {
    if (!isOpen) return
    const stored = getStoredPreferences()
    setPerformance(stored?.performance ?? true)
    setAdvertising(stored?.advertising ?? true)
  }, [isOpen])

  const handleAcceptAll = () => {
    const prefs: CookiePreferences = { ...defaultPreferences, performance: true, advertising: true }
    setStoredPreferences(prefs)
    setPerformance(true)
    setAdvertising(true)
    onClose()
  }

  const handleRejectNonEssential = () => {
    const prefs: CookiePreferences = { ...defaultPreferences, performance: false, advertising: false }
    setStoredPreferences(prefs)
    setPerformance(false)
    setAdvertising(false)
    onClose()
  }

  const handleSave = () => {
    const prefs: CookiePreferences = {
      essential: true,
      performance,
      advertising,
      updatedAt: new Date().toISOString(),
    }
    setStoredPreferences(prefs)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[80] backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed left-4 right-4 top-1/2 -translate-y-1/2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 w-auto sm:w-full max-w-lg max-h-[calc(100vh-2rem)] sm:max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 z-[81]"
          >
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h2 id="cookie-preferences-title" className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white pr-2">
                  Cookie Preferences
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                We use cookies and similar technologies to help personalize content and improve your experience. You can manage your preferences below or withdraw consent at any time.
              </p>

              {/* Essential Cookies */}
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 py-3 sm:py-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Essential Cookies</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Required for the site to function. These cannot be disabled.
                  </p>
                </div>
                <span className="flex-shrink-0 px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-medium rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 whitespace-nowrap">
                  Always on
                </span>
              </div>

              {/* Performance & Functionality */}
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 py-3 sm:py-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Performance Cookies</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Help us understand how you use the site and improve your experience, such as by measuring interactions with particular content so we can continue to offer you more relevant articles.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 self-start sm:self-auto">
                  <input
                    type="checkbox"
                    checked={performance}
                    onChange={(e) => setPerformance(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-slate-600 peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              {/* Advertising or Targeting Cookies */}
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 py-3 sm:py-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Advertising or Targeting Cookies</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    These cookies don't store any of your direct personal information but identify a unique browser or device, and are used to potentially surface relevant material from other sites, and are primarily used by select social media and other partners.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 self-start sm:self-auto">
                  <input
                    type="checkbox"
                    checked={advertising}
                    onChange={(e) => setAdvertising(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-slate-600 peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={handleRejectNonEssential}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
                >
                  Reject Non-Essential
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CookiePreferencesModal

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CookiePreferencesModal } from './CookiePreferencesModal'

/**
 * Minimal footer bar (BCG-style) fixed at the bottom of the viewport.
 * Shows "Cookie Preferences" link; becomes more visible when user scrolls near the bottom.
 */
export const CookieFooter: React.FC = () => {
  const [cookieModalOpen, setCookieModalOpen] = useState(false)
  const [isNearBottom, setIsNearBottom] = useState(false)

  useEffect(() => {
    const checkScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      // Consider "near bottom" when within ~200px of bottom or past 50% scroll
      setIsNearBottom(docHeight <= 0 || scrollTop >= docHeight - 200 || scrollTop >= docHeight * 0.5)
    }

    checkScroll()
    window.addEventListener('scroll', checkScroll, { passive: true })
    return () => window.removeEventListener('scroll', checkScroll)
  }, [])

  return (
    <>
      <footer
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm"
        role="contentinfo"
      >
        <AnimatePresence initial={false}>
          <motion.div
            initial={{ opacity: 0.85 }}
            animate={{ opacity: isNearBottom ? 1 : 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-full px-4 sm:px-6 md:px-8 py-3 flex items-center justify-center sm:justify-between gap-4 flex-wrap"
          >
            <div className="flex items-center justify-center sm:justify-start gap-6 text-sm">
              <button
                type="button"
                onClick={() => setCookieModalOpen(true)}
                className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors underline-offset-2 hover:underline"
              >
                Cookie Preferences
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 hidden sm:inline-flex items-center gap-1.5">
              © {new Date().getFullYear()}
              <img
                src="/grow24_ai.jpeg"
                alt="Grow24.ai"
                className="h-4 w-auto align-middle"
              />
            </p>
          </motion.div>
        </AnimatePresence>
      </footer>

      <CookiePreferencesModal isOpen={cookieModalOpen} onClose={() => setCookieModalOpen(false)} />
    </>
  )
}

export default CookieFooter

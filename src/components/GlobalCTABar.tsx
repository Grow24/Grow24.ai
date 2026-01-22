import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComingSoon } from '../contexts/ComingSoonContext'

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const LightningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
)

export default function GlobalCTABar() {
  const [isVisible, setIsVisible] = useState(true)
  const { showComingSoon } = useComingSoon()

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between gap-6">
          {/* Icon + Message */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              <LightningIcon />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Harness the Power of AI</h3>
              <p className="text-emerald-100 text-sm">
                Join 10,000+ professionals transforming their growth journey
              </p>
            </div>
          </div>

          {/* Email Input + CTA */}
          <div className="flex items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white/50 transition-all w-64"
            />
            <button 
              onClick={showComingSoon}
              className="px-6 py-2.5 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors whitespace-nowrap"
            >
              Subscribe Free
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

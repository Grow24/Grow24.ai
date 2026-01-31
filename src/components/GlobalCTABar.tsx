import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitLead } from '../services/leadService'
import { useGlobalCTABar } from '../contexts/GlobalCTABarContext'

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
  const { isVisible, setIsVisible } = useGlobalCTABar()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !email.includes('@')) {
      setMessage('Please enter a valid email address')
      setIsSuccess(false)
      return
    }

    setIsSubmitting(true)
    setMessage('')

    const result = await submitLead({
      email: email.trim(),
      source: 'cta-bar',
    })

    setMessage(result.message)
    setIsSuccess(result.success)
    setIsSubmitting(false)

    if (result.success) {
      setEmail('')
      // Optionally close the bar after success
      setTimeout(() => {
        setIsVisible(false)
        setMessage('')
        setIsSuccess(false)
      }, 3000)
    }
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-r from-cta-green-500 via-cta-green-600 to-cta-green-700 shadow-2xl pb-safe"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3 sm:py-4 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            {/* Icon + Message */}
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                <LightningIcon />
              </div>
              <div className="flex-1 sm:flex-none min-w-0">
                <h3 className="text-white font-bold text-base sm:text-lg">Harness the Power of AI</h3>
                <p className="text-white/90 text-xs sm:text-sm">
                  Join 10,000+ professionals transforming their growth journey
                </p>
              </div>
            </div>

            {/* Email Input + CTA */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white/50 transition-all sm:w-64 disabled:opacity-50 text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-cta-green-600 font-semibold rounded-lg hover:bg-cta-green-50 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isSubmitting ? 'Submitting...' : isSuccess ? '✓ Subscribed!' : 'Subscribe Free'}
              </button>
            </form>

            {/* Close Button - Always visible above widgets */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-colors text-white z-[60]"
              aria-label="Close"
              disabled={isSubmitting}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`absolute bottom-full mb-2 right-0 px-3 py-1.5 rounded text-xs whitespace-nowrap ${isSuccess
              ? 'bg-cta-green-500/90 text-white'
              : 'bg-red-500/90 text-white'
              }`}>
              {message}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

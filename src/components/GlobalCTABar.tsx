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
      pageTitle: 'Newsletter Subscription - Global CTA Bar',
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
        className="fixed left-0 right-0 bottom-0 z-30 bg-gradient-to-r from-cta-green-500 via-cta-green-600 to-cta-green-700 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 md:gap-8">
            {/* Message */}
            <div className="min-w-0 flex-1 pr-2 sm:pr-0">
              <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl leading-tight mb-1 sm:mb-1.5">Harness the Power of AI</h3>
              <p className="text-white/90 text-sm sm:text-base md:text-lg leading-snug">
                in your journey of Personal & Business Transformation.
              </p>
            </div>

            {/* Email Input + Subscribe + Close Button - always in one row */}
            <div className="flex flex-row flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto flex-shrink-0 min-w-0">
              <form onSubmit={handleSubscribe} className="flex flex-row flex-nowrap items-center gap-2 sm:gap-3 flex-1 sm:flex-initial min-w-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                  className="min-w-0 flex-1 sm:flex-none sm:w-56 md:w-64 max-w-[140px] sm:max-w-none px-4 py-2.5 sm:py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 text-sm sm:text-base"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-cta-green-600 font-semibold rounded-lg hover:bg-cta-green-50 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSubmitting ? '...' : isSuccess ? '✓ Subscribed!' : 'Subscribe Free'}
                </button>
              </form>
              {/* Close Button - aligned in row with form */}
              <button
                onClick={() => setIsVisible(false)}
                className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-white self-center"
                aria-label="Close"
                disabled={isSubmitting}
              >
                <CloseIcon />
              </button>
            </div>
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

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-5 md:pt-6 pb-4 sm:pb-5 md:pb-6 relative">
          {/* X button - top-right corner of the rectangle */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-white"
            aria-label="Close"
            disabled={isSubmitting}
          >
            <CloseIcon />
          </button>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6 md:gap-8 pr-10 sm:pr-12">
            {/* Left: bullet points */}
            <ul className="text-white text-xs sm:text-sm leading-relaxed space-y-1 min-w-0 flex-shrink-0 lg:max-w-[280px]">
              <li>-the AI &amp; Digitalization wave is here &amp; is impacting my area</li>
              <li>-a place where the latest tested concepts are embedded</li>
              <li>-I can Apply ready-made Templates for my Areas, on my Data</li>
            </ul>

            {/* Middle: heading + subtext */}
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl leading-tight mb-0.5 sm:mb-1">Harness the Power of AI</h3>
              <p className="text-white/95 text-sm sm:text-base md:text-lg leading-snug">
                in your journey of Personal &amp; Business Transformation.
              </p>
            </div>

            {/* Right: email + Subscribe Free */}
            <div className="w-full lg:w-auto flex-shrink-0 min-w-0">
              <form onSubmit={handleSubscribe} className="flex flex-row flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto min-w-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                  className="min-w-0 flex-1 sm:flex-none sm:w-52 md:w-60 max-w-[140px] sm:max-w-none px-4 py-2.5 sm:py-3 rounded-lg bg-cta-green-400/80 dark:bg-cta-green-500/80 border border-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/40 transition-all disabled:opacity-50 text-sm sm:text-base"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 bg-cta-green-400/90 hover:bg-cta-green-400 text-white font-semibold rounded-lg transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base border border-white/20"
                >
                  {isSubmitting ? '...' : isSuccess ? '✓ Subscribed!' : 'Subscribe Free'}
                </button>
              </form>
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

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
        className="fixed left-0 right-0 bottom-0 z-30 bg-gradient-to-r from-cta-green-500 via-cta-green-600 to-cta-green-700 shadow-2xl border-t border-white/10 relative"
      >
        {/* X button - top-right corner of the bar (positioned relative to full bar for correct laptop alignment) */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 md:top-3 md:right-4 w-8 h-8 flex items-center justify-center hover:bg-white/15 rounded-lg transition-colors text-white/95 hover:text-white z-10"
          aria-label="Close"
          disabled={isSubmitting}
        >
          <CloseIcon />
        </button>

        <div className="max-w-7xl mx-auto pl-0 pr-4 sm:pl-1 sm:pr-6 md:pl-2 md:pr-8 py-3 sm:py-3.5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4 md:gap-6 pr-10 sm:pr-11">
            {/* Left: three points with bullet points, one per line */}
            <ul className="text-white text-xs sm:text-sm leading-snug space-y-0.5 min-w-0 flex-shrink-0 list-disc list-inside -ml-0.5 pl-0.5">
              <li className="whitespace-nowrap">the AI &amp; Digitalization wave is here &amp; is impacting my area</li>
              <li className="whitespace-nowrap">a place where the latest tested concepts are embedded</li>
              <li className="whitespace-nowrap">I can apply ready-made templates for my areas, on my data</li>
            </ul>

            {/* Middle: heading + subtext */}
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-bold text-base sm:text-lg md:text-xl leading-tight mb-0.5">Harness the Power of AI</h3>
              <p className="text-white/95 text-xs sm:text-sm md:text-base leading-snug">
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
                  className="min-w-0 flex-1 sm:flex-none sm:w-48 md:w-56 max-w-[140px] sm:max-w-none px-3 py-2 sm:py-2.5 rounded-lg bg-white/15 border border-white/25 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 transition-all disabled:opacity-50 text-sm"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/20 hover:bg-white/25 text-white font-semibold rounded-lg border border-white/30 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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

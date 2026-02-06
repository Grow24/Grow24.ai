import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitLead } from '../services/leadService'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
  source?: string // e.g., 'get-demo', 'start-free-trial'
  title?: string
  message?: string
  metadata?: Record<string, any> // Additional metadata to include in email
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ 
  isOpen, 
  onClose, 
  source = 'general',
  title = 'Get Started with Grow24.ai',
  message = 'Stay updated on our latest features and product updates. We\'ll keep you informed!',
  metadata = {}
}) => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [designation, setDesignation] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Check if this is the watch-concept modal
  const isWatchConcept = source === 'watch-concept'
  // Check if this is the free trial form
  const isFreeTrialForm = source === 'start-free-trial'

  // Cleanup video when modal closes or component unmounts
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [isOpen])

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation for free trial form
    if (isFreeTrialForm) {
      if (!name.trim()) {
        setSubmitMessage('Please enter your name')
        setIsSuccess(false)
        return
      }
      if (!designation.trim()) {
        setSubmitMessage('Please enter your designation')
        setIsSuccess(false)
        return
      }
      if (!email.trim() || !email.includes('@')) {
        setSubmitMessage('Please enter a valid email address')
        setIsSuccess(false)
        return
      }
      if (!phone.trim() || phone.trim().length < 10) {
        setSubmitMessage('Please enter a valid phone number (minimum 10 digits)')
        setIsSuccess(false)
        return
      }
    } else {
      // Standard validation for other forms
      if (!email.trim() || !email.includes('@')) {
        setSubmitMessage('Please enter a valid email address')
        setIsSuccess(false)
        return
      }
    }

    console.log('📝 Form submitted with source:', source)
    setIsSubmitting(true)
    setSubmitMessage('')

    const result = await submitLead({
      email: email.trim(),
      name: name.trim() || undefined,
      designation: designation.trim() || undefined,
      phone: phone.trim() || undefined,
      source,
      pageTitle: title, // Use form title as email subject
      metadata: {
        ...metadata,
        formTitle: title,
        formMessage: message,
      },
    })

    console.log('📊 Submission result:', result)
    
    // For free trial, show custom success message
    if (isFreeTrialForm && result.success) {
      setSubmitMessage('Thanks. We will get back.')
    } else {
      setSubmitMessage(result.message)
    }
    
    setIsSuccess(result.success)
    setIsSubmitting(false)

    if (result.success) {
      // Clear form and close after 3 seconds
      setTimeout(() => {
        setEmail('')
        setName('')
        setDesignation('')
        setPhone('')
        setSubmitMessage('')
        setIsSuccess(false)
        onClose()
      }, 3000)
    }
  }

  const handleClose = () => {
    // Pause and reset video when closing modal
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    
    if (!isSubmitting) {
      setEmail('')
      setName('')
      setDesignation('')
      setPhone('')
      setSubmitMessage('')
      setIsSuccess(false)
      onClose()
    }
  }

  // For Watch Concept - render video player
  if (isWatchConcept) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            />
            
            {/* Video Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full p-4 relative">
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Video Player */}
                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                  <video 
                    ref={videoRef}
                    controls 
                    className="w-full h-full"
                    poster="/video-thumbnail.jpg"
                  >
                    <source src="/WhatsApp Video 2026-02-05 at 12.42.46 PM.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                <div className="text-center mt-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Grow24.ai Concept
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Discover how our platform transforms personal and business management
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
              {/* Close Button */}
              {!isSubmitting && (
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isSuccess 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                    : 'bg-emerald-100 dark:bg-emerald-900/30'
                }`}>
                  {isSuccess ? (
                    <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Content */}
              {isSuccess ? (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Thank You!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {submitMessage || 'We\'ve received your information and will keep you updated.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {message}
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isFreeTrialForm ? (
                      <>
                        {/* Free Trial Form - All fields required */}
                        <div>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name *"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder="Your Designation *"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your Email Address *"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Your Phone Number *"
                            required
                            minLength={10}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            disabled={isSubmitting}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Standard Form */}
                        <div>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name (optional)"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email address *"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            disabled={isSubmitting}
                          />
                        </div>
                      </>
                    )}

                    {submitMessage && (
                      <p className={`text-sm text-center ${
                        isSuccess 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {submitMessage}
                      </p>
                    )}

                    {/* Action Button */}
                    <div className="mt-6">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        className="w-full px-6 py-3 bg-cta-green-500 hover:bg-cta-green-600 text-white font-semibold rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting...' : 'Get Updates'}
                      </motion.button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ComingSoonModal

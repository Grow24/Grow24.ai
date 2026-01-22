import React, { useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'

// WhatsApp SVG Icon
const WhatsAppIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// Chatbot SVG Icon
const ChatbotIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l6-2c1.3.6 2.76.97 4.29.97 5.52 0 10-4.48 10-10S17.52 2 12 2m0 18c-1.41 0-2.73-.36-3.88-.97l-.28-.15-2.89.96.96-2.89-.15-.28C4.36 14.73 4 13.41 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8" />
  </svg>
)

// Send Button SVG
const SendIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22 2L11 13m11-11l-7 20-4-9-9-4 20-7z" />
  </svg>
)

interface FloatingWidgetProps {
  position: 'left' | 'right'
}

export const FloatingWhatsApp: React.FC<FloatingWidgetProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+919370239600'

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      className="fixed bottom-6 left-6 z-40"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-20 left-0 glass bg-white/10 rounded-2xl p-4 w-80 shadow-2xl mb-4"
          >
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">Chat with us!</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Hi there! 👋 How can we help you today?
            </p>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-2 rounded-lg bg-emerald-500 text-white text-center font-medium hover:bg-emerald-600 transition-colors duration-300"
            >
              Open WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <WhatsAppIcon />
      </motion.button>
    </motion.div>
  )
}

interface ChatIntent {
  id: string
  label: string
  icon: string
  message: string
}

const chatIntents: ChatIntent[] = [
  { 
    id: 'features', 
    label: 'Explore Features', 
    icon: '✨', 
    message: 'I\'d like to learn more about Grow24\'s features and capabilities.'
  },
  { 
    id: 'demo', 
    label: 'Watch Demo', 
    icon: '🎬', 
    message: 'I\'d like to see a product demonstration.'
  },
  { 
    id: 'sales', 
    label: 'Talk to Sales', 
    icon: '💼', 
    message: 'I\'d like to speak with someone from your sales team.'
  },
  { 
    id: 'support', 
    label: 'Get Support', 
    icon: '🆘', 
    message: 'I need help with something.'
  },
]

export const Chatbot: React.FC<FloatingWidgetProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: string; text: string }>>([
    {
      role: 'bot',
      text: 'Hello! How can I assist you today?',
    },
  ])
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null)

  const handleIntentSelect = (intentId: string) => {
    setSelectedIntent(intentId)
    const intent = chatIntents.find((i) => i.id === intentId)
    if (intent) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: intent.message },
        {
          role: 'bot',
          text: intent.id === 'features' 
            ? 'Great! Grow24 offers AI-powered goal setting, project management, and performance analytics. Would you like to know more about any specific feature?'
            : intent.id === 'demo'
            ? 'Perfect! I can schedule a personalized demo for you. Please share your email and preferred time.'
            : intent.id === 'sales'
            ? 'Excellent! Let me connect you with our sales team. They typically respond within 1 hour during business hours.'
            : 'I\'m here to help! Please describe the issue you\'re facing, and I\'ll assist you right away.',
        },
      ])
    }
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-20 right-0 glass bg-white/10 rounded-2xl p-6 w-96 shadow-2xl mb-4 flex flex-col max-h-96"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ChatbotIcon />
                <span>Grow24 Assistant</span>
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            {selectedIntent === null ? (
              <div className="flex-1 space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Select a topic to get started:
                </p>
                {chatIntents.map((intent) => (
                  <motion.button
                    key={intent.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleIntentSelect(intent.id)}
                    className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 transition-all duration-200 text-slate-700 dark:text-slate-200 text-sm font-medium"
                  >
                    <span className="mr-2">{intent.icon}</span>
                    {intent.label}
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                        msg.role === 'user'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white/10 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Input */}
            {selectedIntent !== null && (
              <div className="flex gap-2 pt-4 border-t border-white/20">
                <input
                  type="text"
                  placeholder="Your message..."
                  className="flex-1 px-3 py-2 rounded-lg glass bg-white/5 border border-white/20 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors duration-200">
                  <SendIcon />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Float Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
      >
        <ChatbotIcon />
        {!isOpen && (
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-emerald-300 opacity-30"
          />
        )}
      </motion.button>
    </motion.div>
  )
}

// LinkedIn Icon
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
)

// X/Twitter Icon
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

// YouTube Icon
const YouTubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

// Social Links Component
export const SocialLinks: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const socialLinks = [
    { id: 'linkedin', icon: LinkedInIcon, url: 'https://linkedin.com/company/grow24ai', label: 'LinkedIn', color: 'hover:bg-blue-600' },
    { id: 'x', icon: XIcon, url: 'https://x.com/grow24ai', label: 'X/Twitter', color: 'hover:bg-slate-800' },
    { id: 'youtube', icon: YouTubeIcon, url: 'https://youtube.com/@grow24ai', label: 'YouTube', color: 'hover:bg-red-600' },
  ]

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
      className="fixed bottom-28 left-20 z-40"
      drag
      dragElastic={0.2}
      dragMomentum={true}
      dragTransition={{ power: 0.3, restDelta: 10 }}
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
      whileDrag={{ cursor: 'grabbing' }}
      style={{ x, y }}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-16 right-0 flex flex-col gap-2 mb-2"
          >
            {socialLinks.map((social, idx) => (
              <motion.a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 ${social.color} dark:hover:bg-opacity-90 transition-all duration-200 group`}
              >
                <social.icon />
                <span className="text-sm font-medium whitespace-nowrap">{social.label}</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-grab active:cursor-grabbing"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 0 1 .5 9.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 8a6 6 0 0 0-.5 9.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="2"/>
          <path d="M12 10V8m0 8v-2" strokeLinecap="round"/>
        </svg>
      </motion.button>
    </motion.div>
  )
}

export default { FloatingWhatsApp, Chatbot, SocialLinks }

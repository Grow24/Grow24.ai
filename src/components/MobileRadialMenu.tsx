import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatbotContext } from '../contexts/ChatbotContext'
import { useGlobalCTABar } from '../contexts/GlobalCTABarContext'

const containerVariants = {
  closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  open: { transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
}
const itemVariants = {
  closed: { opacity: 0, y: -8, transition: { duration: 0.2 } },
  open: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

const PlusIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const CloseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const SocialIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8a6 6 0 0 1 .5 9.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 8a6 6 0 0 0-.5 9.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2" /><path d="M12 10V8m0 8v-2" strokeLinecap="round" />
  </svg>
)
const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)
const ChatbotIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
)
const HarnessAIIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l1.2 4.1L17 7l-3.8 1L12 12l-1.2-4-3.8-1 3.8-.9L12 2z" />
    <path d="M5 13l.8 2.7L8 16l-2.2.7L5 19l-.8-2.3L2 16l2.2-.3L5 13z" />
    <path d="M19 13l.8 2.7L22 16l-2.2.7L19 19l-.8-2.3L16 16l2.2-.3L19 13z" />
  </svg>
)

const socialLinks = [
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/company/personalandbusinessmgmtplatform/' },
  { id: 'x', label: 'X/Twitter', url: 'https://x.com/SandeepSethDS' },
  { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/channel/UC3iIvyLHuVbb0qEeKjEXKcQ' },
  { id: 'reddit', label: 'Reddit', url: 'https://www.reddit.com/user/SandeepSethDS/' },
]

export function MobileRadialMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [socialPanelOpen, setSocialPanelOpen] = useState(false)
  const [plusTop, setPlusTop] = useState<number | null>(null)
  const { openChatbot } = useChatbotContext()
  const { setIsVisible: setCtaVisible } = useGlobalCTABar()

  // Mobile: position plus icon to the left of the "Individual Growth Cycle" heading
  useEffect(() => {
    if (typeof window === 'undefined') return

    const updatePosition = () => {
      const heading = document.getElementById('growth-cycle-heading')
      if (!heading) return
      const rect = heading.getBoundingClientRect()
      // Move slightly more above the heading center
      const offset = rect.height / 2 - 50
      setPlusTop(rect.top + offset)
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('resize', updatePosition)
    }
  }, [])

  // Fallback position if heading isn't found yet
  const fallbackBottomClass = 'bottom-[240px]'
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+919370239600'
  const waUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`

  const items = [
    { id: 'social', label: 'Social', Icon: SocialIcon, color: 'from-slate-600 to-slate-800', action: () => { setIsOpen(false); setSocialPanelOpen(true) } },
    { id: 'whatsapp', label: 'WhatsApp', Icon: WhatsAppIcon, color: 'from-green-400 to-green-600', action: () => { setIsOpen(false); window.open(waUrl, '_blank') } },
    { id: 'chatbot', label: 'Chatbot', Icon: ChatbotIcon, color: 'from-purple-500 to-purple-700', action: () => { setIsOpen(false); openChatbot() } },
    { id: 'harness-ai', label: 'Harness the Power of AI', Icon: HarnessAIIcon, color: 'from-emerald-500 to-emerald-600', action: () => { setIsOpen(false); setCtaVisible(true) } },
  ]

  return (
    <>
      <div
        className={`md:hidden fixed left-4 z-50 transition-all duration-300 ${
          plusTop == null ? fallbackBottomClass : ''
        }`}
        style={plusTop != null ? { top: plusTop } : undefined}
        aria-label="Quick actions"
      >
        <div className="relative flex items-center">
          {/* Plus / Close FAB – position anchor (stays fixed) */}
          <motion.button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-100 text-slate-900 shadow-lg border border-slate-200/60 dark:border-slate-600 transition-all duration-300 touch-manipulation"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <CloseIcon /> : <PlusIcon />}
          </motion.button>

          {/* Radial menu items – absolutely positioned above the FAB so the FAB never moves */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 -top-2 flex flex-col items-center gap-2"
                variants={containerVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {items.map((item) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    variants={itemVariants}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-white shadow-lg touch-manipulation`}
                    onClick={item.action}
                    aria-label={item.label}
                  >
                    <item.Icon />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {socialPanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSocialPanelOpen(false)}
            className="md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 pb-8"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Follow us</h3>
                <button type="button" onClick={() => setSocialPanelOpen(false)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close">✕</button>
              </div>
              <div className="flex flex-col gap-2">
                {socialLinks.map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200 text-sm font-medium">
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileRadialMenu

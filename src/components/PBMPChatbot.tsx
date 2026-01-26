import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGlobalCTABar } from '../contexts/GlobalCTABarContext'
import Bubble from './pbmp/Bubble'
import PromptSuggestionsRow from './pbmp/PromptSuggestionsRow'
import LoadingBubbles from './pbmp/LoadingBubbles'
import AudioRecorder from './pbmp/AudioRecorder'
import { sendMessage } from '../services/chatService'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  bookingFlow?: boolean
  showDiagramPrompt?: boolean
  diagramType?: 'personal' | 'professional'
  showDiagram?: boolean
}

interface PBMPChatbotProps {
  position?: 'left' | 'right'
}

export default function PBMPChatbot({ position = 'right' }: PBMPChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInBookingFlow, setIsInBookingFlow] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { isVisible: isCTABarVisible } = useGlobalCTABar()

  const noMessages = messages.length === 0

  // Position above GlobalCTABar when visible, otherwise normal position
  // Increased offset to ensure widgets are fully above the GlobalCTABar
  const bottomPosition = isCTABarVisible 
    ? 'bottom-[220px] sm:bottom-[200px] md:bottom-6' 
    : 'bottom-6'

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current && !noMessages && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages, noMessages, isOpen])

  // Detect booking intent
  const detectBookingIntent = (text: string): boolean => {
    const BOOKING_KEYWORDS = ['book', 'meeting', 'schedule', 'demo', 'appointment', 'call', 'talk', 'speak']
    const lowerText = text.toLowerCase()
    return BOOKING_KEYWORDS.some(keyword => lowerText.includes(keyword))
  }

  // Detect diagram request
  const detectDiagramRequest = (text: string): 'personal' | 'professional' | null => {
    const lowerText = text.toLowerCase()
    const diagramKeywords = ['show diagram', 'show me diagram', 'diagram', 'visual', 'flow chart', 'flowchart']
    const hasDiagramRequest = diagramKeywords.some(kw => lowerText.includes(kw))
    
    if (hasDiagramRequest) {
      const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant' && m.diagramType)
      if (lastAssistantMsg?.diagramType) {
        return lastAssistantMsg.diagramType
      }
      if (lowerText.includes('personal') || lowerText.includes('individual')) return 'personal'
      if (lowerText.includes('professional') || lowerText.includes('business') || lowerText.includes('corporate')) return 'professional'
      return 'personal'
    }
    return null
  }

  const handlePrompt = async (promptText: string) => {
    if (promptText && promptText.trim() && !isLoading) {
      await handleSendMessage(promptText.trim())
    }
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading || isInBookingFlow) return

    const diagramRequest = detectDiagramRequest(text)
    if (diagramRequest) {
      const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant' && m.diagramType)
      if (lastAssistantMsg) {
        setMessages(prev => prev.map(msg => 
          msg.id === lastAssistantMsg.id 
            ? { ...msg, showDiagramPrompt: false, showDiagram: true }
            : msg
        ))
        return
      }
    }

    if (detectBookingIntent(text)) {
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text
      }
      const bookingMsg: Message = {
        id: `booking-${Date.now()}`,
        role: 'assistant',
        content: "I'd be happy to help you schedule a meeting! Let me collect a few details.",
        bookingFlow: true
      }
      setMessages(prev => [...prev, userMsg, bookingMsg])
      setIsInBookingFlow(true)
      return
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)
    setError(null)

    try {
      const response = await sendMessage([...messages, userMsg])

      const diagramPromptMatch = response.match(/\[DIAGRAM_PROMPT:(\w+)\]/)
      let cleanResponse = response
      let diagramType: 'personal' | 'professional' | undefined = undefined
      let showDiagramPrompt = false

      if (diagramPromptMatch) {
        const detectedType = diagramPromptMatch[1].toLowerCase()
        if (detectedType === 'personal' || detectedType === 'professional') {
          diagramType = detectedType
          showDiagramPrompt = true
          cleanResponse = response.replace(/\[DIAGRAM_PROMPT:\w+\]/g, '').trim()
        }
      }

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: cleanResponse,
        showDiagramPrompt,
        diagramType
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setInput('')
    setError(null)
    setIsInBookingFlow(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const textToSend = input.trim()
    if (textToSend) {
      handleSendMessage(textToSend)
      setInput('')
    }
  }

  const handleAudioRecorded = async (transcribedText: string) => {
    if (!transcribedText.trim() || isLoading || isInBookingFlow) return
    setInput(transcribedText)
  }

  const handleDiagramYes = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, showDiagramPrompt: false, showDiagram: true }
        : msg
    ))
  }

  const handleDiagramNo = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, showDiagramPrompt: false }
        : msg
    ))
  }

  const handleDiagramClose = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, showDiagram: false }
        : msg
    ))
  }

  const positionClass = position === 'left' ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
  const bottomClass = `${bottomPosition} transition-all duration-300`

  return (
    <>
      {/* Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className={`fixed ${bottomClass} ${positionClass} z-50 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center`}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-purple-300 opacity-30"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed ${bottomClass} ${positionClass} z-50 w-96 max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-3rem)] h-[600px] max-h-[85vh] sm:max-h-[90vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l6-2c1.3.6 2.76.97 4.29.97 5.52 0 10-4.48 10-10S17.52 2 12 2m0 18c-1.41 0-2.73-.36-3.88-.97l-.28-.15-2.89.96.96-2.89-.15-.28C4.36 14.73 4 13.41 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-base">Grow24.ai Assistant</h3>
                  <p className="text-xs text-purple-100">PBMP Chatbot</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
              {noMessages ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-700 dark:to-slate-900 rounded-2xl p-6 shadow-lg border border-slate-600/30"
                  >
                    <h4 className="text-lg font-bold text-white mb-2">
                      Welcome to PBMP ChatBot
                    </h4>
                    <p className="text-sm text-slate-200">
                      Your Personal & Business Management Platform assistant. Ask me anything about PBMP and Grow24.ai.
                    </p>
                  </motion.div>
                  <PromptSuggestionsRow onPromptClick={handlePrompt} />
                </>
              ) : (
                <>
                  {messages.map((message) => (
                    <Bubble
                      key={message.id}
                      message={message}
                      onBookingComplete={(data) => {
                        console.log('Booking completed:', data)
                        setIsInBookingFlow(false)
                      }}
                      onDiagramYes={handleDiagramYes}
                      onDiagramNo={handleDiagramNo}
                      onDiagramClose={handleDiagramClose}
                    />
                  ))}
                  {isLoading && <LoadingBubbles />}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="w-full px-4 py-2 pr-12 bg-gray-100 dark:bg-slate-700 border-none rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <AudioRecorder
                      onAudioRecorded={handleAudioRecorded}
                      disabled={isLoading || isInBookingFlow}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  {isLoading ? '...' : 'Send'}
                </button>
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="px-3 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl text-sm transition-colors"
                >
                  New
                </button>
              </form>
            </div>

            {error && (
              <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs border-t border-red-100 dark:border-red-900/50">
                ⚠️ {error}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

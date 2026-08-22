import { createContext, useContext, useRef, useCallback, useState, ReactNode } from 'react'

interface ChatbotContextType {
  registerOpener: (open: () => void) => () => void
  openChatbot: () => void
  isChatOpen: boolean
  setChatOpen: (open: boolean) => void
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

const noop = () => {}
const noopUnregister = () => noop
const noopSetChatOpen = (_open: boolean) => {}

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const openerRef = useRef<(() => void) | null>(null)
  const [isChatOpen, setChatOpen] = useState(false)

  const registerOpener = useCallback((open: () => void) => {
    openerRef.current = open
    return () => {
      openerRef.current = null
    }
  }, [])

  const openChatbot = useCallback(() => {
    setChatOpen(true)
    openerRef.current?.()
  }, [])

  return (
    <ChatbotContext.Provider value={{ registerOpener, openChatbot, isChatOpen, setChatOpen }}>
      {children}
    </ChatbotContext.Provider>
  )
}

export function useChatbotContext(): ChatbotContextType {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    return { registerOpener: noopUnregister, openChatbot: noop, isChatOpen: false, setChatOpen: noopSetChatOpen }
  }
  return context
}

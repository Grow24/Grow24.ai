import { createContext, useContext, useRef, useCallback, ReactNode } from 'react'

interface ChatbotContextType {
  registerOpener: (open: () => void) => () => void
  openChatbot: () => void
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

const noop = () => {}
const noopUnregister = () => noop

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const openerRef = useRef<(() => void) | null>(null)

  const registerOpener = useCallback((open: () => void) => {
    openerRef.current = open
    return () => {
      openerRef.current = null
    }
  }, [])

  const openChatbot = useCallback(() => {
    openerRef.current?.()
  }, [])

  return (
    <ChatbotContext.Provider value={{ registerOpener, openChatbot }}>
      {children}
    </ChatbotContext.Provider>
  )
}

export function useChatbotContext(): ChatbotContextType {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    return { registerOpener: noopUnregister, openChatbot: noop }
  }
  return context
}

import { createRootRoute, Outlet } from '@tanstack/react-router'
import RootLayout from '../components/RootLayout'
import { LoginModalProvider } from '../contexts/LoginModalContext'
import { ChatbotProvider } from '../contexts/ChatbotContext'

export const Route = createRootRoute({
  component: () => (
    <LoginModalProvider>
      <ChatbotProvider>
        <RootLayout>
          <Outlet />
        </RootLayout>
      </ChatbotProvider>
    </LoginModalProvider>
  ),
})

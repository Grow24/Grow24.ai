import { createRootRoute, Outlet } from '@tanstack/react-router'
import RootLayout from '../components/RootLayout'
import { LoginModalProvider } from '../contexts/LoginModalContext'
import { ChatbotProvider } from '../contexts/ChatbotContext'
import { NotFoundPage } from '../components/NotFoundPage'

export const Route = createRootRoute({
  notFoundComponent: NotFoundPage,
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

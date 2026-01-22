import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ClerkProvider } from '@clerk/clerk-react'
import { routeTree } from './routeTree.gen'
import { ComingSoonProvider } from './contexts/ComingSoonContext'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  
  // If no Clerk key, run without authentication
  if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'YOUR_PUBLISHABLE_KEY') {
    console.warn('⚠️ Running without authentication. Add VITE_CLERK_PUBLISHABLE_KEY to .env.local')
    root.render(
      <StrictMode>
        <ComingSoonProvider>
        <RouterProvider router={router} />
        </ComingSoonProvider>
      </StrictMode>
    )
  } else {
    root.render(
      <StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <ComingSoonProvider>
          <RouterProvider router={router} />
          </ComingSoonProvider>
        </ClerkProvider>
      </StrictMode>
    )
  }
}

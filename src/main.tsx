import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { ComingSoonProvider } from './contexts/ComingSoonContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { GlobalCTABarProvider } from './contexts/GlobalCTABarContext'
import './index.css'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <ThemeProvider>
        <GlobalCTABarProvider>
          <ComingSoonProvider>
            <RouterProvider router={router} />
          </ComingSoonProvider>
        </GlobalCTABarProvider>
      </ThemeProvider>
    </StrictMode>
  )
}

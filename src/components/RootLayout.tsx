import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from '@tanstack/react-router'
import { AnimatePresence } from 'framer-motion'
import { Header } from './Header'
import { FloatingLeftWidgets } from './FloatingWidgets'
import PBMPChatbot from './PBMPChatbot'
import { MobileRadialMenu } from './MobileRadialMenu'
import Sidebar from './Sidebar'
import MegaMenu from './MegaMenu'
import GlobalCTABar from './GlobalCTABar'
import CookieConsentBanner from './CookieConsentBanner'

export const RootLayout: React.FC = () => {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Dashboard uses its own layout: no main-site header, sidebar, CTA, or floating widgets
  if (isDashboard) {
    return (
      <div className="min-h-screen bg-slate-950 text-white relative">
        <main className="min-h-screen">
          <Outlet />
        </main>
        <CookieConsentBanner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white relative">
      {/* Simple Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-emerald-50/30 via-transparent to-cyan-50/20 dark:from-emerald-950/10 dark:via-transparent dark:to-cyan-950/10 pointer-events-none" />

      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <Header onMegaMenuToggle={() => setMegaMenuOpen(!megaMenuOpen)} />

      {/* Mega Menu */}
      <AnimatePresence>
        {megaMenuOpen && (
          <MegaMenu 
            isOpen={megaMenuOpen} 
            onClose={() => setMegaMenuOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Main Content - top padding clears fixed header so content is never cut off when scrolling */}
      <main className="pt-header pb-10 sm:pb-14">
        <Outlet />
      </main>

      {/* Desktop: floating widgets. Mobile: radial menu */}
      <FloatingLeftWidgets />
      <PBMPChatbot position="right" hideFab={isMobile} />
      <MobileRadialMenu />

      {/* Global CTA Bar */}
      <GlobalCTABar />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />
    </div>
  )
}

export default RootLayout

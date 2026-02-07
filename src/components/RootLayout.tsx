import React, { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { AnimatePresence } from 'framer-motion'
import { Header } from './Header'
import { FloatingWhatsApp, SocialLinks } from './FloatingWidgets'
import PBMPChatbot from './PBMPChatbot'
import Sidebar from './Sidebar'
import MegaMenu from './MegaMenu'
import GlobalCTABar from './GlobalCTABar'

export const RootLayout: React.FC = () => {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)

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

      {/* Main Content */}
      <main className="pt-16 sm:pt-20 pb-10 sm:pb-14">
        <Outlet />
      </main>

      {/* Floating Widgets */}
      <FloatingWhatsApp position="left" />
      <PBMPChatbot position="right" />
      <SocialLinks />

      {/* Global CTA Bar */}
      <GlobalCTABar />
    </div>
  )
}

export default RootLayout

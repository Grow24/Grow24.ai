import React, { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { AnimatePresence } from 'framer-motion'
import { CalmBackground } from './CalmBackground'
import { Header } from './Header'
import { FloatingWhatsApp, SocialLinks } from './FloatingWidgets'
import PBMPChatbot from './PBMPChatbot'
import Sidebar from './Sidebar'
import MegaMenu from './MegaMenu'
import GlobalCTABar from './GlobalCTABar'

export const RootLayout: React.FC = () => {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* 3D Background */}
      <CalmBackground />

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
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Floating Widgets */}
      <FloatingWhatsApp position="left" />
      <PBMPChatbot position="right" />
      <SocialLinks />

      {/* Global CTA Bar */}
      <GlobalCTABar />

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white/80 py-12 mt-20">
        <div className="w-full px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8">
            <p className="text-sm text-center text-white/60">
              © 2026 Grow24.ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default RootLayout

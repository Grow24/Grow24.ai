import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

// SVG Icons
const SunIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

export const Route = createFileRoute('/what-we-offer')({
  component: WhatWeOfferPage,
})

function WhatWeOfferPage() {
  const [activeTab, setActiveTab] = useState<'what' | 'how'>('what')
  const [personalBgWhite, setPersonalBgWhite] = useState(false)
  const [professionalBgWhite, setProfessionalBgWhite] = useState(false)

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Solutions to Plan & Manage both your Personal and Professional Life
          </h1>
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setActiveTab('what')}
              className={`px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeTab === 'what'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-900/30'
                  : 'bg-white/10 dark:bg-slate-800/50 text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-slate-700/50 border border-gray-300/50 dark:border-gray-600/50'
              }`}
            >
              What
            </button>
            <button
              onClick={() => setActiveTab('how')}
              className={`px-8 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeTab === 'how'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'bg-white/10 dark:bg-slate-800/50 text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-slate-700/50 border border-gray-300/50 dark:border-gray-600/50'
              }`}
            >
              How
            </button>
          </div>
        </motion.div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'what' ? (
            <motion.div
              key="what"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Diagrams Container */}
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
                {/* Personal Side */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`rounded-2xl shadow-xl p-8 border transition-all duration-300 ${
                    personalBgWhite
                      ? 'bg-white dark:bg-white border-gray-300 dark:border-gray-300'
                      : 'glass backdrop-blur-xl bg-white/10 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-2xl font-bold mb-2 ${
                      personalBgWhite
                        ? 'text-gray-900'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      Individual (Personal side)
                    </h2>
                    <button
                      onClick={() => setPersonalBgWhite(!personalBgWhite)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        personalBgWhite
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          : 'bg-white/20 dark:bg-slate-700/50 hover:bg-white/30 dark:hover:bg-slate-600/50 text-white border border-white/30 dark:border-slate-600'
                      }`}
                      title={personalBgWhite ? 'Switch to dark background' : 'Switch to white background'}
                    >
                      {personalBgWhite ? <MoonIcon /> : <SunIcon />}
                    </button>
                  </div>
                  <div className="flex justify-center items-center">
                    <img
                      src="/PerSide.png"
                      alt="Personal Side - PBMP Cycle"
                      className="w-full h-auto max-w-md"
                    />
                  </div>
                </motion.div>

                {/* Professional Side */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className={`rounded-2xl shadow-xl p-8 border transition-all duration-300 ${
                    professionalBgWhite
                      ? 'bg-white dark:bg-white border-gray-300 dark:border-gray-300'
                      : 'glass backdrop-blur-xl bg-white/10 dark:bg-slate-800/50 border-white/20 dark:border-slate-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-2xl font-bold mb-2 ${
                      professionalBgWhite
                        ? 'text-gray-900'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      Individual (Professional side)
                    </h2>
                    <button
                      onClick={() => setProfessionalBgWhite(!professionalBgWhite)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        professionalBgWhite
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          : 'bg-white/20 dark:bg-slate-700/50 hover:bg-white/30 dark:hover:bg-slate-600/50 text-white border border-white/30 dark:border-slate-600'
                      }`}
                      title={professionalBgWhite ? 'Switch to dark background' : 'Switch to white background'}
                    >
                      {professionalBgWhite ? <MoonIcon /> : <SunIcon />}
                    </button>
                  </div>
                  <div className="flex justify-center items-center">
                    <img
                      src="/ProSide.png"
                      alt="Professional Side - PBMP Cycle"
                      className="w-full h-auto max-w-md"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="how"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* The PBMP Approach Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass backdrop-blur-xl bg-white/10 dark:bg-slate-800/50 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-white/20 dark:border-slate-700/50"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  The PBMP Approach
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">Managing Personal Life through PBMP</span>
                      <br />
                      <span className="text-gray-600 dark:text-gray-400">
                        A comprehensive framework to identify goals, assess capabilities, and build strategies for personal growth and fulfillment.
                      </span>
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">Managing Professional Life through PBMP</span>
                      <br />
                      <span className="text-gray-600 dark:text-gray-400">
                        A structured approach to align business goals, assess organizational capabilities, and execute strategic plans across different time horizons.
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        {activeTab === 'what' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <Link
              to="/solutions"
              className="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Explore Our Solutions
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

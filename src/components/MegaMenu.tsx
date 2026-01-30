import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const MinusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

interface PBMPStep {
  title: string
  description: string
}

const personalPBMP: PBMPStep[] = [
  { title: 'Plan', description: 'Set personal goals and define your vision for life success' },
  { title: 'Build', description: 'Develop sustainable habits and routines that align with your goals' },
  { title: 'Measure', description: 'Track progress with data-driven insights and personal metrics' },
  { title: 'Progress', description: 'Iterate and improve continuously towards your ideal life' },
]

const professionalPBMP: PBMPStep[] = [
  { title: 'Plan', description: 'Define business objectives and strategic roadmaps' },
  { title: 'Build', description: 'Execute projects with agile methodologies and best practices' },
  { title: 'Measure', description: 'Monitor KPIs and business metrics in real-time' },
  { title: 'Progress', description: 'Scale operations and optimize for sustainable growth' },
]

interface MegaMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const [activeTab, setActiveTab] = useState<'what' | 'how'>('what')
  const [expandedPersonal, setExpandedPersonal] = useState(false)
  const [expandedProfessional, setExpandedProfessional] = useState(false)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
      />

      {/* Mega Menu Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-[60px] left-0 right-0 z-[45] max-w-7xl mx-auto px-8"
      >
        <div className="glass backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Toggle Switch: What vs How */}
          <div className="flex items-center justify-center gap-2 p-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('what')}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'what'
                  ? 'bg-info-gold-500 text-white shadow-lg shadow-info-gold-900/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              The Concept
            </button>
            <button
              onClick={() => setActiveTab('how')}
              className={`px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'how'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              How it Works
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'what' ? (
                <motion.div
                  key="what"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      Comprehensive Growth Solutions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                      We guide you through a proven PBMP cycle for both personal and professional transformation
                    </p>
                  </div>

                  {/* Personal Life Accordion */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedPersonal(!expandedPersonal)}
                      className="w-full flex items-center justify-between p-6 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors"
                    >
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          Managing Personal Life through PBMP
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Holistic approach to personal growth and wellness
                        </p>
                      </div>
                      <div className="text-emerald-600">
                        {expandedPersonal ? <MinusIcon /> : <PlusIcon />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedPersonal && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 bg-gray-50 dark:bg-slate-750 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-4 gap-4">
                              {personalPBMP.map((step, idx) => (
                                <motion.div
                                  key={step.title}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200 group cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm group-hover:scale-110 transition-transform">
                                      {idx + 1}
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{step.title}</h4>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Professional Life Accordion */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedProfessional(!expandedProfessional)}
                      className="w-full flex items-center justify-between p-6 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-750 transition-colors"
                    >
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          Managing Professional Life through PBMP
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Strategic frameworks for business excellence
                        </p>
                      </div>
                      <div className="text-emerald-600">
                        {expandedProfessional ? <MinusIcon /> : <PlusIcon />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedProfessional && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 bg-gray-50 dark:bg-slate-750 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-4 gap-4">
                              {professionalPBMP.map((step, idx) => (
                                <motion.div
                                  key={step.title}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200 group cursor-pointer"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm group-hover:scale-110 transition-transform">
                                      {idx + 1}
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{step.title}</h4>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="how"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="py-12"
                >
                  <div className="text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      The PBMP Growth Cycle
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
                      Our proven 4-stage methodology ensures continuous improvement and measurable results
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                      {['Plan', 'Build', 'Measure', 'Progress'].map((stage, idx) => (
                        <motion.div
                          key={stage}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-8 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl border-2 border-emerald-200 dark:border-emerald-700"
                        >
                          <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
                            {idx + 1}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{stage}</h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {stage === 'Plan' && 'Define clear objectives and strategic roadmaps'}
                            {stage === 'Build' && 'Execute with proven methodologies and frameworks'}
                            {stage === 'Measure' && 'Track progress with actionable analytics'}
                            {stage === 'Progress' && 'Iterate and scale for continuous growth'}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer CTA */}
          <div className="px-8 py-6 bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ready to transform your personal and professional life?
            </p>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-cta-green-500 hover:bg-cta-green-600 text-white font-semibold rounded-lg transition-colors">
                Get Started Free
              </button>
              <button className="px-6 py-2.5 border-2 border-info-gold-500 dark:border-info-gold-600 bg-info-gold-50 dark:bg-info-gold-900/20 text-info-gold-700 dark:text-info-gold-300 font-semibold rounded-lg hover:bg-info-gold-100 dark:hover:bg-info-gold-900/30 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

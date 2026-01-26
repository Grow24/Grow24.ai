import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComingSoon } from '../contexts/ComingSoonContext'

interface Solution {
  id: string
  category: 'Goals' | 'Strategy' | 'Plan' | 'Project' | 'Operations'
  title: string
  description: string
  features: string[]
  icon: JSX.Element
}

const solutions: Solution[] = [
  // Goals
  {
    id: 'goal-1',
    category: 'Goals',
    title: 'Vision Alignment',
    description: 'Align organizational and personal objectives with strategic clarity using AI-powered goal frameworks.',
    features: ['OKR Management', 'SMART Goal Templates', 'Vision Boards', 'Milestone Tracking'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'goal-2',
    category: 'Goals',
    title: 'Impact Modeling',
    description: 'Quantify and visualize the potential impact of strategic goals before execution begins.',
    features: ['ROI Forecasting', 'Impact Simulation', 'Risk Analysis', 'Scenario Planning'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  // Strategy
  {
    id: 'strategy-1',
    category: 'Strategy',
    title: 'Strategic Canvas',
    description: 'Design winning strategies with BCG-inspired frameworks and competitive analysis tools.',
    features: ['SWOT Analysis', 'Blue Ocean Canvas', 'Porter\'s Five Forces', 'Value Chain Mapping'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    id: 'strategy-2',
    category: 'Strategy',
    title: 'Resource Optimization',
    description: 'Maximize resource allocation efficiency using AI-driven insights and predictive analytics.',
    features: ['Resource Allocation', 'Capacity Planning', 'Budget Optimization', 'Team Balancing'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  // Plan
  {
    id: 'plan-1',
    category: 'Plan',
    title: 'Roadmap Builder',
    description: 'Create detailed execution roadmaps with dependency mapping and critical path analysis.',
    features: ['Gantt Charts', 'Dependency Tracking', 'Critical Path', 'Timeline Visualization'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  },
  {
    id: 'plan-2',
    category: 'Plan',
    title: 'Sprint Orchestration',
    description: 'Agile sprint planning with AI-suggested task prioritization and velocity tracking.',
    features: ['Sprint Planning', 'Story Mapping', 'Velocity Analytics', 'Backlog Grooming'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    )
  },
  // Project
  {
    id: 'project-1',
    category: 'Project',
    title: 'Execution Dashboard',
    description: 'Real-time project monitoring with automated alerts and intelligent status reporting.',
    features: ['Live Dashboards', 'Automated Alerts', 'Status Reports', 'Burndown Charts'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    id: 'project-2',
    category: 'Project',
    title: 'Collaboration Hub',
    description: 'Unified workspace for seamless team collaboration with integrated communication tools.',
    features: ['Team Workspace', 'Document Sharing', 'Comment Threads', 'Version Control'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  // Operations
  {
    id: 'operations-1',
    category: 'Operations',
    title: 'Process Automation',
    description: 'Streamline recurring workflows with intelligent automation and workflow orchestration.',
    features: ['Workflow Builder', 'API Integrations', 'Scheduled Tasks', 'Trigger Actions'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    id: 'operations-2',
    category: 'Operations',
    title: 'Performance Analytics',
    description: 'Continuous monitoring and optimization with AI-powered insights and recommendations.',
    features: ['KPI Tracking', 'Predictive Analytics', 'Trend Analysis', 'Custom Reports'],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
]

const categories = ['Goals', 'Strategy', 'Plan', 'Project', 'Operations'] as const

export default function SolutionsMatrix() {
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null)
  const [hoveredSolution, setHoveredSolution] = useState<Solution | null>(null)
  const { showComingSoon } = useComingSoon()

  const displayedSolution = selectedSolution || hoveredSolution

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Left: 5-Column Solution Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4 overflow-x-auto">
            {categories.map((category) => (
              <div key={category} className="space-y-4">
                {/* Category Header */}
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl text-center shadow-lg">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide">{category}</h3>
                </div>

                {/* Solutions for this category */}
                {solutions
                  .filter((s) => s.category === category)
                  .map((solution) => (
                    <motion.div
                      key={solution.id}
                      onHoverStart={() => setHoveredSolution(solution)}
                      onHoverEnd={() => setHoveredSolution(null)}
                      onClick={() => setSelectedSolution(selectedSolution?.id === solution.id ? null : solution)}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300
                        bg-white dark:bg-slate-800 
                        border-2 shadow-md hover:shadow-xl
                        ${
                          selectedSolution?.id === solution.id
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : hoveredSolution?.id === solution.id
                            ? 'border-emerald-400'
                            : 'border-gray-200 dark:border-gray-700'
                        }
                      `}
                    >
                      <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                        <div className="text-emerald-600 dark:text-emerald-400 w-5 h-5 sm:w-6 sm:h-6">
                          {solution.icon}
                        </div>
                        <h4 className="text-[10px] sm:text-xs font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2">
                          {solution.title}
                        </h4>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Persistent Summary Panel */}
        <div className="lg:col-span-1">
          <motion.div
            layout
            className="sticky top-24 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 min-h-[400px]"
          >
            <AnimatePresence mode="wait">
              {displayedSolution ? (
                <motion.div
                  key={displayedSolution.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Category Badge */}
                  <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
                    {displayedSolution.category}
                  </div>

                  {/* Icon */}
                  <div className="text-emerald-600 dark:text-emerald-400 mb-4">
                    {displayedSolution.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {displayedSolution.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {displayedSolution.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {displayedSolution.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-2"
                        >
                          <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    onClick={() => showComingSoon('solutions-matrix', 'Get Started', 'Enter your email to learn more about this solution.')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
                  >
                    Explore {displayedSolution.title}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12"
                >
                  <svg className="w-16 h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Discover Our Solutions
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Hover over or click any solution card to see detailed information
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

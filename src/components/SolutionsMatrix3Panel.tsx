import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from '@tanstack/react-router'
import { useComingSoon } from '../contexts/ComingSoonContext'

// List of solution IDs that have detail pages
const solutionsWithDetailPages = [
    'corp-strat-1',
    'corp-goal-1',
    'corp-plan-1',
    'corp-ops-1',
    'sales-goal-1',
    'sales-strat-1',
    'mkt-goal-1',
    'mkt-strat-1'
]

// Chevron icon for expandable rows
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
    >
        <polyline points="9 18 15 12 9 6" />
    </svg>
)

interface Solution {
    id: string
    title: string
    description: string
    icon: JSX.Element
    features: string[]
    category: 'Goals' | 'Strategy' | 'Plan' | 'Project' | 'Operations'
}

interface FunctionRow {
    id: string
    name: string
    subItems?: string[]
    solutions: {
        Goals?: Solution[]
        Strategy?: Solution[]
        Plan?: Solution[]
        Project?: Solution[]
        Operations?: Solution[]
    }
}

// Sample data matching the screenshot structure
const functions: FunctionRow[] = [
    {
        id: 'corporate',
        name: 'Corporate',
        subItems: ['Goals (Qubit)', 'Strategy', 'Plan'],
        solutions: {
            Goals: [
                {
                    id: 'corp-goal-1',
                    title: 'Strategy Goalsetting',
                    description: 'Define measurable objectives for sustained growth.',
                    category: 'Goals',
                    features: ['Measurable Objectives', 'Growth Targets', 'Strategic Alignment'],
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                }
            ],
            Strategy: [
                {
                    id: 'corp-strat-1',
                    title: 'Strategy Generation',
                    description: 'Formulate where-to-play and how-to-win strategies.',
                    category: 'Strategy',
                    features: ['SWOT Analysis', 'BCG Matrix', 'IE Matrix', 'QSPM'],
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    )
                }
            ],
            Plan: [
                {
                    id: 'corp-plan-1',
                    title: 'Multi-Horizon Planning',
                    description: 'Build stepwise plans, week + quarter - year.',
                    category: 'Plan',
                    features: ['Weekly Planning', 'Quarterly Planning', 'Annual Planning'],
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )
                }
            ],
            Project: [
                {
                    id: 'corp-proj-1',
                    title: 'Project Portfolio',
                    description: 'Drive strategic initiatives, programs, and projects.',
                    category: 'Project',
                    features: ['Portfolio Management', 'Program Tracking', 'Initiative Planning'],
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    )
                }
            ],
            Operations: [
                {
                    id: 'corp-ops-1',
                    title: 'KPI Monitoring',
                    description: 'Monitor results against KPIs, targets, and activities.',
                    category: 'Operations',
                    features: ['Real-time Dashboards', 'KPI Tracking', 'Performance Metrics'],
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )
                }
            ]
        }
    },
    {
        id: 'sales',
        name: 'Sales',
        subItems: ['Goals'],
        solutions: {
            Goals: [
                {
                    id: 'sales-goal-1',
                    title: 'Sales Goalsetting',
                    description: 'Align qualities, targets, and tenures for sales productivity.',
                    category: 'Goals',
                    features: ['Sales Targets', 'Quota Setting', 'Performance Alignment'],
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                }
            ],
            Strategy: [
                {
                    id: 'sales-strat-1',
                    title: 'GTM Strategy',
                    description: 'Define your go-to-market strategy with actionable tactics.',
                    category: 'Strategy',
                    features: ['Market Entry', 'Channel Strategy', 'Pricing Strategy'],
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    )
                }
            ],
            Plan: [
                {
                    id: 'sales-plan-1',
                    title: 'Quarterly Planning',
                    description: 'Plan, monitor, and optimize your quarterly quotas.',
                    category: 'Plan',
                    features: ['Quota Planning', 'Forecasting', 'Resource Allocation'],
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )
                }
            ],
            Project: [
                {
                    id: 'sales-proj-1',
                    title: 'Quarterly Planning',
                    description: 'Plan, monitor, and optimize to your quarterly quotas.',
                    category: 'Project',
                    features: ['Project Tracking', 'Milestone Management', 'Delivery Planning'],
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    )
                }
            ],
            Operations: [
                {
                    id: 'sales-ops-1',
                    title: 'Improve Loop',
                    description: 'Identify and fix gaps, remove bottlenecks, improve forecasts.',
                    category: 'Operations',
                    features: ['Gap Analysis', 'Bottleneck Removal', 'Forecast Improvement'],
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    )
                }
            ]
        }
    },
    {
        id: 'marketing',
        name: 'Marketing',
        solutions: {
            Goals: [
                {
                    id: 'mkt-goal-1',
                    title: 'Marketing Goalsetting',
                    description: 'Translate growth targets and inspirational objectives sales.',
                    category: 'Goals',
                    features: ['Growth Targets', 'Campaign Objectives', 'ROI Goals'],
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    )
                }
            ],
            Strategy: [
                {
                    id: 'mkt-strat-1',
                    title: 'GTM Strategy',
                    description: 'Craft growth-oriented strategy to ignite growth.',
                    category: 'Strategy',
                    features: ['Market Strategy', 'Brand Positioning', 'Growth Tactics'],
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    )
                }
            ],
            Plan: [
                {
                    id: 'mkt-plan-1',
                    title: 'Quarterly Sales Planning',
                    description: 'Plan, monitor, and optimize your quarterly quotas.',
                    category: 'Plan',
                    features: ['Campaign Planning', 'Budget Allocation', 'Timeline Management'],
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    )
                }
            ],
            Project: [
                {
                    id: 'mkt-proj-1',
                    title: 'Campaign Calendar & KPIs',
                    description: 'Plan, consolidate, and report on campaign campaigns & deliverables.',
                    category: 'Project',
                    features: ['Campaign Calendar', 'KPI Tracking', 'Deliverable Management'],
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )
                }
            ],
            Operations: [
                {
                    id: 'mkt-ops-1',
                    title: 'Content Performance',
                    description: 'Review content performance, analyze corrective actions.',
                    category: 'Operations',
                    features: ['Performance Analytics', 'Content Review', 'Action Planning'],
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )
                }
            ]
        }
    }
]

const categories = ['Goals', 'Strategy', 'Plan', 'Project', 'Operations'] as const
const categoryColors = {
    Goals: 'bg-blue-500',
    Strategy: 'bg-blue-500',
    Plan: 'bg-orange-500',
    Project: 'bg-orange-500',
    Operations: 'bg-purple-500'
}

export default function SolutionsMatrix3Panel() {
    const navigate = useNavigate()
    const { showComingSoon } = useComingSoon()
    const [expandedFunctions, setExpandedFunctions] = useState<Set<string>>(new Set(['corporate', 'sales', 'marketing']))
    const [selectedSolution, setSelectedSolution] = useState<Solution | null>(
        functions[0].solutions.Strategy?.[0] || null
    )

    const toggleFunction = (functionId: string) => {
        setExpandedFunctions(prev => {
            const next = new Set(prev)
            if (next.has(functionId)) {
                next.delete(functionId)
            } else {
                next.add(functionId)
            }
            return next
        })
    }

    const handleLearnMore = () => {
        if (selectedSolution) {
            // Check if this solution has a detail page
            if (solutionsWithDetailPages.includes(selectedSolution.id)) {
                // Navigate to the detail page
                try {
                    navigate({
                        to: '/solutions/$solutionId',
                        params: { solutionId: selectedSolution.id }
                    })
                } catch (error) {
                    console.error('Navigation error:', error)
                    // Fallback to window.location if navigate fails
                    window.location.href = `/solutions/${selectedSolution.id}`
                }
            } else {
                // Show coming soon modal for solutions without detail pages
                showComingSoon()
            }
        }
    }

    return (
        <div className="w-full min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-[95vw] mx-auto">
                <div className="grid grid-cols-[180px_1fr_320px] gap-4 max-lg:grid-cols-1">
                    {/* Left Panel: Function Column */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 border-b border-gray-200 dark:border-gray-600">
                            <h3 className="font-bold text-xs text-gray-900 dark:text-white uppercase">Function</h3>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {functions.map((func) => {
                                const isExpanded = expandedFunctions.has(func.id)
                                return (
                                    <div key={func.id}>
                                        <button
                                            onClick={() => toggleFunction(func.id)}
                                            className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                                        >
                                            <span className="font-semibold text-xs text-gray-900 dark:text-white">{func.name}</span>
                                            <ChevronIcon isOpen={isExpanded} />
                                        </button>
                                        {isExpanded && func.subItems && (
                                            <div className="bg-gray-50 dark:bg-gray-800 px-3 py-1.5 space-y-1">
                                                {func.subItems.map((item, idx) => (
                                                    <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 pl-3">
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Middle Panel: Category Columns */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="grid grid-cols-5 border-b border-gray-200 dark:border-gray-700">
                            {categories.map((category) => (
                                <div
                                    key={category}
                                    className={`px-4 py-3 text-center ${categoryColors[category]} text-white`}
                                >
                                    <h3 className="font-bold text-sm uppercase">{category}</h3>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-5 divide-x divide-gray-200 dark:divide-gray-700 min-h-[600px] max-lg:grid-cols-1 max-lg:divide-x-0 max-lg:divide-y">
                            {categories.map((category) => (
                                <div key={category} className="p-3 space-y-3">
                                    {functions.map((func) => {
                                        const solutions = func.solutions[category] || []
                                        if (solutions.length === 0) return null
                                        return (
                                            <div key={`${func.id}-${category}`} className="space-y-2">
                                                {solutions.map((solution) => (
                                                    <motion.button
                                                        key={solution.id}
                                                        onClick={() => setSelectedSolution(solution)}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className={`w-full p-3 rounded-lg border-2 transition-all text-left overflow-hidden ${selectedSolution?.id === solution.id
                                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-slate-800'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-2 mb-2">
                                                            <div className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5">
                                                                {solution.icon}
                                                            </div>
                                                            <div className="flex-1 min-w-0 overflow-hidden">
                                                                <h4 className="text-xs font-semibold text-gray-900 dark:text-white leading-tight mb-1 line-clamp-2 break-words">
                                                                    {solution.title}
                                                                </h4>
                                                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight line-clamp-2 break-words">
                                                                    {solution.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel: Solution Summary */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="bg-purple-500 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold text-xs text-white uppercase">Solution Summary</h3>
                        </div>
                        <AnimatePresence mode="wait">
                            {selectedSolution ? (
                                <motion.div
                                    key={selectedSolution.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="p-4"
                                >
                                    <div className="flex items-start gap-2 mb-3">
                                        <div className="text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                            {selectedSolution.icon}
                                        </div>
                                        <h3 className="text-base font-bold text-gray-900 dark:text-white break-words">
                                            {selectedSolution.title}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 leading-relaxed break-words">
                                        {selectedSolution.description}
                                    </p>
                                    <div className="space-y-2 mb-4">
                                        {selectedSolution.features.map((feature, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="flex items-start gap-2"
                                            >
                                                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-xs text-gray-700 dark:text-gray-300 break-words">{feature}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <motion.button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleLearnMore()
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg shadow-lg transition-colors duration-200 cursor-pointer break-words"
                                    >
                                        <span className="line-clamp-2">Explore {selectedSolution.title} &gt;</span>
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-4"
                                >
                                    <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Select a solution to view details
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}

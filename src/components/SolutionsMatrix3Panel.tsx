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
    category: 'Goals' | 'Strategy' | 'Objective' | 'Plan' | 'Project' | 'Operations'
}

interface FunctionRow {
    id: string
    name: string
    subItems?: string[]
    solutions: {
        Goals?: Solution[]
        Strategy?: Solution[]
        Objective?: Solution[]
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
            Objective: [],
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
            Objective: [],
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
            Objective: [],
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
    },
    {
        id: 'programs',
        name: 'Programs',
        solutions: {
            Goals: [],
            Strategy: [],
            Objective: [],
            Plan: [],
            Project: [],
            Operations: []
        }
    },
    {
        id: 'ssp',
        name: 'SSP',
        subItems: ['Structures', 'Systems', 'Processes'],
        solutions: {
            Goals: [],
            Strategy: [],
            Objective: [],
            Plan: [],
            Project: [],
            Operations: []
        }
    }
]

const categories = ['Goals', 'Strategy', 'Objective', 'Plan', 'Project', 'Operations'] as const

export default function SolutionsMatrix3Panel() {
    const navigate = useNavigate()
    const { showComingSoon } = useComingSoon()
    const [selectedFunction, setSelectedFunction] = useState<string>('corporate')
    const [expandedFunctions, setExpandedFunctions] = useState<Set<string>>(new Set())
    const [selectedSolution, setSelectedSolution] = useState<Solution | null>(
        functions[0].solutions.Strategy?.[0] || null
    )

    const handleFunctionClick = (functionId: string) => {
        const func = functions.find(f => f.id === functionId)
        // If function has sub-items (like SSP), toggle expansion instead of selecting
        if (func?.subItems && func.subItems.length > 0) {
            setExpandedFunctions(prev => {
                const next = new Set(prev)
                if (next.has(functionId)) {
                    next.delete(functionId)
                } else {
                    next.add(functionId)
                }
                return next
            })
        } else {
            // For functions without sub-items, select them
            setSelectedFunction(functionId)
            // Set the first available solution from the selected function as default
            if (func) {
                const firstSolution = func.solutions.Goals?.[0] || 
                                     func.solutions.Strategy?.[0] || 
                                     func.solutions.Objective?.[0] || 
                                     func.solutions.Plan?.[0] || 
                                     func.solutions.Project?.[0] || 
                                     func.solutions.Operations?.[0] || null
                setSelectedSolution(firstSolution)
            }
        }
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
                showComingSoon('explore-solution', 'Get Started', 'Enter your email to learn more about this solution and stay updated.')
            }
        }
    }

    return (
        <div className="w-full min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-2 sm:px-4 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="max-w-[95vw] mx-auto">
                <div className="mb-6 sm:mb-8 px-2">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-emerald-700 to-slate-900 dark:from-white dark:via-emerald-400 dark:to-white bg-clip-text text-transparent mb-2">
                            Solution Dashboard
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium">
                            Explore solutions by function and category
                        </p>
                    </motion.div>
                </div>

                {/* Main Dashboard Layout - Single Row */}
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                    {/* Left Sidebar - FUNCTION */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden lg:w-52 flex-shrink-0"
                    >
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 px-4 py-3 border-b border-emerald-600/20">
                            <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                Function
                            </h3>
                        </div>
                        <div className="p-3 space-y-2">
                            {functions.map((func) => {
                                const isSelected = selectedFunction === func.id
                                const hasSubItems = func.subItems && func.subItems.length > 0
                                
                                return (
                                    <div key={func.id} className="relative">
                                        <motion.button
                                            onClick={() => handleFunctionClick(func.id)}
                                            whileHover={{ scale: 1.02, x: 2 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-all text-left flex items-center justify-between ${
                                                isSelected
                                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                                    : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                {isSelected && (
                                                    <motion.div
                                                        layoutId="function-indicator"
                                                        className="w-1.5 h-1.5 rounded-full bg-white"
                                                    />
                                                )}
                                                {func.name}
                                            </span>
                                            {hasSubItems && (
                                                <ChevronIcon isOpen={expandedFunctions.has(func.id)} />
                                            )}
                                        </motion.button>
                                        {hasSubItems && expandedFunctions.has(func.id) && func.subItems && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-2 ml-4 space-y-1 border-l-2 border-emerald-200 dark:border-emerald-800 pl-3"
                                            >
                                                {func.subItems.map((item, idx) => (
                                                    <div key={idx} className="text-xs text-slate-600 dark:text-slate-400 px-3 py-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors cursor-pointer">
                                                        {item}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>

                    {/* Middle Panel: Category Columns */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden flex-1 min-w-0"
                    >
                        <div className="grid grid-cols-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800 dark:to-slate-800">
                            {categories.map((category, idx) => (
                                <motion.div
                                    key={category}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + idx * 0.05 }}
                                    className="px-2 sm:px-3 md:px-4 py-3 sm:py-4 text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0 min-w-[80px]"
                                >
                                    <h3 className="font-bold text-xs sm:text-sm uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                                        {category}
                                    </h3>
                                </motion.div>
                            ))}
                        </div>
                        <div className="grid grid-cols-6 divide-x divide-slate-200 dark:divide-slate-700 overflow-x-auto lg:overflow-visible bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-900/50">
                            {categories.map((category) => {
                                const currentFunction = functions.find(f => f.id === selectedFunction)
                                const solutions = currentFunction?.solutions[category] || []
                                return (
                                    <div key={category} className="p-3 sm:p-4 space-y-3 min-h-[200px] min-w-[120px]">
                                        {solutions.length === 0 ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex flex-col items-center justify-center h-full min-h-[150px] text-center py-8 px-2"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                                    <svg className="w-6 h-6 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                                                    No {category.toLowerCase()} solutions
                                                </p>
                                                <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                                                    Coming soon
                                                </p>
                                            </motion.div>
                                        ) : (
                                            solutions.map((solution) => (
                                                <motion.button
                                                    key={solution.id}
                                                    onClick={() => setSelectedSolution(solution)}
                                                    whileHover={{ scale: 1.03, y: -2 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left overflow-hidden group ${
                                                        selectedSolution?.id === solution.id
                                                            ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-800/20 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/20'
                                                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 hover:shadow-md'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-2 sm:gap-3 mb-2">
                                                        <div className={`flex-shrink-0 mt-0.5 w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                                                            selectedSolution?.id === solution.id
                                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                                : 'text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                                                        }`}>
                                                            {solution.icon}
                                                        </div>
                                                        <div className="flex-1 min-w-0 overflow-hidden">
                                                            <h4 className={`text-xs sm:text-sm font-bold leading-tight mb-1 line-clamp-2 break-words transition-colors ${
                                                                selectedSolution?.id === solution.id
                                                                    ? 'text-slate-900 dark:text-white'
                                                                    : 'text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'
                                                            }`}>
                                                                {solution.title}
                                                            </h4>
                                                            <p className={`text-[10px] sm:text-xs leading-tight line-clamp-2 break-words transition-colors ${
                                                                selectedSolution?.id === solution.id
                                                                    ? 'text-slate-600 dark:text-slate-300'
                                                                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                                                            }`}>
                                                                {solution.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            ))
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>

                    {/* Right Sidebar - SOLUTION SUMMARY */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden lg:w-80 flex-shrink-0 flex flex-col"
                    >
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 px-4 py-3 border-b border-emerald-600/20">
                            <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Solution Summary
                            </h3>
                        </div>
                        <AnimatePresence mode="wait">
                            {selectedSolution ? (
                                <motion.div
                                    key={selectedSolution.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-5 flex-1 flex flex-col bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-900/50"
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                                            <div className="w-6 h-6">
                                                {selectedSolution.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white break-words leading-tight">
                                            {selectedSolution.title}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed break-words">
                                        {selectedSolution.description}
                                    </p>
                                    <div className="space-y-2.5 mb-5 flex-1">
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                                            Features
                                        </p>
                                        {selectedSolution.features.map((feature, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="flex items-start gap-3 bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-lg px-3 py-2.5 border border-emerald-200/50 dark:border-emerald-800/50"
                                            >
                                                <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-sm text-slate-700 dark:text-slate-300 break-words font-medium">{feature}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <motion.button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleLearnMore()
                                        }}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-cta-green-500 to-cta-green-600 hover:from-cta-green-600 hover:to-cta-green-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-cta-green-500/30 hover:shadow-xl hover:shadow-cta-green-500/40 transition-all duration-200 cursor-pointer break-words mt-auto flex items-center justify-center gap-2"
                                    >
                                        <span>Explore {selectedSolution.title}</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6"
                                >
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mb-4 shadow-inner">
                                        <svg className="w-8 h-8 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        No Solution Selected
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-500">
                                        Click on a solution card to view details
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

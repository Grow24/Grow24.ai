import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from '@tanstack/react-router'

interface Solution {
  id: string
  name: string
  icon: JSX.Element
  color: string
  features: string[]
}

const solutionColumns = {
  goals: [
    {
      id: 'goal-1',
      name: 'Define Goals',
      color: 'from-blue-400 to-blue-600',
      features: ['Clarity', 'Focus', 'Direction'],
    },
    {
      id: 'goal-2',
      name: 'Set KPIs',
      color: 'from-blue-400 to-blue-600',
      features: ['Metrics', 'Tracking', 'Accountability'],
    },
    {
      id: 'goal-3',
      name: 'Alignment',
      color: 'from-blue-400 to-blue-600',
      features: ['Sync', 'Harmony', 'Coherence'],
    },
  ],
  strategy: [
    {
      id: 'strat-1',
      name: 'Strategic Plan',
      color: 'from-purple-400 to-purple-600',
      features: ['Analysis', 'Roadmap', 'Execution'],
    },
    {
      id: 'strat-2',
      name: 'Risk Management',
      color: 'from-purple-400 to-purple-600',
      features: ['Mitigation', 'Contingency', 'Resilience'],
    },
    {
      id: 'strat-3',
      name: 'Resource Allocation',
      color: 'from-purple-400 to-purple-600',
      features: ['Optimization', 'Efficiency', 'ROI'],
    },
  ],
  plan: [
    {
      id: 'plan-1',
      name: 'Detailed Planning',
      color: 'from-pink-400 to-pink-600',
      features: ['Timeline', 'Milestones', 'Deliverables'],
    },
    {
      id: 'plan-2',
      name: 'Team Coordination',
      color: 'from-pink-400 to-pink-600',
      features: ['Collaboration', 'Communication', 'Workflow'],
    },
    {
      id: 'plan-3',
      name: 'Budget Planning',
      color: 'from-pink-400 to-pink-600',
      features: ['Forecasting', 'Allocation', 'Control'],
    },
  ],
  project: [
    {
      id: 'proj-1',
      name: 'Project Management',
      color: 'from-amber-400 to-amber-600',
      features: ['Tracking', 'Agile', 'Delivery'],
    },
    {
      id: 'proj-2',
      name: 'Stakeholder Mgmt',
      color: 'from-amber-400 to-amber-600',
      features: ['Engagement', 'Communication', 'Satisfaction'],
    },
    {
      id: 'proj-3',
      name: 'Quality Assurance',
      color: 'from-amber-400 to-amber-600',
      features: ['Standards', 'Testing', 'Excellence'],
    },
  ],
  operations: [
    {
      id: 'ops-1',
      name: 'Process Optimization',
      color: 'from-green-400 to-green-600',
      features: ['Efficiency', 'Automation', 'Scaling'],
    },
    {
      id: 'ops-2',
      name: 'Performance Monitoring',
      color: 'from-green-400 to-green-600',
      features: ['Analytics', 'Dashboards', 'Insights'],
    },
    {
      id: 'ops-3',
      name: 'Continuous Improvement',
      color: 'from-green-400 to-green-600',
      features: ['Iteration', 'Feedback', 'Growth'],
    },
  ],
}

interface SolutionCardProps {
  solution: Solution
  isSelected: boolean
  onSelect: (id: string) => void
}

const SolutionCard: React.FC<SolutionCardProps> = ({ solution, isSelected, onSelect }) => {
  return (
    <motion.button
      onClick={() => onSelect(solution.id)}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`relative w-full p-4 rounded-xl transition-all duration-300 ${
        isSelected
          ? `glass bg-gradient-to-br ${solution.color} text-white shadow-lg`
          : 'glass bg-white/5 border border-white/20 hover:bg-white/10 text-slate-700 dark:text-slate-300'
      }`}
    >
      <div className="text-sm font-semibold mb-2">{solution.name}</div>
      <div className="text-xs opacity-75 line-clamp-2">{solution.features.join(' • ')}</div>

      {isSelected && (
        <motion.div
          layoutId="selected-indicator"
          className="absolute inset-0 rounded-xl border-2 border-white pointer-events-none"
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  )
}

interface SolutionSummaryProps {
  solution: Solution | null
}

const SolutionSummary: React.FC<SolutionSummaryProps> = ({ solution }) => {
  return (
    <motion.div
      key={solution?.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass bg-white/10 rounded-2xl p-8 h-full flex flex-col"
    >
      <div className="mb-6">
        <div
          className={`inline-block w-12 h-12 rounded-lg bg-gradient-to-br ${solution?.color} opacity-20 mb-4`}
        />
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {solution?.name}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Strategic solution for modern enterprises
        </p>
      </div>

      <div className="flex-1">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Key Features:
        </h4>
        <ul className="space-y-2">
          {solution?.features.map((feature) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {feature}
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 w-full px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:shadow-lg transition-shadow duration-300"
      >
        Learn More
      </motion.button>
    </motion.div>
  )
}

export const SolutionsGrid: React.FC = () => {
  const [selectedSolution, setSelectedSolution] = useState<string | null>(
    solutionColumns.goals[0].id,
  )

  const selected = Object.values(solutionColumns)
    .flat()
    .find((s) => s.id === selectedSolution) || null

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-cyan-50/30 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-gradient">
            Solutions
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            Comprehensive solutions across Goals, Strategy, Planning, Projects, and Operations
          </p>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          {/* Goals Column */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-4">Goals</h3>
            {solutionColumns.goals.map((solution) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                isSelected={selectedSolution === solution.id}
                onSelect={setSelectedSolution}
              />
            ))}
          </motion.div>

          {/* Strategy Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-4">
              Strategy
            </h3>
            {solutionColumns.strategy.map((solution) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                isSelected={selectedSolution === solution.id}
                onSelect={setSelectedSolution}
              />
            ))}
          </motion.div>

          {/* Plan Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-pink-700 dark:text-pink-300 mb-4">Plan</h3>
            {solutionColumns.plan.map((solution) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                isSelected={selectedSolution === solution.id}
                onSelect={setSelectedSolution}
              />
            ))}
          </motion.div>

          {/* Project Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300 mb-4">
              Project
            </h3>
            {solutionColumns.project.map((solution) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                isSelected={selectedSolution === solution.id}
                onSelect={setSelectedSolution}
              />
            ))}
          </motion.div>

          {/* Operations Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-green-700 dark:text-green-300 mb-4">
              Operations
            </h3>
            {solutionColumns.operations.map((solution) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                isSelected={selectedSolution === solution.id}
                onSelect={setSelectedSolution}
              />
            ))}
          </motion.div>
        </div>

        {/* Solution Summary Panel */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            {selected && <SolutionSummary key={selected.id} solution={selected} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default SolutionsGrid

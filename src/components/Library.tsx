import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComingSoon } from '../contexts/ComingSoonContext'

// Icons
const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// Filter data structures
interface FilterOption {
  id: string
  label: string
  children?: FilterOption[]
}

const industryFilters: FilterOption[] = [
  {
    id: 'automobile',
    label: 'Automobile',
  },
  {
    id: 'autocomponent',
    label: 'Autocomponent',
  },
  {
    id: 'consumer-products',
    label: 'Consumer Products',
    children: [
      { id: 'fmcg', label: 'FMCG' },
      { id: 'durables', label: 'Durables' },
    ],
  },
]

const contentTypeFilters: FilterOption[] = [
  { id: 'article', label: 'Article' },
  { id: 'case-study', label: 'Case Study' },
  { id: 'white-paper', label: 'White Paper' },
  { id: 'template', label: 'Template' },
]

const deliveryTypeFilters: FilterOption[] = [
  { id: 'audio', label: 'Audio' },
  { id: 'video', label: 'Video' },
  { id: 'webinar', label: 'Webinar' },
  { id: 'multimedia', label: 'Multimedia' },
]

const roleFilters: FilterOption[] = [
  { id: 'executive', label: 'Executive' },
  { id: 'manager', label: 'Manager' },
  { id: 'individual-contributor', label: 'Individual Contributor' },
  { id: 'entrepreneur', label: 'Entrepreneur' },
]

const topicFilters: FilterOption[] = [
  { id: 'strategy', label: 'Strategy' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'operations', label: 'Operations' },
  { id: 'finance', label: 'Finance' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'sales', label: 'Sales' },
]

const trainingTypeFilters: FilterOption[] = [
  { id: 'self-paced', label: 'Self-Paced' },
  { id: 'instructor-led', label: 'Instructor-Led' },
  { id: 'in-person', label: 'In-Person' },
  { id: 'virtual', label: 'Virtual' },
  { id: 'hybrid', label: 'Hybrid' },
]

interface FilterState {
  [key: string]: Set<string>
}

export default function Library() {
  const { showComingSoon } = useComingSoon()
  const [activeTab, setActiveTab] = useState<'information' | 'training'>('information')
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set())
  const [informationFilters, setInformationFilters] = useState<FilterState>({})
  const [trainingFilters, setTrainingFilters] = useState<FilterState>({})

  const currentFilters = activeTab === 'information' ? informationFilters : trainingFilters
  const setCurrentFilters = activeTab === 'information' ? setInformationFilters : setTrainingFilters

  const toggleFilterExpanded = (filterId: string) => {
    setExpandedFilters((prev) => {
      const next = new Set(prev)
      if (next.has(filterId)) {
        next.delete(filterId)
      } else {
        next.add(filterId)
      }
      return next
    })
  }

  const toggleFilterOption = (filterGroup: string, optionId: string, parentId?: string) => {
    setCurrentFilters((prev) => {
      const key = parentId ? `${filterGroup}-${parentId}` : filterGroup
      const current = prev[key] || new Set<string>()
      const next = new Set(current)

      if (next.has(optionId)) {
        next.delete(optionId)
      } else {
        next.add(optionId)
      }

      return {
        ...prev,
        [key]: next.size > 0 ? next : undefined,
      }
    })
  }

  const isFilterSelected = (filterGroup: string, optionId: string, parentId?: string): boolean => {
    const key = parentId ? `${filterGroup}-${parentId}` : filterGroup
    return currentFilters[key]?.has(optionId) || false
  }

  const clearAllFilters = () => {
    if (activeTab === 'information') {
      setInformationFilters({})
    } else {
      setTrainingFilters({})
    }
  }

  const hasActiveFilters = useMemo(() => {
    const filters = activeTab === 'information' ? informationFilters : trainingFilters
    return Object.values(filters).some((filterSet) => filterSet && filterSet.size > 0)
  }, [activeTab, informationFilters, trainingFilters])

  const FilterGroup: React.FC<{
    title: string
    filterId: string
    options: FilterOption[]
    filterGroup: string
    isNested?: boolean
  }> = ({ title, filterId, options, filterGroup, isNested = false }) => {
    const isExpanded = expandedFilters.has(filterId)

    return (
      <div className={isNested ? "rounded-md overflow-hidden" : "border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800"}>
        <button
          onClick={() => toggleFilterExpanded(filterId)}
          className={`w-full ${isNested ? 'px-3 py-2' : 'px-4 py-3'} flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${isNested ? 'bg-transparent' : ''}`}
        >
          <span className={`font-semibold text-slate-900 dark:text-white ${isNested ? 'text-xs' : 'text-sm'}`}>{title}</span>
          <ChevronDownIcon isOpen={isExpanded} />
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className={`${isNested ? 'px-3 py-2' : 'px-4 py-2'} ${isNested ? '' : 'border-t border-slate-200 dark:border-slate-700'} bg-slate-50 dark:bg-slate-900/50 space-y-1`}>
                {options.map((option) => (
                  <div key={option.id}>
                    <label className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-white dark:hover:bg-slate-800 rounded transition-colors group">
                      <div className="relative flex items-center justify-center w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded group-hover:border-emerald-500 dark:group-hover:border-emerald-500 transition-colors">
                        {isFilterSelected(filterGroup, option.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 bg-emerald-500 rounded flex items-center justify-center"
                          >
                            <CheckIcon />
                          </motion.div>
                        )}
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{option.label}</span>
                      <input
                        type="checkbox"
                        checked={isFilterSelected(filterGroup, option.id)}
                        onChange={() => toggleFilterOption(filterGroup, option.id)}
                        className="sr-only"
                      />
                    </label>
                    {option.children && (
                      <div className="ml-7 mt-1 space-y-1">
                        {option.children.map((child) => (
                          <label
                            key={child.id}
                            className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-white dark:hover:bg-slate-800 rounded transition-colors group"
                          >
                            <div className="relative flex items-center justify-center w-4 h-4 border-2 border-slate-300 dark:border-slate-600 rounded group-hover:border-emerald-500 dark:group-hover:border-emerald-500 transition-colors">
                              {isFilterSelected(filterGroup, child.id, option.id) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute inset-0 bg-emerald-500 rounded flex items-center justify-center"
                                >
                                  <CheckIcon />
                                </motion.div>
                              )}
                            </div>
                            <span className="text-xs text-slate-600 dark:text-slate-400 flex-1">{child.label}</span>
                            <input
                              type="checkbox"
                              checked={isFilterSelected(filterGroup, child.id, option.id)}
                              onChange={() => toggleFilterOption(filterGroup, child.id, option.id)}
                              className="sr-only"
                            />
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-emerald-700 to-slate-900 dark:from-white dark:via-emerald-400 dark:to-white bg-clip-text text-transparent mb-2">
            Library
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium">
            Access curated information and training resources
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('information')}
            className={`px-6 py-3 font-semibold text-sm transition-all relative ${
              activeTab === 'information'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Get Information
            {activeTab === 'information' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`px-6 py-3 font-semibold text-sm transition-all relative ${
              activeTab === 'training'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Get Training
            {activeTab === 'training' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400"
              />
            )}
          </button>
        </div>

        {/* Filters and Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:w-80 flex-shrink-0 space-y-4"
          >
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                  Filters
                </h2>
                {hasActiveFilters && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={clearAllFilters}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    Clear All
                  </motion.button>
                )}
              </div>

              <div className="space-y-3">
                <AnimatePresence mode="wait">
                  {activeTab === 'information' ? (
                    <motion.div
                      key="information-filters"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {/* Information parent group with nested filters */}
                      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                        <button
                          onClick={() => toggleFilterExpanded('information-group')}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <span className="font-semibold text-slate-900 dark:text-white text-sm">Information</span>
                          <ChevronDownIcon isOpen={expandedFilters.has('information-group')} />
                        </button>
                        <AnimatePresence>
                          {expandedFilters.has('information-group') && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                                <FilterGroup
                                  title="Content Type"
                                  filterId="content-type"
                                  options={contentTypeFilters}
                                  filterGroup="contentType"
                                  isNested={true}
                                />
                                <FilterGroup
                                  title="Delivery Type"
                                  filterId="delivery-type"
                                  options={deliveryTypeFilters}
                                  filterGroup="deliveryType"
                                  isNested={true}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="training-filters"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      <FilterGroup
                        title="Role"
                        filterId="role"
                        options={roleFilters}
                        filterGroup="role"
                      />
                      <FilterGroup
                        title="Topic"
                        filterId="topic"
                        options={topicFilters}
                        filterGroup="topic"
                      />
                      <FilterGroup
                        title="Industry"
                        filterId="industry"
                        options={industryFilters}
                        filterGroup="industry"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 min-w-0"
          >
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'information' ? (
                  <motion.div
                    key="information-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
                      Information resources will be displayed here
                    </p>
                    <motion.button
                      onClick={() => showComingSoon('library-information', 'Access Information', 'Enter your email to access information resources.')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-cta-green-500 to-cta-green-600 hover:from-cta-green-600 hover:to-cta-green-700 text-white font-semibold rounded-lg shadow-lg transition-all"
                    >
                      Browse Information
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="training-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
                      Training resources will be displayed here
                    </p>
                    <motion.button
                      onClick={() => showComingSoon('library-training', 'Access Training', 'Enter your email to access training resources.')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-cta-green-500 to-cta-green-600 hover:from-cta-green-600 hover:to-cta-green-700 text-white font-semibold rounded-lg shadow-lg transition-all"
                    >
                      Browse Training
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

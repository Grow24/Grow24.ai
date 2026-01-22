import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearch } from '@tanstack/react-router'
import { useComingSoon } from '../contexts/ComingSoonContext'

// SVG Icons
const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// Sample data
const mockResources = [
  {
    id: '1',
    title: 'Getting Started with Goal Setting',
    contentType: 'ARTICLE',
    topic: 'PERSONAL_GROWTH',
    deliveryType: 'SELF_PACED',
    role: 'ALL_ROLES',
    journeyStage: 'AWARENESS',
    duration: 15,
    difficulty: 'BEGINNER',
    tags: ['goals', 'planning', 'personal'],
  },
  {
    id: '2',
    title: 'Advanced Project Management Masterclass',
    contentType: 'WEBINAR',
    topic: 'PROJECT_MANAGEMENT',
    deliveryType: 'INSTRUCTOR_LED',
    role: 'MANAGER',
    journeyStage: 'IMPLEMENTATION',
    duration: 120,
    difficulty: 'ADVANCED',
    tags: ['project', 'management', 'leadership'],
  },
  {
    id: '3',
    title: 'Financial Planning Framework',
    contentType: 'WHITEPAPER',
    topic: 'FINANCIAL_PLANNING',
    deliveryType: 'SELF_PACED',
    role: 'EXECUTIVE',
    journeyStage: 'DECISION',
    duration: 45,
    difficulty: 'INTERMEDIATE',
    tags: ['finance', 'planning', 'strategy'],
  },
  {
    id: '4',
    title: 'Communication Skills for Leaders',
    contentType: 'VIDEO',
    topic: 'COMMUNICATION',
    deliveryType: 'SELF_PACED',
    role: 'MANAGER',
    journeyStage: 'IMPLEMENTATION',
    duration: 30,
    difficulty: 'INTERMEDIATE',
    tags: ['communication', 'leadership'],
  },
  {
    id: '5',
    title: 'Strategic Planning Workshop',
    contentType: 'WORKSHOP',
    topic: 'STRATEGIC_PLANNING',
    deliveryType: 'LIVE_SESSION',
    role: 'EXECUTIVE',
    journeyStage: 'CONSIDERATION',
    duration: 180,
    difficulty: 'ADVANCED',
    tags: ['strategy', 'planning', 'business'],
  },
]

type FilterType = 'contentType' | 'topic' | 'deliveryType' | 'role' | 'journeyStage'

interface FilterConfig {
  label: string
  options: string[]
}

const filterConfigs: Record<FilterType, FilterConfig> = {
  contentType: {
    label: 'Content Type',
    options: ['ARTICLE', 'VIDEO', 'WEBINAR', 'CASE_STUDY', 'WHITEPAPER', 'TEMPLATE'],
  },
  topic: {
    label: 'Topic',
    options: [
      'PERSONAL_GROWTH',
      'CAREER_DEVELOPMENT',
      'PROJECT_MANAGEMENT',
      'FINANCIAL_PLANNING',
      'COMMUNICATION',
      'LEADERSHIP',
    ],
  },
  deliveryType: {
    label: 'Delivery Type',
    options: ['SELF_PACED', 'INSTRUCTOR_LED', 'LIVE_SESSION', 'WORKSHOP'],
  },
  role: {
    label: 'Role',
    options: ['EXECUTIVE', 'MANAGER', 'INDIVIDUAL_CONTRIBUTOR', 'ENTREPRENEUR', 'ALL_ROLES'],
  },
  journeyStage: {
    label: 'Journey Stage',
    options: ['AWARENESS', 'CONSIDERATION', 'DECISION', 'IMPLEMENTATION', 'OPTIMIZATION'],
  },
}

interface ResourceCardProps {
  resource: (typeof mockResources)[0]
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const { showComingSoon } = useComingSoon()
  const difficultyColors = {
    BEGINNER: 'from-green-400 to-green-600',
    INTERMEDIATE: 'from-blue-400 to-blue-600',
    ADVANCED: 'from-purple-400 to-purple-600',
    EXPERT: 'from-red-400 to-red-600',
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-slate-800 dark:bg-slate-900 rounded-xl p-6 border border-slate-700 dark:border-slate-700 hover:border-emerald-500/50 transition-all duration-300 shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {resource.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${
            difficultyColors[resource.difficulty as keyof typeof difficultyColors]
          }`}
        >
          {resource.difficulty}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-1 h-1 rounded-full bg-emerald-500" />
          {resource.contentType.replace(/_/g, ' ')}
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-1 h-1 rounded-full bg-emerald-500" />
          {resource.deliveryType.replace(/_/g, ' ')}
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-1 h-1 rounded-full bg-emerald-500" />
          {resource.role.replace(/_/g, ' ')}
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-1 h-1 rounded-full bg-emerald-500" />
          {resource.duration} min
        </div>
      </div>

      <motion.button
        onClick={() => showComingSoon('resource-hub', 'Access Resource', 'Enter your email to access this resource and stay updated.')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:shadow-lg transition-shadow duration-300"
      >
        View Resource
      </motion.button>
    </motion.div>
  )
}

export const ResourceHub: React.FC = () => {
  const [filters, setFilters] = useState<Partial<Record<FilterType, string[]>>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [openFilterGroup, setOpenFilterGroup] = useState<FilterType | null>(null)

  // Filter resources based on active filters
  const filteredResources = useMemo(() => {
    return mockResources.filter((resource) => {
      // Search query filter
      if (
        searchQuery &&
        !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false
      }

      // Faceted filters
      for (const [filterKey, selectedValues] of Object.entries(filters)) {
        if (selectedValues && selectedValues.length > 0) {
          const resourceValue = resource[filterKey as FilterType]
          if (!selectedValues.includes(resourceValue)) {
            return false
          }
        }
      }

      return true
    })
  }, [filters, searchQuery])

  const toggleFilter = (filterType: FilterType, value: string) => {
    setFilters((prev) => {
      const current = prev[filterType] || []
      const isSelected = current.includes(value)

      return {
        ...prev,
        [filterType]: isSelected ? current.filter((v) => v !== value) : [...current, value],
      }
    })
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Resource Hub</h1>
          <p className="text-xl text-slate-300 mb-8">
            Explore our comprehensive library of resources tailored to your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-4">
              {/* Clear Filters */}
              {Object.values(filters).some((f) => f?.length) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="w-full px-4 py-2 rounded-lg bg-red-500/20 text-red-700 dark:text-red-300 hover:bg-red-500/30 transition-colors duration-300 text-sm font-medium"
                >
                  Clear All Filters
                </motion.button>
              )}

              {/* Filter Groups */}
              {(Object.entries(filterConfigs) as [FilterType, FilterConfig][]).map(
                ([filterType, config]) => (
                  <motion.div
                    key={filterType}
                    className="bg-slate-800 dark:bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg"
                  >
                    <button
                      onClick={() =>
                        setOpenFilterGroup(openFilterGroup === filterType ? null : filterType)
                      }
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-700 transition-colors duration-200"
                    >
                      <h3 className="font-semibold text-white text-sm">
                        {config.label}
                      </h3>
                      <motion.svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        animate={{ rotate: openFilterGroup === filterType ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </motion.svg>
                    </button>

                    <AnimatePresence>
                      {openFilterGroup === filterType && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-700 bg-slate-700/50 p-4 space-y-2"
                        >
                          {config.options.map((option) => (
                            <motion.label
                              key={option}
                              whileHover={{ x: 5 }}
                              className="flex items-center gap-3 cursor-pointer text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={filters[filterType]?.includes(option) || false}
                                onChange={() => toggleFilter(filterType, option)}
                                className="w-4 h-4 rounded border-2 border-emerald-500 text-emerald-600 focus:ring-2 focus:ring-emerald-500 cursor-pointer bg-slate-800"
                              />
                              <span className="text-slate-300">
                                {option.replace(/_/g, ' ')}
                              </span>
                            </motion.label>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ),
              )}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {/* Search Bar */}
            <div className="mb-8 relative">
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {Object.values(filters).some((f) => f?.length) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 flex flex-wrap gap-2">
                {(Object.entries(filters) as [FilterType, string[] | undefined][]).map(
                  ([filterType, values]) =>
                    values?.map((value) => (
                      <motion.button
                        key={`${filterType}-${value}`}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => toggleFilter(filterType, value)}
                        className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium hover:bg-emerald-500/30 transition-colors duration-300 flex items-center gap-2"
                      >
                        {value.replace(/_/g, ' ')}
                        <CloseIcon />
                      </motion.button>
                    )),
                )}
              </motion.div>
            )}

            {/* Results */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {filteredResources.length} Resources Found
              </h2>
            </div>

            {/* Resource Grid */}
            {filteredResources.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredResources.map((resource, idx) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ResourceCard resource={resource} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-slate-300 text-lg mb-4">
                  No resources found matching your filters
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors duration-300"
                >
                  Reset Filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ResourceHub

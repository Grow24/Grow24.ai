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
  const { cardRef, rotateX, rotateY, style } = use3DRotation({ 
    intensity: 10, // Moderate rotation for resource cards
    perspective: 1000 
  })
  const difficultyColors = {
    BEGINNER: 'from-green-400 to-green-600',
    INTERMEDIATE: 'from-blue-400 to-blue-600',
    ADVANCED: 'from-purple-400 to-purple-600',
    EXPERT: 'from-red-400 to-red-600',
  }

  return (
    <motion.div
      ref={cardRef}
      style={{
        ...style,
        rotateX,
        rotateY,
      }}
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
        onClick={() => showComingSoon('resource-hub', 'Access Resource', 'Enter your email to access this resource and stay updated.', { resourceTitle: resource.title })}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-cta-green-500 to-cta-green-600 text-white font-medium hover:shadow-lg transition-shadow duration-300"
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
    <div className="min-h-screen py-12 sm:py-16 md:py-20 pt-20 sm:pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">Resource Hub</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300 mb-8">
            Explore our comprehensive library of resources tailored to your needs
          </p>
        </motion.div>

        {/* Filters Section - Top */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
            {(Object.entries(filterConfigs) as [FilterType, FilterConfig][]).map(
              ([filterType, config]) =>
                config.options.map((option) => {
                  const isSelected = filters[filterType]?.includes(option) || false
                  return (
                    <button
                      key={`${filterType}-${option}`}
                      onClick={() => toggleFilter(filterType, option)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        isSelected
                          ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 shadow-md'
                          : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {config.label}: {option.replace(/_/g, ' ')}
                    </button>
                  )
                }),
            )}
          </div>
          {Object.values(filters).some((f) => f?.length) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-700 dark:text-red-300 hover:bg-red-500/30 transition-colors duration-300 text-sm font-medium"
            >
              Clear All Filters
            </motion.button>
          )}
        </div>

        {/* Dashboard Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          {/* Search Bar */}
          <div className="mb-8 relative">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
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
              className="text-center py-6 sm:py-8 md:py-12"
            >
              <p className="text-gray-600 dark:text-slate-300 text-lg mb-4">
                No resources found matching your filters
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 rounded-lg bg-cta-green-500 text-white font-medium hover:bg-cta-green-600 transition-colors duration-300"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ResourceHub

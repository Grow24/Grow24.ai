import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComingSoon } from '../contexts/ComingSoonContext'

// Icons
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

// Resource data
interface Resource {
  id: string
  title: string
  contentType?: string
  deliveryType?: string
  role?: string
  topic?: string
  industry?: string
  duration: number
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  tags: string[]
}

const informationResources: Resource[] = [
  {
    id: 'info-1',
    title: 'Strategic Planning Best Practices',
    contentType: 'article',
    deliveryType: 'audio',
    duration: 15,
    difficulty: 'INTERMEDIATE',
    tags: ['strategy', 'planning', 'business'],
  },
  {
    id: 'info-2',
    title: 'Digital Transformation Case Study',
    contentType: 'case-study',
    deliveryType: 'video',
    duration: 20,
    difficulty: 'ADVANCED',
    tags: ['digital', 'transformation', 'case-study'],
  },
  {
    id: 'info-3',
    title: 'Innovation Framework White Paper',
    contentType: 'white-paper',
    deliveryType: 'multimedia',
    duration: 30,
    difficulty: 'ADVANCED',
    tags: ['innovation', 'framework', 'research'],
  },
  {
    id: 'info-4',
    title: 'Project Management Template',
    contentType: 'template',
    deliveryType: 'webinar',
    duration: 10,
    difficulty: 'BEGINNER',
    tags: ['project', 'management', 'template'],
  },
  {
    id: 'info-5',
    title: 'Leadership Communication Guide',
    contentType: 'article',
    deliveryType: 'audio',
    duration: 25,
    difficulty: 'INTERMEDIATE',
    tags: ['leadership', 'communication'],
  },
  {
    id: 'info-6',
    title: 'Financial Planning Case Study',
    contentType: 'case-study',
    deliveryType: 'video',
    duration: 18,
    difficulty: 'ADVANCED',
    tags: ['finance', 'planning', 'case-study'],
  },
]

const trainingResources: Resource[] = [
  {
    id: 'train-1',
    title: 'Executive Leadership Program',
    role: 'executive',
    topic: 'leadership',
    industry: 'automobile',
    duration: 120,
    difficulty: 'ADVANCED',
    tags: ['leadership', 'executive', 'training'],
  },
  {
    id: 'train-2',
    title: 'Manager Development Workshop',
    role: 'manager',
    topic: 'operations',
    industry: 'consumer-products',
    duration: 90,
    difficulty: 'INTERMEDIATE',
    tags: ['management', 'workshop', 'development'],
  },
  {
    id: 'train-3',
    title: 'Strategic Thinking for Entrepreneurs',
    role: 'entrepreneur',
    topic: 'strategy',
    industry: 'autocomponent',
    duration: 60,
    difficulty: 'INTERMEDIATE',
    tags: ['strategy', 'entrepreneurship'],
  },
  {
    id: 'train-4',
    title: 'Individual Contributor Skills Training',
    role: 'individual-contributor',
    topic: 'finance',
    industry: 'fmcg',
    duration: 45,
    difficulty: 'BEGINNER',
    tags: ['skills', 'training', 'development'],
  },
  {
    id: 'train-5',
    title: 'Marketing Excellence Program',
    role: 'manager',
    topic: 'marketing',
    industry: 'durables',
    duration: 100,
    difficulty: 'ADVANCED',
    tags: ['marketing', 'excellence', 'program'],
  },
  {
    id: 'train-6',
    title: 'Sales Mastery Training',
    role: 'individual-contributor',
    topic: 'sales',
    industry: 'consumer-products',
    duration: 75,
    difficulty: 'INTERMEDIATE',
    tags: ['sales', 'mastery', 'training'],
  },
]

interface FilterState {
  [key: string]: Set<string>
}

interface ResourceCardProps {
  resource: Resource
  type: 'information' | 'training'
}

const ResourceCard: React.FC<ResourceCardProps> = React.memo(({ resource, type }) => {
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
            difficultyColors[resource.difficulty]
          }`}
        >
          {resource.difficulty}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        {type === 'information' ? (
          <>
            {resource.contentType && (
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                {resource.contentType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            )}
            {resource.deliveryType && (
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                {resource.deliveryType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            )}
          </>
        ) : (
          <>
            {resource.role && (
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                {resource.role.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            )}
            {resource.topic && (
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                {resource.topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            )}
          </>
        )}
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-1 h-1 rounded-full bg-emerald-500" />
          {resource.duration} min
        </div>
      </div>

      <motion.button
        onClick={() => showComingSoon(`library-${type}`, 'Access Resource', `Enter your email to access this ${type} resource.`)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-cta-green-500 to-cta-green-600 text-white font-medium hover:shadow-lg transition-shadow duration-300"
      >
        View Resource
      </motion.button>
    </motion.div>
  )
})

ResourceCard.displayName = 'ResourceCard'

// FilterGroup component - defined outside to prevent recreation
interface FilterGroupProps {
  title: string
  filterId: string
  options: FilterOption[]
  filterGroup: string
  isNested?: boolean
  isExpanded: boolean
  onToggleExpand: (filterId: string) => void
  onToggleFilter: (filterGroup: string, optionId: string, parentId?: string) => void
  isFilterSelected: (filterGroup: string, optionId: string, parentId?: string) => boolean
}

const FilterGroup: React.FC<FilterGroupProps> = React.memo(({ 
  title, 
  filterId, 
  options, 
  filterGroup, 
  isNested = false,
  isExpanded,
  onToggleExpand,
  onToggleFilter,
  isFilterSelected
}) => {
  return (
    <div className={isNested ? "rounded-md overflow-hidden" : "border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800"}>
      <button
        onClick={() => onToggleExpand(filterId)}
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
              {options.map((option) => {
                const isSelected = isFilterSelected(filterGroup, option.id)
                
                return (
                  <div key={option.id}>
                    <FilterCheckbox
                      option={option}
                      filterGroup={filterGroup}
                      isSelected={isSelected}
                      onToggle={() => onToggleFilter(filterGroup, option.id)}
                    />
                    {option.children && (
                      <div className="ml-7 mt-1 space-y-1">
                        {option.children.map((child) => {
                          const isChildSelected = isFilterSelected(filterGroup, child.id, option.id)
                          
                          return (
                            <FilterCheckbox
                              key={child.id}
                              option={child}
                              filterGroup={filterGroup}
                              isSelected={isChildSelected}
                              onToggle={() => onToggleFilter(filterGroup, child.id, option.id)}
                              isChild={true}
                              parentId={option.id}
                            />
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}, (prevProps, nextProps) => {
  // Re-render if structural props change OR if filter selection callback changes
  // This ensures checkboxes update when selections change, but prevents unnecessary re-renders
  const structuralPropsEqual = (
    prevProps.title === nextProps.title &&
    prevProps.filterId === nextProps.filterId &&
    prevProps.filterGroup === nextProps.filterGroup &&
    prevProps.isNested === nextProps.isNested &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.options === nextProps.options &&
    prevProps.onToggleExpand === nextProps.onToggleExpand &&
    prevProps.onToggleFilter === nextProps.onToggleFilter
  )
  
  // If structural props are equal but filter selection callback changed, allow re-render
  // This ensures checkboxes update when filters change
  if (!structuralPropsEqual) return false
  
  // If filter callback changed, we need to re-render to update checkbox states
  if (prevProps.isFilterSelected !== nextProps.isFilterSelected) return false
  
  return true
})

FilterGroup.displayName = 'FilterGroup'

// Memoized checkbox item to prevent unnecessary re-renders
const FilterCheckbox: React.FC<{
  option: FilterOption
  filterGroup: string
  isSelected: boolean
  onToggle: () => void
  isChild?: boolean
  parentId?: string
}> = React.memo(({ option, isSelected, onToggle, isChild = false }) => {
  return (
    <label className={`flex items-center gap-2 ${isChild ? 'px-2 py-1.5' : 'px-2 py-2'} cursor-pointer hover:bg-white dark:hover:bg-slate-800 rounded transition-colors group`}>
      <div className={`relative flex items-center justify-center ${isChild ? 'w-4 h-4' : 'w-5 h-5'} border-2 border-slate-300 dark:border-slate-600 rounded group-hover:border-emerald-500 dark:group-hover:border-emerald-500 transition-colors`}>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 bg-emerald-500 rounded flex items-center justify-center"
          >
            <CheckIcon />
          </motion.div>
        )}
      </div>
      <span className={`${isChild ? 'text-xs' : 'text-sm'} ${isChild ? 'text-slate-600 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'} flex-1`}>{option.label}</span>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        className="sr-only"
      />
    </label>
  )
}, (prevProps, nextProps) => {
  return prevProps.isSelected === nextProps.isSelected && prevProps.option.id === nextProps.option.id
})

FilterCheckbox.displayName = 'FilterCheckbox'

export default function Library() {
  const { showComingSoon } = useComingSoon()
  const [activeTab, setActiveTab] = useState<'information' | 'training'>('information')
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set())
  const [informationFilters, setInformationFilters] = useState<FilterState>({})
  const [trainingFilters, setTrainingFilters] = useState<FilterState>({})
  const [searchQuery, setSearchQuery] = useState('')

  const currentFilters = activeTab === 'information' ? informationFilters : trainingFilters
  const setCurrentFilters = activeTab === 'information' ? setInformationFilters : setTrainingFilters

  const toggleFilterExpanded = useCallback((filterId: string) => {
    setExpandedFilters((prev) => {
      const next = new Set(prev)
      if (next.has(filterId)) {
        next.delete(filterId)
      } else {
        next.add(filterId)
      }
      return next
    })
  }, [])

  const toggleFilterOption = useCallback((filterGroup: string, optionId: string, parentId?: string) => {
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
  }, [setCurrentFilters])

  const isFilterSelected = useCallback((filterGroup: string, optionId: string, parentId?: string): boolean => {
    const key = parentId ? `${filterGroup}-${parentId}` : filterGroup
    return currentFilters[key]?.has(optionId) || false
  }, [currentFilters])

  const clearAllFilters = useCallback(() => {
    if (activeTab === 'information') {
      setInformationFilters({})
    } else {
      setTrainingFilters({})
    }
    setSearchQuery('')
  }, [activeTab])

  const hasActiveFilters = useMemo(() => {
    const filters = activeTab === 'information' ? informationFilters : trainingFilters
    return Object.values(filters).some((filterSet) => filterSet && filterSet.size > 0)
  }, [activeTab, informationFilters, trainingFilters])

  // Filter resources based on active filters
  const filteredResources = useMemo(() => {
    const resources = activeTab === 'information' ? informationResources : trainingResources
    
    return resources.filter((resource) => {
      // Search query filter
      if (
        searchQuery &&
        !resource.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false
      }

      // Apply filters based on active tab
      if (activeTab === 'information') {
        // Content Type filter
        const contentTypeFilter = currentFilters['contentType']
        if (contentTypeFilter && contentTypeFilter.size > 0) {
          if (!resource.contentType || !contentTypeFilter.has(resource.contentType)) {
            return false
          }
        }

        // Delivery Type filter
        const deliveryTypeFilter = currentFilters['deliveryType']
        if (deliveryTypeFilter && deliveryTypeFilter.size > 0) {
          if (!resource.deliveryType || !deliveryTypeFilter.has(resource.deliveryType)) {
            return false
          }
        }
      } else {
        // Role filter
        const roleFilter = currentFilters['role']
        if (roleFilter && roleFilter.size > 0) {
          if (!resource.role || !roleFilter.has(resource.role)) {
            return false
          }
        }

        // Topic filter
        const topicFilter = currentFilters['topic']
        if (topicFilter && topicFilter.size > 0) {
          if (!resource.topic || !topicFilter.has(resource.topic)) {
            return false
          }
        }

        // Industry filter (including nested)
        const industryFilter = currentFilters['industry']
        const consumerProductsFilter = currentFilters['industry-consumer-products']
        
        if (industryFilter && industryFilter.size > 0) {
          let matchesIndustry = false
          
          // Check direct industry match
          if (resource.industry && industryFilter.has(resource.industry)) {
            matchesIndustry = true
          }
          
          // Check nested consumer products
          if (resource.industry === 'fmcg' || resource.industry === 'durables') {
            if (industryFilter.has('consumer-products')) {
              matchesIndustry = true
            }
            // Check nested filters
            if (consumerProductsFilter && consumerProductsFilter.size > 0) {
              if (consumerProductsFilter.has(resource.industry)) {
                matchesIndustry = true
              } else {
                matchesIndustry = false
              }
            }
          }
          
          if (!matchesIndustry) {
            return false
          }
        }
      }

      return true
    })
  }, [activeTab, currentFilters, searchQuery])


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-20 pt-24 px-4 sm:px-6 lg:px-8">
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
                {activeTab === 'information' ? (
                  <div className="space-y-3">
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
                                isExpanded={expandedFilters.has('content-type')}
                                onToggleExpand={toggleFilterExpanded}
                                onToggleFilter={toggleFilterOption}
                                isFilterSelected={isFilterSelected}
                              />
                              <FilterGroup
                                title="Delivery Type"
                                filterId="delivery-type"
                                options={deliveryTypeFilters}
                                filterGroup="deliveryType"
                                isNested={true}
                                isExpanded={expandedFilters.has('delivery-type')}
                                onToggleExpand={toggleFilterExpanded}
                                onToggleFilter={toggleFilterOption}
                                isFilterSelected={isFilterSelected}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FilterGroup
                      title="Role"
                      filterId="role"
                      options={roleFilters}
                      filterGroup="role"
                      isExpanded={expandedFilters.has('role')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                    />
                    <FilterGroup
                      title="Topic"
                      filterId="topic"
                      options={topicFilters}
                      filterGroup="topic"
                      isExpanded={expandedFilters.has('topic')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                    />
                    <FilterGroup
                      title="Industry"
                      filterId="industry"
                      options={industryFilters}
                      filterGroup="industry"
                      isExpanded={expandedFilters.has('industry')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                    />
                  </div>
                )}
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
              {/* Search Bar */}
              <div className="mb-6 relative">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    placeholder={`Search ${activeTab === 'information' ? 'information' : 'training'} resources...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      <CloseIcon />
                    </button>
                  )}
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {filteredResources.length} {activeTab === 'information' ? 'Information' : 'Training'} Resource{filteredResources.length !== 1 ? 's' : ''} Found
                </h2>
              </div>

              {/* Resource Grid */}
              <AnimatePresence mode="wait">
                {filteredResources.length > 0 ? (
                  <motion.div
                    key={`${activeTab}-resources`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {filteredResources.map((resource, idx) => (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <ResourceCard resource={resource} type={activeTab} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${activeTab}-empty`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
                      No {activeTab === 'information' ? 'information' : 'training'} resources found matching your filters
                    </p>
                    <motion.button
                      onClick={clearAllFilters}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-cta-green-500 to-cta-green-600 hover:from-cta-green-600 hover:to-cta-green-700 text-white font-semibold rounded-lg shadow-lg transition-all"
                    >
                      Clear All Filters
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

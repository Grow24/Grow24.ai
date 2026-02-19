import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComingSoon } from '../contexts/ComingSoonContext'
import { use3DRotation } from '../lib/use3DRotation'

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

// New filter structure matching requirements
const requirementFilters: FilterOption[] = [
  { id: 'information', label: 'Information' },
  { id: 'training', label: 'Training' },
]

const contentTypeFilters: FilterOption[] = [
  { id: 'article', label: 'Article' },
  { id: 'case-study', label: 'Case Study' },
  { id: 'white-paper', label: 'White Paper' },
  { id: 'template', label: 'Template' },
  { id: 'training', label: 'Training' },
]

const engagementTypeFilters: FilterOption[] = [
  { id: 'audio', label: 'Audio' },
  { id: 'multimedia', label: 'Multimedia' },
  { id: 'survey', label: 'Survey' },
  { id: 'video', label: 'Video' },
  { id: 'webinar', label: 'Webinar' },
]

const organizationFilters: FilterOption[] = [
  { id: 'corporate', label: 'Corporate' },
  {
    id: 'functional',
    label: 'Functional',
    children: [
      { id: 'sales', label: 'Sales' },
      { id: 'supply-chain', label: 'Supply Chain' },
      { id: 'marketing', label: 'Marketing' },
      {
        id: 'value-chain',
        label: 'Value Chain',
        children: [
          { id: 'lead-identification-to-lead-qualified', label: 'LeadIdentification → LeadQualified' },
          { id: 'lead-qualified-to-deal-secured', label: 'LeadQualified → DealSecured' },
          { id: 'deal-secured-to-deliver-order', label: 'DealSecured → DeliverOrder' },
          { id: 'idea-generation-to-deliver-solution', label: 'IdeaGeneration → DeliverSolution' },
          { id: 'order-delivered-to-cash-received', label: 'OrderDelivered → CashReceived' },
          { id: 'hire-mandate-to-hire-employee', label: 'HireMandate → HireEmployee' },
          { id: 'hired-employee-to-retire-employee', label: 'HiredEmployee → RetireEmployee' },
          { id: 'demand-identification-to-demand-forecasted', label: 'DemandIdentification → DemandForecasted' },
          { id: 'demand-forecasted-to-solution-produced', label: 'DemandForecasted → SolutionProduced' },
          { id: 'solution-produced-to-solution-delivered', label: 'SolutionProduced → SolutionDelivered' },
        ],
      },
    ],
  },
]

const solutionLifecycleFilters: FilterOption[] = [
  { id: 'identify-goal', label: 'Identify Goal' },
  { id: 'define-strategy', label: 'Define Strategy' },
  { id: 'define-objective', label: 'Define Objective' },
  { id: 'prepare-plan', label: 'Prepare Plan' },
  { id: 'execute-project', label: 'Execute Project' },
  { id: 'run-operation', label: 'Run Operation' },
]

const changeManagementFilters: FilterOption[] = [
  { id: 'change-management', label: 'Change Management' },
]

const themeFilters: FilterOption[] = [
  { id: 'business-analysis', label: 'Business Analysis' },
  { id: 'business-transformation', label: 'Business Transformation' },
  { id: 'enterprise-architecture', label: 'Enterprise Architecture' },
  { id: 'project-management', label: 'Project Management' },
  { id: 'program-management', label: 'Program Management' },
  { id: 'portfolio-management', label: 'Portfolio Management' },
  { id: 'solution-management', label: 'Solution Management' },
]

// Professional tab filters (exact sequence and options per requirements)
const professionalDateFilters: FilterOption[] = [
  { id: 'all', label: 'All' },
  {
    id: 'completed',
    label: 'Completed',
    children: [
      { id: 'completed-less-than-3-months', label: 'less than 3 months' },
      { id: 'completed-less-than-1-month', label: 'less than 1 month' },
      { id: 'completed-less-than-1-week', label: 'less than a week' },
    ],
  },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'upcoming', label: 'Upcoming' },
]

const professionalIndustryFilters: FilterOption[] = [
  { id: 'all', label: 'All' },
  { id: 'agri', label: 'Agri' },
  { id: 'automobile', label: 'Automobile' },
  { id: 'auto-components', label: 'Auto Components' },
  {
    id: 'consumer-products',
    label: 'Consumer Products',
    children: [
      { id: 'fmcg', label: 'FMCG' },
      { id: 'consumer-durables', label: 'Consumer Durables' },
    ],
  },
  { id: 'pharma', label: 'Pharma' },
  { id: 'sports', label: 'Sports' },
]

const professionalOrganizationFilters: FilterOption[] = [
  { id: 'corporate', label: 'Corporate' },
  {
    id: 'functional',
    label: 'Functional',
    children: [
      { id: 'finance', label: 'Finance' },
      { id: 'human-resources', label: 'Human Resources' },
      { id: 'information-technology', label: 'Information Technology' },
      { id: 'marketing', label: 'Marketing' },
      { id: 'market-research', label: 'Market Research' },
      { id: 'sales', label: 'Sales' },
      { id: 'supply-chain', label: 'Supply Chain' },
    ],
  },
  {
    id: 'program',
    label: 'Program',
    children: [
      { id: 'esg', label: 'ESG' },
      { id: 'business-transformation', label: 'Business Transformation' },
    ],
  },
]

const professionalContentTypeFilters: FilterOption[] = [
  { id: 'case-study', label: 'Case Study' },
  { id: 'summary', label: 'Summary' },
  { id: 'perspective', label: 'Perspective' },
  { id: 'white-paper', label: 'White Paper' },
  { id: 'template', label: 'Template' },
  { id: 'training', label: 'Training' },
]

const professionalEngagementTypeFilters: FilterOption[] = [
  { id: 'podcast', label: 'Podcast' },
  { id: 'article', label: 'Article' },
  { id: 'survey', label: 'Survey' },
  { id: 'video', label: 'Video' },
  { id: 'webinar', label: 'Webinar' },
]

const professionalThemeFilters: FilterOption[] = [
  { id: 'all', label: 'All' },
  {
    id: 'business-analysis',
    label: 'Business Analysis',
    children: [
      {
        id: 'applied-business-analysis',
        label: 'Applied Business Analysis',
        children: [
          { id: 'develop-a-business-case', label: 'Develop a Business Case' },
          { id: 'case-studies', label: 'Case studies' },
        ],
      },
      {
        id: 'body-of-knowledge',
        label: 'Body of Knowledge',
        children: [
          { id: 'knowledge-areas', label: 'Knowledge Areas' },
          { id: 'core-concept-model', label: 'Core Concept Model' },
          { id: 'competencies', label: 'Competencies' },
          { id: 'techniques', label: 'Techniques' },
          { id: 'perspectives', label: 'Perspectives' },
        ],
      },
    ],
  },
  { id: 'business-transformation', label: 'Business Transformation' },
  { id: 'change-mgmt', label: 'Change Mgmt' },
  { id: 'collaboration', label: 'Collaboration' },
  { id: 'communication', label: 'Communication' },
  {
    id: 'delivering-results',
    label: 'Delivering Results',
    children: [{ id: 'delivering-value', label: 'Delivering Value' }],
  },
  {
    id: 'enterprise-architecture',
    label: 'Enterprise Architecture',
    children: [
      {
        id: 'business-architecture',
        label: 'Business Architecture',
        children: [
          { id: 'values-in-business-networks', label: 'Values in Business Networks' },
          { id: 'business-growth-cycle', label: 'Business Growth Cycle' },
        ],
      },
      { id: 'solution-architecture', label: 'Solution Architecture' },
    ],
  },
  { id: 'environment', label: 'Environment' },
  {
    id: 'growth-cycle',
    label: 'Growth Cycle',
    children: [
      { id: 'personal-growth-cycle', label: 'Personal Growth Cycle' },
      { id: 'professional-growth-cycle', label: 'Professional Growth Cycle' },
    ],
  },
  { id: 'innovation', label: 'Innovation' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'project-mgmt', label: 'Project Mgmt' },
  { id: 'program-mgmt', label: 'Program Mgmt' },
  { id: 'portfolio-mgmt', label: 'Portfolio Mgmt' },
  { id: 'process-mgmt', label: 'Process Mgmt' },
  { id: 'research', label: 'Research' },
  { id: 'results-framework', label: 'Results Framework' },
  { id: 'service-operations', label: 'Service Operations' },
  {
    id: 'solution-mgmt',
    label: 'Solution Mgmt',
    children: [
      { id: 'delivering-solutions', label: 'Delivering Solutions' },
      { id: 'using-solutions', label: 'Using Solutions' },
    ],
  },
]

const professionalGrowthCycleFilters: FilterOption[] = [
  { id: 'identify-goals', label: 'Identify Goals' },
  { id: 'craft-strategy', label: 'Craft Strategy' },
  { id: 'define-objective', label: 'Define Objective' },
  { id: 'build-plan', label: 'Build Plan' },
  { id: 'execute-plan', label: 'Execute Plan' },
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
        onClick={() => showComingSoon(`library-${type}`, 'Access Resource', `Enter your email to access this ${type} resource.`, { resourceTitle: resource.title })}
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
  singleSelect?: boolean
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
  isFilterSelected,
  singleSelect = false,
}) => {
  const renderOption = (option: FilterOption, depth = 0, parentId?: string): React.ReactNode => {
    const effectiveSelected = isFilterSelected(filterGroup, option.id, singleSelect ? undefined : parentId)
    const toggle = () => onToggleFilter(filterGroup, option.id, singleSelect ? undefined : parentId)
    return (
      <div key={option.id}>
        <FilterCheckbox
          option={option}
          filterGroup={filterGroup}
          isSelected={effectiveSelected}
          onToggle={toggle}
          isChild={depth > 0}
        />
        {option.children && option.children.length > 0 && (
          <div className={depth === 0 ? 'ml-7 mt-1 space-y-1' : 'ml-5 mt-1 space-y-1'}>
            {option.children.map((child) =>
              child.children && child.children.length > 0 ? (
                <div key={child.id}>
                  <FilterCheckbox
                    option={child}
                    filterGroup={filterGroup}
                    isSelected={isFilterSelected(filterGroup, child.id, singleSelect ? undefined : option.id)}
                    onToggle={() => onToggleFilter(filterGroup, child.id, singleSelect ? undefined : option.id)}
                    isChild={true}
                  />
                  <div className="ml-5 mt-1 space-y-1">
                    {child.children.map((grandchild) => (
                      <FilterCheckbox
                        key={grandchild.id}
                        option={grandchild}
                        filterGroup={filterGroup}
                        isSelected={isFilterSelected(filterGroup, grandchild.id, singleSelect ? undefined : child.id)}
                        onToggle={() => onToggleFilter(filterGroup, grandchild.id, singleSelect ? undefined : child.id)}
                        isChild={true}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <FilterCheckbox
                  key={child.id}
                  option={child}
                  filterGroup={filterGroup}
                  isSelected={isFilterSelected(filterGroup, child.id, singleSelect ? undefined : option.id)}
                  onToggle={() => onToggleFilter(filterGroup, child.id, singleSelect ? undefined : option.id)}
                  isChild={true}
                />
              )
            )}
          </div>
        )}
      </div>
    )
  }

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
              {options.map((option) => renderOption(option))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}, (prevProps, nextProps) => {
  // Re-render if structural props change OR if filter selection callback changes
  const structuralPropsEqual = (
    prevProps.title === nextProps.title &&
    prevProps.filterId === nextProps.filterId &&
    prevProps.filterGroup === nextProps.filterGroup &&
    prevProps.isNested === nextProps.isNested &&
    prevProps.singleSelect === nextProps.singleSelect &&
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
      if (filterGroup === 'date') {
        return { ...prev, date: new Set([optionId]) }
      }
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
        // Professional tab: date, industry, organization, contentType, engagementType, theme, growthCycle
        const dateFilter = currentFilters['date']
        if (dateFilter && dateFilter.size > 0 && !dateFilter.has('all')) {
          // Apply date filter when resource has date-related field (if we add it to Resource later)
          const resourceDate = (resource as Record<string, unknown>).dateStatus as string | undefined
          if (resourceDate && !dateFilter.has(resourceDate)) return false
        }

        const industryFilter = currentFilters['industry']
        const industryConsumerFilter = currentFilters['industry-consumer-products']
        if (industryFilter && industryFilter.size > 0 && !industryFilter.has('all')) {
          const ind = resource.industry
          if (!ind) return false
          let ok = industryFilter.has(ind)
          if (!ok && (ind === 'fmcg' || ind === 'consumer-durables')) {
            ok = industryFilter.has('consumer-products') && (!industryConsumerFilter?.size || industryConsumerFilter.has(ind))
          }
          if (!ok) return false
        }

        const orgFilter = currentFilters['organization']
        const orgFunctionalFilter = currentFilters['organization-functional']
        const orgProgramFilter = currentFilters['organization-program']
        if (orgFilter && orgFilter.size > 0) {
          const org = (resource as Record<string, unknown>).organization as string | undefined
          const orgSub = (resource as Record<string, unknown>).organizationSub as string | undefined
          if (org && !orgFilter.has(org)) return false
          if (org === 'functional' && orgSub && orgFunctionalFilter?.size && !orgFunctionalFilter.has(orgSub)) return false
          if (org === 'program' && orgSub && orgProgramFilter?.size && !orgProgramFilter.has(orgSub)) return false
        }

        const contentTypeFilter = currentFilters['contentType']
        if (contentTypeFilter && contentTypeFilter.size > 0) {
          if (!resource.contentType || !contentTypeFilter.has(resource.contentType)) return false
        }

        const engagementFilter = currentFilters['engagementType']
        if (engagementFilter && engagementFilter.size > 0) {
          const delivery = resource.deliveryType
          if (!delivery || !engagementFilter.has(delivery)) return false
        }

        const themeFilter = currentFilters['theme']
        if (themeFilter && themeFilter.size > 0 && !themeFilter.has('all')) {
          const theme = (resource as Record<string, unknown>).theme as string | undefined
          if (theme && !themeFilter.has(theme)) return false
        }
        Object.keys(currentFilters).forEach((key) => {
          if (key.startsWith('theme-') && currentFilters[key]?.size) {
            const themeSub = (resource as Record<string, unknown>).themeSub as string | undefined
            if (themeSub && !currentFilters[key]?.has(themeSub)) return false
          }
        })

        const growthCycleFilter = currentFilters['growthCycle']
        if (growthCycleFilter && growthCycleFilter.size > 0) {
          const gc = (resource as Record<string, unknown>).growthCycle as string | undefined
          if (gc && !growthCycleFilter.has(gc)) return false
        }
      }

      return true
    })
  }, [activeTab, currentFilters, searchQuery])


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 sm:py-16 md:py-20 pt-16 sm:pt-20 md:pt-24 px-4 sm:px-6 lg:px-8">
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
            Personal
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
            Professional
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
                {activeTab === 'training' ? (
                  <>
                    {/* Professional tab: Date, Industry, Organization, Content Type, Engagement Type, Theme, Growth Cycle */}
                    <FilterGroup
                      title="Date"
                      filterId="date"
                      options={professionalDateFilters}
                      filterGroup="date"
                      isExpanded={expandedFilters.has('date')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                      singleSelect
                    />
                    <FilterGroup
                      title="Industry"
                      filterId="industry"
                      options={professionalIndustryFilters}
                      filterGroup="industry"
                      isExpanded={expandedFilters.has('industry')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                    />
                    <FilterGroup
                      title="Organization"
                      filterId="organization"
                      options={professionalOrganizationFilters}
                      filterGroup="organization"
                      isExpanded={expandedFilters.has('organization')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                    />
                    <FilterGroup
                      title="Content Type"
                      filterId="content-type"
                      options={professionalContentTypeFilters}
                      filterGroup="contentType"
                      isExpanded={expandedFilters.has('content-type')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                    />
                    <FilterGroup
                      title="Engagement Type"
                      filterId="engagement-type"
                      options={professionalEngagementTypeFilters}
                      filterGroup="engagementType"
                      isExpanded={expandedFilters.has('engagement-type')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                    />
                    <FilterGroup
                      title="Theme"
                      filterId="theme"
                      options={professionalThemeFilters}
                      filterGroup="theme"
                      isExpanded={expandedFilters.has('theme')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                    />
                    <FilterGroup
                      title="Growth Cycle"
                      filterId="growth-cycle"
                      options={professionalGrowthCycleFilters}
                      filterGroup="growthCycle"
                      isExpanded={expandedFilters.has('growth-cycle')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                    />
                  </>
                ) : (
                  <>
                    {/* Personal tab: existing filters */}
                    <FilterGroup
                      title="Requirement"
                      filterId="requirement"
                      options={requirementFilters}
                      filterGroup="requirement"
                      isExpanded={expandedFilters.has('requirement')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                    />
                    <FilterGroup
                      title="Content Type"
                      filterId="content-type"
                      options={contentTypeFilters}
                      filterGroup="contentType"
                      isExpanded={expandedFilters.has('content-type')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                    />
                    <FilterGroup
                      title="Engagement Type"
                      filterId="engagement-type"
                      options={engagementTypeFilters}
                      filterGroup="engagementType"
                      isExpanded={expandedFilters.has('engagement-type')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                    />
                    <FilterGroup
                      title="Organization"
                      filterId="organization"
                      options={organizationFilters}
                      filterGroup="organization"
                      isExpanded={expandedFilters.has('organization')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                    />
                    <FilterGroup
                      title="Solution Lifecycle"
                      filterId="solution-lifecycle"
                      options={solutionLifecycleFilters}
                      filterGroup="solutionLifecycle"
                      isExpanded={expandedFilters.has('solution-lifecycle')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                    />
                    <FilterGroup
                      title="Change Management"
                      filterId="change-management"
                      options={changeManagementFilters}
                      filterGroup="changeManagement"
                      isExpanded={expandedFilters.has('change-management')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                    />
                    <FilterGroup
                      title="Theme"
                      filterId="theme"
                      options={themeFilters}
                      filterGroup="theme"
                      isExpanded={expandedFilters.has('theme')}
                      onToggleExpand={toggleFilterExpanded}
                      onToggleFilter={toggleFilterOption}
                      isFilterSelected={isFilterSelected}
                    />
                  </>
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
                    className="text-center py-6 sm:py-8 md:py-12"
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

import { createFileRoute } from '@tanstack/react-router'
import SolutionOverviewPage from '../components/SolutionOverviewPage'

export const Route = createFileRoute('/solutions/overview')({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search?.category === 'string' ? search.category : undefined,
  }),
  component: SolutionOverviewPage,
})

import { createFileRoute } from '@tanstack/react-router'
import SolutionDetailPage from '../components/SolutionDetailPage'

export const Route = createFileRoute('/solutions/$solutionId')({
  component: SolutionDetailPage,
})

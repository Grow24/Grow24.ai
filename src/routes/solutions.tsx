import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import SolutionsMatrix3Panel from '../components/SolutionsMatrix3Panel'

export const Route = createFileRoute('/solutions')({
  component: SolutionsPage,
})

function SolutionsPage() {
  const location = useLocation()
  // Check if we're on a detail page (has solutionId in path)
  const isDetailPage = location.pathname.startsWith('/solutions/') &&
    location.pathname !== '/solutions' &&
    location.pathname.split('/').length > 2

  // If we're on a detail page, only render the Outlet (which will render the detail page)
  // Otherwise, render the matrix panel
  if (isDetailPage) {
    return <Outlet />
  }

  return <SolutionsMatrix3Panel />
}

export default SolutionsPage

import { createFileRoute, Outlet, useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/solutions')({
  component: SolutionsPage,
})

function SolutionsPage() {
  const location = useLocation()
  // Check if we're on a detail page (has solutionId in path)
  const isDetailPage = location.pathname.startsWith('/solutions/') &&
    location.pathname !== '/solutions' &&
    location.pathname.split('/').length > 2

  useEffect(() => {
    // If not a detail page, redirect to index with hash fragment
    if (!isDetailPage) {
      window.location.replace('/#solutions')
    }
  }, [isDetailPage])

  // If we're on a detail page, only render the Outlet (which will render the detail page)
  if (isDetailPage) {
    return <Outlet />
  }

  return null
}

export default SolutionsPage

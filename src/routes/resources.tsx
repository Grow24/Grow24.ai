import { createFileRoute } from '@tanstack/react-router'
import ResourceHub from '../components/ResourceHub'

export const Route = createFileRoute('/resources')({
  component: ResourcesPage,
})

function ResourcesPage() {
  return (
    <div className="min-h-screen">
      <ResourceHub />
    </div>
  )
}

export default ResourcesPage

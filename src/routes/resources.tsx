import { createFileRoute } from '@tanstack/react-router'
import ResourceHub from '../components/ResourceHub'

export const Route = createFileRoute('/resources')({
  component: ResourcesPage,
})

function ResourcesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="w-full px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient">
          Resource Hub
        </h1>
        <ResourceHub />
      </div>
    </div>
  )
}

export default ResourcesPage

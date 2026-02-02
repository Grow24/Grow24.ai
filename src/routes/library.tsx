import { createFileRoute } from '@tanstack/react-router'
import LibraryPage from '../components/Library'

export const Route = createFileRoute('/library')({
  component: LibraryPageComponent,
})

function LibraryPageComponent() {
  return (
    <div className="min-h-screen">
      <LibraryPage />
    </div>
  )
}

export default LibraryPageComponent

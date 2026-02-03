import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/library')({
  component: LibraryPageComponent,
})

function LibraryPageComponent() {
  useEffect(() => {
    // Redirect to index with hash fragment
    window.location.replace('/#library')
  }, [])
  
  return null
}

export default LibraryPageComponent

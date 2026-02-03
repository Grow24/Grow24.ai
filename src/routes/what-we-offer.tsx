import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/what-we-offer')({
  component: WhatWeOfferPage,
})

function WhatWeOfferPage() {
  useEffect(() => {
    // Redirect to index with hash fragment
    window.location.replace('/#concept')
  }, [])
  
  return null
}

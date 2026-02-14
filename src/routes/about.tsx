import { createFileRoute } from '@tanstack/react-router'
import AboutShowcase from '../components/AboutShowcase'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="min-h-screen bg-emerald-50/40 dark:bg-slate-950/95 py-10 sm:py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <AboutShowcase />
      </div>
    </main>
  )
}

export default AboutPage


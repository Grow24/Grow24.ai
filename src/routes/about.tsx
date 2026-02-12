import { createFileRoute } from '@tanstack/react-router'
import AboutShowcase from '../components/AboutShowcase'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="min-h-screen bg-emerald-50/40 dark:bg-slate-950/95 py-10 sm:py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back link */}
        <div className="mb-4 text-sm">
          <a
            href="/#home"
            className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 underline-offset-4 hover:underline"
          >
            ← Back to Grow24.ai
          </a>
        </div>

        <AboutShowcase />
      </div>
    </main>
  )
}

export default AboutPage


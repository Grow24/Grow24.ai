import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../contexts/AuthContext'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return <Navigate to="/" />
  }

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          {/* Sidebar */}
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/40">
            <div className="px-5 pt-5 pb-4 border-b border-slate-800">
              <p className="text-xs font-semibold tracking-wide text-emerald-400 uppercase">
                PBMP Dashboard
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-50">
                {user?.email ?? 'User'}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Plan • Build • Measure • Progress
              </p>
            </div>
            <nav className="px-2 py-3 space-y-1 text-sm">
              <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 bg-slate-800 text-slate-50 font-medium">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                  1
                </span>
                Overview
              </button>
              <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/15 text-sky-400 text-xs">
                  2
                </span>
                Plan & Goals
              </button>
              <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/15 text-purple-400 text-xs">
                  3
                </span>
                Activities & Tasks
              </button>
              <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 text-xs">
                  4
                </span>
                KPIs & Metrics
              </button>
              <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-pink-500/15 text-pink-400 text-xs">
                  5
                </span>
                Reviews & Insights
              </button>
            </nav>
            <div className="mt-2 px-4 pb-5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-semibold px-3 py-2 transition-colors"
              >
                Logout
              </button>
            </div>
          </aside>

          {/* Main content */}
          <section className="space-y-6">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-50">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Central view of your PBMP workspace: goals, plans, activities, and progress.
                </p>
              </div>
            </header>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-xs font-medium text-emerald-400 uppercase tracking-wide">
                  Plan
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-50">3 active goals</p>
                <p className="mt-1 text-xs text-slate-400">
                  Set clear objectives across personal and business growth.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-xs font-medium text-sky-400 uppercase tracking-wide">
                  Build
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-50">7 open activities</p>
                <p className="mt-1 text-xs text-slate-400">
                  Translate plans into week-by-week execution.
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                <p className="text-xs font-medium text-amber-400 uppercase tracking-wide">
                  Measure
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-50">4 KPIs tracked</p>
                <p className="mt-1 text-xs text-slate-400">
                  Monitor performance and adjust in real time.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              <h2 className="text-sm font-semibold text-slate-100">
                Today&apos;s focus
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Review this week&apos;s PBMP plan and confirm priorities.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  Log key activities completed across sales, marketing, and operations.
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Check progress against your primary growth KPIs.
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

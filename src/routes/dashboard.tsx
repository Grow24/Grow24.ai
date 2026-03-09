import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const GET_FILTERS_API = 'https://intelligentsalesman.com/ism1/API/get_filters.php'

type FilterRecord = Record<string, string | null>

type GetFiltersResponse = {
  success: boolean
  filters: FilterRecord[]
}

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [filters, setFilters] = useState<FilterRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch(GET_FILTERS_API)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: GetFiltersResponse) => {
        if (cancelled) return
        if (data?.success && Array.isArray(data.filters)) {
          setFilters(data.filters)
        } else {
          setFilters([])
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load filters')
          setFilters([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!isAuthenticated) {
    return <Navigate to="/" />
  }

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  // Columns to show in the table (key, header label)
  const tableColumns: { key: string; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'field', label: 'Field' },
    { key: 'condition_operator', label: 'Operator' },
    { key: 'placeholder', label: 'Placeholder' },
    { key: 'position', label: 'Position' },
    { key: 'isActive', label: 'Active' },
    { key: 'required', label: 'Required' },
    { key: 'visible', label: 'Visible' },
    { key: 'filterApply', label: 'Apply' },
    { key: 'createdAt', label: 'Created' },
    { key: 'updatedAt', label: 'Updated' },
  ]

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
                  Filters from get_filters API — dynamic list view.
                </p>
              </div>
            </header>

            {error && (
              <div className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                {error}
                {error.includes('Failed') && (
                  <span className="block mt-1 text-red-300/80">
                    Check network/CORS for {GET_FILTERS_API}
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-400">
                Loading filters…
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-700 bg-slate-800/80">
                        {tableColumns.map(({ key, label }) => (
                          <th
                            key={key}
                            className="px-4 py-3 text-left font-semibold text-slate-200 whitespace-nowrap"
                          >
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filters.length === 0 && !error ? (
                        <tr>
                          <td
                            colSpan={tableColumns.length}
                            className="px-4 py-6 text-center text-slate-500"
                          >
                            No filters returned
                          </td>
                        </tr>
                      ) : (
                        filters.map((row, idx) => (
                          <tr
                            key={row.id ?? idx}
                            className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                          >
                            {tableColumns.map(({ key }) => (
                              <td
                                key={key}
                                className="px-4 py-2.5 text-slate-300 whitespace-nowrap max-w-[200px] truncate"
                                title={row[key] ?? ''}
                              >
                                {row[key] ?? '—'}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuth, useUser } from '@clerk/clerk-react'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="glass backdrop-blur-xl bg-white/5 rounded-3xl p-8 border border-white/10">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome, {user?.firstName || 'User'}! 👋
          </h1>
          <p className="text-gray-400 mb-6">
            Email: {user?.primaryEmailAddress?.emailAddress}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-xl p-6">
              <h3 className="text-emerald-400 font-semibold mb-2">PBMP Dashboard</h3>
              <p className="text-gray-300 text-sm">Access your personal and business management tools</p>
            </div>
            
            <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-purple-400 font-semibold mb-2">AI Assistant</h3>
              <p className="text-gray-300 text-sm">Get personalized insights and recommendations</p>
            </div>
            
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-6">
              <h3 className="text-blue-400 font-semibold mb-2">Analytics</h3>
              <p className="text-gray-300 text-sm">Track your growth and performance metrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

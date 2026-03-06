import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

type AuthUser = {
  email: string
}

type AuthContextValue = {
  isAuthenticated: boolean
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'grow24-auth'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser
        if (parsed?.email) {
          setUser({ email: parsed.email })
        }
      }
    } catch {
      // ignore hydration errors
    } finally {
      setIsHydrated(true)
    }
  }, [])

  const persistUser = useCallback((nextUser: AuthUser | null) => {
    if (typeof window === 'undefined') return
    if (nextUser) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const trimmedEmail = email.trim()
      const trimmedPassword = password.trim()

      if (!trimmedEmail || !trimmedEmail.includes('@')) {
        throw new Error('Please enter a valid email address.')
      }
      if (!trimmedPassword || trimmedPassword.length < 6) {
        throw new Error('Password must be at least 6 characters.')
      }

      // Placeholder for real backend authentication.
      // Replace this with an actual API call when available.
      await new Promise((resolve) => setTimeout(resolve, 500))

      const nextUser: AuthUser = { email: trimmedEmail }
      setUser(nextUser)
      persistUser(nextUser)
    },
    [persistUser],
  )

  const logout = useCallback(() => {
    setUser(null)
    persistUser(null)
  }, [persistUser])

  const value: AuthContextValue = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
  }

  // Avoid flashing unauthenticated state before hydration
  if (!isHydrated) {
    return <>{children}</>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}


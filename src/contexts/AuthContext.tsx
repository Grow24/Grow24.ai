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

  useEffect(() => {
    // Marketing site should show Login by default. Do not restore a previous
    // placeholder session from localStorage (that made the header say Logout).
    try {
      if (typeof window === 'undefined') return
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
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

  // Always provide context — skipping Provider before hydration breaks LoginModal/useAuth.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}


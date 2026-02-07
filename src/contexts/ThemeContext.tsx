import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = 'theme'

function isValidTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    return isValidTheme(saved) ? saved : null
  } catch {
    return null
  }
}

function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = getStoredTheme()
    if (stored) {
      applyTheme(stored)
      return stored
    }
    // No stored preference: default to light. Theme only changes when user explicitly toggles.
    const initial: Theme = 'light'
    applyTheme(initial)
    return initial
  })

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Ignore storage errors
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'

const STORAGE_KEY = 'portfolio-theme'

export type ThemeMode = 'dark' | 'light'

type ThemeContextValue = {
  theme: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): ThemeMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle('light', mode === 'light')
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const mode = readStoredTheme()
    applyTheme(mode)
    return mode
  })

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    const apply = () => {
      flushSync(() => {
        setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
      })
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (
      !reduceMotion &&
      typeof document.startViewTransition === 'function'
    ) {
      document.startViewTransition(apply)
    } else {
      apply()
    }
  }, [])

  const value = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}

import type { AppRoute } from '../hooks/useAppRoute'
import { ThemeToggle } from './ThemeToggle'

const NAV: { id: AppRoute; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
]

type Props = {
  route: AppRoute
  onNavigate: (route: AppRoute) => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export function SiteHeader({ route, onNavigate, theme, onToggleTheme }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-end gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
          {NAV.map(({ id, label }) => {
            const active = route === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  active
                    ? 'bg-accent/10 font-medium text-accent'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {label}
              </button>
            )
          })}
        </nav>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  )
}

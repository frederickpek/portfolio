type Props = {
  theme: 'dark' | 'light'
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: Props) {
  const lightOn = theme === 'light'

  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-full border border-border p-2 text-muted transition hover:border-accent/40 hover:text-accent"
      aria-label={lightOn ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-pressed={lightOn}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className={`h-5 w-5 transition ${lightOn ? 'fill-accent text-accent' : ''}`}
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  )
}

type Props = {
  eyebrow: string
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function HomeSectionHeader({
  eyebrow,
  title,
  description,
  action,
}: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 max-w-xl text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {action ? (
        <button
          type="button"
          onClick={action.onClick}
          className="shrink-0 font-mono text-xs uppercase tracking-widest text-accent transition hover:text-foreground"
        >
          {action.label} →
        </button>
      ) : null}
    </div>
  )
}

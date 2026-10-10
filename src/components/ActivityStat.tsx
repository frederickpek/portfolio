type Props = {
  label: string
  value: number
  /** e.g. "last year" or "all-time" */
  hint?: string
}

export function ActivityStat({ label, value, hint }: Props) {
  return (
    <div className="rounded-lg border border-border/80 bg-surface px-2.5 py-1.5 sm:px-3 sm:py-2">
      <dt className="text-xs text-muted">
        {label}
        {hint && <span className="text-muted/80"> ({hint})</span>}
      </dt>
      <dd className="font-mono text-lg font-medium text-foreground">
        {value.toLocaleString()}
      </dd>
    </div>
  )
}

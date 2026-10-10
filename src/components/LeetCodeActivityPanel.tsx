import { useEffect, useState } from 'react'
import { profile } from '../config/profile'
import { fetchLeetCodeStats, type LeetCodeStats } from '../lib/leetcode'
import { ActivityHeatmap } from './ActivityHeatmap'
import { ActivityStat } from './ActivityStat'

function leetcodeUsername(): string | null {
  const fromEnv = import.meta.env.VITE_LEETCODE_USERNAME?.trim()
  if (fromEnv === '') return null
  return fromEnv || profile.leetcodeUsername || null
}

export function LeetCodeActivityPanel() {
  const username = leetcodeUsername()
  const [stats, setStats] = useState<LeetCodeStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(Boolean(username))

  useEffect(() => {
    if (!username) return
    let cancelled = false
    void fetchLeetCodeStats(username)
      .then((data) => {
        if (!cancelled) setStats(data)
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load LeetCode')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [username])

  if (!username) return null

  return (
    <section className="rounded-2xl border border-border bg-surface-raised/80 p-5 backdrop-blur-sm">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-leetcode">
            LeetCode
          </p>
          <h3 className="text-lg font-semibold text-foreground">
            Submission Activity
          </h3>
        </div>
        <a
          href={`https://leetcode.com/u/${username}/`}
          className="text-sm text-muted transition hover:text-accent"
          target="_blank"
          rel="noreferrer"
        >
          @{username}
        </a>
      </div>

      {loading && (
        <p className="text-sm text-muted">Loading submission calendar…</p>
      )}
      {error && (
        <p className="text-sm text-red-400/90">
          {error}{' '}
          <span className="text-muted">
            (Try <code className="font-mono text-xs">npm run fetch-data</code>{' '}
            before deploy.)
          </span>
        </p>
      )}
      {stats && (
        <>
          <dl className="mb-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <ActivityStat
              label="LC submissions"
              hint="last year"
              value={stats.totalLastYear}
            />
            <ActivityStat label="Easy" hint="all-time" value={stats.solved.easy} />
            <ActivityStat
              label="Medium"
              hint="all-time"
              value={stats.solved.medium}
            />
            <ActivityStat label="Hard" hint="all-time" value={stats.solved.hard} />
          </dl>
          <ActivityHeatmap
            days={stats.calendar}
            color="leetcode"
            ariaLabel={`LeetCode submissions for ${username}`}
            summary={`${(stats.totalLastYear ?? stats.calendar.reduce((s, d) => s + d.count, 0)).toLocaleString()} submissions in the last year`}
          />
        </>
      )}
    </section>
  )
}

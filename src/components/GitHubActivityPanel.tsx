import { useEffect, useState } from 'react'
import { profile } from '../config/profile'
import { fetchGitHubActivityStats } from '../lib/github-activity'
import type { GitHubActivityStats } from '../lib/github-activity'
import { ActivityHeatmap } from './ActivityHeatmap'
import { ActivityStat } from './ActivityStat'

export function GitHubActivityPanel() {
  const username = profile.githubUsername
  const [stats, setStats] = useState<GitHubActivityStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    void fetchGitHubActivityStats(username)
      .then((data) => {
        if (!cancelled) setStats(data)
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load GitHub activity')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [username])

  const summaryTotal =
    stats?.breakdown?.total ??
    stats?.derived?.total ??
    stats?.totalLastYear ??
    0

  return (
    <section className="rounded-2xl border border-border bg-surface-raised/80 p-5 backdrop-blur-sm">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-github">
            GitHub
          </p>
          <h3 className="text-lg font-semibold text-foreground">
            Contribution Activity
          </h3>
        </div>
        <a
          href={`https://github.com/${username}`}
          className="text-sm text-muted transition hover:text-accent"
          target="_blank"
          rel="noreferrer"
        >
          @{username}
        </a>
      </div>

      {loading && (
        <p className="text-sm text-muted">Loading contribution calendar…</p>
      )}
      {error && <p className="text-sm text-red-400/90">{error}</p>}
      {stats && (
        <>
          <dl className="mb-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {stats.breakdown ? (
              <>
                <ActivityStat label="Total" value={stats.breakdown.total} />
                <ActivityStat label="Commits" value={stats.breakdown.commits} />
                <ActivityStat
                  label="Pull requests"
                  value={stats.breakdown.pullRequests}
                />
                <ActivityStat label="Issues" value={stats.breakdown.issues} />
              </>
            ) : stats.derived ? (
              <>
                <ActivityStat label="Total" value={stats.derived.total} />
                <ActivityStat
                  label="Active days"
                  value={stats.derived.activeDays}
                />
                <ActivityStat label="Best day" value={stats.derived.bestDay} />
                <ActivityStat
                  label="Longest streak"
                  value={stats.derived.longestStreak}
                />
              </>
            ) : (
              <ActivityStat label="Total" value={summaryTotal} />
            )}
          </dl>
          <ActivityHeatmap
            days={stats.calendar}
            color="github"
            unit="contribution"
            ariaLabel={`GitHub contributions for ${username}`}
            summary={`${summaryTotal.toLocaleString()} contributions in the last year`}
          />
        </>
      )}
    </section>
  )
}

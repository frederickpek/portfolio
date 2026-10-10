import { useEffect, useMemo, useState } from 'react'
import { profile } from '../config/profile'
import { fetchGitHubActivityStats } from '../lib/github-activity'
import { fetchLeetCodeStats } from '../lib/leetcode'
import { mergeCalendars } from '../lib/merge-calendars'
import { ActivityStat } from './ActivityStat'
import { CombinedActivityHeatmap } from './CombinedActivityHeatmap'

function leetcodeUsername(): string | null {
  const fromEnv = import.meta.env.VITE_LEETCODE_USERNAME?.trim()
  if (fromEnv === '') return null
  return fromEnv || profile.leetcodeUsername || null
}

export function CombinedActivityPanel() {
  const ghUser = profile.githubUsername
  const lcUser = leetcodeUsername()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [github, setGithub] = useState<Awaited<
    ReturnType<typeof fetchGitHubActivityStats>
  > | null>(null)
  const [leetcode, setLeetcode] = useState<Awaited<
    ReturnType<typeof fetchLeetCodeStats>
  > | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    void Promise.all([
      fetchGitHubActivityStats(ghUser),
      lcUser ? fetchLeetCodeStats(lcUser) : Promise.resolve(null),
    ])
      .then(([gh, lc]) => {
        if (!cancelled) {
          setGithub(gh)
          setLeetcode(lc)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load activity')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [ghUser, lcUser])

  const merged = useMemo(() => {
    if (!github?.calendar.length) return []
    if (!leetcode?.calendar.length) {
      return mergeCalendars(
        github.calendar,
        github.calendar.map((d) => ({ ...d, count: 0, level: 0 as const })),
      )
    }
    return mergeCalendars(github.calendar, leetcode.calendar)
  }, [github, leetcode])

  return (
    <section className="rounded-2xl border border-border bg-surface-raised/80 px-4 py-4 sm:px-5 sm:py-5">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest">
            <span className="text-[#56d364]">GitHub</span>
            <span className="text-muted"> · </span>
            <span className="text-leetcode">LeetCode</span>
          </p>
          <h3 className="text-lg font-semibold text-foreground">
            Combined Activity
          </h3>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-muted">
          <a
            href={`https://github.com/${ghUser}`}
            className="transition hover:text-github"
            target="_blank"
            rel="noreferrer"
          >
            @{ghUser}
          </a>
          {lcUser && (
            <a
              href={`https://leetcode.com/u/${lcUser}/`}
              className="transition hover:text-leetcode"
              target="_blank"
              rel="noreferrer"
            >
              @{lcUser}
            </a>
          )}
        </div>
      </div>

      {loading && (
        <p className="text-sm text-muted">Loading activity calendars…</p>
      )}
      {error && <p className="text-sm text-red-400/90">{error}</p>}

      {merged.length > 0 && github && (
        <>
          <dl className="mb-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3 lg:grid-cols-5">
            <ActivityStat
              label="Contributions"
              hint="last year"
              value={
                github.breakdown?.total ??
                github.derived?.total ??
                github.totalLastYear
              }
            />
            <ActivityStat
              label="LC submissions"
              hint="last year"
              value={leetcode?.totalLastYear ?? 0}
            />
            <ActivityStat
              label="Easy"
              hint="all-time"
              value={leetcode?.solved?.easy ?? 0}
            />
            <ActivityStat
              label="Medium"
              hint="all-time"
              value={leetcode?.solved?.medium ?? 0}
            />
            <ActivityStat
              label="Hard"
              hint="all-time"
              value={leetcode?.solved?.hard ?? 0}
            />
          </dl>
          <CombinedActivityHeatmap
            days={merged}
            ariaLabel={`Combined GitHub and LeetCode activity for ${ghUser}`}
          />
        </>
      )}
    </section>
  )
}

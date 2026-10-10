import type { GitHubActivityCache } from './activity-cache'
import { loadActivityCache } from './activity-cache'
import { githubLevelFromCount, normalizeYearGrid } from './activity-grid'

export type GitHubActivityStats = GitHubActivityCache

export async function fetchGitHubActivityStats(
  username: string,
): Promise<GitHubActivityStats> {
  const cached = await loadActivityCache<GitHubActivityStats>(
    `github-${username}.json`,
  )
  if (cached?.calendar?.length) return cached

  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
  )
  if (!res.ok) {
    throw new Error(
      'GitHub activity cache missing. Run `npm run fetch-data` before deploy.',
    )
  }

  const data = (await res.json()) as {
    total?: { lastYear?: number }
    contributions?: { date: string; count: number; level?: number }[]
  }

  const sparse =
    data.contributions?.map((d) => ({ date: d.date, count: d.count })) ?? []
  const calendar = normalizeYearGrid(sparse, githubLevelFromCount)

  return {
    fetchedAt: new Date().toISOString(),
    username,
    totalLastYear:
      data.total?.lastYear ?? calendar.reduce((s, d) => s + d.count, 0),
    calendar,
  }
}

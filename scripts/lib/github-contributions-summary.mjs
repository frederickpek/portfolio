import { githubHeaders, githubToken } from './github-api.mjs'

const SUMMARY_QUERY = `
query ContributionBreakdown($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      contributionCalendar {
        totalContributions
      }
    }
  }
}
`

/** @param {Array<{ date: string; count: number }>} calendar */
export function calendarDerivedStats(calendar) {
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const rangeStart = new Date(today)
  rangeStart.setDate(rangeStart.getDate() - 364)

  let total = 0
  let activeDays = 0
  let bestDay = 0
  /** @type {number[]} */
  const streaks = []
  let current = 0

  const sorted = [...calendar].sort((a, b) => a.date.localeCompare(b.date))
  for (const day of sorted) {
    const dt = new Date(day.date + 'T12:00:00')
    if (dt < rangeStart || dt > today) continue
    total += day.count
    if (day.count > 0) {
      activeDays++
      bestDay = Math.max(bestDay, day.count)
      current++
    } else if (current > 0) {
      streaks.push(current)
      current = 0
    }
  }
  if (current > 0) streaks.push(current)
  const longestStreak = streaks.length ? Math.max(...streaks) : 0

  return { total, activeDays, bestDay, longestStreak }
}

/**
 * GitHub GraphQL breakdown for the last year (requires GITHUB_TOKEN).
 * @returns {Promise<{ total: number; commits: number; pullRequests: number; issues: number; reviews: number } | null>}
 */
export async function fetchGitHubBreakdown(username) {
  if (!githubToken()) return null

  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 365)

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      ...githubHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: SUMMARY_QUERY,
      variables: {
        login: username,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
  })

  if (!res.ok) return null
  const json = await res.json()
  const collection = json.data?.user?.contributionsCollection
  if (!collection) return null

  return {
    total: collection.contributionCalendar?.totalContributions ?? 0,
    commits: collection.totalCommitContributions ?? 0,
    pullRequests: collection.totalPullRequestContributions ?? 0,
    issues: collection.totalIssueContributions ?? 0,
    reviews: collection.totalPullRequestReviewContributions ?? 0,
  }
}

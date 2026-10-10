import type { LeetCodeActivityCache } from './activity-cache'
import { loadActivityCache } from './activity-cache'
import { leetcodeLevel, normalizeYearGrid } from './activity-grid'
import type { ContributionDay } from './github'
import { format, fromUnixTime } from 'date-fns'

const USER_PROFILE_QUERY = `
query userPublicProfile($username: String!) {
  matchedUser(username: $username) {
    submitStats {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    submissionCalendar
  }
}
`

type LeetCodeProfile = {
  data?: {
    matchedUser?: {
      submitStats?: {
        acSubmissionNum: {
          difficulty: string
          count: number
          submissions: number
        }[]
      }
      submissionCalendar?: string
    }
  }
}

export type LeetCodeStats = LeetCodeActivityCache

function calendarToDays(calendarJson: string): ContributionDay[] {
  const raw = JSON.parse(calendarJson) as Record<string, number>
  const sparse = Object.entries(raw).map(([ts, count]) => ({
    date: format(fromUnixTime(Number(ts)), 'yyyy-MM-dd'),
    count: Number(count),
  }))
  return normalizeYearGrid(sparse, leetcodeLevel)
}

export async function fetchLeetCodeStats(
  username: string,
): Promise<LeetCodeStats> {
  const cached = await loadActivityCache<LeetCodeActivityCache>(
    `leetcode-${username}.json`,
  )
  if (cached?.calendar?.length) return cached

  const res = await fetch('/api/leetcode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: USER_PROFILE_QUERY,
      variables: { username },
    }),
  })

  if (!res.ok) {
    throw new Error(
      'LeetCode fetch failed. Run `npm run fetch-data` before deploy.',
    )
  }

  const json = (await res.json()) as LeetCodeProfile
  const user = json.data?.matchedUser
  if (!user?.submissionCalendar) {
    throw new Error('LeetCode user not found or profile is private')
  }

  const ac = user.submitStats?.acSubmissionNum ?? []
  const byDiff = Object.fromEntries(ac.map((r) => [r.difficulty, r.count]))
  const calendar = calendarToDays(user.submissionCalendar)

  return {
    fetchedAt: new Date().toISOString(),
    username,
    totalLastYear: calendar.reduce((s, d) => s + d.count, 0),
    solved: {
      easy: byDiff.Easy ?? 0,
      medium: byDiff.Medium ?? 0,
      hard: byDiff.Hard ?? 0,
      total: byDiff.All ?? 0,
    },
    calendar,
  }
}

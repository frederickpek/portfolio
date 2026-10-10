import type { ContributionDay } from './github'

export type ActivityCache = {
  fetchedAt: string
  username: string
  totalLastYear: number
  calendar: ContributionDay[]
}

export type LeetCodeActivityCache = ActivityCache & {
  /** All-time unique problems solved (LeetCode profile). */
  solved: { easy: number; medium: number; hard: number; total: number }
}

/** Matches GitHub’s contribution categories (from GraphQL when cached). */
export type GitHubActivityCache = ActivityCache & {
  breakdown?: {
    total: number
    commits: number
    pullRequests: number
    issues: number
    reviews?: number
  }
  /** When GraphQL is unavailable — derived from the heatmap only. */
  derived?: {
    total: number
    activeDays: number
    bestDay: number
    longestStreak: number
  }
}

export async function loadActivityCache<T extends ActivityCache>(
  filename: string,
): Promise<T | null> {
  const base = import.meta.env.BASE_URL
  try {
    const res = await fetch(`${base}activity/${filename}`)
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

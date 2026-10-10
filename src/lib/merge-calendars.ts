import type { ContributionDay } from './github'
import { githubLevelFromCount, leetcodeLevel } from './activity-grid'

export type CombinedDay = {
  date: string
  github: number
  leetcode: number
  githubLevel: ContributionDay['level']
  leetcodeLevel: ContributionDay['level']
}

export function mergeCalendars(
  github: ContributionDay[],
  leetcode: ContributionDay[],
): CombinedDay[] {
  const lcByDate = new Map(leetcode.map((d) => [d.date, d.count]))
  return github.map((d) => {
    const ghCount = d.count
    const lcCount = lcByDate.get(d.date) ?? 0
    return {
      date: d.date,
      github: ghCount,
      leetcode: lcCount,
      githubLevel: githubLevelFromCount(ghCount),
      leetcodeLevel: leetcodeLevel(lcCount),
    }
  })
}

export function combinedSummary(days: CombinedDay[]) {
  let githubTotal = 0
  let leetcodeTotal = 0
  let bothDays = 0
  let anyDays = 0

  for (const d of days) {
    githubTotal += d.github
    leetcodeTotal += d.leetcode
    const gh = d.github > 0
    const lc = d.leetcode > 0
    if (gh && lc) bothDays++
    if (gh || lc) anyDays++
  }

  return { githubTotal, leetcodeTotal, bothDays, anyDays }
}

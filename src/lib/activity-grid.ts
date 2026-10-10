import type { ContributionDay } from './github'

export function leetcodeLevel(count: number): ContributionDay['level'] {
  if (count <= 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 6) return 3
  return 4
}

export function githubLevelFromCount(count: number): ContributionDay['level'] {
  if (count <= 0) return 0
  if (count <= 3) return 1
  if (count <= 6) return 2
  if (count <= 9) return 3
  return 4
}

/** Sparse or dense days → full Sun–Sat week grid (~last year). */
export function normalizeYearGrid(
  sparse: { date: string; count: number }[],
  levelForCount: (count: number) => ContributionDay['level'],
): ContributionDay[] {
  const counts = new Map(sparse.map((d) => [d.date, d.count]))

  const today = new Date()
  today.setHours(12, 0, 0, 0)

  const rangeStart = new Date(today)
  rangeStart.setDate(rangeStart.getDate() - 364)

  const gridStart = new Date(rangeStart)
  while (gridStart.getDay() !== 0) {
    gridStart.setDate(gridStart.getDate() - 1)
  }

  const gridEnd = new Date(today)
  while (gridEnd.getDay() !== 6) {
    gridEnd.setDate(gridEnd.getDate() + 1)
  }

  const days: ContributionDay[] = []
  const cursor = new Date(gridStart)
  while (cursor <= gridEnd) {
    const date = cursor.toISOString().slice(0, 10)
    const inRange = cursor >= rangeStart && cursor <= today
    const count = inRange ? (counts.get(date) ?? 0) : 0
    days.push({
      date,
      count,
      level: inRange ? levelForCount(count) : 0,
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  return days
}

export function sumLastYear(days: ContributionDay[]): number {
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const rangeStart = new Date(today)
  rangeStart.setDate(rangeStart.getDate() - 364)
  return days.reduce((sum, d) => {
    const dt = new Date(d.date + 'T12:00:00')
    if (dt < rangeStart || dt > today) return sum
    return sum + d.count
  }, 0)
}

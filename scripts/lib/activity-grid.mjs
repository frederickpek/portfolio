/** @typedef {{ date: string; count: number; level: 0|1|2|3|4 }} ActivityDay */

/**
 * Expand sparse activity into a GitHub-style grid (Sun–Sat columns, ~1 year).
 * @param {Array<{ date: string; count: number }>} sparse
 * @param {(count: number) => 0|1|2|3|4} levelForCount
 * @returns {ActivityDay[]}
 */
export function normalizeYearGrid(sparse, levelForCount) {
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

  /** @type {ActivityDay[]} */
  const days = []
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

/** @param {number} count */
export function leetcodeLevel(count) {
  if (count <= 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 6) return 3
  return 4
}

/** @param {number} count */
export function githubLevelFromCount(count) {
  if (count <= 0) return 0
  if (count <= 3) return 1
  if (count <= 6) return 2
  if (count <= 9) return 3
  return 4
}

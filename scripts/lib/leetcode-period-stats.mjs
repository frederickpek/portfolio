function periodStartDate() {
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const start = new Date(today)
  start.setDate(start.getDate() - 364)
  return start
}

/** Sum submission events from raw calendar JSON within the last ~365 days. */
export function submissionsInPeriod(submissionCalendarJson) {
  const start = periodStartDate()
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const raw = JSON.parse(submissionCalendarJson)
  let total = 0
  for (const [ts, count] of Object.entries(raw)) {
    const dt = new Date(Number(ts) * 1000)
    dt.setHours(12, 0, 0, 0)
    if (dt >= start && dt <= today) total += Number(count)
  }
  return total
}

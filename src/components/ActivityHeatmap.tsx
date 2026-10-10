import { useMemo } from 'react'
import type { ContributionDay } from '../lib/github'

type Props = {
  days: ContributionDay[]
  color: 'github' | 'leetcode'
  ariaLabel: string
  summary?: string
  /** Singular label for tooltip, e.g. "contribution" or "submission" */
  unit?: string
}

const LEVEL_CLASS: Record<'github' | 'leetcode', Record<number, string>> = {
  github: {
    0: 'bg-[#161b22]',
    1: 'bg-[#0e4429]',
    2: 'bg-[#006d32]',
    3: 'bg-[#26a641]',
    4: 'bg-[#39d353]',
  },
  leetcode: {
    0: 'bg-[#1c2128]',
    1: 'bg-[#5c3a00]',
    2: 'bg-[#8a5200]',
    3: 'bg-[#c97400]',
    4: 'bg-[#ffa116]',
  },
}

function buildWeekColumns(days: ContributionDay[]): ContributionDay[][] {
  const weeks: ContributionDay[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  return weeks
}

export function ActivityHeatmap({
  days,
  color,
  ariaLabel,
  summary,
  unit = 'submission',
}: Props) {
  const weeks = useMemo(() => buildWeekColumns(days), [days])
  const palette = LEVEL_CLASS[color]

  if (!weeks.length) {
    return (
      <p className="text-sm text-muted">No activity data for this period.</p>
    )
  }

  return (
    <div className="space-y-3">
      {summary && <p className="text-sm text-muted">{summary}</p>}
      <div className="w-full" role="img" aria-label={ariaLabel}>
        <div className="flex w-full gap-[2px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex min-w-0 flex-1 flex-col gap-[2px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={
                    day.count === 0
                      ? `${day.date}: no activity`
                      : `${day.date}: ${day.count} ${unit}${day.count === 1 ? '' : 's'}`
                  }
                  className={`aspect-square w-full rounded-[2px] ${palette[day.level]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1 text-[10px] text-muted">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span
            key={level}
            className={`size-2 rounded-[1px] sm:size-[11px] sm:rounded-[2px] ${palette[level]}`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}

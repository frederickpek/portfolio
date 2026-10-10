import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { CombinedDay } from '../lib/merge-calendars'
import {
  EMPTY_CELL,
  GITHUB_CELL,
  LEETCODE_CELL,
} from '../lib/heatmap-colors'

type Props = {
  days: CombinedDay[]
  ariaLabel: string
  summary?: string
}

type TooltipState = {
  lines: string[]
  x: number
  y: number
}

const GAP_PX = 2
const CELL_MIN = 8
const CELL_MAX = 13
const DAY_GUTTER_PX = 30
const MONTH_ROW_PX = 16

/** Sun=0 … Sat=6 — GitHub-style sparse weekday labels */
const WEEKDAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''] as const

function buildMonthLabels(weeks: CombinedDay[][]): string[] {
  const labels: string[] = []
  let lastKey = ''
  for (const week of weeks) {
    const d = new Date(week[0].date + 'T12:00:00')
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (key !== lastKey) {
      labels.push(d.toLocaleString(undefined, { month: 'short' }))
      lastKey = key
    } else {
      labels.push('')
    }
  }
  return labels
}

function buildWeekColumns(days: CombinedDay[]): CombinedDay[][] {
  const weeks: CombinedDay[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  return weeks
}

function cellBackground(day: CombinedDay): string {
  const gh = GITHUB_CELL[day.githubLevel]
  const lc = LEETCODE_CELL[day.leetcodeLevel]
  const hasGh = day.github > 0
  const hasLc = day.leetcode > 0

  if (!hasGh && !hasLc) return EMPTY_CELL
  if (hasGh && !hasLc) return gh
  if (hasLc && !hasGh) return lc
  return `linear-gradient(135deg, ${lc} 50%, ${gh} 50%)`
}

function hasActivity(day: CombinedDay): boolean {
  return day.github > 0 || day.leetcode > 0
}

export function dayTooltipLines(day: CombinedDay): string[] {
  const lines = [day.date]
  if (day.github > 0) {
    lines.push(
      `${day.github} GitHub contribution${day.github === 1 ? '' : 's'}`,
    )
  }
  if (day.leetcode > 0) {
    lines.push(
      `${day.leetcode} LeetCode submission${day.leetcode === 1 ? '' : 's'}`,
    )
  }
  return lines
}

function HeatmapTooltip({ lines, x, y }: TooltipState) {
  const offset = 10
  const left = Math.min(
    Math.max(x, 16),
    typeof window !== 'undefined' ? window.innerWidth - 16 : x,
  )

  return createPortal(
    <div
      className="pointer-events-none fixed z-[9999] w-max max-w-[min(280px,calc(100vw-24px))] rounded-lg border border-border bg-surface-raised px-3 py-2.5 text-left shadow-xl"
      style={{
        left,
        top: y - offset,
        transform: 'translate(-50%, -100%)',
      }}
      role="tooltip"
    >
      <p className="font-mono text-xs font-medium text-foreground">{lines[0]}</p>
      {lines.slice(1).map((line) => (
        <p key={line} className="mt-1 text-sm leading-relaxed text-muted">
          {line}
        </p>
      ))}
    </div>,
    document.body,
  )
}

export function CombinedActivityHeatmap({ days, ariaLabel, summary }: Props) {
  const weeks = useMemo(() => buildWeekColumns(days), [days])
  const monthLabels = useMemo(() => buildMonthLabels(weeks), [weeks])
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [cellPx, setCellPx] = useState(CELL_MAX)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el || !weeks.length) return

    const measure = () => {
      const width = Math.max(0, el.clientWidth - DAY_GUTTER_PX)
      const fit = Math.floor(
        (width - GAP_PX * (weeks.length - 1)) / weeks.length,
      )
      setCellPx(Math.min(CELL_MAX, Math.max(CELL_MIN, fit)))
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [weeks.length])

  if (!weeks.length) {
    return (
      <p className="text-sm text-muted">No activity data for this period.</p>
    )
  }

  function showTip(day: CombinedDay, x: number, y: number) {
    if (!hasActivity(day)) {
      setTooltip(null)
      return
    }
    setTooltip({ lines: dayTooltipLines(day), x, y })
  }

  const columnTemplate = `repeat(${weeks.length}, ${cellPx}px)`
  const gridWidth = weeks.length * cellPx + (weeks.length - 1) * GAP_PX
  const gridHeight = 7 * cellPx + 6 * GAP_PX
  const chartWidth = DAY_GUTTER_PX + gridWidth

  const columnGridStyle = {
    display: 'grid' as const,
    gridTemplateColumns: columnTemplate,
    columnGap: GAP_PX,
  }

  return (
    <div>
      {summary && (
        <p className="mb-2 text-sm text-muted">{summary}</p>
      )}
      <div ref={containerRef} className="w-full overflow-x-auto">
        <div
          className="mx-auto min-w-min"
          style={{ width: chartWidth, maxWidth: '100%' }}
          role="img"
          aria-label={ariaLabel}
        >
          <div
            style={{
              ...columnGridStyle,
              marginLeft: DAY_GUTTER_PX,
              width: gridWidth,
              height: MONTH_ROW_PX,
              marginBottom: 4,
            }}
          >
            {monthLabels.map((label, wi) => (
              <div
                key={wi}
                className="overflow-visible text-[10px] leading-none text-muted"
                style={{ gridColumn: wi + 1 }}
              >
                {label}
              </div>
            ))}
          </div>
          <div className="flex" style={{ width: chartWidth, height: gridHeight }}>
            <div
              className="grid shrink-0"
              style={{
                width: DAY_GUTTER_PX,
                gridTemplateRows: `repeat(7, ${cellPx}px)`,
                rowGap: GAP_PX,
                height: gridHeight,
              }}
            >
              {WEEKDAY_LABELS.map((label, row) => (
                <div
                  key={`wd-${row}`}
                  className="flex items-center justify-end pr-1.5 text-[10px] leading-none text-muted"
                  style={{ gridRow: row + 1 }}
                >
                  {label}
                </div>
              ))}
            </div>
            <div
              className="grid shrink-0"
              style={{
                ...columnGridStyle,
                gridTemplateRows: `repeat(7, ${cellPx}px)`,
                rowGap: GAP_PX,
                width: gridWidth,
                height: gridHeight,
              }}
            >
              {weeks.map((week, wi) =>
                week.map((day, row) => (
                  <div
                    key={day.date}
                    className={`rounded-[2px] ${
                      hasActivity(day) ? 'cursor-default' : ''
                    }`}
                    style={{
                      gridColumn: wi + 1,
                      gridRow: row + 1,
                      background: cellBackground(day),
                    }}
                    onMouseEnter={(e) => showTip(day, e.clientX, e.clientY)}
                    onMouseMove={(e) => showTip(day, e.clientX, e.clientY)}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )),
              )}
            </div>
          </div>
        </div>
      </div>
      {tooltip && <HeatmapTooltip {...tooltip} />}
    </div>
  )
}

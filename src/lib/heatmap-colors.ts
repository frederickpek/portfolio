import type { ContributionDay } from './github'

type Level = ContributionDay['level']

export type HeatmapPalette = {
  empty: string
  github: Record<Level, string>
  leetcode: Record<Level, string>
}

const DARK_PALETTE: HeatmapPalette = {
  empty: '#1e2836',
  github: {
    0: '#161b22',
    1: '#0e4429',
    2: '#006d32',
    3: '#26a641',
    4: '#39d353',
  },
  leetcode: {
    0: '#1c2128',
    1: '#5c3a00',
    2: '#8a5200',
    3: '#c97400',
    4: '#ffa116',
  },
}

/** GitHub-style greens on a light canvas */
const LIGHT_PALETTE: HeatmapPalette = {
  empty: '#e8ecf2',
  github: {
    0: '#ebedf0',
    1: '#9be9a8',
    2: '#40c463',
    3: '#30a14e',
    4: '#216e39',
  },
  leetcode: {
    0: '#eef1f5',
    1: '#ffe8cc',
    2: '#ffc078',
    3: '#ff922b',
    4: '#e8590c',
  },
}

export function heatmapPalette(theme: 'dark' | 'light'): HeatmapPalette {
  return theme === 'light' ? LIGHT_PALETTE : DARK_PALETTE
}

/** @deprecated use heatmapPalette() */
export const GITHUB_CELL = DARK_PALETTE.github
/** @deprecated use heatmapPalette() */
export const LEETCODE_CELL = DARK_PALETTE.leetcode
/** @deprecated use heatmapPalette() */
export const EMPTY_CELL = DARK_PALETTE.empty

export function combinedCellBackground(
  day: {
    github: number
    leetcode: number
    githubLevel: Level
    leetcodeLevel: Level
  },
  palette: HeatmapPalette,
): string {
  const gh = palette.github[day.githubLevel]
  const lc = palette.leetcode[day.leetcodeLevel]
  const hasGh = day.github > 0
  const hasLc = day.leetcode > 0

  if (!hasGh && !hasLc) return palette.empty
  if (hasGh && !hasLc) return gh
  if (hasLc && !hasGh) return lc
  return `linear-gradient(135deg, ${lc} 50%, ${gh} 50%)`
}

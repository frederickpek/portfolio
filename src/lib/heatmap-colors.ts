import type { ContributionDay } from './github'

export const GITHUB_CELL: Record<ContributionDay['level'], string> = {
  0: '#161b22',
  1: '#0e4429',
  2: '#006d32',
  3: '#26a641',
  4: '#39d353',
}

export const LEETCODE_CELL: Record<ContributionDay['level'], string> = {
  0: '#1c2128',
  1: '#5c3a00',
  2: '#8a5200',
  3: '#c97400',
  4: '#ffa116',
}

/** Empty day — slightly lifted from card bg so cells read on dark UI */
export const EMPTY_CELL = '#1e2836'

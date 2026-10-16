export type RepoSlug = `${string}/${string}`

export type ProjectScreenshot = {
  /** Path under `public/` (e.g. showcase/trueshot/compare.png) */
  src: string
  alt?: string
}

export type ProjectOverrides = {
  /** Live demo URL (overrides GitHub homepage field) */
  deployUrl?: string
  title?: string
  description?: string
  featured?: boolean
  /** Show in the spotlight carousel above the project grid */
  spotlight?: boolean
  /** Lower numbers appear first in the demo carousel (default: end of list) */
  spotlightOrder?: number
  /** Images committed under public/ — first entry is the carousel hero per project */
  screenshots?: ProjectScreenshot[]
  /** Hide from the grid without removing from config */
  hidden?: boolean
}

export type Project = {
  slug: RepoSlug
  name: string
  owner: string
  description: string | null
  url: string
  deployUrl: string | null
  language: string | null
  topics: string[]
  pushedAt: string
  createdAt: string
  isFork: boolean
  featured: boolean
  spotlight: boolean
  spotlightOrder: number | null
  screenshots: ProjectScreenshot[]
  loading?: boolean
  error?: string
}

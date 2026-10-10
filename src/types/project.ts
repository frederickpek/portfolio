export type RepoSlug = `${string}/${string}`

export type ProjectOverrides = {
  /** Live demo URL (overrides GitHub homepage field) */
  deployUrl?: string
  title?: string
  description?: string
  featured?: boolean
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
  loading?: boolean
  error?: string
}

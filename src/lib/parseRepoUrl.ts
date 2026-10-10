import type { RepoSlug } from '../types/project'

export function parseRepoUrl(input: string): RepoSlug | null {
  const trimmed = input.trim()
  try {
    const url = new URL(trimmed)
    if (url.hostname !== 'github.com') return null
    const parts = url.pathname.replace(/^\/+|\/+$/g, '').split('/')
    if (parts.length < 2) return null
    const [owner, repo] = parts
    if (!owner || !repo) return null
    return `${owner}/${repo}` as RepoSlug
  } catch {
    if (/^[\w.-]+\/[\w.-]+$/.test(trimmed)) {
      return trimmed as RepoSlug
    }
    return null
  }
}

export function openGraphImageUrl(slug: RepoSlug): string {
  const [owner, repo] = slug.split('/')
  return `https://opengraph.githubassets.com/1/${owner}/${repo}`
}

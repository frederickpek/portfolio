const API = 'https://api.github.com'

export function githubToken() {
  return (
    process.env.GITHUB_TOKEN ||
    process.env.GH_TOKEN ||
    process.env.GITHUB_PAT ||
    ''
  )
}

export function githubHeaders() {
  const token = githubToken()
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function githubFetch(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { ...githubHeaders(), ...init.headers },
  })
  return res
}

export async function githubJson(path) {
  const res = await githubFetch(path)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GitHub API ${res.status} ${path}: ${body.slice(0, 160)}`)
  }
  return res.json()
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

/** Participation stats often return 202 while GitHub computes them. */
export async function fetchCommitsLastYear(slug) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await githubFetch(`/repos/${slug}/stats/participation`)
    if (res.status === 202) {
      await sleep(1500 + attempt * 500)
      continue
    }
    if (!res.ok) return null
    const stats = await res.json()
    const weeks = stats.total ?? []
    return weeks.reduce((sum, n) => sum + n, 0)
  }
  return null
}

export function parseRepoUrl(input) {
  const trimmed = input.trim()
  try {
    const url = new URL(trimmed)
    if (url.hostname !== 'github.com') return null
    const parts = url.pathname.replace(/^\/+|\/+$/g, '').split('/')
    if (parts.length < 2) return null
    return `${parts[0]}/${parts[1]}`
  } catch {
    return /^[\w.-]+\/[\w.-]+$/.test(trimmed) ? trimmed : null
  }
}

export function openGraphImageUrl(slug) {
  const [owner, repo] = slug.split('/')
  return `https://opengraph.githubassets.com/1/${owner}/${repo}`
}

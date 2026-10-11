import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  githubJson,
  githubToken,
  parseRepoUrl,
} from './lib/github-api.mjs'
import { loadEnv } from './lib/load-env.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outPath = join(root, 'public', 'data', 'projects.json')

loadEnv(root)

function isRateLimitError(err) {
  return (
    err instanceof Error &&
    (err.message.includes('403') || err.message.includes('rate limit'))
  )
}

async function loadConfig() {
  const urls = JSON.parse(
    await readFile(join(root, 'data', 'repo-urls.json'), 'utf8'),
  )
  const overrides = JSON.parse(
    await readFile(join(root, 'data', 'project-overrides.json'), 'utf8'),
  )
  return { urls, overrides }
}

async function fetchProject(slug, overrides = {}) {
  if (overrides.hidden) return null

  const repo = await githubJson(`/repos/${slug}`)

  const deployUrl =
    overrides.deployUrl?.trim() ||
    (repo.homepage?.trim() ? repo.homepage.trim() : null)

  return {
    slug,
    name: overrides.title ?? repo.name,
    owner: repo.owner.login,
    description: overrides.description ?? repo.description,
    url: repo.html_url,
    deployUrl,
    language: repo.language,
    topics: repo.topics ?? [],
    pushedAt: repo.pushed_at,
    createdAt: repo.created_at,
    isFork: repo.fork,
    featured: overrides.featured ?? false,
    spotlight: overrides.spotlight ?? false,
    screenshots: Array.isArray(overrides.screenshots)
      ? overrides.screenshots.filter((s) => s?.src?.trim())
      : [],
  }
}

const { urls, overrides } = await loadConfig()
const slugs = urls.map(parseRepoUrl).filter(Boolean)

if (!slugs.length) {
  console.error('fetch-projects: no valid repo URLs in data/repo-urls.json')
  process.exit(1)
}

const token = githubToken()
if (token) {
  console.log('fetch-projects: using authenticated GitHub API')
} else {
  console.warn(
    'fetch-projects: no GITHUB_TOKEN in .env — anonymous limit is ~60 requests/hour',
  )
}

const projects = []
for (const slug of slugs) {
  try {
    const project = await fetchProject(slug, overrides[slug] ?? {})
    if (project) projects.push(project)
  } catch (err) {
    if (isRateLimitError(err)) {
      console.error(
        'fetch-projects: GitHub rate limit hit. Set GITHUB_TOKEN in .env and retry.',
      )
      try {
        await access(outPath)
        console.error(
          'fetch-projects: keeping existing public/data/projects.json (not overwritten).',
        )
      } catch {
        console.error('fetch-projects: no previous cache to keep.')
      }
      process.exit(1)
    }
    console.warn(`fetch-projects: skip ${slug}:`, err.message)
  }
}

if (!projects.length) {
  console.error('fetch-projects: no projects fetched')
  process.exit(1)
}

projects.sort((a, b) => {
  if (a.featured !== b.featured) return a.featured ? -1 : 1
  return new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime()
})

const payload = {
  fetchedAt: new Date().toISOString(),
  projects,
}

await mkdir(dirname(outPath), { recursive: true })
await writeFile(outPath, JSON.stringify(payload, null, 2))
console.log(`fetch-projects: wrote ${projects.length} projects → ${outPath}`)

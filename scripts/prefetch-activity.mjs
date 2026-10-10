import { writeFile, mkdir, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  githubLevelFromCount,
  leetcodeLevel,
  normalizeYearGrid,
} from './lib/activity-grid.mjs'
import { loadEnv } from './lib/load-env.mjs'
import {
  calendarDerivedStats,
  fetchGitHubBreakdown,
} from './lib/github-contributions-summary.mjs'
import { submissionsInPeriod } from './lib/leetcode-period-stats.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

loadEnv(root)
const outDir = join(root, 'public', 'activity')

const USER_PROFILE_QUERY = `
query userPublicProfile($username: String!) {
  matchedUser(username: $username) {
    submitStats {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    submissionCalendar
  }
}
`

function parseCalendarJson(calendarJson) {
  const raw = JSON.parse(calendarJson)
  return Object.entries(raw).map(([ts, count]) => ({
    date: new Date(Number(ts) * 1000).toISOString().slice(0, 10),
    count: Number(count),
  }))
}

async function fetchLeetCode(username) {
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: USER_PROFILE_QUERY,
      variables: { username },
    }),
  })
  if (!res.ok) throw new Error(`LeetCode HTTP ${res.status}`)
  const json = await res.json()
  const user = json.data?.matchedUser
  if (!user?.submissionCalendar) {
    throw new Error(`No LeetCode profile for ${username}`)
  }
  const sparse = parseCalendarJson(user.submissionCalendar)
  const calendar = normalizeYearGrid(sparse, leetcodeLevel)
  const ac = user.submitStats?.acSubmissionNum ?? []
  const byDiff = Object.fromEntries(ac.map((r) => [r.difficulty, r.count]))
  const totalLastYear = submissionsInPeriod(user.submissionCalendar)

  return {
    fetchedAt: new Date().toISOString(),
    username,
    totalLastYear,
    solved: {
      easy: byDiff.Easy ?? 0,
      medium: byDiff.Medium ?? 0,
      hard: byDiff.Hard ?? 0,
      total: byDiff.All ?? 0,
    },
    calendar,
  }
}

async function fetchGitHubContributions(username) {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
  )
  if (!res.ok) throw new Error(`GitHub contributions HTTP ${res.status}`)
  const data = await res.json()
  const sparse = (data.contributions ?? []).map((d) => ({
    date: d.date,
    count: d.count,
  }))
  const calendar = normalizeYearGrid(sparse, githubLevelFromCount)
  const totalLastYear =
    data.total?.lastYear ??
    calendar.reduce((s, d) => s + d.count, 0)

  const breakdown = await fetchGitHubBreakdown(username)
  const derived = breakdown ? undefined : calendarDerivedStats(calendar)

  return {
    fetchedAt: new Date().toISOString(),
    username,
    totalLastYear,
    ...(breakdown ? { breakdown } : { derived }),
    calendar,
  }
}

async function loadProfileGithubUsername() {
  try {
    const src = await readFile(join(root, 'src/config/profile.ts'), 'utf8')
    const match = src.match(/githubUsername:\s*['"]([^'"]+)['"]/)
    return match?.[1] ?? 'frederickpek'
  } catch {
    return 'frederickpek'
  }
}

const leetcodeUser =
  process.env.VITE_LEETCODE_USERNAME ||
  process.env.LEETCODE_USERNAME ||
  'frederickpek'

const githubUser =
  process.env.GITHUB_USERNAME || (await loadProfileGithubUsername())

await mkdir(outDir, { recursive: true })

if (leetcodeUser) {
  try {
    const stats = await fetchLeetCode(leetcodeUser)
    const outPath = join(outDir, `leetcode-${leetcodeUser}.json`)
    await writeFile(outPath, JSON.stringify(stats, null, 2))
    console.log(`prefetch-activity: wrote ${outPath}`)
  } catch (err) {
    console.warn('prefetch-activity (leetcode):', err.message)
  }
}

if (githubUser) {
  try {
    const stats = await fetchGitHubContributions(githubUser)
    const outPath = join(outDir, `github-${githubUser}.json`)
    await writeFile(outPath, JSON.stringify(stats, null, 2))
    console.log(`prefetch-activity: wrote ${outPath}`)
  } catch (err) {
    console.warn('prefetch-activity (github):', err.message)
  }
}

import { useEffect, useState } from 'react'
import type { Project } from '../types/project'
import type { ProjectsCache } from '../types/projects-cache'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const base = import.meta.env.BASE_URL
        const res = await fetch(`${base}data/projects.json`)
        if (!res.ok) {
          throw new Error(
            'Missing projects cache. Run `npm run fetch-data` locally, or wait for the GitHub sync workflow.',
          )
        }
        const data = (await res.json()) as ProjectsCache
        if (!cancelled) {
          setProjects(data.projects)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load projects')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return { projects, loading, error }
}

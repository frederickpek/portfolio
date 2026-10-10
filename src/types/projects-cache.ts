import type { Project } from './project'

export type ProjectsCache = {
  fetchedAt: string
  projects: Project[]
}

import overrides from '../../data/project-overrides.json'
import urls from '../../data/repo-urls.json'
import type { ProjectOverrides } from '../types/project'

/** GitHub repo URLs — edit `data/repo-urls.json`, then run `npm run fetch-data`. */
export const repoUrls: string[] = urls

export const projectOverrides = overrides as Record<string, ProjectOverrides>

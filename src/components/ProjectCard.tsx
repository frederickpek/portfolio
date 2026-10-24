import { formatDistanceToNowStrict } from 'date-fns'
import type { Project } from '../types/project'

type Props = {
  project: Project
}

export function ProjectCard({ project }: Props) {
  const updated = project.pushedAt
    ? formatDistanceToNowStrict(new Date(project.pushedAt), { addSuffix: true })
    : null

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border bg-surface-raised/90 p-4 transition duration-300 hover:border-accent/40 hover:shadow-[0_0_0_1px_rgba(94,234,212,0.15)] ${
        project.featured ? 'border-accent/30' : 'border-border'
      }`}
    >
      <header className="mb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-snug text-foreground">
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent"
            >
              {project.name}
            </a>
          </h3>
          <div className="flex shrink-0 items-center gap-2">
            {project.featured && (
              <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                Featured
              </span>
            )}
            {project.language && (
              <span className="font-mono text-[11px] text-muted">
                {project.language}
              </span>
            )}
          </div>
        </div>
      </header>

      <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-muted">
        {project.error ? (
          <span className="text-red-400/90">
            Project stats unavailable — refresh cache with{' '}
            <code className="font-mono text-xs">npm run fetch-data</code> and{' '}
            <code className="font-mono text-xs">GITHUB_TOKEN</code> in{' '}
            <code className="font-mono text-xs">.env</code>.
          </span>
        ) : (
          project.description || 'No description on GitHub yet.'
        )}
      </p>

      {project.topics.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.topics.slice(0, 4).map((topic) => (
            <li
              key={topic}
              className="rounded-md border border-border/80 px-1.5 py-0.5 font-mono text-[10px] text-muted"
            >
              {topic}
            </li>
          ))}
        </ul>
      )}

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/80 pt-3">
        {updated && (
          <span className="text-xs text-muted">Updated {updated}</span>
        )}
        <div className="ml-auto flex gap-2">
          {project.deployUrl && (
            <a
              href={project.deployUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-live-demo"
            >
              Live demo
            </a>
          )}
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border px-2.5 py-1 text-xs text-foreground transition hover:border-muted"
          >
            Repository
          </a>
        </div>
      </footer>
    </article>
  )
}

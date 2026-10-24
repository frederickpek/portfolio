import { useMemo } from 'react'
import { useProjects } from '../hooks/useProjects'
import { publicAsset } from '../lib/public-asset'
import { HomeSectionHeader } from './HomeSectionHeader'

type Props = {
  onViewAll: () => void
  limit?: number
}

export function HomeFeaturedWork({ onViewAll, limit = 3 }: Props) {
  const { projects, loading } = useProjects()

  const featured = useMemo(() => {
    return projects
      .filter((p) => p.spotlight && p.screenshots.length > 0 && !p.error)
      .sort(
        (a, b) =>
          (a.spotlightOrder ?? Number.POSITIVE_INFINITY) -
          (b.spotlightOrder ?? Number.POSITIVE_INFINITY),
      )
      .slice(0, limit)
  }, [projects, limit])

  return (
    <section>
      <HomeSectionHeader
        eyebrow="Highlights"
        title="Featured work"
        description="Live demos and repos I reach for most often."
        action={{ label: 'All projects', onClick: onViewAll }}
      />
      {loading ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit }).map((_, i) => (
            <li
              key={i}
              className="aspect-[3/2] animate-pulse rounded-2xl border border-border bg-surface-raised"
            />
          ))}
        </ul>
      ) : featured.length === 0 ? null : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => {
            const shot = project.screenshots[0]
            const href = project.deployUrl ?? project.url
            return (
              <li key={project.slug}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised/50 transition hover:border-accent/35"
                >
                  <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden bg-stage">
                    <img
                      src={publicAsset(shot.src)}
                      alt={shot.alt ?? project.name}
                      className="absolute inset-0 h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-semibold text-foreground transition group-hover:text-accent">
                        {project.name}
                      </h3>
                      {project.language ? (
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted">
                          {project.language}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
                      {project.description ?? 'Open repository'}
                    </p>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

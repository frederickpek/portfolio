import { useProjects } from '../hooks/useProjects'
import { ProjectCard } from './ProjectCard'

export function ProjectGrid() {
  const { projects, loading, error } = useProjects()

  return (
    <section id="projects" className="scroll-mt-8">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          Repositories
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Projects
        </h2>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl border border-border bg-surface-raised"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}

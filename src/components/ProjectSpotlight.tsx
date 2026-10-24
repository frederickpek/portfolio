import { useCallback, useMemo, useState } from 'react'
import type { Project } from '../types/project'
import { publicAsset } from '../lib/public-asset'

type Props = {
  projects: Project[]
}

/** Shared fixed height so main + side previews do not jump when switching projects. */
const STAGE_HEIGHT =
  'h-[12.5rem] sm:h-[17rem] md:h-[21rem] lg:h-[25rem] xl:h-[27rem]'

const THUMB_ROW = 'min-h-[4.75rem]'

function heroShot(project: Project) {
  return project.screenshots[0]
}

/** Slide direction when moving to an adjacent project in the carousel ring. */
function adjacentDirection(from: number, to: number, count: number): 1 | -1 {
  if (to === (from + 1) % count) return 1
  if (to === (from - 1 + count) % count) return -1
  const forward = (to - from + count) % count
  const backward = (from - to + count) % count
  return forward <= backward ? 1 : -1
}

function StageImage({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <div className={`relative w-full shrink-0 ${STAGE_HEIGHT} bg-stage`}>
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-contain object-center ${className}`}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

export function ProjectSpotlight({ projects }: Props) {
  const spotlight = useMemo(() => {
    const orderKey = (p: Project) =>
      p.spotlightOrder ?? Number.POSITIVE_INFINITY
    return projects
      .filter((p) => p.spotlight && p.screenshots.length > 0 && !p.error)
      .sort((a, b) => orderKey(a) - orderKey(b) || a.name.localeCompare(b.name))
  }, [projects])

  const [projectIndex, setProjectIndex] = useState(0)
  const [imageIndex, setImageIndex] = useState(0)
  const [projectSlide, setProjectSlide] = useState<{
    dir: 1 | -1
    key: number
  }>({ dir: 1, key: 0 })
  const [imageSlideKey, setImageSlideKey] = useState(0)

  const count = spotlight.length
  const current = spotlight[projectIndex]
  const shots = current?.screenshots ?? []
  const activeShot = shots[imageIndex]

  const applyProject = useCallback(
    (index: number, dir: 1 | -1, atImage = 0) => {
      if (index === projectIndex && atImage === imageIndex) return
      setProjectSlide((s) => ({ dir, key: s.key + 1 }))
      setImageSlideKey(0)
      setProjectIndex(index)
      setImageIndex(atImage)
    },
    [imageIndex, projectIndex],
  )

  const goProject = useCallback(
    (index: number, dir?: 1 | -1) => {
      applyProject(
        index,
        dir ?? adjacentDirection(projectIndex, index, count),
      )
    },
    [applyProject, count, projectIndex],
  )

  const goNext = useCallback(() => {
    if (!count || !current) return
    if (imageIndex < shots.length - 1) {
      setImageSlideKey((k) => k + 1)
      setImageIndex((i) => i + 1)
      return
    }
    const next = (projectIndex + 1) % count
    applyProject(next, 1)
  }, [applyProject, count, current, imageIndex, projectIndex, shots.length])

  const goPrev = useCallback(() => {
    if (!count || !current) return
    if (imageIndex > 0) {
      setImageSlideKey((k) => k + 1)
      setImageIndex((i) => i - 1)
      return
    }
    const prev = (projectIndex - 1 + count) % count
    const prevShots = spotlight[prev].screenshots
    applyProject(prev, -1, Math.max(0, prevShots.length - 1))
  }, [applyProject, count, current, imageIndex, projectIndex, spotlight])

  if (!current || !activeShot) return null

  const prevProjectIndex = (projectIndex - 1 + count) % count
  const nextProjectIndex = (projectIndex + 1) % count
  const prevProject = count > 1 ? spotlight[prevProjectIndex] : null
  const nextProject = count > 1 ? spotlight[nextProjectIndex] : null
  const showArrows = shots.length > 1 || count > 1

  const projectAnimClass =
    projectSlide.dir === 1
      ? 'animate-spotlight-enter-right'
      : 'animate-spotlight-enter-left'

  const sidePeekClass =
    'group absolute z-0 hidden w-[38%] max-w-[22rem] overflow-hidden rounded-xl border border-border/50 bg-stage shadow-lg transition duration-300 ease-out sm:block md:w-[34%] md:max-w-md lg:max-w-lg [transform-style:preserve-3d]'

  return (
    <section
      className="relative left-1/2 mb-12 w-screen max-w-[100vw] -translate-x-1/2"
      aria-roledescription="carousel"
      aria-label="Featured project demos"
    >
      <div className="border-y border-border bg-surface-raised/40 py-8">
        <p className="mb-4 text-center font-mono text-xs uppercase tracking-widest text-muted">
          Demos
        </p>

        <div
          className="mb-8 flex flex-wrap justify-center gap-2 px-4"
          role="tablist"
          aria-label="Featured projects"
        >
          {spotlight.map((p, i) => {
            const selected = i === projectIndex
            return (
              <button
                key={p.slug}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => goProject(i)}
                className={`rounded-full border px-4 py-1.5 font-mono text-sm transition ${
                  selected
                    ? 'border-accent/60 bg-accent/10 text-accent'
                    : 'border-border text-muted hover:border-muted hover:text-foreground'
                }`}
              >
                {p.name}
              </button>
            )
          })}
        </div>

        <div
          className="relative mx-auto px-4"
          style={{ perspective: '1400px' }}
        >
          <div className="relative flex items-center justify-center">
            {prevProject && (
              <button
                type="button"
                onClick={() => goProject(prevProjectIndex, -1)}
                className={`${sidePeekClass} left-0 origin-right opacity-[0.28] hover:opacity-[0.45] md:-left-2 lg:left-[2%] [transform:rotateY(20deg)_scale(0.9)]`}
                aria-label={`View ${prevProject.name}`}
              >
                <StageImage
                  src={publicAsset(heroShot(prevProject)!.src)}
                  alt=""
                  className="opacity-90"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface/95 to-transparent px-2 py-2 text-center font-mono text-xs text-muted/90 group-hover:text-muted">
                  {prevProject.name}
                </span>
              </button>
            )}

            {nextProject && (
              <button
                type="button"
                onClick={() => goProject(nextProjectIndex, 1)}
                className={`${sidePeekClass} right-0 origin-left opacity-[0.28] hover:opacity-[0.45] md:-right-2 lg:right-[2%] [transform:rotateY(-20deg)_scale(0.9)]`}
                aria-label={`View ${nextProject.name}`}
              >
                <StageImage
                  src={publicAsset(heroShot(nextProject)!.src)}
                  alt=""
                  className="opacity-90"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface/95 to-transparent px-2 py-2 text-center font-mono text-xs text-muted/90 group-hover:text-muted">
                  {nextProject.name}
                </span>
              </button>
            )}

            <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface-raised/90 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)]">
              <div className="relative overflow-hidden">
                <div
                  key={`project-${projectSlide.key}`}
                  className={`relative will-change-transform ${projectAnimClass}`}
                >
                  <div
                    key={`${current.slug}-${imageIndex}-${imageSlideKey}`}
                    className={
                      imageSlideKey > 0 ? 'animate-spotlight-crossfade' : ''
                    }
                  >
                    <StageImage
                      src={publicAsset(activeShot.src)}
                      alt={activeShot.alt ?? `${current.name} screenshot`}
                    />
                  </div>
                </div>

                {showArrows && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-border/80 bg-surface-raised/95 px-3 py-2.5 text-lg leading-none text-foreground shadow-md transition hover:border-accent/50"
                      aria-label="Previous screenshot or project"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-border/80 bg-surface-raised/95 px-3 py-2.5 text-lg leading-none text-foreground shadow-md transition hover:border-accent/50"
                      aria-label="Next screenshot or project"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              <div
                className={`flex items-center justify-center gap-2 border-t border-border px-4 py-3 ${THUMB_ROW}`}
              >
                {shots.map((shot, i) => (
                  <button
                    key={shot.src}
                    type="button"
                    onClick={() => {
                      if (i !== imageIndex) setImageSlideKey((k) => k + 1)
                      setImageIndex(i)
                    }}
                    className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      i === imageIndex
                        ? 'border-accent'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    aria-label={shot.alt ?? `Screenshot ${i + 1}`}
                    aria-current={i === imageIndex}
                  >
                    <img
                      src={publicAsset(shot.src)}
                      alt=""
                      className="h-14 w-24 object-cover object-top"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 flex max-w-3xl flex-col items-center gap-3 px-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="line-clamp-3 text-sm text-muted">{current.description}</p>
          <div className="flex shrink-0 flex-wrap justify-center gap-2">
            {current.deployUrl && (
              <a
                href={current.deployUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-live-demo btn-live-demo-spotlight"
              >
                Live demo
              </a>
            )}
            <a
              href={current.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-foreground transition hover:border-muted"
            >
              Repository
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

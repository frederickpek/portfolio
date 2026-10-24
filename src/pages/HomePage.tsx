import { CombinedActivityPanel } from '../components/CombinedActivityPanel'
import { HomeContactStrip } from '../components/HomeContactStrip'
import { HomeFeaturedWork } from '../components/HomeFeaturedWork'
import { HomeRecentWriting } from '../components/HomeRecentWriting'
import { profile } from '../config/profile'
import type { AppRoute } from '../hooks/useAppRoute'

type Props = {
  onNavigate: (route: AppRoute) => void
  onOpenPost: (slug: string) => void
}

export function HomePage({ onNavigate, onOpenPost }: Props) {
  return (
    <div className="flex flex-col gap-14 py-10 pb-16">
      <section className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Portfolio
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-3 text-lg text-muted">{profile.tagline}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted/90">{profile.bio}</p>
      </section>

      <section>
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            Coding rhythm
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Activity
          </h2>
        </div>
        <CombinedActivityPanel />
      </section>

      <HomeRecentWriting
        onOpenPost={onOpenPost}
        onViewAll={() => onNavigate('blog')}
      />

      <HomeFeaturedWork onViewAll={() => onNavigate('projects')} />

      <HomeContactStrip />
    </div>
  )
}

import { CombinedActivityPanel } from './components/CombinedActivityPanel'
import { ProjectGrid } from './components/ProjectGrid'
import { profile } from './config/profile'

export default function App() {
  return (
    <div className="mx-auto min-h-svh max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-12 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Portfolio
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-3 text-lg text-muted">{profile.tagline}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted/90">{profile.bio}</p>
      </header>

      <main className="flex flex-col gap-14">
        <section id="activity" className="scroll-mt-8">
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

        <ProjectGrid />
      </main>

      <footer className="mt-16 border-t border-border pt-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </div>
  )
}

import { SiteHeader } from './components/SiteHeader'
import { profile } from './config/profile'
import { useAppRoute } from './hooks/useAppRoute'
import { useTheme } from './hooks/useTheme'
import { BlogPage } from './pages/BlogPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'

export default function App() {
  const { route, blogSlug, navigate, openBlogPost, openBlogIndex } =
    useAppRoute()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader
        route={route}
        onNavigate={navigate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8">
        {route === 'home' && (
          <HomePage onNavigate={navigate} onOpenPost={openBlogPost} />
        )}
        {route === 'projects' && <ProjectsPage />}
        {route === 'blog' && !blogSlug && (
          <BlogPage onOpenPost={openBlogPost} />
        )}
        {route === 'blog' && blogSlug && (
          <BlogPostPage slug={blogSlug} onBack={openBlogIndex} />
        )}
        {route === 'contact' && <ContactPage />}
      </div>

      <footer className="border-t border-border py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </div>
  )
}

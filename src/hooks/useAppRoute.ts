import { useCallback, useEffect, useState } from 'react'

export const APP_ROUTES = [
  'home',
  'projects',
  'blog',
  'contact',
] as const

export type AppRoute = (typeof APP_ROUTES)[number]

export type AppRouteState = {
  route: AppRoute
  blogSlug: string | null
}

function parseHash(): AppRouteState {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const lower = raw.toLowerCase()

  if (lower.startsWith('blog/')) {
    const slug = raw.slice('blog/'.length).trim()
    return { route: 'blog', blogSlug: slug || null }
  }

  if (APP_ROUTES.includes(lower as AppRoute) && lower !== 'home') {
    return { route: lower as AppRoute, blogSlug: null }
  }

  return { route: 'home', blogSlug: null }
}

export function useAppRoute() {
  const [state, setState] = useState<AppRouteState>(() => parseHash())

  useEffect(() => {
    const sync = () => setState(parseHash())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const navigate = useCallback((next: AppRoute) => {
    window.location.hash = next === 'home' ? '' : next
    setState(parseHash())
  }, [])

  const openBlogPost = useCallback((slug: string) => {
    window.location.hash = `blog/${slug}`
    setState(parseHash())
  }, [])

  const openBlogIndex = useCallback(() => {
    window.location.hash = 'blog'
    setState(parseHash())
  }, [])

  return {
    route: state.route,
    blogSlug: state.blogSlug,
    navigate,
    openBlogPost,
    openBlogIndex,
  }
}

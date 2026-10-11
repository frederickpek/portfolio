/** Resolve a path under `public/` for the current Vite base (e.g. /portfolio/). */
export function publicAsset(path: string): string {
  const trimmed = path.replace(/^\//, '')
  const base = import.meta.env.BASE_URL
  return `${base}${trimmed}`
}

import { format, parseISO } from 'date-fns'
import { blogPosts } from '../data/blog-posts'
import { publicAsset } from '../lib/public-asset'
import type { BlogPost } from '../types/blog'

type Props = {
  onOpenPost: (slug: string) => void
}

function groupByYear(posts: BlogPost[]): Map<number, BlogPost[]> {
  const sorted = [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
  const map = new Map<number, BlogPost[]>()
  for (const post of sorted) {
    const year = parseISO(post.publishedAt).getFullYear()
    const list = map.get(year) ?? []
    list.push(post)
    map.set(year, list)
  }
  return map
}

export function BlogPage({ onOpenPost }: Props) {
  const byYear = groupByYear(blogPosts)

  if (blogPosts.length === 0) {
    return (
      <section className="py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Blog
        </h1>
        <p className="mt-3 text-muted">Nothing published yet.</p>
      </section>
    )
  }

  return (
    <section className="py-10">
      <div className="mx-auto max-w-3xl">
        {[...byYear.entries()].map(([year, posts]) => (
          <div key={year} className="mb-12 last:mb-0">
            <h2 className="mb-6 text-3xl font-semibold tracking-tight text-foreground">
              {year}
            </h2>
            <ul className="flex flex-col gap-10">
              {posts.map((post) => (
                <li key={post.slug}>
                  <article className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                    <button
                      type="button"
                      onClick={() => onOpenPost(post.slug)}
                      className={`relative aspect-[3/2] w-full shrink-0 overflow-hidden rounded-xl border border-border sm:w-48 ${
                        post.coverImage.endsWith('.svg')
                          ? 'bg-[#0c0f14]'
                          : post.coverImage.includes('leetcode-cover')
                            ? 'bg-black'
                            : 'bg-stage'
                      }`}
                    >
                      <img
                        src={publicAsset(post.coverImage)}
                        alt=""
                        className={`absolute inset-0 h-full w-full object-center ${
                          post.coverImage.endsWith('.svg') ||
                          post.coverImage.includes('leetcode-cover')
                            ? 'object-contain'
                            : 'object-cover'
                        }`}
                        loading="lazy"
                      />
                    </button>
                    <div className="min-w-0 flex-1">
                      <time
                        dateTime={post.publishedAt}
                        className="text-sm text-muted"
                      >
                        {format(parseISO(post.publishedAt), 'MMM d, yyyy')}
                      </time>
                      <h3 className="mt-1 text-xl font-semibold text-foreground">
                        <button
                          type="button"
                          onClick={() => onOpenPost(post.slug)}
                          className="text-left transition hover:text-accent"
                        >
                          {post.title}
                        </button>
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                        {post.excerpt}
                      </p>
                      <button
                        type="button"
                        onClick={() => onOpenPost(post.slug)}
                        className="mt-3 text-sm text-muted transition hover:text-accent"
                      >
                        Read article →
                      </button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

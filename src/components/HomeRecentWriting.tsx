import { format, parseISO } from 'date-fns'
import { blogPosts } from '../data/blog-posts'
import { publicAsset } from '../lib/public-asset'
import { HomeSectionHeader } from './HomeSectionHeader'

type Props = {
  onOpenPost: (slug: string) => void
  onViewAll: () => void
  limit?: number
}

function coverThumbClass(coverImage: string): string {
  if (coverImage.endsWith('.svg')) return 'bg-[#0c0f14]'
  if (coverImage.includes('leetcode-cover')) return 'bg-black'
  return 'bg-stage'
}

function coverImgClass(coverImage: string): string {
  if (coverImage.endsWith('.svg') || coverImage.includes('leetcode-cover')) {
    return 'object-contain'
  }
  return 'object-cover'
}

export function HomeRecentWriting({
  onOpenPost,
  onViewAll,
  limit = 3,
}: Props) {
  const posts = [...blogPosts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, limit)

  if (posts.length === 0) return null

  return (
    <section>
      <HomeSectionHeader
        eyebrow="Recent"
        title="Writing"
        description="Notes on tools, markets, food, and how I work with AI."
        action={{ label: 'All posts', onClick: onViewAll }}
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised/50 transition hover:border-accent/35">
              <button
                type="button"
                onClick={() => onOpenPost(post.slug)}
                className={`relative aspect-[3/2] w-full overflow-hidden ${coverThumbClass(post.coverImage)}`}
              >
                <img
                  src={publicAsset(post.coverImage)}
                  alt=""
                  className={`absolute inset-0 h-full w-full object-center transition duration-300 group-hover:scale-[1.02] ${coverImgClass(post.coverImage)}`}
                  loading="lazy"
                />
              </button>
              <div className="flex flex-1 flex-col p-4">
                <time
                  dateTime={post.publishedAt}
                  className="text-xs text-muted"
                >
                  {format(parseISO(post.publishedAt), 'MMM d, yyyy')}
                </time>
                <h3 className="mt-1 text-base font-semibold leading-snug text-foreground">
                  <button
                    type="button"
                    onClick={() => onOpenPost(post.slug)}
                    className="text-left transition group-hover:text-accent"
                  >
                    {post.title}
                  </button>
                </h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
                  {post.excerpt}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

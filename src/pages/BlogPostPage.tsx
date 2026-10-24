import { format, parseISO } from 'date-fns'
import { getBlogPost } from '../data/blog-posts'
import { profile } from '../config/profile'
import { publicAsset } from '../lib/public-asset'
import type { BlogBlock } from '../types/blog'

function BlogContent({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="prose-blog space-y-4 text-base leading-relaxed text-muted">
      {blocks.map((block, i) => {
        if (block.type === 'h2') {
          return (
            <h2
              key={`h2-${i}`}
              className="!mt-10 text-xl font-semibold tracking-tight text-foreground first:!mt-0"
            >
              {block.text}
            </h2>
          )
        }
        if (block.type === 'figure') {
          return (
            <figure key={`fig-${i}`} className="!my-6">
              <div className="overflow-hidden rounded-2xl border border-border">
                <img
                  src={publicAsset(block.src)}
                  alt={block.alt ?? ''}
                  className="block max-h-[28rem] w-full object-contain object-center bg-stage"
                />
              </div>
              {block.caption ? (
                <figcaption className="mt-3 text-sm leading-relaxed text-muted">
                  {block.captionHref ? (
                    <a
                      href={block.captionHref}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent transition hover:underline"
                    >
                      {block.caption}
                    </a>
                  ) : (
                    block.caption
                  )}
                </figcaption>
              ) : null}
            </figure>
          )
        }
        return (
          <p key={`p-${i}`}>{block.text}</p>
        )
      })}
    </div>
  )
}

type Props = {
  slug: string
  onBack: () => void
}

export function BlogPostPage({ slug, onBack }: Props) {
  const post = getBlogPost(slug)

  if (!post) {
    return (
      <section className="py-16">
        <p className="text-muted">Post not found.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 text-sm text-accent hover:underline"
        >
          ← All posts
        </button>
      </section>
    )
  }

  const coverIsSvg = post.coverImage.endsWith('.svg')

  return (
    <article className="py-10">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 text-sm text-muted transition hover:text-accent"
        >
          ← All posts
        </button>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-muted">
            <time dateTime={post.publishedAt}>
              {format(parseISO(post.publishedAt), 'MMM dd, yyyy')}
            </time>
            <span className="mx-2 text-border">·</span>
            <span>{profile.name}</span>
          </p>
        </header>

        <figure className="mb-8">
          <div
            className={`overflow-hidden rounded-2xl border border-border ${
              post.coverFit === 'cover'
                ? `aspect-[3/2] ${
                    coverIsSvg
                      ? 'bg-[#0c0f14]'
                      : post.coverImage.includes('leetcode-cover')
                        ? 'bg-black'
                        : 'bg-[#282828]'
                  }`
                : ''
            }`}
          >
            <img
              src={publicAsset(post.coverImage)}
              alt={post.coverAlt ?? post.title}
              className={
                post.coverFit === 'cover'
                  ? `block h-full w-full object-center ${
                      coverIsSvg || post.coverImage.includes('leetcode-cover')
                        ? 'object-contain'
                        : 'object-cover'
                    }`
                  : 'block max-h-[28rem] w-full object-contain object-center bg-stage'
              }
            />
          </div>
          {post.imageCaption ? (
            <figcaption className="mt-3 text-sm leading-relaxed text-muted">
              {post.imageCaption}
            </figcaption>
          ) : null}
        </figure>

        {post.blocks && post.blocks.length > 0 ? (
          <BlogContent blocks={post.blocks} />
        ) : (
          <div className="prose-blog space-y-4 text-base leading-relaxed text-muted">
            {post.body.map((paragraph, i) => (
              <p key={`${i}-${paragraph.slice(0, 40)}`}>{paragraph}</p>
            ))}
          </div>
        )}

        {post.links ? (
          <footer className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
            {post.links.demoUrl ? (
              <a
                href={post.links.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-live-demo"
              >
                Live demo
              </a>
            ) : null}
            <a
              href={post.links.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border px-2.5 py-1 text-xs text-foreground transition hover:border-muted"
            >
              Repository
            </a>
          </footer>
        ) : null}
      </div>
    </article>
  )
}

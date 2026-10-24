export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | {
      type: 'figure'
      src: string
      alt?: string
      caption?: string
      /** When set, the caption renders as an external link */
      captionHref?: string
    }

export type BlogPost = {
  slug: string
  title: string
  /** ISO date YYYY-MM-DD */
  publishedAt: string
  excerpt: string
  /** Path under public/ */
  coverImage: string
  coverAlt?: string
  /** Default `contain` preserves full screenshots; `cover` fills the hero frame */
  coverFit?: 'contain' | 'cover'
  /** Plain paragraphs when `blocks` is omitted */
  body: string[]
  /** Richer layout: headings, inline figures */
  blocks?: BlogBlock[]
  /** Shown under the hero image */
  imageCaption?: string
  links?: {
    repoUrl: string
    demoUrl?: string
  }
}

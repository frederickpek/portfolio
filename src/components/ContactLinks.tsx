import type { ReactElement, SVGProps } from 'react'
import { profile } from '../config/profile'

function IconMail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  )
}

function IconGitHub(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.83 1.24 1.83 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.05.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.69.83.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  )
}

function IconLinkedIn(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.58 0 4.24 2.36 4.24 5.43v6.31ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.23 0 22.23 0Z" />
    </svg>
  )
}

type LinkItem = {
  label: string
  href: string
  display: string
  external?: boolean
  Icon: (props: SVGProps<SVGSVGElement>) => ReactElement
}

const links: LinkItem[] = [
  {
    label: 'Email',
    href: `mailto:${profile.email}`,
    display: profile.email,
    Icon: IconMail,
  },
  {
    label: 'GitHub',
    href: profile.githubUrl,
    display: profile.githubUsername,
    external: true,
    Icon: IconGitHub,
  },
  {
    label: 'LinkedIn',
    href: profile.linkedinUrl,
    display: profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/, ''),
    external: true,
    Icon: IconLinkedIn,
  },
]

type Props = {
  className?: string
}

export function ContactLinks({ className = '' }: Props) {
  return (
    <nav aria-label="Contact links" className={className}>
      <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
        {links.map(({ label, href, display, external, Icon }) => (
          <li key={label} className="min-w-0">
            <a
              href={href}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="group inline-flex max-w-full items-center gap-2.5 text-base text-foreground/90 transition hover:text-accent sm:text-lg"
            >
              <Icon
                className="h-4 w-4 shrink-0 text-muted/90 transition group-hover:text-accent"
                aria-hidden
              />
              <span className="min-w-0">{display}</span>
              <span className="sr-only">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

import { ContactLinks } from '../components/ContactLinks'
import { profile } from '../config/profile'

export function ContactPage() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Contact
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          {profile.contactIntro}
        </p>

        <ContactLinks className="mt-8" />
      </div>
    </section>
  )
}

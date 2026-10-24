import { profile } from '../config/profile'
import { ContactLinks } from './ContactLinks'
import { HomeSectionHeader } from './HomeSectionHeader'

export function HomeContactStrip() {
  return (
    <section>
      <HomeSectionHeader
        eyebrow="Connect"
        title="Say hello"
        description={profile.contactIntro}
      />
      <ContactLinks />
    </section>
  )
}

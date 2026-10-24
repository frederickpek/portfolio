type Props = {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: Props) {
  return (
    <section className="py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-3 max-w-lg text-muted">{description}</p>
    </section>
  )
}

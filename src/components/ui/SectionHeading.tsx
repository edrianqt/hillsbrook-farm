type Props = {
  eyebrow?: string
  title: string
  intro?: string
  /** id for the heading, so the section can say "I am labelled by this heading" */
  id?: string
  /** h1 for the very top of the page, h2 for everything else */
  level?: 'h1' | 'h2'
  align?: 'left' | 'center'
  /** "dark" for headings sitting on a dark green background */
  tone?: 'light' | 'dark'
}

/** Small label + big serif title + optional intro, used at the top of every section. */
export default function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  level = 'h2',
  align = 'left',
  tone = 'light',
}: Props) {
  const Heading = level
  const dark = tone === 'dark'
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && (
        <p className={`text-sm font-semibold ${dark ? 'text-cream' : 'text-lagoon-ink'}`}>{eyebrow}</p>
      )}
      <Heading
        id={id}
        // lets the page move keyboard focus here when someone arrives at this section from another page
        tabIndex={id ? -1 : undefined}
        className={`mt-2 font-semibold leading-[1.05] ${
          level === 'h1' ? 'text-5xl sm:text-6xl lg:text-7xl' : 'text-4xl sm:text-5xl'
        } ${dark ? 'text-milk' : 'text-pasture'}`}
      >
        {title}
      </Heading>
      {intro && (
        <p className={`mt-5 text-lg leading-relaxed ${dark ? 'text-mist' : 'text-soil-muted'}`}>{intro}</p>
      )}
    </div>
  )
}

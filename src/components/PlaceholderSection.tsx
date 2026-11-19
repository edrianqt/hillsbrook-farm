import type { SectionInfo } from '../content/site'
import Card from './ui/Card'
import SectionHeading from './ui/SectionHeading'

type Props = {
  section: SectionInfo
  /** Alternate background shades so you can see where each section starts and ends */
  shade: 'light' | 'dark'
}

/** A labelled section waiting for its real design in a later phase. Shows the shared heading and card styles. */
export default function PlaceholderSection({ section, shade }: Props) {
  const headingId = `${section.id}-title`
  return (
    <section
      id={section.id}
      aria-labelledby={headingId}
      className={`flex min-h-[70svh] items-center ${shade === 'light' ? 'bg-milk' : 'bg-cream-50'}`}
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <SectionHeading id={headingId} eyebrow={section.eyebrow} title={section.title} intro={section.intro} />
        <Card tone={shade === 'light' ? 'cream' : 'milk'}>
          <p className="text-sm font-semibold text-lagoon-ink">Coming soon</p>
          <p className="mt-2 text-soil-muted">
            This card shows the shared card style. The real content for this section arrives in a later phase.
          </p>
          <p className="mt-4 inline-block rounded-full bg-pasture-50 px-3 py-1 font-mono text-xs text-pasture">#{section.id}</p>
        </Card>
      </div>
    </section>
  )
}

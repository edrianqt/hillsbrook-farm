import type { SectionInfo } from '../content/site'

type Props = {
  section: SectionInfo
  /** Alternate background shades so you can see where each section starts and ends */
  shade: 'light' | 'dark'
}

/** An empty, labelled section. Each one is replaced by its real design in a later phase. */
export default function PlaceholderSection({ section, shade }: Props) {
  const headingId = `${section.id}-title`
  return (
    <section
      id={section.id}
      aria-labelledby={headingId}
      className={`flex min-h-[80svh] items-center ${shade === 'light' ? 'bg-stone-50' : 'bg-stone-100'}`}
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24">
        <p className="text-sm font-semibold tracking-widest text-emerald-800 uppercase">{section.eyebrow}</p>
        <h2 id={headingId} className="mt-3 text-3xl font-bold text-stone-900 sm:text-5xl">
          {section.title}
        </h2>
        <p className="mt-4 max-w-xl text-stone-700">{section.placeholder}</p>
        <p className="mt-6 inline-block rounded bg-amber-100 px-3 py-1 font-mono text-xs text-amber-900">
          #{section.id}
        </p>
      </div>
    </section>
  )
}

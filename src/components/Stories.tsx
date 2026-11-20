import { storiesSection, ui } from '../content/site'
import { formatDate, homeStories, type Story } from '../lib/stories'
import Picture from './Picture'
import Button from './ui/Button'
import SectionHeading from './ui/SectionHeading'

/** One story card: picture, category tag, title, short summary, "Read more". */
export function StoryCard({ story, headingLevel = 'h3' }: { story: Story; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel
  const date = formatDate(story.date)
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-pasture/10 bg-white shadow-[0_1px_2px_rgb(43_36_32/0.06),0_8px_24px_-12px_rgb(12_82_71/0.18)]">
      <div className="aspect-[16/10] overflow-hidden bg-pasture-50">
        {story.image && (
          <Picture
            src={story.image}
            alt={story.imageAlt}
            sizes="(min-width: 1024px) 400px, (min-width: 768px) 33vw, 100vw"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-cream px-3 py-1 font-semibold text-pasture">{story.category}</span>
          {date && <time dateTime={story.date} className="text-soil-muted">{date}</time>}
        </p>
        <Heading className="mt-3 text-2xl leading-tight font-semibold text-pasture">{story.title}</Heading>
        <p className="mt-2 flex-1 leading-relaxed text-soil-muted">{story.excerpt}</p>
        {/* the link covers the whole card, so the card is easy to tap */}
        <a
          href={`#story-${story.slug}`}
          className="mt-4 inline-flex min-h-11 items-center gap-1 font-semibold text-lagoon-ink after:absolute after:inset-0 after:content-[''] hover:underline"
        >
          {storiesSection.readMore}
          <span className="sr-only">: {story.title}</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  )
}

/** Farm Stories on the home page: three cards and a link to all stories. */
export default function Stories() {
  return (
    <section id="stories" aria-labelledby="stories-title" className="bg-cream-50">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading id="stories-title" eyebrow={storiesSection.eyebrow} title={storiesSection.title} intro={[storiesSection.intro, ui.storiesInEnglish].filter(Boolean).join(' ')} />
          <Button href="#all-stories" variant="secondary" className="self-start sm:self-auto">
            {storiesSection.viewAll}
          </Button>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {homeStories().map((s) => (
            <li key={s.slug} className="flex">
              <StoryCard story={s} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

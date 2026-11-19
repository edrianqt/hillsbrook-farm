import { marked } from 'marked'
import { useEffect, useMemo } from 'react'
import { farm, orderButton, storiesSection } from '../content/site'
import Picture from '../components/Picture'
import { StoryCard } from '../components/Stories'
import Button from '../components/ui/Button'
import { MessengerIcon } from '../components/ui/icons'
import { findStory, formatDate, stories } from '../lib/stories'

/** Markdown → web page. [photo: …] and [details: …] lines become highlighted "to add" boxes. */
function toHtml(markdown: string) {
  const withNotes = markdown.replace(/^\[(photo|details)(?::([^\]]*))?\]\s*$/gm, (_, kind: string, rest = '') =>
    `<p class="story-note"><strong>${kind === 'photo' ? 'Photo to add' : 'Details to add'}</strong>${rest ? `:${rest}` : ''}</p>`,
  )
  return marked.parse(withNotes, { async: false }) as string
}

/** The page for one farm story (address: #story-<file name>). */
export default function StoryPage({ slug }: { slug: string }) {
  const story = findStory(slug)
  const html = useMemo(() => (story ? toHtml(story.body) : ''), [story])

  useEffect(() => {
    document.title = story ? `${story.title} | ${farm.name}` : `Story not found | ${farm.name}`
  }, [story])

  if (!story) {
    return (
      <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-6 pt-36 pb-24">
        <h1 className="text-4xl font-semibold text-pasture">Story not found</h1>
        <p className="mt-4 text-soil-muted">This story may have moved. Have a look at all our stories instead.</p>
        <Button href="#all-stories" className="mt-8">
          {storiesSection.viewAll}
        </Button>
      </main>
    )
  }

  const more = stories.filter((s) => s.slug !== story.slug).slice(0, 3)
  const date = formatDate(story.date)

  return (
    <main id="main" tabIndex={-1} className="bg-milk">
      <article className="mx-auto max-w-3xl px-6 pt-32 pb-16">
        <a href="#all-stories" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-lagoon-ink hover:underline">
          <span aria-hidden="true">←</span> All stories
        </a>
        <p className="mt-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-cream px-3 py-1 font-semibold text-pasture">{story.category}</span>
          {date && <time dateTime={story.date} className="text-soil-muted">{date}</time>}
        </p>
        <h1 className="mt-4 text-4xl leading-[1.08] font-semibold text-pasture sm:text-5xl">{story.title}</h1>
        <p className="mt-4 text-xl leading-relaxed text-soil-muted">{story.excerpt}</p>
        {story.image && (
          <div className="mt-10 aspect-[16/9] overflow-hidden rounded-[2rem] shadow-[0_20px_50px_-24px_rgb(8_58_50/0.45)]">
            <Picture
              src={story.image}
              alt={story.imageAlt}
              sizes="(min-width: 800px) 768px, 100vw"
              loading="eager"
              fetchPriority="high"
              className="size-full object-cover"
            />
          </div>
        )}
        {/* story text comes from the Markdown file you wrote */}
        <div className="story-body mt-10" dangerouslySetInnerHTML={{ __html: html }} />

        <div className="mt-14 flex flex-col gap-3 rounded-3xl bg-pasture-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-xl font-semibold text-pasture">Taste the milk from this farm.</p>
          <Button href={orderButton.href} icon={<MessengerIcon className="size-4" />}>
            {orderButton.label}
          </Button>
        </div>
      </article>

      <section aria-labelledby="more-stories" className="bg-cream-50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 id="more-stories" className="text-3xl font-semibold text-pasture">
            More from the farm
          </h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {more.map((s) => (
              <li key={s.slug} className="flex">
                <StoryCard story={s} />
              </li>
            ))}
          </ul>
          <a href="#stories" className="mt-8 inline-flex min-h-11 items-center gap-1 font-semibold text-lagoon-ink hover:underline">
            <span aria-hidden="true">←</span> Back to the home page
          </a>
        </div>
      </section>
    </main>
  )
}

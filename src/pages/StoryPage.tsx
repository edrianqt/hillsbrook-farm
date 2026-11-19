import { useEffect } from 'react'
import { farm, orderButton, storiesSection } from '../content/site'
import { asset } from '../components/Logo'
import { StoryCard } from '../components/Stories'
import Button from '../components/ui/Button'
import { MessengerIcon } from '../components/ui/icons'
import { findStory, formatDate, stories } from '../lib/stories'

/** The page for one farm story (address: #story-<file name>). */
export default function StoryPage({ slug }: { slug: string }) {
  const story = findStory(slug)

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
          <img
            src={asset(story.image)}
            alt={story.imageAlt}
            decoding="async"
            className="mt-10 aspect-[16/9] w-full rounded-[2rem] object-cover shadow-[0_20px_50px_-24px_rgb(8_58_50/0.45)]"
          />
        )}
        {/* story text comes from the Markdown file you wrote */}
        <div className="story-body mt-10" dangerouslySetInnerHTML={{ __html: story.html }} />

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

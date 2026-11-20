import { useEffect } from 'react'
import { farm, storiesSection, ui } from '../content/site'
import { StoryCard } from '../components/Stories'
import SectionHeading from '../components/ui/SectionHeading'
import { stories } from '../lib/stories'

/** Every farm story, newest first (address: #all-stories). */
export default function AllStories() {
  useEffect(() => {
    document.title = `${storiesSection.title} | ${farm.name}`
  }, [])

  return (
    <main id="main" tabIndex={-1} className="bg-cream-50">
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        <a href="#stories" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-lagoon-ink hover:underline">
          <span aria-hidden="true">←</span> Back to the home page
        </a>
        <div className="mt-6">
          <SectionHeading level="h1" eyebrow={storiesSection.eyebrow} title={storiesSection.title} intro={[storiesSection.intro, ui.storiesInEnglish].filter(Boolean).join(' ')} />
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <li key={s.slug} className="flex">
              <StoryCard story={s} headingLevel="h2" />
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

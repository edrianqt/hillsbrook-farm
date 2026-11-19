import { marked } from 'marked'

/**
 * Farm stories are Markdown files in src/content/stories/.
 * To add a story: copy one of the files, rename it (the file name becomes the web address),
 * change the details between the --- lines, and write the story below them.
 */
export type Story = {
  slug: string
  title: string
  category: string
  /** YYYY-MM-DD, or empty if not known yet */
  date: string
  excerpt: string
  image: string
  imageAlt: string
  featured: boolean
  html: string
}

const files = import.meta.glob('../content/stories/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

/** Reads the "key: value" lines between the --- markers at the top of a story file. */
function parse(path: string, raw: string): Story {
  const slug = path.split('/').pop()!.replace(/\.md$/, '')
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  const meta: Record<string, string> = {}
  const body = match ? match[2] : raw
  if (match) {
    for (const line of match[1].split('\n')) {
      const i = line.indexOf(':')
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
    }
  }
  // Show [photo: ...] and [details: ...] notes as highlighted boxes, so they are easy to find and replace
  const withNotes = body.replace(/^\[(photo|details)(:[^\]]*)?\]\s*$/gm, (_, kind: string, rest = '') =>
    `<p class="story-note"><strong>${kind === 'photo' ? 'Photo to add' : 'Details to add'}</strong>${rest.replace(/^:/, ':')}</p>`,
  )
  return {
    slug,
    title: meta.title ?? slug,
    category: meta.category ?? 'Story',
    date: meta.date ?? '',
    excerpt: meta.excerpt ?? '',
    image: meta.image ?? '',
    imageAlt: meta.imageAlt ?? '',
    featured: meta.featured === 'true',
    html: marked.parse(withNotes, { async: false }) as string,
  }
}

/** All stories, newest first (stories without a date go last). */
export const stories: Story[] = Object.entries(files)
  .map(([path, raw]) => parse(path, raw))
  .sort((a, b) => (b.date || '0').localeCompare(a.date || '0'))

export const findStory = (slug: string) => stories.find((s) => s.slug === slug)

/** The three stories shown on the home page: featured ones first, newest first. */
export const homeStories = () => [...stories.filter((s) => s.featured), ...stories.filter((s) => !s.featured)].slice(0, 3)

/** "27 May 2015", or '' when the date is not set. */
export function formatDate(date: string) {
  if (!date) return ''
  const d = new Date(`${date}T00:00:00`)
  return d.toLocaleDateString('en-PH', { day: 'numeric', month: 'long', year: 'numeric' })
}

import { useEffect, useState } from 'react'

/**
 * Tiny page switcher using the part of the address after "#":
 *   #story-<name>  → one story
 *   #all-stories   → every story
 *   #products etc. → the home page, at that section
 * Other "#" links (like the "Jump to main content" skip link) stay on the current page.
 * This needs no server set-up, so it works on any host.
 */
export type Route = { page: 'home'; section?: string } | { page: 'story'; slug: string } | { page: 'stories' }

const HOME_SECTIONS = ['hero', 'journey', 'family', 'pillars', 'products', 'stories', 'faq', 'visit']

export function parseHash(hash: string, current?: Route): Route {
  const h = hash.replace(/^#/, '')
  if (h.startsWith('story-')) return { page: 'story', slug: h.slice('story-'.length) }
  if (h === 'all-stories') return { page: 'stories' }
  if (!h || HOME_SECTIONS.includes(h)) return { page: 'home', section: h || undefined }
  return current ?? { page: 'home' }
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))
  useEffect(() => {
    const onChange = () => setRoute((current) => parseHash(window.location.hash, current))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

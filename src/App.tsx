import { lazy, Suspense, useEffect, useRef } from 'react'
import Faq from './components/Faq'
import Family from './components/Family'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Journey from './components/Journey'
import Pillars from './components/Pillars'
import Products from './components/Products'
import Recognition from './components/Recognition'
import Stories from './components/Stories'
import Visit from './components/Visit'
import { useLanguage } from './content/i18n'
import { farm } from './content/site'
import { useRoute } from './lib/router'
import { jumpTo, scrollToSection, startSmoothScroll } from './lib/smoothScroll'

// story pages are downloaded only when someone opens a story
const AllStories = lazy(() => import('./pages/AllStories'))
const StoryPage = lazy(() => import('./pages/StoryPage'))

function Home() {
  useEffect(() => {
    document.title = `${farm.name} | Island Pure Cow's Milk from Socorro, Surigao del Norte`
  }, [])
  return (
    <main id="main" tabIndex={-1}>
      <Hero />
      <Journey />
      <Family />
      <Pillars />
      <Recognition />
      <Products />
      <Stories />
      <Faq />
      <Visit />
    </main>
  )
}

export default function App() {
  // re-render the whole page in the new words when the language changes
  useLanguage()
  const route = useRoute()
  const previousPage = useRef(route.page)

  // Turn on smooth scrolling once when the page loads
  useEffect(() => startSmoothScroll(), [])

  // Changing page: start at the top, or at the section that was asked for (e.g. #products from a story page)
  useEffect(() => {
    const cameFromOtherPage = previousPage.current !== route.page
    previousPage.current = route.page
    // keyboard and screen-reader users start reading the new page from the top, not where the old page was
    const moveFocus = (id: string) => (document.getElementById(id) as HTMLElement | null)?.focus({ preventScroll: true })
    if (route.page !== 'home') {
      jumpTo(0)
      requestAnimationFrame(() => moveFocus('main'))
    } else if (cameFromOtherPage) {
      const section = route.section
      // wait two frames so the home page has been laid out before scrolling
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (section) scrollToSection(section)
          else jumpTo(0)
          moveFocus(section ? `${section}-title` : 'main')
        }),
      )
    }
  }, [route])

  return (
    <>
      {/* Skip links: let keyboard and screen-reader users jump past the menu */}
      <a href="#main" className="skip-link">
        Jump to main content
      </a>
      <a href="#footer" className="skip-link">
        Jump to footer
      </a>

      <Header />

      <Suspense fallback={<main id="main" className="min-h-svh" />}>
        {route.page === 'story' && <StoryPage key={route.slug} slug={route.slug} />}
        {route.page === 'stories' && <AllStories />}
      </Suspense>
      {route.page === 'home' && <Home />}

      <Footer />
    </>
  )
}

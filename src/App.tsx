import { useEffect, useRef } from 'react'
import Family from './components/Family'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Journey from './components/Journey'
import Pillars from './components/Pillars'
import Products from './components/Products'
import Stories from './components/Stories'
import Visit from './components/Visit'
import { farm } from './content/site'
import { useRoute } from './lib/router'
import { jumpTo, scrollToSection, startSmoothScroll } from './lib/smoothScroll'
import AllStories from './pages/AllStories'
import StoryPage from './pages/StoryPage'

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
      <Products />
      <Stories />
      <Visit />
    </main>
  )
}

export default function App() {
  const route = useRoute()
  const previousPage = useRef(route.page)

  // Turn on smooth scrolling once when the page loads
  useEffect(() => startSmoothScroll(), [])

  // Changing page: start at the top, or at the section that was asked for (e.g. #products from a story page)
  useEffect(() => {
    const cameFromOtherPage = previousPage.current !== route.page
    previousPage.current = route.page
    if (route.page !== 'home') {
      jumpTo(0)
    } else if (cameFromOtherPage) {
      const section = route.section
      // wait two frames so the home page has been laid out before scrolling
      requestAnimationFrame(() => requestAnimationFrame(() => (section ? scrollToSection(section) : jumpTo(0))))
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

      {route.page === 'story' && <StoryPage key={route.slug} slug={route.slug} />}
      {route.page === 'stories' && <AllStories />}
      {route.page === 'home' && <Home />}

      <Footer />
    </>
  )
}

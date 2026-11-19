import { useEffect } from 'react'
import Footer from './components/Footer'
import Hero from './components/Hero'
import PlaceholderSection from './components/PlaceholderSection'
import { sections } from './content/site'
import { startSmoothScroll } from './lib/smoothScroll'

export default function App() {
  // Turn on smooth scrolling once when the page loads
  useEffect(() => startSmoothScroll(), [])

  const middleSections = sections.filter((s) => s.id !== 'hero' && s.id !== 'footer')

  return (
    <>
      {/* Skip links: let keyboard and screen-reader users jump past repeated content */}
      <a href="#main" className="skip-link">
        Jump to main content
      </a>
      <a href="#footer" className="skip-link">
        Jump to footer
      </a>

      <main id="main" tabIndex={-1}>
        <Hero />
        {middleSections.map((section, i) => (
          <PlaceholderSection key={section.id} section={section} shade={i % 2 === 0 ? 'light' : 'dark'} />
        ))}
      </main>

      <Footer />
    </>
  )
}

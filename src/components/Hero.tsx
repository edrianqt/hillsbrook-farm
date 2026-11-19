import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { heroContent, orderButton } from '../content/site'
import { unlockAudio } from '../lib/moo'
import { hasWebGL, prefersReducedMotion } from '../lib/webgl'
import { asset } from './Logo'
import Button from './ui/Button'
import { MessengerIcon } from './ui/icons'
import SectionHeading from './ui/SectionHeading'

// The 3D scene is downloaded separately, after the text and the still picture have appeared.
const HeroScene = lazy(() => import('../three/HeroScene'))

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" />
      {on ? <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /> : <path d="m22 9-6 6M16 9l6 6" />}
    </svg>
  )
}

export default function Hero() {
  const section = useRef<HTMLElement>(null)
  // Decide once: 3D scene, or the still picture only (reduced motion, or no 3D support)
  const [use3D] = useState(() => hasWebGL() && !prefersReducedMotion())
  const [inView, setInView] = useState(true)
  const [ready, setReady] = useState(false)
  const [soundOn, setSoundOn] = useState(false)

  // Pause the 3D scene while the hero is scrolled out of view
  useEffect(() => {
    if (!section.current) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 })
    io.observe(section.current)
    return () => io.disconnect()
  }, [])

  const toggleSound = () => {
    if (!soundOn) unlockAudio()
    setSoundOn((s) => !s)
  }

  return (
    <section ref={section} id="hero" aria-labelledby="hero-title" className="relative min-h-svh overflow-hidden bg-[#f6d3a8]">
      {/* Still picture: shown while the 3D loads, and instead of it when 3D is off */}
      <picture>
        <source media="(max-aspect-ratio: 9/10)" srcSet={asset('images/hero-fallback-mobile.jpg')} />
        <img
          src={asset('images/hero-fallback.jpg')}
          alt={heroContent.imageAlt}
          className="absolute inset-0 size-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      {use3D && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <Suspense fallback={null}>
            <HeroScene active={inView} soundOn={soundOn} onReady={() => setReady(true)} />
          </Suspense>
        </div>
      )}

      {/* Soft milk-white wash behind the text so it stays readable over the scene */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[72%] bg-gradient-to-b from-milk/95 from-30% via-milk/80 via-60% to-transparent md:inset-y-0 md:right-auto md:h-auto md:w-[66%] md:bg-gradient-to-r md:from-milk/95 md:from-25% md:via-milk/75 md:via-55%"
      />

      {/* Text and buttons */}
      <div className="pointer-events-none relative mx-auto flex min-h-svh w-full max-w-7xl items-start px-6 pt-28 pb-28 md:items-center md:pt-18">
        <div className="max-w-lg [&_a]:pointer-events-auto">
          <SectionHeading
            id="hero-title"
            level="h1"
            eyebrow={heroContent.eyebrow}
            title={heroContent.title}
            intro={heroContent.subline}
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#journey" size="lg" variant="secondary" className="bg-milk/70 backdrop-blur-sm">
              {heroContent.journeyButton}
            </Button>
            <Button href={orderButton.href} size="lg" icon={<MessengerIcon />}>
              {orderButton.label}
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <a
        href="#journey"
        className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-milk/85 px-4 py-2.5 text-sm font-medium text-pasture shadow-sm backdrop-blur hover:bg-milk md:left-1/2 md:-translate-x-1/2"
      >
        {heroContent.scrollHint}
        <svg viewBox="0 0 24 24" className="size-4 motion-safe:animate-bounce" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </a>

      {/* Sound toggle and cow tip (only with the 3D scene) */}
      {use3D && (
        <div className="absolute right-6 bottom-6 flex items-center gap-3">
          <p className="hidden rounded-full bg-milk/85 px-4 py-2.5 text-sm text-soil-muted shadow-sm backdrop-blur lg:block">
            {heroContent.cowTip}
          </p>
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundOn}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-milk/85 px-4 text-sm font-medium text-pasture shadow-sm backdrop-blur hover:bg-milk"
          >
            <SoundIcon on={soundOn} />
            {soundOn ? 'Sound on' : 'Sound off'}
          </button>
        </div>
      )}
    </section>
  )
}

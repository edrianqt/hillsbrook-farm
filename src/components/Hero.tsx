import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { heroContent, type HotspotId, hotspots, orderButton, ui } from '../content/site'
import { unlockAudio } from '../lib/moo'
import { scrollToSection, whenScrollStops } from '../lib/smoothScroll'
import { hasWebGL, isTouchDevice, prefersReducedMotion, reallyVisible } from '../lib/webgl'
import { asset } from './Logo'
import { imageSize, srcSet } from './Picture'
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
  const [want3D, setWant3D] = useState(false)
  const [start3D, setStart3D] = useState(false)
  const [inView, setInView] = useState(true)
  const [ready, setReady] = useState(false)
  const [soundOn, setSoundOn] = useState(false)

  // When to start the 3D scene. The still picture shows first, so nothing is lost while waiting.
  // - Phones: on the first touch or scroll (saves mobile data and battery for visitors who just want prices).
  // - Computers: once the page has loaded and the browser is idle, or as soon as the mouse moves.
  useEffect(() => {
    if (!use3D) return
    let started = false
    const events = ['pointerdown', 'touchstart', 'keydown', 'wheel', ...(isTouchDevice() ? [] : ['pointermove'])]
    const go = () => {
      if (started) return
      started = true
      setWant3D(true)
      events.forEach((ev) => window.removeEventListener(ev, go))
      window.removeEventListener('scroll', onScroll)
    }
    // browsers can send a "scroll" while the page loads; only a real scroll by the visitor counts
    const onScroll = () => window.scrollY > 20 && go()
    events.forEach((ev) => window.addEventListener(ev, go, { passive: true }))
    window.addEventListener('scroll', onScroll, { passive: true })
    let idleId = 0
    const whenIdle = () => {
      idleId = typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(go, { timeout: 3000 }) : setTimeout(go, 1500)
    }
    if (!isTouchDevice()) {
      if (document.readyState === 'complete') whenIdle()
      else window.addEventListener('load', whenIdle, { once: true })
    }
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, go))
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('load', whenIdle)
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idleId)
      clearTimeout(idleId)
    }
  }, [use3D])

  // Start it only while the hero is on screen and the page is still, so setting it up never freezes a scroll
  useEffect(() => {
    if (!want3D || start3D || !inView) return
    return whenScrollStops(() => setStart3D(true))
  }, [want3D, start3D, inView])

  // Pause the 3D scene while the hero is scrolled out of view
  useEffect(() => {
    if (!section.current) return
    const io = new IntersectionObserver(([entry]) => setInView(reallyVisible(entry)))
    io.observe(section.current)
    return () => io.disconnect()
  }, [])

  const [hovered, setHovered] = useState<HotspotId | null>(null)
  const openHotspot = (id: HotspotId) => {
    setHovered(null)
    document.body.style.cursor = ''
    const href = hotspots.items[id].href
    if (href.startsWith('#story-')) window.location.hash = href
    else scrollToSection(href.slice(1))
  }

  // Phones: a tap on a building only shows its name and a button; the button opens it.
  // (A quick tap is also how people stop a fast scroll, so opening straight away made the page jump.)
  const [touch] = useState(isTouchDevice)
  const [picked, setPicked] = useState<HotspotId | null>(null)
  const pick = (id: HotspotId) => {
    if (!touch) return openHotspot(id)
    setPicked(id)
  }
  // hide the button again when the visitor scrolls on, or after a while
  useEffect(() => {
    if (!picked) return
    const startY = window.scrollY
    const onScroll = () => Math.abs(window.scrollY - startY) > 40 && setPicked(null)
    const timer = setTimeout(() => setPicked(null), 6000)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [picked])

  const toggleSound = () => {
    if (!soundOn) unlockAudio()
    setSoundOn((s) => !s)
  }

  return (
    <section ref={section} id="hero" aria-labelledby="hero-title" className="relative min-h-svh overflow-hidden bg-[#f6d3a8]">
      {/* Still picture: shown while the 3D loads, and instead of it when 3D is off */}
      {/* tall screens get the portrait picture; AVIF/WebP in the right size for each screen */}
      <picture>
        <source media="(max-aspect-ratio: 9/10)" type="image/avif" srcSet={srcSet('images/hero-fallback-mobile.jpg', 'avif')} sizes="100vw" />
        <source media="(max-aspect-ratio: 9/10)" type="image/webp" srcSet={srcSet('images/hero-fallback-mobile.jpg', 'webp')} sizes="100vw" />
        <source type="image/avif" srcSet={srcSet('images/hero-fallback.jpg', 'avif')} sizes="100vw" />
        <source type="image/webp" srcSet={srcSet('images/hero-fallback.jpg', 'webp')} sizes="100vw" />
        <img
          src={asset('images/hero-fallback.jpg')}
          alt={heroContent.imageAlt}
          width={imageSize('images/hero-fallback.jpg')?.width}
          height={imageSize('images/hero-fallback.jpg')?.height}
          className="absolute inset-0 size-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      {use3D && start3D && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <Suspense fallback={null}>
            <HeroScene active={inView} soundOn={soundOn} onReady={() => setReady(true)} onPick={pick} onHover={touch ? undefined : setHovered} />
          </Suspense>
        </div>
      )}

      {/* name of the building under the mouse (the same places are linked in the menu for keyboard users) */}
      {/* phones: the building that was tapped, with a button to open it */}
      {use3D && ready && touch && picked && (
        <button
          type="button"
          onClick={() => {
            setPicked(null)
            openHotspot(picked)
          }}
          className="absolute inset-x-6 bottom-6 z-20 flex min-h-11 items-center justify-center rounded-full bg-pasture px-4 py-2 text-center text-sm font-semibold text-milk shadow-lg"
        >
          {hotspots.items[picked].name} · {hotspots.items[picked].action} →
        </button>
      )}

      {use3D && ready && !touch && (
        <p
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-20 left-1/2 z-10 -translate-x-1/2 rounded-full bg-pasture/90 px-4 py-2 text-center text-sm font-semibold whitespace-nowrap text-milk shadow transition-opacity duration-200 ${hovered ? 'opacity-100' : 'opacity-0'}`}
        >
          {hovered ? `${hotspots.items[hovered].name} · ${hotspots.items[hovered].action} →` : hotspots.hint}
        </p>
      )}

      {/* Soft milk-white wash behind the text so it stays readable over the scene */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[72%] bg-gradient-to-b from-milk/95 from-30% via-milk/80 via-60% to-transparent md:landscape:inset-y-0 md:landscape:right-auto md:landscape:h-auto md:landscape:w-[66%] md:landscape:bg-gradient-to-r md:landscape:from-milk/95 md:landscape:from-25% md:landscape:via-milk/75 md:landscape:via-55%"
      />

      {/* Text and buttons */}
      <div className="pointer-events-none relative mx-auto flex min-h-svh w-full max-w-7xl items-start px-6 pt-28 pb-28 md:landscape:items-center md:landscape:pt-18">
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
        className="absolute bottom-6 left-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-milk/85 px-4 text-sm font-medium text-pasture shadow-sm backdrop-blur hover:bg-milk md:left-1/2 md:-translate-x-1/2"
      >
        {/* phones: just the arrow, so it never runs into the sound button */}
        <span className="max-sm:sr-only">{heroContent.scrollHint}</span>
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
            {soundOn ? ui.soundOn : ui.soundOff}
          </button>
        </div>
      )}
    </section>
  )
}

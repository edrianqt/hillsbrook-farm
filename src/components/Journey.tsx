import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { journey, ui } from '../content/site'
import { gsap, scrollToY, ScrollTrigger } from '../lib/smoothScroll'
import { VISIBLE_OPTIONS, hasWebGL, prefersReducedMotion, reallyVisible } from '../lib/webgl'
import type { JourneyState } from '../three/JourneyScene'
import Picture from './Picture'
import Card from './ui/Card'
import SectionHeading from './ui/SectionHeading'

const JourneyScene = lazy(() => import('../three/JourneyScene'))

const STATIONS = journey.stations
const LAST = STATIONS.length - 1

function StepLabel({ index }: { index: number }) {
  return (
    <p className="text-sm font-semibold text-lagoon-ink">
      Step {index + 1} of {STATIONS.length} · {STATIONS[index].label}
    </p>
  )
}

/** Placeholder notes are shown in a softer style so they are easy to spot and replace. */
function Detail({ text }: { text: string }) {
  if (!text) return null
  return <p className="mt-3 text-sm text-soil-muted italic">{text}</p>
}

/**
 * Reduced motion (or no 3D): the five stations as stacked picture cards.
 */
function JourneyCards() {
  return (
    <section id="journey" aria-labelledby="journey-title" className="bg-cream-50">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading id="journey-title" eyebrow={journey.eyebrow} title={journey.title} intro={journey.intro.replace('Scroll to follow', 'Follow')} />
        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {STATIONS.map((s, i) => (
            <Card as="li" key={s.label} className="overflow-hidden !p-0">
              <Picture src={s.image} alt={s.imageAlt} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="aspect-[16/10] w-full object-cover" />
              <div className="p-6">
                <StepLabel index={i} />
                <h3 className="mt-2 text-2xl font-semibold text-pasture">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-soil-muted">{s.body}</p>
                <Detail text={s.detail} />
              </div>
            </Card>
          ))}
        </ol>
      </div>
    </section>
  )
}

/**
 * The 3D scroll journey: the canvas stays pinned while the visitor scrolls about five screens.
 * Scroll position → GSAP ScrollTrigger (scrubbed) → camera position in the 3D scene.
 */
function JourneyScroll() {
  const section = useRef<HTMLElement>(null)
  const fill = useRef<HTMLDivElement>(null)
  const state = useMemo<JourneyState>(() => ({ scroll: 0 }), [])
  const [active, setActive] = useState(0)
  const [mountScene, setMountScene] = useState(false)
  const [inView, setInView] = useState(false)
  const [ready, setReady] = useState(false)

  // Load the 3D scene as the section starts to appear (its still picture shows meanwhile); pause it when out of view
  useEffect(() => {
    const el = section.current
    if (!el) return
    const near = new IntersectionObserver(([e]) => reallyVisible(e) && setMountScene(true), VISIBLE_OPTIONS)
    const visible = new IntersectionObserver(([e]) => setInView(reallyVisible(e)), VISIBLE_OPTIONS)
    near.observe(el)
    visible.observe(el)
    return () => {
      near.disconnect()
      visible.disconnect()
    }
  }, [])

  // Scrub: the tween's progress follows the scroll position exactly
  useEffect(() => {
    const el = section.current
    if (!el) return
    const proxy = { scroll: 0 }
    const tween = gsap.to(proxy, {
      scroll: 1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: true },
      onUpdate: () => {
        state.scroll = proxy.scroll
        if (fill.current) fill.current.style.transform = `scaleY(${proxy.scroll})`
        // switch cards a little before the halfway point, so the next card arrives as the camera sets off
        const station = Math.min(LAST, Math.floor(proxy.scroll * LAST + 0.6))
        setActive((a) => (a === station ? a : station))
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [state])

  const goTo = (i: number) => {
    const st = ScrollTrigger.getAll().find((t) => t.trigger === section.current)
    if (!st) return
    scrollToY(st.start + (i / LAST) * (st.end - st.start))
  }

  return (
    <section
      ref={section}
      id="journey"
      aria-labelledby="journey-title"
      className="relative -scroll-mt-20 bg-[#cfe5f1]"
      style={{ height: `${(STATIONS.length + 1) * 100}svh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* still picture of the first station until the 3D is ready */}
        {/* a still of the 3D scene itself, so the switch to 3D is seamless */}
        <Picture src="images/journey-1.jpg" alt="" sizes="100vw" className="absolute inset-0 size-full object-cover" />
        {mountScene && (
          <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}>
            <Suspense fallback={null}>
              <JourneyScene state={state} active={inView} onReady={() => setReady(true)} />
            </Suspense>
          </div>
        )}

        {/* station cards: all five are in the page for screen readers; only the current one is shown */}
        <div className="pointer-events-none absolute inset-x-4 bottom-24 sm:inset-x-auto sm:bottom-auto sm:left-6 sm:top-1/2 sm:w-[min(28rem,calc(100%-8rem))] sm:-translate-y-1/2 lg:left-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
          <h2 id="journey-title" className="sr-only">
            {journey.eyebrow}: {journey.title}
          </h2>
          <ol className="relative grid">
            {STATIONS.map((s, i) => (
              <li
                key={s.label}
                aria-current={i === active ? 'step' : undefined}
                className={`col-start-1 row-start-1 self-end rounded-3xl bg-milk/92 p-6 shadow-[0_10px_40px_-12px_rgb(8_58_50/0.35)] backdrop-blur transition-all duration-500 sm:p-8 ${
                  i === active ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
              >
                <StepLabel index={i} />
                <h3 className="mt-2 text-3xl font-semibold text-pasture sm:text-4xl">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-soil-muted">{s.body}</p>
                <Detail text={s.detail} />
              </li>
            ))}
          </ol>
        </div>

        {/* progress: five dots on a line; click one to jump to that station */}
        <nav
          aria-label={ui.journeySteps}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:top-1/2 sm:right-6 sm:bottom-auto sm:left-auto sm:translate-x-0 sm:-translate-y-1/2"
        >
          <div className="relative flex items-center gap-1 rounded-full bg-milk/85 px-2 py-1 shadow-sm backdrop-blur sm:flex-col sm:px-1 sm:py-2">
            {/* the line and how far along it we are (tall screens only) */}
            <div aria-hidden="true" className="absolute top-7 bottom-7 left-1/2 hidden w-0.5 -translate-x-1/2 bg-pasture/15 sm:block">
              <div ref={fill} className="h-full w-full origin-top scale-y-0 bg-pasture/60" />
            </div>
            {STATIONS.map((s, i) => (
              <button
                key={s.label}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to step ${i + 1}: ${s.label}`}
                aria-current={i === active ? 'step' : undefined}
                className="group relative flex size-11 items-center justify-center rounded-full"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    i === active ? 'size-3.5 bg-barn ring-4 ring-barn/20' : 'size-2.5 bg-pasture/40 group-hover:bg-pasture'
                  }`}
                />
                <span className="pointer-events-none absolute right-12 hidden rounded-full bg-pasture px-3 py-1 text-xs font-medium whitespace-nowrap text-milk opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </section>
  )
}

/** "Farm to You": 3D scroll journey, or picture cards for reduced motion / no 3D. */
export default function Journey() {
  const [use3D] = useState(() => hasWebGL() && !prefersReducedMotion())
  return use3D ? <JourneyScroll /> : <JourneyCards />
}

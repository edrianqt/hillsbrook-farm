import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// Register GSAP's ScrollTrigger plugin exactly once for the whole site.
// Any file that needs ScrollTrigger imports it from here.
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

let lenis: Lenis | null = null

/**
 * Starts Lenis smooth scrolling and keeps it in sync with GSAP ScrollTrigger.
 * Returns a cleanup function that stops it again.
 * Visitors who ask their device for reduced motion get normal browser scrolling.
 */
export function startSmoothScroll(): () => void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return () => {}

  const instance = new Lenis({
    // clicking "#journey" style links glides to that section; the CSS scroll-padding-top
    // in index.css keeps it clear of the sticky header
    anchors: true,
  })
  lenis = instance

  // Tell ScrollTrigger every time Lenis scrolls, and drive Lenis from GSAP's clock
  instance.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => instance.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    instance.destroy()
    if (lenis === instance) lenis = null
  }
}

/** Freeze page scrolling (used while the mobile menu is open). */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

/** Scroll the page to a position in pixels (smoothly, unless the visitor prefers reduced motion). */
export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 1.2 })
  else window.scrollTo({ top: y, behavior: 'auto' })
}

/** Jump instantly (no animation), e.g. to the top of a new page. */
export function jumpTo(y: number) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
  window.scrollTo(0, y)
}

/** Scroll to a section by its id, once it exists on the page. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  // the page has just changed length (e.g. coming back from a story), so measure again first
  ScrollTrigger.refresh()
  if (lenis) {
    lenis.resize()
    lenis.scrollTo(el, { immediate: true, force: true })
  } else el.scrollIntoView()
}

/**
 * Runs `run` once the page has been still for `quietMs` (soon after the call if it is not moving).
 * Heavy work, like starting a 3D scene, waits for this: on phones the page keeps gliding while the
 * browser is busy, and then visibly snaps to catch up. Returns a function that cancels it.
 */
export function whenScrollStops(run: () => void, quietMs = 400): () => void {
  let timer = window.setTimeout(done, quietMs)
  function done() {
    window.removeEventListener('scroll', onScroll)
    run()
  }
  function onScroll() {
    clearTimeout(timer)
    timer = window.setTimeout(done, quietMs)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => {
    clearTimeout(timer)
    window.removeEventListener('scroll', onScroll)
  }
}

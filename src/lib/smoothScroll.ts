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

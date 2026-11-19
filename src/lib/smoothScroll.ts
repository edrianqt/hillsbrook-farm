import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// Register GSAP's ScrollTrigger plugin exactly once for the whole site.
// Any file that needs ScrollTrigger imports it from here.
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

/**
 * Starts Lenis smooth scrolling and keeps it in sync with GSAP ScrollTrigger.
 * Returns a cleanup function that stops it again.
 * Visitors who ask their device for reduced motion get normal browser scrolling.
 */
export function startSmoothScroll(): () => void {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return () => {}

  const lenis = new Lenis({
    anchors: true, // clicking "#journey" style links scrolls smoothly to that section
  })

  // Tell ScrollTrigger every time Lenis scrolls, and drive Lenis from GSAP's clock
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
  }
}

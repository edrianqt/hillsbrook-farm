/** True if this browser and device can draw 3D (WebGL). */
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/** True if the visitor has asked their device to reduce motion. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** True on touch-first devices (phones, most tablets), or any narrow phone-sized screen. */
export function isTouchDevice(): boolean {
  return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
}

/**
 * True when at least one pixel of an element is really on screen.
 * (The browser also reports elements that only touch the edge of the screen as "intersecting".)
 */
export const reallyVisible = (e: IntersectionObserverEntry) => e.isIntersecting && e.intersectionRect.height > 0

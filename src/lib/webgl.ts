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

/** True on touch-first devices (phones, most tablets). */
export function isTouchDevice(): boolean {
  return window.matchMedia('(pointer: coarse)').matches
}

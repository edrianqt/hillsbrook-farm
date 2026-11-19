/**
 * The shape of the farm world: hills, the dirt path and where things stand.
 * Everything that sits on the ground asks `heightAt(x, z)` how high the ground is there.
 *
 * Directions: x = left/right, z = towards the viewer (+) or the sea (−), y = up. Units are roughly metres.
 */
import { CatmullRomCurve3, Vector3 } from 'three'

// ---------- small, deterministic noise (same hills every visit) ----------
function hash(x: number, z: number) {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function valueNoise(x: number, z: number) {
  const xi = Math.floor(x)
  const zi = Math.floor(z)
  const xf = x - xi
  const zf = z - zi
  const u = xf * xf * (3 - 2 * xf)
  const v = zf * zf * (3 - 2 * zf)
  const a = hash(xi, zi)
  const b = hash(xi + 1, zi)
  const c = hash(xi, zi + 1)
  const d = hash(xi + 1, zi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

export function fbm(x: number, z: number) {
  return valueNoise(x, z) * 0.6 + valueNoise(x * 2.1, z * 2.1) * 0.28 + valueNoise(x * 4.3, z * 4.3) * 0.12
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** 0 at e0, 1 at e1 (works in either direction) */
export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0))
  return t * t * (3 - 2 * t)
}

/** Seeded random numbers, so cows and plants land in the same spots every time. */
export function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

// ---------- key places on the farm ----------
export const SEA_LEVEL = -0.35
export const FARMYARD = { x: 5, z: -1.5, radius: 6 } // flat ground for the buildings
/** The pen for the grown cows */
export const PASTURE = { minX: -4.5, maxX: 2.2, minZ: 1.2, maxZ: 7.5 }
/** The calves have their own smaller pen across the path, with a shade roof */
export const CALF_PEN = { minX: 5.9, maxX: 9.1, minZ: 6.3, maxZ: 9.3 }
/** Two big, separate feed fields on the hillside: Napier grass at the back, corn in front, a farm lane between them */
export const NAPIER_PLOT = { minX: -30, maxX: -8.5, minZ: -8, maxZ: -1.4 }
export const CORN_PLOT = { minX: -29, maxX: -7.5, minZ: 2.6, maxZ: 13.5 }
export const FIELD_LANE_Z = 0.6

/** The winding dirt path from the front of the scene up to the farmyard. */
export const pathCurve = new CatmullRomCurve3(
  [
    new Vector3(5.5, 0, 22),
    new Vector3(3.2, 0, 15),
    new Vector3(4.6, 0, 9),
    new Vector3(3.4, 0, 4),
    new Vector3(4.4, 0, 0.8),
  ],
  false,
  'catmullrom',
  0.5,
)
const pathPoints = pathCurve.getSpacedPoints(80)

/** Distance (on the ground) from a point to the dirt path. */
export function distanceToPath(x: number, z: number) {
  let best = Infinity
  for (const p of pathPoints) {
    const d = (p.x - x) ** 2 + (p.z - z) ** 2
    if (d < best) best = d
  }
  return Math.sqrt(best)
}

const inRect = (r: { minX: number; maxX: number; minZ: number; maxZ: number }, x: number, z: number, pad = 0) =>
  x > r.minX - pad && x < r.maxX + pad && z > r.minZ - pad && z < r.maxZ + pad

export const isInPlot = (x: number, z: number) => inRect(NAPIER_PLOT, x, z, 1) || inRect(CORN_PLOT, x, z, 1)

/** Ground height at (x, z). */
export function heightAt(x: number, z: number) {
  // gentle rolling hills
  let h = (fbm(x * 0.06 + 3.1, z * 0.06 + 7.3) - 0.5) * 3.2 + 0.9
  // bigger hills framing the left and right edges
  h += smoothstep(-8, -26, x) * 4.5
  h += smoothstep(12, 28, x) * 3.2
  // flat farmyard for the buildings
  const dYard = Math.hypot(x - FARMYARD.x, z - FARMYARD.z)
  h = lerp(0.7, h, smoothstep(FARMYARD.radius, FARMYARD.radius + 5, dYard))
  // the land drops to a beach and into the sea at the back
  h = lerp(h, -1.6, smoothstep(-10, -17, z))
  return h
}

// ---------- buildings ----------
export const SHED = { x: 5.2, z: -3.2, rot: -0.18 }
export const PARLOR = { x: 9.8, z: -0.4, rot: -0.5 }

/** Turns a spot measured inside the milking parlor (lx = across, lz = towards its open front) into world x/z. */
export function parlorToWorld(lx: number, lz: number) {
  const c = Math.cos(PARLOR.rot)
  const s = Math.sin(PARLOR.rot)
  return { x: PARLOR.x + lx * c + lz * s, z: PARLOR.z - lx * s + lz * c }
}

/** Height of the milking parlor's concrete floor. */
export const parlorFloor = () => heightAt(PARLOR.x, PARLOR.z) + 0.11

// ---------- where the herd stands (our real herd: 5 cows, 4 calves) ----------
/** `y` is only given when the animal stands on a floor rather than the ground */
export type CowSpot = { x: number; z: number; yaw: number; calf: boolean; seed: number; y?: number }
export const herd: CowSpot[] = [
  // the five grown cows in their pen
  { x: -2.6, z: 3.0, yaw: 0.5, calf: false, seed: 1 },
  { x: 0.5, z: 2.6, yaw: 2.6, calf: false, seed: 2 },
  { x: -1.0, z: 5.7, yaw: -0.4, calf: false, seed: 3 },
  { x: 1.4, z: 5.4, yaw: 3.6, calf: false, seed: 4 },
  { x: -3.4, z: 6.4, yaw: 1.2, calf: false, seed: 5 },
  // the four calves in the calf pen
  { x: 6.5, z: 7.1, yaw: 0.4, calf: true, seed: 6 },
  { x: 8.4, z: 8.8, yaw: 2.6, calf: true, seed: 7 },
  { x: 6.8, z: 8.8, yaw: -0.7, calf: true, seed: 8 },
  { x: 8.2, z: 7.2, yaw: 3.3, calf: true, seed: 9 },
]

/**
 * The same herd during the "Farm to You" journey: two cows wait in the milking stalls,
 * the other three stay in their pen and the calves in theirs.
 */
export function journeyHerd(): CowSpot[] {
  // cows stand in their stalls facing the open front, so visitors see their faces
  const facingFront = -Math.PI / 2 + PARLOR.rot
  const stall = (lx: number, seed: number): CowSpot => {
    const p = parlorToWorld(lx, -0.35)
    return { x: p.x, z: p.z, yaw: facingFront, calf: false, seed, y: parlorFloor() }
  }
  return [stall(-1.15, 1), stall(0, 2), ...herd.filter((c) => c.seed > 2)]
}

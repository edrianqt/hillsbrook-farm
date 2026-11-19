import { PerformanceMonitor } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CatmullRomCurve3, Color, DirectionalLight, Fog, HemisphereLight, PerspectiveCamera, PointLight, Vector3 } from 'three'
import { isTouchDevice } from '../lib/webgl'
import Farm, { FirstFrame, WindClock } from './hero/Farm'
import Sky, { type SkyPalette } from './hero/Sky'
import { clamp, heightAt, journeyHerd, parlorFloor, parlorToWorld, SEA_LEVEL, smoothstep } from './hero/world'
import { BottlingTable, ChillGlow } from './journey/Bottles'
import { Bangka, boatProgress, DECK_Y, SiargaoShore } from './journey/Shore'
import { DisposeOnUnmount } from './bake'

/** Shared with the page: `scroll` is how far through the journey section the visitor has scrolled (0–1). */
export type JourneyState = { scroll: number }

export const STATION_COUNT = 5

/**
 * Turns raw scroll into journey progress with a pause at each station,
 * so the camera rests while the visitor reads the card. 0 = station 1, 1 = station 5.
 */
export function journeyProgress(scroll: number) {
  const seg = clamp(scroll) * (STATION_COUNT - 1)
  const i = Math.min(STATION_COUNT - 2, Math.floor(seg))
  const u = seg - i
  return (i + smoothstep(0.22, 0.78, u)) / (STATION_COUNT - 1)
}

// ---------- the camera's route ----------
const v = (x: number, y: number, z: number) => new Vector3(x, y, z)
const at = (p: { x: number; z: number }, y: number) => v(p.x, y, p.z)

function buildRoute() {
  const floor = parlorFloor()
  const table = parlorToWorld(2.8, 2.6)
  const ground = heightAt(table.x, table.z)
  // one camera spot and one look-at spot per point; the extra point follows the boat across the water
  const cam = [
    v(-1.5, 6.2, 18.5), // 1 feed: corn, Napier grass and the pasture at sunrise
    at(parlorToWorld(0.2, 4.6), floor + 1.25), // 2 milking parlor, cows in their stalls
    at(parlorToWorld(5.4, 3.2), floor + 2.0), // 3 the steel milk tank
    at(parlorToWorld(2.2, 4.5), ground + 1.7), // 4 bottling table
    v(-6, 7, -19), // (crossing the water with the boat)
    v(-28.2, DECK_Y + 1.45, -55.2), // 5 breakfast table in Siargao, looking back across the water
  ]
  const look = [
    v(-6.5, 0.9, 2.5),
    at(parlorToWorld(-0.3, 0), floor + 0.85),
    at(parlorToWorld(2.55, 0.4), floor + 0.75),
    at(parlorToWorld(2.6, 2.6), ground + 0.95),
    v(-18, SEA_LEVEL, -37),
    v(-30.6, DECK_Y + 0.5, -49),
  ]
  return {
    camCurve: new CatmullRomCurve3(cam, false, 'centripetal'),
    lookCurve: new CatmullRomCurve3(look, false, 'centripetal'),
    // where each of the 5 stations sits along the 6-point curve
    stationT: [0, 0.2, 0.4, 0.6, 1],
    tank: at(parlorToWorld(2.55, 1.05), floor + 0.8),
    parlorInside: at(parlorToWorld(0, 0.2), floor + 1.9),
    table: at(table, ground),
  }
}

/** Journey progress (0–1, stations at 0, .25, .5, .75, 1) → position along the camera curve. */
function curveT(p: number, stationT: number[]) {
  const seg = clamp(p) * (STATION_COUNT - 1)
  const i = Math.min(STATION_COUNT - 2, Math.floor(seg))
  return stationT[i] + (stationT[i + 1] - stationT[i]) * (seg - i)
}

// ---------- time of day: sunrise at station 1, midday at station 5 ----------
const SUNRISE = {
  horizon: new Color('#f7c3a1'),
  glow: new Color('#fde0c4'),
  top: new Color('#9cc3e2'),
  sunDir: v(-0.75, 0.22, -0.62).normalize(),
  light: new Color('#ffb98c'),
  intensity: 1.9,
  sky: new Color('#ffd8c2'),
}
const MIDDAY = {
  horizon: new Color('#cfe5f1'),
  glow: new Color('#e4f1f7'),
  top: new Color('#5aa6dc'),
  sunDir: v(0.25, 1, 0.3).normalize(),
  light: new Color('#fff4e4'),
  intensity: 3.0,
  sky: new Color('#e6f2ff'),
}

function Director({
  state,
  palette,
  lite,
  route,
  boat,
  chill,
}: {
  state: JourneyState
  palette: SkyPalette
  lite: boolean
  route: ReturnType<typeof buildRoute>
  boat: { current: number }
  chill: { current: number }
}) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const scene = useThree((s) => s.scene)
  const size = useThree((s) => s.size)
  const sun = useRef<DirectionalLight>(null)
  const hemi = useRef<HemisphereLight>(null)
  const inside = useRef<PointLight>(null)
  const shown = useRef(journeyProgress(state.scroll))
  const framed = useRef('')
  const centered = useMemo(() => new URLSearchParams(window.location.search).get('frame') === 'center', [])
  const pos = useMemo(() => new Vector3(), [])
  const look = useMemo(() => new Vector3(), [])
  const dir = useMemo(() => new Vector3(), [])

  useEffect(() => {
    if (sun.current) scene.add(sun.current.target)
  }, [scene])

  useFrame((_, delta) => {
    // ease towards the scroll position so the camera glides instead of jumping
    const target = journeyProgress(state.scroll)
    shown.current += (target - shown.current) * (1 - Math.exp(-delta * 5))
    const p = shown.current
    const t = curveT(p, route.stationT)

    route.camCurve.getPoint(t, pos)
    route.lookCurve.getPoint(t, look)
    camera.position.copy(pos)
    camera.lookAt(look)
    // Frame the subject beside the text card: to the right on wide screens, above it on tall ones
    const tall = size.width / size.height < 0.9
    const fov = tall ? 60 : 45
    const key = `${size.width}x${size.height}`
    if (camera.fov !== fov || framed.current !== key) {
      framed.current = key
      camera.fov = fov
      // "?frame=center" keeps subjects centred (used when rendering the still pictures)
      if (centered) camera.clearViewOffset()
      else if (tall) camera.setViewOffset(size.width, size.height, 0, size.height * 0.2, size.width, size.height)
      else camera.setViewOffset(size.width, size.height, -size.width * 0.14, 0, size.width, size.height)
      camera.updateProjectionMatrix()
    }

    // sky, fog and light move from sunrise to midday
    palette.horizon.lerpColors(SUNRISE.horizon, MIDDAY.horizon, p)
    palette.glow.lerpColors(SUNRISE.glow, MIDDAY.glow, p)
    palette.top.lerpColors(SUNRISE.top, MIDDAY.top, p)
    dir.copy(SUNRISE.sunDir).lerp(MIDDAY.sunDir, p).normalize()
    palette.sun.copy(dir).multiplyScalar(200)
    if (scene.fog) (scene.fog as Fog).color.copy(palette.horizon)

    if (sun.current) {
      sun.current.color.lerpColors(SUNRISE.light, MIDDAY.light, p)
      sun.current.intensity = SUNRISE.intensity + (MIDDAY.intensity - SUNRISE.intensity) * p
      // keep the shadow area centred on what the camera is looking at
      sun.current.target.position.copy(look)
      sun.current.position.copy(look).addScaledVector(dir, 30)
    }
    if (hemi.current) {
      hemi.current.color.lerpColors(SUNRISE.sky, MIDDAY.sky, p)
      hemi.current.intensity = 1.0 + 0.25 * p
    }

    // station lights: a warm bulb in the parlor, a cool glow on the tank
    const near = (station: number, width: number) => 1 - smoothstep(0, width, Math.abs(p - station / 4))
    if (inside.current) inside.current.intensity = near(1, 0.18) * 5
    chill.current = near(2, 0.14)
    boat.current = boatProgress(p)
  })

  return (
    <>
      <hemisphereLight ref={hemi} args={['#ffd8c2', '#4f7a3a', 1.0]} />
      <directionalLight
        ref={sun}
        castShadow={!lite}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      <pointLight ref={inside} position={route.parlorInside} color="#ffe2b8" distance={6} decay={1.4} intensity={0} />
    </>
  )
}

type Props = {
  state: JourneyState
  /** false when the journey is scrolled out of view: rendering pauses */
  active: boolean
  onReady?: () => void
}

/** The "Farm to You" scroll journey: the same farm, seen from five stations, sunrise to midday. */
export default function JourneyScene({ state, active, onReady }: Props) {
  const lite = useMemo(() => isTouchDevice() || window.innerWidth < 768, [])
  const maxDpr = lite ? 1.25 : 1.75
  const [dpr, setDpr] = useState(Math.min(window.devicePixelRatio, maxDpr))
  const route = useMemo(buildRoute, [])
  const palette = useMemo<SkyPalette>(
    () => ({ horizon: SUNRISE.horizon.clone(), glow: SUNRISE.glow.clone(), top: SUNRISE.top.clone(), sun: new Vector3() }),
    [],
  )
  const fog = useMemo(() => new Fog(palette.horizon.clone(), 70, 280), [palette])
  const herd = useMemo(journeyHerd, [])
  const boat = useRef(0)
  const chill = useRef(0)

  return (
    <Canvas
      shadows={!lite}
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 45, near: 0.1, far: 600 }}
      gl={{ antialias: !lite, powerPreference: 'high-performance' }}
      style={{ touchAction: 'pan-y' }}
      aria-hidden="true"
      scene={{ fog }}
    >
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => setDpr((d) => Math.max(0.75, d - 0.25))}
        onIncline={() => setDpr((d) => Math.min(maxDpr, d + 0.25))}
        onFallback={() => setDpr(1)}
      />
      <DisposeOnUnmount />
      <WindClock />
      <FirstFrame onReady={onReady} />
      <Director state={state} palette={palette} lite={lite} route={route} boat={boat} chill={chill} />
      <Sky palette={palette} clouds={lite ? 3 : 6} />
      <Farm herd={herd} lite={lite} />
      <ChillGlow position={[route.tank.x, route.tank.y, route.tank.z]} strength={chill} />
      <BottlingTable position={[route.table.x, route.table.y, route.table.z]} rotation={-0.5} />
      <Bangka progress={boat} />
      <SiargaoShore />
    </Canvas>
  )
}

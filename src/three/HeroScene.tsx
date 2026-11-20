import { PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useMemo, useState } from 'react'
import { Fog } from 'three'
import { isTouchDevice } from '../lib/webgl'
import type { HotspotId } from '../content/site'
import CameraRig from './hero/CameraRig'
import Farm, { FirstFrame, WindClock } from './hero/Farm'
import Sky, { goldenHour } from './hero/Sky'
import { herd } from './hero/world'
import { DisposeOnUnmount } from './bake'

type Quality = 'high' | 'low'

type Props = {
  /** false when the hero is scrolled out of view: rendering pauses to save battery */
  active: boolean
  soundOn: boolean
  onPick?: (id: HotspotId) => void
  onHover?: (id: HotspotId | null) => void
  /** called once the first frame has been drawn */
  onReady?: () => void
}

/** Warm, low golden-hour sun with soft shadows over the farm. */
function Lights({ quality, touch }: { quality: Quality; touch: boolean }) {
  // phones get a lighter shadow map; shadows switch off entirely if the device struggles
  const shadowSize = touch ? 1024 : 2048
  return (
    <>
      <hemisphereLight args={['#ffe6c4', '#4f7a3a', 1.15]} />
      <directionalLight
        position={[22, 16, 6]}
        intensity={2.6}
        color="#ffd29c"
        castShadow={quality === 'high'}
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-camera-near={1}
        shadow-camera-far={70}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-radius={4}
      />
    </>
  )
}

/** The full 3D hero: Hillsbrook Farm on Bucas Grande Island at golden hour. */
export default function HeroScene({ active, soundOn, onReady, onPick, onHover }: Props) {
  const touch = useMemo(isTouchDevice, [])
  const maxDpr = touch ? 1.5 : 2
  const [quality, setQuality] = useState<Quality>('high')
  const [dpr, setDpr] = useState(Math.min(window.devicePixelRatio, maxDpr))
  const palette = useMemo(goldenHour, [])
  const fog = useMemo(() => new Fog(palette.horizon, 70, 280), [palette])

  return (
    <Canvas
      shadows
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 38, near: 0.5, far: 600, position: [0, 8, 20] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ touchAction: 'pan-y' }}
      aria-hidden="true"
      scene={{ fog }}
    >
      {/* Drop quality (sharpness and shadows) if the device struggles; raise it again if it copes */}
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => {
          setQuality('low')
          setDpr((d) => Math.max(1, d - 0.5))
        }}
        onIncline={() => {
          setQuality('high')
          setDpr((d) => Math.min(maxDpr, d + 0.25))
        }}
        onFallback={() => {
          setQuality('low')
          setDpr(1)
        }}
      />
      <DisposeOnUnmount />
      <WindClock />
      <FirstFrame onReady={onReady} />
      <CameraRig moving={active} />
      <Lights quality={quality} touch={touch} />
      <Sky palette={palette} />
      <Farm herd={herd} soundOn={soundOn} onPick={onPick} onHover={onHover} />
    </Canvas>
  )
}

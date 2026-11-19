import { PerformanceMonitor } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useCallback, useMemo, useState } from 'react'
import { Fog } from 'three'
import { moo } from '../lib/moo'
import { isTouchDevice } from '../lib/webgl'
import { CowShed, MilkingParlor } from './hero/Buildings'
import CameraRig from './hero/CameraRig'
import Cow from './hero/Cow'
import Fence from './hero/Fence'
import DirtPath from './hero/DirtPath'
import { CornField, NapierPlot, Palm, Shrubs } from './hero/Plants'
import Sea from './hero/Sea'
import Sky, { SKY_HORIZON } from './hero/Sky'
import Terrain from './hero/Terrain'
import { windUniform } from './hero/wind'
import { heightAt, herd } from './hero/world'

type Quality = 'high' | 'low'

type Props = {
  /** false when the hero is scrolled out of view: rendering pauses to save battery */
  active: boolean
  soundOn: boolean
  /** called once the first frame has been drawn */
  onReady?: () => void
}

/** Keeps the shared wind clock ticking for swaying plants and waves. */
function WindClock() {
  useFrame(({ clock }) => {
    windUniform.value = clock.elapsedTime
  })
  return null
}

function FirstFrame({ onReady }: { onReady?: () => void }) {
  const [done, setDone] = useState(false)
  useFrame(() => {
    if (!done) {
      setDone(true)
      onReady?.()
    }
  })
  return null
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

function Farm({ soundOn }: { soundOn: boolean }) {
  const greet = useCallback(
    (calf: boolean) => {
      if (soundOn) moo(calf)
    },
    [soundOn],
  )

  return (
    <group>
      <Terrain />
      <Sea />
      <Fence />
      <DirtPath />
      <CowShed x={5.2} z={-3.2} rotation={-0.18} />
      <MilkingParlor x={9.8} z={-0.4} rotation={-0.5} />
      <NapierPlot />
      <CornField />
      <Shrubs />

      {/* coconut palms around the yard and along the shore */}
      <Palm x={1.2} z={-4.2} height={4.8} lean={0.7} rotation={0.4} />
      <Palm x={8.4} z={-6.8} height={5.6} lean={0.9} rotation={2.2} />
      <Palm x={13.6} z={2.8} height={4.6} lean={0.6} rotation={3.6} />
      <Palm x={-5.2} z={-8.6} height={5.2} lean={1} rotation={1.2} />
      <Palm x={-15.5} z={-8.2} height={5.8} lean={0.8} rotation={0.2} />
      <Palm x={16.5} z={-7.5} height={5.2} lean={1.1} rotation={2.8} />
      <Palm x={-6.2} z={8.6} height={4.4} lean={0.5} rotation={4.2} />

      {herd.map((c) => (
        <Cow
          key={c.seed}
          position={[c.x, heightAt(c.x, c.z), c.z]}
          yaw={c.yaw}
          calf={c.calf}
          seed={c.seed}
          onGreet={greet}
        />
      ))}
    </group>
  )
}

/** The full 3D hero: Hillsbrook Farm on Bucas Grande Island at golden hour. */
export default function HeroScene({ active, soundOn, onReady }: Props) {
  const touch = useMemo(isTouchDevice, [])
  const maxDpr = touch ? 1.5 : 2
  const [quality, setQuality] = useState<Quality>('high')
  const [dpr, setDpr] = useState(Math.min(window.devicePixelRatio, maxDpr))
  const fog = useMemo(() => new Fog(SKY_HORIZON, 70, 280), [])

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
      <WindClock />
      <FirstFrame onReady={onReady} />
      <CameraRig moving={active} />
      <Lights quality={quality} touch={touch} />
      <Sky />
      <Farm soundOn={soundOn} />
    </Canvas>
  )
}

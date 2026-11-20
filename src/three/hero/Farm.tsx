import { useFrame } from '@react-three/fiber'
import { useCallback, useRef } from 'react'
import { moo } from '../../lib/moo'
import { CowShed, MilkingParlor } from './Buildings'
import Cow from './Cow'
import DirtPath from './DirtPath'
import Fence, { CalfShelter } from './Fence'
import { FarmGate, Farmhouse } from './FarmExtras'
import { CornField, NapierPlot, Palm, Shrubs } from './Plants'
import Sea from './Sea'
import Terrain from './Terrain'
import { windUniform } from './wind'
import { type CowSpot, FIELD_LANE_Z, heightAt, PARLOR, SHED } from './world'

/** Keeps the shared wind clock ticking for swaying plants and waves. */
export function WindClock() {
  useFrame(({ clock }) => {
    windUniform.value = clock.elapsedTime
  })
  return null
}

/** Calls `onReady` once, after the first frame has been drawn. */
export function FirstFrame({ onReady }: { onReady?: () => void }) {
  const done = useRef(false)
  useFrame(() => {
    if (!done.current) {
      done.current = true
      onReady?.()
    }
  })
  return null
}

type Props = {
  herd: CowSpot[]
  soundOn?: boolean
  /** phones: fewer plants and no shrubs */
  lite?: boolean
}

/** The whole farm on Bucas Grande Island. Shared by the hero and the "Farm to You" journey. */
export default function Farm({ herd, soundOn = false, lite = false }: Props) {
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
      <CalfShelter />
      <FarmGate />
      <Farmhouse x={0.4} z={-7.4} rotation={0.12} />
      <DirtPath />
      <CowShed x={SHED.x} z={SHED.z} rotation={SHED.rot} />
      <MilkingParlor x={PARLOR.x} z={PARLOR.z} rotation={PARLOR.rot} />
      <NapierPlot lite={lite} />
      <CornField lite={lite} />
      {!lite && <Shrubs />}

      {/* coconut palms around the yard and along the shore */}
      <Palm x={1.2} z={-4.2} height={4.8} lean={0.7} rotation={0.4} />
      <Palm x={8.4} z={-6.8} height={5.6} lean={0.9} rotation={2.2} />
      <Palm x={15.6} z={4.6} height={4.6} lean={0.6} rotation={3.6} />
      <Palm x={-5.2} z={-8.6} height={5.2} lean={1} rotation={1.2} />
      <Palm x={-15.5} z={-9.6} height={5.8} lean={0.8} rotation={0.2} />
      <Palm x={16.5} z={-7.5} height={5.2} lean={1.1} rotation={2.8} />
      <Palm x={-6.2} z={8.6} height={4.4} lean={0.5} rotation={4.2} />

      {/* a row of palms along the farm lane between the Napier field and the corn field */}
      {!lite &&
        [-26, -20.5, -15, -9.8].map((x, i) => (
          <Palm key={x} x={x} z={FIELD_LANE_Z + (i % 2 ? 0.5 : -0.4)} height={4.6 + (i % 3) * 0.6} lean={0.5 + (i % 2) * 0.3} rotation={i * 1.7} />
        ))}

      {herd.map((c) => (
        <Cow
          key={c.seed}
          position={[c.x, c.y ?? heightAt(c.x, c.z), c.z]}
          yaw={c.yaw}
          calf={c.calf}
          seed={c.seed}
          onGreet={greet}
        />
      ))}
    </group>
  )
}

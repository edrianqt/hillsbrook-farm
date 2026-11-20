import { useFrame, useThree } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { BoxGeometry, Group, MeshStandardMaterial } from 'three'
import { useBakeStatic } from '../bake'
import { rng } from './world'

// Shared shapes and paints for every cow (keeps memory and draw setup small)
const box = new BoxGeometry(1, 1, 1)
const paint = {
  // all four share one finish so each body part can be merged into a single mesh (see bake.ts)
  white: new MeshStandardMaterial({ color: '#f5f2ea', roughness: 0.85, flatShading: true }),
  black: new MeshStandardMaterial({ color: '#1f1c1b', roughness: 0.85, flatShading: true }),
  pink: new MeshStandardMaterial({ color: '#e7a59b', roughness: 0.85, flatShading: true }),
  hoof: new MeshStandardMaterial({ color: '#3b302b', roughness: 0.85, flatShading: true }),
}

type Part = { p: [number, number, number]; s: [number, number, number]; m: keyof typeof paint }

const Block = ({ p, s, m }: Part) => (
  <mesh geometry={box} material={paint[m]} position={p} scale={s} castShadow />
)

type Props = {
  position: [number, number, number]
  yaw: number
  calf?: boolean
  seed: number
  /** Called when someone hovers or taps this cow */
  onGreet: (calf: boolean) => void
}

/**
 * A blocky Holstein-type cow (or calf), facing +x before rotation.
 * Idle: grazes with a gentle head bob and swishes its tail.
 * Hover or tap: lifts its head and looks up for a couple of seconds.
 */
export default function Cow({ position, yaw, calf = false, seed, onGreet }: Props) {
  const head = useRef<Group>(null)
  const tail = useRef<Group>(null)
  const ears = useRef<Group>(null)
  const lookUntil = useRef(0)
  const look = useRef(0)
  const lastGreet = useRef(0)
  const body = useRef<Group>(null)
  const headParts = useRef<Group>(null)
  const clock = useThree((state) => state.clock)
  // merge the still parts of each moving piece (body, head, tail) into one mesh each
  useBakeStatic(body)
  useBakeStatic(headParts)
  useBakeStatic(tail)

  // Each cow gets its own black-and-white pattern and rhythm
  const { patches, base, phase, headBlaze, grazeAngle } = useMemo(() => {
    const r = rng(seed * 97 + 13)
    const count = 2 + Math.floor(r() * 2)
    const list: Part[] = []
    for (let i = 0; i < count; i++) {
      const len = 0.3 + r() * 0.35
      const x = -0.5 + r() * 1.0
      const tall = 0.35 + r() * 0.3
      const y = 0.95 + (r() - 0.5) * 0.2
      list.push({ p: [x, y, 0], s: [len, tall, 0.67], m: 'black' })
    }
    // a patch across the back
    list.push({ p: [-0.15 + r() * 0.3, 1.31, 0], s: [0.5 + r() * 0.3, 0.04, 0.4 + r() * 0.2], m: 'black' })
    // like our real crossbred Holsteins, some cows are mostly black with white markings
    const dark = seed % 5 === 2 || seed % 5 === 4
    const swap = (m: keyof typeof paint): keyof typeof paint => (!dark ? m : m === 'white' ? 'black' : m === 'black' ? 'white' : m)
    return {
      patches: list.map((p) => ({ ...p, m: swap(p.m) })),
      base: swap('white'),
      phase: r() * Math.PI * 2,
      headBlaze: r() > 0.4,
      grazeAngle: -0.75 - r() * 0.25,
    }
  }, [seed])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const target = t < lookUntil.current ? 1 : 0
    look.current += (target - look.current) * 0.08
    if (head.current) {
      const graze = grazeAngle + Math.sin(t * 1.3 + phase) * 0.08
      head.current.rotation.z = graze + (0.2 - graze) * look.current
      head.current.rotation.y = Math.sin(t * 0.4 + phase) * 0.12 * (1 - look.current) + 0.25 * look.current
    }
    if (tail.current) tail.current.rotation.x = Math.sin(t * 2.2 + phase) * 0.35 + Math.sin(t * 5.1 + phase) * 0.06
    if (ears.current) ears.current.rotation.x = Math.sin(t * 3 + phase) > 0.97 ? 0.4 : 0
  })

  const greet = (e: ThreeEvent<PointerEvent | MouseEvent>) => {
    e.stopPropagation()
    const now = performance.now()
    // look up for 2.5 seconds, and moo at most every 1.5 seconds
    lookUntil.current = clock.elapsedTime + 2.5
    if (now - lastGreet.current > 1500) {
      lastGreet.current = now
      onGreet(calf)
    }
  }

  return (
    <group position={position} rotation={[0, yaw, 0]} scale={calf ? 0.58 : 1}>
      <group
        onPointerOver={(e) => {
          greet(e)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => (document.body.style.cursor = '')}
        onClick={greet}
      >
        <group ref={body}>
        {/* body */}
        <Block p={[0, 0.95, 0]} s={[1.5, 0.72, 0.64]} m={base} />
        {patches.map((part, i) => (
          <Block key={i} {...part} />
        ))}
        {/* legs with dark hooves */}
        {[
          [0.55, 0.22],
          [0.55, -0.22],
          [-0.55, 0.22],
          [-0.55, -0.22],
        ].map(([lx, lz], i) => (
          <group key={i} position={[lx, 0, lz]}>
            <Block p={[0, 0.36, 0]} s={[0.16, 0.6, 0.16]} m={i % 3 === 0 ? 'black' : base} />
            <Block p={[0, 0.04, 0]} s={[0.17, 0.08, 0.17]} m="hoof" />
          </group>
        ))}
        {/* udder (grown cows only) */}
        {!calf && <Block p={[-0.38, 0.55, 0]} s={[0.3, 0.16, 0.3]} m="pink" />}
        </group>
        {/* tail */}
        <group ref={tail} position={[-0.76, 1.22, 0]}>
          <Block p={[0, -0.33, 0]} s={[0.05, 0.66, 0.05]} m={base} />
          <Block p={[0, -0.7, 0]} s={[0.09, 0.16, 0.09]} m="black" />
        </group>
        {/* head (pivots at the neck) */}
        <group ref={head} position={[0.7, 1.12, 0]}>
          <group ref={headParts} scale={calf ? 1.25 : 1}>
            <Block p={[0.24, 0, 0]} s={[0.52, 0.38, 0.38]} m="black" />
            {headBlaze && <Block p={[0.3, 0.02, 0]} s={[0.4, 0.3, 0.12]} m="white" />}
            <Block p={[0.55, -0.06, 0]} s={[0.16, 0.24, 0.32]} m="pink" />
            <group ref={ears} position={[0.12, 0.12, 0]} userData={{ noBake: true }}>
              <Block p={[0, 0, 0.26]} s={[0.08, 0.1, 0.2]} m="black" />
              <Block p={[0, 0, -0.26]} s={[0.08, 0.1, 0.2]} m="black" />
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

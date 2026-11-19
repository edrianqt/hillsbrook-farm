import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { BackSide, BufferAttribute, Color, Group, IcosahedronGeometry, SphereGeometry } from 'three'
import { rng, smoothstep } from './world'

export const SKY_HORIZON = '#f6d3a8'

const horizon = new Color(SKY_HORIZON)
const glow = new Color('#fbe3c0')
const top = new Color('#8ec3e3')

/** Golden-hour sky: warm peach at the horizon, fading to clear blue overhead. */
function SkyDome() {
  const geometry = useMemo(() => {
    const geo = new SphereGeometry(260, 24, 14)
    const pos = geo.attributes.position
    const colors = new Float32Array(pos.count * 3)
    const c = new Color()
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i) / 260
      c.copy(horizon).lerp(glow, smoothstep(0, 0.06, y)).lerp(top, smoothstep(0.04, 0.32, y))
      colors.set([c.r, c.g, c.b], i * 3)
    }
    geo.setAttribute('color', new BufferAttribute(colors, 3))
    return geo
  }, [])
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial vertexColors side={BackSide} fog={false} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

/** A soft low sun over the sea. */
function Sun() {
  return (
    <group position={[95, 22, -200]}>
      <mesh>
        <circleGeometry args={[9, 24]} />
        <meshBasicMaterial color="#fff4d6" fog={false} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -1]}>
        <circleGeometry args={[22, 24]} />
        <meshBasicMaterial color="#ffe2b0" transparent opacity={0.35} fog={false} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Puffy low-poly clouds drifting slowly across the sky. */
function Clouds() {
  const group = useRef<Group>(null)
  const puff = useMemo(() => new IcosahedronGeometry(1, 1), [])
  const clouds = useMemo(() => {
    const rand = rng(7)
    return Array.from({ length: 6 }, (_, i) => ({
      x: -70 + i * 26 + rand() * 10,
      y: 15 + rand() * 7,
      z: -45 - rand() * 35,
      speed: 0.6 + rand() * 0.5,
      puffs: Array.from({ length: 4 + Math.floor(rand() * 3) }, (_, j) => ({
        x: j * 2.2 - 4 + rand(),
        y: rand() * 1.2,
        z: rand() * 1.5,
        s: 1.6 + rand() * 1.6,
      })),
    }))
  }, [])

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.children.forEach((cloud, i) => {
      cloud.position.x += clouds[i].speed * delta
      if (cloud.position.x > 90) cloud.position.x = -90
    })
  })

  return (
    <group ref={group}>
      {clouds.map((c, i) => (
        <group key={i} position={[c.x, c.y, c.z]}>
          {c.puffs.map((p, j) => (
            <mesh key={j} geometry={puff} position={[p.x, p.y, p.z]} scale={[p.s * 1.3, p.s * 0.8, p.s]}>
              <meshStandardMaterial color="#fffaf2" emissive="#f7d9b8" emissiveIntensity={0.35} flatShading roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export default function Sky() {
  return (
    <group>
      <SkyDome />
      <Sun />
      <Clouds />
    </group>
  )
}

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { BackSide, Color, Group, IcosahedronGeometry, ShaderMaterial, Vector3 } from 'three'
import { rng } from './world'

/** Colours of the sky at one moment. The objects are changed in place for time-of-day animation. */
export type SkyPalette = { horizon: Color; glow: Color; top: Color; sun: Vector3 }

export const SKY_HORIZON = '#f6d3a8'

/** Golden hour, used by the hero. */
export const goldenHour = (): SkyPalette => ({
  horizon: new Color(SKY_HORIZON),
  glow: new Color('#fbe3c0'),
  top: new Color('#8ec3e3'),
  sun: new Vector3(95, 22, -200),
})

/** Gradient sky dome: horizon colour, a warm glow band, then the sky colour overhead. */
function SkyDome({ palette }: { palette: SkyPalette }) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        uniforms: {
          uHorizon: { value: palette.horizon },
          uGlow: { value: palette.glow },
          uTop: { value: palette.top },
        },
        vertexShader: /* glsl */ `
          varying float vHeight;
          void main() {
            vHeight = normalize(position).y;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uHorizon; uniform vec3 uGlow; uniform vec3 uTop;
          varying float vHeight;
          void main() {
            vec3 c = mix(uHorizon, uGlow, smoothstep(0.0, 0.06, vHeight));
            c = mix(c, uTop, smoothstep(0.04, 0.32, vHeight));
            gl_FragColor = vec4(c, 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    [palette],
  )
  return (
    <mesh material={material}>
      <sphereGeometry args={[260, 24, 14]} />
    </mesh>
  )
}

/** A soft sun that follows `palette.sun`. */
function Sun({ palette }: { palette: SkyPalette }) {
  const ref = useRef<Group>(null)
  useFrame(({ camera }) => {
    if (!ref.current) return
    ref.current.position.copy(palette.sun)
    ref.current.lookAt(camera.position)
  })
  return (
    <group ref={ref}>
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
function Clouds({ count }: { count: number }) {
  const group = useRef<Group>(null)
  const puff = useMemo(() => new IcosahedronGeometry(1, 1), [])
  const clouds = useMemo(() => {
    const rand = rng(7)
    return Array.from({ length: count }, (_, i) => ({
      x: -70 + i * (156 / count) + rand() * 10,
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
  }, [count])

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

export default function Sky({ palette, clouds = 6 }: { palette: SkyPalette; clouds?: number }) {
  return (
    <group>
      <SkyDome palette={palette} />
      <Sun palette={palette} />
      <Clouds count={clouds} />
    </group>
  )
}

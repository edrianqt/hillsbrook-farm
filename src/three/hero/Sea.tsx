import { useMemo } from 'react'
import { BufferAttribute, Color, CylinderGeometry, IcosahedronGeometry, MeshStandardMaterial, PlaneGeometry } from 'three'
import { windUniform } from './wind'
import { rng, SEA_LEVEL, smoothstep } from './world'

const shallow = new Color('#3cc6c4')
const lagoon = new Color('#139fb8')
const deep = new Color('#0b6f93')

/** Turquoise sea with gentle waves, getting deeper blue towards the horizon. */
function Water() {
  const { geometry, material } = useMemo(() => {
    const geo = new PlaneGeometry(320, 200, 48, 30)
    geo.rotateX(-Math.PI / 2)
    geo.translate(0, SEA_LEVEL, -80)
    const pos = geo.attributes.position
    const colors = new Float32Array(pos.count * 3)
    const c = new Color()
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i)
      c.copy(shallow).lerp(lagoon, smoothstep(-12, -24, z)).lerp(deep, smoothstep(-30, -90, z))
      colors.set([c.r, c.g, c.b], i * 3)
    }
    geo.setAttribute('color', new BufferAttribute(colors, 3))

    const mat = new MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.25, metalness: 0.1 })
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = windUniform
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uTime;')
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
          transformed.y += sin(position.x * 0.18 + uTime * 0.9) * 0.07 + cos(position.z * 0.23 + uTime * 0.7) * 0.07;`,
        )
    }
    mat.customProgramCacheKey = () => 'sea'
    return { geometry: geo, material: mat }
  }, [])

  return <mesh geometry={geometry} material={material} receiveShadow />
}

/**
 * Sohoton-style limestone islets: a pale rock base, undercut by the sea, with a rounded
 * cap of green forest on top.
 */
function Islets() {
  const islets = useMemo(() => {
    const rand = rng(42)
    // [x, z, size]: spread across the bay, far enough to sit near the horizon
    const spots = [
      [-58, -62, 5],
      [-34, -78, 6.5],
      [-14, -60, 4],
      [8, -86, 7],
      [24, -58, 4.5],
      [44, -72, 6],
      [68, -56, 4.2],
      [-80, -95, 8],
      [88, -98, 8.5],
      [-4, -46, 2.4],
      [34, -44, 2.8],
    ]
    return spots.map(([x, z, size]) => ({
      x,
      z,
      size,
      squash: 0.75 + rand() * 0.35,
      rot: rand() * Math.PI,
      height: 0.75 + rand() * 0.35,
    }))
  }, [])

  const { rockGeo, capGeo } = useMemo(() => {
    // rock: narrower at the waterline (undercut), wider higher up, like a mushroom
    const rock = new CylinderGeometry(0.92, 0.74, 0.55, 10, 1)
    rock.translate(0, 0.275, 0)
    const cap = new IcosahedronGeometry(1, 1)
    cap.scale(1.0, 0.85, 1.0)
    return { rockGeo: rock, capGeo: cap }
  }, [])

  return (
    <group>
      {islets.map((s, i) => (
        <group key={i} position={[s.x, SEA_LEVEL - 0.2, s.z]} rotation={[0, s.rot, 0]} scale={[s.size, s.size * s.height, s.size * s.squash]}>
          <mesh geometry={rockGeo}>
            <meshStandardMaterial color="#c9c3b3" flatShading roughness={0.9} />
          </mesh>
          <mesh geometry={capGeo} position={[0, 0.62, 0]}>
            <meshStandardMaterial color="#3d7a37" flatShading roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Low blue hills on the far horizon (Siargao and mainland Mindanao), softened by haze. */
function DistantLand() {
  const geometry = useMemo(() => new IcosahedronGeometry(1, 1), [])
  // [x, z, width, height]: long, low, hazy ridges on the horizon
  const hills = [
    [-90, -150, 50, 6],
    [-40, -165, 38, 4.5],
    [30, -160, 60, 7],
    [100, -150, 45, 5],
  ]
  return (
    <group>
      {hills.map(([x, z, w, h], i) => (
        <mesh key={i} geometry={geometry} position={[x, SEA_LEVEL - 0.5, z]} scale={[w, h, 10]}>
          <meshStandardMaterial color="#8fb0a6" flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

export default function Sea() {
  return (
    <group>
      <Water />
      <Islets />
      <DistantLand />
    </group>
  )
}

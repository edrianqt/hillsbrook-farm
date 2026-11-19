import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { Bottle, useLabelTexture } from './journey/Bottles'
import { DisposeOnUnmount } from './bake'

function Spinner({ spin }: { spin: boolean }) {
  const group = useRef<Group>(null)
  const label = useLabelTexture()
  useFrame((_, delta) => {
    if (group.current && spin) group.current.rotation.y += delta * 0.6
  })
  return (
    <group ref={group} scale={6.2} position={[0, -0.92, 0]}>
      <Bottle kind="pet" label={label} position={[0, 0, 0]} />
      {/* soft round shadow under the bottle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[0.07, 24]} />
        <meshBasicMaterial color="#0c5247" transparent opacity={0.12} />
      </mesh>
    </group>
  )
}

/** The featured product: a slowly turning 3D bottle of Island Pure milk. */
export default function BottleShowcase({ active, spin }: { active: boolean; spin: boolean }) {
  return (
    <Canvas
      frameloop={active && spin ? 'always' : 'demand'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.35, 3.6], fov: 32 }}
      gl={{ alpha: true, antialias: true }}
      aria-hidden="true"
    >
      <DisposeOnUnmount />
      <hemisphereLight args={['#fff6e6', '#cfe5d9', 1.3]} />
      <directionalLight position={[2.5, 3, 4]} intensity={2.4} color="#fff1dc" />
      <directionalLight position={[-3, 1, -2]} intensity={0.8} color="#bfe3f2" />
      <Spinner spin={spin} />
    </Canvas>
  )
}

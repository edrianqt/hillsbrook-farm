import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'

/** A slowly turning green cube: a temporary test that 3D works. Replaced by the farm scene in Phase 3. */
function Cube() {
  const ref = useRef<Mesh>(null)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useFrame((_, delta) => {
    if (!ref.current || reduceMotion) return
    ref.current.rotation.x += delta * 0.4
    ref.current.rotation.y += delta * 0.6
  })

  return (
    <mesh ref={ref} rotation={[0.4, 0.6, 0]}>
      <boxGeometry args={[1.6, 1.6, 1.6]} />
      <meshStandardMaterial color="#0c5247" roughness={0.5} />
    </mesh>
  )
}

export default function SpinningCube() {
  return (
    <Canvas
      dpr={[1, 1.5]} // keeps phones fast: never render more than 1.5x pixels
      camera={{ position: [0, 0, 6], fov: 45 }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <Cube />
    </Canvas>
  )
}

import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { ExtrudeGeometry, Group, Shape, TubeGeometry, CatmullRomCurve3, Vector3 } from 'three'
import type { PillarIcon as Kind } from '../content/site'
import Cow from './hero/Cow'
import { Bottle, useLabelTexture } from './journey/Bottles'
import { DisposeOnUnmount } from './bake'

function MilkBottle() {
  const label = useLabelTexture()
  return (
    <group scale={7.5} position={[0, -0.95, 0]}>
      <Bottle kind="pet" label={label} position={[0, 0, 0]} />
    </group>
  )
}

function LittleCow() {
  return (
    <group scale={0.95} position={[0.1, -0.75, 0]} rotation={[0, -0.5, 0]}>
      <Cow position={[0, 0, 0]} yaw={0} seed={3} onGreet={() => {}} />
    </group>
  )
}

/** A small farmhouse with a red roof and a tree: learning and community. */
function House() {
  return (
    <group position={[0, -0.7, 0]} rotation={[0, 0.6, 0]}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.1, 0.9, 0.9]} />
        <meshStandardMaterial color="#f1ede2" flatShading />
      </mesh>
      <mesh position={[0, 1.15, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.92, 0.55, 4]} />
        <meshStandardMaterial color="#b0492b" flatShading />
      </mesh>
      <mesh position={[0, 0.28, 0.452]}>
        <boxGeometry args={[0.26, 0.48, 0.02]} />
        <meshStandardMaterial color="#0c5247" />
      </mesh>
      <mesh position={[0.34, 0.55, 0.452]}>
        <boxGeometry args={[0.2, 0.2, 0.02]} />
        <meshStandardMaterial color="#8fd0e6" />
      </mesh>
      <mesh position={[-0.95, 0.25, 0.2]}>
        <cylinderGeometry args={[0.05, 0.06, 0.5, 6]} />
        <meshStandardMaterial color="#8b6a48" />
      </mesh>
      <mesh position={[-0.95, 0.7, 0.2]}>
        <icosahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial color="#4f8a3a" flatShading />
      </mesh>
    </group>
  )
}

/** A leaf above a sea wave: island stewardship. */
function LeafAndWave() {
  const { leaf, wave } = useMemo(() => {
    const s = new Shape()
    s.moveTo(0, -0.8)
    s.quadraticCurveTo(0.65, -0.1, 0, 0.85)
    s.quadraticCurveTo(-0.65, -0.1, 0, -0.8)
    const leafGeo = new ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 1, curveSegments: 10 })
    leafGeo.center()
    const pts = Array.from({ length: 9 }, (_, i) => new Vector3(-1 + i * 0.25, Math.sin(i * 0.9) * 0.12, 0))
    const waveGeo = new TubeGeometry(new CatmullRomCurve3(pts), 40, 0.09, 8, false)
    return { leaf: leafGeo, wave: waveGeo }
  }, [])
  return (
    <group>
      <mesh geometry={leaf} position={[0, 0.2, 0]} rotation={[0, 0, -0.5]}>
        <meshStandardMaterial color="#4f8a3a" flatShading />
      </mesh>
      <mesh position={[0.05, 0.2, 0.06]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.03, 1.3, 0.02]} />
        <meshStandardMaterial color="#8fbf55" />
      </mesh>
      <mesh geometry={wave} position={[0, -0.85, 0]}>
        <meshStandardMaterial color="#0887b0" />
      </mesh>
    </group>
  )
}

/** Turns gently while `spinning` is true, and settles back when it is not. */
function Turntable({ spinning, kind }: { spinning: boolean; kind: Kind }) {
  const group = useRef<Group>(null)
  useFrame((_, delta) => {
    if (!group.current) return
    if (spinning) group.current.rotation.y += delta * 1.1
    else group.current.rotation.y += (Math.round(group.current.rotation.y / (Math.PI * 2)) * Math.PI * 2 - group.current.rotation.y) * 0.1
  })
  return (
    <group ref={group}>
      {kind === 'bottle' && <MilkBottle />}
      {kind === 'cow' && <LittleCow />}
      {kind === 'house' && <House />}
      {kind === 'leaf' && <LeafAndWave />}
    </group>
  )
}

/** A small 3D icon for a pillar card. It only draws while hovered (or settling), to save battery. */
export default function PillarIcon({ kind, spinning }: { kind: Kind; spinning: boolean }) {
  return (
    <Canvas
      frameloop={spinning ? 'always' : 'demand'}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.4, 4.2], fov: 35 }}
      gl={{ alpha: true, antialias: true }}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <DisposeOnUnmount />
      <hemisphereLight args={['#fff6e6', '#4f7a3a', 1.4]} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#ffe8c8" />
      <Turntable spinning={spinning} kind={kind} />
    </Canvas>
  )
}

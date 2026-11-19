import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CanvasTexture, Group, Mesh, MeshStandardMaterial, SRGBColorSpace } from 'three'
import { useBakeStatic } from '../bake'

/** The Island Pure label, drawn on a canvas so there is no image file to load. */
function useLabelTexture() {
  const [tex, setTex] = useState<CanvasTexture | null>(null)
  useEffect(() => {
    let cancelled = false
    const draw = () => {
      const c = document.createElement('canvas')
      c.width = 256
      c.height = 96
      const g = c.getContext('2d')!
      g.fillStyle = '#fbf8f1'
      g.fillRect(0, 0, 256, 96)
      g.fillStyle = '#0c5247'
      g.fillRect(0, 0, 256, 18)
      g.fillRect(0, 78, 256, 18)
      g.fillStyle = '#0887b0'
      g.beginPath()
      g.ellipse(128, 70, 70, 5, 0, 0, Math.PI * 2)
      g.fill()
      g.fillStyle = '#0c5247'
      g.font = '700 30px "Fraunces Variable", Georgia, serif'
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.fillText('Island Pure', 128, 46)
      const t = new CanvasTexture(c)
      t.colorSpace = SRGBColorSpace
      if (!cancelled) setTex(t)
    }
    document.fonts.load('700 30px "Fraunces Variable"').then(draw, draw)
    return () => {
      cancelled = true
    }
  }, [])
  return tex
}

const milk = new MeshStandardMaterial({ color: '#fbfaf5', roughness: 0.35 })
const capGreen = new MeshStandardMaterial({ color: '#0c5247', roughness: 0.5 })
const capBlue = new MeshStandardMaterial({ color: '#0887b0', roughness: 0.5 })
const steel = new MeshStandardMaterial({ color: '#d7dde0', metalness: 0.35, roughness: 0.3 })
const clearPlastic = new MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.28, roughness: 0.1, depthWrite: false })

type BottleProps = { kind: 'pet' | 'hdpe'; position: [number, number, number]; label: CanvasTexture | null }

/** One 1-litre bottle of Island Pure milk. PET: clear bottle, green cap. HDPE: opaque white jug, blue cap. */
export function Bottle({ kind, position, label }: BottleProps) {
  const r = kind === 'pet' ? 0.042 : 0.048
  const h = kind === 'pet' ? 0.2 : 0.19
  return (
    <group position={position}>
      <mesh material={milk} position={[0, h / 2, 0]} castShadow>
        <cylinderGeometry args={[r, r, h, kind === 'pet' ? 12 : 6]} />
      </mesh>
      <mesh material={milk} position={[0, h + 0.025, 0]}>
        <cylinderGeometry args={[0.018, r, 0.05, 10]} />
      </mesh>
      <mesh material={kind === 'pet' ? capGreen : capBlue} position={[0, h + 0.06, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.022, 10]} />
      </mesh>
      {label && (
        <mesh position={[0, h * 0.5, 0]}>
          <cylinderGeometry args={[r + 0.002, r + 0.002, 0.075, kind === 'pet' ? 12 : 6, 1, true]} />
          <meshStandardMaterial map={label} roughness={0.6} />
        </mesh>
      )}
    </group>
  )
}

/** A clear bottle under the filler nozzle, with the milk level rising and a thin stream pouring in. */
function FillingBottle({ position }: { position: [number, number, number] }) {
  const level = useRef<Mesh>(null)
  const stream = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    const cycle = (clock.elapsedTime % 3.2) / 3.2 // fill, pause, repeat
    const fill = Math.min(1, cycle / 0.8)
    if (level.current) {
      level.current.scale.y = Math.max(0.02, fill)
      level.current.position.y = (0.19 * Math.max(0.02, fill)) / 2
    }
    if (stream.current) stream.current.visible = cycle < 0.8
  })
  return (
    <group position={position} userData={{ noBake: true }}>
      <mesh material={clearPlastic} position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.042, 0.042, 0.2, 12]} />
      </mesh>
      <mesh ref={level} material={milk}>
        <cylinderGeometry args={[0.038, 0.038, 0.19, 12]} />
      </mesh>
      <mesh ref={stream} material={milk} position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.22, 6]} />
      </mesh>
    </group>
  )
}

/**
 * Stainless steel bottling table: a small pasteurizer/filler, a bottle being filled,
 * rows of filled PET and HDPE bottles, and green crates ready for Saturday delivery.
 */
export function BottlingTable({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const label = useLabelTexture()
  const tableTop = 0.9
  const rows = useMemo(() => {
    const list: { kind: 'pet' | 'hdpe'; x: number; z: number }[] = []
    for (let i = 0; i < 5; i++) list.push({ kind: 'pet', x: -0.05 + i * 0.1, z: 0.12 })
    for (let i = 0; i < 4; i++) list.push({ kind: 'hdpe', x: 0.0 + i * 0.11, z: -0.1 })
    return list
  }, [])
  const ref = useRef<Group>(null)
  useBakeStatic(ref)

  return (
    <group ref={ref} position={position} rotation={[0, rotation, 0]}>
      {/* table */}
      <mesh material={steel} position={[0, tableTop - 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.04, 0.7]} />
      </mesh>
      {[
        [-0.7, -0.3],
        [0.7, -0.3],
        [-0.7, 0.3],
        [0.7, 0.3],
      ].map(([x, z], i) => (
        <mesh key={i} material={steel} position={[x, tableTop / 2, z]}>
          <boxGeometry args={[0.04, tableTop, 0.04]} />
        </mesh>
      ))}
      {/* small pasteurizer kettle and filler nozzle */}
      <group position={[-0.5, tableTop, 0]}>
        <mesh material={steel} position={[0, 0.22, -0.12]} castShadow>
          <cylinderGeometry args={[0.16, 0.14, 0.44, 14]} />
        </mesh>
        <mesh material={steel} position={[0.1, 0.42, 0.02]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 6]} />
        </mesh>
        <mesh material={steel} position={[0.2, 0.43, 0.06]}>
          <cylinderGeometry args={[0.014, 0.008, 0.04, 6]} />
        </mesh>
        <FillingBottle position={[0.2, 0, 0.06]} />
      </group>
      {/* filled bottles */}
      {rows.map((b, i) => (
        <Bottle key={i} kind={b.kind} label={label} position={[b.x, tableTop, b.z]} />
      ))}
      {/* green delivery crates beside the table */}
      {[0, 1].map((i) => (
        <group key={i} position={[0.95, 0.15 + i * 0.3, 0.55]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.45, 0.28, 0.35]} />
            <meshStandardMaterial color="#2f7d4f" roughness={0.7} />
          </mesh>
          {i === 1 &&
            [-0.12, 0, 0.12].map((x) => (
              <mesh key={x} material={capGreen} position={[x, 0.16, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.03, 8]} />
              </mesh>
            ))}
        </group>
      ))}
    </group>
  )
}

/** A gently pulsing cool-blue light on the milk tank: "cooled within minutes". `strength` is 0–1. */
export function ChillGlow({ position, strength }: { position: [number, number, number]; strength: { current: number } }) {
  const group = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (!group.current) return
    const light = group.current.children[0] as unknown as { intensity: number }
    light.intensity = strength.current * (10 + Math.sin(clock.elapsedTime * 2) * 2)
  })
  return (
    <group ref={group} position={position}>
      <pointLight color="#7cc8ff" distance={4} decay={1.5} intensity={0} />
    </group>
  )
}

export { useLabelTexture }

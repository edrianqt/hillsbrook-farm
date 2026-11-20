import { useMemo, useRef } from 'react'
import { BufferGeometry, CanvasTexture, Float32BufferAttribute, Group, MeshStandardMaterial, SRGBColorSpace } from 'three'
import { useBakeStatic } from '../bake'
import { heightAt, pathCurve } from './world'

const post = new MeshStandardMaterial({ color: '#6e5238', roughness: 0.95, flatShading: true })
const dark = new MeshStandardMaterial({ color: '#35302c', roughness: 0.8 })
const FLAG_COLORS = ['#e63946', '#f4a261', '#ffd166', '#2a9d8f', '#4361ee', '#f72585']

/** The banner at the farm gate, drawn like the real one: "Welcome to the Hillsbrook Farm". */
function useBannerMaterial() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 240
    const g = c.getContext('2d')!
    const grad = g.createLinearGradient(0, 0, 0, 240)
    grad.addColorStop(0, '#cfe8f5')
    grad.addColorStop(1, '#9fcbe3')
    g.fillStyle = grad
    g.fillRect(0, 0, 1024, 240)
    g.textAlign = 'center'
    g.fillStyle = '#c62828'
    g.font = 'italic 700 54px Georgia, serif'
    g.fillText('Welcome to the', 512, 64)
    g.font = '900 104px Georgia, serif'
    g.lineWidth = 10
    g.strokeStyle = '#f5d33b'
    g.strokeText('Hillsbrook Farm', 512, 168)
    g.fillStyle = '#1f6b2c'
    g.fillText('Hillsbrook Farm', 512, 168)
    g.fillStyle = '#26394d'
    g.font = 'italic 600 26px Georgia, serif'
    g.fillText('Where farming is pleasing! · Diin ang panguma makalingaw!', 512, 216)
    const tex = new CanvasTexture(c)
    tex.colorSpace = SRGBColorSpace
    tex.anisotropy = 4
    return new MeshStandardMaterial({ map: tex, roughness: 0.8 })
  }, [])
}

/** One string of little triangular party flags, hanging in a gentle curve between two points. */
function useBuntingGeometry(span: number, sag: number, count: number) {
  return useMemo(() => {
    const pos: number[] = []
    const col: number[] = []
    for (let i = 0; i < count; i++) {
      const t0 = (i + 0.15) / count
      const t1 = (i + 0.85) / count
      const yAt = (t: number) => -sag * 4 * t * (1 - t)
      const x0 = -span / 2 + t0 * span
      const x1 = -span / 2 + t1 * span
      const xm = (x0 + x1) / 2
      pos.push(x0, yAt(t0), 0, x1, yAt(t1), 0, xm, yAt((t0 + t1) / 2) - 0.24, 0)
      const hex = FLAG_COLORS[i % FLAG_COLORS.length]
      const r = parseInt(hex.slice(1, 3), 16) / 255
      const gg = parseInt(hex.slice(3, 5), 16) / 255
      const b = parseInt(hex.slice(5, 7), 16) / 255
      for (let k = 0; k < 3; k++) col.push(r, gg, b)
    }
    const geo = new BufferGeometry()
    geo.setAttribute('position', new Float32BufferAttribute(pos, 3))
    geo.setAttribute('color', new Float32BufferAttribute(col, 3))
    geo.computeVertexNormals()
    return geo
  }, [span, sag, count])
}

/** The farm gate over the dirt path: two tall posts, the welcome banner and colourful flags. */
export function FarmGate() {
  const banner = useBannerMaterial()
  const span = 3.4
  const flags = useBuntingGeometry(span + 0.1, 0.12, 9)
  const ref = useRef<Group>(null)
  useBakeStatic(ref)
  const { x, z, y, rot } = useMemo(() => {
    const t = 0.44
    const p = pathCurve.getPointAt(t)
    const tan = pathCurve.getTangentAt(t)
    return { x: p.x, z: p.z, y: heightAt(p.x, p.z), rot: Math.atan2(-tan.x, -tan.z) }
  }, [])
  return (
    <group ref={ref} position={[x, y, z]} rotation={[0, rot, 0]}>
      {[-span / 2, span / 2].map((px) => (
        <mesh key={px} material={post} position={[px, 1.8, 0]} castShadow>
          <boxGeometry args={[0.16, 3.6, 0.16]} />
        </mesh>
      ))}
      <mesh material={post} position={[0, 3.52, 0]} castShadow>
        <boxGeometry args={[span + 0.3, 0.1, 0.1]} />
      </mesh>
      <mesh material={banner} position={[0, 2.55, 0.06]} userData={{ noBake: true }} castShadow>
        <planeGeometry args={[span - 0.1, 0.8]} />
      </mesh>
      {/* banner backing so it isn't see-through from behind */}
      <mesh material={dark} position={[0, 2.55, 0.03]}>
        <boxGeometry args={[span - 0.1, 0.8, 0.02]} />
      </mesh>
      <mesh geometry={flags} position={[0, 3.46, 0.1]} userData={{ noBake: true }}>
        <meshStandardMaterial vertexColors side={2} roughness={0.8} />
      </mesh>
    </group>
  )
}

/**
 * The family farmhouse behind the pens: a stone ground floor, a painted upper floor
 * and a grey tin roof, like the house seen in the farm's photos.
 */
export function Farmhouse({ x, z, rotation = 0 }: { x: number; z: number; rotation?: number }) {
  const w = 4.2
  const d = 3.2
  const floorH = 2.0
  const y = heightAt(x, z)
  const ref = useRef<Group>(null)
  useBakeStatic(ref)
  return (
    <group ref={ref} position={[x, y, z]} rotation={[0, rotation, 0]}>
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[w + 0.2, 0.8, d + 0.2]} />
        <meshStandardMaterial color="#bdb6a8" roughness={0.95} flatShading />
      </mesh>
      {/* stone ground floor and painted upper floor */}
      <mesh position={[0, floorH / 2 + 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, floorH, d]} />
        <meshStandardMaterial color="#a59d90" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0, floorH * 1.5 + 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.1, floorH, d + 0.1]} />
        <meshStandardMaterial color="#eee6d6" roughness={0.9} flatShading />
      </mesh>
      {/* grey tin gable roof */}
      <mesh position={[0, floorH * 2 + 0.1 + 0.65, 0]} rotation={[0, Math.PI / 4, 0]} scale={[(w + 0.6) / 1.414, 1, (d + 0.6) / 1.414]} castShadow>
        <coneGeometry args={[1, 1.3, 4]} />
        <meshStandardMaterial color="#7f878b" metalness={0.25} roughness={0.55} flatShading />
      </mesh>
      {/* door, windows and a small balcony at the front (+z) */}
      <mesh position={[-0.9, 0.95, d / 2 + 0.01]}>
        <boxGeometry args={[0.8, 1.6, 0.03]} />
        <meshStandardMaterial color="#6a4a32" roughness={0.8} />
      </mesh>
      {[0.6, 1.5].map((wx) => (
        <mesh key={wx} material={dark} position={[wx, 1.2, d / 2 + 0.01]}>
          <boxGeometry args={[0.6, 0.6, 0.03]} />
        </mesh>
      ))}
      {[-1.3, 0, 1.3].map((wx) => (
        <mesh key={wx} material={dark} position={[wx, floorH * 1.5 + 0.2, d / 2 + 0.06]}>
          <boxGeometry args={[0.7, 0.75, 0.03]} />
        </mesh>
      ))}
      <mesh position={[0, floorH + 0.12, d / 2 + 0.45]} castShadow>
        <boxGeometry args={[w * 0.7, 0.08, 0.8]} />
        <meshStandardMaterial color="#8a5f3c" roughness={0.9} />
      </mesh>
      <mesh position={[0, floorH + 0.55, d / 2 + 0.83]}>
        <boxGeometry args={[w * 0.7, 0.05, 0.04]} />
        <meshStandardMaterial color="#c9d1d4" metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { CanvasTexture, DoubleSide, Group, PlaneGeometry, SRGBColorSpace } from 'three'
import { useBakeStatic } from '../bake'
import ProcessingLine from './ProcessingLine'
import { heightAt } from './world'

// ---------- shared materials ----------
const wood = { color: '#8a5f3c', roughness: 0.9, flatShading: true }
const concrete = { color: '#d8d2c4', roughness: 0.95, flatShading: true }

/** A corrugated metal roof sheet: many small ridges running down the slope. */
function useCorrugatedSheet(width: number, depth: number) {
  return useMemo(() => {
    const segments = Math.round(width / 0.15)
    const geo = new PlaneGeometry(width, depth, segments, 1)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      pos.setZ(i, Math.sin((x / 0.3) * Math.PI * 2) * 0.035)
    }
    geo.computeVertexNormals()
    return geo
  }, [width, depth])
}

/** Gable roof made of two corrugated sheets meeting at a ridge. */
function Roof({
  width,
  depth,
  height,
  pitch = 0.32,
  color = '#c3ccd0',
}: {
  width: number
  depth: number
  height: number
  pitch?: number
  color?: string
}) {
  const half = depth / 2 + 0.35 // overhang at the eaves
  const slope = half / Math.cos(pitch)
  const sheet = useCorrugatedSheet(width + 0.6, slope)
  const rise = Math.tan(pitch) * half
  return (
    <group position={[0, height, 0]}>
      {[1, -1].map((side) => (
        <mesh
          key={side}
          geometry={sheet}
          position={[0, rise / 2, (side * half) / 2]}
          rotation={[-Math.PI / 2 + side * pitch, 0, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} side={DoubleSide} flatShading />
        </mesh>
      ))}
      {/* ridge cap */}
      <mesh position={[0, rise + 0.02, 0]}>
        <boxGeometry args={[width + 0.6, 0.06, 0.22]} />
        <meshStandardMaterial color="#9aa5aa" metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  )
}

/** Painted sign with text drawn on a canvas (no font files to download). */
function Sign({ text, width = 1.7, height = 0.45 }: { text: string; width?: number; height?: number }) {
  const [texture, setTexture] = useState<CanvasTexture | null>(null)

  useEffect(() => {
    let cancelled = false
    const draw = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = Math.round((512 * height) / width)
      const ctx = canvas.getContext('2d')!
      const w = canvas.width
      const h = canvas.height
      ctx.fillStyle = '#fbf8f1'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = '#0c5247'
      ctx.lineWidth = 10
      ctx.strokeRect(8, 8, w - 16, h - 16)
      // little blue wave under the words, like the Island Pure logo
      ctx.fillStyle = '#0887b0'
      ctx.beginPath()
      ctx.ellipse(w / 2, h - 26, w * 0.3, 7, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#0c5247'
      ctx.font = `600 ${Math.round(h * 0.48)}px "Fraunces Variable", Georgia, serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, w / 2, h * 0.44)
      const tex = new CanvasTexture(canvas)
      tex.colorSpace = SRGBColorSpace
      tex.anisotropy = 4
      if (!cancelled) setTexture(tex)
    }
    // wait for the heading font so the sign matches the website
    document.fonts.load('600 48px "Fraunces Variable"').then(draw, draw)
    return () => {
      cancelled = true
    }
  }, [text, width, height])

  return (
    <group userData={{ noBake: true }}>
      <mesh castShadow>
        <boxGeometry args={[width + 0.08, height + 0.08, 0.05]} />
        <meshStandardMaterial {...wood} />
      </mesh>
      <mesh position={[0, 0, 0.027]}>
        <planeGeometry args={[width, height]} />
        {texture ? (
          <meshStandardMaterial key="painted" map={texture} roughness={0.8} />
        ) : (
          <meshStandardMaterial key="blank" color="#fbf8f1" />
        )}
      </mesh>
    </group>
  )
}

function Post({ x, z, height, size = 0.16 }: { x: number; z: number; height: number; size?: number }) {
  return (
    <mesh position={[x, height / 2, z]} castShadow>
      <boxGeometry args={[size, height, size]} />
      <meshStandardMaterial {...wood} />
    </mesh>
  )
}

// galvanised pipe railings and stands, as on the real cow shed
const pipeMetal = { color: '#c9d1d4', metalness: 0.35, roughness: 0.35 }

/** Gable end filled with horizontal wooden slats (louvers), like the real cow shed's tall gables. */
function SlattedGable({ width, rise, z }: { width: number; rise: number; z: number }) {
  const rows = 6
  return (
    <group position={[0, 0, z]}>
      {Array.from({ length: rows }, (_, i) => {
        const t = (i + 0.5) / rows
        return (
          <mesh key={i} position={[0, t * rise, 0]}>
            <boxGeometry args={[width * (1 - t) * 0.98, rise / rows - 0.05, 0.04]} />
            <meshStandardMaterial {...wood} />
          </mesh>
        )
      })}
    </group>
  )
}

/**
 * Our cow shed, as in the farm's photos: a tall, steep, weathered tin roof on dark wooden posts,
 * slatted wooden gables, galvanised pipe railings, a paver floor, a concrete feed trough and
 * blue water drums on a steel stand.
 */
export function CowShed({ x, z, rotation = 0 }: { x: number; z: number; rotation?: number }) {
  const w = 5.8
  const d = 4.0
  const postH = 2.2
  const pitch = 0.62
  const rise = Math.tan(pitch) * (d / 2 + 0.35)
  const y = heightAt(x, z)
  const ref = useRef<Group>(null)
  useBakeStatic(ref)
  return (
    <group ref={ref} position={[x, y, z]} rotation={[0, rotation, 0]}>
      {/* terracotta paver floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[w, 0.12, d]} />
        <meshStandardMaterial color="#b0705a" roughness={0.95} flatShading />
      </mesh>
      {/* posts */}
      {[-w / 2, -w / 6, w / 6, w / 2].flatMap((px) =>
        [-d / 2, d / 2].map((pz) => <Post key={`${px}${pz}`} x={px} z={pz} height={postH} size={0.18} />),
      )}
      {/* concrete feed wall and trough along the back */}
      <mesh position={[0, 0.4, -d / 2 + 0.08]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.7, 0.16]} />
        <meshStandardMaterial {...concrete} />
      </mesh>
      <mesh position={[0, 0.28, -d / 2 + 0.5]} castShadow>
        <boxGeometry args={[w - 0.4, 0.34, 0.55]} />
        <meshStandardMaterial color="#b8b2a6" flatShading roughness={0.9} />
      </mesh>
      {/* galvanised pipe railings on the open sides (with a gap at the front for the cows) */}
      {[0.55, 1.05].flatMap((ry) => [
        <mesh key={`f${ry}a`} position={[-w / 2 + w / 6, ry, d / 2]}>
          <boxGeometry args={[w / 3, 0.06, 0.06]} />
          <meshStandardMaterial {...pipeMetal} />
        </mesh>,
        <mesh key={`f${ry}b`} position={[w / 2 - w / 6, ry, d / 2]}>
          <boxGeometry args={[w / 3, 0.06, 0.06]} />
          <meshStandardMaterial {...pipeMetal} />
        </mesh>,
        ...[-w / 2, w / 2].map((sx) => (
          <mesh key={`s${ry}${sx}`} position={[sx, ry, 0]}>
            <boxGeometry args={[0.06, 0.06, d]} />
            <meshStandardMaterial {...pipeMetal} />
          </mesh>
        )),
      ])}
      {/* eave beams and the tall, steep roof with slatted gables */}
      {[-d / 2, d / 2].map((bz) => (
        <mesh key={bz} position={[0, postH, bz]}>
          <boxGeometry args={[w + 0.2, 0.14, 0.14]} />
          <meshStandardMaterial {...wood} />
        </mesh>
      ))}
      <group position={[0, postH + 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
        <SlattedGable width={d + 0.5} rise={rise} z={w / 2 - 0.05} />
        <SlattedGable width={d + 0.5} rise={rise} z={-w / 2 + 0.05} />
      </group>
      <Roof width={w} depth={d} height={postH + 0.05} pitch={pitch} color="#a39486" />
      {/* blue water drum up on a steel stand, and one on the ground */}
      <group position={[w / 2 + 0.55, 0, -d / 2 + 0.4]}>
        {[-0.22, 0.22].flatMap((sx) =>
          [-0.22, 0.22].map((sz) => (
            <mesh key={`${sx}${sz}`} position={[sx, 0.5, sz]}>
              <boxGeometry args={[0.05, 1.0, 0.05]} />
              <meshStandardMaterial {...pipeMetal} />
            </mesh>
          )),
        )}
        <mesh position={[0, 1.02, 0]}>
          <boxGeometry args={[0.55, 0.05, 0.55]} />
          <meshStandardMaterial {...pipeMetal} />
        </mesh>
        <mesh position={[0, 1.45, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.8, 12]} />
          <meshStandardMaterial color="#1f6fb5" roughness={0.5} />
        </mesh>
      </group>
      <mesh position={[w / 2 + 0.5, 0.42, d / 2 - 0.4]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.84, 12]} />
        <meshStandardMaterial color="#1f6fb5" roughness={0.5} />
      </mesh>
      {/* sign hanging from the front eave */}
      <group position={[0, postH - 0.35, d / 2 + 0.08]}>
        <Sign text="Cow Shed" />
      </group>
    </group>
  )
}

/** Single-slope (lean-to) tin roof, higher at the back, like the real milking parlor. */
function LeanToRoof({ width, depth, height }: { width: number; depth: number; height: number }) {
  const slope = depth + 0.7
  const sheet = useCorrugatedSheet(width + 0.6, Math.hypot(slope, 0.55))
  const tilt = Math.atan2(0.55, slope)
  return (
    <mesh geometry={sheet} position={[0, height + 0.3, 0]} rotation={[-Math.PI / 2 + tilt, 0, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#b9c1c4" metalness={0.3} roughness={0.5} side={DoubleSide} flatShading />
    </mesh>
  )
}

/** Small milking parlor: painted walls on three sides, open front, and the milk processing line beside it. */
export function MilkingParlor({ x, z, rotation = 0 }: { x: number; z: number; rotation?: number }) {
  const w = 3.6
  const d = 2.8
  const wallH = 2.1
  const y = heightAt(x, z)
  const wall = { color: '#f1ede2', roughness: 0.9, flatShading: true }
  const ref = useRef<Group>(null)
  useBakeStatic(ref)
  return (
    <group ref={ref} position={[x, y, z]} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[w, 0.12, d]} />
        <meshStandardMaterial {...concrete} />
      </mesh>
      {/* back and side walls */}
      <mesh position={[0, wallH / 2, -d / 2]} castShadow receiveShadow>
        <boxGeometry args={[w, wallH, 0.14]} />
        <meshStandardMaterial {...wall} />
      </mesh>
      {[-w / 2, w / 2].map((sx) => (
        <mesh key={sx} position={[sx, wallH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.14, wallH, d]} />
          <meshStandardMaterial {...wall} />
        </mesh>
      ))}
      {/* green trim band along the walls */}
      <mesh position={[0, 0.25, -d / 2 + 0.08]}>
        <boxGeometry args={[w - 0.1, 0.3, 0.02]} />
        <meshStandardMaterial color="#0c5247" />
      </mesh>
      {/* milking stall rails */}
      {[-0.7, 0.7].map((rx) => (
        <mesh key={rx} position={[rx, 0.9, 0]}>
          <boxGeometry args={[0.06, 0.06, d - 0.4]} />
          <meshStandardMaterial color="#c9d1d4" metalness={0.3} roughness={0.35} />
        </mesh>
      ))}
      <Post x={-w / 2} z={d / 2} height={wallH} size={0.18} />
      <Post x={w / 2} z={d / 2} height={wallH} size={0.18} />
      <mesh position={[0, wallH, d / 2]}>
        <boxGeometry args={[w + 0.2, 0.14, 0.16]} />
        <meshStandardMaterial {...wood} />
      </mesh>
      <LeanToRoof width={w} depth={d} height={wallH} />
      {/* our real 100 L pasteurizer, homogenizer and cooling tank, beside the parlor */}
      <ProcessingLine position={[w / 2 + 0.65, 0, -0.1]} />
      <group position={[0, wallH - 0.32, d / 2 + 0.1]}>
        <Sign text="Milking Parlor" width={2.1} height={0.45} />
      </group>
    </group>
  )
}

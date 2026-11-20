import { useMemo, useRef } from 'react'
import { CanvasTexture, CatmullRomCurve3, Group, MeshStandardMaterial, SRGBColorSpace, TubeGeometry, Vector3 } from 'three'
import { useBakeStatic } from '../bake'

/*
 * Our real 100-litre milk processing line, modelled on the photo of the farm's machine:
 * a pasteurizer vat, a homogenizer cabinet and a cooling tank, side by side on one stainless
 * steel skid and joined by pipes. Sizes are in metres, close to the real machine.
 *
 * Local axes: the line runs along z (cooling tank at −z, pasteurizer at +z), the front faces +x,
 * so seen from the front the pasteurizer is on the left, as in the photo.
 */

const steel = new MeshStandardMaterial({ color: '#f1f4f5', metalness: 0.4, roughness: 0.2 })
const steelDark = new MeshStandardMaterial({ color: '#cdd4d7', metalness: 0.4, roughness: 0.32 })
const motorPaint = new MeshStandardMaterial({ color: '#a3aea8', metalness: 0.2, roughness: 0.5 })
const blackKnob = new MeshStandardMaterial({ color: '#262626', roughness: 0.6 })
const redButton = new MeshStandardMaterial({ color: '#d33a2c', roughness: 0.5 })
const footWhite = new MeshStandardMaterial({ color: '#f4f2ec', roughness: 0.7 })
const gaugeFace = new MeshStandardMaterial({ color: '#f7f7f2', roughness: 0.4 })

/** A white sticker label with black words, like the ones on the real machine. */
function useStickerMaterial(lines: string[]) {
  const key = lines.join('|')
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const g = canvas.getContext('2d')!
    g.fillStyle = '#ffffff'
    g.fillRect(0, 0, 512, 256)
    g.strokeStyle = '#444'
    g.lineWidth = 6
    g.strokeRect(6, 6, 500, 244)
    g.fillStyle = '#5a6f80'
    g.font = '600 26px Arial, sans-serif'
    g.textAlign = 'center'
    g.fillText('Hillsbrook Farm', 256, 52)
    g.fillStyle = '#111'
    g.font = '700 58px Arial, sans-serif'
    lines.forEach((line, i) => g.fillText(line, 256, 130 + i * 66, 480))
    const tex = new CanvasTexture(canvas)
    tex.colorSpace = SRGBColorSpace
    tex.anisotropy = 4
    return new MeshStandardMaterial({ map: tex, roughness: 0.6 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}

/** Round jacketed vat on four splayed legs, with a lid, a geared stirring motor and a side sight glass. */
function Vat({ z, label }: { z: number; label: string[] }) {
  const sticker = useStickerMaterial(label)
  const r = 0.42
  const bodyBottom = 0.62
  const bodyH = 0.56
  const top = bodyBottom + bodyH
  return (
    <group position={[0, 0, z]}>
      {/* body, cone bottom and rolled top rim */}
      <mesh material={steel} position={[0, bodyBottom + bodyH / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[r, r, bodyH, 28]} />
      </mesh>
      <mesh material={steel} position={[0, bodyBottom - 0.1, 0]} castShadow>
        <cylinderGeometry args={[r, 0.09, 0.2, 28]} />
      </mesh>
      <mesh material={steelDark} position={[0, top, 0]}>
        <torusGeometry args={[r, 0.018, 6, 28]} />
      </mesh>
      {/* lid with a hinged hatch and handle */}
      <mesh material={steel} position={[0, top + 0.015, 0]}>
        <cylinderGeometry args={[r - 0.01, r - 0.01, 0.03, 28]} />
      </mesh>
      <mesh material={steelDark} position={[0.14, top + 0.04, 0]}>
        <boxGeometry args={[0.24, 0.02, 0.4]} />
      </mesh>
      <mesh material={blackKnob} position={[0.2, top + 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.07, 0.012, 6, 12, Math.PI]} />
      </mesh>
      {/* four splayed legs with white levelling feet */}
      {[0.25, 0.75, 1.25, 1.75].map((a) => {
        const lx = Math.cos(a * Math.PI) * 0.36
        const lz = Math.sin(a * Math.PI) * 0.36
        return (
          <group key={a}>
            <mesh material={steel} position={[lx * 1.05, 0.31, lz * 1.05]} rotation={[lz * 0.25, 0, -lx * 0.25]} castShadow>
              <boxGeometry args={[0.07, 0.62, 0.07]} />
            </mesh>
            <mesh material={footWhite} position={[lx * 1.12, 0.02, lz * 1.12]}>
              <cylinderGeometry args={[0.05, 0.06, 0.04, 10]} />
            </mesh>
          </group>
        )
      })}
      {/* geared motor on top, driving the stirrer */}
      <group position={[-0.08, top + 0.05, 0]}>
        <mesh material={motorPaint} position={[0, 0.09, 0]} castShadow>
          <boxGeometry args={[0.16, 0.14, 0.16]} />
        </mesh>
        <mesh material={motorPaint} position={[-0.06, 0.12, 0.17]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.075, 0.22, 14]} />
        </mesh>
      </group>
      {/* sight-glass flange on the side */}
      <mesh material={steelDark} position={[0.05, bodyBottom + 0.38, r + 0.03]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 14]} />
      </mesh>
      {/* outlet valve under the cone */}
      <mesh material={steel} position={[0, bodyBottom - 0.26, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.12, 8]} />
      </mesh>
      {/* sticker label on the front */}
      <mesh material={sticker} position={[r + 0.004, bodyBottom + 0.26, 0]} rotation={[0, Math.PI / 2, 0]} userData={{ noBake: true }}>
        <planeGeometry args={[0.46, 0.23]} />
      </mesh>
    </group>
  )
}

/** Stainless pipe along a few points. */
function Pipe({ points, radius = 0.024 }: { points: [number, number, number][]; radius?: number }) {
  const geometry = useMemo(() => {
    const curve = new CatmullRomCurve3(
      points.map((p) => new Vector3(...p)),
      false,
      'catmullrom',
      0.05,
    )
    return new TubeGeometry(curve, points.length * 8, radius, 8, false)
  }, [points, radius])
  return <mesh geometry={geometry} material={steel} castShadow />
}

/** Round pressure gauge facing the front. */
function Gauge({ position, size = 0.07 }: { position: [number, number, number]; size?: number }) {
  return (
    <group position={position} rotation={[0, 0, -Math.PI / 2]}>
      <mesh material={steel}>
        <cylinderGeometry args={[size, size, 0.03, 18]} />
      </mesh>
      <mesh material={gaugeFace} position={[0, -0.016, 0]}>
        <cylinderGeometry args={[size * 0.85, size * 0.85, 0.005, 18]} />
      </mesh>
    </group>
  )
}

// pipe paths, in the line's local space (front = +x)
const PIPE_PAST_TO_HOMO: [number, number, number][] = [
  [0, 0.36, 0.95],
  [0, 0.24, 0.85],
  [0.12, 0.22, 0.55],
  [0.2, 0.3, 0.28],
]
const PIPE_HOMO_TO_COOL: [number, number, number][] = [
  [0.2, 1.06, -0.05],
  [0.2, 1.08, -0.3],
  [0.12, 1.3, -0.5],
  [0.05, 1.42, -0.72],
  [0, 1.3, -0.95],
]

/**
 * The farm's 100 L pasteurizer, homogenizer and cooling tank on one skid.
 * `rotation` turns the whole line; place it with `position` in the parent's space.
 */
export default function ProcessingLine({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const ref = useRef<Group>(null)
  useBakeStatic(ref)
  const homoSticker = useStickerMaterial(['100L', 'Homogenizer'])
  const len = 3.0

  return (
    <group ref={ref} position={position} rotation={[0, rotation, 0]}>
      {/* skid: two long square-tube rails and cross members on white feet */}
      {[-0.42, 0.42].map((x) => (
        <mesh key={x} material={steel} position={[x, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.07, 0.07, len]} />
        </mesh>
      ))}
      {[-1.45, -0.45, 0.45, 1.45].map((z) => (
        <mesh key={z} material={steel} position={[0, 0.1, z]} castShadow>
          <boxGeometry args={[0.84, 0.07, 0.07]} />
        </mesh>
      ))}
      {[-1.45, 1.45].flatMap((z) =>
        [-0.42, 0.42].map((x) => (
          <mesh key={`${x}${z}`} material={footWhite} position={[x, 0.03, z]}>
            <cylinderGeometry args={[0.05, 0.06, 0.06, 10]} />
          </mesh>
        )),
      )}

      <Vat z={0.95} label={['100L Pasteurization', 'Machine']} />
      <Vat z={-0.95} label={['100L', 'Cooling Tank']} />

      {/* homogenizer: a stainless cabinet with the high-pressure head and gauge on top */}
      <group position={[0, 0.14, 0]}>
        <mesh material={steel} position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.84, 0.56]} />
        </mesh>
        <mesh material={steelDark} position={[0.301, 0.25, 0]}>
          <boxGeometry args={[0.005, 0.3, 0.36]} />
        </mesh>
        <mesh material={homoSticker} position={[0.304, 0.58, 0]} rotation={[0, Math.PI / 2, 0]} userData={{ noBake: true }}>
          <planeGeometry args={[0.42, 0.21]} />
        </mesh>
        {/* red warning sticker */}
        <mesh material={redButton} position={[0.304, 0.78, 0.2]}>
          <boxGeometry args={[0.004, 0.06, 0.05]} />
        </mesh>
        {/* pump head with the pressure-adjust handle and gauge */}
        <mesh material={steel} position={[0.22, 0.92, 0.05]} castShadow>
          <boxGeometry args={[0.16, 0.12, 0.3]} />
        </mesh>
        <mesh material={steel} position={[0.27, 1.02, 0.05]}>
          <cylinderGeometry args={[0.022, 0.022, 0.14, 8]} />
        </mesh>
        <mesh material={steel} position={[0.27, 1.09, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.014, 0.22, 8]} />
        </mesh>
        <mesh material={steel} position={[0.25, 0.95, 0.3]}>
          <cylinderGeometry args={[0.018, 0.018, 0.2, 8]} />
        </mesh>
        <Gauge position={[0.27, 1.12, 0.3]} />
      </group>

      {/* pasteurizer control box on a post: display and red buttons */}
      <group position={[0.1, 0, 0.42]}>
        <mesh material={steel} position={[0, 0.7, 0]}>
          <boxGeometry args={[0.05, 1.4, 0.05]} />
        </mesh>
        <mesh material={steel} position={[0.05, 1.38, 0]} castShadow>
          <boxGeometry args={[0.16, 0.36, 0.3]} />
        </mesh>
        <mesh material={blackKnob} position={[0.132, 1.46, 0]}>
          <boxGeometry args={[0.005, 0.07, 0.16]} />
        </mesh>
        {[-0.06, 0.06].map((bz) => (
          <mesh key={bz} material={redButton} position={[0.14, 1.3, bz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 10]} />
          </mesh>
        ))}
      </group>

      {/* milk pump under the pasteurizer and the pipes between the machines */}
      <mesh material={steel} position={[0.05, 0.27, 0.55]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.18, 12]} />
      </mesh>
      <Pipe points={PIPE_PAST_TO_HOMO} />
      <Pipe points={PIPE_HOMO_TO_COOL} />
      <Gauge position={[0.1, 1.48, -0.72]} size={0.06} />
    </group>
  )
}

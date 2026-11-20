import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { CatmullRomCurve3, Group, IcosahedronGeometry, MeshStandardMaterial, Vector3 } from 'three'
import { Palm } from '../hero/Plants'
import { SEA_LEVEL, smoothstep } from '../hero/world'
import { useBakeStatic } from '../bake'
import { Bottle, useLabelTexture } from './Bottles'

const wood = new MeshStandardMaterial({ color: '#9a6b44', roughness: 0.9, flatShading: true })
const paleWood = new MeshStandardMaterial({ color: '#c9a274', roughness: 0.85, flatShading: true })
const bamboo = new MeshStandardMaterial({ color: '#c8a85e', roughness: 0.8, flatShading: true })
const hullWhite = new MeshStandardMaterial({ color: '#f4f2ec', roughness: 0.6, flatShading: true })
const hullBlue = new MeshStandardMaterial({ color: '#0887b0', roughness: 0.6, flatShading: true })
const crateGreen = new MeshStandardMaterial({ color: '#2f7d4f', roughness: 0.7 })
const capGreen = new MeshStandardMaterial({ color: '#f5c518', roughness: 0.45 })

// ---------- places across the water (a small Siargao shore) ----------
export const DECK_Y = SEA_LEVEL + 0.95
export const BREAKFAST_TABLE = new Vector3(-29.6, DECK_Y, -52.8)
const ISLAND = { x: -32, z: -57 }

/** Where the bangka sails: from the beach below the farm to the pier across the water. */
export const boatRoute = new CatmullRomCurve3([
  new Vector3(5.5, SEA_LEVEL, -16.8),
  new Vector3(-5, SEA_LEVEL, -27),
  new Vector3(-18, SEA_LEVEL, -37),
  new Vector3(-30, SEA_LEVEL, -44),
  new Vector3(-35.2, SEA_LEVEL, -46.4),
])

/**
 * A Filipino bangka: a white outrigger boat with a blue stripe, bamboo outriggers on both sides,
 * a small canopy, and crates of Island Pure milk on board.
 * `progress` (0–1) moves it along `boatRoute`.
 */
export function Bangka({ progress }: { progress: { current: number } }) {
  const group = useRef<Group>(null)
  const ahead = useMemo(() => new Vector3(), [])
  useBakeStatic(group)

  useFrame(({ clock }) => {
    if (!group.current) return
    const u = Math.min(0.999, Math.max(0, progress.current))
    const p = boatRoute.getPoint(u)
    boatRoute.getPoint(Math.min(1, u + 0.01), ahead)
    const t = clock.elapsedTime
    group.current.position.set(p.x, p.y + 0.05 + Math.sin(t * 1.6) * 0.04, p.z)
    // point the bow along the route (bow is +x in the model)
    const yaw = Math.atan2(-(ahead.z - p.z), ahead.x - p.x)
    if (u < 0.998) group.current.rotation.y = yaw
    group.current.rotation.x = Math.sin(t * 1.3) * 0.03
  })

  return (
    <group ref={group}>
      {/* hull with pointed, raised bow and stern */}
      <mesh material={hullWhite} position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[3.4, 0.36, 0.62]} />
      </mesh>
      <mesh material={hullBlue} position={[0, 0.27, 0]}>
        <boxGeometry args={[3.42, 0.07, 0.64]} />
      </mesh>
      {[1, -1].map((end) => (
        <mesh key={end} material={hullWhite} position={[end * 2.05, 0.2, 0]} rotation={[0, 0, end * -Math.PI / 2 + end * 0.35]}>
          <coneGeometry args={[0.3, 0.9, 4]} />
        </mesh>
      ))}
      {/* bamboo outriggers (katig) and cross poles */}
      {[1.35, -1.35].map((z) => (
        <mesh key={z} material={bamboo} position={[0, 0.02, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 3.6, 6]} />
        </mesh>
      ))}
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} material={bamboo} position={[x, 0.36, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 2.9, 6]} />
        </mesh>
      ))}
      {/* canopy */}
      {[
        [-0.6, 0.25],
        [0.6, 0.25],
        [-0.6, -0.25],
        [0.6, -0.25],
      ].map(([x, z], i) => (
        <mesh key={i} material={wood} position={[x, 0.75, z]}>
          <boxGeometry args={[0.04, 0.9, 0.04]} />
        </mesh>
      ))}
      <mesh position={[0, 1.22, 0]} castShadow>
        <boxGeometry args={[1.5, 0.04, 0.8]} />
        <meshStandardMaterial color="#0c5247" roughness={0.8} />
      </mesh>
      {/* crates of milk */}
      {[-0.3, 0.3].map((x) => (
        <group key={x} position={[x, 0.45, 0]}>
          <mesh material={crateGreen} castShadow>
            <boxGeometry args={[0.45, 0.28, 0.35]} />
          </mesh>
          {[-0.12, 0, 0.12].map((bx) => (
            <mesh key={bx} material={capGreen} position={[bx, 0.16, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.03, 8]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/** Wooden table on the resort deck with breakfast: pandesal, mango, and a glass of Island Pure milk. */
function BreakfastTable() {
  const label = useLabelTexture()
  return (
    <group position={BREAKFAST_TABLE}>
      <mesh material={paleWood} position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.05, 0.7]} />
      </mesh>
      {[
        [-0.45, -0.3],
        [0.45, -0.3],
        [-0.45, 0.3],
        [0.45, 0.3],
      ].map(([x, z], i) => (
        <mesh key={i} material={paleWood} position={[x, 0.37, z]}>
          <boxGeometry args={[0.05, 0.74, 0.05]} />
        </mesh>
      ))}
      <group position={[0, 0.765, 0]}>
        {/* glass of milk */}
        <mesh position={[0.12, 0.07, 0.08]}>
          <cylinderGeometry args={[0.042, 0.036, 0.14, 14]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.25} roughness={0.05} depthWrite={false} />
        </mesh>
        <mesh position={[0.12, 0.055, 0.08]}>
          <cylinderGeometry args={[0.038, 0.033, 0.11, 14]} />
          <meshStandardMaterial color="#fbfaf5" roughness={0.3} />
        </mesh>
        {/* bottle of Island Pure */}
        <Bottle kind="pet" label={label} position={[0.3, 0, -0.1]} />
        {/* plate with pandesal and mango */}
        <mesh position={[-0.18, 0.01, 0.05]}>
          <cylinderGeometry args={[0.13, 0.11, 0.02, 18]} />
          <meshStandardMaterial color="#fbf8f1" roughness={0.4} />
        </mesh>
        {[
          [-0.23, 0.02],
          [-0.15, 0.09],
          [-0.12, -0.01],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.045, z]} scale={[1, 0.75, 1]}>
            <sphereGeometry args={[0.035, 8, 6]} />
            <meshStandardMaterial color="#c58a4a" roughness={0.8} flatShading />
          </mesh>
        ))}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[-0.26 + i * 0.05, 0.03, 0.12]} rotation={[0, 0.3, 0]}>
            <boxGeometry args={[0.035, 0.025, 0.08]} />
            <meshStandardMaterial color="#f5b82e" roughness={0.6} />
          </mesh>
        ))}
      </group>
      {/* two bamboo chairs */}
      {[-0.55, 0.55].map((z) => (
        <group key={z} position={[0, 0, z]}>
          <mesh material={bamboo} position={[0, 0.45, 0]}>
            <boxGeometry args={[0.45, 0.05, 0.4]} />
          </mesh>
          <mesh material={bamboo} position={[0, 0.22, 0]}>
            <boxGeometry args={[0.4, 0.44, 0.04]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ---------- the island's shape: sandy and green mounds (centre, half-size) ----------
type Mound = { c: [number, number, number]; s: [number, number, number]; color: string }
const MOUNDS: Mound[] = [
  { c: [ISLAND.x, SEA_LEVEL - 0.55, ISLAND.z], s: [9, 1.4, 6.5], color: '#ecd9a6' },
  { c: [ISLAND.x - 2.5, SEA_LEVEL - 0.2, ISLAND.z - 3.5], s: [8, 2.2, 4.5], color: '#4f8a3a' },
  // the coast carries on to the east and west, with a village along the beach
  { c: [-17.5, SEA_LEVEL - 0.6, -53.2], s: [9, 1.3, 4.4], color: '#ecd9a6' },
  { c: [-16.5, SEA_LEVEL - 0.35, -57.2], s: [8.5, 2.6, 3.8], color: '#5a9440' },
  { c: [-45.5, SEA_LEVEL - 0.6, -54.5], s: [7, 1.3, 4.6], color: '#ecd9a6' },
  { c: [-46, SEA_LEVEL - 0.3, -58.5], s: [7, 2.4, 3.6], color: '#4f8a3a' },
  // a small village island across the channel, in view from the breakfast table
  { c: [-47, SEA_LEVEL - 0.6, -33], s: [6.2, 1.25, 4.2], color: '#ecd9a6' },
  { c: [-48.8, SEA_LEVEL - 0.3, -30.8], s: [5, 2.3, 3], color: '#5a9440' },
]

/** Ground height on the island at (x, z): the highest mound surface there, or the sea. */
function islandY(x: number, z: number) {
  let y = SEA_LEVEL - 0.4
  for (const { c, s } of MOUNDS) {
    const k = 1 - ((x - c[0]) / s[0]) ** 2 - ((z - c[2]) / s[2]) ** 2
    if (k > 0) y = Math.max(y, c[1] + s[1] * Math.sqrt(k))
  }
  return y
}

const WALLS = ['#f6efe0', '#a8dccf', '#f3c9a0', '#f2a99b', '#ffffff', '#f4d77a', '#b9d4ef', '#d8c3e8']
const ROOFS = ['#b5523b', '#3d6f8f', '#9da3a6', '#2f7d4f', '#b5523b', '#c46b2d']
const windowDark = new MeshStandardMaterial({ color: '#3a3a3a', roughness: 0.8 })
const concreteBase = new MeshStandardMaterial({ color: '#cfc8b8', roughness: 0.95, flatShading: true })

type HouseSpec = { x: number; z: number; rot?: number; w?: number; d?: number; h?: number; stilts?: boolean; storeys?: 1 | 2 }

/** A small island house: painted walls, a tin or tile gable roof, a door and two windows facing the sea. */
function House({ x, z, rot = 0, w = 2.2, d = 1.9, h = 1.5, stilts = false, storeys = 1, i }: HouseSpec & { i: number }) {
  const ground = stilts ? SEA_LEVEL + 0.9 : islandY(x, z)
  const wall = WALLS[i % WALLS.length]
  const roof = ROOFS[(i * 3) % ROOFS.length]
  const H = h * storeys
  const rise = Math.min(w, d) * 0.38
  return (
    <group position={[x, ground, z]} rotation={[0, rot, 0]}>
      {stilts ? (
        [-1, 1].flatMap((sx) =>
          [-1, 1].map((sz) => (
            <mesh key={`${sx}${sz}`} material={wood} position={[(sx * w) / 2.3, -(ground - SEA_LEVEL + 0.5) / 2, (sz * d) / 2.3]}>
              <boxGeometry args={[0.12, ground - SEA_LEVEL + 0.5, 0.12]} />
            </mesh>
          )),
        )
      ) : (
        <mesh material={concreteBase} position={[0, -0.25, 0]}>
          <boxGeometry args={[w + 0.15, 0.7, d + 0.15]} />
        </mesh>
      )}
      <mesh position={[0, H / 2 + 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, H, d]} />
        <meshStandardMaterial color={wall} roughness={0.9} flatShading />
      </mesh>
      {/* gable roof: a four-sided cone stretched to the house's shape */}
      <mesh position={[0, H + 0.05 + rise / 2, 0]} rotation={[0, Math.PI / 4, 0]} scale={[(w + 0.5) / 1.414, 1, (d + 0.5) / 1.414]} castShadow>
        <coneGeometry args={[1, rise, 4]} />
        <meshStandardMaterial color={roof} roughness={0.7} flatShading />
      </mesh>
      {/* door and windows on the front (+z) */}
      <mesh material={wood} position={[w * 0.18, 0.5, d / 2 + 0.01]}>
        <boxGeometry args={[0.42, 0.9, 0.02]} />
      </mesh>
      {[-w * 0.24, w * 0.42].map((wx, k) =>
        Math.abs(wx) < w / 2 - 0.2 ? (
          <mesh key={k} material={windowDark} position={[wx, H - h * 0.45 + 0.05, d / 2 + 0.01]}>
            <boxGeometry args={[0.38, 0.32, 0.02]} />
          </mesh>
        ) : null,
      )}
      {storeys === 2 && (
        <mesh material={windowDark} position={[w * 0.18, h * 1.5, d / 2 + 0.01]}>
          <boxGeometry args={[0.5, 0.34, 0.02]} />
        </mesh>
      )}
    </group>
  )
}

/** A village along the beach: houses facing the water, a few on stilts, more up the green hills. */
const VILLAGE: HouseSpec[] = [
  // east beach, first row
  { x: -24.6, z: -51.4, rot: 0.15 },
  { x: -21.8, z: -50.6, rot: -0.1, w: 2.6, storeys: 2 },
  { x: -18.8, z: -50.9, rot: 0.08 },
  { x: -15.9, z: -50.3, rot: -0.2, w: 2.4 },
  { x: -12.8, z: -51.1, rot: 0.1, w: 2.0 },
  { x: -10.6, z: -52.3, rot: 0.35 },
  // houses on stilts over the water
  { x: -25.0, z: -47.8, rot: 0.2, w: 2.0, d: 1.7, stilts: true },
  { x: -20.3, z: -48.3, rot: -0.05, w: 2.2, d: 1.8, stilts: true },
  // second row, up the hill
  { x: -22.8, z: -54.6, rot: 0.1, w: 2.4 },
  { x: -19.2, z: -55.4, rot: -0.15, storeys: 2 },
  { x: -15.4, z: -54.3, rot: 0.05, w: 2.6 },
  { x: -11.9, z: -55.6, rot: 0.25 },
  // around the resort and the west beach
  { x: -37.6, z: -55.6, rot: 0.3, w: 2.0 },
  { x: -36.2, z: -59.6, rot: 0.1, w: 2.4 },
  { x: -29.8, z: -60.6, rot: -0.1, storeys: 2 },
  { x: -41.4, z: -52.6, rot: -0.25 },
  { x: -44.4, z: -51.8, rot: 0.1, w: 2.5, storeys: 2 },
  { x: -47.6, z: -53.2, rot: -0.15 },
  { x: -45.2, z: -56.8, rot: 0.05, w: 2.0 },
  { x: -39.4, z: -49.6, rot: -0.3, w: 1.9, d: 1.7, stilts: true },
  // the village island across the channel, facing the resort
  { x: -44.4, z: -35.4, rot: 2.43 },
  { x: -46.9, z: -36.0, rot: 2.3, w: 2.5 },
  { x: -49.4, z: -34.9, rot: 2.6 },
  { x: -45.8, z: -32.4, rot: 2.43, storeys: 2 },
  { x: -48.4, z: -32.0, rot: 2.5, w: 2.0 },
  { x: -51.0, z: -32.8, rot: 2.2, w: 2.3 },
  { x: -42.2, z: -36.6, rot: 2.43, w: 1.9, d: 1.7, stilts: true },
]

/** Nipa hut with a thatched roof, behind the deck. */
function NipaHut({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh material={bamboo} position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[2.6, 1.6, 2.2]} />
      </mesh>
      <mesh position={[0, 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.3, 1.3, 4]} />
        <meshStandardMaterial color="#b8925a" roughness={1} flatShading />
      </mesh>
      <mesh material={wood} position={[0, 0.75, 1.11]}>
        <boxGeometry args={[0.7, 1.2, 0.02]} />
      </mesh>
    </group>
  )
}

/**
 * A small stretch of Siargao shore across the water: sandy beach, palms, a wooden pier where the
 * bangka ties up (our Dapa Port drop-off), and a resort deck with breakfast waiting.
 */
export function SiargaoShore() {
  const mound = useMemo(() => {
    const g = new IcosahedronGeometry(1, 2)
    return g
  }, [])
  const pierStart = new Vector3(-31.6, 0, -51.8)
  const pierEnd = new Vector3(-34.6, 0, -47.6)
  const pierLen = pierStart.distanceTo(pierEnd)
  const pierMid = pierStart.clone().add(pierEnd).multiplyScalar(0.5)
  const pierYaw = -Math.atan2(pierEnd.z - pierStart.z, pierEnd.x - pierStart.x)
  const ref = useRef<Group>(null)
  useBakeStatic(ref)

  return (
    <group ref={ref}>
      {/* sandy beaches with green hills behind, along a stretch of Siargao coast */}
      {MOUNDS.map((m, i) => (
        <mesh key={i} geometry={mound} position={m.c} scale={m.s} receiveShadow>
          <meshStandardMaterial color={m.color} flatShading roughness={1} />
        </mesh>
      ))}
      {VILLAGE.map((h, i) => (
        <House key={i} i={i} {...h} />
      ))}
      {/* more palms along the village beach */}
      {[
        [-23.2, -50.2, 4.6, 1.2],
        [-17.4, -49.6, 5.2, 2.6],
        [-13.9, -49.8, 4.4, 0.4],
        [-42.8, -50.6, 4.8, 3.4],
        [-46.4, -55.2, 5.4, 5.1],
        [-20.6, -56.8, 5.0, 1.9],
        [-43.0, -33.6, 4.8, 0.9],
        [-50.2, -36.2, 5.2, 3.0],
        [-47.4, -29.6, 5.6, 4.6],
      ].map(([x, z, height, r]) => (
        <Palm key={`${x}${z}`} x={x} z={z} y={islandY(x, z)} height={height} lean={0.8} rotation={r} />
      ))}
      <Palm x={-35.5} z={-57.5} y={SEA_LEVEL + 0.8} height={5.4} lean={0.9} rotation={0.6} />
      <Palm x={-27.2} z={-57.8} y={SEA_LEVEL + 0.7} height={4.8} lean={1.1} rotation={2.4} />
      <Palm x={-34.4} z={-54.4} y={SEA_LEVEL + 0.6} height={4.2} lean={0.7} rotation={4.4} />
      <NipaHut position={[-31.4, DECK_Y - 0.1, -56.4]} />
      {/* deck */}
      <mesh material={paleWood} position={[-30.2, DECK_Y - 0.05, -53.6]} receiveShadow castShadow>
        <boxGeometry args={[4.2, 0.1, 3.0]} />
      </mesh>
      {[
        [-32.2, -55],
        [-28.2, -55],
        [-32.2, -52.2],
        [-28.2, -52.2],
      ].map(([x, z], i) => (
        <mesh key={i} material={wood} position={[x, (DECK_Y + SEA_LEVEL - 0.6) / 2, z]}>
          <boxGeometry args={[0.12, DECK_Y - SEA_LEVEL + 0.6, 0.12]} />
        </mesh>
      ))}
      <BreakfastTable />
      {/* pier */}
      <group position={[pierMid.x, DECK_Y - 0.12, pierMid.z]} rotation={[0, pierYaw, 0]}>
        <mesh material={wood} castShadow receiveShadow>
          <boxGeometry args={[pierLen + 0.3, 0.08, 0.9]} />
        </mesh>
        {Array.from({ length: 5 }, (_, i) => -pierLen / 2 + (i * pierLen) / 4).flatMap((x) =>
          [-0.4, 0.4].map((z) => (
            <mesh key={`${x}${z}`} material={wood} position={[x, -0.55, z]}>
              <cylinderGeometry args={[0.06, 0.06, 1.2, 6]} />
            </mesh>
          )),
        )}
      </group>
    </group>
  )
}

/** 0 until the boat leaves, 1 when it has arrived: the boat sails during the last part of the journey. */
export const boatProgress = (journey: number) => smoothstep(0.76, 0.97, journey)

import { useLayoutEffect, useMemo, useRef } from 'react'
import { BoxGeometry, Group, InstancedMesh, MeshStandardMaterial, Object3D, Vector3 } from 'three'
import { useBakeStatic } from '../bake'
import { CALF_PEN, heightAt, PASTURE } from './world'

const woodMat = new MeshStandardMaterial({ color: '#8a6342', roughness: 0.9, flatShading: true })
const roofMat = new MeshStandardMaterial({ color: '#b8b2a5', roughness: 0.6, metalness: 0.2, flatShading: true })

type Rect = { minX: number; maxX: number; minZ: number; maxZ: number }
/** Sides: 0 back, 1 right, 2 front, 3 left */
const PENS: { rect: Rect; pad: number; gateSide: number }[] = [
  { rect: PASTURE, pad: 0.8, gateSide: 1 }, // grown cows: gate towards the path
  { rect: CALF_PEN, pad: 0.5, gateSide: 3 }, // calves: gate towards the path on the other side
]

function addPen(
  { minX, maxX, minZ, maxZ }: Rect,
  pad: number,
  gateSide: number,
  postList: Vector3[],
  railList: { a: Vector3; b: Vector3; y: number }[],
) {
  const corners = [
    new Vector3(minX - pad, 0, minZ - pad),
    new Vector3(maxX + pad, 0, minZ - pad),
    new Vector3(maxX + pad, 0, maxZ + pad),
    new Vector3(minX - pad, 0, maxZ + pad),
  ]
  for (let side = 0; side < 4; side++) {
    const a = corners[side]
    const b = corners[(side + 1) % 4]
    const steps = Math.max(2, Math.round(a.distanceTo(b) / 1.5))
    for (let i = 0; i < steps; i++) {
      const p0 = a.clone().lerp(b, i / steps)
      const p1 = a.clone().lerp(b, (i + 1) / steps)
      p0.y = heightAt(p0.x, p0.z)
      p1.y = heightAt(p1.x, p1.z)
      postList.push(p0)
      // leave a gate opening on the side that faces the path
      const gate = side === gateSide && i === Math.floor(steps / 2)
      if (!gate) {
        railList.push({ a: p0, b: p1, y: 0.4 }, { a: p0, b: p1, y: 0.75 })
      }
    }
  }
}

/** Wooden post-and-rail fences: one pen for the grown cows, a separate one for the calves. */
export default function Fence() {
  const postsRef = useRef<InstancedMesh>(null)
  const railsRef = useRef<InstancedMesh>(null)

  const { posts, rails } = useMemo(() => {
    const postList: Vector3[] = []
    const railList: { a: Vector3; b: Vector3; y: number }[] = []
    for (const pen of PENS) addPen(pen.rect, pen.pad, pen.gateSide, postList, railList)
    return { posts: postList, rails: railList }
  }, [])

  const geometry = useMemo(() => new BoxGeometry(1, 1, 1), [])

  useLayoutEffect(() => {
    const d = new Object3D()
    posts.forEach((p, i) => {
      d.position.set(p.x, p.y + 0.45, p.z)
      d.rotation.set(0, 0, 0)
      d.scale.set(0.12, 0.95, 0.12)
      d.updateMatrix()
      postsRef.current?.setMatrixAt(i, d.matrix)
    })
    rails.forEach((r, i) => {
      const mid = r.a.clone().add(r.b).multiplyScalar(0.5)
      const len = r.a.distanceTo(r.b)
      d.position.set(mid.x, mid.y + r.y, mid.z)
      d.rotation.set(0, -Math.atan2(r.b.z - r.a.z, r.b.x - r.a.x), Math.atan2(r.b.y - r.a.y, Math.hypot(r.b.x - r.a.x, r.b.z - r.a.z)))
      d.scale.set(len, 0.07, 0.05)
      d.updateMatrix()
      railsRef.current?.setMatrixAt(i, d.matrix)
    })
    if (postsRef.current) postsRef.current.instanceMatrix.needsUpdate = true
    if (railsRef.current) railsRef.current.instanceMatrix.needsUpdate = true
  }, [posts, rails])

  return (
    <group>
      <instancedMesh ref={postsRef} args={[geometry, woodMat, posts.length]} castShadow />
      <instancedMesh ref={railsRef} args={[geometry, woodMat, rails.length]} castShadow />
    </group>
  )
}

/** A small shade roof in the back corner of the calf pen, so the calves can rest out of the sun. */
export function CalfShelter() {
  const ref = useRef<Group>(null)
  useBakeStatic(ref)
  const w = 1.8
  const d = 1.4
  const x = CALF_PEN.maxX - w / 2 - 0.1
  const z = CALF_PEN.minZ + d / 2 + 0.1
  const y = heightAt(x, z)
  return (
    <group ref={ref} position={[x, y, z]}>
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} material={woodMat} position={[(sx * w) / 2, sz < 0 ? 0.75 : 0.6, (sz * d) / 2]} castShadow>
            <boxGeometry args={[0.1, sz < 0 ? 1.5 : 1.2, 0.1]} />
          </mesh>
        )),
      )}
      {/* sloping tin roof, higher at the back */}
      <mesh material={roofMat} position={[0, 1.42, 0]} rotation={[0.11, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.4, 0.06, d + 0.4]} />
      </mesh>
    </group>
  )
}

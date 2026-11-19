import { useLayoutEffect, useMemo, useRef } from 'react'
import { BoxGeometry, InstancedMesh, MeshStandardMaterial, Object3D, Vector3 } from 'three'
import { heightAt, PASTURE } from './world'

const woodMat = new MeshStandardMaterial({ color: '#8a6342', roughness: 0.9, flatShading: true })

/** Wooden post-and-rail fence around the pasture, with a gap where the path comes in. */
export default function Fence() {
  const postsRef = useRef<InstancedMesh>(null)
  const railsRef = useRef<InstancedMesh>(null)

  const { posts, rails } = useMemo(() => {
    const pad = 0.8
    const { minX, maxX, minZ, maxZ } = PASTURE
    const corners = [
      new Vector3(minX - pad, 0, minZ - pad),
      new Vector3(maxX + pad, 0, minZ - pad),
      new Vector3(maxX + pad, 0, maxZ + pad),
      new Vector3(minX - pad, 0, maxZ + pad),
    ]
    const postList: Vector3[] = []
    const railList: { a: Vector3; b: Vector3; y: number }[] = []
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
        // leave a gate opening on the right-hand side, where the path passes
        const gate = side === 1 && i === Math.floor(steps / 2)
        if (!gate) {
          railList.push({ a: p0, b: p1, y: 0.4 }, { a: p0, b: p1, y: 0.75 })
        }
      }
    }
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

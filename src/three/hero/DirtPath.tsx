import { useMemo } from 'react'
import { BufferAttribute, BufferGeometry, Vector3 } from 'three'
import { heightAt, pathCurve } from './world'

/** The winding dirt path, as a thin ribbon laid just above the grass. */
export default function DirtPath() {
  const geometry = useMemo(() => {
    const samples = 70
    const halfWidth = 0.55
    const positions: number[] = []
    const indices: number[] = []
    const up = new Vector3(0, 1, 0)
    for (let i = 0; i <= samples; i++) {
      const t = i / samples
      const p = pathCurve.getPointAt(t)
      const tangent = pathCurve.getTangentAt(t)
      const side = new Vector3().crossVectors(up, tangent).normalize()
      // slightly wider where it meets the farmyard
      const w = halfWidth * (1 + 0.5 * Math.max(0, t - 0.85) * 6)
      for (const dir of [-1, 1]) {
        const x = p.x + side.x * w * dir
        const z = p.z + side.z * w * dir
        positions.push(x, heightAt(x, z) + 0.04, z)
      }
      if (i < samples) {
        const a = i * 2
        indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
      }
    }
    const geo = new BufferGeometry()
    geo.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
    geo.setIndex(indices)
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#b0663f" roughness={1} flatShading polygonOffset polygonOffsetFactor={-2} />
    </mesh>
  )
}

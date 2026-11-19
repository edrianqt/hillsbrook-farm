import { useMemo } from 'react'
import { BufferAttribute, Color, PlaneGeometry } from 'three'
import { CORN_PLOT, distanceToPath, fbm, heightAt, NAPIER_PLOT, SEA_LEVEL, smoothstep } from './world'

const grassLight = new Color('#8fbf55')
const grassDark = new Color('#4f8a3a')
const grassWarm = new Color('#a9b955')
const dirt = new Color('#a98c5f')
const soil = new Color('#7a5638')
const sand = new Color('#ecd9a6')
const wetSand = new Color('#c9b07c')

const inside = (r: typeof CORN_PLOT, x: number, z: number) => x > r.minX && x < r.maxX && z > r.minZ && z < r.maxZ

/** The green hills, the dirt path, the planted plots and the beach, as one low-poly ground mesh. */
export default function Terrain() {
  const geometry = useMemo(() => {
    // 92 x 70 metres, 60 x 46 squares: about 5,500 triangles
    const geo = new PlaneGeometry(92, 70, 60, 46)
    geo.rotateX(-Math.PI / 2)
    geo.translate(0, 0, -6)
    const pos = geo.attributes.position
    const colors = new Float32Array(pos.count * 3)
    const c = new Color()

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      let h = heightAt(x, z)
      const pathDist = distanceToPath(x, z)
      if (pathDist < 1.1) h -= 0.06 * (1 - pathDist / 1.1)
      pos.setY(i, h)

      // grass colour varies gently across the hills, warmer in the evening light
      const n = fbm(x * 0.15, z * 0.15)
      c.copy(grassDark).lerp(grassLight, n).lerp(grassWarm, smoothstep(0.55, 0.85, fbm(x * 0.05 + 9, z * 0.05)) * 0.5)

      if (inside(CORN_PLOT, x, z) || inside(NAPIER_PLOT, x, z)) c.lerp(soil, 0.75)
      if (pathDist < 1.4) c.lerp(dirt, smoothstep(1.4, 0.6, pathDist) * 0.45)
      // beach and shallows
      c.lerp(sand, smoothstep(0.35, -0.15, h))
      if (h < SEA_LEVEL) c.copy(wetSand)

      colors.set([c.r, c.g, c.b], i * 3)
    }
    geo.setAttribute('color', new BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors flatShading roughness={0.95} />
    </mesh>
  )
}

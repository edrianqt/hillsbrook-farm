import { useThree } from '@react-three/fiber'
import { type RefObject, useEffect, useLayoutEffect } from 'react'
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  InstancedMesh,
  Material,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  type Object3D,
  Texture,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * Speed-up: merges all the still (non-moving) plain-coloured meshes inside a group into a few big meshes,
 * one per kind of material. The GPU then draws, say, a whole cow body in one go instead of 15 pieces.
 * The original pieces stay in place (hidden), so hovering and clicking still work.
 *
 * Skipped automatically: textured, see-through and instanced meshes, and anything marked
 * `userData={{ noBake: true }}` (for parts that change later, such as signs and the filling bottle).
 */
export function useBakeStatic(ref: RefObject<Object3D | null>, deps: unknown[] = []) {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    root.updateWorldMatrix(true, true)
    const toRoot = new Matrix4().copy(root.matrixWorld).invert()
    const buckets = new Map<string, { geos: BufferGeometry[]; source: MeshStandardMaterial; shadow: [boolean, boolean] }>()
    const baked: Mesh[] = []

    root.traverse((obj) => {
      const mesh = obj as Mesh
      if (!mesh.isMesh || (mesh as unknown as InstancedMesh).isInstancedMesh || mesh.userData.noBake || !mesh.visible) return
      if (hasNoBakeAncestor(mesh, root)) return
      const mat = mesh.material as MeshStandardMaterial
      if (Array.isArray(mat) || !(mat instanceof MeshStandardMaterial) || mat.map || mat.transparent) return

      const key = [
        mat.roughness,
        mat.metalness,
        mat.flatShading,
        mat.side,
        mat.emissive.getHexString(),
        mat.emissiveIntensity,
        mat.vertexColors,
        mesh.castShadow,
        mesh.receiveShadow,
      ].join('|')
      const geo = prepare(mesh, toRoot, mat)
      if (!geo) return
      const bucket = buckets.get(key) ?? { geos: [], source: mat, shadow: [mesh.castShadow, mesh.receiveShadow] }
      bucket.geos.push(geo)
      buckets.set(key, bucket)
      baked.push(mesh)
    })

    const merged: Mesh[] = []
    for (const { geos, source, shadow } of buckets.values()) {
      if (geos.length < 2) {
        geos.forEach((g) => g.dispose())
        // nothing to gain from merging a single piece: leave it as it is
        continue
      }
      const geometry = mergeGeometries(geos)
      geos.forEach((g) => g.dispose())
      if (!geometry) continue
      const material = new MeshStandardMaterial({
        vertexColors: true,
        roughness: source.roughness,
        metalness: source.metalness,
        flatShading: source.flatShading,
        side: source.side,
        emissive: source.emissive,
        emissiveIntensity: source.emissiveIntensity,
      })
      const m = new Mesh(geometry, material)
      m.castShadow = shadow[0]
      m.receiveShadow = shadow[1]
      m.raycast = () => {} // the hidden originals handle pointer events
      root.add(m)
      merged.push(m)
    }

    // hide only the pieces that ended up in a merged mesh
    const mergedCount = new Set<string>()
    for (const [key, b] of buckets) if (b.geos.length >= 2) mergedCount.add(key)
    for (const mesh of baked) {
      const mat = mesh.material as MeshStandardMaterial
      const key = [mat.roughness, mat.metalness, mat.flatShading, mat.side, mat.emissive.getHexString(), mat.emissiveIntensity, mat.vertexColors, mesh.castShadow, mesh.receiveShadow].join('|')
      if (mergedCount.has(key)) mesh.visible = false
    }

    return () => {
      for (const m of merged) {
        root.remove(m)
        m.geometry.dispose()
        ;(m.material as Material).dispose()
      }
      for (const mesh of baked) mesh.visible = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

function hasNoBakeAncestor(obj: Object3D, root: Object3D) {
  let p = obj.parent
  while (p && p !== root) {
    if (p.userData.noBake) return true
    p = p.parent
  }
  return false
}

/** Copy of the mesh's shape, moved into the group's space, with its colour painted onto every corner. */
function prepare(mesh: Mesh, toRoot: Matrix4, mat: MeshStandardMaterial) {
  let geo = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone()
  const keep = new BufferGeometry()
  keep.setAttribute('position', geo.getAttribute('position'))
  if (geo.getAttribute('normal')) keep.setAttribute('normal', geo.getAttribute('normal'))
  else keep.computeVertexNormals()
  const count = keep.getAttribute('position').count
  const colors = new Float32Array(count * 3)
  const existing = mat.vertexColors ? geo.getAttribute('color') : null
  const c = new Color().copy(mat.color)
  for (let i = 0; i < count; i++) {
    if (existing) colors.set([existing.getX(i) * c.r, existing.getY(i) * c.g, existing.getZ(i) * c.b], i * 3)
    else colors.set([c.r, c.g, c.b], i * 3)
  }
  keep.setAttribute('color', new BufferAttribute(colors, 3))
  keep.applyMatrix4(new Matrix4().multiplyMatrices(toRoot, mesh.matrixWorld))
  if (geo !== mesh.geometry) geo.dispose()
  geo = keep
  return geo
}

/** Frees GPU memory (shapes, materials, pictures) when a 3D scene is removed from the page. */
export function DisposeOnUnmount() {
  const scene = useThree((s) => s.scene)
  useEffect(
    () => () => {
      scene.traverse((obj) => {
        const mesh = obj as Mesh
        mesh.geometry?.dispose()
        const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : []
        for (const m of mats) {
          for (const v of Object.values(m)) if (v instanceof Texture) v.dispose()
          m.dispose()
        }
      })
    },
    [scene],
  )
  return null
}

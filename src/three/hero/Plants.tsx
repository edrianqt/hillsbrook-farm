import { useLayoutEffect, useMemo, useRef } from 'react'
import {
  Color,
  Group,
  ConeGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  QuadraticBezierCurve3,
  TubeGeometry,
  Vector3,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useBakeStatic } from '../bake'
import { addWind } from './wind'
import { CORN_PLOT, heightAt, isInPlot, NAPIER_PLOT, rng } from './world'

// ---------- coconut palm ----------
function makeFrond() {
  // a long leaf that droops towards its tip
  const geo = new PlaneGeometry(3.0, 0.75, 6, 1)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) + 1.5 // 0 at the trunk, 3.0 at the tip
    const y = pos.getY(i)
    pos.setX(i, x)
    pos.setY(i, 0.35 * x - 0.2 * x * x)
    pos.setZ(i, y * (1 - x / 3.4))
  }
  geo.computeVertexNormals()
  return geo
}

const palmTrunkMat = new MeshStandardMaterial({ color: '#8b6a48', roughness: 0.85, flatShading: true })
const palmLeafMat = new MeshStandardMaterial({ color: '#4d8b3b', roughness: 0.85, flatShading: true, side: 2 })
const coconutMat = new MeshStandardMaterial({ color: '#6b5a2a', roughness: 0.85, flatShading: true })

export function Palm({
  x,
  z,
  y,
  height = 6,
  lean = 0.6,
  rotation = 0,
}: {
  x: number
  z: number
  /** only needed when the palm stands somewhere other than the farm's hills */
  y?: number
  height?: number
  lean?: number
  rotation?: number
}) {
  const { trunk, frond, nut, top } = useMemo(() => {
    const topPoint = new Vector3(lean * 1.4, height, 0)
    const curve = new QuadraticBezierCurve3(new Vector3(0, 0, 0), new Vector3(lean * 0.2, height * 0.6, 0), topPoint)
    return {
      trunk: new TubeGeometry(curve, 6, 0.16, 5, false),
      frond: makeFrond(),
      nut: new IcosahedronGeometry(0.14, 0),
      top: topPoint,
    }
  }, [height, lean])
  const root = useRef<Group>(null)
  useBakeStatic(root)

  return (
    <group ref={root} position={[x, y ?? heightAt(x, z), z]} rotation={[0, rotation, 0]}>
      <mesh geometry={trunk} material={palmTrunkMat} castShadow />
      <group position={top}>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh
            key={i}
            geometry={frond}
            material={palmLeafMat}
            rotation={[0, (i / 8) * Math.PI * 2, (i % 2) * 0.25]}
            castShadow
          />
        ))}
        {[0, 2.1, 4.2].map((a) => (
          <mesh key={a} geometry={nut} material={coconutMat} castShadow position={[Math.cos(a) * 0.18, -0.2, Math.sin(a) * 0.18]} />
        ))}
      </group>
    </group>
  )
}

// ---------- instanced field helper ----------
function useScatter(mesh: React.RefObject<InstancedMesh | null>, items: { x: number; z: number; s: number; ry: number; tilt: number; color: Color }[]) {
  useLayoutEffect(() => {
    if (!mesh.current) return
    const dummy = new Object3D()
    items.forEach((it, i) => {
      dummy.position.set(it.x, heightAt(it.x, it.z), it.z)
      dummy.rotation.set(it.tilt, it.ry, it.tilt * 0.5)
      dummy.scale.setScalar(it.s)
      dummy.updateMatrix()
      mesh.current!.setMatrixAt(i, dummy.matrix)
      mesh.current!.setColorAt(i, it.color)
    })
    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [mesh, items])
}

// ---------- Napier grass: tall clumps used as cattle feed ----------
export function NapierPlot({ lite = false }: { lite?: boolean }) {
  const mesh = useRef<InstancedMesh>(null)
  const { geometry, material, items } = useMemo(() => {
    // one clump = three tall blades leaning outwards
    const blades = [0, 1, 2].map((i) => {
      const g = new ConeGeometry(0.09, 2.1, 3)
      g.translate(0, 1.05, 0)
      g.rotateZ(0.12)
      g.rotateY((i / 3) * Math.PI * 2)
      return g
    })
    const geo = mergeGeometries(blades)
    const mat = addWind(new MeshStandardMaterial({ color: '#ffffff', roughness: 0.8, flatShading: true }), 0.06)
    const r = rng(11)
    const list = []
    const base = new Color('#6fa83f')
    const tip = new Color('#a4c45a')
    const step = lite ? 0.85 : 0.6
    for (let gx = NAPIER_PLOT.minX; gx < NAPIER_PLOT.maxX; gx += step) {
      for (let gz = NAPIER_PLOT.minZ; gz < NAPIER_PLOT.maxZ; gz += step + 0.05) {
        list.push({
          x: gx + (r() - 0.5) * 0.3,
          z: gz + (r() - 0.5) * 0.3,
          s: (0.75 + r() * 0.45) * (lite ? 1.15 : 1),
          ry: r() * Math.PI,
          tilt: (r() - 0.5) * 0.15,
          color: base.clone().lerp(tip, r()),
        })
      }
    }
    return { geometry: geo, material: mat, items: list }
  }, [lite])
  useScatter(mesh, items)
  return <instancedMesh key={items.length} ref={mesh} args={[geometry, material, items.length]} castShadow />
}

// ---------- young corn in neat rows ----------
export function CornField({ lite = false }: { lite?: boolean }) {
  const mesh = useRef<InstancedMesh>(null)
  const { geometry, material, items } = useMemo(() => {
    const stalk = new CylinderGeometry(0.025, 0.04, 0.8, 4)
    stalk.translate(0, 0.4, 0)
    const leaves = [0, 1, 2, 3].map((i) => {
      const leaf = new PlaneGeometry(0.55, 0.13, 3, 1)
      leaf.translate(0.275, 0, 0)
      // arch: rises from the stalk then droops at the tip
      const lp = leaf.attributes.position
      for (let k = 0; k < lp.count; k++) {
        const lx = lp.getX(k)
        lp.setY(k, lp.getY(k) + lx * 0.9 - lx * lx * 1.3)
      }
      leaf.computeVertexNormals()
      leaf.rotateY((i / 4) * Math.PI * 2 + i * 0.4)
      leaf.translate(0, 0.25 + i * 0.13, 0)
      return leaf
    })
    const geo = mergeGeometries([stalk.toNonIndexed(), ...leaves.map((l) => l.toNonIndexed())])
    const mat = addWind(new MeshStandardMaterial({ color: '#ffffff', roughness: 0.8, flatShading: true, side: 2 }), 0.07)
    const r = rng(23)
    const list = []
    const a = new Color('#5f9c39')
    const b = new Color('#8dbb4a')
    for (let gz = CORN_PLOT.minZ + 0.3; gz < CORN_PLOT.maxZ; gz += lite ? 1.1 : 0.85) {
      for (let gx = CORN_PLOT.minX + 0.2; gx < CORN_PLOT.maxX; gx += lite ? 0.75 : 0.55) {
        list.push({ x: gx + (r() - 0.5) * 0.1, z: gz, s: 1.25 + r() * 0.5, ry: r() * Math.PI * 2, tilt: 0, color: a.clone().lerp(b, r()) })
      }
    }
    return { geometry: geo, material: mat, items: list }
  }, [lite])
  useScatter(mesh, items)
  return <instancedMesh key={items.length} ref={mesh} args={[geometry, material, items.length]} castShadow />
}

// ---------- scattered shrubs on the hills ----------
export function Shrubs() {
  const mesh = useRef<InstancedMesh>(null)
  const { geometry, material, items } = useMemo(() => {
    const geo = new IcosahedronGeometry(0.6, 0)
    geo.scale(1, 0.7, 1)
    const mat = new MeshStandardMaterial({ color: '#ffffff', roughness: 0.9, flatShading: true })
    const r = rng(5)
    const list = []
    const a = new Color('#3f7a36')
    const b = new Color('#5e9440')
    while (list.length < 46) {
      const x = -40 + r() * 80
      const z = -12 + r() * 21
      const nearFarm = x > -14 && x < 14 && z > -9 && z < 10
      if (nearFarm || z > 9 || heightAt(x, z) < 0.3 || isInPlot(x, z)) continue
      list.push({ x, z, s: 0.6 + r() * 0.8, ry: r() * 6, tilt: 0, color: a.clone().lerp(b, r()) })
    }
    return { geometry: geo, material: mat, items: list }
  }, [])
  useScatter(mesh, items)
  return <instancedMesh ref={mesh} args={[geometry, material, items.length]} castShadow receiveShadow />
}

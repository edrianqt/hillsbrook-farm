import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { PerspectiveCamera, Vector3 } from 'three'

/** Where the camera sits and looks, for wide screens and for tall phone screens. */
const VIEWS = {
  wide: { pos: new Vector3(2.5, 10.4, 25), target: new Vector3(-3.4, 1.5, -2), fov: 38 },
  tall: { pos: new Vector3(6, 14, 32), target: new Vector3(3.6, 7.2, -2), fov: 50 },
}

/**
 * Slow, gentle camera drift, plus a slight tilt towards the mouse
 * (or towards how the phone is held, where the device allows it).
 */
export default function CameraRig({ moving }: { moving: boolean }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const size = useThree((s) => s.size)
  const pointer = useRef({ x: 0, y: 0 })
  const smooth = useRef({ x: 0, y: 0 })
  const lookAt = useRef(new Vector3())

  // Mouse position across the whole window (the text overlay sits above the canvas)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    // Phone tilt: Android allows it directly; iPhone asks permission on the first tap
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      pointer.current.x = Math.max(-1, Math.min(1, e.gamma / 30))
      pointer.current.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30))
    }
    type IOSOrientation = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> }
    const DOE = (typeof DeviceOrientationEvent !== 'undefined' ? DeviceOrientationEvent : undefined) as IOSOrientation | undefined
    const askOnce = () => {
      DOE?.requestPermission?.()
        .then((r) => r === 'granted' && window.addEventListener('deviceorientation', onTilt))
        .catch(() => {})
    }
    window.addEventListener('pointermove', onMove)
    if (DOE?.requestPermission) window.addEventListener('pointerdown', askOnce, { once: true })
    else window.addEventListener('deviceorientation', onTilt)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', askOnce)
      window.removeEventListener('deviceorientation', onTilt)
    }
  }, [])

  useFrame(({ clock }, delta) => {
    const view = size.width / size.height < 0.9 ? VIEWS.tall : VIEWS.wide
    if (camera.fov !== view.fov) {
      camera.fov = view.fov
      camera.updateProjectionMatrix()
    }
    const t = moving ? clock.elapsedTime : 0
    const k = 1 - Math.exp(-delta * 2)
    smooth.current.x += (pointer.current.x - smooth.current.x) * k
    smooth.current.y += (pointer.current.y - smooth.current.y) * k
    const mx = moving ? smooth.current.x : 0
    const my = moving ? smooth.current.y : 0

    camera.position.set(
      view.pos.x + Math.sin(t * 0.07) * 1.4 + mx * 1.6,
      view.pos.y + Math.sin(t * 0.11) * 0.35 - my * 0.8,
      view.pos.z + Math.cos(t * 0.05) * 0.8,
    )
    lookAt.current.set(view.target.x + mx * 0.6, view.target.y - my * 0.3, view.target.z)
    camera.lookAt(lookAt.current)
  })

  return null
}

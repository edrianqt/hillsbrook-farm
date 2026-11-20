import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { pillars, ui } from '../content/site'
import { hasWebGL, isTouchDevice, prefersReducedMotion } from '../lib/webgl'
import PillarSvgIcon from './PillarSvgIcon'
import Card from './ui/Card'
import SectionHeading from './ui/SectionHeading'

const PillarIcon = lazy(() => import('../three/PillarIcon'))

type Item = (typeof pillars.items)[number]

function PillarCard({ item, use3D, show3D }: { item: Item; use3D: boolean; show3D: boolean }) {
  const [hovered, setHovered] = useState(false)
  const spinning = hovered && !prefersReducedMotion()
  return (
    <Card
      as="li"
      tone="cream"
      className="flex w-[80%] shrink-0 snap-center flex-col sm:w-auto"
    >
      <div
        className="flex flex-1 flex-col"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        // phones: a tap spins the icon for a moment
        onTouchStart={() => {
          setHovered(true)
          window.setTimeout(() => setHovered(false), 2200)
        }}
      >
        <div className="mx-auto size-32">
          {use3D && show3D ? (
            <Suspense fallback={<PillarSvgIcon kind={item.icon} />}>
              <PillarIcon kind={item.icon} spinning={spinning} />
            </Suspense>
          ) : (
            <PillarSvgIcon kind={item.icon} />
          )}
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-pasture">{item.title}</h3>
        <p className="mt-2 flex-1 leading-relaxed text-soil-muted">{item.text}</p>
        <a
          href={item.link.href}
          className="mt-5 inline-flex min-h-11 items-center gap-1 self-start font-semibold text-lagoon-ink underline-offset-4 hover:underline"
        >
          {item.link.label}
          <span className="sr-only"> {ui.about} {item.title}</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </Card>
  )
}

/** "What we stand for": four pillars with small 3D icons. A swipeable row on phones. */
export default function Pillars() {
  const [use3D] = useState(() => hasWebGL() && !isTouchDevice())
  const ref = useRef<HTMLElement>(null)
  const [show3D, setShow3D] = useState(false)

  // load the 3D icons only when the section comes near
  useEffect(() => {
    if (!use3D || !ref.current) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShow3D(true), { rootMargin: '50% 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [use3D])

  return (
    <section ref={ref} id="pillars" aria-labelledby="pillars-title" className="bg-cream-50">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading id="pillars-title" eyebrow={pillars.eyebrow} title={pillars.title} />
        <ul className="no-scrollbar -mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {pillars.items.map((item) => (
            <PillarCard key={item.title} item={item} use3D={use3D} show3D={show3D} />
          ))}
        </ul>
        <p className="mt-2 text-center text-sm text-soil-muted sm:hidden" aria-hidden="true">
          {ui.swipeHint}
        </p>
      </div>
    </section>
  )
}

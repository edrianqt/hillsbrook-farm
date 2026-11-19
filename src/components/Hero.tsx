import { lazy, Suspense } from 'react'
import { orderButton, sections } from '../content/site'
import Button from './ui/Button'
import { MessengerIcon } from './ui/icons'
import SectionHeading from './ui/SectionHeading'

// The 3D code is loaded separately, so the text appears instantly even on slow connections.
const SpinningCube = lazy(() => import('../three/SpinningCube'))

const hero = sections.find((s) => s.id === 'hero')!

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="flex min-h-svh items-center bg-[radial-gradient(120%_80%_at_80%_20%,var(--color-pasture-50),var(--color-milk)_60%)] pt-18"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-16 md:grid-cols-2 md:items-center">
        <div>
          <SectionHeading id="hero-title" level="h1" eyebrow={hero.eyebrow} title={hero.title} intro={hero.intro} />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#journey" size="lg" variant="secondary">
              See the farm journey
            </Button>
            <Button href={orderButton.href} size="lg" icon={<MessengerIcon />}>
              {orderButton.label}
            </Button>
          </div>
        </div>

        {/* 3D test cube until the farm scene arrives in Phase 3 */}
        <div className="h-[34svh] md:h-[60svh]">
          <Suspense fallback={null}>
            <SpinningCube />
          </Suspense>
        </div>
      </div>
    </section>
  )
}

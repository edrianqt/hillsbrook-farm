import { lazy, Suspense } from 'react'
import { sections } from '../content/site'

// The 3D code is loaded separately, so the text appears instantly even on slow connections.
const SpinningCube = lazy(() => import('../three/SpinningCube'))

const hero = sections.find((s) => s.id === 'hero')!

export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="flex min-h-svh items-center bg-emerald-50">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-16 md:grid-cols-2 md:items-center">
        {/* Text */}
        <div>
          <p className="text-sm font-semibold tracking-widest text-emerald-800 uppercase">{hero.eyebrow}</p>
          <h1 id="hero-title" className="mt-3 text-4xl font-bold text-stone-900 sm:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-4 max-w-md text-stone-700">{hero.placeholder}</p>

          {/* Temporary jump links to test section navigation (replaced by the real header in Phase 2) */}
          <nav aria-label="Sections" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {sections
                .filter((s) => s.id !== 'hero')
                .map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="inline-block rounded-full bg-white px-4 py-2 text-sm font-medium text-emerald-900 shadow-sm hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>
        </div>

        {/* 3D test: beside the text on wide screens, below it on phones */}
        <div className="h-[38svh] md:h-[60svh]">
          <Suspense fallback={null}>
            <SpinningCube />
          </Suspense>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { family, ui } from '../content/site'
import { gsap } from '../lib/smoothScroll'
import { prefersReducedMotion } from '../lib/webgl'
import Picture from './Picture'
import SectionHeading from './ui/SectionHeading'

type Member = (typeof family.members)[number]

/** Shows the person's photo, or a warm illustrated placeholder with their initials until a photo is added. */
function Portrait({ member, size }: { member: Member; size: 'large' | 'thumb' }) {
  if (member.photo) {
    return (
      <Picture
        src={member.photo}
        alt={size === 'large' ? member.photoAlt : ''}
        sizes={size === 'large' ? '(min-width: 1024px) 45vw, 100vw' : '64px'}
        className="size-full object-cover"
      />
    )
  }
  return (
    <div
      role={size === 'large' ? 'img' : undefined}
      aria-label={size === 'large' ? `Photo of ${member.name} coming soon` : undefined}
      className="relative flex size-full items-center justify-center overflow-hidden bg-[radial-gradient(120%_90%_at_30%_10%,var(--color-cream),var(--color-pasture-50)_55%,#b9d6cb)]"
    >
      {/* rolling hills */}
      <svg aria-hidden="true" viewBox="0 0 400 500" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full">
        <path d="M0 360 Q100 300 200 340 T400 320 V500 H0Z" fill="#8fbf55" />
        <path d="M0 410 Q120 360 240 400 T400 390 V500 H0Z" fill="#4f8a3a" />
      </svg>
      <span
        aria-hidden="true"
        className={`font-display relative font-semibold text-pasture ${size === 'large' ? 'text-8xl' : 'text-lg'}`}
      >
        {member.initials}
      </span>
      {size === 'large' && (
        <span className="absolute bottom-[12%] left-4 rounded-full bg-milk/90 px-3 py-1 text-xs font-medium text-soil-muted">
          {ui.photoComingSoon}
        </span>
      )}
    </div>
  )
}

/**
 * Meet the Family: a large photo and quote, with round portrait thumbnails that switch the person.
 * The thumbnails are a keyboard-accessible tab list (arrow keys move between people).
 */
export default function Family() {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const photoWrap = useRef<HTMLDivElement>(null)
  const photoInner = useRef<HTMLDivElement>(null)

  // Subtle parallax: the large photo drifts a little slower than the page
  useEffect(() => {
    if (prefersReducedMotion() || !photoWrap.current || !photoInner.current) return
    const tween = gsap.fromTo(
      photoInner.current,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: photoWrap.current, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  const select = (i: number) => {
    const n = family.members.length
    const next = (i + n) % n
    setActive(next)
    tabs.current[next]?.focus()
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') select(active + 1)
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') select(active - 1)
    else if (e.key === 'Home') select(0)
    else if (e.key === 'End') select(family.members.length - 1)
    else return
    e.preventDefault()
  }

  return (
    <section id="family" aria-labelledby="family-title" className="bg-milk">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading id="family-title" eyebrow={family.eyebrow} title={family.title} intro={family.intro} />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* large photo: all people are stacked and cross-fade */}
          <div ref={photoWrap} className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_20px_50px_-24px_rgb(8_58_50/0.45)] sm:aspect-[5/4] lg:aspect-[4/5]">
            <div ref={photoInner} className="absolute -inset-y-[8%] inset-x-0">
              {family.members.map((m, i) => (
                <div
                  key={i}
                  aria-hidden={i !== active}
                  className={`absolute inset-0 transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Portrait member={m} size="large" />
                </div>
              ))}
            </div>
          </div>

          <div>
            {/* quote panels */}
            <div className="grid">
              {family.members.map((m, i) => (
                <div
                  key={i}
                  id={`family-panel-${i}`}
                  role="tabpanel"
                  aria-labelledby={`family-tab-${i}`}
                  hidden={i !== active}
                  tabIndex={0}
                  className="col-start-1 row-start-1 animate-[fade-in_0.6s_ease]"
                >
                  <svg aria-hidden="true" viewBox="0 0 48 36" className="h-9 w-12 text-cream">
                    <path fill="currentColor" d="M0 36V20C0 8 7 1 19 0l2 6c-7 2-10 6-10 12h9v18H0zm27 0V20C27 8 34 1 46 0l2 6c-7 2-10 6-10 12h9v18H27z" />
                  </svg>
                  <blockquote className="font-display mt-4 text-3xl leading-snug font-medium text-pasture sm:text-4xl">
                    “{m.quote}”
                  </blockquote>
                  <p className="mt-6 text-lg font-semibold text-soil">{m.name}</p>
                  <p className="text-lagoon-ink">{m.role}</p>
                  {m.bio && <p className="mt-4 max-w-xl leading-relaxed text-soil-muted">{m.bio}</p>}
                </div>
              ))}
            </div>

            {/* round portrait thumbnails: the tab list */}
            <div role="tablist" aria-label={ui.familyMembers} className="mt-10 flex flex-wrap gap-4" onKeyDown={onKey}>
              {family.members.map((m, i) => (
                <button
                  key={i}
                  ref={(el) => {
                    tabs.current[i] = el
                  }}
                  id={`family-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={i === active}
                  aria-controls={`family-panel-${i}`}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => setActive(i)}
                  className="group flex items-center gap-3 rounded-full pr-4 text-left"
                >
                  <span
                    className={`block size-16 overflow-hidden rounded-full ring-offset-2 ring-offset-milk transition-all duration-300 ${
                      i === active ? 'ring-4 ring-barn' : 'opacity-75 ring-2 ring-pasture/20 group-hover:opacity-100'
                    }`}
                  >
                    <Portrait member={m} size="thumb" />
                  </span>
                  <span className="hidden max-w-36 text-sm leading-tight sm:block">
                    <span className={`block font-semibold ${i === active ? 'text-pasture' : 'text-soil-muted'}`}>
                      {m.name.startsWith('[') ? ui.familyMember : m.name.split(' ')[0]}
                    </span>
                    <span className="block text-xs text-soil-muted">{m.role.startsWith('[') ? ui.roleToAdd : m.role.split(',')[0]}</span>
                  </span>
                  <span className="sr-only sm:hidden">{m.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* the whole family, three generations */}
        <figure className="mx-auto mt-16 max-w-4xl">
          <Picture
            src={family.groupPhoto}
            alt={family.groupPhotoAlt}
            sizes="(min-width: 960px) 896px, 100vw"
            className="w-full rounded-[2rem] object-cover shadow-[0_20px_50px_-24px_rgb(8_58_50/0.45)]"
          />
          <figcaption className="mt-4 text-center text-soil-muted">{family.groupCaption}</figcaption>
        </figure>
      </div>
    </section>
  )
}

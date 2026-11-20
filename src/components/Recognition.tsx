import { recognition } from '../content/site'

/** A quiet strip of the agencies that recognise and support the farm (names only, no logos). */
export default function Recognition() {
  return (
    <section aria-labelledby="recognition-title" className="bg-cream-50 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 id="recognition-title" className="text-center text-sm font-semibold text-lagoon-ink">
          {recognition.title}
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {recognition.items.map((item) => (
            <li key={item.short} className="flex items-start gap-3 rounded-2xl border border-pasture/10 bg-white p-4">
              <span
                aria-hidden="true"
                className="flex h-12 min-w-12 shrink-0 items-center justify-center rounded-full bg-pasture px-2.5 font-display text-xs font-bold text-milk"
              >
                {item.short}
              </span>
              <span className="text-sm leading-snug">
                <span className="block font-semibold text-soil">{item.text}</span>
                <span className="text-soil-muted">{item.org}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

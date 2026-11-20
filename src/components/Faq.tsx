import { faq } from '../content/site'
import SectionHeading from './ui/SectionHeading'

/** Frequently asked questions, as simple open/close rows (works with keyboard and screen readers). */
export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 bg-milk py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading id="faq-title" eyebrow={faq.eyebrow} title={faq.title} intro={faq.intro} />
        <div className="mt-10 divide-y divide-pasture/10 rounded-3xl border border-pasture/10 bg-white">
          {faq.items.map((item) => (
            <details key={item.q} className="group px-6 py-1">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg font-semibold text-pasture [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cream text-xl leading-none transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 leading-relaxed text-soil-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

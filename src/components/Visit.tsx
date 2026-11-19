import { useState, type FormEvent } from 'react'
import { contactForm, farm, links, visit } from '../content/site'
import Button from './ui/Button'
import { FacebookIcon, MailIcon, MessengerIcon, PhoneIcon, PinIcon } from './ui/icons'
import SectionHeading from './ui/SectionHeading'

const phoneDigits = farm.phone.replace(/[^\d+]/g, '')
const phoneMissing = farm.phone.includes('PLACEHOLDER')

/** A drawn map shown until the visitor taps to load Google Maps (saves data and keeps Google off the page until asked). */
function MapPreview() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 size-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="#bfe3ee" />
      <path d="M70 60c40-30 120-40 170-20s110 30 120 80-20 110-70 130-120 20-160-10S20 180 30 130s0-40 40-70z" fill="#cde3b0" />
      <path d="M120 90c30-20 90-20 120 0s60 50 40 90-80 60-120 40-80-40-70-80 0-30 30-50z" fill="#9cc77a" />
      <path d="M150 170q40-30 90-10" stroke="#a98a62" strokeWidth="4" fill="none" strokeDasharray="6 6" />
      {[
        [300, 70, 10],
        [330, 230, 14],
        [60, 240, 9],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#3d7a37" />
      ))}
      <g transform="translate(200 128)">
        <path d="M0 0c-14-18-20-26-20-36a20 20 0 0 1 40 0c0 10-6 18-20 36z" fill="#b0492b" />
        <circle cx="0" cy="-36" r="7" fill="#fbf8f1" />
      </g>
    </svg>
  )
}

function MapBox() {
  const [loaded, setLoaded] = useState(false)
  const src = `https://www.google.com/maps?q=${encodeURIComponent(visit.map.query)}&z=13&output=embed`
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[0_20px_50px_-24px_rgb(8_58_50/0.45)] lg:aspect-auto lg:h-full lg:min-h-96">
      {loaded ? (
        <iframe
          title={`Map showing ${farm.name}, ${farm.address.line2}`}
          src={src}
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <>
          <MapPreview />
          <div className="absolute inset-0 flex flex-col items-center justify-end gap-3 bg-gradient-to-t from-pasture-deep/50 to-transparent p-6">
            <Button onClick={() => setLoaded(true)} variant="light" size="lg" icon={<PinIcon />}>
              Show the map
            </Button>
            <p className="text-center text-sm text-milk">Loads Google Maps</p>
          </div>
        </>
      )}
    </div>
  )
}

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'opened-email'

/**
 * Contact form. With no form service set yet (contactForm.endpoint is empty), "Send" opens the
 * visitor's email app with the message ready to send to the farm's email address.
 */
function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    if (data.get('company')) return // spam trap: real people never fill this hidden box
    const name = String(data.get('name') ?? '')
    const contact = String(data.get('contact') ?? '')
    const topic = String(data.get('topic') ?? '')
    const message = String(data.get('message') ?? '')

    if (!contactForm.endpoint) {
      const subject = `${topic} – message from ${name}`
      const body = `${message}\n\nFrom: ${name}\nReply to: ${contact}`
      window.location.href = `mailto:${contactForm.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setStatus('opened-email')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(contactForm.endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, topic, message, _subject: `${topic} – ${name}` }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  const field = 'mt-1 block w-full rounded-xl border border-pasture/20 bg-white px-4 py-3 text-base text-soil placeholder:text-soil-muted/70 focus:border-lagoon-ink focus:outline-3 focus:outline-offset-2 focus:outline-lagoon-ink'

  return (
    <form onSubmit={onSubmit} className="rounded-[2rem] bg-white p-6 shadow-[0_1px_2px_rgb(43_36_32/0.06),0_8px_24px_-12px_rgb(12_82_71/0.18)] sm:p-8" noValidate={false}>
      <h3 className="text-2xl font-semibold text-pasture">Send us a message</h3>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-soil">Your name</span>
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-soil">Email or mobile number</span>
          <input name="contact" required autoComplete="email" className={field} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-soil">What is it about?</span>
          <select name="topic" className={field} defaultValue={contactForm.topics[0]}>
            {contactForm.topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-soil">Message</span>
          <textarea name="message" required rows={4} className={field} />
        </label>
        {/* hidden from people; catches spam robots */}
        <label className="hidden" aria-hidden="true">
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex min-h-13 items-center justify-center rounded-full bg-barn px-7 font-semibold text-white shadow-sm transition-colors hover:bg-barn-dark disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p role="status" className="text-sm text-soil-muted">
          {status === 'sent' && 'Thank you! Your message has been sent.'}
          {status === 'error' && 'Sorry, that did not send. Please message us on Messenger instead.'}
          {status === 'opened-email' && 'Your email app should open with the message ready. Just press send.'}
        </p>
      </div>
    </form>
  )
}

/** Visit & Contact: how to reach us, a lazy-loaded map, and a contact form. */
export default function Visit() {
  const row = 'flex gap-3'
  const icon = 'mt-0.5 size-5 shrink-0 text-lagoon-ink'
  return (
    <section id="visit" aria-labelledby="visit-title" className="bg-milk">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading id="visit-title" eyebrow={visit.eyebrow} title={visit.title} intro={visit.intro} />

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {/* left: details */}
          <div>
            <address className="space-y-4 text-lg not-italic">
              <p className={row}>
                <PinIcon className={icon} />
                <span>
                  {farm.address.line1}
                  <br />
                  {farm.address.line2}
                </span>
              </p>
              <p className={row}>
                <PhoneIcon className={icon} />
                {phoneMissing ? <span className="text-soil-muted italic">{farm.phone}</span> : <a href={`tel:${phoneDigits}`} className="-my-2.5 inline-flex min-h-11 items-center underline-offset-4 hover:underline">{farm.phone}</a>}
              </p>
              <p className={row}>
                <MailIcon className={icon} />
                <a href={`mailto:${farm.email}`} className="-my-2.5 inline-flex min-h-11 items-center break-all underline-offset-4 hover:underline">
                  {farm.email}
                </a>
              </p>
            </address>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-sans text-sm font-semibold text-lagoon-ink">Delivery</h3>
                <p className="mt-1 font-semibold text-soil">{visit.deliveryDay}</p>
                <ul className="mt-1 space-y-1 text-soil-muted">
                  {visit.deliveryPoints.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-sans text-sm font-semibold text-lagoon-ink">Farm visits</h3>
                <p className="mt-1 font-semibold text-soil">{visit.visits}</p>
                <p className="mt-1 text-soil-muted">Hours: {farm.visitingHours}</p>
              </div>
            </div>
            <p className="mt-6 rounded-2xl bg-cream-50 p-4 leading-relaxed text-soil-muted">{visit.groups}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={links.messenger} icon={<MessengerIcon className="size-4" />}>
                Message us
              </Button>
              {!phoneMissing && (
                <Button href={`tel:${phoneDigits}`} variant="secondary" icon={<PhoneIcon className="size-4" />}>
                  Call us
                </Button>
              )}
              <Button href={links.facebook} variant="secondary" icon={<FacebookIcon className="size-4" />}>
                Facebook
              </Button>
            </div>

            <div className="mt-10">
              <h3 className="text-2xl font-semibold text-pasture">How to get here</h3>
              <ul className="mt-3 space-y-2 text-soil-muted">
                {visit.howToGetHere.map((step) => (
                  <li key={step} className="flex gap-2">
                    <span aria-hidden="true" className="text-lagoon">
                      ●
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
              <a href={visit.map.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-1 font-semibold text-lagoon-ink hover:underline">
                Open in Google Maps <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>

          {/* right: map */}
          <MapBox />
        </div>

        <div className="mt-12">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}

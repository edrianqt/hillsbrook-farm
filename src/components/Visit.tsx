import { useState, type FormEvent } from 'react'
import { contactForm, farm, links, visit, ui } from '../content/site'
import Button from './ui/Button'
import Picture from './Picture'
import { FacebookIcon, MailIcon, MessengerIcon, PhoneIcon, PinIcon } from './ui/icons'
import SectionHeading from './ui/SectionHeading'

const phoneDigits = farm.phone.replace(/[^\d+]/g, '')
const phoneMissing = farm.phone.includes('PLACEHOLDER')

/** The farm gate, shown until the visitor taps to load Google Maps (saves data and keeps Google off the page until asked). */
function MapPreview() {
  return (
    <Picture
      src="images/farm/gate.jpg"
      alt={ui.gateAlt}
      sizes="(min-width: 1024px) 50vw, 100vw"
      className="absolute inset-0 size-full object-cover"
    />
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
              {ui.showMap}
            </Button>
            <p className="text-center text-sm text-milk">{ui.loadsMaps}</p>
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
      <h3 className="text-2xl font-semibold text-pasture">{ui.formTitle}</h3>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-soil">{ui.formName}</span>
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-soil">{ui.formContact}</span>
          <input name="contact" required autoComplete="email" className={field} />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-soil">{ui.formTopic}</span>
          <select name="topic" className={field} defaultValue={contactForm.topics[0]}>
            {contactForm.topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-soil">{ui.formMessage}</span>
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
          {status === 'sending' ? ui.formSending : ui.formSend}
        </button>
        <p role="status" className="text-sm text-soil-muted">
          {status === 'sent' && ui.formSent}
          {status === 'error' && ui.formError}
          {status === 'opened-email' && ui.formOpenedEmail}
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
                <h3 className="font-sans text-sm font-semibold text-lagoon-ink">{ui.delivery}</h3>
                <p className="mt-1 font-semibold text-soil">{visit.deliveryDay}</p>
                <ul className="mt-1 space-y-1 text-soil-muted">
                  {visit.deliveryPoints.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-sans text-sm font-semibold text-lagoon-ink">{ui.farmVisits}</h3>
                <p className="mt-1 font-semibold text-soil">{visit.visits}</p>
                <p className="mt-1 text-soil-muted">{ui.hours}: {farm.visitingHours}</p>
              </div>
            </div>
            <p className="mt-6 rounded-2xl bg-cream-50 p-4 leading-relaxed text-soil-muted">{visit.groups}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={links.messenger} icon={<MessengerIcon className="size-4" />}>
                {ui.messageUs}
              </Button>
              {!phoneMissing && (
                <Button href={`tel:${phoneDigits}`} variant="secondary" icon={<PhoneIcon className="size-4" />}>
                  {ui.callUs}
                </Button>
              )}
              <Button href={links.facebook} variant="secondary" icon={<FacebookIcon className="size-4" />}>
                {ui.facebook}
              </Button>
            </div>

            <div className="mt-10">
              <h3 className="text-2xl font-semibold text-pasture">{ui.howToGetHere}</h3>
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
                {ui.openInMaps} <span aria-hidden="true">↗</span>
                <span className="sr-only">{ui.newTab}</span>
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

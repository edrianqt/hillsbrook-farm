import { useMemo, useState } from 'react'
import { deliveryPoints, type DeliveryPointId, farm, links, orderForm as t, type Product, products } from '../content/site'
import { useLanguage } from '../content/i18n'
import Button from './ui/Button'
import { MailIcon, MessengerIcon, PhoneIcon } from './ui/icons'

const peso = (n: number) => `₱${n.toLocaleString('en-PH')}`

/** The coming Saturday in the Philippines (or next week's, if today is already Saturday). */
function nextSaturday(locale: string) {
  const manila = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }))
  const days = (6 - manila.getDay() + 7) % 7 || 7
  manila.setDate(manila.getDate() + days)
  return manila.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })
}

/** Price of one bottle for this quantity: wholesale from 10 bottles where offered. */
function unitPrice(product: Product, point: DeliveryPointId, qty: number) {
  const p = product.prices[point]
  if (!product.litres || (!p.retail && !p.wholesale)) return null
  const useWholesale = !!p.wholesale && (qty >= 10 || !p.retail)
  const perLitre = useWholesale ? p.wholesale! : p.retail!
  return { price: perLitre * product.litres, wholesale: useWholesale && !!p.retail }
}

function Stepper({ product, qty, onChange }: { product: Product; qty: number; onChange: (n: number) => void }) {
  const label = `${product.name}, ${product.container}, ${product.size}`
  return (
    <div className="flex items-center gap-2" role="group" aria-label={`${t.quantity}: ${label}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(0, qty - 1))}
        disabled={qty === 0}
        className="flex size-11 items-center justify-center rounded-full border border-pasture/20 text-xl font-semibold text-pasture disabled:opacity-40"
        aria-label={`${t.less}: ${label}`}
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={200}
        value={qty}
        onChange={(e) => onChange(Math.max(0, Math.min(200, Math.floor(Number(e.target.value) || 0))))}
        className="h-11 w-14 rounded-xl border border-pasture/20 bg-white text-center text-lg font-semibold"
        aria-label={`${t.quantity}: ${label}`}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(200, qty + 1))}
        className="flex size-11 items-center justify-center rounded-full bg-pasture text-xl font-semibold text-milk"
        aria-label={`${t.more}: ${label}`}
      >
        +
      </button>
    </div>
  )
}

/**
 * "Order for Saturday": choose products and quantities, and the order is written up as one tidy
 * message to send on Messenger (copied for pasting), by text message or by email. No server needed.
 */
export default function OrderForm({ point, onPointChange }: { point: DeliveryPointId; onPointChange: (p: DeliveryPointId) => void }) {
  const [qty, setQty] = useState<Record<string, number>>({})
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [spot, setSpot] = useState('')
  const [notes, setNotes] = useState('')
  const [copied, setCopied] = useState(false)
  const lang = useLanguage()
  const date = useMemo(() => nextSaturday(lang === 'en' ? 'en-PH' : 'fil-PH'), [lang])
  const place = deliveryPoints.find((d) => d.id === point)!.label

  const lines = products.items
    .filter((p) => (qty[p.id] ?? 0) > 0)
    .map((p) => {
      const n = qty[p.id]
      const u = unitPrice(p, point, n)
      return { product: p, n, sub: u ? u.price * n : null, wholesale: u?.wholesale ?? false }
    })
  const known = lines.filter((l) => l.sub !== null)
  const total = known.reduce((sum, l) => sum + (l.sub ?? 0), 0)
  const anyUnknown = lines.some((l) => l.sub === null)

  const message = [
    t.greeting.replace('{date}', date),
    ...lines.map(
      (l) =>
        `• ${l.n} × ${l.product.name} (${l.product.container}, ${l.product.size})` +
        (l.sub !== null ? ` = ${peso(l.sub)}${l.wholesale ? ` (${t.wholesaleApplied})` : ''}` : ` (${t.toConfirm})`),
    ),
    known.length ? `${t.total}: ${peso(total)}${anyUnknown ? ` + ${t.toConfirm}` : ''}` : '',
    `${t.dropOff}: ${place}${spot ? `, ${spot}` : ''}`,
    name && `${t.nameLabel}: ${name}`,
    phone && `${t.phoneLabel}: ${phone}`,
    notes && `${t.notesLabel}: ${notes}`,
    t.thanks,
  ]
    .filter(Boolean)
    .join('\n')

  const ready = lines.length > 0
  const phoneDigits = farm.phone.replace(/[^\d+]/g, '')

  const copyAndOpen = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
    } catch {
      setCopied(false)
    }
    window.open(`${links.messenger}?text=${encodeURIComponent(message)}`, '_blank', 'noopener')
  }

  const field = 'mt-1 h-12 w-full rounded-xl border border-pasture/20 bg-white px-4 text-base'

  return (
    <section aria-labelledby="order-title" className="mt-12 rounded-3xl border border-pasture/10 bg-white p-6 sm:p-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 id="order-title" className="text-3xl font-semibold text-pasture">
            {t.title}
          </h3>
          <p className="mt-2 max-w-2xl leading-relaxed text-soil-muted">{t.intro}</p>
        </div>
        <p className="shrink-0 rounded-2xl bg-cream-50 px-4 py-3 text-sm">
          <span className="font-semibold text-soil">
            {t.deliveryFor} {date}
          </span>
          {t.cutoff && (
            <span className="block text-soil-muted">
              {t.orderBy} {t.cutoff}
            </span>
          )}
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <ul className="divide-y divide-pasture/10">
            {products.items.map((p) => {
              const n = qty[p.id] ?? 0
              const u = unitPrice(p, point, Math.max(1, n))
              return (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <span>
                    <span className="block font-semibold text-soil">{p.name}</span>
                    <span className="text-sm text-soil-muted">
                      {p.container} · {p.size} · {u ? `${peso(u.price)}${u.wholesale ? ` (${t.wholesaleApplied})` : ''}` : t.toConfirm}
                    </span>
                  </span>
                  <Stepper product={p} qty={n} onChange={(v) => setQty((q) => ({ ...q, [p.id]: v }))} />
                </li>
              )
            })}
          </ul>

          <fieldset className="mt-6">
            <legend className="font-semibold text-soil">{t.dropOff}</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              {deliveryPoints.map((d) => (
                <label
                  key={d.id}
                  className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 outline-offset-2 has-focus-visible:outline-3 has-focus-visible:outline-lagoon-ink ${point === d.id ? 'border-pasture bg-pasture text-milk' : 'border-pasture/20 text-pasture'}`}
                >
                  <input type="radio" name="order-point" value={d.id} checked={point === d.id} onChange={() => onPointChange(d.id)} className="sr-only" />
                  <span className="font-semibold">{d.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-soil">
              {t.name}
              <input className={field} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </label>
            <label className="block text-sm font-semibold text-soil">
              {t.phone}
              <input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" autoComplete="tel" inputMode="tel" />
            </label>
            <label className="block text-sm font-semibold text-soil sm:col-span-2">
              {t.spot}
              <input className={field} value={spot} onChange={(e) => setSpot(e.target.value)} placeholder={t.spotHint} />
            </label>
            <label className="block text-sm font-semibold text-soil sm:col-span-2">
              {t.notes}
              <textarea className={`${field} h-20 py-3`} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
          </div>
        </div>

        {/* the message that will be sent */}
        <div className="rounded-3xl bg-cream-50 p-6">
          <h4 className="font-semibold text-pasture">{t.summary}</h4>
          {ready ? (
            <>
              <pre className="mt-3 font-sans text-sm leading-relaxed whitespace-pre-wrap text-soil">{message}</pre>
              <p className="mt-3 text-sm text-soil-muted">{t.totalNote}</p>
            </>
          ) : (
            <p className="mt-3 text-soil-muted">{t.empty}</p>
          )}
          <div className="mt-6 flex flex-col gap-3">
            <Button onClick={copyAndOpen} disabled={!ready} icon={<MessengerIcon className="size-4" />}>
              {t.sendMessenger}
            </Button>
            <p className="min-h-5 text-sm font-semibold text-pasture" aria-live="polite">
              {copied ? t.copied : ''}
            </p>
            {!farm.phone.includes('PLACEHOLDER') && (
              <Button
                href={ready ? `sms:${phoneDigits}?&body=${encodeURIComponent(message)}` : undefined}
                disabled={!ready}
                variant="secondary"
                icon={<PhoneIcon className="size-4" />}
              >
                {t.sendText}
              </Button>
            )}
            <Button
              href={ready ? `mailto:${farm.email}?subject=${encodeURIComponent(`${t.title}: ${date}`)}&body=${encodeURIComponent(message)}` : undefined}
              disabled={!ready}
              variant="secondary"
              icon={<MailIcon className="size-4" />}
            >
              {t.sendEmail}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

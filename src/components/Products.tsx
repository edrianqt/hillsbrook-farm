import { lazy, Suspense, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { deliveryPoints, type DeliveryPointId, farm, links, type Product, products } from '../content/site'
import { hasWebGL, prefersReducedMotion } from '../lib/webgl'
import { asset } from './Logo'
import ProductArt from './ProductArt'
import Button from './ui/Button'
import Card from './ui/Card'
import { MessengerIcon } from './ui/icons'
import SectionHeading from './ui/SectionHeading'

const BottleShowcase = lazy(() => import('../three/BottleShowcase'))

const peso = (n: number) => `₱${n.toLocaleString('en-PH')}`

/** Messenger link with the message already typed in. */
function orderLink(product: Product, place: string) {
  const text = products.orderMessage
    .replace('{product}', `${product.name} (${product.container}, ${product.size})`)
    .replace('{place}', place)
  return `${links.messenger}?text=${encodeURIComponent(text)}`
}

function Picture({ product }: { product: Product }) {
  if (product.photo) {
    return (
      <img
        src={asset(product.photo)}
        alt={`${product.name}, ${product.container}, ${product.size}`}
        loading="lazy"
        decoding="async"
        className="size-full object-cover"
      />
    )
  }
  return <ProductArt kind={product.art} raw={product.id.startsWith('raw')} />
}

function Prices({ product, point }: { product: Product; point: DeliveryPointId }) {
  const p = product.prices[point]
  return (
    <dl className="mt-4 grid gap-2">
      {p.retail ? (
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-soil-muted">Retail</dt>
          <dd className="text-right whitespace-nowrap">
            <span className="font-display text-2xl font-semibold text-pasture">{peso(p.retail)}</span>
            <span className="text-sm text-soil-muted"> / litre</span>
          </dd>
        </div>
      ) : null}
      {p.wholesale ? (
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-soil-muted">
            Wholesale
            {product.wholesaleNote && <span className="block text-xs">{product.wholesaleNote}</span>}
          </dt>
          <dd className="text-right whitespace-nowrap">
            <span className="font-display text-2xl font-semibold text-pasture">{peso(p.wholesale)}</span>
            <span className="text-sm text-soil-muted"> / litre</span>
          </dd>
        </div>
      ) : null}
    </dl>
  )
}

/** Dapa Port / General Luna switch. Works with arrow keys like a radio group. */
function PlaceToggle({ value, onChange }: { value: DeliveryPointId; onChange: (v: DeliveryPointId) => void }) {
  const onKey = (e: KeyboardEvent) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return
    e.preventDefault()
    const i = deliveryPoints.findIndex((d) => d.id === value)
    const next = deliveryPoints[(i + 1) % deliveryPoints.length]
    onChange(next.id)
    document.getElementById(`place-${next.id}`)?.focus()
  }
  return (
    <div>
      <p id="place-label" className="text-sm font-semibold text-soil">
        Delivery to
      </p>
      <div role="radiogroup" aria-labelledby="place-label" onKeyDown={onKey} className="mt-2 inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-pasture/15">
        {deliveryPoints.map((d) => (
          <button
            key={d.id}
            id={`place-${d.id}`}
            type="button"
            role="radio"
            aria-checked={value === d.id}
            tabIndex={value === d.id ? 0 : -1}
            onClick={() => onChange(d.id)}
            className={`min-h-11 rounded-full px-5 text-sm font-semibold transition-colors ${
              value === d.id ? 'bg-pasture text-milk' : 'text-pasture hover:bg-pasture-50'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm text-soil-muted">{deliveryPoints.find((d) => d.id === value)?.note}</p>
    </div>
  )
}

function FeaturedProduct({ product, point, place }: { product: Product; point: DeliveryPointId; place: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [use3D] = useState(() => hasWebGL())
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!box.current) return
    const a = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '50% 0px' })
    const b = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    a.observe(box.current)
    b.observe(box.current)
    return () => {
      a.disconnect()
      b.disconnect()
    }
  }, [])

  return (
    <Card as="article" tone="milk" className="grid gap-6 overflow-hidden md:grid-cols-[1fr_1.2fr] md:items-center lg:col-span-2">
      <div ref={box} className="relative mx-auto aspect-square w-full max-w-xs rounded-3xl bg-[radial-gradient(circle_at_50%_40%,var(--color-cream-50),var(--color-pasture-50))]">
        {use3D && near && !product.photo ? (
          <Suspense fallback={<Picture product={product} />}>
            <BottleShowcase active={visible} spin={!prefersReducedMotion()} />
          </Suspense>
        ) : (
          <Picture product={product} />
        )}
      </div>
      <div>
        <p className="inline-block rounded-full bg-cream px-3 py-1 text-xs font-semibold text-pasture">Our favourite</p>
        <h3 className="mt-3 text-3xl font-semibold text-pasture">{product.name}</h3>
        <p className="text-soil-muted">
          {product.container} · {product.size}
        </p>
        <p className="mt-3 leading-relaxed text-soil-muted">{product.description}</p>
        <Prices product={product} point={point} />
        <Button href={orderLink(product, place)} className="mt-6 w-full sm:w-auto" icon={<MessengerIcon className="size-4" />}>
          {products.orderLabel}
        </Button>
      </div>
    </Card>
  )
}

/** "From our farm to your fridge": products with prices that switch by delivery point. */
export default function Products() {
  const [point, setPoint] = useState<DeliveryPointId>('dapa')
  const place = deliveryPoints.find((d) => d.id === point)!.label
  const featured = products.items.find((p) => p.featured) ?? products.items[0]
  const others = products.items.filter((p) => p !== featured)

  return (
    <section id="products" aria-labelledby="products-title" className="bg-milk">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="products-title" eyebrow={products.eyebrow} title={products.title} intro={products.intro} />
          <PlaceToggle value={point} onChange={setPoint} />
        </div>
        <p className="sr-only" aria-live="polite">
          Showing prices for delivery to {place}.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <FeaturedProduct product={featured} point={point} place={place} />

          {others.map((product) => (
            <Card as="article" key={product.id} className="flex flex-col">
              <div className="mx-auto aspect-square w-40 overflow-hidden rounded-2xl">
                <Picture product={product} />
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-pasture">{product.name}</h3>
              <p className="text-soil-muted">
                {product.container} · {product.size}
              </p>
              <p className="mt-3 flex-1 leading-relaxed text-soil-muted">{product.description}</p>
              <Prices product={product} point={point} />
              <Button href={orderLink(product, place)} variant="secondary" className="mt-6" icon={<MessengerIcon className="size-4" />}>
                {products.orderLabel}
              </Button>
            </Card>
          ))}

          {/* value-added products on the way */}
          <Card as="article" tone="cream" className="flex flex-col border-dashed">
            <p className="inline-block self-start rounded-full bg-white px-3 py-1 text-xs font-semibold text-barn-dark">Coming soon</p>
            <h3 className="mt-4 text-2xl font-semibold text-pasture">{products.comingSoon.title}</h3>
            <p className="mt-3 flex-1 leading-relaxed text-soil-muted">{products.comingSoon.text}</p>
            <Button
              href={`${links.messenger}?text=${encodeURIComponent(products.comingSoon.message)}`}
              variant="ghost"
              className="mt-6 self-start !px-0"
              icon={<MessengerIcon className="size-4" />}
            >
              {products.comingSoon.cta}
            </Button>
          </Card>
        </div>

        <p className="mt-8 text-sm text-soil-muted">
          Prices per litre, updated {products.pricesUpdated}. {farm.deliveryNote}.
        </p>
      </div>
    </section>
  )
}

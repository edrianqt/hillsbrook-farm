import sizes from '../content/image-sizes.json'
import { asset } from './Logo'

type Entry = { width: number; height: number; base: string; widths: number[] }
const manifest = sizes as Record<string, Entry>

/** "a.avif 480w, a.avif 800w …" for one format. */
export function srcSet(src: string, format: 'avif' | 'webp') {
  const e = manifest[src]
  if (!e) return undefined
  return e.widths.map((w) => `${asset(`${e.base}-${w}.${format}`)} ${w}w`).join(', ')
}

export const imageSize = (src: string) => manifest[src]

type Props = {
  src: string
  alt: string
  /** How wide the picture shows on screen, so the browser can pick the right file, e.g. "(min-width: 768px) 33vw, 100vw" */
  sizes: string
  className?: string
  /** "eager" only for the first picture people see; everything else waits until scrolled near */
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
}

/**
 * A photo served as AVIF or WebP in the right size for the screen, with the original JPG as a fallback.
 * Width and height are set from the real picture, so the page does not jump while it loads.
 * Sizes come from `npm run images` (see scripts/optimize-images.mjs).
 */
export default function Picture({ src, alt, sizes: sizesAttr, className, loading = 'lazy', fetchPriority }: Props) {
  const e = manifest[src]
  return (
    <picture>
      {e && <source type="image/avif" srcSet={srcSet(src, 'avif')} sizes={sizesAttr} />}
      {e && <source type="image/webp" srcSet={srcSet(src, 'webp')} sizes={sizesAttr} />}
      <img
        src={asset(src)}
        alt={alt}
        width={e?.width}
        height={e?.height}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={className}
      />
    </picture>
  )
}

import { farm } from '../content/site'

/** Path that works both at the site root and inside a sub-folder preview. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

type Props = {
  /** size of the round badge in pixels */
  size?: number
  /** show the "Hillsbrook Farm" wordmark next to the badge */
  withWordmark?: boolean
  tone?: 'light' | 'dark'
}

/** The round Island Pure badge, optionally paired with the Hillsbrook Farm wordmark. */
export default function Logo({ size = 52, withWordmark = true, tone = 'light' }: Props) {
  return (
    <span className="inline-flex items-center gap-3">
      <img
        src={asset('images/logo-256.webp')}
        srcSet={`${asset('images/logo-96.webp')} 96w, ${asset('images/logo-144.webp')} 144w, ${asset('images/logo-256.webp')} 256w`}
        sizes={`${size}px`}
        width={size}
        height={size}
        alt={withWordmark ? '' : `${farm.brand} logo`}
        className="shrink-0 rounded-full bg-white shadow-sm"
        style={{ width: size, height: size }}
      />
      {withWordmark && (
        <span className="leading-none whitespace-nowrap">
          <span className={`font-display block text-xl font-semibold sm:text-2xl ${tone === 'dark' ? 'text-milk' : 'text-pasture'}`}>
            {farm.name}
          </span>
          <span className={`mt-1 block text-xs font-medium ${tone === 'dark' ? 'text-mist' : 'text-soil-muted'}`}>
            {farm.brand}
          </span>
        </span>
      )}
    </span>
  )
}

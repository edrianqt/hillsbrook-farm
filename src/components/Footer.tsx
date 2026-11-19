import { farm } from '../content/site'

/** Simple footer for now; the full design comes in Phase 2. */
export default function Footer() {
  return (
    <footer id="footer" className="bg-emerald-950 text-emerald-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-xl font-bold">{farm.name}</p>
        <p className="mt-1 text-emerald-200">
          {farm.brand} · {farm.tagline}
        </p>
        <p className="mt-4 text-sm text-emerald-200">{farm.address}</p>
        <p className="mt-1 text-sm">
          <a className="underline underline-offset-4 hover:text-white" href={`mailto:${farm.email}`}>
            {farm.email}
          </a>
        </p>
        <p className="mt-8 text-xs text-emerald-300">
          © {new Date().getFullYear()} {farm.name}. Est. {farm.founded}.
        </p>
      </div>
    </footer>
  )
}

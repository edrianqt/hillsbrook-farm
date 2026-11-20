import { ui } from '../content/site'
import { LANGUAGES, type Lang, setLanguage, useLanguage } from '../content/i18n'

/** English / Bisaya / Filipino. A plain dropdown: small on phones and easy for screen readers. */
export default function LanguagePicker({ className = '' }: { className?: string }) {
  const lang = useLanguage()
  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <span className="sr-only">{ui.language}</span>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute left-3 size-4 text-pasture" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
      </svg>
      <select
        value={lang}
        onChange={(e) => setLanguage(e.target.value as Lang)}
        className="h-11 cursor-pointer appearance-none rounded-full border border-pasture/20 bg-milk pr-4 pl-9 text-sm font-semibold text-pasture hover:bg-pasture-50"
      >
        {LANGUAGES.map((l) => (
          <option key={l.id} value={l.id}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  )
}

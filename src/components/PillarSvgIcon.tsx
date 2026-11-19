import type { PillarIcon } from '../content/site'

/** Flat drawn versions of the pillar icons, used when 3D is not available. */
export default function PillarSvgIcon({ kind }: { kind: PillarIcon }) {
  const common = { viewBox: '0 0 96 96', className: 'size-full', 'aria-hidden': true as const }
  switch (kind) {
    case 'bottle':
      return (
        <svg {...common}>
          <rect x="38" y="10" width="20" height="9" rx="2" fill="#0c5247" />
          <path d="M40 19h16v8l8 10v46a5 5 0 0 1-5 5H37a5 5 0 0 1-5-5V37l8-10z" fill="#fbfaf5" stroke="#0c5247" strokeWidth="3" />
          <rect x="32" y="48" width="32" height="18" fill="#0c5247" />
          <path d="M38 61q10-4 20 0" stroke="#0887b0" strokeWidth="3" fill="none" />
        </svg>
      )
    case 'cow':
      return (
        <svg {...common}>
          <rect x="18" y="34" width="52" height="28" rx="6" fill="#f5f2ea" stroke="#1f1c1b" strokeWidth="3" />
          <path d="M30 34h14v14H30zM52 46h12v12H52z" fill="#1f1c1b" />
          <rect x="66" y="26" width="18" height="18" rx="4" fill="#1f1c1b" />
          <rect x="76" y="36" width="10" height="10" rx="3" fill="#e7a59b" />
          {[24, 34, 54, 64].map((x) => (
            <rect key={x} x={x} y="62" width="6" height="16" fill="#1f1c1b" />
          ))}
        </svg>
      )
    case 'house':
      return (
        <svg {...common}>
          <path d="M14 46 48 18l34 28" fill="#b0492b" />
          <rect x="22" y="44" width="52" height="36" fill="#f1ede2" stroke="#0c5247" strokeWidth="3" />
          <rect x="42" y="56" width="12" height="24" fill="#0c5247" />
          <rect x="58" y="52" width="10" height="10" fill="#8fd0e6" />
        </svg>
      )
    case 'leaf':
      return (
        <svg {...common}>
          <path d="M48 10C70 30 66 56 48 66 30 56 26 30 48 10z" fill="#4f8a3a" />
          <path d="M48 18v46" stroke="#8fbf55" strokeWidth="3" />
          <path d="M10 80q10-8 19 0t19 0 19 0 19 0" stroke="#0887b0" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
      )
  }
}

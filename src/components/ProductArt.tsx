/** Simple drawn product pictures, used until real product photos are added in site.ts. */
export default function ProductArt({ kind, raw = false }: { kind: 'pet' | 'hdpe' | 'jug'; raw?: boolean }) {
  const cap = kind === 'hdpe' ? '#0887b0' : raw ? '#b0492b' : '#0c5247'
  return (
    <svg viewBox="0 0 160 160" className="size-full" aria-hidden="true">
      <ellipse cx="80" cy="146" rx={kind === 'jug' ? 46 : 30} ry="6" fill="#0c5247" opacity="0.1" />
      {kind === 'jug' ? (
        <g>
          <path d="M44 52h72v86a8 8 0 0 1-8 8H52a8 8 0 0 1-8-8z" fill="#fbfaf5" stroke="#0c5247" strokeWidth="3" />
          <path d="M100 52V36a8 8 0 0 0-8-8H78" fill="none" stroke="#0c5247" strokeWidth="6" strokeLinecap="round" />
          <rect x="58" y="34" width="18" height="18" rx="3" fill="#fbfaf5" stroke="#0c5247" strokeWidth="3" />
          <rect x="56" y="26" width="22" height="10" rx="3" fill={cap} />
          <rect x="44" y="86" width="72" height="34" fill="#0c5247" />
          <text x="80" y="106" textAnchor="middle" fill="#fbf8f1" fontFamily="Fraunces Variable, Georgia, serif" fontWeight="700" fontSize="12" textLength="62" lengthAdjust="spacingAndGlyphs">Island Pure</text>
          <path d="M60 113q20-5 40 0" stroke="#0887b0" strokeWidth="3" fill="none" />
          <text x="80" y="76" textAnchor="middle" fill="#0c5247" fontFamily="Inter Variable, sans-serif" fontWeight="600" fontSize="11">10 L</text>
        </g>
      ) : (
        <g>
          <rect x="68" y="14" width="24" height="12" rx="3" fill={cap} />
          <path
            d={kind === 'hdpe' ? 'M68 26h24v10l14 14v86a8 8 0 0 1-8 8H62a8 8 0 0 1-8-8V50l14-14z' : 'M70 26h20v12l12 14v84a8 8 0 0 1-8 8H66a8 8 0 0 1-8-8V52l12-14z'}
            fill={kind === 'pet' ? '#ffffff' : '#fbfaf5'}
            stroke="#0c5247"
            strokeWidth="3"
          />
          {kind === 'pet' && <path d="M60 64h40v74a6 6 0 0 1-6 6H66a6 6 0 0 1-6-6z" fill="#fbfaf5" />}
          <rect x={kind === 'hdpe' ? 54 : 58} y="84" width={kind === 'hdpe' ? 52 : 44} height="34" fill="#0c5247" />
          <text x="80" y="104" textAnchor="middle" fill="#fbf8f1" fontFamily="Fraunces Variable, Georgia, serif" fontWeight="700" fontSize="9" textLength={kind === 'hdpe' ? 44 : 38} lengthAdjust="spacingAndGlyphs">Island Pure</text>
          <path d="M66 111q14-4 28 0" stroke="#0887b0" strokeWidth="3" fill="none" />
          {raw && (
            <text x="80" y="132" textAnchor="middle" fill="#b0492b" fontFamily="Inter Variable, sans-serif" fontWeight="700" fontSize="9">RAW</text>
          )}
        </g>
      )}
    </svg>
  )
}

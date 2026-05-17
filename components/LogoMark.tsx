export default function LogoMark({
  size = 100,
  style,
  className,
}: {
  size?: number
  style?: React.CSSProperties
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ color: 'var(--primary)', display: 'block', ...style }}
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="48.5" fill="none" stroke="var(--accent)" strokeWidth="0.6" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="var(--accent)" strokeWidth="1.4" />
      <circle cx="50" cy="50" r="42.5" fill="currentColor" />
      <g
        fill="none"
        stroke="#F5EDE8"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0,-4)"
      >
        <path d="M54 32 Q60 33 62 39 Q63 46 61 51 Q65 53 65 58 Q65 64 61 68 L61 74 L70 78" />
        <path d="M50 33 Q41 38 39 50 Q38 62 41 72 Q42 78 40 84" />
        <path d="M44 35 Q36 44 34 56 Q33 68 36 76" />
        <path d="M56 33 Q51 42 50 54 Q49 66 52 76" />
        <path d="M48 34 Q43 46 44 60 Q45 72 48 80" />
      </g>
      <text
        x="50"
        y="84"
        textAnchor="middle"
        fill="#F5EDE8"
        fontFamily="Cormorant Garamond, serif"
        fontSize="9"
        letterSpacing="1.4"
      >
        LORRAINE
      </text>
      <text
        x="50"
        y="92"
        textAnchor="middle"
        fill="#F5EDE8"
        fontFamily="Pinyon Script, cursive"
        fontSize="5"
        fontStyle="italic"
      >
        by Lorraine Padberg
      </text>
    </svg>
  )
}

export function LogoMarkSmall({
  style,
  className,
}: {
  style?: React.CSSProperties
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={28}
      height={28}
      style={{ color: 'var(--primary)', display: 'block', ...style }}
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1.2" opacity={0.5} />
      <circle cx="50" cy="50" r="44" fill="currentColor" />
      <g
        fill="none"
        stroke="#F5EDE8"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M53 30 Q57 30 59 34 Q60 38 59 42 Q62 44 62 48 L60 55 Q60 60 56 62 L56 66 L66 72" />
        <path d="M50 32 Q42 36 40 46 Q39 56 42 64 Q43 70 41 75" />
        <path d="M45 34 Q38 42 36 52 Q35 62 38 70" />
        <path d="M55 32 Q50 40 49 50 Q48 60 51 68" />
        <path d="M48 33 Q43 44 44 56 Q45 66 47 72" />
      </g>
    </svg>
  )
}

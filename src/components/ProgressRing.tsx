export function ProgressRing({
  pct,
  color,
  size = 64,
  stroke = 6,
  label
}: {
  pct: number;
  color: string;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  const r = (size - stroke) / 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={c} cy={c} r={r} fill="none" stroke="#27332C" strokeWidth={stroke} />
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 240ms ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-heading font-bold text-base leading-none">{clamped}%</span>
        {label && <span className="text-[10px] uppercase text-muted mt-0.5 tracking-wide">{label}</span>}
      </div>
    </div>
  );
}

export function ProgressBar({ pct, color }: { pct: number; color: string }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${clamped}%`, backgroundColor: color, transition: 'width 240ms ease' }}
      />
    </div>
  );
}

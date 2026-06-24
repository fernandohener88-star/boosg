import { ProgressBar } from './ProgressRing';
import { typeColor } from '../lib/colors';
import { formatDateShort, weekdayShort } from '../lib/dates';

export function DayMiniCard({ date, type, pct, onClick }: { date: string; type?: string | null; pct: number; onClick: () => void }) {
  const color = typeColor(type);
  return (
    <button
      onClick={onClick}
      className="flex flex-col rounded-xl border border-line bg-panel2 px-2 py-2 text-left tap-scale"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <span className="font-heading font-semibold text-xs uppercase text-chalk/90">{weekdayShort(date)}</span>
      <span className="font-mono text-[11px] text-muted mb-1.5">{formatDateShort(date)}</span>
      <ProgressBar pct={pct} color={color} />
    </button>
  );
}

import { Icon } from './Icon';
import { totalWeeks } from '../lib/planIndex';

export function StatsStrip({
  overallPct,
  currentWeek,
  streak
}: {
  overallPct: number;
  currentWeek: number;
  streak: number;
}) {
  const items = [
    { label: 'Gesamt', value: `${overallPct}%` },
    { label: 'Woche', value: `${currentWeek}/${totalWeeks}` }
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border border-line bg-panel px-3 py-2 text-center">
          <div className="font-heading font-bold text-lg leading-none">{it.value}</div>
          <div className="text-[10px] uppercase text-muted tracking-wide mt-1">{it.label}</div>
        </div>
      ))}
      <div className="rounded-xl border border-line bg-panel px-3 py-2 text-center flex flex-col items-center justify-center">
        <div className="flex items-center gap-1 font-heading font-bold text-lg leading-none text-type-intervall">
          <Icon name="flame" size={16} className="text-type-intervall" />
          {streak}
        </div>
        <div className="text-[10px] uppercase text-muted tracking-wide mt-1">Streak</div>
      </div>
    </div>
  );
}

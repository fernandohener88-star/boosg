import { Badge } from '../components/Badge';
import { DayMiniCard } from '../components/DayMiniCard';
import { ProgressBar } from '../components/ProgressRing';
import { planData } from '../data/planData';
import { normalizePhase, phaseColor } from '../lib/colors';
import { trainingDayFor } from '../lib/planIndex';
import { dayProgress, weekProgress } from '../lib/progress';
import { useTracking } from '../lib/tracking';

export function Weeks({ onSelectDay }: { onSelectDay: (date: string) => void }) {
  const { doneMap } = useTracking();

  return (
    <div className="space-y-4">
      {planData.training.weeks.map((week) => {
        const wp = weekProgress(week.n, doneMap);
        const color = phaseColor(week.phase);
        return (
          <div key={week.n} className="rounded-2xl border border-line bg-panel p-4" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm text-muted">W{week.n}</span>
                <Badge color={color}>{normalizePhase(week.phase)}</Badge>
              </div>
              <span className="font-mono text-xs text-muted">{wp.pct}%</span>
            </div>
            {week.dates && <p className="font-mono text-xs text-muted mb-2">{week.dates}</p>}
            <ProgressBar pct={wp.pct} color={color} />
            {week.summary && <p className="text-sm text-chalk/80 mt-2 leading-snug">{week.summary}</p>}

            <div className="grid grid-cols-4 gap-2 mt-3">
              {week.days.map((day) => (
                <DayMiniCard
                  key={day.id}
                  date={day.date}
                  type={trainingDayFor(day.date)?.type}
                  pct={dayProgress(day.date, doneMap).overallPct}
                  onClick={() => onSelectDay(day.date)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

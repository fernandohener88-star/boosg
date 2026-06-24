import { StatsStrip } from '../components/StatsStrip';
import { DayView } from './DayView';
import { currentWeekNumber, planEndDate, planStartDate } from '../lib/planIndex';
import { clampDate, todayISO } from '../lib/dates';
import { computeStreak, globalProgress } from '../lib/progress';
import { useTracking } from '../lib/tracking';

export function Today({ date, onChangeDate }: { date: string; onChangeDate: (date: string) => void }) {
  const { doneMap } = useTracking();
  const clampedToday = clampDate(todayISO(), planStartDate, planEndDate);
  const overall = globalProgress(doneMap);
  const streak = computeStreak(doneMap, clampedToday);
  const week = currentWeekNumber(date);

  return (
    <div className="space-y-4">
      <StatsStrip overallPct={overall.pct} currentWeek={week} streak={streak} />
      <DayView date={date} onChangeDate={onChangeDate} />
    </div>
  );
}

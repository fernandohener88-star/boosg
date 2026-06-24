import { mealKey, trainingItemKey } from './keys';
import { allDates, datesInWeek, nutritionDayFor, totalWeeks, trainingDayFor } from './planIndex';

export interface KeyedItem {
  key: string;
  defaultDone: boolean;
}

export function dayItemKeys(date: string): { trainingItems: KeyedItem[]; mealItems: KeyedItem[] } {
  const tDay = trainingDayFor(date);
  const nDay = nutritionDayFor(date);

  const trainingItems: KeyedItem[] = [];
  if (tDay) {
    tDay.blocks.forEach((block, bi) => {
      block.items.forEach((item, ii) => {
        trainingItems.push({ key: trainingItemKey(tDay.id, bi, ii), defaultDone: !!item.done });
      });
    });
  }

  const mealItems: KeyedItem[] = [];
  if (nDay) {
    nDay.meals.forEach((meal, mi) => {
      mealItems.push({ key: mealKey(nDay.id, mi), defaultDone: !!meal.done });
    });
  }

  return { trainingItems, mealItems };
}

function countDone(items: KeyedItem[], doneMap: Record<string, boolean>): number {
  let n = 0;
  for (const it of items) {
    if (doneMap[it.key] ?? it.defaultDone) n++;
  }
  return n;
}

export interface DayProgress {
  trainingDone: number;
  trainingTotal: number;
  mealDone: number;
  mealTotal: number;
  trainingPct: number;
  nutritionPct: number;
  overallPct: number;
  overallRatio: number;
}

export function dayProgress(date: string, doneMap: Record<string, boolean>): DayProgress {
  const { trainingItems, mealItems } = dayItemKeys(date);
  const trainingDone = countDone(trainingItems, doneMap);
  const mealDone = countDone(mealItems, doneMap);
  const trainingTotal = trainingItems.length;
  const mealTotal = mealItems.length;
  const totalDone = trainingDone + mealDone;
  const totalAll = trainingTotal + mealTotal;
  const overallRatio = totalAll ? totalDone / totalAll : 0;

  return {
    trainingDone,
    trainingTotal,
    mealDone,
    mealTotal,
    trainingPct: trainingTotal ? Math.round((trainingDone / trainingTotal) * 100) : 0,
    nutritionPct: mealTotal ? Math.round((mealDone / mealTotal) * 100) : 0,
    overallPct: Math.round(overallRatio * 100),
    overallRatio
  };
}

export interface RangeProgress {
  done: number;
  total: number;
  pct: number;
}

export function rangeProgress(dates: string[], doneMap: Record<string, boolean>): RangeProgress {
  let done = 0;
  let total = 0;
  for (const date of dates) {
    const { trainingItems, mealItems } = dayItemKeys(date);
    done += countDone(trainingItems, doneMap) + countDone(mealItems, doneMap);
    total += trainingItems.length + mealItems.length;
  }
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function weekProgress(weekN: number, doneMap: Record<string, boolean>): RangeProgress {
  return rangeProgress(datesInWeek(weekN), doneMap);
}

export function globalProgress(doneMap: Record<string, boolean>): RangeProgress {
  return rangeProgress(allDates, doneMap);
}

/** Consecutive days ending at `referenceDate` (inclusive, walking backwards) with overallRatio >= threshold. */
export function computeStreak(doneMap: Record<string, boolean>, referenceDate: string, threshold = 0.8): number {
  const idx = allDates.indexOf(referenceDate);
  if (idx === -1) return 0;
  let streak = 0;
  for (let i = idx; i >= 0; i--) {
    const { overallRatio } = dayProgress(allDates[i], doneMap);
    if (overallRatio >= threshold) streak++;
    else break;
  }
  return streak;
}

export interface DailyPoint {
  date: string;
  pct: number;
}

export function dailyCompletionSeries(doneMap: Record<string, boolean>): DailyPoint[] {
  return allDates.map((date) => ({ date, pct: dayProgress(date, doneMap).overallPct }));
}

export interface WeeklyPoint {
  weekN: number;
  pct: number;
}

export function weeklyCompletionSeries(doneMap: Record<string, boolean>): WeeklyPoint[] {
  const points: WeeklyPoint[] = [];
  for (let n = 1; n <= totalWeeks; n++) {
    points.push({ weekN: n, pct: weekProgress(n, doneMap).pct });
  }
  return points;
}

import { planData } from '../data/planData';
import type { NutritionDay, TrainingDay } from '../types';

export interface WeekMeta {
  n: number;
  phase: string;
  dates?: string;
  summary?: string;
}

const trainingByDate = new Map<string, TrainingDay>();
const nutritionByDate = new Map<string, NutritionDay>();
const weekMetaByDate = new Map<string, WeekMeta>();
const trainingWeekOfDate = new Map<string, number>();
const allDatesSet = new Set<string>();

for (const week of planData.training.weeks) {
  for (const day of week.days) {
    trainingByDate.set(day.date, day);
    weekMetaByDate.set(day.date, { n: week.n, phase: week.phase, dates: week.dates, summary: week.summary });
    trainingWeekOfDate.set(day.date, week.n);
    allDatesSet.add(day.date);
  }
}

for (const week of planData.nutrition.weeks) {
  for (const day of week.days) {
    nutritionByDate.set(day.date, day);
    allDatesSet.add(day.date);
  }
}

export const allDates: string[] = Array.from(allDatesSet).sort();
export const planStartDate: string = allDates[0] ?? '2026-01-01';
export const planEndDate: string = allDates[allDates.length - 1] ?? '2026-01-01';

export function trainingDayFor(date: string): TrainingDay | undefined {
  return trainingByDate.get(date);
}

export function nutritionDayFor(date: string): NutritionDay | undefined {
  return nutritionByDate.get(date);
}

export function weekMetaFor(date: string): WeekMeta | undefined {
  return weekMetaByDate.get(date);
}

export function currentWeekNumber(date: string): number {
  return trainingWeekOfDate.get(date) ?? planData.training.weeks[0]?.n ?? 1;
}

export const totalWeeks = planData.training.weeks.length;

const datesByWeek = new Map<number, string[]>();
for (const week of planData.training.weeks) {
  datesByWeek.set(
    week.n,
    week.days.map((d) => d.date).sort()
  );
}

export function datesInWeek(weekN: number): string[] {
  return datesByWeek.get(weekN) ?? [];
}

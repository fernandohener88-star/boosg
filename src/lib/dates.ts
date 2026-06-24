/** All plan dates are "YYYY-MM-DD" strings. Parse/format in local time to avoid UTC day-shift bugs. */

export function parseISO(date: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toISO(new Date());
}

export function addDays(date: string, delta: number): string {
  const d = parseISO(date);
  d.setDate(d.getDate() + delta);
  return toISO(d);
}

export function clampDate(date: string, min: string, max: string): string {
  if (date < min) return min;
  if (date > max) return max;
  return date;
}

const WEEKDAY_DE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export function weekdayShort(date: string): string {
  return WEEKDAY_DE[parseISO(date).getDay()];
}

export function formatDateShort(date: string): string {
  const d = parseISO(date);
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.`;
}

export function formatDateLong(date: string): string {
  const d = parseISO(date);
  return `${weekdayShort(date)}, ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

export function isWithinLastDays(date: string, reference: string, days: number): boolean {
  const ref = parseISO(reference);
  const start = new Date(ref);
  start.setDate(start.getDate() - (days - 1));
  const d = parseISO(date);
  return d >= start && d <= ref;
}

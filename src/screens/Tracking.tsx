import { useMemo, type ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { TrackingField } from '../components/TrackingField';
import { planData } from '../data/planData';
import { clampDate, formatDateShort, isWithinLastDays, todayISO } from '../lib/dates';
import { allDates, planEndDate, planStartDate } from '../lib/planIndex';
import { dailyCompletionSeries, globalProgress, weeklyCompletionSeries } from '../lib/progress';
import { useTracking } from '../lib/tracking';

const tooltipStyle = {
  background: '#1C2621',
  border: '1px solid #27332C',
  borderRadius: 8,
  fontSize: 12,
  color: '#EAE8DF'
};

const tickInterval = Math.max(1, Math.floor(allDates.length / 7));

export function Tracking({ date, onChangeDate }: { date: string; onChangeDate: (date: string) => void }) {
  const { dayTracking, setDayTracking, trackingMap, doneMap } = useTracking();
  const entry = dayTracking(date);
  const clampedToday = clampDate(todayISO(), planStartDate, planEndDate);

  const weightData = useMemo(
    () => allDates.map((d) => ({ date: d, weight: trackingMap[d]?.weight ?? null })),
    [trackingMap]
  );
  const sleepData = useMemo(
    () => allDates.map((d) => ({ date: d, sleepHours: trackingMap[d]?.sleepHours ?? null })),
    [trackingMap]
  );
  const dailyPct = useMemo(() => dailyCompletionSeries(doneMap), [doneMap]);
  const weeklyPct = useMemo(() => weeklyCompletionSeries(doneMap), [doneMap]);
  const overall = useMemo(() => globalProgress(doneMap), [doneMap]);

  const weightEntries = allDates
    .map((d) => ({ date: d, weight: trackingMap[d]?.weight }))
    .filter((e): e is { date: string; weight: number } => typeof e.weight === 'number');
  const weightChange =
    weightEntries.length >= 2 ? weightEntries[weightEntries.length - 1].weight - weightEntries[0].weight : null;

  const sleepLast7 = allDates
    .filter((d) => isWithinLastDays(d, clampedToday, 7))
    .map((d) => trackingMap[d]?.sleepHours)
    .filter((v): v is number => typeof v === 'number');
  const avgSleep7 = sleepLast7.length ? sleepLast7.reduce((a, b) => a + b, 0) / sleepLast7.length : null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-panel p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-wide text-muted font-semibold">Eintrag für {formatDateShort(date)}</p>
          <div className="flex gap-1">
            <input
              type="date"
              value={date}
              min={planStartDate}
              max={planEndDate}
              onChange={(e) => e.target.value && onChangeDate(e.target.value)}
              className="rounded-lg border border-line bg-panel2 px-2 py-1 text-xs font-mono text-chalk"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <TrackingField label="Gewicht (kg)" value={entry.weight} step={0.1} onChange={(v) => setDayTracking(date, { weight: v })} />
          <TrackingField
            label="Schlaf (h)"
            value={entry.sleepHours}
            step={0.25}
            onChange={(v) => setDayTracking(date, { sleepHours: v })}
          />
          <TrackingField
            label="Readiness"
            value={entry.readiness}
            step={1}
            min={0}
            max={10}
            onChange={(v) => setDayTracking(date, { readiness: v })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Ø Schlaf (7 Tage)" value={avgSleep7 !== null ? `${avgSleep7.toFixed(1)} h` : '–'} />
        <StatCard
          label="Gewicht gesamt"
          value={weightChange !== null ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg` : '–'}
        />
        <StatCard label="Gesamt-Erfüllung" value={`${overall.pct}%`} />
      </div>

      <ChartCard title="Gewicht (kg)">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={weightData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#27332C" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateShort}
              interval={tickInterval}
              tick={{ fill: '#8B958C', fontSize: 10 }}
              axisLine={{ stroke: '#27332C' }}
              tickLine={false}
            />
            <YAxis domain={['auto', 'auto']} tick={{ fill: '#8B958C', fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
            <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => formatDateShort(String(v))} />
            <Line type="monotone" dataKey="weight" stroke="#5B8A9E" strokeWidth={2} dot={false} connectNulls />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted mt-2 leading-snug">
          Kalorienziel laut Plan: {planData.meta.kcalTarget?.[0] ?? '–'}–{planData.meta.kcalTarget?.[1] ?? '–'} kcal · Protein-Ziel:{' '}
          {planData.meta.proteinTarget_g ?? '–'} g/Tag
        </p>
      </ChartCard>

      <ChartCard title="Schlafstunden (Ziel 9–10 h)">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={sleepData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#27332C" strokeDasharray="3 3" vertical={false} />
            <ReferenceArea y1={9} y2={10} fill="#5BA17E" fillOpacity={0.15} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateShort}
              interval={tickInterval}
              tick={{ fill: '#8B958C', fontSize: 10 }}
              axisLine={{ stroke: '#27332C' }}
              tickLine={false}
            />
            <YAxis domain={[0, 12]} tick={{ fill: '#8B958C', fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
            <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => formatDateShort(String(v))} />
            <Bar dataKey="sleepHours" fill="#5BA17E" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Trainings- & Ernährungs-Erfüllung pro Tag">
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={dailyPct} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#27332C" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateShort}
              interval={tickInterval}
              tick={{ fill: '#8B958C', fontSize: 10 }}
              axisLine={{ stroke: '#27332C' }}
              tickLine={false}
            />
            <YAxis domain={[0, 100]} tick={{ fill: '#8B958C', fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => formatDateShort(String(v))} formatter={(v) => [`${v}%`, 'Erfüllung']} />
            <Line type="monotone" dataKey="pct" stroke="#D99A4E" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Erfüllung pro Woche">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyPct} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#27332C" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="weekN" tickFormatter={(v) => `W${v}`} tick={{ fill: '#8B958C', fontSize: 10 }} axisLine={{ stroke: '#27332C' }} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#8B958C', fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip contentStyle={tooltipStyle} labelFormatter={(v) => `Woche ${v}`} formatter={(v) => [`${v}%`, 'Erfüllung']} />
            <Bar dataKey="pct" fill="#D9695B" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-panel px-2 py-3 text-center">
      <div className="font-heading font-bold text-base leading-none">{value}</div>
      <div className="text-[9px] uppercase text-muted tracking-wide mt-1 leading-tight">{label}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-4">
      <p className="text-[10px] uppercase tracking-wide text-muted font-semibold mb-2">{title}</p>
      {children}
    </div>
  );
}

import { useState } from 'react';
import { Badge } from '../components/Badge';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { CheckRow } from '../components/CheckRow';
import { MealRow } from '../components/MealRow';
import { ProgressRing } from '../components/ProgressRing';
import { TrackingField } from '../components/TrackingField';
import { phaseColor, normalizePhase, typeColor, typeLabel } from '../lib/colors';
import { formatDateLong, addDays } from '../lib/dates';
import { trainingItemKey, mealKey } from '../lib/keys';
import { nutritionDayFor, planEndDate, planStartDate, trainingDayFor, weekMetaFor } from '../lib/planIndex';
import { dayProgress } from '../lib/progress';
import { glossaryFor } from '../lib/lookup';
import { useTracking } from '../lib/tracking';

export function DayView({ date, onChangeDate }: { date: string; onChangeDate: (date: string) => void }) {
  const { isDone, toggle, dayTracking, setDayTracking, doneMap } = useTracking();
  const [glossaryTerm, setGlossaryTerm] = useState<string | null>(null);

  const tDay = trainingDayFor(date);
  const nDay = nutritionDayFor(date);
  const weekMeta = weekMetaFor(date);
  const progress = dayProgress(date, doneMap);
  const entry = dayTracking(date);

  const canPrev = date > planStartDate;
  const canNext = date < planEndDate;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => canPrev && onChangeDate(addDays(date, -1))}
          disabled={!canPrev}
          className={`rounded-full p-2 tap-scale ${canPrev ? 'text-chalk hover:bg-panel2' : 'text-muted/30'}`}
          aria-label="Vorheriger Tag"
        >
          <Icon name="chevronLeft" size={20} />
        </button>
        <div className="text-center">
          <div className="font-heading font-bold text-xl uppercase leading-none">{formatDateLong(date)}</div>
        </div>
        <button
          onClick={() => canNext && onChangeDate(addDays(date, 1))}
          disabled={!canNext}
          className={`rounded-full p-2 tap-scale ${canNext ? 'text-chalk hover:bg-panel2' : 'text-muted/30'}`}
          aria-label="Nächster Tag"
        >
          <Icon name="chevronRight" size={20} />
        </button>
      </div>

      <div className="rounded-2xl border border-line bg-panel p-4" style={{ borderLeft: `4px solid ${typeColor(tDay?.type)}` }}>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {weekMeta && <Badge color={phaseColor(weekMeta.phase)}>{normalizePhase(weekMeta.phase)}</Badge>}
          {tDay && <Badge color={typeColor(tDay.type)}>{typeLabel(tDay.type)}</Badge>}
          {tDay?.duration && <span className="font-mono text-xs text-muted">{tDay.duration}</span>}
        </div>
        {tDay?.title && <h2 className="font-heading font-bold uppercase text-lg text-chalk">{tDay.title}</h2>}

        {tDay?.shower && (
          <div className="mt-3 rounded-xl bg-phase-fundament/10 border border-phase-fundament/30 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-phase-fundament font-semibold mb-0.5">Duschen</p>
            <p className="text-sm text-chalk/90 leading-snug">{tDay.shower}</p>
          </div>
        )}
        {tDay?.note && (
          <div className="mt-2 rounded-xl bg-panel2 border border-line px-3 py-2">
            <p className="text-xs text-muted leading-snug">{tDay.note}</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-line bg-panel p-4 flex items-center justify-around">
        <ProgressRing pct={progress.trainingPct} color={typeColor(tDay?.type)} label="Training" />
        <ProgressRing pct={progress.nutritionPct} color="#5BA17E" label="Ernährung" />
        <ProgressRing pct={progress.overallPct} color="#EAE8DF" label="Gesamt" />
      </div>

      <div className="rounded-2xl border border-line bg-panel p-4">
        <p className="text-[10px] uppercase tracking-wide text-muted font-semibold mb-3">Tages-Tracking</p>
        <div className="grid grid-cols-3 gap-3">
          <TrackingField
            label="Gewicht (kg)"
            value={entry.weight}
            step={0.1}
            onChange={(v) => setDayTracking(date, { weight: v })}
          />
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

      {tDay?.blocks.map((block, bi) => (
        <div key={block.name + bi} className="rounded-2xl border border-line bg-panel p-4">
          <p className="font-heading uppercase text-sm font-semibold text-chalk/90 mb-1">{block.name}</p>
          <div className="divide-y divide-line/60">
            {block.items.map((item, ii) => {
              const key = trainingItemKey(tDay.id, bi, ii);
              return (
                <CheckRow
                  key={key}
                  done={isDone(key, !!item.done)}
                  onToggle={() => toggle(key, !!item.done)}
                  title={item.name}
                  onTitleClick={item.glossary ? () => setGlossaryTerm(item.glossary ?? null) : undefined}
                  subtitle={item.dose}
                  hint={item.cue}
                />
              );
            })}
          </div>
        </div>
      ))}

      {nDay && nDay.meals.length > 0 && (
        <div className="rounded-2xl border border-line bg-panel p-4">
          <p className="font-heading uppercase text-sm font-semibold text-chalk/90 mb-1">Ernährung</p>
          <div className="divide-y divide-line/60">
            {nDay.meals.map((meal, mi) => {
              const key = mealKey(nDay.id, mi);
              return <MealRow key={key} done={isDone(key, !!meal.done)} onToggle={() => toggle(key, !!meal.done)} meal={meal} />;
            })}
          </div>
        </div>
      )}

      {!tDay && !nDay && <p className="text-center text-muted text-sm py-10">Kein Plan für diesen Tag.</p>}

      {glossaryTerm && (
        <Modal title={glossaryTerm} onClose={() => setGlossaryTerm(null)}>
          <p>{glossaryFor(glossaryTerm) ?? 'Keine Erklärung hinterlegt.'}</p>
        </Modal>
      )}
    </div>
  );
}

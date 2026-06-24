import { useMemo, useState } from 'react';
import { CheckButton } from './CheckButton';
import { enrichMeal } from '../lib/lookup';
import type { Meal } from '../types';

export function MealRow({ done, onToggle, meal }: { done: boolean; onToggle: () => void; meal: Meal }) {
  const [expanded, setExpanded] = useState(false);
  const enriched = useMemo(() => enrichMeal(meal), [meal]);
  const hasDetails = Boolean(enriched.detail || enriched.kcal || enriched.protein || enriched.recipe);

  const macros = [enriched.kcal ? `${enriched.kcal} kcal` : null, enriched.protein ? `${enriched.protein} g Protein` : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className={`flex items-start gap-3 py-2.5 transition-opacity ${done ? 'opacity-50' : ''}`}>
      <CheckButton done={done} onToggle={onToggle} />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase text-muted tracking-wide">{meal.slot}</div>
        <span
          onClick={() => hasDetails && setExpanded((e) => !e)}
          className={`text-sm leading-snug text-chalk ${done ? 'line-through' : ''} ${
            hasDetails ? 'underline decoration-dotted decoration-muted cursor-pointer' : ''
          }`}
        >
          {meal.name}
        </span>
        {expanded && hasDetails && (
          <div className="mt-1.5 space-y-1 rounded-lg bg-panel2 border border-line p-2.5">
            {enriched.detail && <p className="text-xs text-chalk/80 leading-snug">{enriched.detail}</p>}
            {macros && <p className="font-mono text-xs text-phase-aufbau">{macros}</p>}
            {enriched.recipe && <p className="text-xs text-muted leading-snug">{enriched.recipe}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

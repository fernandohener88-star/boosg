import { useState } from 'react';
import { Icon } from '../components/Icon';
import { planData } from '../data/planData';

export function Nutrition() {
  const [openRecipes, setOpenRecipes] = useState<Set<string>>(new Set());

  function toggleRecipe(name: string) {
    setOpenRecipes((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <div className="space-y-5">
      <section>
        <h2 className="font-heading font-bold uppercase text-base text-chalk mb-1">Optionen-Bibliothek</h2>
        <p className="text-xs text-muted mb-3 italic">Alle Optionen im selben Slot sind frei tauschbar.</p>
        <div className="space-y-3">
          {Object.entries(planData.nutrition.library).map(([slot, items]) => (
            <div key={slot} className="rounded-2xl border border-line bg-panel p-4">
              <p className="font-heading font-semibold uppercase text-sm text-phase-aufbau mb-2">{slot}</p>
              <div className="divide-y divide-line/60">
                {items.map((item, i) => (
                  <div key={item.name + i} className="py-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm text-chalk">{item.name}</span>
                      <span className="font-mono text-xs text-muted shrink-0">
                        {[item.kcal ? `${item.kcal} kcal` : null, item.protein ? `${item.protein}g P` : null]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </div>
                    {item.detail && <p className="text-xs text-muted mt-0.5 leading-snug">{item.detail}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading font-bold uppercase text-base text-chalk mb-3">Rezepte</h2>
        <div className="rounded-2xl border border-line bg-panel divide-y divide-line/60">
          {Object.entries(planData.nutrition.recipes).map(([name, text]) => {
            const open = openRecipes.has(name);
            return (
              <div key={name}>
                <button onClick={() => toggleRecipe(name)} className="w-full flex items-center justify-between gap-2 p-3.5 text-left tap-scale">
                  <span className="font-heading font-semibold uppercase text-sm text-chalk">{name}</span>
                  <Icon name={open ? 'chevronUp' : 'chevronDown'} size={16} className="text-muted shrink-0" />
                </button>
                {open && <p className="px-3.5 pb-3.5 text-sm text-chalk/80 leading-relaxed">{text}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-heading font-bold uppercase text-base text-chalk mb-3">Tipps</h2>
        <div className="space-y-3">
          {planData.nutrition.tips.map((tip, i) => (
            <div key={tip.h + i} className="rounded-2xl border border-line bg-panel p-4">
              <p className="font-heading font-semibold uppercase text-sm text-type-intervall mb-2">{tip.h}</p>
              <ul className="space-y-1.5">
                {tip.lines.map((line, j) => (
                  <li key={j} className="text-sm text-chalk/80 leading-snug pl-3 relative before:absolute before:left-0 before:content-['·'] before:text-muted">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

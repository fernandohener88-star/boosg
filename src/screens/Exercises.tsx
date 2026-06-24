import { useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { planData } from '../data/planData';

export function Exercises() {
  const [query, setQuery] = useState('');

  const entries = useMemo(
    () => Object.entries(planData.glossary).sort((a, b) => a[0].localeCompare(b[0], 'de')),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(([name, text]) => name.toLowerCase().includes(q) || text.toLowerCase().includes(q));
  }, [entries, query]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Übung suchen…"
          className="w-full rounded-xl border border-line bg-panel py-2.5 pl-10 pr-3 text-sm text-chalk placeholder:text-muted focus:outline-none focus:border-phase-aufbau"
        />
      </div>

      <p className="text-xs text-muted">
        {filtered.length} von {entries.length} Übungen
      </p>

      <div className="rounded-2xl border border-line bg-panel divide-y divide-line/60">
        {filtered.map(([name, text]) => (
          <div key={name} className="p-3.5">
            <p className="font-heading font-semibold uppercase text-sm text-chalk">{name}</p>
            <p className="text-sm text-chalk/75 leading-snug mt-0.5">{text}</p>
          </div>
        ))}
        {filtered.length === 0 && <p className="p-6 text-center text-sm text-muted">Keine Übung gefunden.</p>}
      </div>
    </div>
  );
}

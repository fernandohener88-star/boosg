import type { ReactNode } from 'react';

export function Badge({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-heading font-semibold uppercase tracking-wide"
      style={{ color, backgroundColor: `${color}22`, border: `1px solid ${color}55` }}
    >
      {children}
    </span>
  );
}

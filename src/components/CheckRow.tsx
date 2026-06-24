import type { ReactNode } from 'react';
import { CheckButton } from './CheckButton';

export function CheckRow({
  done,
  onToggle,
  title,
  onTitleClick,
  subtitle,
  hint,
  trailing
}: {
  done: boolean;
  onToggle: () => void;
  title: string;
  onTitleClick?: () => void;
  subtitle?: string;
  hint?: string;
  trailing?: ReactNode;
}) {
  return (
    <div className={`flex items-start gap-3 py-2.5 transition-opacity ${done ? 'opacity-50' : ''}`}>
      <CheckButton done={done} onToggle={onToggle} />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span
            onClick={onTitleClick}
            className={`text-sm leading-snug text-chalk ${done ? 'line-through' : ''} ${
              onTitleClick ? 'underline decoration-dotted decoration-muted cursor-pointer' : ''
            }`}
          >
            {title}
          </span>
          {subtitle && <span className="font-mono text-xs text-muted shrink-0">{subtitle}</span>}
        </div>
        {hint && <p className="text-xs text-muted mt-0.5 leading-snug">{hint}</p>}
        {trailing}
      </div>
    </div>
  );
}

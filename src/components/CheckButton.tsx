import { Icon } from './Icon';

export function CheckButton({ done, onToggle }: { done: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={done}
      aria-label={done ? 'Als offen markieren' : 'Als erledigt markieren'}
      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 tap-scale ${
        done ? 'border-phase-aufbau bg-phase-aufbau text-ink check-pop' : 'border-line text-transparent'
      }`}
    >
      <Icon name="check" size={14} />
    </button>
  );
}

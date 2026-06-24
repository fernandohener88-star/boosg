import { Icon, type IconName } from './Icon';
import type { Tab } from '../App';

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: 'today', label: 'Heute', icon: 'today' },
  { id: 'weeks', label: 'Wochen', icon: 'weeks' },
  { id: 'tracking', label: 'Tracking', icon: 'tracking' },
  { id: 'exercises', label: 'Übungen', icon: 'exercises' },
  { id: 'nutrition', label: 'Ernährung', icon: 'nutrition' }
];

export function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-panel/95 backdrop-blur safe-bottom">
      <div className="mx-auto flex max-w-2xl">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 tap-scale ${
                isActive ? 'text-phase-aufbau' : 'text-muted'
              }`}
            >
              <Icon name={tab.icon} size={22} />
              <span className="text-[10px] font-body font-medium tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

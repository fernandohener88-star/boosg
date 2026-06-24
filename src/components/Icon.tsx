export type IconName =
  | 'today'
  | 'weeks'
  | 'tracking'
  | 'exercises'
  | 'nutrition'
  | 'settings'
  | 'chevronLeft'
  | 'chevronRight'
  | 'chevronUp'
  | 'chevronDown'
  | 'close'
  | 'search'
  | 'check'
  | 'flame';

const PATHS: Record<IconName, string> = {
  today: 'M12 3 4 9v11h5v-6h6v6h5V9l-8-6Z',
  weeks: 'M4 5h16v15H4V5Zm0 5h16M8 3v4M16 3v4',
  tracking: 'M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-3',
  exercises: 'M4 5h12v15H4V5Zm12 3h4v12h-4',
  nutrition: 'M6 3v8a3 3 0 0 0 6 0V3M9 11v10M17 3c-2 1-3 3-3 6s1 4 3 4 3-1 3-4-1-5-3-6Zm0 10v7',
  settings:
    'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm8 3c0 .4 0 .8-.1 1.2l2 1.6-2 3.4-2.3-1a8 8 0 0 1-2 1.2l-.4 2.6H9.8l-.4-2.6a8 8 0 0 1-2-1.2l-2.3 1-2-3.4 2-1.6A8 8 0 0 1 5 12c0-.4 0-.8.1-1.2l-2-1.6 2-3.4 2.3 1a8 8 0 0 1 2-1.2L9.8 3h4.4l.4 2.6a8 8 0 0 1 2 1.2l2.3-1 2 3.4-2 1.6c.1.4.1.8.1 1.2Z',
  chevronLeft: 'M15 5 7 12l8 7',
  chevronRight: 'M9 5l8 7-8 7',
  chevronUp: 'M5 15l7-8 7 8',
  chevronDown: 'M5 9l7 8 7-8',
  close: 'M5 5l14 14M19 5 5 19',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm10 16-5.5-5.5',
  check: 'M4 12l5 5L20 6',
  flame: 'M12 2c1 3-3 4-3 7a3 3 0 0 0 6 0c0-1-.5-2-.5-2 1.5 1 3 3.5 3 6a5.5 5.5 0 1 1-11 0c0-4 2.5-6 3-8 .3-1.3 1.5-2.5 2.5-3Z'
};

export function Icon({ name, size = 22, className = '' }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

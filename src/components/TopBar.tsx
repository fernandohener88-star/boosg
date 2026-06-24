import { useState } from 'react';
import { Icon } from './Icon';
import { SettingsSheet } from './SettingsSheet';

export function TopBar({ title }: { title: string }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-ink/95 backdrop-blur px-4 py-3 safe-top">
        <h1 className="font-heading font-bold uppercase tracking-wide text-chalk text-lg">{title}</h1>
        <button
          onClick={() => setSettingsOpen(true)}
          className="rounded-full p-2 text-muted hover:text-chalk hover:bg-panel2 tap-scale"
          aria-label="Einstellungen"
        >
          <Icon name="settings" size={20} />
        </button>
      </header>
      {settingsOpen && <SettingsSheet onClose={() => setSettingsOpen(false)} />}
    </>
  );
}

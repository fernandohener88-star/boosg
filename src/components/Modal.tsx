import { useEffect, type ReactNode } from 'react';
import { Icon } from './Icon';

export function Modal({
  title,
  onClose,
  children
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md max-h-[80vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-panel border border-line p-5 safe-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="font-heading font-bold uppercase text-lg text-chalk leading-tight">{title}</h2>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full p-1.5 text-muted hover:text-chalk hover:bg-panel2 tap-scale"
            aria-label="Schließen"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="text-sm text-chalk/90 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

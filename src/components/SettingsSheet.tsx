import { useState } from 'react';
import { Modal } from './Modal';
import { planData } from '../data/planData';
import { useTracking } from '../lib/tracking';

export function SettingsSheet({ onClose }: { onClose: () => void }) {
  const { resetAll } = useTracking();
  const [confirming, setConfirming] = useState(false);
  const { meta } = planData;

  return (
    <Modal title="Einstellungen" onClose={onClose}>
      <div className="space-y-5">
        <div>
          <p className="font-heading uppercase text-xs text-muted tracking-wide mb-1">{meta.title}</p>
          <p className="text-muted text-xs">{meta.period}</p>
          {meta.athlete && (
            <p className="font-mono text-xs text-chalk/80 mt-2">
              {[
                meta.athlete.position,
                meta.athlete.liga,
                meta.athlete.alter ? `${meta.athlete.alter} J.` : null,
                meta.athlete.gewicht_kg ? `${meta.athlete.gewicht_kg} kg` : null
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
        </div>

        <div className="border-t border-line pt-4">
          <p className="text-sm text-chalk/80 mb-3">
            Setzt alle Häkchen, Gewichts-, Schlaf- und Readiness-Einträge auf diesem Gerät unwiderruflich zurück.
          </p>
          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="w-full rounded-xl border border-type-speed/50 bg-type-speed/10 text-type-speed font-heading uppercase font-semibold py-3 tap-scale"
            >
              Alle Daten zurücksetzen
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-type-speed text-sm font-semibold">Wirklich alles löschen? Das kann nicht rückgängig gemacht werden.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 rounded-xl border border-line py-2.5 text-chalk/80 tap-scale"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => {
                    resetAll();
                    setConfirming(false);
                    onClose();
                  }}
                  className="flex-1 rounded-xl bg-type-speed text-ink font-semibold py-2.5 tap-scale"
                >
                  Ja, löschen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

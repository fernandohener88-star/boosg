import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'vorbereitung:v1';

export interface DayTrackingEntry {
  weight?: number;
  sleepHours?: number;
  readiness?: number;
}

interface StoredState {
  version: 1;
  done: Record<string, boolean>;
  tracking: Record<string, DayTrackingEntry>;
}

const EMPTY_STATE: StoredState = { version: 1, done: {}, tracking: {} };

function loadState(): StoredState {
  if (typeof localStorage === 'undefined') return EMPTY_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    return {
      version: 1,
      done: parsed && typeof parsed.done === 'object' && parsed.done ? parsed.done : {},
      tracking: parsed && typeof parsed.tracking === 'object' && parsed.tracking ? parsed.tracking : {}
    };
  } catch {
    return EMPTY_STATE;
  }
}

function saveState(state: StoredState) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full/unavailable — keep working in-memory for this session
  }
}

interface TrackingContextValue {
  isDone: (key: string, defaultDone?: boolean) => boolean;
  toggle: (key: string, defaultDone?: boolean) => void;
  doneMap: Record<string, boolean>;
  trackingMap: Record<string, DayTrackingEntry>;
  dayTracking: (date: string) => DayTrackingEntry;
  setDayTracking: (date: string, patch: Partial<DayTrackingEntry>) => void;
  resetAll: () => void;
}

const TrackingContext = createContext<TrackingContextValue | null>(null);

export function TrackingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const isDone = useCallback(
    (key: string, defaultDone = false) => state.done[key] ?? defaultDone,
    [state.done]
  );

  const toggle = useCallback((key: string, defaultDone = false) => {
    setState((prev) => {
      const current = prev.done[key] ?? defaultDone;
      return { ...prev, done: { ...prev.done, [key]: !current } };
    });
  }, []);

  const dayTracking = useCallback(
    (date: string): DayTrackingEntry => state.tracking[date] ?? {},
    [state.tracking]
  );

  const setDayTracking = useCallback((date: string, patch: Partial<DayTrackingEntry>) => {
    setState((prev) => ({
      ...prev,
      tracking: {
        ...prev.tracking,
        [date]: { ...prev.tracking[date], ...patch }
      }
    }));
  }, []);

  const resetAll = useCallback(() => {
    setState(EMPTY_STATE);
  }, []);

  const value = useMemo<TrackingContextValue>(
    () => ({
      isDone,
      toggle,
      doneMap: state.done,
      trackingMap: state.tracking,
      dayTracking,
      setDayTracking,
      resetAll
    }),
    [isDone, toggle, state.done, state.tracking, dayTracking, setDayTracking, resetAll]
  );

  return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>;
}

export function useTracking(): TrackingContextValue {
  const ctx = useContext(TrackingContext);
  if (!ctx) throw new Error('useTracking must be used within TrackingProvider');
  return ctx;
}

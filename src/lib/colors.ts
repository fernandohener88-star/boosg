import type { DayType } from '../types';

export type PhaseKey = 'Fundament' | 'Aufbau' | 'Hochphase' | 'Hochphase / Peak-Volumen' | 'Peak' | 'Deload';

const PHASE_COLORS: Record<PhaseKey, string> = {
  Fundament: '#5B8A9E',
  Aufbau: '#5BA17E',
  Hochphase: '#D99A4E',
  'Hochphase / Peak-Volumen': '#D99A4E',
  Peak: '#D9695B',
  Deload: '#8893A6'
};

/**
 * Plan JSON spells phases inconsistently (e.g. "DELOAD / TAPERING" vs "DELOAD",
 * all-caps everywhere). Normalize to one of the six canonical labels by
 * checking the most specific patterns first.
 */
export function normalizePhase(phase: string | undefined | null): PhaseKey {
  const p = (phase ?? '').toUpperCase();
  if (p.includes('PEAK-VOLUMEN')) return 'Hochphase / Peak-Volumen';
  if (p.includes('FUNDAMENT')) return 'Fundament';
  if (p.includes('AUFBAU')) return 'Aufbau';
  if (p.includes('HOCHPHASE')) return 'Hochphase';
  if (p.includes('DELOAD') || p.includes('TAPERING')) return 'Deload';
  if (p.includes('PEAK')) return 'Peak';
  return 'Fundament';
}

export function phaseColor(phase: string | undefined | null): string {
  return PHASE_COLORS[normalizePhase(phase)];
}

const TYPE_COLORS: Record<DayType, string> = {
  speed: '#D9695B',
  kraft: '#C98A3E',
  aerob: '#5BA17E',
  intervall: '#E0B341',
  ruhe: '#6B7670',
  locker: '#7E9488'
};

const TYPE_LABELS: Record<DayType, string> = {
  speed: 'Speed',
  kraft: 'Kraft',
  aerob: 'Aerob',
  intervall: 'Intervall',
  ruhe: 'Ruhe',
  locker: 'Locker'
};

export function typeColor(type: string | undefined | null): string {
  if (type && type in TYPE_COLORS) return TYPE_COLORS[type as DayType];
  return '#6B7670';
}

export function typeLabel(type: string | undefined | null): string {
  if (type && type in TYPE_LABELS) return TYPE_LABELS[type as DayType];
  return type ?? '–';
}

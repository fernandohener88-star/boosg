export type DayType = 'speed' | 'kraft' | 'aerob' | 'intervall' | 'ruhe' | 'locker';

export interface Athlete {
  alter?: number;
  gewicht_kg?: number;
  position?: string;
  liga?: string;
}

export interface PlanMeta {
  title?: string;
  period?: string;
  athlete?: Athlete;
  kcalTarget?: [number, number];
  proteinTarget_g?: number;
}

export interface TrackingConfigEntry {
  unit?: string;
  scale?: string;
  perDay?: boolean;
  optional?: boolean;
}

export interface PlanTrackingConfig {
  weight?: TrackingConfigEntry;
  sleepHours?: TrackingConfigEntry;
  readiness?: TrackingConfigEntry;
}

export type Glossary = Record<string, string>;

export interface TrainingItem {
  name: string;
  dose?: string;
  cue?: string;
  glossary?: string | null;
  done?: boolean;
}

export interface TrainingBlock {
  name: string;
  items: TrainingItem[];
}

export interface TrainingDay {
  id: string;
  date: string;
  dow?: string;
  title?: string;
  type: DayType;
  duration?: string;
  shower?: string;
  note?: string;
  blocks: TrainingBlock[];
}

export interface TrainingWeek {
  n: number;
  phase: string;
  dates?: string;
  summary?: string;
  days: TrainingDay[];
}

export interface Meal {
  slot: string;
  name: string;
  detail?: string;
  kcal?: number;
  protein?: number;
  done?: boolean;
}

export interface NutritionDay {
  id: string;
  date: string;
  dow?: string;
  title?: string;
  type?: DayType;
  meals: Meal[];
}

export interface NutritionWeek {
  n: number;
  phase: string;
  dates?: string;
  days: NutritionDay[];
}

export interface LibraryItem {
  name: string;
  detail?: string;
  kcal?: number;
  protein?: number;
}

export interface RecipeMap {
  [name: string]: string;
}

export interface NutritionTip {
  h: string;
  lines: string[];
}

export interface NutritionData {
  library: Record<string, LibraryItem[]>;
  recipes: RecipeMap;
  weeks: NutritionWeek[];
  tips: NutritionTip[];
}

export interface PlanData {
  meta: PlanMeta;
  tracking: PlanTrackingConfig;
  glossary: Glossary;
  training: { weeks: TrainingWeek[] };
  nutrition: NutritionData;
}

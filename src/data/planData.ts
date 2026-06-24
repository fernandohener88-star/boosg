import raw from '../../plan-data.json';
import type { PlanData } from '../types';

const data = raw as unknown as PlanData;

export const planData: PlanData = {
  meta: data.meta ?? {},
  tracking: data.tracking ?? {},
  glossary: data.glossary ?? {},
  training: { weeks: data.training?.weeks ?? [] },
  nutrition: {
    library: data.nutrition?.library ?? {},
    recipes: data.nutrition?.recipes ?? {},
    weeks: data.nutrition?.weeks ?? [],
    tips: data.nutrition?.tips ?? []
  }
};

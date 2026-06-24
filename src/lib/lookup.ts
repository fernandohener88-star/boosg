import { planData } from '../data/planData';
import type { LibraryItem, Meal } from '../types';

const libraryByName = new Map<string, LibraryItem>();
const libraryByNameLower = new Map<string, LibraryItem>();

for (const items of Object.values(planData.nutrition.library)) {
  for (const item of items) {
    if (!libraryByName.has(item.name)) libraryByName.set(item.name, item);
    const lower = item.name.trim().toLowerCase();
    if (!libraryByNameLower.has(lower)) libraryByNameLower.set(lower, item);
  }
}

const recipeByName = new Map<string, string>();
const recipeByNameLower = new Map<string, string>();
for (const [name, text] of Object.entries(planData.nutrition.recipes)) {
  recipeByName.set(name, text);
  recipeByNameLower.set(name.trim().toLowerCase(), text);
}

export interface EnrichedMeal {
  name: string;
  detail?: string;
  kcal?: number;
  protein?: number;
  recipe?: string;
}

/**
 * Meal entries inside training/nutrition weeks only carry {slot, name, done} —
 * detail/kcal/protein live in the separate `library`, keyed by dish name.
 * Cross-reference within the same plan-data.json rather than inventing values.
 */
export function enrichMeal(meal: Meal): EnrichedMeal {
  const lower = meal.name.trim().toLowerCase();
  const libMatch = libraryByName.get(meal.name) ?? libraryByNameLower.get(lower);
  const recipeMatch = recipeByName.get(meal.name) ?? recipeByNameLower.get(lower);

  return {
    name: meal.name,
    detail: meal.detail ?? libMatch?.detail,
    kcal: meal.kcal ?? libMatch?.kcal,
    protein: meal.protein ?? libMatch?.protein,
    recipe: recipeMatch
  };
}

export function glossaryFor(term: string | null | undefined): string | undefined {
  if (!term) return undefined;
  return planData.glossary[term];
}

export function trainingItemKey(dayId: string, blockIndex: number, itemIndex: number): string {
  return `${dayId}#${blockIndex}#${itemIndex}`;
}

export function mealKey(dayId: string, mealIndex: number): string {
  return `${dayId}#meal#${mealIndex}`;
}

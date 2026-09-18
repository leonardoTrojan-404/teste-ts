import type { MenuCategory } from '../menu/menuCategory';
import type { AssistantContext } from './promptSchema';

export interface Suggestion {
  readonly sku: string;
  readonly reason: string;
  readonly confidence: number;
}

const MIN_CONFIDENCE = 0.35;

export function contextFromMenu(
  restaurantId: string,
  categories: readonly MenuCategory[],
  recentRevenueCents: number,
  topSellingSkus: readonly string[],
): AssistantContext {
  const known = new Set(categories.flatMap((category) => category.items.map((item) => item.sku)));

  return {
    restaurantId,
    locale: 'pt-BR',
    recentRevenueCents,
    topSellingSkus: topSellingSkus.filter((sku) => known.has(sku)),
  };
}

export function usableSuggestions(suggestions: readonly Suggestion[]): readonly Suggestion[] {
  return [...suggestions]
    .filter((suggestion) => suggestion.confidence >= MIN_CONFIDENCE)
    .sort((a, b) => b.confidence - a.confidence);
}

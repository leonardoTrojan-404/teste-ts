export interface MenuItem {
  readonly sku: string;
  readonly name: string;
  readonly description: string;
  readonly priceCents: number;
}

export interface MenuCategory {
  readonly id: string;
  readonly name: string;
  readonly position: number;
  readonly items: readonly MenuItem[];
}

export function sortCategories(categories: readonly MenuCategory[]): readonly MenuCategory[] {
  return [...categories].sort((a, b) => a.position - b.position);
}

export function findItem(categories: readonly MenuCategory[], sku: string): MenuItem | undefined {
  for (const category of categories) {
    const match = category.items.find((item) => item.sku === sku);
    if (match) {
      return match;
    }
  }
  return undefined;
}

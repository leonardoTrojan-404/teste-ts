import type { MenuCategory, MenuItem } from './menuCategory';

export type Availability = 'available' | 'sold-out' | 'hidden';

export type AvailabilityMap = Readonly<Record<string, Availability>>;

export function availabilityOf(map: AvailabilityMap, sku: string): Availability {
  return map[sku] ?? 'available';
}

export function setAvailability(
  map: AvailabilityMap,
  sku: string,
  availability: Availability,
): AvailabilityMap {
  return { ...map, [sku]: availability };
}

export function visibleItems(
  category: MenuCategory,
  map: AvailabilityMap,
): readonly MenuItem[] {
  return category.items.filter((item) => availabilityOf(map, item.sku) !== 'hidden');
}

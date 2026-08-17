import type { MenuCategory } from '../modules/menu/menuCategory';

const ENDPOINT = '/api/menu';

export async function loadMenu(restaurantId: string): Promise<readonly MenuCategory[]> {
  const response = await fetch(`${ENDPOINT}?restaurantId=${restaurantId}`);
  if (!response.ok) {
    throw new Error(`failed to load menu: ${response.status}`);
  }
  return (await response.json()) as MenuCategory[];
}

export async function saveCategory(category: MenuCategory): Promise<void> {
  const response = await fetch(`${ENDPOINT}/categories/${category.id}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(category),
  });
  if (!response.ok) {
    throw new Error(`failed to save category ${category.id}: ${response.status}`);
  }
}

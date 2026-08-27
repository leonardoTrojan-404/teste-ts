import type { MenuCategory } from '../modules/menu/menuCategory';
import { request } from './apiClient';

export function loadMenu(restaurantId: string): Promise<readonly MenuCategory[]> {
  return request<MenuCategory[]>('/menu', { query: { restaurantId } });
}

export function saveCategory(category: MenuCategory): Promise<void> {
  return request<void>(`/menu/categories/${category.id}`, { method: 'PUT', body: category });
}

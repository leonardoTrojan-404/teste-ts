import type { TrackedOrder, OrderStatus } from '../modules/orders/orderStatus';
import { request } from './apiClient';

export function listOrders(restaurantId: string): Promise<readonly TrackedOrder[]> {
  return request<TrackedOrder[]>('/orders', { query: { restaurantId } });
}

export function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  return request<void>(`/orders/${id}/status`, { method: 'PATCH', body: { status } });
}

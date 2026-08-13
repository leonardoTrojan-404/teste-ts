import type { TrackedOrder, OrderStatus } from '../modules/orders/orderStatus';

const ENDPOINT = '/api/orders';

export async function listOrders(restaurantId: string): Promise<readonly TrackedOrder[]> {
  const response = await fetch(`${ENDPOINT}?restaurantId=${restaurantId}`);
  if (!response.ok) {
    throw new Error(`failed to load orders: ${response.status}`);
  }
  return (await response.json()) as TrackedOrder[];
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const response = await fetch(`${ENDPOINT}/${id}/status`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error(`failed to update order ${id}: ${response.status}`);
  }
}

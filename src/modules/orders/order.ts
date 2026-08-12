export type OrderChannel = 'dine-in' | 'takeaway' | 'delivery';

export interface OrderItem {
  readonly sku: string;
  readonly name: string;
  readonly quantity: number;
  readonly unitPriceCents: number;
}

export interface Order {
  readonly id: string;
  readonly restaurantId: string;
  readonly channel: OrderChannel;
  readonly items: readonly OrderItem[];
  readonly placedAt: string;
}

export function createOrder(input: Omit<Order, 'id' | 'placedAt'>, id: string, now: Date): Order {
  if (input.items.length === 0) {
    throw new Error('an order must contain at least one item');
  }
  return { ...input, id, placedAt: now.toISOString() };
}

export function orderSubtotalCents(order: Order): number {
  return order.items.reduce((total, item) => total + item.unitPriceCents * item.quantity, 0);
}

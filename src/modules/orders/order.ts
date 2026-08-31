export type OrderChannel = 'dine-in' | 'takeaway' | 'delivery';

export interface OrderItem {
  readonly sku: string;
  readonly name: string;
  readonly quantity: number;
  readonly unitPriceCents: number;
  readonly discountCents?: number;
}

export interface OrderCharges {
  readonly deliveryFeeCents: number;
  readonly serviceFeeCents: number;
}

export const NO_CHARGES: OrderCharges = { deliveryFeeCents: 0, serviceFeeCents: 0 };

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
  return order.items.reduce((total, item) => {
    const gross = item.unitPriceCents * item.quantity;
    const discount = (item.discountCents ?? 0) * item.quantity;
    return total + Math.max(0, gross - discount);
  }, 0);
}

/**
 * The amount the customer actually owes. Call sites used to print the subtotal
 * and call it the total, which silently dropped delivery and service fees.
 */
export function orderTotalCents(order: Order, charges: OrderCharges = NO_CHARGES): number {
  const fees = order.channel === 'delivery' ? charges.deliveryFeeCents : 0;
  return orderSubtotalCents(order) + fees + charges.serviceFeeCents;
}

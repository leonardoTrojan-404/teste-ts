import type { Order } from './order';

export const ORDER_STATUSES = [
  'received',
  'in-kitchen',
  'ready',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

const TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  received: ['in-kitchen', 'cancelled'],
  'in-kitchen': ['ready', 'cancelled'],
  ready: ['delivered'],
  delivered: [],
  cancelled: [],
};

export interface TrackedOrder extends Order {
  readonly status: OrderStatus;
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export function transition(order: TrackedOrder, to: OrderStatus): TrackedOrder {
  if (!canTransition(order.status, to)) {
    throw new Error(`illegal order transition: ${order.status} -> ${to}`);
  }
  return { ...order, status: to };
}

const TERMINAL_STATUSES: readonly OrderStatus[] = ['delivered', 'cancelled'];

export function filterByStatus(
  orders: readonly TrackedOrder[],
  statuses: readonly OrderStatus[],
): readonly TrackedOrder[] {
  if (statuses.length === 0) {
    return orders;
  }
  return orders.filter((order) => statuses.includes(order.status));
}

/**
 * The floor view asks for "active" orders. Passing a single status could never
 * express that, so callers were falling back to the unfiltered list and showing
 * cancelled orders next to live ones.
 */
export function filterActive(orders: readonly TrackedOrder[]): readonly TrackedOrder[] {
  return orders.filter((order) => !TERMINAL_STATUSES.includes(order.status));
}

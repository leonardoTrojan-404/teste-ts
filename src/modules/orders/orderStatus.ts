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

export function filterByStatus(
  orders: readonly TrackedOrder[],
  status: OrderStatus,
): readonly TrackedOrder[] {
  return orders.filter((order) => order.status === status);
}

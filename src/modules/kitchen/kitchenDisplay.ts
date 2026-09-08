import type { TrackedOrder } from '../orders/orderStatus';
import { filterByStatus } from '../orders/orderStatus';

export interface KitchenTicket {
  readonly orderId: string;
  readonly lines: readonly string[];
  readonly placedAt: string;
  readonly channel: TrackedOrder['channel'];
}

export const KITCHEN_STATUSES = ['received', 'in-kitchen'] as const;

export function ticketsFor(orders: readonly TrackedOrder[]): readonly KitchenTicket[] {
  return filterByStatus(orders, [...KITCHEN_STATUSES]).map((order) => ({
    orderId: order.id,
    lines: order.items.map((item) => `${item.quantity}x ${item.name}`),
    placedAt: order.placedAt,
    channel: order.channel,
  }));
}

export function sortByAge(tickets: readonly KitchenTicket[]): readonly KitchenTicket[] {
  return [...tickets].sort((a, b) => Date.parse(a.placedAt) - Date.parse(b.placedAt));
}

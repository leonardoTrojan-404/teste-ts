import type { TrackedOrder, OrderStatus } from '../orders/orderStatus';
import type { Notification, NotificationLevel } from './notification';

const LEVEL_BY_STATUS: Readonly<Record<OrderStatus, NotificationLevel>> = {
  received: 'info',
  'in-kitchen': 'info',
  ready: 'warning',
  delivered: 'info',
  cancelled: 'critical',
};

export function notificationForStatusChange(
  order: TrackedOrder,
  previous: OrderStatus,
  now: Date,
): Notification {
  return {
    id: `${order.id}:${order.status}`,
    level: LEVEL_BY_STATUS[order.status],
    title: `Order #${order.id} is ${order.status}`,
    body: `Moved from ${previous} to ${order.status}.`,
    createdAt: now.toISOString(),
  };
}

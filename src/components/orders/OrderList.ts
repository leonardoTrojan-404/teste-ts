import type { TrackedOrder } from '../../modules/orders/orderStatus';
import { orderTotalCents } from '../../modules/orders/order';

export interface OrderListProps {
  readonly orders: readonly TrackedOrder[];
  readonly onSelect: (id: string) => void;
}

export function renderOrderList(props: OrderListProps): string {
  if (props.orders.length === 0) {
    return '<p class="orders-empty">No orders yet.</p>';
  }

  const rows = props.orders.map(
    (order) => `
    <li class="order-row" data-id="${order.id}" data-status="${order.status}">
      <span class="order-row__id">#${order.id}</span>
      <span class="order-row__channel">${order.channel}</span>
      <span class="order-row__total">${(orderTotalCents(order) / 100).toFixed(2)}</span>
    </li>`,
  );

  return `<ul class="order-list">${rows.join('')}</ul>`;
}

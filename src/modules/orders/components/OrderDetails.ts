import type { TrackedOrder } from '../orderStatus';
import { ORDER_STATUSES, canTransition } from '../orderStatus';
import { orderTotalCents } from '../order';

export interface OrderDetailsProps {
  readonly order: TrackedOrder;
}

export function renderOrderDetails({ order }: OrderDetailsProps): string {
  const items = order.items
    .map((item) => `<li>${item.quantity}x ${item.name}</li>`)
    .join('');

  const actions = ORDER_STATUSES.filter((status) => canTransition(order.status, status))
    .map((status) => `<button data-action="${status}">${status}</button>`)
    .join('');

  return `
    <article class="order-details">
      <h2>Order #${order.id}</h2>
      <p class="order-details__status">${order.status}</p>
      <ul class="order-details__items">${items}</ul>
      <p class="order-details__total">${(orderTotalCents(order) / 100).toFixed(2)}</p>
      <footer class="order-details__actions">${actions}</footer>
    </article>`;
}

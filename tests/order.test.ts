import { describe, expect, test } from 'vitest';
import {
  createOrder,
  orderSubtotalCents,
  orderTotalCents,
  type Order,
  type OrderCharges,
} from '../src/modules/orders/order';

const CHARGES: OrderCharges = { deliveryFeeCents: 700, serviceFeeCents: 150 };

function order(overrides: Partial<Order> = {}): Order {
  return {
    id: 'o-1',
    restaurantId: 'r-1',
    channel: 'delivery',
    placedAt: '2026-08-30T19:00:00.000Z',
    items: [
      { sku: 'pizza', name: 'Pizza', quantity: 2, unitPriceCents: 4500 },
      { sku: 'soda', name: 'Soda', quantity: 1, unitPriceCents: 800, discountCents: 300 },
    ],
    ...overrides,
  };
}

describe('order totals — regression coverage for the 2026-08-30 incident', () => {
  test('applies per-item discounts to the subtotal', () => {
    expect(orderSubtotalCents(order())).toBe(4500 * 2 + (800 - 300));
  });

  test('adds the delivery fee for delivery orders', () => {
    expect(orderTotalCents(order(), CHARGES)).toBe(9500 + 700 + 150);
  });

  test('does not charge a delivery fee for dine-in orders', () => {
    expect(orderTotalCents(order({ channel: 'dine-in' }), CHARGES)).toBe(9500 + 150);
  });

  test('never lets a discount push an item below zero', () => {
    const free = order({
      items: [{ sku: 'x', name: 'X', quantity: 1, unitPriceCents: 500, discountCents: 900 }],
    });
    expect(orderSubtotalCents(free)).toBe(0);
  });

  test('rejects an order with no items', () => {
    expect(() =>
      createOrder({ restaurantId: 'r-1', channel: 'dine-in', items: [] }, 'o-2', new Date()),
    ).toThrow(/at least one item/);
  });
});

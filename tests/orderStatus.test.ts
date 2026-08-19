import { describe, expect, test } from 'vitest';
import {
  canTransition,
  filterActive,
  filterByStatus,
  transition,
  type TrackedOrder,
} from '../src/modules/orders/orderStatus';

function order(id: string, status: TrackedOrder['status']): TrackedOrder {
  return {
    id,
    restaurantId: 'r1',
    channel: 'dine-in',
    items: [{ sku: 'sku-1', name: 'Pizza', quantity: 1, unitPriceCents: 4500 }],
    placedAt: '2026-08-18T12:00:00.000Z',
    status,
  };
}

describe('order status transitions', () => {
  test('allows the happy path through the kitchen', () => {
    expect(canTransition('received', 'in-kitchen')).toBe(true);
    expect(canTransition('in-kitchen', 'ready')).toBe(true);
    expect(canTransition('ready', 'delivered')).toBe(true);
  });

  test('rejects moving backwards from a terminal status', () => {
    expect(() => transition(order('1', 'delivered'), 'received')).toThrow(
      /illegal order transition/,
    );
  });
});

describe('order filtering', () => {
  const orders = [
    order('1', 'received'),
    order('2', 'in-kitchen'),
    order('3', 'cancelled'),
    order('4', 'delivered'),
  ];

  test('returns only the requested statuses', () => {
    expect(filterByStatus(orders, ['received', 'in-kitchen']).map((o) => o.id)).toEqual(['1', '2']);
  });

  test('returns every order when no status is requested', () => {
    expect(filterByStatus(orders, [])).toHaveLength(4);
  });

  test('excludes cancelled and delivered orders from the active list', () => {
    expect(filterActive(orders).map((o) => o.id)).toEqual(['1', '2']);
  });
});

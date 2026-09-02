import { describe, expect, test, vi } from 'vitest';
import { createNotificationService } from '../src/services/notificationService';
import type { Notification } from '../src/modules/notifications/notification';

function notification(id: string, createdAt: string): Notification {
  return { id, level: 'warning', title: 'Order ready', body: 'Table 4', createdAt };
}

describe('notification deduplication', () => {
  test('suppresses an identical notification inside the window', () => {
    const service = createNotificationService();
    const listener = vi.fn();
    service.subscribe(listener);

    expect(service.publish(notification('o-1:ready', '2026-09-01T12:00:00.000Z'))).toBe(true);
    expect(service.publish(notification('o-1:ready', '2026-09-01T12:00:05.000Z'))).toBe(false);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('allows the same notification again once the window has passed', () => {
    const service = createNotificationService({ dedupeWindowMs: 1_000 });
    const listener = vi.fn();
    service.subscribe(listener);

    service.publish(notification('o-1:ready', '2026-09-01T12:00:00.000Z'));
    service.publish(notification('o-1:ready', '2026-09-01T12:00:30.000Z'));

    expect(listener).toHaveBeenCalledTimes(2);
  });

  test('never suppresses notifications for different orders', () => {
    const service = createNotificationService();
    const listener = vi.fn();
    service.subscribe(listener);

    service.publish(notification('o-1:ready', '2026-09-01T12:00:00.000Z'));
    service.publish(notification('o-2:ready', '2026-09-01T12:00:01.000Z'));

    expect(listener).toHaveBeenCalledTimes(2);
  });

  test('stops delivering after unsubscribe', () => {
    const service = createNotificationService();
    const listener = vi.fn();
    const unsubscribe = service.subscribe(listener);

    unsubscribe();
    service.publish(notification('o-3:ready', '2026-09-01T12:00:00.000Z'));

    expect(service.listenerCount()).toBe(0);
    expect(listener).not.toHaveBeenCalled();
  });
});

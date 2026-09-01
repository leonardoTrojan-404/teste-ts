import type { Notification } from '../modules/notifications/notification';
import { DEDUPE_WINDOW_MS, isDuplicate } from '../modules/notifications/notification';

type Listener = (notification: Notification) => void;

export interface NotificationServiceOptions {
  readonly dedupeWindowMs?: number;
  readonly historyLimit?: number;
}

const DEFAULT_HISTORY_LIMIT = 50;

export function createNotificationService(options: NotificationServiceOptions = {}) {
  const listeners = new Set<Listener>();
  const windowMs = options.dedupeWindowMs ?? DEDUPE_WINDOW_MS;
  const historyLimit = options.historyLimit ?? DEFAULT_HISTORY_LIMIT;
  let recent: readonly Notification[] = [];

  return {
    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    /** Returns false when the notification was suppressed as a duplicate. */
    publish(notification: Notification): boolean {
      if (isDuplicate(notification, recent, windowMs)) {
        return false;
      }
      recent = [notification, ...recent].slice(0, historyLimit);
      for (const listener of listeners) {
        listener(notification);
      }
      return true;
    },
    listenerCount(): number {
      return listeners.size;
    },
  };
}

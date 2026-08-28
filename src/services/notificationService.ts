import type { Notification } from '../modules/notifications/notification';

type Listener = (notification: Notification) => void;

export function createNotificationService() {
  const listeners = new Set<Listener>();

  return {
    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    publish(notification: Notification): void {
      for (const listener of listeners) {
        listener(notification);
      }
    },
    listenerCount(): number {
      return listeners.size;
    },
  };
}

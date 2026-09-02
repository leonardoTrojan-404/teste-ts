export type NotificationLevel = 'info' | 'warning' | 'critical';

export interface Notification {
  readonly id: string;
  readonly level: NotificationLevel;
  readonly title: string;
  readonly body: string;
  readonly createdAt: string;
}

export const AUTO_DISMISS_MS: Readonly<Record<NotificationLevel, number>> = {
  info: 4_000,
  warning: 8_000,
  critical: 0,
};

export function shouldAutoDismiss(notification: Notification): boolean {
  return AUTO_DISMISS_MS[notification.level] > 0;
}

export const DEDUPE_WINDOW_MS = 30_000;

/**
 * Two subscribers can observe the same status change (the order list and the
 * dashboard both poll), which produced two identical toasts. Notifications are
 * keyed by `orderId:status`, so identity is enough — but a genuine re-entry
 * into the same status minutes later is a different event, hence the window.
 */
export function isDuplicate(
  candidate: Notification,
  seen: readonly Notification[],
  windowMs: number = DEDUPE_WINDOW_MS,
): boolean {
  const candidateAt = Date.parse(candidate.createdAt);
  return seen.some(
    (notification) =>
      notification.id === candidate.id &&
      candidateAt - Date.parse(notification.createdAt) < windowMs,
  );
}

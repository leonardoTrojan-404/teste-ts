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

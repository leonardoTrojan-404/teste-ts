import type { Notification } from '../notification';
import { AUTO_DISMISS_MS, shouldAutoDismiss } from '../notification';

export interface ToastStackProps {
  readonly notifications: readonly Notification[];
  readonly maxVisible: number;
}

export function renderToastStack(props: ToastStackProps): string {
  const visible = props.notifications.slice(0, props.maxVisible);

  const toasts = visible.map(
    (notification) => `
    <li class="toast toast--${notification.level}"
        data-id="${notification.id}"
        data-dismiss-after="${shouldAutoDismiss(notification) ? AUTO_DISMISS_MS[notification.level] : ''}">
      <strong class="toast__title">${notification.title}</strong>
      <p class="toast__body">${notification.body}</p>
    </li>`,
  );

  return `<ul class="toast-stack" role="status" aria-live="polite">${toasts.join('')}</ul>`;
}

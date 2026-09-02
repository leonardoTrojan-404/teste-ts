import { ApiError } from './apiClient';

export type AlertSeverity = 'page' | 'ticket' | 'log';

export interface Alert {
  readonly severity: AlertSeverity;
  readonly channel: string;
  readonly summary: string;
}

const PAGE_ON_STATUS: readonly number[] = [408, 502, 503, 504];

/**
 * We found out about the payment outage from a restaurant owner on the phone.
 * Gateway failures now raise an alert on their own.
 */
export function alertFor(error: unknown): Alert | undefined {
  if (!(error instanceof ApiError)) {
    return undefined;
  }

  const isPayment = error.path.startsWith('/payments');
  if (isPayment && PAGE_ON_STATUS.includes(error.status)) {
    return {
      severity: 'page',
      channel: '#oncall-payments',
      summary: `payment gateway returned ${error.status} for ${error.path}`,
    };
  }

  if (error.status >= 500) {
    return { severity: 'ticket', channel: '#restaurant-os-errors', summary: error.message };
  }

  return { severity: 'log', channel: 'stdout', summary: error.message };
}

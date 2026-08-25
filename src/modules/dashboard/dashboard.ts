export interface DashboardWindow {
  readonly from: string;
  readonly to: string;
}

export interface DashboardSnapshot {
  readonly window: DashboardWindow;
  readonly openOrders: number;
  readonly revenueCents: number;
  readonly averageTicketCents: number;
}

export type LoadState = 'idle' | 'loading' | 'ready' | 'error';

/**
 * The panel used to derive "is loading" from `snapshot === EMPTY_SNAPSHOT`,
 * which is also true on the first successful render of a quiet restaurant.
 * Loading is now tracked explicitly.
 */
export function nextLoadState(current: LoadState, event: 'fetch' | 'resolve' | 'reject'): LoadState {
  if (event === 'fetch') {
    return current === 'loading' ? current : 'loading';
  }
  return event === 'resolve' ? 'ready' : 'error';
}

export const EMPTY_SNAPSHOT: DashboardSnapshot = {
  window: { from: '', to: '' },
  openOrders: 0,
  revenueCents: 0,
  averageTicketCents: 0,
};

export function isStale(snapshot: DashboardSnapshot, now: Date, maxAgeMs: number): boolean {
  if (snapshot.window.to === '') {
    return true;
  }
  return now.getTime() - Date.parse(snapshot.window.to) > maxAgeMs;
}

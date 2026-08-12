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

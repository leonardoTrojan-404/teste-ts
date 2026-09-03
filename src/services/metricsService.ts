import type { DashboardSnapshot, DashboardWindow } from '../modules/dashboard/dashboard';
import { request } from './apiClient';

export interface RawMetricsRow {
  readonly bucket: string;
  readonly orders: number;
  readonly revenueCents: number;
}

export function aggregate(rows: readonly RawMetricsRow[], window: DashboardWindow): DashboardSnapshot {
  const orders = rows.reduce((total, row) => total + row.orders, 0);
  const revenueCents = rows.reduce((total, row) => total + row.revenueCents, 0);

  return {
    window,
    openOrders: orders,
    revenueCents,
    averageTicketCents: orders === 0 ? 0 : Math.round(revenueCents / orders),
  };
}

/**
 * The dashboard renders four widgets, each of which used to call fetchMetrics
 * with its own window — four round trips and four full table scans per refresh.
 * The backend accepts a list of windows, so ask once.
 */
export async function fetchMetricsBatch(
  restaurantId: string,
  windows: readonly DashboardWindow[],
): Promise<readonly DashboardSnapshot[]> {
  if (windows.length === 0) {
    return [];
  }

  const rowsByWindow = await request<Record<string, RawMetricsRow[]>>('/metrics/batch', {
    method: 'POST',
    body: { restaurantId, windows },
  });

  return windows.map((window) => aggregate(rowsByWindow[`${window.from}/${window.to}`] ?? [], window));
}

export async function fetchMetrics(
  restaurantId: string,
  window: DashboardWindow,
): Promise<DashboardSnapshot> {
  const [snapshot] = await fetchMetricsBatch(restaurantId, [window]);
  return snapshot ?? aggregate([], window);
}

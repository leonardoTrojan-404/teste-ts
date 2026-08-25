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

export async function fetchMetrics(
  restaurantId: string,
  window: DashboardWindow,
): Promise<DashboardSnapshot> {
  const rows = await request<RawMetricsRow[]>('/metrics', {
    query: { restaurantId, from: window.from, to: window.to },
  });
  return aggregate(rows, window);
}

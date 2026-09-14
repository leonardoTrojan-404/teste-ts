import type { RawMetricsRow } from '../../../services/metricsService';

export interface RevenueChartProps {
  readonly rows: readonly RawMetricsRow[];
  readonly heightPx: number;
}

const BAR_GAP_PX = 4;

export function renderRevenueChart(props: RevenueChartProps): string {
  if (props.rows.length === 0) {
    return '<p class="chart-empty">No revenue in this period.</p>';
  }

  const peak = Math.max(...props.rows.map((row) => row.revenueCents));
  const bars = props.rows.map((row) => {
    const ratio = peak === 0 ? 0 : row.revenueCents / peak;
    const height = Math.round(ratio * props.heightPx);
    return `<rect class="revenue-bar" data-bucket="${row.bucket}" height="${height}" />`;
  });

  return `
    <svg class="revenue-chart" height="${props.heightPx}" data-gap="${BAR_GAP_PX}">
      ${bars.join('')}
    </svg>`;
}

import type { RetentionBreakdown } from '../../modules/insights/retention';
import { retentionRate } from '../../modules/insights/retention';

const SEGMENT_ORDER = ['new', 'occasional', 'regular', 'lapsed'] as const;

export interface CohortChartProps {
  readonly breakdowns: readonly RetentionBreakdown[];
  readonly heightPx: number;
}

export function renderCohortChart(props: CohortChartProps): string {
  if (props.breakdowns.length === 0) {
    return '<p class="cohort-empty">Not enough order history yet.</p>';
  }

  const peak = Math.max(...props.breakdowns.map((row) => row.customers));
  const ordered = SEGMENT_ORDER.flatMap((segment) =>
    props.breakdowns.filter((row) => row.segment === segment),
  );

  const bars = ordered.map((row) => {
    const height = peak === 0 ? 0 : Math.round((row.customers / peak) * props.heightPx);
    return `<rect class="cohort-bar cohort-bar--${row.segment}" height="${height}" data-customers="${row.customers}" />`;
  });

  const rate = Math.round(retentionRate(props.breakdowns) * 100);

  return `
    <figure class="cohort-chart">
      <svg height="${props.heightPx}" role="img" aria-label="Customers by segment">${bars.join('')}</svg>
      <figcaption class="cohort-chart__rate">${rate}% retained</figcaption>
    </figure>`;
}

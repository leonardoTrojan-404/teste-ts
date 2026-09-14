import type { DashboardSnapshot, LoadState } from '../dashboard';
import { isStale } from '../dashboard';

const STALE_AFTER_MS = 60_000;

export interface LiveOrdersPanelProps {
  readonly snapshot: DashboardSnapshot;
  readonly loadState: LoadState;
  readonly now: Date;
}

export function renderLiveOrdersPanel(props: LiveOrdersPanelProps): string {
  if (props.loadState === 'loading') {
    return '<section class="live-orders live-orders--loading" aria-busy="true"></section>';
  }

  const stale = isStale(props.snapshot, props.now, STALE_AFTER_MS);

  return `
    <section class="live-orders" data-stale="${stale}">
      <h3>Live orders</h3>
      <p class="live-orders__count">${props.snapshot.openOrders}</p>
      <p class="live-orders__ticket">${(props.snapshot.averageTicketCents / 100).toFixed(2)}</p>
      ${stale ? '<p class="live-orders__warning">Data may be out of date</p>' : ''}
    </section>`;
}

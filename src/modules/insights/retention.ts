import type { CustomerProfile, SegmentId } from './segment';
import { segmentOf } from './segment';

export interface RetentionBreakdown {
  readonly segment: SegmentId;
  readonly customers: number;
  readonly revenueCents: number;
}

export function breakdown(
  profiles: readonly CustomerProfile[],
  now: Date,
): readonly RetentionBreakdown[] {
  const buckets = new Map<SegmentId, { customers: number; revenueCents: number }>();

  for (const profile of profiles) {
    const segment = segmentOf(profile, now);
    const current = buckets.get(segment) ?? { customers: 0, revenueCents: 0 };
    buckets.set(segment, {
      customers: current.customers + 1,
      revenueCents: current.revenueCents + profile.lifetimeValueCents,
    });
  }

  return [...buckets.entries()].map(([segment, totals]) => ({ segment, ...totals }));
}

export function retentionRate(breakdowns: readonly RetentionBreakdown[]): number {
  const total = breakdowns.reduce((sum, row) => sum + row.customers, 0);
  if (total === 0) {
    return 0;
  }
  const retained = breakdowns
    .filter((row) => row.segment === 'regular' || row.segment === 'occasional')
    .reduce((sum, row) => sum + row.customers, 0);

  return retained / total;
}

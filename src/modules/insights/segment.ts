export type SegmentId = 'new' | 'occasional' | 'regular' | 'lapsed';

export interface CustomerProfile {
  readonly customerId: string;
  readonly orderCount: number;
  readonly lastOrderAt: string;
  readonly lifetimeValueCents: number;
}

const REGULAR_MIN_ORDERS = 8;
const OCCASIONAL_MIN_ORDERS = 3;
const LAPSED_AFTER_DAYS = 90;
const MS_PER_DAY = 86_400_000;

export function daysSinceLastOrder(profile: CustomerProfile, now: Date): number {
  return Math.floor((now.getTime() - Date.parse(profile.lastOrderAt)) / MS_PER_DAY);
}

export function segmentOf(profile: CustomerProfile, now: Date): SegmentId {
  if (daysSinceLastOrder(profile, now) > LAPSED_AFTER_DAYS) {
    return 'lapsed';
  }
  if (profile.orderCount >= REGULAR_MIN_ORDERS) {
    return 'regular';
  }
  if (profile.orderCount >= OCCASIONAL_MIN_ORDERS) {
    return 'occasional';
  }
  return 'new';
}

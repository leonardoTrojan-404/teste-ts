import type { CustomerProfile } from './segment';
import { daysSinceLastOrder, segmentOf } from './segment';

export type ChurnRisk = 'low' | 'medium' | 'high';

export interface ChurnScore {
  readonly customerId: string;
  readonly risk: ChurnRisk;
  /** 0..1, higher means more likely to stop ordering. */
  readonly score: number;
  readonly reasons: readonly string[];
}

const RECENCY_CEILING_DAYS = 120;

/**
 * Deliberately a transparent heuristic, not a model. An owner will act on this
 * only if they can see why a name is on the list, and right now we have neither
 * the data volume nor the labels to train anything honest.
 */
export function scoreChurn(profile: CustomerProfile, now: Date): ChurnScore {
  const reasons: string[] = [];
  const recency = Math.min(daysSinceLastOrder(profile, now), RECENCY_CEILING_DAYS);
  const recencyScore = recency / RECENCY_CEILING_DAYS;

  if (recency > 45) {
    reasons.push(`no order in ${recency} days`);
  }

  const frequencyScore = profile.orderCount >= 8 ? 0 : 1 - profile.orderCount / 8;
  if (profile.orderCount < 3) {
    reasons.push('fewer than three orders ever');
  }

  const segment = segmentOf(profile, now);
  if (segment === 'lapsed') {
    reasons.push('already lapsed');
  }

  const score = Math.min(1, recencyScore * 0.65 + frequencyScore * 0.35);
  const risk: ChurnRisk = score >= 0.66 ? 'high' : score >= 0.33 ? 'medium' : 'low';

  return { customerId: profile.customerId, risk, score, reasons };
}

export function highRisk(
  profiles: readonly CustomerProfile[],
  now: Date,
): readonly ChurnScore[] {
  return profiles
    .map((profile) => scoreChurn(profile, now))
    .filter((entry) => entry.risk === 'high')
    .sort((a, b) => b.score - a.score);
}

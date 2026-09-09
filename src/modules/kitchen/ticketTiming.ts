import type { KitchenTicket } from './kitchenDisplay';

export type TimingBand = 'fresh' | 'warning' | 'late';

const WARNING_AFTER_MS = 8 * 60_000;
const LATE_AFTER_MS = 15 * 60_000;

export function ageMs(ticket: KitchenTicket, now: Date): number {
  return now.getTime() - Date.parse(ticket.placedAt);
}

export function bandFor(ticket: KitchenTicket, now: Date): TimingBand {
  const age = ageMs(ticket, now);
  if (age >= LATE_AFTER_MS) {
    return 'late';
  }
  return age >= WARNING_AFTER_MS ? 'warning' : 'fresh';
}

/**
 * Open question for the kitchen trial: the thresholds are flat, but a burger
 * and a slow-cooked rib should clearly not turn red at the same moment.
 */
export function countByBand(
  tickets: readonly KitchenTicket[],
  now: Date,
): Readonly<Record<TimingBand, number>> {
  return tickets.reduce<Record<TimingBand, number>>(
    (counts, ticket) => {
      const band = bandFor(ticket, now);
      return { ...counts, [band]: counts[band] + 1 };
    },
    { fresh: 0, warning: 0, late: 0 },
  );
}

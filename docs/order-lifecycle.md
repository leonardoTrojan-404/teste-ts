# Order lifecycle

An order moves through a small, deliberately rigid state machine. The table in
`src/modules/orders/orderStatus.ts` is the single source of truth — this
document explains the reasoning behind it.

```
received ──> in-kitchen ──> ready ──> delivered
   │              │
   └──────────────┴──> cancelled
```

## Rules

- **received** — the order exists and is billable. Can still be cancelled.
- **in-kitchen** — the kitchen accepted it. Cancelling from here is allowed but
  has to be reported, because ingredients were already consumed.
- **ready** — plated and waiting. Cancelling is no longer possible; a mistake at
  this point becomes a refund, which is a different flow.
- **delivered** / **cancelled** — terminal.

## Why a table and not a switch

Three consumers need the same rules: the order details view, the (upcoming)
kitchen display, and the reporting job that counts cancellations. A lookup table
can be read by all of them without duplicating the branching logic.

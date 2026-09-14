# Release notes

## v1.0.0 — 11 September 2026

First stable release. Five weeks in, restaurant-os covers a full service day:
orders arrive, the kitchen sees them, the menu is editable by the people who own
it, and the owner can tell at the end of the night what actually happened.

### Added

- **Orders** — intake, a validated status lifecycle, list and details views
- **Menu** — categories, item editor, per-item availability, locale-correct pricing
- **Dashboard** — live orders panel, revenue chart, batched metrics
- **Notifications** — level-based toasts with duplicate suppression
- **Dark mode** — token-driven, defaulting to the system preference

### Changed

- All HTTP traffic goes through a single client with bounded timeouts
- Single-module views were colocated with their domain logic
- Layout is composed from `Surface` and `Stack` primitives

### Fixed

- Order totals ignored delivery fees and per-item discounts ([postmortem](incidents/2026-09-02-payment-timeouts.md) covers the related outage)
- Payment requests could hang indefinitely, leaving paid orders invisible to the kitchen
- The dashboard could get stuck on its loading skeleton for a quiet restaurant
- Cancelled orders appeared in the active orders list
- Duplicate notifications for a single status change
- Menu prices rendered as raw division (`R$ 8.5`)

### Performance

| Metric             | v0.3.0 | v1.0.0 |
| ------------------ | ------ | ------ |
| p95 dashboard load | 2.9s   | 0.8s   |
| Requests / refresh | 4      | 1      |

### Known gaps

- No reconciliation for charged-but-not-received orders (tracked in the postmortem)
- Customer insights, the AI assistant and the store refactor are still in flight
- Kitchen mode was prototyped and deliberately shelved until the menu carries prep times

---

## v0.3.0 — 19 August 2026

Restaurant dashboard: metrics aggregation, revenue chart, live orders panel.

## v0.2.0 — 14 August 2026

Order management: domain model, status lifecycle, list and details views.

## v0.1.0 — 11 August 2026

Project skeleton, application shell and routing.

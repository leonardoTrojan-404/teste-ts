# Postmortem — payment gateway timeouts

**Date:** 2 September 2026
**Duration:** 19:10 – 19:52 (42 minutes)
**Authors:** Rafael Souza, Leo Martins
**Status:** resolved

## Summary

Card settlements against the payment provider stopped completing. Customers were
charged, the gateway never responded, and the corresponding orders stayed in
`received` — so the kitchen never saw them. 31 orders across 6 restaurants were
affected.

## Timeline (BRT)

| Time  | Event                                                                 |
| ----- | --------------------------------------------------------------------- |
| 19:10 | Provider latency starts climbing; no alert fires                       |
| 19:26 | A restaurant owner calls support: "paid orders are not reaching us"    |
| 19:33 | On-call engaged, reproduces a hanging checkout in staging              |
| 19:40 | Root cause identified: `apiClient.request()` has no timeout            |
| 19:47 | `hotfix/payment-timeout` opened                                        |
| 19:52 | Fix deployed; stuck orders replayed manually                           |

## Root cause

`apiClient.request()` awaited `fetch()` with no abort signal. When the upstream
connection stalled, the returned promise never settled. Nothing downstream —
retry, error toast, status rollback — could run, because no rejection ever
arrived. The failure mode was not "payments are slow", it was "the application
is waiting forever and looks fine".

## What went wrong

1. **No timeout.** The API client was written against a happy path where the
   backend is on the same machine.
2. **No alerting.** We heard about a production outage from a customer. Nothing
   in our own stack noticed for 16 minutes.
3. **A charge and an order status could disagree.** The system had no way to
   detect that divergence, let alone reconcile it.

## What went right

- Once someone looked, root cause took 7 minutes.
- The fix was small and well-scoped; no rollback was needed.

## Action items

| Action                                                        | Owner   | Status |
| ------------------------------------------------------------- | ------- | ------ |
| Bound every HTTP request with an abort signal                  | Rafael  | done   |
| Page on-call for 408/502/503/504 from `/payments/*`            | Rafael  | done   |
| Reconciliation job: charged-but-not-received orders            | Leo     | open   |
| Synthetic checkout probe every 60s                             | Ana     | open   |
| Review every other unbounded I/O call site                     | Marina  | open   |

## Lesson

A request with no timeout is not a fast request. It is an outage that has not
been declared yet.

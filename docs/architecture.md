# Architecture

The codebase is organised by feature, not by file type.

```
src/
  app/         application shell, routing, composition root
  components/  cross-cutting presentational primitives only
    layout/    Surface, Stack, AppLayout
  modules/     one folder per bounded context
    orders/
      components/   views that only this module uses
      *.ts          domain logic
  services/    I/O: HTTP, persistence, external providers
```

## Rules

1. `modules/` may import from `components/layout/`, never the other way around.
2. A view used by exactly one module lives inside that module, next to the
   domain logic it renders. `components/` is reserved for primitives shared by
   two or more modules.
3. `components/` never talks to `services/` directly; the module layer does.
4. `app/` is the only place allowed to wire the layers together.

## Why views moved into modules

`components/orders/OrderList.ts` imported four things from
`modules/orders/`, and nothing outside the orders module ever imported it. The
folder boundary was pure ceremony: every change to the order domain meant
editing two distant trees. Colocating them makes the real coupling visible.

`components/menu/` has not moved yet — the price formatting fix is in flight on
another branch and moving the file underneath it would be unkind.

# Architecture

The codebase is organised by feature, not by file type.

```
src/
  app/         application shell, routing, composition root
  components/  presentational building blocks
  modules/     domain logic, one folder per bounded context
  services/    I/O: HTTP, persistence, external providers
```

## Rules

1. `modules/` never imports from `components/`.
2. `components/` never talks to `services/` directly; the module layer does.
3. `app/` is the only place allowed to wire the three together.

# Frontend architecture checks

The frontend follows the feature boundaries used by the Ágias frontend, adapted
to the radio product.

## Source boundaries

- `app/` composes providers, routes, layouts, and bootstrap behavior;
- `core/` contains reusable HTTP, session, query, UI, theme, and utility code;
- `features/` contains product capabilities such as authentication, radio, and
  news;
- `features/<feature>/public/index.ts` is the only cross-feature entry point;
- `features/<feature>/internal/` is private to that feature;
- `features/<feature>/use-cases/<flow>/Page.tsx` is the flow entry point.

## Commands

```bash
bun run check:architecture
bun run test:architecture
bun run metrics
```

The architecture check is part of `bun check`. Metrics are informational and
are written to `reports/architecture/`, which is intentionally ignored by Git.

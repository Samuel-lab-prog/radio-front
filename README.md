# Aurora FM Frontend

Frontend for the radio application, built with React, TypeScript, Vite, Bun,
TanStack Query, and Zustand.

The source layout follows the feature architecture used by the Ágias frontend,
adapted to the radio domain:

```text
src/
├── app/       # Composition, providers, routes, layouts, bootstrap
├── core/      # Shared HTTP, session, query, UI, theme, and utilities
└── features/  # Auth, home/radio, and news capabilities
```

Each feature may contain `public/`, `internal/`, and `use-cases/`. Its public
contract is `public/index.ts`; implementation details must remain inside the
feature.

The frontend uses the backend roles `admin` and `listener`. Academic roles and
features are not part of this application.

## Development

```bash
bun install
bun run dev
```

Set `VITE_API_URL` in `.env` using `.env.example` as a reference.

## Validation

```bash
bun check
bun run check:architecture
bun run metrics
```

The architecture checker validates source namespaces, feature public contracts,
dependency direction, fetch placement, role names, and empty directories

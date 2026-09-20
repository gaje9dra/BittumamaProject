# BittumamaProject

Production website foundation built with Next.js, React, TypeScript, App Router, ESLint, and Tailwind CSS.

## Requirements

- Node.js 24.21.0 LTS or newer
- npm 11.x or newer

The repository includes `.nvmrc` with the project Node.js version.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Verification

```bash
npm run lint
npm run build
```

## Architecture

The frontend uses a Next.js App Router with a `(marketing)` route group for public pages. Canonical content is stored in typed modules under `data/`, while relationships, metadata and validation are centralized in `lib/`.

```text
app/
  (marketing)/       public routes
  design-system/     development-only references
  layout.tsx
  error.tsx
  not-found.tsx

components/
  about/ articles/ contact/ events/ experts/
  home/ layout/ research/ services/
  ui/

data/
  services.ts
  research.ts
  expertise.ts
  articles.ts
  events.ts
  site-config.ts
  navigation.ts       compatibility re-export
  homepage.ts
  about.ts
  contact.ts

lib/
  content/
    relationships.ts
    validation.ts
  metadata.ts
  navigation.ts

docs/
  content-architecture.md
```

See `docs/content-architecture.md` for the current content ownership, relationship, metadata, validation and future-content rules.

## Current Phase

**Phase 8.2 — Canonical Services Database Migration.**

Phase 8.2 moves the canonical Phase 7 Services dataset into PostgreSQL and routes the existing Services experience through the server-side Prisma repository without changing the public UI, routes, or interaction design.

The current frontend architecture preserves the canonical Services, Research, Experts, Articles, Workshops/Events, Relationships, Navigation, Metadata and Validation systems. Backend, database, CMS, authentication, payments, advanced search, full SEO, dedicated performance, security hardening and deployment work remain outside the current phase.


## Phase 8.1 — PostgreSQL + Prisma

The project uses PostgreSQL as its canonical relational database and Prisma ORM 7.10.0 as the server-side data layer. Prisma 7 requires a PostgreSQL driver adapter and uses the generated client under `generated/prisma/`.

### Local database setup

1. Install and start PostgreSQL locally.
2. Create a development database. The project does not assume a particular database name, username, or password.
3. Copy `.env.example` to `.env.local`.
4. Set `DATABASE_URL` to your local PostgreSQL connection string.
5. Install dependencies:

```bash
npm install
```

6. Generate the Prisma client:

```bash
npm run prisma:generate
```

7. Apply the development migration:

```bash
npm run prisma:migrate
```

8. Inspect the database when needed:

```bash
npm run prisma:studio
```

### Prisma structure

```text
prisma/
  schema.prisma
  migrations/
    000000000000_init/
      migration.sql
    migration_lock.toml

lib/
  db/
    prisma.ts

prisma.config.ts
```

The Prisma client is created lazily by `getPrismaClient()` and kept as a development singleton to avoid creating unnecessary connection pools during Next.js hot reload. Prisma access is server-side only.

### Scripts

- `npm run prisma:generate` — generate the typed Prisma client.
- `npm run prisma:validate` — validate the Prisma schema.
- `npm run prisma:migrate` — create/apply local development migrations.
- `npm run prisma:deploy` — apply committed migrations in deployment environments.
- `npm run prisma:studio` — inspect the local database.

The Services frontend is now database-backed. The Phase 7 Services file remains only as an explicit migration/verification snapshot and is not used as a production Service read path. Research, Experts, Articles and Workshops remain outside Phase 8.2.

### Database safety

Never commit `.env` or `.env.local`. Never expose `DATABASE_URL` through a `NEXT_PUBLIC_` variable. If the database is not configured, the existing frontend can continue to render; attempting to use the Prisma data layer without `DATABASE_URL` produces a clear server-side configuration error.

Phase 8.1 does not introduce authentication, user accounts, admin UI, payments, CMS functionality, or API overbuild.


## Phase 8.2 — Canonical Services Database Migration

Services now follow:

```text
Services UI
  ↓
lib/services/repository.ts
  ↓
Prisma
  ↓
PostgreSQL
```

### Service ownership

- PostgreSQL owns persistent Service content.
- `lib/services/repository.ts` is the production Service access layer.
- `data/services.ts` contains the Phase 7 canonical snapshot only for deterministic migration and integrity verification.
- UI components consume the existing `Service` domain type and do not receive Prisma-generated types.
- UI state, responsive state, animations and interaction state remain outside PostgreSQL.

### Canonical Service migration

The import is idempotent and uses the canonical Service slug as its upsert key. Stable Phase 7 IDs are preserved. The canonical array order is persisted in the `Service.order` field.

Run against a configured PostgreSQL database:

```bash
npm run prisma:migrate
npm run prisma:seed
npm run services:verify
```

`services:verify` compares the database records with the Phase 7 canonical snapshot and reports count, unexpected-record, ID, slug, title, category, description, ordering, status, availability, structured-field and metadata mismatches.

### Public Service queries

The production repository exposes only the small read surface required by the current website:

- `getPublishedServices()`
- `getPublishedServiceById()`
- `getPublishedServiceBySlug()`
- `getPublishedServiceCategories()`
- `getRelatedPublishedServices()`

Public queries filter to `PUBLISHED` Services. Detail routes continue to use `/services/<slug>` and return the existing Next.js not-found flow for unknown or unpublished Services.

### Updating a Service at this stage

There is no Service admin/editor yet. For this phase, update the canonical migration snapshot and rerun the idempotent seed, then run the integrity verification. Future CMS/admin phases can establish database-native editing once those capabilities are explicitly introduced.

### Phase boundary

Phase 8.2 does not migrate Research, Experts, Articles, Workshops, About, Contact submissions, users, authentication, payments, CMS/admin functionality, or public APIs.

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

**Phase 8.1 — Database & Backend Foundation.**

Phase 8.1 adds the PostgreSQL + Prisma foundation underneath the existing Phase 7 frontend without migrating the current static content yet.

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

The current frontend continues to use the canonical Phase 7 static data modules. Phase 8.1 does not migrate the frontend to database-backed reads yet.

### Database safety

Never commit `.env` or `.env.local`. Never expose `DATABASE_URL` through a `NEXT_PUBLIC_` variable. If the database is not configured, the existing frontend can continue to render; attempting to use the Prisma data layer without `DATABASE_URL` produces a clear server-side configuration error.

Phase 8.1 does not introduce authentication, user accounts, admin UI, payments, CMS functionality, or API overbuild.

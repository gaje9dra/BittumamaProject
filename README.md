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

**Phase 7.12 — Content Architecture Cleanup, Documentation & Maintainability.**

The current frontend architecture preserves the canonical Services, Research, Experts, Articles, Workshops/Events, Relationships, Navigation, Metadata and Validation systems. Backend, database, CMS, authentication, payments, advanced search, full SEO, dedicated performance, security hardening and deployment work remain outside the current phase.

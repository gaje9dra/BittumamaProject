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

The project uses the Next.js App Router with a `(marketing)` route group for public-facing pages. The route group does not appear in public URLs.

```text
app/
├── (marketing)/
│   └── page.tsx
├── error.tsx
├── favicon.ico
├── globals.css
├── layout.tsx
└── not-found.tsx

components/
├── ui/
├── layout/
├── sections/
└── shared/

lib/
hooks/
types/
data/
config/

public/
├── images/
├── icons/
├── fonts/
└── assets/

prisma/
```

Future public routes can be added beneath `app/(marketing)/` without exposing the route-group name in URLs. Authentication, admin routes, APIs, database models, and domain-specific features are intentionally deferred to later phases.

## Current Phase

Phase 1.3 establishes the scalable folder architecture and minimal App Router error boundaries. Product design, branding, content, database, authentication, payments, and other application features are deferred to later phases.

# BittumamaProject

Production website foundation built with Next.js, React, TypeScript, App Router, ESLint, Tailwind CSS, PostgreSQL and Prisma.

## Requirements

- Node.js 24.21.0 LTS or newer
- npm 11.x or newer

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

## Database

PostgreSQL is the canonical persistence layer and Prisma is the server-side ORM. Keep `DATABASE_URL` server-only; never expose it through a `NEXT_PUBLIC_` variable.

The committed migrations are additive. Do not reset the database or rewrite historical migrations.

## Canonical content

The five canonical public content domains are database-backed:

- Services
- Research
- Experts
- Articles
- Workshops/Events

Phase 8.7 also provides centralized published-only relationship helpers and `npm run content:verify` for cross-content integrity checks.

## Phase 8.8 — Contact / Inquiry Backend

The existing Contact enquiry experience now follows:

```text
Existing Contact form
  ↓
server-side validation
  ↓
anti-spam checks
  ↓
POST /api/contact
  ↓
Contact inquiry repository
  ↓
Prisma
  ↓
PostgreSQL
  ↓
ContactInquiry
```

### ContactInquiry

The additive Prisma model stores only the fields currently submitted by the Contact form:

- stable database ID
- submission/created/updated timestamps
- name
- normalized email
- optional phone
- optional relation to a published Service
- message
- server-controlled status

The initial status is `NEW`. The available lifecycle values are `NEW`, `READ`, `IN_PROGRESS`, `RESOLVED`, and `SPAM`. There is no public status control or inquiry read API.

### Validation and security

Server-side validation is authoritative. The submission path enforces:

- required name, email, service and message
- bounded field lengths
- email and optional phone format validation
- published Service validation for selected Services
- explicit support for the existing `Other` selection without inventing a Service record
- JSON payload and request-size limits
- rejection of unexpected fields
- honeypot rejection
- lightweight submission-timing sanity check
- lightweight in-memory throttling for the current deployment architecture
- generic production errors without Prisma/database details

The in-memory limiter is intentionally not represented as a distributed production rate limiter. A shared limiter can be introduced later if the deployment architecture requires it.

No IP address, browser fingerprint, precise location, tracking identifier, or unnecessary inquiry metadata is persisted.

### Server/client boundary

`components/contact/contact-form.tsx` remains the client-side interaction surface. It submits to `app/api/contact/route.ts`. Prisma and database writes remain server-side in `lib/contact/repository.ts`.

The client receives only a small success/error result. The ContactInquiry record, internal ID, timestamps and status are never returned.

### Local verification

After configuring PostgreSQL:

```bash
npm run prisma:generate
npm run prisma:validate
npm run prisma:migrate
npm run contact:verify
npm run lint
npm run build
```

`contact:verify` uses synthetic development data only. It checks valid input, invalid input cases, a real PostgreSQL ContactInquiry insert, default status, stored fields and timestamps, then removes the synthetic record.

Manually test the Contact page with:

1. valid submission
2. invalid email
3. missing required field
4. oversized/long message
5. repeated submit click
6. honeypot behavior
7. mobile form
8. desktop form
9. success confirmation
10. database failure handling

No admin UI, authentication, CMS, payment, email provider, inquiry listing/search API, or inquiry dashboard is part of Phase 8.8. Data retention/deletion policy is also deferred to a future governance phase.

The homepage hero remains removed, and previously removed content remains removed.

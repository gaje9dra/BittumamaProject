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


## Phase 8.9 — Authentication & Authorization Foundation

Authentication uses the current Auth.js/NextAuth-compatible Next.js integration with the Prisma adapter. The locked Next.js, React, TypeScript and database stack remains unchanged.

Architecture:

Google OAuth → Auth.js → Prisma Adapter → User/Account/Session in PostgreSQL → USER/ADMIN role → server-side authorization helpers.

The initial provider surface is intentionally limited to Google. No password login, magic link, GitHub, Facebook, Apple or Microsoft provider was added.

### Authentication schema

- `User` — stable identity, optional profile fields and controlled `UserRole`.
- `Account` — provider identity and adapter-managed provider data.
- `Session` — database-backed sessions.
- `VerificationToken` — adapter-compatible verification-token storage.
- `UserRole` — `USER` or `ADMIN`.
- `ContactInquiry.userId` — optional trusted relation for authenticated submissions.

New users default to `USER`. Browser input cannot assign `ADMIN`.

### Server-side helpers

`lib/auth/guards.ts` provides `getCurrentSession()`, `getCurrentUser()`, `requireAuthenticatedUser()`, and `requireAdmin()`. Identity and role are derived from the trusted Auth.js server session; URL parameters, localStorage, hidden fields and browser-supplied user IDs are not trusted.

### Minimal test surfaces

- `/login` — concise Google sign-in entry point.
- `/auth-test` — authenticated-session verification surface.
- `/auth-test/admin` — server-side admin-guard verification surface.

These are foundation/test surfaces, not user or admin dashboards. Public routes remain public, including Home, Services, Research, Experts, Articles, Workshops/Events, About and Contact. The homepage hero remains removed.

### Environment

Configure `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET` from `.env.example`. Never use `NEXT_PUBLIC_` for authentication secrets.

Generate a strong Auth.js secret with `npx auth secret`.

For local Google OAuth, configure the provider with the callback URL `http://localhost:3000/api/auth/callback/google`. For production, configure the exact deployed origin as `https://YOUR-PRODUCTION-DOMAIN/api/auth/callback/google`; no production domain is hardcoded by this phase.

### Development

1. Configure PostgreSQL and `DATABASE_URL`.
2. Configure `AUTH_SECRET`.
3. Configure the Google OAuth application and credentials.
4. Run `npm run prisma:generate`, `npm run prisma:validate`, and `npm run prisma:migrate`.
5. Run `npm run dev`.
6. Open `/login` and complete a real Google sign-in.
7. Verify `/auth-test` and test that `/auth-test/admin` is denied for a normal `USER`.

A real OAuth login is only considered tested when the provider credentials are available and the full Google → callback → User → Account → Session flow has actually completed.

### Admin bootstrap

There is no admin UI and no automatic first-user promotion. To intentionally promote an existing authenticated user for development, set `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_CONFIRM=YES`, then run `npm run auth:bootstrap-admin`. The script only updates an existing database User; it never creates a user or reads a role from the browser.

### Verification

`npm run auth:verify` uses synthetic development data to check the default `USER` role, provider-account uniqueness, Account persistence, Session persistence, and the optional ContactInquiry user relation. It does not claim to perform a real Google OAuth login.

### Contact integration

Contact remains anonymous-capable. For an authenticated submission, the server may associate `ContactInquiry.userId` with the current Auth.js session user. The browser cannot submit or override `userId`.

### Phase 8.9 security boundaries

Implemented: Auth.js-managed OAuth/session handling, database sessions, server-side role checks, controlled roles, same-origin redirect validation, no public User/Account/Session API, server-only secrets/Prisma, and additive migration only.

Not implemented: admin dashboard, CMS, content editing, inquiry management UI, payments, subscriptions, event registration, analytics dashboard, user account dashboard, or role-management UI.

## Phase 8.10 — Protected Admin Foundation & Admin Shell

The protected admin foundation is now implemented on top of the Phase 8.9 authentication and authorization system.

### Admin architecture

```
ADMIN USER
  ↓
Auth.js session
  ↓
server-side requireAdmin()
  ↓
/admin protected layout
  ↓
Admin shell
  ↓
future admin modules
```

The canonical admin entry point is `/admin`. The protected layout calls the existing `requireAdmin()` helper before rendering any admin shell content. Anonymous users are redirected into the existing `/login` flow with a safe `/admin` callback. Authenticated non-admin users receive a not-found response rather than an authorization detail. Administrators are allowed through.

No client-side role check is used as the security boundary.

### Admin shell

The shell contains:

- dedicated admin header/navigation
- desktop sidebar
- compact mobile navigation
- trusted administrator name/email display
- existing Auth.js sign-out action
- main admin content region
- accessible focus states and keyboard navigation
- restrained operational styling

Only the `Overview` destination is exposed because it is the only implemented admin module. No fake Content, Inquiries, Media or Settings links are presented as functional routes.

### Overview data

`/admin` shows only real PostgreSQL/Prisma counts for:

- Services
- Research
- Experts
- Articles
- Workshops / Events
- Contact inquiries

The counts use direct Prisma `count()` operations and are executed server-side in parallel. Records are not loaded into memory merely to count them. No analytics, revenue, conversion, engagement, visitor or synthetic metrics were introduced.

### Protected-route conventions

Future routes under `/admin` inherit the protected admin layout. Any future admin Server Action, API route, or other protected server resource must independently enforce `requireAdmin()` before reading or mutating protected data. Entering `/admin` is not treated as authorization for unrelated endpoints.

The current phase does not create public admin APIs, mutation Server Actions, CRUD screens, inquiry management, user management, media management, payments, registration or role-management UI.

### Admin data and privacy

The admin shell receives only the small authenticated identity context needed for its UI. It does not expose OAuth tokens, Account records, Session internals, database credentials or database metadata.

Admin pages are dynamic and marked `noindex`, `nofollow`, `noarchive`, and `nocache`. The admin shell is not included in public navigation or public content architecture.

### Public-shell preservation

The public header/footer remain attached to the public marketing, authentication, search, design-system and authentication-test route groups. The root layout now provides only the global HTML/font foundation so `/admin` can have an isolated operational shell without rendering the public marketing navigation around it.

No public content or homepage hero was recreated or changed as part of Phase 8.10. Contact remains anonymously accessible.

### Access-control verification

Verify with a configured PostgreSQL/Auth.js environment:

1. Anonymous → `/admin` redirects to `/login?callbackUrl=%2Fadmin`.
2. Authenticated `USER` → `/admin` is denied without revealing admin privilege details.
3. Authenticated `ADMIN` → `/admin` renders the shell and real database counts.
4. Admin sign-out → `/admin` is blocked again.
5. Forged client role/query parameters do not affect server authorization.
6. Public Home, Services, Research, Experts, Articles, Workshops/Events, About and Contact remain accessible without authentication.
7. Anonymous Contact submission remains available.

A real Google OAuth flow still requires configured provider credentials; source-level verification and CI build verification must not be described as a completed browser OAuth test unless that flow is actually exercised.

### Phase 8.10 scope boundary

Implemented:

- protected `/admin`
- server-side admin authorization
- reusable admin shell
- admin navigation foundation
- safe administrator identity display
- logout
- loading/error/not-found behavior
- real database-aware overview counts
- admin non-indexing behavior
- documentation

Not implemented:

- CMS/content CRUD
- inquiry management
- user management
- media library
- event registration
- payments
- analytics
- role-management UI
- audit-log system

The phase stops at the protected admin foundation as specified.

## Phase 8.11 — Content Management Infrastructure

Phase 8.11 adds the first protected content-management layer for the five canonical database-backed domains:

- Services
- Research
- Experts
- Articles
- Workshops / Events

### Admin routes

- `/admin/content` — database-backed content overview
- `/admin/content/services`
- `/admin/content/research`
- `/admin/content/experts`
- `/admin/content/articles`
- `/admin/content/workshops`
- `/admin/content/[domain]/new`
- `/admin/content/[domain]/[id]/edit`

All content mutations use server actions and independently call the existing `requireAdmin()` guard. Domain fields are validated server-side, relation IDs are checked against PostgreSQL, coordinated relation changes run in a Prisma transaction, and unique-slug conflicts are handled safely.

### Publication workflow

- New records start as drafts.
- Save preserves the current lifecycle state.
- Publish, Unpublish, and Archive are explicit actions.
- Published records require the fields needed by the existing public model and cannot reference unpublished related records.
- Published slugs cannot be changed in Phase 8.11 because slug-history/redirect infrastructure is intentionally deferred.
- Archived records remain in PostgreSQL and are not treated as public content.
- Hard deletion is intentionally not exposed by the initial content-management UI; archival is the safe lifecycle operation for this phase.

### Relationships

The admin editor uses a protected, server-backed relationship search rather than loading every domain into the browser. Existing canonical relationships are preserved and updated atomically. The editor does not introduce new relationship types.

### Revalidation

Successful mutations invalidate the affected public listing and detail paths. Public content continues to read from PostgreSQL; migration/seed files remain bootstrap sources only.

### Explicitly out of scope for Phase 8.11

Inquiry management, user management, media uploads, payments, event registration, public draft preview, and advanced publishing remain separate future phases.

### Concurrency limitation

The editor sends the record's `updatedAt` and rejects an obviously stale form before saving. Full optimistic concurrency control is not introduced in this phase; a later audit/publishing phase can add a version column if stronger conflict guarantees are required.

# SkillVeda

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


## Phase 8.12 — Media & Asset Infrastructure

Phase 8.12 adds a canonical MediaAsset metadata model, a server-side storage abstraction, protected admin media management, and managed-media references for Research, Experts, Articles and Workshops/Events. PostgreSQL stores metadata and relationships; binary files are kept outside PostgreSQL.

### Media model and relationships

MediaAsset stores:

- stable ID
- server-controlled storage key
- public asset URL/reference
- original and normalized filenames
- MIME type and file size
- measured image width/height
- optional alt text and caption
- ACTIVE / ARCHIVED status
- timestamps

Managed content references are additive and backward-compatible:

- ResearchItem.imageMediaId
- Expert.profileMediaId
- Article.coverMediaId
- Event.coverMediaId

Public repositories prefer the managed MediaAsset URL and fall back to the existing legacy image field until an asset is migrated.

### Storage

The application uses a server-only MediaStorage interface. Phase 8.12 provides a local filesystem adapter under .media-storage/ for development. Set MEDIA_STORAGE_DIR when a controlled local directory is preferred.

The local adapter is not represented as durable production object storage. Before production uploads are enabled on an ephemeral/serverless deployment, replace the adapter implementation with a persistent object-storage provider without changing the Prisma media model, content repositories, or admin picker.

Uploaded files are never committed to the source repository.

### Upload security

Only authenticated ADMIN users can reach the media mutation route. The upload path enforces:

- 10 MB maximum file size
- JPEG, PNG and WebP allowlist
- extension/MIME agreement
- server-side image signature validation
- measured dimensions
- normalized filenames
- UUID-based storage identity
- path traversal protection
- cleanup if metadata creation fails

SVG is intentionally not enabled in this phase.

There is no anonymous upload endpoint.

### Admin media

- /admin/media — paginated media library with search and status filtering
- /admin/media/[id] — asset detail, metadata editing, usage information, archive/restore and guarded deletion

Referenced assets cannot be deleted. Archiving does not remove existing content references.

### Content media picker

Phase 8.11 content forms now use the MediaAsset picker for managed image fields on Research, Experts, Articles and Workshops/Events. The server validates the submitted media ID, requires an active supported image, stores the MediaAsset relationship and preserves the public URL in the existing legacy image field for compatibility.

Storage operations remain outside PostgreSQL transactions. Upload failure and database failure are handled with cleanup to avoid unnecessary orphan files.

### Verification

Run:

    npm run prisma:generate
    npm run prisma:validate
    npm run media:verify
    npm run lint
    npm run build

media:verify checks MediaAsset references, supported MIME types, public URL shape, storage-object existence and broken content references. It does not automatically delete orphan media.

### Migration policy

No historical migration is rewritten and PostgreSQL is never reset. The Phase 8.12 migration is additive.

The current repository does not contain managed image binaries in public/images; the directory is only a placeholder. Therefore no binary import was fabricated. Existing legacy URL/path fields remain intact and can be migrated through the MediaAsset workflow when actual managed assets exist.

Static assets such as the logo, fixed icons, fonts and developer assets remain static and are not forced into the media library.

Production object storage is not claimed as configured by this phase.

The homepage hero remains removed, the previously removed content remains removed, and the public website UI is not redesigned.


## Phase 8.13 — Admin Inquiry Management System

Phase 8.13 adds the protected operational interface for the existing `ContactInquiry` records created by Phase 8.8. It does not replace the public Contact submission flow and does not introduce a second inquiry model or public inquiry API.

### Admin routes

- `/admin/inquiries` — server-backed inquiry list with search, status/service/date filters, sorting and pagination
- `/admin/inquiries/[id]` — protected inquiry detail view with the complete submitted message and contact context

The existing admin shell now exposes **Inquiries** on desktop and mobile, and the admin overview links its real Contact inquiry count to `/admin/inquiries`.

### Authorization and privacy

Every inquiry read and status mutation independently calls the existing server-side `requireAdmin()` guard. Anonymous visitors and normal `USER` accounts cannot retrieve inquiry records. There is no `GET /api/inquiries` or other public inquiry endpoint.

Inquiry pages are dynamic and non-indexable/non-cacheable. Inquiry messages are rendered as plain text with preserved line breaks; arbitrary submitted content is never treated as HTML.

### Listing behavior

The list queries PostgreSQL through Prisma and selects only the fields needed for the operational table. Default ordering is newest submission first. Search is performed server-side across name, email, message and related Service title/slug. Status, Service, date-range and sort controls preserve their query state during pagination.

Page size is bounded server-side. The list does not load all inquiries into the browser and does not query related Services one-by-one.

### Status workflow

The existing `ContactInquiryStatus` enum remains canonical:

- `NEW` — not yet processed
- `READ` — reviewed
- `IN_PROGRESS` — currently being handled
- `RESOLVED` — no further action currently required
- `SPAM` — unwanted/abusive inquiry

Status changes use a protected Server Action with server-side identifier and enum validation, existence checking, database persistence and revalidation. The original submitted name, email, phone, message and `submittedAt` remain unchanged by this workflow.

### Service and user context

The existing `ContactInquiry.serviceId` relation is resolved from the canonical Service table, including when the Service is no longer published. The existing optional `userId` relation is displayed only when it exists. No identity is inferred by matching email addresses, and no new assignment/notes relationship was added.

### Scope exclusions

Phase 8.13 does not add hard deletion, bulk actions, CSV/XLSX export, CRM integration, WhatsApp automation, email notifications, analytics, assignment, internal notes, a new inquiry model, or changes to the public Contact page. No homepage hero or previously removed public content is restored.

### Local verification

With PostgreSQL/Auth.js configured:

1. Run `npm run prisma:generate` and `npm run prisma:validate`.
2. Submit a synthetic development inquiry through the public Contact form.
3. Confirm it appears under `/admin/inquiries` without manual database intervention.
4. Test anonymous and `USER` access to `/admin/inquiries` and `/admin/inquiries/[id]`.
5. Test search by name, email and message; combine search with status/service/date filters.
6. Exercise pagination and newest/oldest/updated sorting.
7. Open a real test inquiry and verify contact fields, Service context, message, timestamps and status.
8. Change status through `READ`, `IN_PROGRESS`, `RESOLVED` and `SPAM` as appropriate for the test record.
9. Test malformed and nonexistent IDs and confirm safe not-found behavior.
10. Check mobile widths around 360px, 390px and 430px and desktop widths around 1024px, 1280px and 1440px.
11. Run `npm run lint` and `npm run build`.

Do not commit real personal inquiry data, credentials, `.env`, or `.env.local`.


## Phase 8.14 — Admin User Management & Role Control

Phase 8.14 adds the protected internal User Management area at `/admin/users`. It reuses the existing Phase 8.9 User/Account/Session authentication models and the existing server-side `requireAdmin()` authorization boundary. No authentication model or public user API was introduced.

### Admin routes

- `/admin/users` — paginated, server-side user listing with name/email search, role filtering and practical sorting
- `/admin/users/[id]` — minimized user detail view with account/provider context, associated inquiry count and role-management controls

The existing admin shell now exposes **Users** on desktop and mobile without changing the shell structure.

### Data minimization

User list/detail queries select only administrative fields required by the interface. They do not expose OAuth access tokens, refresh tokens, session tokens, password hashes, provider credentials or full Account/Session records. Provider information is shown only at the high-level provider-name level. Contact inquiry content is not embedded in the user-management UI; only an efficient associated inquiry count is shown.

### Authorization

Both user reads and role mutations are server-side protected. User IDs and requested roles are validated on the server. The authenticated actor is derived from the server-side session; no actor ID, admin ID, client role, or user object supplied by the browser is trusted.

There is no public `/api/users` endpoint and no public user search. User-management pages are dynamic and marked non-indexable/non-cacheable.

### Role management

The existing `UserRole` enum remains the only role model:

- `USER`
- `ADMIN`

A deliberate confirmation is required before changing a role. Role updates use a focused Server Action and authoritative PostgreSQL state. Promotion is `USER → ADMIN`; demotion is `ADMIN → USER` where permitted.

The final administrator cannot be demoted. Self-demotion is blocked to prevent administrative lockout. Demotion checks the current database admin count rather than a cached value. Role mutations run in a PostgreSQL serializable Prisma transaction so concurrent administrator changes use the strongest practical protection available in the current architecture; a serialization conflict is handled as a safe generic failure rather than silently risking removal of all administrators.

No user deletion, account disabling, bulk role operations, impersonation, password authentication, session-management UI, email/provider identity editing, or full audit subsystem was added.

### Session consistency

Authentication uses the existing NextAuth/Auth.js database-session strategy. The existing session callback reads the authenticated user's current database role when the session is resolved, so the role source remains the User record rather than a browser-provided role. The implementation does not claim instantaneous revocation of an already-issued client session beyond the behavior provided by the existing authentication/session strategy.

### Bootstrap

The existing intentional `npm run auth:bootstrap-admin` flow remains the administrator bootstrap mechanism. It requires a real existing User, `BOOTSTRAP_ADMIN_EMAIL`, and explicit `BOOTSTRAP_ADMIN_CONFIRM=YES`. Phase 8.14 does not seed fake administrators or production test users.

### Compatibility

The existing User, Account, Session and ContactInquiry relationships remain intact. The public Contact flow, content management, media management, inquiry management, authentication flow and public website are not redesigned by this phase. The previously removed homepage hero and removed public content remain removed.

### Verification

With PostgreSQL/Auth.js configured:

1. Run `npm run prisma:generate` and `npm run prisma:validate`.
2. Confirm `/admin/users` is accessible to an ADMIN and denied to anonymous/USER accounts.
3. Test name and email search, ADMIN/USER role filters, newest/oldest/name sorting and pagination.
4. Open a known user and verify minimized account/provider information and inquiry count.
5. Test unknown and malformed user IDs for safe not-found behavior.
6. Promote a synthetic USER to ADMIN and verify the role is persisted.
7. Demote an ADMIN to USER and verify the target eventually loses admin access according to the existing database-session behavior.
8. Attempt self-demotion and confirm it is rejected.
9. With exactly one ADMIN, attempt demotion and confirm it is rejected.
10. Exercise client-payload spoofing for role, actor and target IDs; verify the server remains authoritative.
11. Verify existing ContactInquiry relationships remain intact.
12. Verify public pages, Contact, authentication, content, media and inquiry management continue working.
13. Run `npm run lint` and `npm run build`.

Do not commit real user data, credentials, `.env`, or `.env.local`.


## Phase 8.15 — Advanced Publishing, Scheduling & Secure Draft Preview

Phase 8.15 extends the existing Phase 8.11 content-management system rather than creating a second CMS. The five canonical domains remain Services, Research, Experts, Articles, and Workshops / Events. The public website's visual design and removed homepage hero remain unchanged.

### Publication model

Each canonical content model now has an additive nullable `publishAt` timestamp. The existing `ContentStatus` enum remains DRAFT, PUBLISHED, and ARCHIVED. A scheduled record remains DRAFT with a future `publishAt`; the admin UI derives the Scheduled label without introducing a redundant permanent database status.

For Workshops / Events, the existing `date` / `endDate` fields remain the event lifecycle. `publishAt` is independent publication timing.

### Publish and schedule actions

The existing server action remains the only content mutation boundary and requires `requireAdmin()`. It reloads authoritative state, validates public-content requirements, relationships and media, applies the existing slug/concurrency protections, and writes through the existing transaction.

- Publish now: server sets PUBLISHED and `publishAt = new Date()`.
- Schedule: validates a future time and stores the converted UTC timestamp while keeping the record DRAFT.
- Cancel schedule: clears `publishAt` and keeps the record unpublished.
- Unpublish: changes to DRAFT and clears `publishAt`.
- Archive: changes to ARCHIVED and clears `publishAt`.

The browser cannot directly set a trusted publication state, publication timestamp, or actor identity.

### Timezone handling

The schedule UI requires an explicit IANA timezone selection. The entered datetime-local value is converted server-side to UTC. The UI exposes UTC, Asia/Kolkata, Europe/London, and America/New_York as practical choices.

### Public visibility

All five public repositories now require PUBLISHED plus either a null publishAt or a publishAt at/before current server time. Public related-content lookups use the same rule, preventing scheduled records from leaking through lists, detail routes, or relationships.

### Secure preview

The editor Preview action creates a short-lived HMAC-signed token using PREVIEW_SECRET or the existing AUTH_SECRET. Tokens expire after 10 minutes and contain only domain, record ID, and expiry. Preview requests require an ADMIN session, valid signature, matching domain/record, and an unexpired token.

Preview pages are dynamic and marked noindex/noarchive/nocache. They reuse the existing public detail components and read current PostgreSQL content directly. Normal public repositories are not weakened to expose drafts.

### Scheduled execution

A real Netlify Scheduled Function is implemented at `netlify/functions/publish-scheduled.mts` with a five-minute UTC cron cadence. Netlify documents Scheduled Functions as real cron-like functions that run on published deploys; they are available on all pricing plans and have a 30-second execution limit. citeturn3search0

The worker finds only DRAFT records whose publishAt has arrived, validates required public fields/relationships/media, performs an idempotent status-guarded publication update, logs safe failures, and requests targeted Next.js revalidation through a protected internal route.

The five-minute cadence means publication may execute shortly after the requested timestamp rather than claiming exact-second execution; the database timestamp remains authoritative.

### Scheduler security

The internal revalidation route accepts POST only and requires the server-only SCHEDULER_SECRET header. SCHEDULER_SECRET and optional PREVIEW_SECRET belong in deployment environment variables and must never be exposed through NEXT_PUBLIC_* variables or committed with real values. Netlify runtime environment variables are available to scheduled functions. citeturn3search7

### Failed schedules and retries

Invalid scheduled content remains DRAFT with publishAt intact. The worker logs the domain, record ID, and safe validation reasons and retries on a later invocation. Fixing the content allows a later run to publish it. Conditional status/publishAt updates prevent duplicate publication effects when a scheduler invocation retries or overlaps.

### Concurrency

The existing updatedAt stale-editor check remains active. Publishing does not silently overwrite a newer saved version. Scheduled publication uses a conditional DRAFT + eligible publishAt update for idempotency.

Phase 8.15 does not add revision history, approvals, collaborative editing, notifications, analytics, payments, event registration, a calendar product, or public preview sharing.

### Verification

With PostgreSQL and authentication configured:

1. Run `npm run prisma:generate` and `npm run prisma:validate`.
2. Apply the additive migration using the project's normal Prisma deployment workflow.
3. Verify drafts are absent from public lists, routes and relationships.
4. Verify Preview is accessible only to an ADMIN with a valid, unexpired token.
5. Verify preview pages are noindex and dynamically rendered.
6. Verify Publish now, Unpublish and Archive behavior.
7. Verify future publishAt records remain private until the scheduler runs.
8. Use Netlify's Scheduled Function Run now facility to test the deployed worker; Netlify documents this as the supported manual testing path. citeturn3search0
9. Verify scheduler retry/idempotency, cancellation and rescheduling.
10. Verify invalid scheduled content remains unpublished and is logged safely.
11. Verify stale edits, slug conflicts, invalid relationships, unavailable media and client status/publishAt/actor spoofing are rejected.
12. Test admin controls at the required desktop/mobile widths.
13. Run `npm run lint` and `npm run build`.
14. Verify no secrets, .env, or .env.local files are committed.

Do not proceed to Phase 8.16 or any later phase.

## Phase 8.16 — Event / Workshop Registration

Phase 8.16 adds reusable registration infrastructure to the existing PostgreSQL + Prisma Workshops / Events model without creating a second event system or redesigning the public UI.

### Registration model

`EventRegistration` stores the event, optional authenticated `userId`, registrant name/email and optional phone, organization and notes. Status is an explicit enum: `PENDING`, `CONFIRMED`, `CANCELLED`, `REJECTED`. New valid registrations default to CONFIRMED because Phase 8.16 does not invent an approval workflow.

Active duplicate identity is stored as a server-derived key. Authenticated registrations use `user:<userId>`; anonymous registrations use `email:<normalized-email>`. The database has a unique `(eventId, activeIdentityKey)` constraint. Cancellation/rejection clears the active key so a later registration can be made without deleting history.

### Event registration configuration

The canonical `Event` model now supports `registrationEnabled`, nullable `registrationCapacity`, nullable `registrationDeadline`, and `registrationMode` (anonymous allowed or authenticated users only).

A single server-side eligibility source determines availability. Public registration is allowed only when the event is PUBLISHED, its Phase 8.15 `publishAt` is null or reached, registration is enabled, the deadline has not passed, and finite capacity remains. Unpublished, scheduled, archived, disabled, expired and full events cannot accept public registration.

### Capacity and concurrency

Registration creation and admin activation use PostgreSQL `Serializable` transactions. Capacity is counted from PENDING + CONFIRMED records. Prisma P2034 serialization failures are retried, and the database uniqueness constraint handles duplicate active-identity races. This prevents concurrent requests from exceeding finite capacity.

CANCELLED and REJECTED registrations do not count toward capacity. PENDING and CONFIRMED registrations do.

### Public flow

The existing event detail page gets only a minimal registration block. It connects to the server registration service and shows open, full, closed, authentication-required, already-registered and confirmation states. Anonymous registration is supported by default; AUTHENTICATED_ONLY events require the existing Auth.js session. No password authentication or new provider is introduced.

Authenticated users can cancel their own active registration before the event date. Anonymous cancellation is intentionally unsupported because Phase 8.16 does not add a separate secure anonymous identity mechanism.

### User queries

`getCurrentUserRegistrations()` returns only records belonging to the current authenticated user and selects only event reference, status and timestamps needed for a later user UI. There is no public registration-list endpoint.

### Admin registration management

Existing `requireAdmin()` protects registration management under:

- `/admin/registrations/[eventId]` — search, status filter, count and remaining capacity.
- `/admin/registrations/[eventId]/[registrationId]` — minimized registration detail and server-authorized status changes.

Admin status changes validate the event/registration relationship and re-check capacity when activating a registration. No deletion, exports, payments, CRM, analytics, check-in or notification system is included.

### Security and privacy

The browser cannot supply a trusted `userId`, status, capacity, publication state or eligibility decision. Authenticated identity is derived from the server session. Public queries never include registration records or personal registration fields. Admin queries select only the fields needed for registration management.

The public form includes a lightweight honeypot and strict server-side validation for name, email, phone, organization and notes. No external CAPTCHA dependency was added.

### Verification

Run:

NaN

`registrations:verify` verifies duplicate protection, cancellation capacity release and concurrent finite-capacity behavior against PostgreSQL. CI runs this verification after the existing canonical-content checks.

Phase 8.16 does not implement payments, notifications/email, analytics, search, audit logging, API-layer expansion, QR/check-in, tickets, refunds or other Phase 8.17+ functionality.

## Phase 8.17 — Payments & Payment Transaction Infrastructure

Phase 8.17 adds the canonical PaymentTransaction financial record and provider-agnostic payment boundary. The repository did not contain an established payment provider or finalized payable pricing model, so this phase deliberately does not invent provider credentials, prices, or provider-specific hash/callback contracts. PAYMENT_PROVIDER remains unset until a real provider is selected and registered.

### Payment domain

- PaymentTransaction is the single canonical payment record.
- Amounts use integer minor units (amountMinor) and uppercase three-letter currencies.
- reference is a non-sequential public-safe transaction reference.
- idempotencyKey prevents repeated creation of the same logical payment request.
- PaymentPurpose distinguishes SERVICE, EVENT, and EVENT_REGISTRATION.
- PostgreSQL checks require exactly one payment target and require purpose/target agreement.
- Provider transaction references, failures, timestamps and verified status are retained for reconciliation.

### Lifecycle and provider boundary

The internal lifecycle is CREATED → PENDING → SUCCESS/FAILED/CANCELLED/EXPIRED. Terminal states cannot be arbitrarily changed. lib/payments/provider.ts defines the small provider adapter registry with checkout, return verification, webhook verification and reconciliation operations. No provider is registered until the project has an actual provider contract and credentials.

### Pricing authority

The current Service and Event schemas do not contain a finalized payable-price field. Phase 8.17 therefore does not invent a price. The public checkout endpoint refuses targets that have no server-authoritative price configuration. This keeps arbitrary browser-supplied amounts out of the system while leaving the transaction/provider architecture ready for the later pricing integration.

### Checkout and result boundaries

POST /api/payments/checkout authenticates the user, validates the internal return URL and requires a server-resolved payable target. It never accepts an amount or trusted status from the browser. GET /api/payments/result returns only the authenticated user's safe transaction result fields.

POST /api/payments/webhook/[provider] delegates authenticity verification to the configured provider adapter and reconciles only verified results. Browser redirects are never treated as proof of payment.

### User and admin access

- /account/payments exposes only the signed-in user's own payment history.
- /admin/payments provides protected search/filter/list access.
- /admin/payments/[id] shows minimized transaction details.
- There is no manual SUCCESS control, arbitrary amount editing, deletion, refund, or raw webhook display.

### Event-registration compatibility

The payment transaction model can link to EventRegistration, and verified SUCCESS reconciliation atomically confirms a linked registration that is already active. Phase 8.16 currently has no event price field, so no paid-registration UI is activated and the existing free-registration flow remains unchanged.

### Security

Payment secrets belong in server-only environment variables. The implementation does not store card numbers, CVV, payment credentials, provider secrets, or raw webhook payloads. Target ownership, amount, currency and payment status are server-authoritative. Publishing rules remain the responsibility of the target resolver; no public payment target is currently exposed for unpublished content.

### Verification

npm run payments:verify checks integer money conversion, server-created amount, idempotency, ownership query shape, invalid state transitions, verified success reconciliation, duplicate reconciliation and amount mismatch rejection. CI runs it after the existing registration verification and before lint/build.

No Phase 8.18+ functionality is implemented.


## Phase 8.18 — Notifications & Email Infrastructure

Phase 8.18 adds canonical transactional notification infrastructure without changing the public website or introducing a marketing system. The architecture is business event → durable Notification intent → NotificationService → EmailProvider → delivery result.

### Notification domain

Notification is the single persisted notification record. It supports EMAIL today and explicit statuses PENDING, PROCESSING, SENT, FAILED, and CANCELLED. Notification types are limited to application events that exist in the current product: inquiry received, registration received/confirmed/cancelled, and verified payment pending/success/failed.

A deterministic unique dedupeKey prevents duplicate logical notifications. Delivery claims a pending record before calling the provider, then persists the provider message ID and delivery timestamps. Failed records retain only safe failure classification and message. No raw provider payloads are stored.

### Email provider

No email provider existed before Phase 8.18. The implementation uses a small provider abstraction with a Resend REST adapter, avoiding an additional npm dependency. Resend's Email API supports direct REST sending and idempotency keys; the adapter sends the notification's deterministic dedupe key as the provider idempotency key. citeturn0search0turn0search1

Required server environment variables are RESEND_API_KEY, NOTIFICATION_FROM_EMAIL, and NOTIFICATION_FROM_NAME. Optional NOTIFICATION_REPLY_TO and comma-separated NOTIFICATION_INTERNAL_EMAILS configure reply-to and internal inquiry recipients. Real credentials are never committed.

The sender is fully server-controlled. Public forms cannot select recipients, sender metadata, provider, template, status, or HTML.

### Templates and security

Templates are a typed server-side registry producing subject, plain-text and HTML versions. User-controlled values are HTML-escaped and constrained before interpolation. Subjects and sender/reply-to configuration strip CR/LF to prevent header injection. No arbitrary HTML, scripts, forms, external resource URLs, or client-selected templates are accepted.

Transactional emails use concise status-oriented content for registrations, payments and internal inquiries. No newsletter, campaign, subscriber, broadcast, marketing unsubscribe or notification-center functionality is included.

### Delivery and retry

Business state is committed before delivery is attempted. Provider failure therefore cannot roll back a successful registration, inquiry or verified payment. Failed notifications can be retried by an authorized admin while preserving the same notification record and deterministic provider idempotency key. Temporary provider failures are classified separately from permanent configuration/validation failures; there is no uncontrolled retry loop.

The current deployment has no existing queue/worker platform, so Phase 8.18 does not invent Redis, Kafka, SQS or fake background processing. Notification records are durable and the service boundary is ready for later asynchronous execution.

### Integrations

- Contact inquiry: after a validated inquiry is persisted, an internal INQUIRY_RECEIVED notification is queued only when internal recipients are configured.
- Registration: creation queues REGISTRATION_RECEIVED; real status transitions to confirmed/cancelled queue their corresponding notifications. The deterministic key prevents repeated operations from creating duplicate logical messages.
- Payments: PAYMENT_SUCCESS, PAYMENT_FAILED, and PAYMENT_PENDING are queued only from verified server-side PaymentTransaction state changes.

### Admin

Protected /admin/notifications provides delivery-state search/filter/list access. /admin/notifications/[id] exposes minimized troubleshooting metadata and a secure retry action for failed notifications. Notification payloads and provider diagnostics are not exposed through the admin UI.

### Verification

npm run notifications:verify checks durable creation, deterministic deduplication and persisted delivery-state transitions using a fake provider record; it never calls a production email provider. CI runs it after payment verification and before lint/build.

Resend live delivery was not claimed or executed because no real credentials were committed/configured in CI. A production deployment must configure a valid Resend sending API key and a verified sender/domain before enabling live delivery. Resend also documents sending-access API keys for restricting production credentials to email sending. citeturn0search14

No Phase 8.19+ functionality is implemented.


## Phase 8.19 — Analytics & Measurement Infrastructure

Phase 8.19 adds a first-party, privacy-conscious analytics event layer. It does not add Google Analytics, GA4, GTM, PostHog, Plausible, Clarity, Vercel Analytics, or another third-party tracking vendor.

### Event model

`AnalyticsEvent` is the canonical raw measurement record. Event names and categories are explicit Prisma enums. The initial scope covers public page/content views, contact submission, registration start/completion, and verified payment initiation/success/failure. Client code may submit only controlled page-view and registration-start events; critical business conversions are generated server-side after the corresponding business state is committed.

No passwords, tokens, payment credentials, provider payloads, inquiry bodies, private notes, or arbitrary browser metadata are recorded. Content titles are resolved from canonical Services, Research, Experts, Articles and Workshops / Events during aggregate queries rather than copied into every event.

### Anonymous/session measurement

The lightweight page tracker creates random UUID identifiers in `sessionStorage`. No email, phone number, deterministic fingerprint, IP address or hardware/browser fingerprint is used. Unique visitors are intentionally not presented as a metric; the dashboard reports measured views and conversion events instead. The isolated client tracker can be placed behind a future consent gate without changing the analytics domain.

### Public view rules

The client tracker records one logical navigation event and excludes `/admin`, secure preview, API and internal paths. For canonical content routes, the server resolves the slug and records a content-specific view only when the record is currently `PUBLISHED` and its `publishAt` has been reached. Draft, scheduled, archived and preview traffic is excluded from public content metrics.

### Business events

Contact submission is recorded only after `ContactInquiry` persistence. Registration completion is recorded only after `EventRegistration` persistence. Payment initiation is recorded after a new internal `PaymentTransaction` is created, while payment success/failure is recorded only from verified `PaymentTransaction` state transitions. Analytics errors are isolated and cannot roll back or fail the business operation.

### Aggregation and admin

Protected `/admin/analytics` uses bounded PostgreSQL aggregation queries for today, last 7 days, last 30 days, and validated custom UTC ranges. It shows views, inquiries, registrations, payment attempts/success/failure, daily trends and top viewed content. Category and content-type filters are server-side and bounded. No raw-event explorer or individual user surveillance view is provided.

### Retention and provider configuration

No automatic deletion is introduced in this phase. Raw events are timestamped so a future configurable retention job can remove old records safely. There is no third-party analytics provider and therefore no analytics provider credential configuration.

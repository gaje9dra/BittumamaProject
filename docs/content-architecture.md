# Bittumama Content Architecture

This document describes the **current frontend architecture** after Phase 7.13. Phase 7 content architecture is complete. It is the maintainability guide for developers adding or changing content.

## Architecture map

```
Canonical data
    ↓
Data access helpers
    ↓
Cross-content relationships
    ↓
Route/page selection
    ↓
Presentation components

Global systems:
Site configuration + navigation
Metadata
Content validation
```

The project remains server-first. Client Components are used only where browser interaction is genuinely required.

## Canonical content sources

| Content | Canonical source | Detail route |
|---|---|---|
| Services | `data/services.ts` | `/services/[slug]` |
| Research | `data/research.ts` | `/research/[slug]` |
| Experts | `data/expertise.ts` | `/experts/[slug]` |
| Articles | `data/articles.ts` | `/articles/[slug]` |
| Workshops / Events | `data/events.ts` | `/workshops/[slug]` |

Do not duplicate canonical records inside pages or UI components.

The current Research, Experts, Articles and Workshops collections are intentionally empty. Do not add placeholder or invented records to make the architecture appear populated.

## Content access

Each canonical data module owns its typed model, dataset and small access helpers.

Typical helpers include:

- `getAllServices()`
- `getServiceById()`
- `getServiceBySlug()`
- `getServiceHref()`
- `getAllResearch()`
- `getResearchById()`
- `getResearchBySlug()`
- `getResearchHref()`
- `getAllExperts()`
- `getExpertById()`
- `getExpertBySlug()`
- `getExpertHref()`
- `getAllArticles()`
- `getArticleById()`
- `getArticleBySlug()`
- `getArticleHref()`
- `getAllEvents()`
- `getEventById()`
- `getEventBySlug()`
- `getEventHref()`

Invalid lookups return `undefined`; they must never fall back to the first or an unrelated record.

## Relationships

Cross-content resolution lives in `lib/content/relationships.ts`.

It handles Service, Research, Expert, Article and Workshop/Event relationships and resolves canonical records by their supported IDs/slugs.

Broken references are reported by validation and unresolved related content is omitted from public rendering. No unrelated record is substituted.

When adding a relationship:

1. Add the reference to the canonical content model.
2. Use an existing relationship helper where one exists.
3. Do not copy the target record into another dataset.
4. Only add relationships supported by factual project content.

## Navigation and site configuration

Global navigation and site configuration live in `data/site-config.ts`.

It owns:

- public route definitions
- primary navigation
- footer navigation
- global actions
- site identity
- default metadata
- service-derived navigation helpers

`data/navigation.ts` is a compatibility re-export of the canonical site configuration. New navigation configuration should be added to `data/site-config.ts`, not recreated in individual pages.

Desktop and mobile components present the canonical navigation; they do not own independent navigation datasets.

## Metadata

Metadata helpers live in `lib/metadata.ts`.

Use:

- `createPageMetadata()` for page-level metadata
- `createContentMetadata()` for canonical content detail pages

Content SEO data belongs to the canonical content record when the model supports it. Site-wide defaults belong to `data/site-config.ts`.

Do not create duplicate SEO objects in page components without a genuine page-specific requirement.

## Validation

Frontend content-integrity validation lives in `lib/content/validation.ts`.

It consumes the canonical datasets, relationship layer and site configuration. It checks identity fields, IDs, slugs, content-specific fields, dates, metadata, images, navigation and cross-content references.

Low-level dataset validators remain in their respective data modules.

Run:

```bash
npm run lint
npm run build
```

There is currently no separate `typecheck` script.

Validation errors are developer-facing. Optional missing content should not produce broken public UI.

## Dynamic routes

Dynamic route pages use canonical slug lookup and `notFound()` for invalid records:

- Services → `/services/[slug]`
- Research → `/research/[slug]`
- Experts → `/experts/[slug]`
- Articles → `/articles/[slug]`
- Workshops → `/workshops/[slug]`

Do not create manual slug maps or first-record fallbacks.

## Adding new content

### Service
1. Add the record to `data/services.ts`.
2. Use a unique stable ID.
3. Use a unique URL-safe slug.
4. Add factual content only.
5. Add relationships only when genuine.
6. Do not duplicate the record in UI code.

Apply the same principle to Research, Experts, Articles and Workshops.

### Images
Local content/metadata images must reference existing files under `public/`. Do not create placeholder assets merely to satisfy the model.

### Test data
Development fixtures must remain isolated from canonical production datasets and must never appear on public routes.

## File responsibility

- `data/` → canonical content and global configuration
- `lib/content/relationships.ts` → cross-content resolution
- `lib/content/validation.ts` → integrity checks
- `lib/metadata.ts` → metadata construction
- `lib/navigation.ts` → navigation behavior helpers
- `app/` → routes, page selection and server boundaries
- `components/` → presentation and interaction
- `public/` → static assets
- `docs/` → developer documentation

Do not add a new abstraction layer unless an existing responsibility cannot be maintained cleanly.

## Removed legacy sections

The following obsolete Phase 6 sections remain permanently removed and must not be recreated:

- 02 / CAPABILITIES — Research & Academic Support
- 04 / SERVICES — Research Services
- 13 / ABOUT THE ORGANIZATION — Research-led academic support
- 14 / CONTACT — Discuss Your Research Requirement
- Academic research support / See research support

Do not recreate renamed, hidden or responsive variants of these sections.

## Scope boundary

Phase 7.13 closes the Phase 7 frontend content-architecture work. No new architecture layer is introduced. The frontend does not introduce a database, ORM, CMS, API layer, authentication, payments, advanced search, full SEO implementation, dedicated performance system, security-hardening system or deployment architecture here.


## Phase 8.2 Service ownership

The canonical Phase 7 Services snapshot in `data/services.ts` is now migration/verification-only. Production Service reads go through `lib/services/repository.ts` and Prisma/PostgreSQL.

The Service database record preserves the canonical ID, slug, title, category, short description, ordering, need, focus, audience, availability, publication status, structured fields and SEO metadata. `Service.order` preserves the Phase 7 array ordering.

The deterministic import is `prisma/seed.ts`, configured through Prisma's seed command. `prisma/verify-services.ts` compares database records with the canonical snapshot and detects missing, unexpected, duplicate, ordering, status, field and metadata differences.

No Research, Expert, Article or Workshop data is migrated in Phase 8.2.

# Bittumama Content Architecture

## Canonical content sources

Production-facing content records live in the data directory:

- data/services.ts — canonical services
- data/research.ts — canonical research records
- data/expertise.ts — canonical expert records
- data/articles.ts — canonical articles
- data/events.ts — canonical workshops/events
- data/navigation.ts — primary and footer navigation
- data/site.ts — global site metadata/configuration
- data/contact.ts — contact/enquiry guidance and service options

`data/homepage.ts` contains homepage-specific editorial composition, while service names and links are derived from the canonical service source.

## Content access layer

`lib/content.ts` is the small frontend access layer for resolving canonical records and common list operations.

Use it for all-record access, slug resolution for dynamic routes, featured/latest/upcoming selections, and stable-ID relationship resolution.

Pages and components should not create independent copies of canonical records.

## Relationships

Relationships use stable IDs/slugs stored on canonical records. A relationship is only rendered when an explicit relationship exists.

Current relationship fields are optional because several content collections are intentionally empty until verified content is available. No placeholder records are added to populate them.

## Routes

Dynamic routes resolve through `lib/content.ts` and then handle missing records with `notFound()`.

Canonical URL patterns are:

- /services/[slug]
- /research/[slug]
- /experts/[slug]
- /articles/[slug]
- /workshops/[slug]

## Ordering rules

- Services use the canonical array order.
- Research and experts use their canonical collection order unless a page applies an explicit category grouping.
- Articles can use `getLatestArticles()` for descending publication-date order.
- Workshops can use `getUpcomingWorkshops()` for ascending event-date order and exclude completed events.

## Site and navigation configuration

Global site metadata is centralized in `data/site.ts`.

Primary/mobile/footer navigation is centralized in `data/navigation.ts`. Service links in the footer continue to derive directly from `data/services.ts`.

## Future backend/CMS integration

A later backend, database, or CMS can map its records into these frontend models without changing page identities or route contracts. The frontend currently remains static and server-friendly; this phase does not add APIs, authentication, database access, or CMS dependencies.

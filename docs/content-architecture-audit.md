# Bittumama Content Architecture Audit

## Scope

Phase 7.1 is an audit/foundation step only. This document records the current frontend content architecture without implementing the later canonical-content migrations, relationship refactor, navigation refactor, metadata system, backend, database, CMS, authentication, or SEO work.

## 1. Current content sources

| Area | Current source | Finding |
|---|---|---|
| Services | data/services.ts | Populated typed service catalogue; strongest current canonical source |
| Research | data/research.ts | Typed model; collection currently empty |
| Experts | data/expertise.ts | Typed model; collection currently empty |
| Articles | data/articles.ts | Typed model; collection currently empty |
| Workshops / Events | data/events.ts | Typed model; collection currently empty |
| Primary/mobile navigation | data/navigation.ts | Centralized |
| Footer navigation | components/layout/footer.tsx | Research/company links are local arrays; service links use services |
| Contact configuration | data/contact.ts | Centralized; service selector directly uses services |
| Homepage editorial content | data/homepage.ts | Centralized editorial composition; service references resolve from service IDs |
| Global metadata | app/layout.tsx and route metadata | Split across root and route files |
| About identity/SEO | data/about.ts | Separate source for organization copy and About SEO |
| Navigation helpers | lib/navigation.ts | Active-route and validation helpers |
| Shared content types | types/ | No shared content models; directory contains only .gitkeep |

## 2. Services

data/services.ts defines ServiceStatus, ServiceHighlight, ServiceFaq and Service.

Each service has id, title, slug, category, shortDescription and href, with optional need, focus, audience, highlights, faq, featured and status fields.

The current established catalogue includes Research Support, Research Methodology, Literature Review, Thesis Support, Dissertation Support, Research Paper, Mentoring, Data Analysis, Analytical Services, Publication Services, and AI Research Engine / ResearchQuest.

No new service records were added.

Services are consumed by the Services directory, service detail route, homepage audience/service references, Contact service selector, footer service index and related-services component.

The homepage and Contact page do not maintain independent service record copies. They derive their links/options from data/services.ts.

Current service relationships are not explicit. getRelatedServices() infers related services from shared category.

## 3. Research

data/research.ts defines ResearchStatus, ResearchPoint, ResearchMethodology, ResearchSection and ResearchEntry.

ResearchEntry supports id, title, slug, category, shortDescription, summary, scope, topics, sections, methodology, audience, highlights, relatedServiceIds, date, status, type, topic, image, featured and tags.

researchEntries is empty.

Phase 7.3 establishes data/research.ts as the single authoritative Research source and exposes the small access helpers needed by current consumers. Research URLs are derived from the canonical slug through getResearchHref(); no per-record href field is maintained.

Research has an explicit relatedServiceIds field for existing Service relationships, but no explicit article or expert relationship field.

getRelatedResearch() currently infers related research using category and shared tags.

## 4. Experts

data/expertise.ts defines Expert with id, name, slug, role, discipline, shortBio, bio, image, expertise, qualifications, researchInterests, serviceIds, researchIds, articleIds, featured and optional SEO fields.

experts is empty.

The expert routes and directory consume this dataset directly.

The current relationship direction is expert-centric through serviceIds, researchIds and articleIds.

No expert identity, qualification, biography or relationship data is fabricated.

## 5. Articles

data/articles.ts defines ArticleSection and Article.

Article supports id, title, slug, category, date, author, authorRole, authorSlug, excerpt, content, sections, image, featured, tags, relatedArticles, relatedResearch, relatedServices and optional SEO fields.

articles is empty.

The article index and detail route consume this dataset directly.

Article relationships currently use slug arrays, unlike the ID-based relationship fields used by several other models.

getRelatedArticles() uses explicit relatedArticles when present and otherwise falls back to same-category plus shared-tag matching.

Author identity is split between display fields (author/authorRole) and an optional authorSlug.

## 6. Workshops / Events

data/events.ts defines EventRegistrationStatus and Event.

Event supports id, title, slug, date, endDate, time, category, location, format, shortDescription, description, audience, speaker, speakerRole, image, registrationLabel, registrationHref, href, registrationStatus, featured, relatedEventIds, relatedResearchIds, relatedServiceIds and optional SEO fields.

events is empty.

Event relationships explicitly support event-to-event, event-to-research and event-to-service references.

getRelatedEvents() also adds same-category events when no explicit relationship exists, so explicit and inferred relationship behavior coexist.

## 7. Navigation

data/navigation.ts defines typed NavigationItem, NavigationGroup, NavigationFeatured and NavigationMetadata structures.

primaryNavigation is centralized and currently contains Services, Research, Workshops & Events, Experts, Articles and About.

mobileNavigation derives from primaryNavigation and adds Contact.

DesktopNav consumes primaryNavigation. The navigation components support dropdown and mega-menu structures, although the current primary dataset is primarily simple links.

The footer does not currently consume a centralized footer-navigation dataset. It locally defines Research, Articles, Workshops & Events, About, Experts and Contact links.

The footer service index does consume the canonical services array.

No dedicated breadcrumb data/component was found in the audited structure; detail pages use explicit back-navigation links where applicable.

## 8. Site-wide configuration

There is no single site-config module.

Global identity/configuration is split across:

- app/layout.tsx for default title and description
- data/about.ts for organization name, descriptions and About SEO
- components/layout/header.tsx for the visible Bittumama brand label
- components/layout/footer.tsx for the visible Bittumama label and footer links
- data/navigation.ts for primary/mobile navigation
- data/contact.ts for enquiry/contact configuration

No missing email, phone, address, social profile or other global contact information is invented.

## 9. SEO metadata

Metadata is route-local.

The root layout provides default metadata. Homepage, Services, Research, Experts, Articles and Workshops routes provide their own metadata where applicable. About and Contact use metadata from their respective data modules.

This is functional but distributed. Metadata centralization is a later concern, not a Phase 7.1 implementation.

## 10. Dynamic routes

/services/[slug]
- Reads data/services.ts.
- Static params come from service slugs.
- Uses getServiceBySlug().
- Calls notFound() when no service exists.
- Generates title, description and canonical URL from the service record.

/research/[slug]
- Reads data/research.ts.
- Static params come from research slugs.
- Uses getResearchBySlug().
- Calls notFound() for missing records.
- Generates metadata from the research record.

/experts/[slug]
- Reads data/expertise.ts.
- Static params come from expert slugs.
- Uses getExpertBySlug().
- Calls notFound() for missing records.
- Generates metadata from expert data.

/articles/[slug]
- Reads data/articles.ts.
- Static params come from article slugs.
- Uses getArticleBySlug().
- Calls notFound() for missing records.
- Generates metadata from article data.

/workshops/[slug]
- Reads data/events.ts.
- Static params come from event slugs.
- Uses getEventBySlug().
- The detail component handles a missing event with notFound().
- Generates metadata from event data.

No manually constructed slug maps or fallback-to-first-record behavior were found in these routes.

## 11. Homepage

The current homepage has six existing sections:

1. HomeHero
2. HomePositioning
3. HomeIntelligence
4. HomeServiceDiscovery
5. HomeAudience
6. HomeProcess

app/(marketing)/page.tsx composes the sections. data/homepage.ts contains editorial copy.

Homepage audience service links are resolved from service IDs against data/services.ts.

No research, expert, article or workshop records are fabricated for the homepage.

The previously removed Phase 6 sections are not recreated.

## 12. Contact

data/contact.ts owns contact SEO, introduction, enquiry guidance and contact methods.

contactServiceOptions directly references the services array from data/services.ts.

The public Contact page currently presents an honest unavailable-submission state rather than a non-functional public submission form.

components/contact/contact-form.tsx remains a client-side form/reference component and also reads services directly, but it is not used as the public Contact page submission route.

## 13. Footer

The premium footer visual implementation remains unchanged.

Its service list is generated directly from data/services.ts.

Its Research, Articles, Workshops & Events, About, Experts and Contact links are currently local arrays inside components/layout/footer.tsx.

This is meaningful navigation duplication and is a candidate for later consolidation, but it is not changed in Phase 7.1.

## 14. Relationship audit

| Relationship | Current state |
|---|---|
| Service ↔ Research | Research has relatedServiceIds; no reverse Service field |
| Service ↔ Article | Article has relatedServices; no reverse Service field |
| Service ↔ Expert | Expert has serviceIds; no reverse Service field |
| Research ↔ Article | Article has relatedResearch; no reverse Research field |
| Research ↔ Expert | Expert has researchIds; no reverse Research field |
| Workshop ↔ Research | Event has relatedResearchIds |
| Workshop ↔ Service | Event has relatedServiceIds |
| Article ↔ Expert | Article has authorSlug; Expert has articleIds |
| Service ↔ Service | Same-category inference |
| Research ↔ Research | Category/tag inference |
| Article ↔ Article | Explicit slugs, otherwise category/tag inference |
| Event ↔ Event | Explicit IDs, otherwise category inference |

The principal architecture issue is the coexistence of editorially explicit relationships and heuristic relationships.

## 15. Duplication findings

Meaningful duplication or split ownership includes:

1. Global Bittumama identity is repeated in root metadata, header, footer and About data.
2. Default metadata is separate from About metadata.
3. Footer research/company navigation is local rather than part of the navigation dataset.
4. Article author identity can be represented as both display text and an expert slug.
5. Relationship identifiers are inconsistent: some are IDs, some are slugs.
6. Related-content helpers infer relationships from category/tags in addition to explicit relationships.

The following are not duplicate service datasets:

- homepage service references
- Contact service options
- footer service links

All three derive from data/services.ts.

## 16. Placeholder / fake-content audit

Targeted repository searches found no matches for Lorem ipsum, test, demo, example, dummy or placeholder content, and no fake expert/article/workshop records or fake statistics.

The empty Research, Experts, Articles and Events arrays are intentional absence of verified records, not filler.

The service status value Coming Soon is an explicit service state, not fake content.

## 17. Removed-section audit

Targeted searches found no repository matches for the removed Phase 6 phrases:

- 02 / CAPABILITIES
- Research & Academic Support
- 04 / SERVICES
- Research Services
- 13 / ABOUT THE ORGANIZATION
- Research-led academic support
- 14 / CONTACT
- Discuss Your Research Requirement
- Academic research support
- See research support

No legacy responsive duplicate of those sections was identified.

## 18. Type-safety findings

Targeted search found no any usage.

Existing strengths:

- named models beside their datasets
- typed navigation structures
- type guards for optional records
- explicit optional fields
- typed relationship arrays

Current inconsistencies:

- article relationship arrays use slugs while several other models use IDs
- inferred relationship helpers coexist with explicit relationship fields
- types/ contains no shared content-model layer
- global site configuration has no dedicated typed module

No broad TypeScript rewrite is appropriate in this audit phase.

## 19. Recommended canonical sources for later phases

These are recommendations only; they are not implemented here.

- Services → data/services.ts
- Research → data/research.ts
- Experts → data/expertise.ts
- Articles → data/articles.ts
- Workshops → data/events.ts
- Contact service selector → continue deriving from Services
- Primary/mobile navigation → data/navigation.ts
- Footer navigation → later consolidate with navigation data
- Global site identity → later consolidate after reconciling existing values
- Relationships → later standardize explicit identifiers and remove heuristic fallbacks where editorial truth is required
- Dynamic routes → later migrate only after the content-access architecture is approved
- Metadata → later centralize defaults while retaining route-specific metadata

## 20. Later Phase 7.x migration queue

1. Standardize relationship identifier conventions.
2. Define explicit relationship ownership/direction.
3. Constrain or remove heuristic related-content fallbacks.
4. Consolidate footer navigation.
5. Consolidate global site identity/configuration.
6. Introduce a canonical content-access layer when scheduled.
7. Migrate dynamic routes to that layer.
8. Revisit metadata centralization after content ownership is stable.
9. Add referential-integrity validation once explicit relationships exist.

## 21. Conclusion

The project already has a useful typed frontend data layer, with Services as the strongest populated source of truth. Research, Experts, Articles and Events have typed models but currently contain no real records.

The principal content-architecture debt is inconsistent ownership rather than missing content files:

- navigation is partly centralized and partly local
- site identity/metadata is split
- relationships mix explicit references with inferred heuristics
- relationship identifiers are inconsistent
- article author identity can be represented in two forms

Phase 7.1 requires understanding and documenting these conditions, not migrating them.

## Validation note

package.json exposes npm run lint and npm run build; there is no separate typecheck script.

The audit environment could not run a local Node installation or dev server, so fresh local lint/build/browser/hydration/console validation was not performed here. The repository had an existing successful Phase 6 GitHub Actions Build before this audit snapshot. No fresh browser verification is claimed.

## Stop condition

Phase 7.1 concluded with the audit above. Phase 7.2 is documented separately below; no later Phase 7 work is implied.


## Phase 7.2 implementation — canonical Services

The Phase 7.2 migration keeps `data/services.ts` as the single authoritative Service dataset.

### Canonical model

The existing `Service` model remains intentionally small and factual:

- `id` — stable service identifier
- `title` — canonical display name
- `slug` — stable URL-safe identifier
- `category`
- `shortDescription`
- optional `need`, `focus`, `audience`
- optional `highlights`, `faq`
- optional `featured`, `status`

The former per-record `href` field is not retained. Service URLs are derived from the canonical slug through `getServiceHref()`, preventing URL drift when a slug is intentionally changed.

### Canonical access helpers

`data/services.ts` now exposes only the small helpers needed by current consumers:

- `getAllServices()`
- `getServiceById(id)`
- `getServiceBySlug(slug)`
- `getServiceHref(service)`
- `getServicesByCategory(category)`
- `getServiceCategoryAnchor(category)`
- `getRelatedServices(service)`
- `validateServices(records)`

Invalid lookups return `undefined`. No lookup falls back to another service.

### IDs and slugs

Every canonical service has a stable unique ID. Existing IDs were preserved.

Service slugs are lower-case, URL-safe, hyphen-separated values and remain the route contract for `/services/[slug]`. Existing slugs were preserved.

Module-load validation checks for missing ID/title/slug, duplicate IDs, duplicate slugs and invalid slug syntax.

### Categories and order

Service category values and category order continue to derive from the canonical dataset. The existing service array order remains the canonical display order; consumers do not independently sort or redefine the service catalogue.

### Current consumers

The following legitimate service consumers now resolve from the canonical dataset/access helpers:

- `/services` directory and category navigation
- `/services/[slug]` static params, lookup and canonical metadata URL
- service finder
- homepage service discovery
- homepage audience service references
- Contact service options and the development/reference Contact form
- premium footer service links
- service-to-service related-content links
- research-to-service links

The design-system service detail preview intentionally derives its preview fixtures from canonical services as well.

No page component contains an independent service record catalogue.

### Relationship boundary

Phase 7.2 does not introduce a cross-content relationship engine. Existing service-to-service category-based related behavior and existing research-to-service references remain within their current scope.

### Future rule

New service references must resolve by canonical service ID or slug and must not repeat service names, descriptions, categories or URLs in page-local data. Future relationship/content migrations must build on this source rather than create another Services dataset.


## Phase 7.3 implementation — canonical Research

The Phase 7.3 migration keeps `data/research.ts` as the single authoritative frontend Research dataset. The existing collection remains empty because the project currently contains no verified Research records.

### Canonical model

The existing Research model was retained and refined only where current consumers require it:

- `id` — stable Research identifier
- `title` — canonical display title
- `slug` — stable URL-safe identifier
- `category`
- `shortDescription`
- optional editorial/detail fields already used by the Research experience: `summary`, `scope`, `topics`, `sections`, `methodology`, `audience`, `highlights`, `date`, `status`, `type`, `topic`, `image`, `featured`, and `tags`
- optional `relatedServiceIds` for existing Research-to-Service references

The former per-record `href` field is not retained. Research URLs are derived from the canonical slug through `getResearchHref()`, keeping the route contract in one place.

No author, publication, findings, statistics, citations, affiliations, SEO object, article relationship, expert relationship, or other fields were added because the current project has no real Research records requiring them.

### Canonical access helpers

`data/research.ts` now exposes the small helpers needed by current consumers:

- `getAllResearch()`
- `getResearchById(id)`
- `getResearchBySlug(slug)`
- `getResearchHref(research)`
- `getResearchByCategory(category)`
- `getFeaturedResearch()`
- `getResearchCategoryAnchor(category)`
- `getRelatedResearch(research)`
- `validateResearch(records)`

Invalid ID or slug lookups return `undefined`. No lookup falls back to another Research record.

### IDs and slugs

Every future canonical Research record must use a stable unique ID and stable URL-safe slug. Module-load validation checks for missing ID/title/slug, duplicate IDs, duplicate slugs, and invalid slug syntax.

Because the current Research collection is empty, no existing Research IDs or slugs were changed or invented.

### Categories and order

Research categories continue to derive from the canonical Research dataset. The existing array order remains the canonical order; consumers do not create independent Research record ordering.

No latest-by-date behavior was introduced because the current project has no Research records and no such existing behavior to preserve.

### Current consumers

The canonical Research source/access layer now powers:

- `/research` directory data and category navigation
- `/research/[slug]` static params, record lookup and canonical metadata URL
- featured Research rendering
- related Research rendering
- Research-to-Service relationship rendering
- Research detail components through the canonical `ResearchEntry` type

The Research directory, featured component and related Research component no longer maintain or use per-record Research URLs.

### Relationships

Existing Research-to-Service references remain represented by stable Service IDs and are resolved through the canonical Services access layer. No new relationships were invented.

The existing same-category/shared-tag related Research behavior remains unchanged. A complete cross-content relationship engine is not introduced in Phase 7.3.

### Empty-state behavior

`researchEntries` remains empty. The existing Research page therefore retains its intentional empty archive state and does not receive fake records, placeholder studies, invented authors, dates, findings, statistics, or citations.

### Dynamic route behavior

`/research/[slug]` resolves records with `getResearchBySlug()`. Missing records continue to call `notFound()`. Static params are derived from `getAllResearch()`.

No unrelated Research record is used as a fallback.

### Duplicate-definition rule

Future Research records must be added only to `data/research.ts`. Page components, homepage editorial data, filters, related-content components, and dynamic routes must reference canonical Research records by ID/slug or through the Research access helpers rather than defining duplicate Research objects.

### Phase boundary

Phase 7.3 does not migrate Experts, Articles, Workshops, navigation, metadata, or the complete cross-content relationship system. It does not introduce backend/database/CMS/authentication/payment/search/SEO/deployment work.


## Phase 7.4 implementation — canonical Experts

The Phase 7.4 migration keeps `data/expertise.ts` as the single authoritative frontend Expert dataset because it was the project's existing Expert source. No second `data/experts.ts` dataset was created.

### Canonical model

The existing `Expert` model remains focused on fields already supported by the project:

- `id` — stable Expert identifier
- `name` — canonical display name
- `slug` — stable URL identifier
- optional `role`, `discipline`, `shortBio`, `bio`, `image`
- optional `expertise`, `qualifications`, `researchInterests`
- optional `serviceIds`, `researchIds`, `articleIds`
- optional `featured`
- optional `seo.title` and `seo.description`

No new people, credentials, biographies, qualifications, images, awards or affiliations were added. The existing `experts` collection remains empty.

### Canonical access helpers

`data/expertise.ts` now exposes:

- `getAllExperts()`
- `getExpertById(id)`
- `getExpertBySlug(slug)`
- `getExpertHref(expert)`
- `getFeaturedExperts()`
- `getExpertsByDiscipline(discipline)`
- `getExpertDisciplineAnchor(discipline)`
- `validateExperts(records)`

Invalid lookups return `undefined`. No helper substitutes another Expert.

### IDs and slugs

Every future Expert must have a stable unique ID, name and URL-safe slug. Module-load validation rejects missing required identity fields, duplicate IDs, duplicate slugs and malformed slugs.

The current dataset is empty, so no existing Expert ID or slug was changed.

### Discipline handling

The available discipline list remains derived from the canonical Expert dataset. Expert directory grouping and discipline anchors use the canonical discipline values rather than maintaining a separate Expert category catalogue.

### Current consumers

The canonical Expert source/access layer now powers:

- `/experts` directory
- `/experts` discipline index
- `/experts/[slug]` static params
- `/experts/[slug]` record lookup
- Expert detail metadata and canonical URL
- Expert detail Service relationships
- Expert detail Research relationships

The visual Experts experience and existing empty state are unchanged.

### Relationships

Existing Expert relationship fields remain ID-based:

- `serviceIds` → resolved through the Phase 7.2 canonical Services source
- `researchIds` → resolved through the Phase 7.3 canonical Research source
- `articleIds` remains available for future real Article relationships

No relationship was invented.

The current Article model has an optional `authorSlug` field, but the Article dataset is empty. No article author record is therefore migrated or fabricated in Phase 7.4. The existing structure is preserved as a documented limitation until real Article records require author resolution.

### Images

The existing optional `image` field is preserved. Because there are currently no Expert records, no image paths or profile photos were introduced or changed.

### Empty-state behavior

`experts` remains empty. The Experts directory continues to show its existing intentional empty state rather than fabricated profiles.

### Dynamic route behavior

`/experts/[slug]` resolves through `getExpertBySlug()`. Missing slugs continue to call `notFound()`. Static params are derived from `getAllExperts()`.

No unrelated Expert is used as a fallback.

### Duplicate-definition rule

Future Expert records must be added only to `data/expertise.ts`. Page components, homepage data, Article records, Research records, Service records and related-content components must reference canonical Experts by stable ID/slug rather than duplicating complete person definitions.

### Phase boundary

Phase 7.4 does not migrate Articles or Workshops, build a complete cross-content relationship engine, centralize navigation or metadata, or introduce backend/database/CMS/authentication/payment/search/SEO/deployment work.



## Phase 7.5 implementation — canonical Articles

Phase 7.5 keeps `data/articles.ts` as the single authoritative frontend Article source. The existing production Article collection is empty because the project currently contains no verified Article records. No article content, authors, dates, imagery, findings, citations or publication claims were invented.

### Canonical model

The Article model is limited to fields required by the current Articles experience:

- `id`, `title`, `slug`, `category`
- optional `date`, `author`, `authorId`, `authorRole`, `authorSlug`
- optional `excerpt`, `content`, `sections`, `image`, `featured`, `tags`
- optional `relatedArticles`, `relatedResearch`, `relatedServices`
- optional `seo.title`, `seo.description`, `seo.image`

No separate Article interface or duplicate production dataset was introduced.

### Canonical access layer

`data/articles.ts` exposes the small access helpers required by current consumers:

- `getAllArticles()`
- `getArticleById(id)`
- `getArticleBySlug(slug)`
- `getFeaturedArticles()`
- `getArticlesByCategory(category)`
- `getArticleCategoryAnchor(category)`
- `getRelatedArticles(article)`
- `validateArticles(records)`

Invalid ID/slug lookups return `undefined`. No helper falls back to an unrelated Article.

### IDs, slugs and validation

Article IDs remain stable canonical identifiers and are never generated during rendering. Article slugs must be unique, URL-safe, lower-case hyphen-separated values. Module-load validation checks required identity fields, duplicate IDs, duplicate slugs and malformed slugs.

The current production dataset is empty, so no existing Article ID or slug was changed.

### Current consumers

The production Articles directory and Article detail route consume the canonical source/access layer:

- `/articles` reads `getAllArticles()`
- `/articles/[slug]` uses `getAllArticles()` for static params and `getArticleBySlug()` for lookup
- Article metadata is derived from the resolved canonical record
- invalid Article slugs continue to use `notFound()`
- Article category navigation and archive anchors derive from canonical category data
- Article detail related Research and Services resolve through the canonical Research and Services datasets
- related Article references resolve through canonical Article IDs/slugs

No page-local production Article catalogue exists.

### Author relationships

The Article model supports `authorId` and `authorSlug` without duplicating an Expert profile. If a future verified Article has an Expert relationship, consumers must resolve that relationship through the canonical Experts source. Plain-text authors remain plain text when no verified Expert relationship exists.

No Expert relationship was fabricated because the current Article dataset is empty.

### Research and Service relationships

Existing Article relationship fields remain lightweight identifiers rather than embedded Research or Service objects. Current Article records are empty, so no new relationships were invented. Future relationships must resolve against:

- Research → `data/research.ts`
- Services → `data/services.ts`

The canonical Research and Services systems were not modified by Phase 7.5.

### Related Articles

Explicit `relatedArticles` references resolve through the canonical Article dataset and may use a stable Article ID or slug. Existing category/tag-based related behavior is retained for compatibility with the current Articles experience; no unrelated Article records are fabricated.

### Empty-state and development previews

The production Article dataset remains empty and the existing intentional empty state is preserved.

The design-system Articles page contains development-only preview fixtures for visual inspection. These are not production Article records and do not populate `data/articles.ts`. They remain isolated from production routes and canonical content.

### Visual preservation

No Articles UI redesign was performed. The existing directory, featured treatment, category navigation, archive structure, detail layout, related-content areas, responsive behavior and empty states remain intact.

The removed Phase 6 homepage sections remain absent.

### Duplicate-definition rule

Future verified Article records must be added only to `data/articles.ts`. Production pages and content components must reference canonical Article records through the dataset/access helpers rather than defining duplicate Article objects.

### Validation

The Phase 7.5 implementation was checked statically against the project architecture and route consumers. The repository exposes `npm run lint` and `npm run build`; no separate typecheck script exists.

Fresh local browser/server execution is not claimed from the GitHub connector environment. The required local validation remains:

- `npm run lint`
- `npm run build`
- development server inspection of `/`, `/articles` and a valid/invalid `/articles/[slug]`
- verification of legitimate Article references and absence of duplicate production Article data

### Phase boundary

Phase 7.5 does not migrate Workshops, build the complete cross-content relationship engine, refactor global navigation, centralize the full metadata framework, or introduce PostgreSQL, Prisma, backend, CMS, admin, authentication, payments, advanced search, SEO implementation or deployment work.



## Phase 7.6 implementation — canonical Workshops & Events

Phase 7.6 keeps `data/events.ts` as the single authoritative frontend Workshop/Event dataset. The existing production event collection is empty because the project currently contains no verified Workshop/Event records. No event, speaker, date, venue, registration URL, price or relationship was invented.

### Canonical model

The existing `Event` model was refined only for current architectural needs:

- `id`, `title`, `slug`, `date`
- optional `endDate`, `time`, `category`, `location`, `format`
- `shortDescription` and optional `description`, `audience`
- optional speaker display fields plus `speakerId` / `speakerSlug`
- optional `image`, registration fields and `featured`
- typed related event, Research and Service identifiers
- typed SEO metadata

No second Workshops/Event interface or duplicate dataset was introduced.

### Canonical access layer

`data/events.ts` exposes the small helpers needed by current consumers:

- `getAllEvents()`
- `getEventById(id)`
- `getEventBySlug(slug)`
- `getFeaturedEvents()`
- `getUpcomingEvents()`
- `getPastEvents()`
- `getEventsByCategory(category)`
- `getEventCategoryAnchor(category)`
- `getRelatedEvents(event)`
- `validateEvents(records)`

Date classification uses the event date, or end date when present, without changing stored event data. Invalid lookups return `undefined`; no helper substitutes another event.

### IDs, slugs and validation

Event IDs must be stable and unique. Event slugs must be unique, URL-safe, lower-case hyphen-separated values. Module-load validation checks required identity fields, duplicate IDs/slugs, malformed slugs, invalid dates and end dates earlier than the event date.

The production dataset is currently empty, so no existing event IDs, slugs or dates were changed.

### Current consumers

The canonical event source/access layer powers:

- `/workshops` directory
- `/workshops/[slug]` static params, lookup and event-specific metadata
- Workshop/Event detail related-event rendering
- featured-event selection
- upcoming/past classification
- category navigation and archive anchors
- the development Workshops preview

The existing visual Workshops/Event experience remains unchanged.

### Relationships

The event model preserves lightweight identifier-based relationships:

- `relatedResearchIds` → canonical Research source
- `relatedServiceIds` → canonical Services source
- `speakerId` / `speakerSlug` → canonical Expert source when a verified relationship exists
- `relatedEventIds` → canonical event source

No relationships were fabricated because the production event collection is empty.

### Registration, location and imagery

Existing registration, location and image fields remain optional. No payment, registration backend, venue, URL, price or image was invented.

### Empty state

The production event collection remains empty. The existing Workshops page therefore continues to show its intentional empty-state behavior rather than fabricated events.

### Duplicate-definition rule

Future verified Workshop/Event records must be added only to `data/events.ts`. Pages and components must consume canonical records through the event access layer rather than defining duplicate event objects, slug maps, date maps or registration maps.

### Phase boundary

Phase 7.6 does not implement the complete cross-content relationship engine, navigation migration, complete metadata framework, PostgreSQL, Prisma, backend, CMS, admin, authentication, payments, advanced search, SEO implementation, performance optimization, security hardening or deployment.




## Phase 7.7 implementation — canonical cross-content relationships

Phase 7.7 introduces a lightweight relationship/access layer at `lib/content/relationships.ts`. The five canonical datasets remain separate:

- Services → `data/services.ts`
- Research → `data/research.ts`
- Experts → `data/expertise.ts`
- Articles → `data/articles.ts`
- Workshops / Events → `data/events.ts`

No records were merged into a shared mega-dataset and no duplicate full content objects were introduced.

### Reference strategy

Existing relationship conventions are preserved rather than forcing a broad migration:

- Service IDs are used by Research and Expert references.
- Article Research/Service references can resolve by canonical ID or slug.
- Article authors resolve by `authorId` or `authorSlug`.
- Event speakers resolve by `speakerId` or `speakerSlug`.
- Event Research/Service and related-event references resolve by canonical ID or slug.
- Expert relationship arrays continue to use canonical IDs.

Resolution is performed outside the raw canonical data modules to avoid circular imports.

### Relationship access layer

The relationship layer provides only the current useful resolvers:

- Service → Research / Articles / Experts
- Research → Services / Articles / Experts
- Article → Expert / Research / Services
- Workshop → Expert / Research / Services
- Expert → Services / Research / Articles

Reverse relationships are derived where practical instead of requiring duplicate relationship entries in both records.

Invalid references resolve to an omitted result rather than an unrelated fallback.

### Existing UI integration

Only existing related-content UI was migrated:

- Article detail now resolves author, Research and Service relationships through the central relationship layer.
- Research-to-Service rendering now resolves through the relationship layer.
- Expert detail now resolves Services, Research and Articles through the relationship layer.

No new large related-content sections were added and no visual redesign was performed.

### Validation

`validateContentRelationships()` checks currently present relationship references for Services, Research, Experts, Articles and Events. In development, the relationship module reports unresolved references without changing production rendering behavior.

The current canonical Research, Expert, Article and Event collections are empty, so no new relationships were fabricated during Phase 7.7. Existing populated Services therefore remain unchanged.

### Architectural rule

Canonical content records contain references, not complete related records. Future relationships must resolve through `lib/content/relationships.ts` or the appropriate canonical accessor. Broken references must never fall back to another record.

Phase 7.7 does not implement the later navigation, site configuration, metadata, backend, database, CMS, admin, authentication, payments, search, SEO, performance, security or deployment work.



## Phase 7.8 implementation — global site configuration and navigation

Phase 7.8 establishes `data/site-config.ts` as the canonical frontend Site Configuration source. It contains:

- site name and existing site description
- canonical top-level route definitions
- primary navigation
- footer navigation groups
- shared Contact action
- existing default metadata values

The existing `data/navigation.ts` module is retained only as a compatibility re-export and does not define a second navigation dataset.

### Navigation consumers

The existing presentation components now consume the canonical configuration without changing their visual behavior:

- Desktop header → `primaryNavigation`
- Mobile header → `primaryNavigation` plus the shared Contact action
- Header Contact action → shared Contact action
- Footer Explore/Organization groups → `footerNavigation`
- Footer enquiry CTA → shared Contact action
- Header brand label → `siteConfig.siteName`
- Root metadata → `siteConfig.defaultMetadata`
- Service and Research breadcrumbs → canonical route definitions

Existing dropdown/mega-menu components remain data-driven through the same typed NavigationItem model and were not visually redesigned.

### Dynamic content navigation

Services continue to derive their actual service links from the canonical `data/services.ts` dataset. No duplicate service navigation records were introduced.

The site configuration provides `getServiceNavigation()` for future navigation surfaces that legitimately need dynamic Service links.

Research, Experts, Articles and Workshops retain their canonical datasets from Phases 7.3–7.6. No records were added solely to populate navigation.

### Routes and shared actions

The canonical route map currently covers the established public routes:

`/`, `/services`, `/research`, `/experts`, `/articles`, `/workshops`, `/about`, and `/contact`.

The shared global Contact action resolves to `/contact`, matching the existing header, mobile menu and footer behavior.

### Validation

`validateSiteConfig()` checks navigation labels, hrefs, duplicate entries within each navigation surface, child/group structure, and external-link classification. Validation runs only during development.

No social URLs, contact details, legal routes, or other placeholders were invented.

No breadcrumb database was introduced. Breadcrumbs continue to derive from their current route/content context while using canonical shared route definitions.

### Scope

No visual redesign, new website sections, backend, database, CMS, authentication, payments, search, SEO implementation, performance work, security hardening, deployment work, Phase 7.9 work, or dynamic-route architecture migration was introduced.


## Phase 7.9 implementation — dynamic content route architecture

Phase 7.9 standardizes the five dynamic frontend route families around their existing canonical content datasets and lookup helpers:

- Services → `/services/[slug]` → `getServiceBySlug(slug)`
- Research → `/research/[slug]` → `getResearchBySlug(slug)`
- Experts → `/experts/[slug]` → `getExpertBySlug(slug)`
- Articles → `/articles/[slug]` → `getArticleBySlug(slug)`
- Workshops / Events → `/workshops/[slug]` → `getEventBySlug(slug)`

### Route resolution

All five route families read Next.js 16 App Router `params.slug` server-side, resolve the record from the canonical dataset, and render only that resolved record. The Workshop/Event route now performs the same explicit `notFound()` check as the other dynamic routes before passing the typed record to its presentation component.

Static params for every family are derived directly from the canonical dataset. No duplicate slug arrays or page-local content maps were introduced.

### Canonical route generation

Article and Workshop/Event datasets now expose `getArticleHref()` and `getEventHref()` alongside the existing Service, Research and Expert href helpers. Dynamic metadata and generated internal links use these canonical helpers instead of reconstructing content URLs from display values in page components.

### Relationships

Existing cross-content relationships continue to resolve through `lib/content/relationships.ts` where dynamic detail UI displays those relationships. No duplicate relationship logic or fallback record behavior was introduced.

Workshop/Event related-event links remain based on the canonical Event dataset and now use the canonical event href helper. The event detail component receives an already-resolved `Event` record; route resolution is kept in the route layer.

### Invalid and empty data behavior

Missing dynamic records resolve to Next.js `notFound()` at the route layer. Canonical datasets remain unchanged and empty where they were empty; no fake content was added to make routes resolve.

Broken cross-content references continue to be omitted by the Phase 7.7 relationship layer rather than substituted with unrelated records.

### Phase 7.8 compatibility fix

The existing site configuration's default metadata description was changed to use a predeclared `siteDescription` constant, avoiding self-reference during `siteConfig` initialization. This is a correctness fix within the existing Phase 7.8 architecture and does not change the rendered site content.

### Scope boundary

No UI redesign, new content, backend, database, CMS, authentication, payments, advanced search, SEO implementation, performance optimization, security hardening, deployment work or Phase 7.10 work was introduced.


## Phase 7.10 implementation — canonical metadata foundation

Phase 7.10 adds a lightweight typed metadata layer at `lib/metadata.ts`. The layer consumes the existing Phase 7.8 Site Configuration and the canonical Phase 7.2–7.6 content records rather than introducing a second content lookup system.

### Metadata model

`SeoData` supports only the metadata controls currently useful to the frontend:

- optional title
- optional description
- optional image
- optional canonical
- optional noIndex

`createPageMetadata()` resolves page-level title/description fallbacks, canonical URLs, intentional noIndex behavior and Open Graph/site-name data. `createContentMetadata()` applies the same behavior to canonical content records.

### Fallback order

For dynamic content, the metadata flow is:

1. record SEO title/description/image when supplied
2. canonical record title/shortDescription/excerpt/description
3. Site Configuration default title/description

No artificial SEO copy is generated.

### Content SEO ownership

Services and Research now support optional typed SEO data in their canonical models, matching the existing SEO-capable Expert, Article and Event models. No SEO records were fabricated.

Dynamic detail routes continue to use the same canonical slug lookup as page rendering:

`params.slug → canonical lookup → record → generateMetadata()`

Missing records still use `notFound()`.

### Site-level metadata

The root layout consumes `siteConfig.defaultMetadata` and now provides centralized Open Graph title, description and site name. No default social image was added because the repository does not currently contain a verified site-level social image.

The project contains `app/favicon.ico`; no manifest, Apple icon, robots module or other icon asset was present in the repository paths inspected, so no placeholder assets were introduced.

No production/base URL was hard-coded. Canonical URLs remain route-relative and can receive an absolute metadata base through future project configuration without changing content records.

### Static pages

Homepage, Services, Research, Experts, Articles, Workshops, About and Contact now use the shared metadata utility. Existing factual page titles and descriptions are preserved; this phase does not change visible page content.

### Image handling

Metadata image references are emitted only when the supplied image is a valid absolute HTTP(S) URL or an existing file under `public/`. Missing local images are omitted rather than referenced as broken social-preview assets.

### Validation and boundaries

Repository searches found no current matches for the removed Phase 6 phrases. No fake images, social URLs, authors, organizations, event details or SEO claims were introduced.

Phase 7.10 does not implement keyword strategy, sitemap, robots optimization, structured data, search targeting, internal-link strategy, performance SEO, local SEO, Search Console, backend, database, CMS, admin, authentication, payments, advanced search, security hardening or deployment.

The existing canonical content systems, navigation, relationships and dynamic route architecture remain the sources of truth.


## Phase 7.11 implementation — content integrity and safe error handling

Phase 7.11 adds a lightweight validation entry point at `lib/content/validation.ts`. It consumes the existing canonical datasets and Phase 7.7 relationship layer; it does not create duplicate lookup maps or mutate content.

### Validation layers

The validation layer checks:

- required identity fields, IDs and slug uniqueness/format
- content-specific required and optional field constraints
- dates and event end-date ordering
- event registration status/URL and format values
- boolean flags such as `featured`
- optional metadata structure, canonical URLs and images
- cross-content relationship references
- canonical Site Configuration/navigation validation

Existing per-dataset validators remain the authoritative low-level checks and are reused rather than replaced.

### Severity and behavior

Critical integrity failures are reported as `error` and fail the validation entry point. Unusual but user-safe conditions, such as a missing optional local image, are reported as `warning`.

Developer diagnostics use a structured format containing content type, record, severity and issue. They are not rendered into public UI.

Broken optional cross-content references are not substituted with another record. Existing relationship accessors continue to omit unresolved targets, preserving safe public rendering.

### Runtime/build integration

The root server layout invokes `runContentIntegrityValidation()`, keeping validation server-side and outside Client Components. Empty Research, Expert, Article and Event collections remain valid states.

The existing canonical dataset validators continue to reject duplicate IDs/slugs and malformed required identity data. Relationship validation reports broken references without introducing fallback records.

### Metadata and assets

Phase 7.10 metadata remains the canonical metadata source. Phase 7.11 validates optional SEO title/description/canonical/image/noIndex structure and reports missing local assets as warnings rather than generating replacements.

### Safety boundaries

No production content is mutated during validation. No IDs, slugs or relationships are auto-generated or rewritten. No fake records are added for testing.

The removed Phase 6 sections remain absent. No UI redesign, backend, database, CMS, authentication, payments, advanced search, full SEO, performance, security or deployment work was introduced.

### Validation entry point

The frontend now has one shared content-integrity entry point:

`runContentIntegrityValidation()`

It reuses:

- Services → `data/services.ts`
- Research → `data/research.ts`
- Experts → `data/expertise.ts`
- Articles → `data/articles.ts`
- Workshops → `data/events.ts`
- Relationships → `lib/content/relationships.ts`
- Site configuration → `data/site-config.ts`

The public application continues to use the existing canonical routes and safe `notFound()` behavior for invalid dynamic slugs.

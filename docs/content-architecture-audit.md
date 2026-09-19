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

ResearchEntry supports id, title, slug, category, shortDescription, summary, scope, topics, sections, methodology, audience, highlights, relatedServiceIds, date, status, type, topic, image, href, featured and tags.

researchEntries is empty.

Research routes and directory components consume this dataset directly. No filler research records are present.

Research has an explicit relatedServiceIds field, but no explicit article or expert relationship field.

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

Stop at Phase 7.1. Do not begin Phase 7.2, backend/database work, PostgreSQL, Prisma, authentication, admin, CMS, SEO refactoring or performance work from this document alone.

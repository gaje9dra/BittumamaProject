# Phase 8.21 — Audit Logging

## Scope
AuditLog is the canonical append-only application history for meaningful administrative, security, content, registration, payment, media, inquiry, notification, and system actions. Public reads, public searches, analytics events, UI interactions, and debug logs remain outside this table.

## Schema and typed values
AuditLog stores actorUserId, action, category, entity reference, result, severity, concise summary, sanitized metadata, optional request context, and a server-generated createdAt timestamp. Action, category, result, and severity are Prisma enums.

## Actor resolution
Authenticated administrative actions derive actorUserId from requireAdmin/session state. System operations use actorUserId = null and actor type SYSTEM in the service input. Browser clients cannot choose the actor.

## Metadata sanitization
AuditService centrally removes keys matching password, token, secret, apiKey, authorization, cookie, session, signature, cardNumber, CVV, accessToken, and refreshToken patterns. String values and field names are bounded. Business services pass only action-specific metadata.

## Immutability
No application route or admin UI edits or deletes AuditLog records. The admin interface is read-only. Retention/archival is intentionally not implemented in Phase 8.21.

## Authorization
The audit list/detail queries call requireAdmin server-side. The admin shell also protects the route, but route-level data access remains independently authorized. Audit pages are noindex and nocache.

## Transactional consistency
Security-sensitive state changes such as role changes and registration changes write their audit record in the same Prisma transaction as the state mutation. Verified payment state transitions are audited inside the payment transaction. Content mutations are audited in the content transaction. Best-effort audit writes are used for non-critical media/inquiry/notification operations where an audit-storage outage should not unnecessarily block the underlying operation.

## Integrated domains
Implemented integrations cover content create/update/publish/unpublish/archive, scheduled publication, media metadata/archive/restore/delete, user role changes including rejected self-demotion attempts, inquiry status changes, registration status/cancellation, verified payment state changes and admin reconciliation, notification retry, and authentication outcomes that the current Auth.js callback architecture can observe.

## Idempotency
Payment auditing occurs only when a verified payment state actually changes. Registration auditing occurs only when the requested status differs from the current status. Existing domain idempotency remains authoritative; audit logging does not introduce a separate event bus.

## Privacy and security
Audit metadata excludes credentials, tokens, raw webhook bodies, passwords, payment credentials, full inquiry messages, and other unnecessary private payloads. PaymentTransaction remains the financial source of truth. AuditLog is operational/security history, not a financial ledger or debug-log sink.

## Admin UI
/admin/audit-logs provides bounded page-based pagination, action/category/result/severity/entity filters, safe identifier/summary search, and a read-only detail view. The table is horizontally scrollable on narrow screens and uses semantic table markup and visible text for result/severity.

## Retention
No destructive retention policy is introduced. Future retention or archival can be added through a controlled system-level mechanism.

## Verification
Run:
- npm run prisma:validate
- npm run audit:verify
- npm run lint
- npm run build

The audit verification uses a database transaction and rolls it back after checking persistence, server-derived actor/timestamp fields, and metadata redaction, so the verification does not leave test audit rows behind.

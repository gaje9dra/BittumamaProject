# Bittumama API — Phase 8.22

## Base path

Canonical versioned API routes use `/api/v1`.

Authentication uses the existing Auth.js session. No second login system or API-key persistence was added because the repository has no concrete machine-to-machine API-key requirement.

## Access classes

- **PUBLIC** — published content/search and public inquiry submission.
- **AUTHENTICATED** — `/me`, own registrations, own payments, own notifications, and payment checkout.
- **ADMIN** — aggregate analytics and sanitized audit-log retrieval.
- **SYSTEM/WEBHOOK** — existing provider-specific payment callback routes remain outside `/api/v1`.

## Implemented endpoints

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/api/v1/search` | Public | Canonical Phase 8.20 search |
| GET | `/api/v1/content/:type/:slug` | Public | Published Service/Research/Expert/Article/Workshop |
| GET | `/api/v1/events/:slug` | Public | Published event + safe registration availability |
| POST | `/api/v1/inquiries` | Public | Validated contact inquiry |
| GET | `/api/v1/me` | Authenticated | Safe current-user profile |
| GET | `/api/v1/me/registrations` | Authenticated | Own registrations |
| GET | `/api/v1/me/payments` | Authenticated | Own payment history |
| GET | `/api/v1/me/notifications` | Authenticated | Own notification metadata |
| POST | `/api/v1/payments/checkout` | Authenticated | Authoritative payment checkout initiation |
| GET | `/api/v1/payments/:reference` | Owner/Admin | Safe payment state |
| GET | `/api/v1/admin/analytics` | Admin | Existing analytics aggregation |
| GET | `/api/v1/admin/audit-logs` | Admin | Existing sanitized audit-log query |

No API-key model, OAuth server, SDK, GraphQL, API billing, or developer portal was added.

## Response contract

Successful responses use:

```json
{
  "data": {},
  "meta": {}
}
```

Errors use:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message.",
    "requestId": "..."
  }
}
```

Known errors use HTTP semantics such as 400, 401, 403, 404, 409, 422, 429 and 503. Unexpected errors return a generic 500 `INTERNAL_ERROR`.

## Validation and security

- Route/query/body values are validated before domain calls.
- API request bodies are allowlisted; privileged fields are never mass-assigned.
- User-scoped resources are authorized from the authenticated session, never from a client-supplied owner field.
- Public content resolves through existing published repositories and therefore preserves publishing isolation.
- Search delegates to the canonical Phase 8.20 SearchService.
- Payment checkout delegates to Phase 8.17 payment services; clients cannot set amount, currency, status, provider state, or payment ownership.
- Inquiry submissions reuse Phase 8.8 validation/persistence/notification/analytics behavior.
- Audit and analytics APIs reuse their existing aggregation/query services.
- Private/admin responses are `private, no-store`.
- Public content/search responses use short, explicit cache lifetimes.
- No wildcard CORS policy was added because no browser cross-origin requirement exists.
- Request IDs are accepted only from a constrained header value or generated server-side.
- API rate limiting uses the existing application's lightweight server-side pattern; limits are deliberately endpoint-specific. It is not a distributed rate-limit service.
- Webhook routes remain provider-specific and outside the public versioned API namespace.

## Pagination

User collections use bounded `page` and `pageSize` values and return total/page metadata. Search reuses the existing bounded Phase 8.20 pagination model.

## Idempotency

Payment checkout continues to use the existing request-id/idempotency-key mechanism in Phase 8.17. No second payment transaction mechanism was introduced.

## Caching

- Public published content/search: short shared-cache headers.
- Authenticated, payment, notification, registration and admin responses: `private, no-store`.
- Payment/provider callbacks remain governed by their existing route behavior.

## Compatibility

Existing pre-8.22 routes remain available for current application callers. The new `/api/v1` routes are the canonical integration surface; they call the same domain services rather than duplicating business logic. No `v2` route was introduced.

## Webhooks

Existing payment return/webhook routes remain under their provider-specific paths. They continue to verify provider data and call the authoritative payment reconciliation service. No generic webhook endpoint was created.

## Scope boundary

Phase 8.22 does not add a mobile client, SDK, developer portal, public API marketplace, API billing, GraphQL/tRPC/gRPC/SOAP, WebSocket gateway, or Phase 9 functionality.

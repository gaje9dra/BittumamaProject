# Bittumama authentication architecture

## Normal users
- Login: `/login`
- Registration: `/register`
- Providers: Google and email/password
- Normal accounts use `User`; Google identities remain in `Account`.
- Email/password credentials are stored only as server-side password hashes.
- Normal authentication never grants administrator access.

## Administrators
- Login: `/admin/login`
- Provider: authorized admin email + separate admin password
- Credential authority: `AdminAccount`
- Session authority: `AdminSession`
- There is no public administrator registration endpoint.
- Provisioning: `npm run auth:bootstrap-admin` with `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD`, and `BOOTSTRAP_ADMIN_CONFIRM=YES` supplied outside source control.

## Authorization boundary
Admin pages and Phase 8.22 admin APIs use `requireAdminSession()`. They do not use `User.role` as the administrator credential authority. The legacy `User.role` field remains only for compatibility with application data.

## Credential separation
The same email may exist in both `User` and `AdminAccount`. Their password hashes and sessions are independent. A normal user password cannot authenticate at `/admin/login`, and Google is not an administrator login method.

## Security
Credential endpoints use the existing rate-limit infrastructure, generic errors, same-origin checks, server-side validation, HttpOnly cookies, secure production cookies, and Phase 8.21 audit logging. Passwords, hashes, OAuth tokens, session tokens, and reset secrets are never returned or written to audit records.

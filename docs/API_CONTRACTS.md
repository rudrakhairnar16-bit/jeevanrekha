# API contracts — proposed prototype surface

No endpoints exist yet. This is a review contract, not official ABDM API documentation. FastAPI OpenAPI will become the executable schema; generated TypeScript types must match it.

## Conventions

- Internal namespace `/v1`; browser uses same-origin `/api/v1` proxy.
- JSON except FHIR bundles and QR payload encoding. Random IDs; UTC RFC3339 times.
- Error shape: `{ "error": { "code": "CONSENT_EXPIRED", "message": "Request new permission", "request_id": "..." } }`.
- Stable codes: 400 invalid request; 401 unauthenticated; 403 denied/expired; 404 unavailable resource without confirming another patient's existence; 409 state conflict; 429 rate limited; 503 dependency unavailable.
- Cursor pagination; explicit partial/dependency status; idempotency header for mutations. Never return a hidden-record count.
- All protected endpoints use server-established identity and object-level authorization. No `role=doctor` shortcuts.

## Routes

| Method / path | Caller / behavior | Flow |
|---|---|---|
| POST `/sessions` | Mock identity adapter; production authentication deferred | F-01/02 |
| DELETE `/sessions/current` | End own session | F-14 |
| POST `/credentials` | Own enrolled account; independent issuance | F-01 |
| POST `/credentials/{id}/revoke` | Owner or reviewed recovery process | F-14 |
| POST `/patient-matches` | Professional; verify allowed two-identifier workflow | F-02 |
| POST `/consent-requests` | Professional; request bounded scope and duration | F-02 |
| GET `/me/consent-requests` | Citizen sees own pending requests | F-02 |
| POST `/consent-requests/{id}/decision` | Citizen; approve subset or deny | F-02 |
| POST `/grants/{id}/revoke` | Citizen; stop future release | F-04 |
| POST `/record-queries` | Professional; grant and match references; providers recheck | F-02 |
| GET `/me/access-events` | Citizen; sanitized own history | F-16 |
| POST `/family-capabilities` | Owner invites specific capability | F-06 |
| POST `/family-capabilities/{id}/revoke` | Owner ends capability | F-06 |
| PUT `/me/emergency-preferences` | Explicit choices and preview confirmation | F-01 |
| POST `/emergency-alerts` | Public; lookup ID, optional consented location; rate limited | F-08 |
| POST `/emergency-releases` | Mock responder; credential capability, device/request context | F-10 |
| POST `/break-glass-requests` | Authorized hospital professional; explicit purpose/reason/scope | F-12 |
| POST `/break-glass-requests/{id}/review` | Separate reviewer; cannot review own event | F-12 |
| POST `/emergency-summaries` | Authorized summary update client; protocol review gate | F-13 |
| GET `/transparency/proofs/{receipt}` | Proof only, no underlying clinical event | F-16 |
| POST `/report-shares` | Facility-to-aggregator, not browser | F-18 |
| GET `/aggregate-releases` | Approved dashboard role; no raw report export | F-20 |
| POST `/grievances` | Own account; reference number and status | F-21 |
| GET `/health` | Minimal readiness, no secrets or internal stack dumps | F-23 |

## Example consent request (JR mock, not ABDM schema)

```json
{
  "patient_match_id": "synthetic-match-reference",
  "purpose": "treatment",
  "categories": ["DiagnosticReport", "Prescription"],
  "record_date_range": {"from": "2026-01-01", "to": "2026-10-16"},
  "requested_duration_seconds": 7200
}
```

Server derives requester/facility from the session, caps duration, excludes sealed records by default and returns request ID plus review text. The citizen's decision binds to a request version; stale or changed requests cannot reuse approval.

## Provider contract

`POST /internal/records/query`: authenticated requester service supplies subject, grant reference, purpose, categories, date range and audience-bound capability. Provider independently checks live grant status and labels, then returns permitted bundles plus per-source availability. No fallback route returns an unfiltered patient timeline.

## Notification semantics

Public scanner receives generic accepted/denied workflow status, never patient name, family numbers or registered-contact existence. Delivery acknowledgments may be delayed. Location is scanner-provided, unverified and permission-dependent, not proof of incident location.

## What is intentionally unspecified

Exact session/DPoP format, key-release message transcript, official ABDM schemas, device attestation, VDAF messages and privacy parameters. Fill these only through ADR review and executable schema tests, not ad-hoc endpoint improvisation.

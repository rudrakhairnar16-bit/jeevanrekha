# Logical data model

Status: proposed, implementation-independent. Names are not migrations. Use random UUIDs; preserve external references separately. No PAN or Aadhaar-number fields.

## Ownership and entities

| Store / entity | Minimum fields | Classification / invariants |
|---|---|---|
| Trust: person | id, mock_abha_ref, display_name, birth_date, locale | IDENTITY; restricted display; DOB never telemetry |
| Trust: credential | id, person_id, kind, public_key_ref, status, created_at, revoked_at | IDENTITY/KEY reference; secrets live outside ordinary database |
| Trust: professional membership | professional_id, facility_id, role, status, issuer, verified_at | IDENTITY; server-authoritative mock registry |
| Trust: patient_match | id, person_id, professional_id, session_id, method, expires_at | AUDIT; no national search |
| Trust: consent_request | id, person_id, requester, facility, purpose, scope, date_range, expires_at, status | AUDIT; immutable requested scope |
| Trust: grant | id, request_id, approved_scope, issued_at, expires_at, revoked_at, external_artifact_ref | AUDIT; approved scope is subset of requested scope |
| Trust: family_capability | id, person_id, grantee_id, capabilities, expiry, status | AUDIT; relation never grants permission |
| Trust: public_preferences | credential_id, chosen_flags, recorded_choices, reviewed_at | PUBLIC only after affirmative choice |
| Provider: care_context | id, person_ref, issued_by, event_time, compartment | CLINICAL/SEALED; provider owns it |
| Provider: record | id, care_context_id, fhir_type, payload, source_kind, version, supersedes_id | CLINICAL/SEALED; no silent overwrite |
| Emergency: encrypted_summary | lookup_id, ciphertext, nonce, key_ref, summary_version, updated_at | EMERGENCY; no ordinary plaintext column |
| Emergency: release | id, lookup_id, requester, device_ref, reason, summary_version, decision | AUDIT; record actual release not just request |
| Trust: reminder | id, owner, prescription_ref, confirmed_schedule, state | CLINICAL reference; generic push text |
| Audit: event | id, actor_ref, subject_ref, kind, action_ref, outcome, occurred_at, correlation_id | AUDIT; encrypted, no payloads/secrets |
| Audit: commitment | event_id, commitment, tree_index, receipt_ref | AUDIT; salts restricted, not public identifiers |
| Trust: outbox | id, event_type, minimal_payload, idempotency_key, attempts, delivery_status | Inherits source class; bounded retries |
| Analytics: report_share | facility_ref, window_id, syndrome_id, report_id, share, protocol_version | Protected aggregate input; not a public aggregate |
| Analytics: release | id, window, geography, definition, source_set_ref, coverage, privacy_config, result, limitations | AGGREGATE only after release checks |

## State machines

- Credential: `ACTIVE → REVOKED`; reissue is a new credential, not a resurrection.
- Consent: `PENDING → GRANTED | DENIED | EXPIRED`; grant `ACTIVE → REVOKED | EXPIRED`.
- Family capability: `INVITED → ACTIVE → REVOKED | EXPIRED`.
- Alert delivery: `QUEUED → SENT → DELIVERED | FAILED | UNKNOWN`; do not equate SENT with received.
- Emergency release: `REQUESTED → DENIED | RELEASED`; access expiry cannot undo a completed release.
- Aggregate: `COLLECTING → VALIDATED → PRIVACY_REVIEWED → RELEASED`; or `DELAYED / REJECTED`.

## Core constraints

1. All times UTC; display in user's locale. Enforce expiry on server time.
2. Unique facility/report-window/syndrome contribution; retries use the same report ID.
3. Both aggregators must use the identical validated report set before combining.
4. Unknown/missing reports are not zero. An explicit nil report is distinct.
5. Local patient dedup applies only inside the reporting facility. District result must not claim globally unique persons.
6. Compartment links inherit labels and require reconciliation on refill/import.
7. Records and keys have different backup/access policies; no joined database dump should recreate every domain.
8. Retention values remain unapproved pending legal review; never default production to infinite retention.

## Fixture plan

Two fictional adult patients; one reminder-only caregiver; two doctors at different facilities; one responder; three provider nodes. Include routine lab, prescription, sealed linked prescription, stale emergency summary, corrected lab, conflicting result and missing facility report. All names and numbers explicitly fictional.

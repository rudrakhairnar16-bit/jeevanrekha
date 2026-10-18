# Technical blueprint

Date: 2026-10-16. Status: **proposed engineering choices, not owner-approved stack**.
UI/UX is intentionally pending. This is a synthetic prototype, not national infrastructure.

## Proposed stack and reasons

| Concern | Proposal | Why / trade-off |
|---|---|---|
| Citizen, doctor, responder and analytics interfaces | Next.js + React + TypeScript | One web codebase, typed UI, browser testing; native device/card capabilities remain mocked |
| API and domain logic | Python FastAPI + Pydantic | Fits existing Python/AI experience; explicit request schemas and generated OpenAPI |
| Persistence | PostgreSQL with separate databases and role credentials per trust/provider domain | Transactional consent/revocation; separation costs more setup than SQLite |
| Background work | Database outbox + small worker | Retryable alerts/audit without introducing Kafka or a complex queue first |
| Prototype deployment | Docker Compose, same-origin frontend reverse proxy | Reproducible multi-node demo, no cross-origin browser localhost mistakes |
| Tests | pytest; TypeScript typecheck; Playwright | Domain checks plus observable end-to-end tests |
| Crypto primitives | Maintained libraries: cryptography, Web Crypto where supported | No hand-written primitives; library versions selected and locked at scaffold time |
| Metrics/logs | Structured redacted logs; health checks | Keep observability minimal until data-leak checks pass |

Exact versions must be selected from maintained releases and committed in lockfiles during scaffold. Do not invent version pins now. No LLM or cloud account is required for the first vertical slice.

## Repository layout to create after approval

```text
apps/web/                 # role-based web interfaces; design pending
services/trust/           # credential, match, consent, family, audit APIs
services/provider/        # same adapter image, three isolated deployments
services/emergency/       # minimum encrypted summary and release policy
services/aggregation/     # educational two-process simulation only
packages/contracts/       # generated schema/types, never handwritten duplicates
fixtures/synthetic/       # reviewed entirely artificial records
infra/                    # compose, local networking and key generation
tests/                    # integration and browser suites
docs/                     # specifications and project memory
tools/                    # checks, seeding and data-safety tooling
```

Avoid a microservice explosion: trust modules may share one process initially. Provider nodes use distinct databases and credentials. Emergency remains separately deployed. Aggregator independence on one laptop is **simulation**, not institutional non-collusion.

## Ownership and request boundaries

- Browser → same-origin `/api`; frontend proxies to internal API services.
- Trust stores no routine clinical payloads. Providers filter scope and sealed labels before returning data.
- Browser cannot submit its own trusted role, facility, expiry or consent status.
- Each authorization is bound to subject, professional, facility, purpose, scope, audience and expiry.
- Notifications and transparency submissions use transactional outbox records with idempotency keys.
- External adapters start as mocks: ABHA, HIE-CM, HPR/HFR, notifications, IHIP, card chip and HSM.
- A mock ABDM consent is a demo artifact, not a real signed ABDM artefact.

## Safe first vertical slice

Synthetic patient → mock professional → active patient match → two-category consent → provider-filtered records → access history → expiry/revocation. Implement no emergency cryptography until this boundary works and SECURITY.md review gates are acknowledged.

## Deferred engineering choices

Production identity provider, institutional trust roots, actual HSM, device attestation, SMS supplier, native app, push delivery, patient matching thresholds, record retention and any real ABDM integration. UI navigation, visual style and screen layouts wait for UIUX_DISCUSSION.md.

## Operational targets

No latency, availability, penetration-test or accessibility certification is claimed. During scaffold measure baseline timings using a documented local environment; choose test thresholds from measurements, not national-scale aspirations.

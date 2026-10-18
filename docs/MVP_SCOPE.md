# MVP scope and implementation authorization

Date: 2026-10-16. **Clinical MVP build not started. Landing-page Phase 7 is separately authorized and implemented; this does not authorize the clinical slices below.**

## Goal
Demonstrate correct boundaries with entirely synthetic data. The national vision remains in SYSTEM_E2E.md; it is not the first release backlog.

## First release: executable vertical slices

1. Enrol two fictional adults through mock ABHA; issue independent phone/card credentials.
2. Authenticate mock professionals and facilities; explicitly match the patient.
3. Request labs + prescriptions for a short duration; grant/deny; enforce expiry and early revocation.
4. Retrieve synthetic FHIR-shaped records from isolated Hospital A, Lab B and Hospital C nodes. Sealed records remain excluded.
5. Grant reminder-only family permission; show generic pending/reminder alerts; revoke it.
6. Show deliberate Tier-0 choices and stranger preview; signed offline payload in an already-installed scanner; printed fallback.
7. Demonstrate mock responder authorization and a review-gated encrypted-summary experiment with an explicit warning label.
8. Demonstrate hospital emergency policy with only an approved synthetic non-sealed scope. No implicit opening of sealed compartments.
9. Show human-readable history, commitment inclusion checks and a mock independent witness.
10. Aggregate artificial counts through two processes; label it educational secret sharing, not validated Prio/VDAF or guaranteed DP.
11. Show missing-report coverage and human-review outbreak alerts.
12. Run downtime and abuse scenarios from TEST_PLAN.md.

## Mocked, not real
ABHA creation, Aadhaar verification, HPR/HFR lookup, ABDM gateway/consent artefacts, 108/112 dispatch, SMS/voice/push, physical chip biometrics, production HSM, IHIP and institutional auditors.

## Explicit exclusions
- Real patients, identity numbers, medical uploads or production care decisions.
- National deployment, real financial/insurance integrations or native mobile applications.
- Generative AI in emergency views; diagnosis/treatment recommendations.
- Home-built proof systems, a production DP claim or an unreviewed universal emergency bypass.
- Automatic punishment, epidemic declarations or guardian/nominee medical decision authority inferred from a data-rights role.

## Open matters must not be silently decided
Stack approval; UI/UX; sealed-emergency legal/clinical policy; consent-manager legal role; guardian/teen confidentiality; nominal durations; summary freshness thresholds; cryptographic protocol and privacy model.

## Definition of done
Each slice references a flow and ADR, has passing permission-denial tests, discloses its mocks, survives relevant failure cases, and has reproducible evidence. A working screen alone is not completion. No production-readiness statement without independent review.

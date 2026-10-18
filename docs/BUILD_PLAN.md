> **2026-10-16 superseding scope:** The owner has since authorized the real-time cinematic replacement and its validation. See CINEMATIC_IMPLEMENTATION.md and CINEMATIC_HANDOFF.md. Earlier phase-authorization statements below are historical, not current website limits. Clinical/backend/deployment gates remain unchanged.

# Build plan — dependency-ordered, review-gated

Date: 2026-10-16. Clinical roadmap: **proposed; not authorized**. Separately authorized landing-page work is tracked below.
Each checked box must have evidence, not just generated files. One task per reviewed change; split any task too large to test independently.

## Gate 0 — decisions before application code

- [x] Preserve owner specification and decision/flow history.
- [x] Add proposed technical, data, API, security and verification contracts.
- [x] G0.1 Record owner-approved Hybrid Cinematic landing-page direction and full storyboard in UIUX_DISCUSSION.md. Detailed design and stack approval remain pending.
- [ ] G0.2 Approve/adjust stack in TECH.md and first-release boundary in MVP_SCOPE.md.
- [ ] G0.3 Review SECURITY.md corrections against existing ADRs; create superseding ADRs where accepted.
- [ ] G0.4 Agree safe prototype defaults for sealed emergency access, summary protocol and synthetic analytics.

## Milestone 1 — runnable foundation

- [ ] T01 Scaffold proposed frontend/API and lock dependencies. Exit: verified setup commands in README and AGENTS; no placeholders claimed working.
- [ ] T02 Configure synthetic-only startup validation and secrets exclusion. Exit: real-integration flags fail closed. Tests A01/A32/A33.
- [ ] T03 Add isolated provider databases, migrations and reviewed synthetic seeds. Exit: trust DB has no routine clinical payload. ADR-006; F-02.
- [ ] T04 Add mock identities, professional/facility memberships and session authorization. Exit: forged role or cross-person ID fails A30/A31.
- [ ] T05 Build generated API types, schema checks and health endpoints. Exit: contract drift fails CI.

## Milestone 2 — one complete normal-care journey

- [ ] T06 Implement Stage 1 minimal identity + active patient-match record. ADR-012/013; F-02; A02/A03.
- [ ] T07 Add consent-request state machine, scope review and explicit allow/deny. ADR-014/015; F-02; A04/A05.
- [ ] T08 Provider-side grant verification and federated retrieval, with honest partial failures. ADR-006; F-02; A04/A29/A30.
- [ ] T09 Add live expiry/revocation and release-time race checks. F-04; A06/A34.
- [ ] T10 Add provenance/corrections and sealed linked-record filtering. ADR-007/018; F-05; A07.
- [ ] T11 Add minimized event history. ADR-033; F-16; A32.

**Review checkpoint:** owner runs synthetic doctor–patient journey before family/emergency work starts.

## Milestone 3 — family help

- [ ] T12 Add explicit family capability invitation, acceptance and revocation. ADR-020; F-06; A08/A30.
- [ ] T13 Add patient-confirmed reminder schedules and generic notifications through mock relay. F-07; A09.
- [ ] T14 Prevent sensitive inference through notification previews and family summaries. F-06/07; A08/A32.

## Milestone 4 — public emergency continuity

- [ ] T15 Add explicit Tier-0 choices and matching stranger preview. ADR-026; F-01/08; A10.
- [ ] T16 Sign minimal payload with maintained library and create installed offline scanner. ADR-027; F-09; A11/A12.
- [ ] T17 Add credential status/revocation, refresh dates and printed fallback. F-13/14; A19.
- [ ] T18 Add rate-limited, idempotent family-alert workflow and delivery-status states using mock relay. ADR-028; F-08; A10/A32.

## Milestone 5 — protected emergency experiment

- [ ] T19 Write exact experimental threat model and message transcript; review before implementation. ADR-029; SECURITY.md gate 1.
- [ ] T20 Implement narrow mock responder release with separate emergency service. F-10/11; A13–A15; disclose copyable QR and client compromise limits.
- [ ] T21 Add version update and independent anti-rollback check. F-13; A18.
- [ ] T22 Add approved mock hospital emergency scope and independent review queue. ADR-030/019; F-12; A16/A17. Do not decide sealed override implicitly.

## Milestone 6 — accountable evidence

- [ ] T23 Add salted commitments, Merkle inclusion checks and separately witnessed checkpoints. ADR-034; F-16; A21.
- [ ] T24 Buffer signed events on log outage; explicitly show pending verification. F-23; A29.
- [ ] T25 Add simple suspicious-access rules and human review. F-17; A22.

## Milestone 7 — population-signal experiment

- [ ] T26 Define facility-distinct metric, window, expected units and synthetic source-set registry. F-18/19; A26.
- [ ] T27 Demonstrate two-process additive aggregation with authenticated report IDs and same-batch reconciliation. ADR-037; A23–A25. Label as educational, not Prio3.
- [ ] T28 Add release controls, coverage, freshness and optional illustrative noise without claiming DP. ADR-038/039; A26/A27.
- [ ] T29 Add baseline trend/review signal and release commitment. F-20; A27.

## Milestone 8 — delivery and review

- [ ] T30 Run cross-role access tests and all outage drills. F-23; A29–A33.
- [ ] T31 Finalize browser journeys and accessible/translated UI after owner approval.
- [ ] T32 Capture demo evidence, instructions, known gaps and unrun tests. No national-scale/security-certification claim.

## Later / not first-release blockers

Real ABDM sandbox onboarding, real HSM, reviewed Prio/VDAF, formal DP accounting, children/nominee legal rules, account-recovery pilot, statutory grievance operations, incident exercises and independent clinical/privacy testing. Each needs its own reviewed feature spec.

## Per-task handoff format

```text
Task: Txx | ADR: ... | Flow: ... | Acceptance: Axx
Goal and non-goals:
Dependencies already verified:
Files expected to change:
Implementation steps:
Tests and failure cases:
Evidence actually obtained:
Mocked/deferred guarantees:
Next task:
```

This plan replaces separate duplicate prompt_plan/todo files. PROGRESS.md records session state; this file records task completion. Keep them consistent.


## Landing-page milestone — Hybrid Cinematic (owner requested)

This is a presentation-only track, separate from the clinical prototype milestones. It does not require implementing the national system. Application build is not started by adding this plan.

- [ ] LP01 Review approved Acts I–XIV and finale in UIUX_DISCUSSION.md; finalize typography, mark, language and map sourcing.
- [ ] LP02 Make semantic static narrative with all copy visible and working navigation; no animation dependency.
- [ ] LP03 Implement responsive visual stage: native desktop sticky experience and simpler mobile layout.
- [ ] LP04 Animate emergency credential, Tier 0, responder and factual family alert (Acts I–IV).
- [x] LP05 Implement explicit emergency-to-normal reset and consent illustration with working Allow/Deny states (Acts V–VI). Implementation tested; owner visual review pending.
- [x] LP06 Animate federation, sealed relationships and family capability separation (Acts VII–IX). Local illustrations tested; owner visual review pending.
- [x] LP07 Add conceptual key-split illustration and accessible technical explanation (Act X). Necessary-condition UI only; no key operation; owner visual review pending.
- [x] LP08 Add identity-to-aggregate transition, illustrative coverage and two-aggregator explanation (Acts XI–XII). Non-geographic field replaces map; no licensed map or individual tracking. Owner visual review pending.
- [x] LP09 Add witnessed-tamper illustration, care-continuity sequence and finale (Acts XIII–XIV). Predetermined comparison only; no cryptographic proof. Owner visual review pending.
- [x] LP10 Wire exactly two finale CTAs to honest destinations; architecture detail and labelled walkthrough if prototype unavailable. Both routes checked by keyboard and no-JavaScript navigation.
- [ ] LP11 Verify reduced motion, keyboard, screen reader structure, contrast, mobile/zoom, static fallback and smooth native scrolling.
- [ ] LP12 Record browser checks, screenshots, asset licenses and performance observations; owner review before calling the page complete.

**Acceptance:** no graphic accident, fake government affiliation, real emergency action or false cryptographic guarantee. All sample health/map numbers explicitly synthetic/illustrative. The visual direction is governed by UIUX_DISCUSSION.md; clinical/security limits are governed by SECURITY.md.


## Phase 1 delivery — 2026-10-16

Owner authorized foundation only. Completed runnable Next.js/TypeScript workspace, visual tokens, responsive layout, reusable controls, licensed local font, concept disclaimer and two informational routes. This partially implements LP01–LP03, not the entire static story. No clinical T01–T32 tasks are marked complete by this landing-page work.

Evidence: build/typecheck pass; five Playwright tests pass; screenshots in `../evidence/`. Next task: owner review, then Phase 2 complete static narrative. Full motion, map and interactions are not implemented.


## Phase 2 delivery — 2026-10-16
LP02 static English narrative and responsive layouts completed, with all Acts I–XIV and finale. LP10 honest CTA destinations supplied: `/walkthrough` and `/architecture`. Later-phase diagrams are static illustrations only, not completed motion tasks LP04–LP09. India-map asset remains deferred; district figures are synthetic. Tests cover four viewport widths and no-JavaScript story navigation. Phase 3 is next, not yet authorized.


## Phase 2 visual rebuild — supersedes the rejected initial delivery
Owner rejected the uniform heading/paragraph/card interpretation. Audit: [PHASE2_REBUILD_AUDIT.md](PHASE2_REBUILD_AUDIT.md). LP02/LP03 now use distinct scene-specific compositions and a persistent desktop emergency stage, with normal-flow mobile layouts. Static Phase 2 only: no consent handlers, caregiver switches, proof actions or scroll choreography. QR art appears only twice and its rendered bounds remain below 44px. Provider exchange and expired permission are visibly distinct; sealed episode includes linked medication, test and metadata. No new application dependency or clinical backend. Visual acceptance remains with owner.


## Phase 3 — Acts I–IV native-scroll motion
Owner authorized Phase 3. LP04 emergency group implemented without a new animation dependency: hero travel, one-pass scroll-linked scanner, credential-to-responder/limited-summary composition and factual notification entrance. Native scroll is not intercepted. Semantic text is never gated on animation. Desktop sticky stage; mobile only short notification movement. Live reduced-motion changes restore static fallback; no-JavaScript narrative stays complete. Automated checks and screenshots cover the first owner-review checkpoint. Phase 4 (routine care/consent) remains unauthorized.


### Phase 3 revision after failed owner review
Owner rejected first motion pass. Replaced its incidental motion with a shared public → responder → limited-summary stage and a persistent locked-history boundary. Scanner retimed to run within the public scene. Credential yields space to responder; no giant QR or added dashboard. Two new tests cover scan timing and scene spacing; 24-test suite passes. Current screenshots: `evidence/phase-3-revision/`. Phase 4 remains unauthorized.


## Phase 4 — routine care and scoped consent (LP05)
Owner asked to proceed next after Phase 3 revision. Implemented Acts V–VI reset and local-only consent choices. Narrative basis: ADR-012 identity ≠ permission, ADR-014 WHO/WHAT/WHY/HOW LONG; F-02 normal visit and F-04 expiry/revocation. This illustrates these boundaries; it does not implement their signed artefacts, provider enforcement or clinical APIs.

- No categories preselected; Allow requires at least one deliberate selection. Deny needs none.
- Only selected requested categories appear in allowed result; all other records remain locked.
- Revocation and manual illustrated expiry explain future-access limits and cannot erase received copies.
- Keyboard focus moves to outcome and returns to first category after reset. No-JavaScript fallback explains both outcomes with disabled controls. Reduced motion preserves interaction.
- 32 browser tests pass, including eight new consent cases; fresh screenshot and automated accessibility evidence in `evidence/phase-4/`. No Phase 5 motion or backend authorized.


## Phase 5 — distributed trust and privacy (LP06)
Owner asked to proceed next after Phase 4. Implemented Acts VII–IX only. Basis: ADR-015 federation, ADR-018 linked sealed compartments, ADR-020 capability-based family help; F-02/F-04 federated access and expiry, F-05 sealed relationships, F-06/F-07 reminder capabilities. UI illustration only—not execution of these clinical flows.

- Separate fictional Lab B → Hospital A, lab-only/treatment/two-hour scenario. Explicitly independent of preceding consent choice; expired path has no packet or active arrow. Four providers retain source records. Already received copies cannot be remotely erased.
- Linked episode, prescription, test and revealing metadata remain sealed while relationship tracing changes emphasis. No medical contents rendered.
- Reminder-only switch defaults off, can be removed, resets on reload; complete history stays locked. Generic preview contains no diagnosis or medicine name; no notification or treatment consent.
- Native-scroll bounded diagram movement, static/reduced-motion fallbacks, keyboard and hydration-safe disabled controls. No new package or clinical service.
- 40 Chromium tests pass, including eight new privacy tests. Four viewport widths, keyboard, live reduced motion, no JavaScript, consent independence, reload, no storage or write requests.
- Evidence: `evidence/phase-5/`; capture/accessibility tools under `tools/`. Automated checks are not certification or owner visual acceptance.
- Phase 6 and the healthcare backend remain unauthorized. Stop for owner review.


## Phase 6 — protection and population signals (LP07/LP08)
Owner's “go on” after Phase 5 authorized Acts X–XII only. Narrative basis: ADR-029 and F-10 necessary emergency conditions, corrected by SECURITY.md; ADR-037/038/039/040/041/042 and F-18/F-19/F-20 for aggregate signals, missing coverage and legal reporting separation. No clinical task T19–T22 or aggregation backend is completed by this UI.

- Emergency credential and protected service remain insufficient alone; an independent responder policy context is also necessary. Unchecked example inputs, no actual authentication/key derivation/release. Complete history remains locked even in the complete diagram.
- Fictional 81/100 vs 43/100 reporting scenarios with confidence and human-review cues. Missing is not zero; no validated threshold, inference engine, outbreak declaration or actual alert. Trend bars are absent in the limited-reporting comparison.
- Replaced point-like signal field with aggregate-period bars; no geography or individual points. Area-level view explicitly separate from legally governed identifiable reporting.
- Each of three facilities has two visible contribution paths, separate operator domains and downstream privacy controls. Trace controls change emphasis only; no shares/proofs/DP algorithm. Native disclosure explains non-collusion, source truth, release policy and count limitations.
- Desktop-only bounded native-scroll decorative enhancement. Mobile, no-JavaScript and reduced-motion paths remain legible without animation.
- Eight new browser tests bring total to 48. Evidence and reproduction under `evidence/phase-6/` and `tools/capture_signals.cjs`, `tools/check_signals_accessibility.cjs`.
- Stop for owner review. Phase 7 and clinical backend need separate authorization.


## Phase 7 — accountability, care continuity and finale (LP09/LP10)
Owner “continue” after Phase 6 authorized Acts XIII–XIV and the finale. Narrative basis: ADR-033/034, F-16/F-17 for audit privacy, independent comparison and human review; ADR-004/044 and F-23 for care continuity. SECURITY.md corrections govern proof completeness, witness independence and offline limits. No clinical T23–T25 or real transparency-log service is completed by this UI.

- Three generic fictional events, fixed example commitments and a saved event-02 reference. Local historical edit illustrates mismatch without changing the reference; missing reference takes precedence and means unavailable. Reset restores the baseline. No hashes/proofs computed or verified; no “verified” badge or automatically attributed blame.
- Internet, service and phone outage explanations change locally; care continues in every case. Offline URLs are not assumed to load. No blanket override, sealed-data opening, unconscious-phone biometric unlock or family treatment-consent inference.
- Bounded native-scroll evidence line, human connection and four fully readable finale lines. Mobile and reduced-motion use static composition. Exactly two finale CTAs remain: labelled walkthrough and architecture overview.
- Eight additional browser tests (56 total): four widths, independent reference/missing state, scenarios, keyboard destinations, no writes/storage/connectivity effects, reload, static no-JavaScript and reversible/live reduced-motion/breakpoint behavior.
- Evidence and reproduction: `evidence/phase-7/`, `tools/capture_closing.cjs`, `tools/check_closing_accessibility.cjs`. Automated checks do not establish owner visual acceptance or accessibility certification.
- Stop for owner review. Phase 8 broader QA and the healthcare backend need separate authorization.

# JeevanRekha — Decision Log (ADRs)

> **Living document** · Last updated **2026-10-16** · Owner: **Rudra Khaire**
> Read with: [SYSTEM_E2E.md](SYSTEM_E2E.md) (the *what*) · [FLOWS.md](FLOWS.md) (the *how*)
> Jump to: [Index](#index) · [Superseded ideas](#superseded) · [Open questions](#open) · [Tally vs spec](#tally) · [Fact-check](#factcheck) · [Sources](#sources)
> 48 decisions · 38 ✅ accepted (2 of them 🧪 need specialist review before production) · 8 🟡 proposed · 2 🔵 open

---

## 1. What this file is, and why it exists

An **Architecture Decision Record (ADR)** captures *one* significant decision: the situation that forced it, what was chosen, and what follows from it. The format comes from Michael Nygard (2011): **Title, Status, Context, Decision, Consequences** ([summary](https://www.raphaelbauer.com/posts/architecture-decision-records/), [template](https://deepwiki.com/architecture-decision-record/architecture-decision-record/3.1-michael-nygard-template)).

**Why we keep one:**

- **The *why* survives.** People and context change. Without the reasoning, later readers either keep an outdated choice or undo a good one without knowing why it was made ([CodeOpinion](https://codeopinion.com/architecture-decision-records-adr-as-a-log-that-answers-why/), [techdebt.fail](https://techdebt.fail/architectural-decisions/)).
- **Old ideas don't creep back.** JeevanRekha has already reversed several early ideas (two-finger lock, duress finger, token-only QR, per-hospital suppression). The log records why ([§ Superseded ideas](#superseded)).
- **The build can be checked against it.** MADR adds **Decision drivers, Considered options, Pros/Cons and Confirmation**, which says how we will verify the decision was actually implemented ([MADR template](https://devjourney.me/blog/madr-concept/)).

**Rules we follow** (from the sources above and [grasp.study](https://paths.grasp.study/modules/f53f191f-0669-49f1-913d-a7721859304a/lessons/235605cc-173c-4c47-a4b4-a6e5c713bb9c)):

1. One decision per record. Options must be at the same level of abstraction.
2. Always list at least one **negative** consequence.
3. Accepted ADRs are not rewritten. A change gets a **new ADR that supersedes** the old one.
4. An ADR is not a design document. Step-by-step behaviour lives in [FLOWS.md](FLOWS.md).

### Our template (compact MADR)

```text
ADR-NNN — Title
Status · Area · Spec parts (SYSTEM_E2E "P#") · Flows (FLOWS "F-##")
Context        – the problem and the forces at play
Decision       – what we will do
Options        – what else was on the table, and why not
Consequences   – good (+) and bad (−)
Confirmation   – how we will know it is really implemented (test, demo check, review)
```

### Status legend

| Mark | Meaning |
|---|---|
| ✅ **Accepted** | Locked. Change only through a superseding ADR. |
| 🟡 **Proposed** | Recommended and consistent with the spec, but not yet confirmed by the owner. |
| 🔵 **Open** | Still being decided. A proposed default is given. |
| 🧪 **Specialist review** | Concept accepted. The exact protocol or legal text must be reviewed before production. |
| ⛔ **Superseded** | Replaced. Kept for history. |

---

<a id="index"></a>
## 2. Index

| ID | Decision | Status | Area |
|---|---|---|---|
| [ADR-000](#adr-000) | Record significant decisions as ADRs | ✅ | Meta |
| [ADR-001](#adr-001) | Build on ABHA/ABDM; no new national Health ID | ✅ | Foundation |
| [ADR-002](#adr-002) | PAN is not part of the health architecture | ✅ | Foundation |
| [ADR-003](#adr-003) | Aadhaar: optional identity proofing only | ✅ | Foundation |
| [ADR-004](#adr-004) | Care is never denied because JR failed | ✅ | Principle |
| [ADR-005](#adr-005) | Scope boundary: what JR can and cannot see | 🟡 | Foundation |
| [ADR-006](#adr-006) | Clinical records stay federated | ✅ | Data |
| [ADR-007](#adr-007) | Provenance on every item; append-only corrections | ✅ | Data |
| [ADR-008](#adr-008) | Ingestion: machine-generated sources first | ✅ | Data |
| [ADR-009](#adr-009) | Named data classes with different controls | 🟡 | Data |
| [ADR-010](#adr-010) | Retention, withdrawal and deletion are different operations | 🟡 | Data |
| [ADR-011](#adr-011) | Interoperability through ABDM-compatible FHIR | ✅ | Data |
| [ADR-012](#adr-012) | Two-stage access: identity first, scoped consent second | ✅ | Access |
| [ADR-013](#adr-013) | Patient matching before any clinical request | ✅ (+🟡 amendment) | Access |
| [ADR-014](#adr-014) | Consent = WHO + WHAT + WHY + HOW LONG, short-lived | ✅ | Consent |
| [ADR-015](#adr-015) | JR consent rides on ABDM consent artefacts | 🟡 | Consent |
| [ADR-016](#adr-016) | Legal role of JR and entity separation | 🔵 | Legal |
| [ADR-017](#adr-017) | Consent and setup without a smartphone | ✅ (+🟡 receipt) | Inclusion |
| [ADR-018](#adr-018) | Sealed compartments that protect relationships | ✅ (+🟡 implementation) | Privacy |
| [ADR-019](#adr-019) | Break-glass vs sealed compartments | 🔵 | Privacy |
| [ADR-020](#adr-020) | Family help is capability-based, not access-based | ✅ | Family |
| [ADR-021](#adr-021) | Coercion: model it; no hidden duress button | ✅ | Safety |
| [ADR-022](#adr-022) | Children and the transition to adulthood | ✅ (+🔵 teens) | Family |
| [ADR-023](#adr-023) | Nominee for incapacity and death | 🟡 | Family / Legal |
| [ADR-024](#adr-024) | Accessibility and Indian languages | 🟡 | Inclusion |
| [ADR-025](#adr-025) | Emergency credential ≠ medical-record QR; three tiers | ✅ | Emergency |
| [ADR-026](#adr-026) | Tier 0: active choice, never pre-ticked | ✅ | Emergency |
| [ADR-027](#adr-027) | Offline Tier 0: small signed payload + printed lines | ✅ | Emergency |
| [ADR-028](#adr-028) | Family alert: honest wording, money-free channel | ✅ (+🟡 SMS) | Emergency |
| [ADR-029](#adr-029) | Tier 1: centrally available, not centrally readable | ✅ 🧪 | Emergency |
| [ADR-030](#adr-030) | Tier 2 break-glass: scoped, expiring, reviewed | ✅ (+🟡 legal map) | Emergency |
| [ADR-031](#adr-031) | Unconscious identity: layered confidence, caution-only | ✅ | Emergency |
| [ADR-032](#adr-032) | Emergency data freshness and blood-group safety | ✅ | Emergency |
| [ADR-033](#adr-033) | Audit logs are sensitive; alerts lead to investigation | ✅ | Audit |
| [ADR-034](#adr-034) | Transparency log for high-risk events | ✅ (+🟡 design) | Audit |
| [ADR-035](#adr-035) | Every credential is independent and revocable | ✅ | Credentials |
| [ADR-036](#adr-036) | Account recovery: delayed, loud, no single patient key | 🟡 | Credentials |
| [ADR-037](#adr-037) | Secure aggregation with two independent aggregators | ✅ 🧪 | Public health |
| [ADR-038](#adr-038) | Reporting unit, cadence and privacy parameters | ✅ (+🟡 cadence) | Public health |
| [ADR-039](#adr-039) | Always show coverage and confidence; missing ≠ zero | ✅ | Public health |
| [ADR-040](#adr-040) | Strengthen IDSP/IHIP; alerts recommend investigation | ✅ | Public health |
| [ADR-041](#adr-041) | Single notifiable cases stay in legal channels | ✅ | Public health |
| [ADR-042](#adr-042) | Government boundary: no "search citizen" | ✅ | Governance |
| [ADR-043](#adr-043) | Epidemic mode is bounded in advance | 🟡 | Public health |
| [ADR-044](#adr-044) | Availability is part of security | ✅ | Security |
| [ADR-045](#adr-045) | AI usage policy | ✅ (+🟡 emergency rule) | AI |
| [ADR-046](#adr-046) | Institutional separation of duties | ✅ | Governance |
| [ADR-047](#adr-047) | Grievance and breach response are first-class flows | ✅ | Operations |

---

<a id="adr-000"></a>
### ADR-000 — Record significant decisions as ADRs

✅ Accepted · Meta

- **Context.** The design went through three rounds: the original design doc, v2 (84 sections), and the end-to-end spec (70 parts). Early ideas were reversed along the way. Without a log, the reasons get lost.
- **Decision.** Keep one decision log (this file) in compact MADR style. Accepted records are never rewritten; changes supersede them.
- **Options.** (a) Nothing written: reasons lost. (b) One file per ADR (`docs/decisions/NNNN-*.md`, the adr-tools convention): better for teams, and we can split later. (c) **Single log file**: easiest to review for a solo project now.
- **Consequences.** + One place to answer "why?". − The file will grow. Split it once the build starts if reviews get noisy.
- **Confirmation.** Every PR that changes behaviour cites an ADR ID; the index is updated in the same PR.

---

## A. Foundation & scope

<a id="adr-001"></a>
### ADR-001 — Build on ABHA/ABDM; no new national Health ID

✅ Accepted · Foundation · P1, P3 · F-01, F-02

- **Context.** India already runs ABHA/ABDM at national scale: about 97.8 crore ABHAs and 121 crore linked records as of Sep 2026 ([New Indian Express](https://www.newindianexpress.com/india/2026/Sep/25/before-pm-jay-families-had-to-sell-land-to-get-treatment-minister-j-p-nadda)). ABDM is federated and consent-based ([eHealth](https://ehealth.eletsonline.com/2026/06/india-surpasses-100-crore-health-records-linked-to-abha-strengthening-the-worlds-largest-digital-health-ecosystem/)). A new ID would duplicate it and be the first objection from any reviewer.
- **Decision.** ABHA, or another approved health identity, identifies the citizen. JR adds trust, consent UX, emergency, family and privacy-safe analytics layers around the existing rails. Internally JR may use a random technical identifier, but never a new citizen-facing number.
- **Options.** A new "JR Health ID": rejected (duplication, adoption cost, one more identifier to protect). Aadhaar as the health ID: rejected (see [ADR-003](#adr-003)).
- **Consequences.** + Reuses ABDM registries (HPR, HFR), consent artefacts and FHIR profiles. − Depends on ABDM availability and specifications; some gaps need extensions ([ADR-015](#adr-015), [ADR-018](#adr-018)).
- **Confirmation.** The prototype uses a mock ABHA/HIE-CM with ABDM-shaped messages. No JR-issued citizen number appears in any UI.

<a id="adr-002"></a>
### ADR-002 — PAN is not part of the health architecture

✅ Accepted · Foundation · P1, P67

- **Context.** The original brief mentioned "Aadhaar and PAN department-level security". PAN has no clinical purpose. Linking it would attach a financial identifier to health data and widen the impact of a breach.
- **Decision.** JR never collects, stores or derives PAN. Insurers and financial services do their own legally required KYC outside JR.
- **Options.** PAN as secondary verification: rejected (no health use case; violates data minimisation).
- **Consequences.** + Smaller blast radius and simpler compliance. − None material for care.
- **Confirmation.** Schema review: no PAN field in any JR store, API or log.

<a id="adr-003"></a>
### ADR-003 — Aadhaar: optional identity proofing only

✅ Accepted · Foundation · P1, P29 · F-01, F-15

- **Context.** The original idea matched Aadhaar-linked fingerprints at every visit. Per-visit UIDAI authentication would give the identity system a record of which hospital authenticated whom and when, which breaks "Separate". UIDAI's rules for requesting entities say biometric and OTP data captured for authentication must not be kept in permanent storage, and the Aadhaar number must not be used as a domain-specific identifier ([S.S. Rana summary](https://ssrana.in/articles/aadhaar-authentication-by-private-entities-from-data-privacy-perspective/)). The Aadhaar Act requires "alternate and viable means of identification" when authentication fails (s.8(2)(b) proviso) and bars denying service to someone who refuses or is unable to authenticate (s.4(6)) ([Act as amended](https://uidai.gov.in/images/Aadhaar_Act_2016_as_amended.pdf)).
- **Decision.**
  - Use Aadhaar only where legally permitted, typically inside ABHA's own creation/KYC flow. It is never the everyday medical-record key.
  - JR never stores Aadhaar biometrics, OTPs or PID blocks, and never uses the Aadhaar number as an identifier.
  - Every Aadhaar step has a non-Aadhaar alternative.
- **Options.** Per-visit UIDAI biometric matching ("mode C" in the original design): ⛔ superseded. Aadhaar number as primary key: rejected (UIDAI rule; linkage risk).
- **Consequences.** + No visit trail at the identity provider, and aligned with law. − Identity proofing depends on ABHA flows, and JR needs its own credentials for routine access ([ADR-012](#adr-012)).
- **Confirmation.** Data-flow review shows no Aadhaar data entering JR stores. Enrolment succeeds with zero Aadhaar input.

<a id="adr-004"></a>
### ADR-004 — Care is never denied because JR failed

✅ Accepted · Principle · P29, P55, P57 · F-23

- **Context.** Fingerprints fail (manual workers, the elderly), phones die, networks drop and servers go down. A health system that blocks treatment when authentication fails causes harm. Aadhaar law also requires alternate means ([ADR-003](#adr-003)).
- **Decision.** Every flow has a degraded or non-digital path. Treatment proceeds on clinical need. A JR failure can reduce the information available, never access to care.
- **Options.** A strict gate (no authentication → no record → delay): rejected.
- **Consequences.** + Patient safety. − Some actions happen without digital evidence and must be reconciled later (queued records, post-hoc audit).
- **Confirmation.** Every flow in FLOWS.md states a *minimal guarantee*. The failure-mode matrix is exercised in the demo ([F-23](FLOWS.md#f-23)).

<a id="adr-005"></a>
### ADR-005 — Scope boundary: what JR can and cannot see

🟡 Proposed · Foundation · P3, P33, P37

- **Context.** Promises such as "every access leaves a trace" are only true for access that goes through JR. A hospital employee reading the hospital's own EMR never touches JR.
- **Decision.** State the boundary explicitly. JR governs and audits *JR-mediated* access: cross-facility exchange, emergency tiers, family capabilities and analytics. Access inside a facility's own EMR remains the facility's responsibility. JR can require minimum standards from participating facilities but cannot enforce them technically.
- **Options.** Implicitly promise full coverage: rejected (misleading).
- **Consequences.** + An honest promise that holds up in review. − A real risk (insider snooping inside hospitals) stays outside JR's control.
- **Confirmation.** Citizen-facing history is labelled "Access through JeevanRekha".

---

## B. Data & records

<a id="adr-006"></a>
### ADR-006 — Clinical records stay federated

✅ Accepted · Data · P3 · F-02

- **Context.** A central copy of national medical history would be the biggest possible target. Real precedent: the AIIMS Delhi ransomware attack (23 Nov 2022) forced about two weeks of manual operation. CERT-In reported 5 servers and about 1.3 TB encrypted, and blamed improper network segmentation for the spread ([timeline](https://www.cm-alliance.com/aiims-attack-timeline-download)).
- **Decision.** Records stay with the providers that hold them (hospitals, labs). JR stores only trust metadata: credentials and their status, consent references and receipts, capabilities, emergency configuration, security events and protected audit evidence. **One deliberate exception:** pre-computed emergency summaries, stored encrypted under a two-part secret ([ADR-029](#adr-029)).
- **Options.** Central repository: rejected (honeypot). Patient-only storage: rejected (availability; [ADR-036](#adr-036)).
- **Consequences.** + A breach of JR is not a breach of everyone's history. − Retrieval depends on provider uptime, so partial results must be shown honestly ([F-02](FLOWS.md#f-02)).
- **Confirmation.** The prototype runs Hospital A, Lab B and Hospital C as separate services with separate databases. The JR database has no clinical tables apart from encrypted emergency blobs.

<a id="adr-007"></a>
### ADR-007 — Provenance on every item; append-only corrections

✅ Accepted · Data · P4, P32 · restores v2 §66–67 · F-02, F-13

- **Context.** Patient-uploaded scans and self-reported allergies are useful but less reliable than lab-issued results. Silent edits destroy accountability.
- **Decision.**
  - Every item carries provenance: *Verified – Hospital*, *Verified – Lab*, *Patient uploaded* or *Patient reported*, plus issuer, date and import path.
  - A correction keeps the original, the correction, the author, the time and the reason.
  - Conflicting records from different sources are shown side by side in date order. JR never picks a "truth".
- **Options.** A single merged "clean" record: rejected (hides disagreement; liability).
- **Consequences.** + Clinicians can judge reliability. − The UI must stay simple: labels, not version trees.
- **Confirmation.** UI test: patient-reported and verified items never share a visual style, and a corrected item links to its history.

<a id="adr-008"></a>
### ADR-008 — Ingestion: machine-generated sources first

✅ Accepted · Data · P58 · F-02

- **Context.** OPD doctors have minutes per patient and will not fill in long forms. ABDM's Digital Health Incentive Scheme already pays facilities for linked records ([PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2281466&reg=3&lang=1)).
- **Decision.** Priority order: e-prescriptions → lab results → discharge summaries → diagnostic reports → structured encounter summaries → patient uploads (labelled). Manual entry is allowed and labelled by provenance.
- **Options.** Doctors typing full histories: rejected (won't happen).
- **Consequences.** + Realistic adoption. − Early timelines will be sparse where providers are not yet digitised.
- **Confirmation.** The demo timeline is built only from e-Rx, lab and discharge FHIR bundles plus one labelled upload.

<a id="adr-009"></a>
### ADR-009 — Named data classes with different controls

🟡 Proposed · Data · restores v2 §75 · P33, P35

- **Context.** v2 numbered data classes 0–6. The numbers read like a sensitivity scale but weren't one: emergency data was "4" and sealed data "3". The end-to-end spec dropped classification, yet the build needs it for encryption, logging and retention.
- **Decision.** Use names instead of numbers:
  - `PUBLIC`: Tier-0 flags, system information.
  - `IDENTITY`: ABHA reference, name, photo.
  - `CLINICAL`: routine records.
  - `SEALED`: compartment data.
  - `EMERGENCY`: Tier-1 summary.
  - `KEY`: key material and key shares.
  - `AUDIT`: access logs and consent receipts.
  - `AGGREGATE`: released statistics.

  Each class has a control profile: encryption, who can read, log level and retention.
- **Options.** Numeric levels: rejected (false ordering). No classification: rejected.
- **Consequences.** + Drives schema tags and policy checks. − Requires discipline for every new field.
- **Confirmation.** Every DB column and API field carries a class tag. A CI lint (a simple JSON-schema check in the prototype) fails on untagged fields.

<a id="adr-010"></a>
### ADR-010 — Retention, withdrawal and deletion are different operations

🟡 Proposed · Data · restores v2 §64–65 · F-21

- **Context.** "Delete my data" cannot erase a hospital's legally required record. Withdrawing consent stops future access but cannot un-see past lawful access. DPDP's main duties (notice, security, breach intimation, retention, rights) apply from **13 May 2027** ([VertiComply](https://verticomply.com/blog/dpdp-rules-2025-health-apps-india)).
- **Decision.** Model these separately:
  - withdraw future consent
  - unlink from ABHA (where allowed)
  - delete JR-held data (where legally permitted)
  - provider retention (the provider's duty)
  - correction
  - archival
  - de-identification

  Keep a per-class retention table, to be filled in with legal review. The ABDM artefact's `dataEraseAt` governs how long the receiving side may store shared data.
- **Options.** A single "Delete" button: rejected (misleading).
- **Consequences.** + Honest UX, ready for compliance. − More states to implement.
- **Confirmation.** The rights/grievance flow ([F-21](FLOWS.md#f-21)) implements each operation as a separate action with its own receipt.

<a id="adr-011"></a>
### ADR-011 — Interoperability through ABDM-compatible FHIR

✅ Accepted · Data · P59 · F-02

- **Context.** Hospitals use many different HMIS vendors.
- **Decision.** Integrate through ABDM-compatible APIs and the FHIR R4 profiles used in the ABDM ecosystem. Publish connectors/SDKs for vendors. Never mandate a single vendor.
- **Options.** Proprietary JR format: rejected.
- **Consequences.** + Vendor-neutral. − Tied to how ABDM profiles evolve.
- **Confirmation.** The prototype exchanges FHIR Bundles validated against the chosen profile set.

---

## C. Identity, consent & access

<a id="adr-012"></a>
### ADR-012 — Two-stage access: identity first, scoped consent second

✅ Accepted · Access · P5, P6, P8 · F-02 · **Supersedes** the original "Two-Finger Lock"

- **Context.** The original idea: finger 1 unlocks identity, finger 2 unlocks records, using any 2 of 10 fingers. But two fingerprints are the *same* factor ("something you are"). Security guidance (NIST SP 800-63B) accepts biometrics only together with a physical authenticator. And 90 finger combinations is only about 6.5 bits, which is not a real secret.
- **Decision.** Keep the two-stage philosophy but change the mechanism:
  - **Stage 1 (identity):** a device-bound credential (phone key or card), unlocked locally with biometric or PIN, or an approved fallback (OTP, assisted).
  - **Stage 2 (permission):** a human-readable, scoped consent decision ([ADR-014](#adr-014)) signed by the patient's device or card.
- **Options.** Two fingers: ⛔ superseded. One unlock that reveals everything: rejected.
- **Consequences.** + Real two factors (possession + local unlock) and real consent. − Needs device/card issuance and fallbacks for people without phones ([ADR-017](#adr-017)).
- **Confirmation.** Pen-test cases: a fingerprint alone cannot complete Stage 1, and Stage 1 alone returns only minimal identity fields.

<a id="adr-013"></a>
### ADR-013 — Patient matching before any clinical request

✅ Accepted (amendment 🟡 proposed) · Access · P7 · F-02, F-11

- **Context.** Wrong-patient errors are common. A passive "I have matched the patient" checkbox gets clicked out of habit.
- **Decision.** After Stage 1 the clinician sees limited identity (name, photo, age/DOB band, ABHA reference) and must complete matching before requesting any records.
  - **Amendment (proposed):** an *active* two-identifier check. The clinician asks the patient's DOB and types it, or picks it from three options, and JR compares.
  - In emergencies, identity confidence follows [ADR-031](#adr-031).
- **Options.** Passive checkbox: rejected (habituation).
- **Consequences.** + Fewer mix-ups. − Adds a few seconds per visit.
- **Confirmation.** The request API rejects any call without a `PATIENT_MATCHED` event less than 10 minutes old for that session.

<a id="adr-014"></a>
### ADR-014 — Consent = WHO + WHAT + WHY + HOW LONG, short-lived

✅ Accepted · Consent · P8, P9 · F-02, F-04

- **Context.** In Indian clinics patients rarely refuse a doctor, so real protection has to come from good defaults, not from consent screens alone.
- **Decision.**
  - Every request shows the requester, facility, categories, purpose and duration.
  - The default scope comes from a specialty "minimum necessary" template.
  - Sealed categories are never included by default.
  - Access expires automatically (e.g. 2 h). Continuing care needs an explicit grant.
  - Every grant produces a signed receipt.
- **Options.** Blanket "share all history": rejected. Permanent doctor access: rejected.
- **Consequences.** + Limits exposure even when patients simply tap "Allow". − Doctors may need a second request, and the templates need maintenance.
- **Confirmation.** Access after expiry returns 403. The demo shows a sealed record missing from a granted scope.

<a id="adr-015"></a>
### ADR-015 — JR consent rides on ABDM consent artefacts

🟡 Proposed · Consent · P1, P3, P59 · F-02, F-04, F-12

- **Context.** ABDM already has a consent manager. Providers release data only against ABDM's **signed consent artefact**, which lists care contexts, HI types, date range, a storage limit (`dataEraseAt`) and a one-time encryption key ([Nirmitee HIU guide](https://nirmitee.io/blog/building-abdm-hiu-from-scratch-m3-flow-reference-architecture/)). Its purpose codes include `CAREMGT`, `BTG` (break the glass), `PUBHLTH`, `HPAYMT`, `DSRCH` and `PATRQT` ([ABDM docs mirror](https://docs.coronasafe.network/abdm-documentation/overview-of-fhr-framework/apis-and-standards)). A parallel JR consent system would duplicate ABDM and contradict the "not another ABHA" core idea.
- **Decision.** JR's policy engine sits *on top of* ABDM consent and can only make requests **narrower**, never broader: scope templates, sealed exclusions, shorter expiry. JR stores references and receipts; it does not become a competing authority. Tier 2 maps to purpose `BTG`.
- **Options.** JR as its own consent authority: rejected (duplication; providers would not honour it).
- **Consequences.** + Works with existing providers. − Some JR features, such as compartments, need ABDM extensions or provider-side labels ([ADR-018](#adr-018)).
- **Confirmation.** The mock HIE-CM issues artefacts in ABDM's shape, and every JR-narrowed request is a strict subset of what was asked.

<a id="adr-016"></a>
### ADR-016 — Legal role of JR and entity separation

🔵 Open · Legal / Governance · P60

- **Context.** From **13 Nov 2026**, DPDP Consent Managers must register with the Data Protection Board. Conditions: an Indian company, net worth ≥ ₹2 crore, independent certification, consent records kept ≥ 7 years, no conflicts of interest, and they **must not read** the personal data flowing through them. Using a Consent Manager is not mandatory ([LawSikho](https://lawsikho.com/blog/consent-manager-framework-and-obligations-under-the-dpdp-rules-2025/), [VertiComply](https://verticomply.com/blog/dpdp-rules-2025-health-apps-india)).
- **Proposed direction.**
  - If any JR component acts as a Consent Manager, it must be a separate entity from the emergency service and the analytics services, since those must process data.
  - A student prototype is a *reference design*, not an operator.
- **Options.** One company runs everything: rejected (legal conflict; violates "Separate"). Skip the Consent-Manager route and run JR as ABDM-integrated PHR/HIU apps plus an emergency service: viable.
- **Consequences.** + The legal structure mirrors the security architecture. − A real deployment needs institutional partners.
- **Confirmation.** Specialist legal-matrix review before any pilot.

<a id="adr-017"></a>
### ADR-017 — Consent and setup without a smartphone

✅ Accepted (receipt 🟡 proposed) · Inclusion · P54 · F-03

- **Context.** Many citizens have a feature phone or no phone. If consent is shown on the facility's screen, the facility controls what the patient sees.
- **Decision.** Card + PIN (or an assisted fallback) at the facility terminal. Staff can **never** choose disclosure settings for the citizen.
  - **Proposed:** after every grant, send an SMS/IVR receipt in the citizen's language with a revoke code, or print a slip.
- **Options.** Exclude people without phones: rejected. Staff-operated consent with no receipt: rejected.
- **Consequences.** + Inclusion, with a check on facility behaviour. − SMS/IVR cost and language support.
- **Confirmation.** Demo: a card-only patient grants 2 h of lab access, and the mock SMS receipt shows the scope and a revoke code.

<a id="adr-018"></a>
### ADR-018 — Sealed compartments that protect relationships

✅ Accepted (implementation 🟡 proposed) · Privacy · P11, P12 · F-05

- **Context.** Hiding a diagnosis while showing its signature medicine (e.g. lithium, ART) still leaks the diagnosis. ABDM artefacts scope data by care context, HI type and dates, not by sensitivity ([Nirmitee](https://nirmitee.io/blog/building-abdm-hiu-from-scratch-m3-flow-reference-architecture/)).
- **Decision.**
  - Sealed compartments cover mental health, HIV, reproductive care, legally protected pregnancy information, genetic data, and anything else protected by law.
  - Sealing **propagates** to the linked diagnosis, prescriptions, tests, notes, attachments and revealing metadata.
  - **Implementation:** seal at care-context level and put FHIR `meta.security` labels (HL7 sensitivity codes) on resources. Propose an ABDM extension for label-aware filtering.
- **Options.** Field-level hiding only: rejected (leaks). A separate app for sensitive care: rejected (fragmentation).
- **Consequences.** + Real privacy for stigmatised care. − Cross-episode leaks (e.g. a refill at another facility) need medication-level rules, which adds complexity.
- **Confirmation.** Test: a sealed episode's prescription does not appear in a normal "previous prescriptions" grant, in family views, or in Tier 0/1 unless the patient chose otherwise.

<a id="adr-019"></a>
### ADR-019 — Break-glass vs sealed compartments

🔵 Open · Privacy / Emergency · P28 · F-05, F-12

- **Context.** HL7's break-the-glass definition can override the patient's consent directive ([HL7](https://terminology.hl7.org/6.3.0/ValueSet-v3-ActConsentDirective.html)). Clinically, a sealed medicine such as lithium can matter in an emergency.
- **Proposed default.**
  - The patient chooses per compartment when sealing: "emergency may open" or "never open".
  - By default only the emergency-relevant subset opens: current medicines and allergies inside the compartment.
  - Opening the full compartment needs a written justification plus a second clinician's approval, and the patient is notified afterwards.
- **Options.** Always open on break-glass: rejected (destroys trust). Never open: clinically risky.
- **Consequences.** Pending decision.
- **Confirmation.** Decide with clinical and legal reviewers, then convert to Accepted.

---

## D. Family & vulnerable users

<a id="adr-020"></a>
### ADR-020 — Family help is capability-based, not access-based

✅ Accepted · Family · P13–P15 · F-06, F-07

- **Context.** The original brief asked for a family app to monitor members' medicines. But a family relationship is not consent, and caregiving is not surveillance.
- **Decision.**
  - Capabilities are separate: reminders · missed-dose alerts · appointments · emergency alerts · selected records · legally appropriate guardian access.
  - Adult patients can mark items *private from family*.
  - Lock-screen and caregiver notifications stay generic ("Medication reminder missed"). Details appear only after authentication.
- **Options.** Family sees everything: rejected.
- **Consequences.** + Useful help without exposure. − More settings, so the UX must be very clear.
- **Confirmation.** Demo: the mother receives "missed reminder" without the medicine name.

<a id="adr-021"></a>
### ADR-021 — Coercion: model it; no hidden duress button

✅ Accepted · Safety · P53 · **Supersedes** the original "duress finger"

- **Context.** Controlling relatives and partners exist. A hidden duress mechanism can escalate violence if it is discovered, and it gives false confidence.
- **Decision.** The threat model covers coercive caregivers, abusive partners, forced consent, a stolen unlocked phone and shoulder surfing. Safety features (private-from-family, discreet notifications, easy revocation, quick exit) are designed with clinical and legal experts. There is no secret duress finger.
- **Options.** Duress finger: ⛔ superseded.
- **Consequences.** + Safer by design. − Some coercion cannot be solved technically.
- **Confirmation.** Expert review of sensitive-flow UX before any pilot.

<a id="adr-022"></a>
### ADR-022 — Children and the transition to adulthood

✅ Accepted (teen confidentiality 🔵 open) · Family · P52 · F-24

- **Context.** Guardian control has to end at some point. Indian law (the Aadhaar Act after the 2019 amendment, and DPDP) treats people under 18 as children.
- **Decision.**
  - Minors get guardian capabilities.
  - At 18 these expire automatically, and the young adult makes fresh choices: consent defaults, family capabilities and Tier 0 settings.
  - **Open:** whether guardians can see a 16–17-year-old's mental-health and reproductive visits.
- **Options.** Parent access continues by default: rejected.
- **Consequences.** + Respects autonomy. − Needs lifecycle jobs.
- **Confirmation.** A test account turning 18 loses guardian access and sees the setup prompts.

<a id="adr-023"></a>
### ADR-023 — Nominee for incapacity and death

🟡 Proposed · Family / Legal · restores v2 §54 · F-25

- **Context.** DPDP s.14 lets a person nominate someone to exercise their rights on death or incapacity, defined as "unsoundness of mind or infirmity of body" ([DPDPA s.14](https://www.dpdpa.com/dpdpa2023/chapter-3/section14.html)). The end-to-end spec mentions nominees only in passing.
- **Decision.**
  - The nominee is explicit, scoped and revocable.
  - They can approve continued access during incapacity and handle rights after death.
  - They **cannot block** emergency care, because DPDP s.7(f) allows processing for medical emergencies ([CADP](https://cadp.in/resources/articles/dpdp-act-key-provisions-explained/)).
  - They **cannot unseal** what the patient chose to keep sealed. The nominee is *the patient's voice, not their replacement*.
- **Options.** No nominee: rejected (incapacity is common). Nominee with full control: rejected.
- **Consequences.** + Covers coma, dementia and death. − Proving incapacity or death needs a legal process.
- **Confirmation.** Legal review. Optional in the demo.

<a id="adr-024"></a>
### ADR-024 — Accessibility and Indian languages

🟡 Proposed · Inclusion · restores v2 §69–70 · P54

- **Context.** Consent a person cannot read or understand is not consent.
- **Decision.**
  - Consent and emergency screens in Indian languages.
  - Large-text, screen-reader and low-literacy modes (icons + audio).
  - Feature-phone and IVR paths.
  - Tier 0 can show communication needs (e.g. "Deaf: write or use ISL").
- **Consequences.** + Inclusion. − Translation and QA cost.
- **Confirmation.** Usability test of the consent screen with non-English users.

---

## E. Emergency

<a id="adr-025"></a>
### ADR-025 — Emergency credential ≠ medical-record QR; three tiers

✅ Accepted · Emergency · P16 · F-08 – F-12

- **Context.** Original brief: scanning the QR notifies family with location and shows emergency history.
- **Decision.** Three tiers:
  - **Tier 0, public:** anyone.
  - **Tier 1, verified responder:** a minimum summary.
  - **Tier 2, hospital break-glass:** clinically necessary records.

  Holding the QR gives Tier 0 only. Professional authentication gives Tier 1. Break-glass authority gives Tier 2.
- **Options.** QR opens the history: rejected. Only authorised responders can alert family: rejected (bystanders arrive first).
- **Consequences.** + Useful at every stage without public exposure. − Three code paths to build and test.
- **Confirmation.** In tests, a photographed QR never yields Tier 1 data.

<a id="adr-026"></a>
### ADR-026 — Tier 0: active choice, never pre-ticked

✅ Accepted · Emergency · P17–P20 · F-01, F-08

- **Context.** Defaults decide outcomes: organ-donor consent was about 12% under opt-in Germany and about 99.98% under opt-out Austria (Johnson & Goldstein, *Science*, 2003). DPDP consent needs a **clear affirmative action** ([Privy by IDfy](https://www.privybyidfy.com/blog/dpdp-compliance-guide-2026-what-indian-enterprises-must-do-before-may-2027)). A public QR can be scanned outside emergencies, so the s.7(f) medical-emergency basis is weak for Tier 0.
- **Decision.**
  - **Always on** (no personal data): Call 112/108, Alert family, Good Samaritan note.
  - **Mandatory active choice** for each eligible flag (critical allergy, diabetes/epilepsy, blood thinner, implant, communication needs, verified blood group): *Public / Responders only / Don't show*. A "Recommended" label is allowed; pre-ticking is never allowed.
  - **Stranger preview** before anything is enabled.
  - **Never on Tier 0:** full history, full medication list, sealed data, home address, unrestricted identity, DNR or living will. The full name is not public by default.
  - **Just-in-time prompts** when a doctor-verified critical item arrives, plus a yearly review.
- **Options.** Opt-out (on by default): rejected (legal and ethical). Pure opt-in with no prompts: rejected (Tier 0 would mostly stay empty).
- **Consequences.** + Informed, lawful and useful. − Onboarding takes about a minute longer.
- **Confirmation.** UI test: no radio button is pre-selected, and the stranger preview matches the real scan output exactly.

<a id="adr-027"></a>
### ADR-027 — Offline Tier 0: small signed payload + printed lines

✅ Accepted · Emergency · P21 · F-09

- **Context.** Accidents happen where networks fail, and a QR that holds only a token is useless offline. Offline "doctor-only" encryption is not practical at national scale: one key shared across lakhs of devices will leak.
- **Decision.**
  - The QR carries an Ed25519-signed minimal Tier-0 payload, a version, an expiry and the credential token. The card carries printed lines the patient has chosen.
  - **Format:** an uppercase URL with a base32 payload in the fragment. Browsers never send the fragment to servers, and the page clears it using `history.replaceState`.
  - **Measured in sandbox:** a ~140-byte payload fits QR version 9 at error-correction M (53×53 modules, ~0.47 mm per module at 2.5 cm), or version 11 at Q.
  - Precedent: the EU Digital COVID Certificate also used an offline-verifiable signed QR.
- **Options.** Token-only QR: ⛔ superseded (original design §9.2). Encrypted offline Tier 1: rejected (key distribution).
- **Consequences.** + Works offline and shows tampering. − An offline payload cannot be revoked, so cards need an expiry (e.g. 2 years) and minimal content.
- **Confirmation.** The responder app verifies offline using cached issuer keys, and an edited payload fails verification.

<a id="adr-028"></a>
### ADR-028 — Family alert: honest wording, money-free channel

✅ Accepted (SMS fallback 🟡 proposed) · Emergency · P22, P23 · F-08, F-09

- **Context.** Fake "your son had an accident, send money now" calls are common. An alert system must not become a scam script.
- **Decision.**
  - Alerts state facts only, e.g. "Emergency credential linked to Rahul scanned at 14:32; approximate location …".
  - Official alerts never ask for money, OTP, PIN, passwords or card details.
  - The same event appears inside the app.
  - The scanner never sees family numbers; calls go through a masked relay.
  - Repeated scans are rate-limited and risk-scored.
  - **Proposed:** an SMS fallback from a DLT-registered sender with **no links** ("Open the JeevanRekha app"). For road accidents, the template may mention the government cashless-treatment scheme: up to ₹1.5 lakh for 7 days at designated hospitals, in force since 5 May 2025 ([Hindustan Times](https://www.hindustantimes.com/india-news/govt-launches-cashless-scheme-for-road-crash-victims-101746528614761.html)).
- **Options.** Free-text messages from the scanner: rejected (a scam vector).
- **Consequences.** + Alerts people can trust. − Templates need translating into local languages.
- **Confirmation.** A content lint checks that templates contain no URLs or payment words, followed by a red-team review.

<a id="adr-029"></a>
### ADR-029 — Tier 1: centrally available, not centrally readable

✅ Accepted · 🧪 Specialist crypto review required · Emergency · P24–P27 · F-10, F-13

- **Context.** Tier 1 must answer in seconds at 2 AM, and a live federated fetch cannot guarantee that. A pre-computed central store is a target, so it needs the "bank locker" design.
- **Decision.**
  - Each credential has a random 32-byte token **T**, printed in its QR.
  - From T, HKDF derives two values: the lookup ID **L**, which is sent to the server, and the QR share **K_q**, which never leaves the responder's device.
  - The server holds the encrypted summary **C** and the server share **K_s**, wrapped by the HSM.
  - The key is **K = HKDF(K_q ‖ K_s)**. The summary is encrypted with AES-256-GCM, with associated data `L ‖ version`.
  - The summary is built on the patient's own device.
  - A release requires an authenticated responder, a valid credential status, a plausible context and a logged event.
  - K_s is returned wrapped to the responder device's key (HPKE). The summary is decrypted in memory only and wiped automatically (e.g. after 4 h).
- **Options.** A store the server can decrypt by itself: rejected (insider/breach risk). Summary only on the card or phone: rejected (availability; NFC readers needed).
- **Consequences.**
  - \+ A database or HSM breach alone reveals nothing.
  - \+ A QR photo alone gives Tier 0 only.
  - \+ Insiders can neither read nor forge summaries.
  - − Tier 1 needs network.
  - − No QR means no Tier 1 (fall back to Tier 2).
  - − Card-only users update their summary at facilities.
  - − A rogue responder holding a QR photo can misuse it on a small scale; this is detected, not prevented.
- **Confirmation.** A sandbox sketch was verified: the responder decrypts; K_s without T fails; a tampered ciphertext or wrong version is rejected (`InvalidTag`). The production protocol must be reviewed by cryptographers.

<a id="adr-030"></a>
### ADR-030 — Tier 2 break-glass: scoped, expiring, reviewed

✅ Accepted (legal mapping 🟡 proposed) · Emergency · P28 · F-12

- **Context.** Unconscious patients cannot consent. DPDP s.7(f) treats responding to a medical emergency as a legitimate use that does not need consent ([CADP](https://cadp.in/resources/articles/dpdp-act-key-provisions-explained/)), and ABDM's purpose codes include `BTG` ([ABDM docs mirror](https://docs.coronasafe.network/abdm-documentation/overview-of-fhr-framework/apis-and-standards)).
- **Decision.**
  - Only an authorised clinician (HPR) at an authorised facility can invoke it, with a declared reason.
  - Both the requested and the actually accessed categories are recorded.
  - Access expires automatically (e.g. 4 h) and gets elevated review (e.g. within 72 h).
  - The patient or nominee is notified when appropriate.
  - Maps to ABDM purpose `BTG`. Sealed data follows [ADR-019](#adr-019).
- **Options.** No break-glass: rejected (harm). Unlimited emergency access: rejected (abuse).
- **Consequences.** + A lawful emergency path. − Review workload, and anomaly rules are needed ([ADR-033](#adr-033)).
- **Confirmation.** The demo shows the break-glass log entry, the expiry and a review-queue item.

<a id="adr-031"></a>
### ADR-031 — Unconscious identity: layered confidence, caution-only

✅ Accepted · Emergency · P10 · F-11

- **Context.** A phone or card near a victim may belong to someone else. Faces swell after injury. Multi-victim scenes mix up devices.
- **Decision.**
  - The responder records **ON PERSON / FOUND NEARBY**; "nearby" means low confidence.
  - Signals: photo plus optional identifying marks (Tier 1); a 1:1 match on the card's chip where supported (proves ownership only, never consent, always logged); family confirmation through a masked call.
  - Until confidence is high, the data may **increase caution** (avoid listed allergens, check glucose, take implant precautions) but must not drive high-risk or irreversible actions.
  - **Hard rules:** never unlock a personal phone with an unconscious person's finger or face; no credential means no national biometric search.
- **Options.** Photo only: rejected (fails with injuries). Hide Tier 1 when identity is unverified: rejected (loses safe warnings).
- **Consequences.** + Safety without surveillance. − Some patients stay unidentified until the hospital's normal processes run.
- **Confirmation.** The UI shows an identity-confidence banner, and high-risk action prompts require high confidence.

<a id="adr-032"></a>
### ADR-032 — Emergency data freshness and blood-group safety

✅ Accepted · Emergency · P30, P31 · F-13

- **Decision.**
  - Every emergency item shows its provenance and a "last clinically updated" date.
  - Stale items are flagged.
  - A verified change triggers a prompt to update.
  - A stored blood group is prior information only. It never replaces grouping and crossmatch.
- **Consequences.** + Prevents false confidence. − Too many prompts cause fatigue, so prompts are batched.
- **Confirmation.** The responder UI shows a warning on any summary older than the threshold.

---

## F. Audit, transparency & credentials

<a id="adr-033"></a>
### ADR-033 — Audit logs are sensitive; alerts lead to investigation

✅ Accepted · Audit · P33, P36, P37 · F-16, F-17

- **Context.** A log line like "Rahul → psychiatry hospital" is itself health data.
- **Decision.**
  - Audit records are encrypted, access-controlled, purpose-limited, retention-bound and tamper-evident.
  - Patients see a human-readable access history.
  - Detection rules raise alerts for human review: unusual volume, repeated break-glass, impossible travel, mass download, repeated failures, suspicious family requests.
  - Alerts never punish anyone automatically.
- **Consequences.** + Accountability without creating new leaks. − Workload for the security team.
- **Confirmation.** Patient history shows every JR-mediated access, and anomalies seeded in the demo trigger alerts.

<a id="adr-034"></a>
### ADR-034 — Transparency log for high-risk events

✅ Accepted (design 🟡 proposed) · Audit · P34, P35, P50 · F-16, F-20

- **Context.** An ordinary log only says "the database says so", and an insider can edit it. The "No invisible master key" principle needs evidence that holds up.
- **Decision.**
  - Use an append-only Merkle-tree log, in the style of Certificate Transparency.
  - Entries are **salted commitments**, not readable data. They cover: consent issued/revoked, Tier-1 key release, break-glass, credential revoked/issued, emergency-summary version change, recovery, and published aggregates.
  - Patients verify that their own events are included. Independent auditors verify consistency, i.e. that nothing was removed or rewritten.
  - Nothing like "Rahul → HIV clinic" is ever public.
- **Options.** Plain database logs: rejected. Public blockchain: rejected (metadata becomes permanent, cost, no benefit over CT-style logs).
- **Consequences.** + Silent rewriting becomes detectable. − The log-signing key needs management, and the auditor role must be institutional.
- **Confirmation.** In the prototype the patient app shows a "verified" badge after checking an inclusion proof, and a tampering test breaks the proof.

<a id="adr-035"></a>
### ADR-035 — Every credential is independent and revocable

✅ Accepted · Credentials · P2, P38 · F-14

- **Decision.**
  - Phone, card, wearable and sticker each have their own random ID and token.
  - Each can be revoked on its own and reissued with fresh secrets.
  - A lost card's offline Tier 0 stays verifiable until it expires (documented limitation).
- **Consequences.** + Losing one item doesn't reset a whole identity. − More credential states to manage.
- **Confirmation.** Revoking the card leaves phone access working, and a Tier-1 request using the revoked card is denied.

<a id="adr-036"></a>
### ADR-036 — Account recovery: delayed, loud, no single patient key

🟡 Proposed · Credentials · restores v2 §22 · F-15

- **Context.** A key held only by the patient fails when the phone breaks, the card is lost or the patient is unconscious. But an easy recovery path is also an easy takeover path.
- **Decision.**
  - Normal access stays under the patient's authorisation.
  - Recovery requires re-verification (ABHA + legally permitted e-KYC, or in-person documents) **plus a waiting period** (e.g. 72 h).
  - During the wait, alerts go to every registered channel and to the nominee, and anyone of them can cancel.
  - Every recovery is written to the transparency log.
  - Emergency access is unaffected while recovery is pending.
- **Options.** Patient-only key with Shamir 2-of-3 recovery as the main mechanism (original design): ⛔ superseded. Instant helpdesk reset: rejected (social engineering).
- **Consequences.** + Availability with resistance to takeover. − A genuine user waits up to 72 h for full control.
- **Confirmation.** Demo: a recovery request triggers alerts, and cancelling from the old device stops it.

---

## G. Public health

<a id="adr-037"></a>
### ADR-037 — Secure aggregation with two independent aggregators

✅ Accepted · 🧪 Specialist review required · Public health · P39–P42 · F-18

- **Context.**
  - Suppressing small counts at each hospital hides clusters: 10 hospitals with 2 cases each would report 0.
  - Adding noise at each hospital grows with the number of facilities. At ε = 1: ±4.4 at 10 facilities, ±14.4 at 100 and ±31.9 at 500, against ±1.4 if noise is added once centrally (sandbox simulation).
  - Sending exact facility counts to one server leaks them.
- **Decision.**
  - Each facility splits every count into **two additive shares plus a validity proof**.
  - **Aggregator A** (public-health infrastructure, e.g. NCDC/IHIP) and **Aggregator B** (an independent institution) have separate administration, credentials, cloud and audit.
  - Each aggregator sums its own shares and adds half of the calibrated noise. Only the combined, noised district total is revealed.
  - Inputs are authenticated, replay-protected and bounded, with one report per window.
  - Direction: Prio / VDAF (Prio3).
- **Options.**
  - Direct counts: rejected (no privacy for facilities).
  - Local suppression or noise: rejected (signal loss).
  - Pairwise masking (the federated-learning style): rejected for now, because the extra recovery rounds when facilities drop out are fragile on Indian connectivity.
- **Consequences.** + Rare signals survive and individual facilities stay invisible. − If both aggregators collude, per-facility counts leak (patient records still do not). Proof systems add complexity, and vendors need SDKs.
- **Confirmation.**
  - Sandbox: the shares summed to the true total (20). A malicious "−15" input silently changed the total to 5, so validity proofs are mandatory.
  - Precedent: Apple/Google's ENPA ran two-server Prio with ISRG and NIH's NCI on separate clouds ([Divvi Up](https://divviup.org/blog/lessons-from-running-mpc-at-scale/)).
  - Prio3 is specified in the IRTF VDAF draft, which is not yet a final standard ([draft-18](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-vdaf-18)).

<a id="adr-038"></a>
### ADR-038 — Reporting unit, cadence and privacy parameters

✅ Accepted (cadence 🟡 proposed) · Public health · P40, P43, P44 · F-18, F-20

- **Decision.**
  - Count **unique patients** per syndrome per period, not visits.
  - Release on a **fixed weekly** schedule, with no ad-hoc queries, to limit cumulative privacy loss.
  - Calibrate noise at release, and document the privacy parameters for every release under a configuration ID.
  - Apply small-cell suppression, geographic/temporal aggregation and output review to released statistics only.
- **Consequences.** + Results are easy to interpret and privacy loss stays bounded. − Analysts lose flexibility; deeper work goes into a controlled research environment where code comes to the data.
- **Confirmation.** Every published statistic carries its privacy-config ID in the transparency log.

<a id="adr-039"></a>
### ADR-039 — Always show coverage and confidence; missing ≠ zero

✅ Accepted · Public health · P45, P46 · F-19

- **Context.** IDSP itself publishes reporting completeness. For Jan–Aug 2026, 81% of S-form, 76% of P-form and 77% of L-form reporting units reported ([NCDC](https://ncdc.mohfw.gov.in/includes/About/CentresAndDivision/IDSP.php)).
- **Decision.**
  - Every signal shows **coverage** (reporting units that reported ÷ expected, from registry lists) and a **confidence** level.
  - A facility that doesn't report is *missing*, never *zero*.
  - Caveat: registries leave out informal practitioners, so true coverage can be lower than shown.
- **Consequences.** + A poorly digitised district never looks healthy just because data is absent. − The coverage denominators need maintenance.
- **Confirmation.** Dashboard test: removing a facility's report lowers coverage, not the case count.

<a id="adr-040"></a>
### ADR-040 — Strengthen IDSP/IHIP; alerts recommend investigation

✅ Accepted · Public health · P47, P48 · F-18

- **Decision.**
  - Privacy-protected signals feed existing IDSP/IHIP workflows. No parallel surveillance silo.
  - Detection starts with transparent statistics (e.g. CUSUM or EARS baselines).
  - The output is "Unusual increase — investigation recommended", reviewed by epidemiologists and Rapid Response Teams. It is never an automatic outbreak declaration.
- **Consequences.** + Fits existing public-health practice. − Depends on IHIP integration agreements.
- **Confirmation.** Every alert carries its magnitude, baseline, coverage, confidence, source count, data freshness and known limitations.

<a id="adr-041"></a>
### ADR-041 — Single notifiable cases stay in legal channels

✅ Accepted · Public health · P49

- **Context.** Some diseases must be notified individually by law. For example, TB has been notifiable since May 2012, with patient identification reported to Nikshay ([NTEP](https://ntep.in/node/361/CP-mandatory-notification-tb-diagnosis)).
- **Decision.** Secure aggregation is for **trends**. Legal case notification continues through the existing systems, and JR adds **no new individual-level feed** to government.
- **Consequences.** + The "no surveillance" promise has an honest boundary. − JR cannot claim that the government never gets individual data, since existing law already requires some.

<a id="adr-042"></a>
### ADR-042 — Government boundary: no "search citizen"

✅ Accepted · Governance · P51

- **Decision.**
  - Analytics has no individual lookup.
  - Individual disclosure outside care happens only through the applicable lawful process, and is separately logged and reviewed.
  - Notification or non-notification of the person follows the law.
  - Aggregate transparency statistics are published where legally permitted.
- **Consequences.** + Keeps population intelligence and individual access in separate security domains. − Lawful-process handling needs legal operations capacity.

<a id="adr-043"></a>
### ADR-043 — Epidemic mode is bounded in advance

🟡 Proposed · Public health / Legal · restores v2 §43

- **Context.** DPDP s.7(g) allows processing to provide treatment or health services during an epidemic ([TaxGuru](https://taxguru.in/corporate-law/digital-personal-data-protection-act-2023-comprehensive-summary.html)). Measures improvised during a crisis tend to become permanent.
- **Decision.** Any extraordinary mode defines in advance: legal authority, purpose, data categories, recipients, geography, start, review cadence, **sunset/expiry** and audit. It expires automatically.
- **Consequences.** + Emergencies don't quietly become permanent surveillance. − Requires governance agreement *before* any crisis.
- **Confirmation.** The mode cannot be enabled unless every field is filled, and the system enforces the expiry.

---

## H. Security, AI, governance & operations

<a id="adr-044"></a>
### ADR-044 — Availability is part of security

✅ Accepted · Security · P55–P57 · F-23

- **Decision.**
  - Protect confidentiality, integrity **and** availability.
  - Every critical workflow has a degraded mode.
  - Assume hospitals can be compromised: segmentation, protected and tested backups, least privilege, endpoint monitoring, separate keys and downtime procedures.
  - Queue and sync when systems recover.
- **Consequences.** + A secure system that still lets doctors treat. − More engineering for offline and queued paths.
- **Confirmation.** The failure-mode matrix ([F-23](FLOWS.md#f-23)) is exercised in the demo.

<a id="adr-045"></a>
### ADR-045 — AI usage policy

✅ Accepted (emergency rule 🟡 proposed) · AI · P48, P67

- **Decision.**
  - AI may organise and deduplicate records, highlight trends, detect anomalies and summarise for clinicians (labelled and linked to sources).
  - AI never silently alters records and never declares outbreaks.
  - **Proposed:** no generative AI text in Tier 0 or Tier 1 emergency views, only structured fields. A hallucinated allergy can kill.
- **Consequences.** + Useful help without false authority. − Some convenience is given up in emergency views.
- **Confirmation.** Every generated summary carries an "AI-generated" label and source links. Emergency views render only structured fields.

<a id="adr-046"></a>
### ADR-046 — Institutional separation of duties

✅ Accepted · Governance · P60

- **Decision.** No single team controls identity, records, emergency keys, analytics and audit together. Policy authority, technical operator, security oversight, emergency and public-health authorities, grievance and independent audit are separate.
- **Consequences.** + No single insider or team can quietly bypass the system. − Coordination overhead.
- **Confirmation.** Access-control matrix: no role holds two of {HSM admin, transparency-log signer, Aggregator A admin, Aggregator B admin}.

<a id="adr-047"></a>
### ADR-047 — Grievance and breach response are first-class flows

✅ Accepted · Operations · P61, P62 · F-21, F-22

- **Context.** DPDP requires breach intimation to the Data Protection Board within 72 hours, from 13 May 2027 ([VertiComply](https://verticomply.com/blog/dpdp-rules-2025-health-apps-india)).
- **Decision.**
  - Grievances are trackable: reference number, status, investigation, resolution or escalation.
  - The breach playbook runs: detect → contain → revoke → rotate → investigate → restore → notify → audit → improve.
- **Consequences.** + Ready for compliance and trusted by citizens. − Needs staff and drills.
- **Confirmation.** A tabletop exercise before any pilot.

---

<a id="superseded"></a>
## 3. Superseded ideas (how the design evolved)

| Earlier idea | Where it came from | Replaced by | Why |
|---|---|---|---|
| **Two-Finger Lock**: any 2 of 10 fingers; finger A shows identity, finger B gives consent | Original design | [ADR-012](#adr-012) | Both fingers are the same factor; ~6.5 bits; consent must be informed, not a reflex |
| Per-visit UIDAI biometric matching ("mode C") | Original design | [ADR-003](#adr-003) | Gives the identity provider a trail of hospital visits |
| Duress finger | Original design | [ADR-021](#adr-021) | A hidden mechanism can endanger the patient if discovered |
| Emergency QR holds only a token | Original design §9.2 | [ADR-027](#adr-027) | Useless with no network |
| Living will in the Tier-1 summary | Original design §9.4 | [ADR-026](#adr-026) (never Tier 0/1) | Not actionable in the golden hour; risks care being withheld wrongly |
| Patient-held locker key + Shamir 2-of-3 as the primary model | Original design | [ADR-036](#adr-036), [ADR-029](#adr-029) | Fails for unconscious patients and lost devices; recovery can become takeover |
| Suppression (k ≥ 10) or noise at each source | Original design, v2 §40 | [ADR-037](#adr-037), [ADR-038](#adr-038) | Suppressing before summing hides rare clusters; local noise grows with facility count |
| Numeric data classes 0–6 | v2 §75 | [ADR-009](#adr-009) | The numbers implied a sensitivity order that didn't exist |
| Tagline "Do ungliyan. Poori history. Sirf aapki marzi se." | Original design | Motto "Right Person. Right Data. Right Reason. Right Time." | Two fingers are no longer the mechanism |

---

<a id="open"></a>
## 4. Open questions & specialist reviews

| # | Question | ADR | Who must review |
|---|---|---|---|
| 1 | Is any JR component a DPDP Consent Manager? How are the entities split? | [016](#adr-016) | Privacy / health lawyer |
| 2 | Does break-glass open sealed compartments, and how much? | [019](#adr-019) | Clinicians + lawyer |
| 3 | Do guardians see a 16–17-year-old's mental-health or reproductive visits? | [022](#adr-022) | Clinicians + lawyer |
| 4 | Exact emergency key-split protocol (HKDF labels, HPKE, rotation, rollback) | [029](#adr-029) | Cryptographer |
| 5 | Prio3 / VDAF implementation, proof sizes, DP parameters and privacy budget | [037](#adr-037), [038](#adr-038) | Cryptographer + statistician |
| 6 | Retention period for each data class | [010](#adr-010) | Lawyer |
| 7 | Proof of incapacity or death for nominee activation | [023](#adr-023) | Lawyer |
| 8 | ABDM extensions: label-aware filtering; operational BTG flow | [018](#adr-018), [030](#adr-030) | NHA / ABDM engagement |

---

<a id="tally"></a>
## 5. Tally: end-to-end spec ↔ decisions ↔ flows

**Result:** every part of [SYSTEM_E2E.md](SYSTEM_E2E.md) maps to at least one ADR, and no part contradicts a locked decision.

The spec dropped a few items from earlier rounds. They are **restored here as 🟡 Proposed**: [005](#adr-005), [009](#adr-009), [010](#adr-010), [023](#adr-023), [024](#adr-024), [036](#adr-036), [043](#adr-043). Review suggestions not yet reflected in the spec are recorded as amendments or open items: [013](#adr-013), [015](#adr-015), [016](#adr-016), [017](#adr-017), [019](#adr-019), [028](#adr-028), [030](#adr-030), [045](#adr-045).

| Spec part(s) | Topic | ADR(s) | Flow(s) |
|---|---|---|---|
| P1 | Citizen enters; ABHA; no PAN; Aadhaar limited | 001, 002, 003 | F-01 |
| P2 | Multiple independent credentials | 035 | F-01, F-14 |
| P3 | Federated records; what JR stores | 006, 005 | F-02 |
| P4 | Timeline + provenance | 007 | F-02 |
| P5–P6 | Visit pipeline; Stage 1 identity | 012 | F-02 |
| P7 | Wrong-patient check | 013 | F-02 |
| P8–P9 | Scoped consent; expiry | 014, 015 | F-02, F-04 |
| P10 | Unconscious identity | 031 | F-11 |
| P11–P12 | Sealed compartments; sealed-medicine loop | 018, 019 | F-05 |
| P13–P15 | Family capabilities; private-from-family; notifications | 020 | F-06, F-07 |
| P16 | Three emergency tiers | 025 | F-08 – F-12 |
| P17–P20 | Tier 0; active choice; stranger preview; never-Tier-0 | 026 | F-01, F-08 |
| P21 | Offline Tier 0 | 027 | F-09 |
| P22–P23 | Family alert; scam protection | 028 | F-08, F-09 |
| P24–P27 | Tier 1; central store; key-split; limits | 029 | F-10, F-13 |
| P28 | Tier 2 break-glass | 030, 019 | F-12 |
| P29 | Care without digital access | 004 | F-23 |
| P30–P31 | Blood group; stale information | 032 | F-13 |
| P32 | Record correction | 007 | F-02 |
| P33, P36–P37 | Audit sensitivity; access history; anomaly detection | 033 | F-16, F-17 |
| P34–P35 | Transparency layer | 034 | F-16 |
| P38 | Lost card/phone | 035 | F-14 |
| P39–P42 | Secure aggregation; two aggregators; malicious hospital | 037 | F-18 |
| P43–P44 | Privacy noise; small counts | 038 | F-18 |
| P45–P46 | Coverage; offline hospital | 039 | F-19 |
| P47–P48 | IDSP/IHIP first; AI doesn't declare outbreaks | 040, 045 | F-18 |
| P49 | Single notifiable cases | 041 | — |
| P50 | Public-health transparency | 034, 038 | F-20 |
| P51 | Government boundary | 042 | — |
| P52 | Children | 022 | F-24 |
| P53 | Coercion | 021 | — |
| P54 | No smartphone | 017, 024 | F-03 |
| P55–P57 | No internet; ransomware; CIA security model | 004, 044 | F-22, F-23 |
| P58 | Ingestion | 008 | F-02 |
| P59 | Interoperability | 011, 015 | F-02 |
| P60 | Governance | 046, 016 | — |
| P61–P62 | Grievance; breach response | 047, 010 | F-21, F-22 |
| P63–P66 | Citizen / doctor / responder / public-health experience | — | F-02, F-08, F-10, F-18 |
| P67 | "Never does" list | see below | — |
| P68 | Final architecture | — | FLOWS § System context |
| P69 | Final locked decisions | this file | — |

**P67 "never does" ↔ ADR:** replace ABHA → 001 · PAN → 002 · Aadhaar biometrics → 003 · two fingers as two factors → 012 · automatic family access → 020 · unlock unconscious patient's phone → 031 · national biometric search → 031 · pre-ticked disclosures → 026 · full history in QR → 025, 027 · QR photo as authorisation → 025, 029 · universal browsing key → 029, 034, 046 · identity as consent → 012, 031 · permanent consent → 014 · sealed leaks via medicines → 018 · missing = zero → 039 · tiny identifying counts → 038 · AI alters records → 045 · AI declares outbreaks → 040, 045 · care denied on failure → 004.

---

<a id="factcheck"></a>
## 6. Fact-check of the owner's "architecture position" note (2026-10-16)

| Claim in the note | Verdict | Source |
|---|---|---|
| ABDM is built around federated, consent-based health-data exchange | ✅ Correct | [eHealth](https://ehealth.eletsonline.com/2026/06/india-surpasses-100-crore-health-records-linked-to-abha-strengthening-the-worlds-largest-digital-health-ecosystem/) (federated architecture); [PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2281466&reg=3&lang=1) (revocable, time-bound consent) |
| Aadhaar-authentication biometrics/OTP must not be stored permanently | ✅ Correct. Strictly this is a **UIDAI requesting-entity obligation**, not an ABDM rule | [S.S. Rana](https://ssrana.in/articles/aadhaar-authentication-by-private-entities-from-data-privacy-perspective/) |
| The Aadhaar number must not be used as a domain-specific identifier | ✅ Correct (UIDAI obligation) | [S.S. Rana](https://ssrana.in/articles/aadhaar-authentication-by-private-entities-from-data-privacy-perspective/) |
| Aadhaar law requires alternate, viable identification | ✅ Correct: s.8(2)(b) proviso (authentication fails due to illness, injury, old age or technical reasons) and s.4(6) (no denial for refusing or being unable to authenticate) | [Aadhaar Act as amended](https://uidai.gov.in/images/Aadhaar_Act_2016_as_amended.pdf) |
| IDSP/IHIP runs real-time surveillance and investigates unusual trends | ✅ Correct | [NCDC IDSP](https://ncdc.mohfw.gov.in/includes/About/CentresAndDivision/IDSP.php) |
| Jan–Aug 2026 reporting ≈ 81% S, 76% P, 77% L | ✅ Matches NCDC's dated table (185,031 / 56,027 / 48,200 reporting units). Note: the same page also has an older paragraph with different figures, so cite the **dated** table | [NCDC IDSP](https://ncdc.mohfw.gov.in/includes/About/CentresAndDivision/IDSP.php) |
| Not "100% production-ready": crypto protocol, Prio/VDAF and the legal matrix need specialists | ✅ Agreed. Captured as 🧪 in [029](#adr-029) and [037](#adr-037), and 🔵 in [016](#adr-016) | — |

---

<a id="sources"></a>
## 7. Sources

- **ADR practice:** [Nygard format summary](https://www.raphaelbauer.com/posts/architecture-decision-records/) · [Nygard template](https://deepwiki.com/architecture-decision-record/architecture-decision-record/3.1-michael-nygard-template) · [MADR template](https://devjourney.me/blog/madr-concept/) · [ADR guide & common mistakes](https://techdebt.fail/architectural-decisions/) · [ADRs as a log of "why"](https://codeopinion.com/architecture-decision-records-adr-as-a-log-that-answers-why/) · [Writing an ADR](https://paths.grasp.study/modules/f53f191f-0669-49f1-913d-a7721859304a/lessons/235605cc-173c-4c47-a4b4-a6e5c713bb9c)
- **ABDM:** [NIE, Sep 2026 (scale)](https://www.newindianexpress.com/india/2026/Sep/25/before-pm-jay-families-had-to-sell-land-to-get-treatment-minister-j-p-nadda) · [eHealth (federated)](https://ehealth.eletsonline.com/2026/06/india-surpasses-100-crore-health-records-linked-to-abha-strengthening-the-worlds-largest-digital-health-ecosystem/) · [PIB (consent, DHIS)](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2281466&reg=3&lang=1) · [Consent artefact (HIU guide)](https://nirmitee.io/blog/building-abdm-hiu-from-scratch-m3-flow-reference-architecture/) · [Purpose codes](https://docs.coronasafe.network/abdm-documentation/overview-of-fhr-framework/apis-and-standards)
- **HL7:** [ActConsentDirective (BTG may override directive)](https://terminology.hl7.org/6.3.0/ValueSet-v3-ActConsentDirective.html) · [BTG vs ERTREAT](https://terminology.hl7.org/4.0.0/ValueSet-v3-ActHealthInformationManagementReason.html)
- **Aadhaar:** [UIDAI requesting-entity obligations](https://ssrana.in/articles/aadhaar-authentication-by-private-entities-from-data-privacy-perspective/) · [Aadhaar Act as amended](https://uidai.gov.in/images/Aadhaar_Act_2016_as_amended.pdf)
- **DPDP:** [s.7(f), s.14 explained](https://cadp.in/resources/articles/dpdp-act-key-provisions-explained/) · [s.14 text](https://www.dpdpa.com/dpdpa2023/chapter-3/section14.html) · [s.7(g)](https://taxguru.in/corporate-law/digital-personal-data-protection-act-2023-comprehensive-summary.html) · [Clear affirmative action](https://www.privybyidfy.com/blog/dpdp-compliance-guide-2026-what-indian-enterprises-must-do-before-may-2027) · [Consent Managers](https://lawsikho.com/blog/consent-manager-framework-and-obligations-under-the-dpdp-rules-2025/) · [Timelines, 72-hour breach](https://verticomply.com/blog/dpdp-rules-2025-health-apps-india)
- **Security & public health:** [AIIMS 2022 timeline](https://www.cm-alliance.com/aiims-attack-timeline-download) · [Cashless treatment scheme](https://www.hindustantimes.com/india-news/govt-launches-cashless-scheme-for-road-crash-victims-101746528614761.html) · [TB notification](https://ntep.in/node/361/CP-mandatory-notification-tb-diagnosis) · [NCDC IDSP](https://ncdc.mohfw.gov.in/includes/About/CentresAndDivision/IDSP.php) · [ENPA / Prio at scale](https://divviup.org/blog/lessons-from-running-mpc-at-scale/) · [VDAF draft-18](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-vdaf-18)
- **Other:** Johnson & Goldstein, "Do Defaults Save Lives?", *Science* 302 (2003) · NIST SP 800-63B (biometrics with a physical authenticator) · EU Digital COVID Certificate (offline signed QR precedent)

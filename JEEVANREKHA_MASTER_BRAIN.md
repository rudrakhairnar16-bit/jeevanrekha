<!--
  Canonical end-to-end specification, provided by the owner on 2026-10-16.
  Reproduced verbatim (only HTML entities such as &gt; were converted and blank lines normalised).
  WHY each decision exists → DECISIONS.md · HOW each flow runs → FLOWS.md
-->

# JEEVANREKHA

## Complete End-to-End System

### Core Idea

JeevanRekha is not another ABHA.

It is a **Trust + Consent + Emergency + Family Safety + Public Health Intelligence layer** built around India's existing digital-health ecosystem.

Its simplest rule is:

> **Right person. Right data. Right reason. Right time.**

And its most important safety rule is:

> **CARE IS NEVER DENIED BECAUSE JEEVANREKHA FAILED.**

---

# PART 1 — CITIZEN ENTERS THE SYSTEM

A citizen enrols in JeevanRekha.

Where available and appropriate, existing health identity infrastructure such as ABHA is used.

JeevanRekha does not create another unnecessary national Health ID.

PAN is not part of the core system.

Aadhaar may be used through a legally permitted identity-verification mechanism where appropriate, but Aadhaar is not made the everyday key to medical records.

JeevanRekha never stores Aadhaar authentication fingerprints or iris data.

After enrolment, routine access primarily uses JeevanRekha/approved health credentials rather than repeatedly asking UIDAI to authenticate every hospital visit.

### Decision

**ABHA/existing health identity identifies the citizen; JeevanRekha controls trust and access around healthcare workflows.**

---

# PART 2 — CITIZEN CREDENTIALS

A participating citizen can have one or more credentials:

- mobile application
- physical health/emergency card
- approved secure device credential
- emergency QR
- optional wearable/emergency credential

Each physical credential receives its own random identifier.

Therefore:

Card lost → revoke card.

Phone lost → revoke phone.

Wristband lost → revoke wristband.

The patient's entire identity does not need to be replaced.

---

# PART 3 — WHERE MEDICAL RECORDS LIVE

JeevanRekha does NOT create one giant database containing India's complete medical history.

Records continue to reside with appropriate healthcare systems.

Example:

Hospital A → Hospital A records

Lab B → Lab B results

Hospital C → Hospital C records

These can participate in authorized exchange using India's digital-health infrastructure.

JeevanRekha mainly manages:

- authentication
- consent
- permissions
- emergency configuration
- security events
- access grants
- credential status
- protected audit evidence

### Decision

**Clinical records remain federated.**

---

# PART 4 — WHAT ENTERS THE MEDICAL TIMELINE

The patient's longitudinal history can reference:

- hospital visits
- doctor consultations
- reason for visit
- diagnoses
- prescriptions
- laboratory reports
- imaging
- discharge summaries
- procedures
- vaccinations
- allergies
- relevant current medications
- clinically relevant chronic conditions
- follow-ups

But every item carries provenance.

Example:

**Verified — Hospital**

**Verified — Laboratory**

**Patient Uploaded**

**Patient Reported**

These categories are never silently treated as equally reliable.

---

# PART 5 — NORMAL DOCTOR VISIT

Suppose Rahul previously visited Hospital A.

Six months later he visits Hospital B.

He does NOT need to carry ten paper files.

The process begins:

**Doctor authentication**

↓

**Facility authentication**

↓

**Patient identification**

↓

**Patient matching**

↓

**Doctor requests specific information**

↓

**Patient reviews request**

↓

**Patient approves**

↓

**Short-lived authorization**

↓

**Relevant records retrieved**

↓

**Access logged**

↓

**Authorization expires**

---

# PART 6 — STAGE 1: IDENTITY

Stage 1 answers:

> **"Is the person standing here the correct patient?"**

Possible approved mechanisms can include:

- registered phone
- secure card
- device-bound credential
- PIN
- OTP
- local biometric activation
- other permitted fallback

Stage 1 does NOT mean:

> "Open complete medical history."

It establishes identity.

---

# PART 7 — WRONG-PATIENT CHECK

Before clinical access, the doctor receives enough information to prevent common patient mix-ups.

For example:

Name

Photo where appropriate

Age/DOB information as appropriate

Health identity reference

The professional confirms that the patient in front of them matches the intended record.

### Decision

**Identification happens before authorization.**

---

# PART 8 — STAGE 2: CONSENT

Now the doctor asks for information.

The patient's screen might show:

### Dr. Sharma

XYZ Hospital

**Wants**

✓ Laboratory reports

✓ Previous prescriptions

✗ Other records

**Reason**

Current treatment

**Access duration**

2 hours

### ALLOW

### DENY

The important thing is not a second fingerprint.

The important thing is that the citizen understands:

**WHO**

wants

**WHAT**

for

**WHY**

and

**HOW LONG**.

---

# PART 9 — ACCESS EXPIRES

If Rahul approves two hours:

Doctor gets two hours.

Not two years.

The authorization does not silently become permanent.

If additional information is legitimately needed, a new request can be made.

---

# PART 10 — UNCONSCIOUS PATIENT IDENTIFICATION

Emergency identification is fundamentally different.

A phone/card found near an injured person might belong to somebody else.

Therefore:

> **Unverified identity → emergency information may increase caution, but must not become unquestioned identity proof.**

A responder records whether a credential was:

**ON PERSON**

or

**FOUND NEARBY**

"Nearby" automatically lowers identity confidence.

Available identification signals can include:

- photo
- limited identifying characteristics where appropriate
- secure card ownership verification where supported
- family confirmation through protected communication

If a card supports privacy-preserving local 1:1 biometric verification, that confirms ownership of that credential only.

It does NOT create consent.

### HARD RULE

An unconscious person's finger/face is never used simply to unlock their personal phone.

### HARD RULE

No credential + no legitimate identity path means JeevanRekha does not perform a national biometric search to identify the person.

### Decision

**Identity confidence and clinical authorization are separate concepts.**

---

# PART 11 — SENSITIVE RECORDS

Not every medical record should behave identically.

JeevanRekha supports additional protection for specially sensitive categories where appropriate.

Examples may include legally or clinically sensitive:

- mental-health information
- HIV-related information
- reproductive healthcare
- genetic information
- other specially protected records

These can exist in sealed compartments governed by additional rules.

---

# PART 12 — SEALED-MEDICINE LOOP

Simply hiding a diagnosis is insufficient.

Imagine:

Diagnosis → hidden.

Medicine strongly associated with diagnosis → visible.

Privacy has still leaked.

Therefore protection can propagate across linked clinical information.

A sealed episode may protect associated:

- diagnosis
- prescription
- test
- note
- attachment
- revealing metadata

### Decision

**Protect relationships between records, not just individual fields.**

---

# PART 13 — FAMILY SYSTEM

Family does not automatically mean access.

Rahul can give his mother:

**Medicine reminder permission**

without giving:

**Complete medical-history permission.**

Possible capabilities include:

- reminders
- appointments
- emergency alerts
- selected caregiving tasks
- selected records
- legally appropriate guardian/caregiver access

Each is separate.

---

# PART 14 — PRIVATE FROM FAMILY

An adult patient can keep permitted information outside ordinary family/caregiver views.

For example, a family member helping with reminders does not automatically receive diagnoses or unrelated reports.

### Rule

> **Caregiving ≠ surveillance.**

---

# PART 15 — MEDICATION NOTIFICATIONS

The patient's locked screen should not unnecessarily reveal sensitive health information.

Instead of:

"Take [sensitive-condition medication]."

it can show:

> **Medication reminder available.**

Authentication reveals details.

A caregiver can similarly receive:

> **Medication reminder missed**

without necessarily seeing the medicine or diagnosis.

---

# PART 16 — EMERGENCY QR

The Emergency QR is NOT a medical-record QR.

It is an emergency credential.

Emergency access has three levels:

# TIER 0 — PUBLIC

# TIER 1 — VERIFIED RESPONDER

# TIER 2 — HOSPITAL BREAK-GLASS

---

# PART 17 — TIER 0

A passer-by may arrive before an ambulance.

Therefore Tier 0 is publicly usable.

Always-available non-clinical actions can include:

**Call emergency services**

**Trigger configured family emergency workflow**

**Good Samaritan information**

Clinical information is not automatically made public.

---

# PART 18 — TIER 0 ACTIVE CHOICE

During setup, nothing sensitive is pre-ticked for public disclosure.

The citizen chooses individually whether eligible emergency items are:

**Public**

**Responders only**

**Don't show**

Possible eligible categories may include:

- critical allergy warning
- diabetes/epilepsy emergency flag
- blood-thinner warning
- implant warning
- communication requirement
- verified blood-group information

A recommendation can be displayed.

The choice remains the citizen's where legally appropriate.

---

# PART 19 — STRANGER PREVIEW

Before enabling public information, the citizen sees:

> **"This is exactly what a stranger scanning your emergency QR can see."**

This makes the privacy consequence understandable.

---

# PART 20 — NEVER TIER 0

Tier 0 does not expose:

- complete medical history
- complete medication list
- sealed records
- home address
- unrestricted identity details
- highly consequential directives requiring stronger clinical/legal verification

Full name is not automatically public merely because the person has a QR.

---

# PART 21 — OFFLINE TIER 0

Network may fail.

Therefore Tier 0 can contain a small signed offline emergency payload.

It contains only information deliberately configured for that public/offline purpose.

The payload is digitally signed.

Tampering invalidates verification.

It includes freshness/version information.

The physical card can additionally contain minimal printed emergency information chosen for offline disclosure.

### Important

Offline Tier 0 is deliberately minimal because information printed or encoded for public offline access cannot be remotely made secret after someone has copied it.

---

# PART 22 — FAMILY EMERGENCY ALERT

A bystander can trigger an emergency alert without receiving the patient's medical history.

Family receives something like:

> **Emergency credential associated with Rahul was scanned at 14:32.**

If location permission/availability permits:

> **Approximate incident location available.**

It does NOT falsely claim:

> "Rahul definitely had an accident."

The system reports what it knows.

---

# PART 23 — SCAM PROTECTION

Official JeevanRekha emergency alerts never request:

- payment
- OTP
- PIN
- password
- banking credentials

The same emergency event appears inside the trusted app/system.

Repeated scans can be rate-limited and flagged.

### Decision

**Emergency notification and money are separate systems.**

---

# PART 24 — TIER 1

Verified emergency responders can request a larger emergency summary.

Potential information:

- critical allergies
- important current medications
- major emergency-relevant conditions
- implanted devices
- clinically verified emergency alerts
- relevant emergency contact information

Still:

**Tier 1 ≠ complete lifetime medical history.**

---

# PART 25 — THE CENTRAL-STORE PROBLEM

Tier 1 needs to work quickly.

Waiting for five hospitals to respond at 2 AM may be unacceptable.

Therefore JeevanRekha can maintain a small, pre-computed emergency summary as a deliberate exception to normal federation.

But this creates a dangerous target.

Solution:

# TWO-PART ACCESS SECRET

Think of a bank locker requiring two independent components.

---

# PART 26 — EMERGENCY CRYPTOGRAPHIC DESIGN

The emergency summary is encrypted.

One necessary secret/capability component is associated with the patient's emergency credential.

Another is protected by the emergency service infrastructure using hardened key-management/HSM controls.

A Tier-1 release requires:

1. Valid emergency credential/capability.
2. Authenticated responder.
3. Valid credential status.
4. Appropriate request context.
5. Server authorization.
6. Logged release event.
7. Short-lived responder-side access.

No ordinary database administrator should possess a simple button that decrypts every citizen's emergency summary.

### Important Design Requirement

Public Tier-0 information and any Tier-1 cryptographic capability must be cryptographically/domain separated.

A photograph of the public QR must NOT automatically become sufficient to retrieve Tier-1 medical information.

The final cryptographic construction requires specialist review before production.

### Decision

> **Emergency information may be centrally available for speed, but must not be centrally readable by default.**

---

# PART 27 — TIER 1 LIMITATIONS

Tier 1 normally requires connectivity.

If connectivity fails:

Tier 0 remains available.

Emergency treatment continues.

If no usable credential exists:

Tier 1 may be unavailable.

That is intentional.

Security is not bypassed merely because convenience would improve.

---

# PART 28 — TIER 2 BREAK-GLASS

Suppose Rahul is unconscious and the emergency department legitimately needs information beyond Tier 1.

An authorized clinician can invoke:

# BREAK GLASS

The system records:

- professional
- facility
- patient
- declared emergency reason
- information requested
- information actually accessed
- timestamp
- duration
- credential/device context

Authorization automatically expires.

Break-glass events receive elevated review.

---

# PART 29 — CARE WITHOUT DIGITAL ACCESS

If:

QR fails,

server fails,

internet fails,

identity cannot be established,

phone is destroyed,

or authentication fails,

the hospital still treats the patient using normal emergency clinical procedures.

### Rule

# DIGITAL FAILURE MUST NEVER BECOME CLINICAL DENIAL.

---

# PART 30 — BLOOD GROUP SAFETY

A stored blood group is prior information.

It is not permission to ignore normal clinical safety procedures.

The system clearly displays provenance and verification date.

---

# PART 31 — STALE EMERGENCY INFORMATION

Every emergency summary has freshness information.

Example:

**Last clinically updated: 03 Oct 2026**

When an important verified allergy/medication change enters the ecosystem, the citizen can be prompted to update their emergency configuration.

Old information is never silently presented as unquestionably current.

---

# PART 32 — RECORD CORRECTION

Healthcare records are not silently overwritten.

A correction retains:

- original
- correction
- author
- timestamp
- reason
- provenance

The current clinical version is clearly displayed.

---

# PART 33 — AUDIT LOGS ARE ALSO SENSITIVE

A log saying:

"Rahul accessed Psychiatry Hospital"

can itself reveal health information.

Therefore audit records require:

- encryption
- access controls
- purpose limitation
- retention rules
- tamper evidence
- monitoring

Audit logs are not public browsing data.

---

# PART 34 — TRANSPARENCY LAYER

Ordinary logs tell us:

> "The database says this happened."

JeevanRekha needs stronger evidence for high-risk events.

Critical events can be committed into an append-only/tamper-evident transparency structure.

Examples:

- consent issued
- consent revoked
- Tier-1 emergency release
- break-glass event
- credential revoked
- emergency-summary version changed
- high-impact public-health result published

---

# PART 35 — TRANSPARENCY DOES NOT MEAN PUBLIC MEDICAL LOGS

The transparency system must not publish:

> Rahul → HIV clinic

to the world.

Instead it can publish cryptographic commitments/proofs representing events without exposing the underlying medical information publicly.

Authorized parties can later verify:

- event existed
- timestamp/order
- it wasn't silently removed
- a later version did not secretly replace history

The patient can verify events relevant to them.

Auditors receive appropriately authorized evidence.

---

# PART 36 — PATIENT ACCESS HISTORY

The citizen application can show understandable information:

**Dr X**

Hospital Y

Viewed: Laboratory Reports

Reason: Treatment

Time: 14:32

Authorization: Consent #...

And separately:

**Emergency access**

Hospital Z

Break-glass

Time: 02:11

The patient should not need to understand cryptographic hashes to understand their own history.

---

# PART 37 — SUSPICIOUS ACCESS DETECTION

JeevanRekha monitors patterns such as:

- professional accessing unusual numbers of unrelated patients
- repeated break-glass usage
- impossible location/device patterns
- mass downloads
- repeated failed authorization
- suspicious credential use

Alerts trigger investigation.

They do not automatically declare the professional guilty.

---

# PART 38 — LOST CARD / PHONE

Lost phone:

revoke device.

Lost card:

revoke card credential.

Lost wearable:

revoke wearable.

Each credential can have independent status.

A new credential receives fresh secrets.

---

# PART 39 — PUBLIC HEALTH

Now consider another problem.

Ten hospitals each see two unusual cases.

Total:

20 cases.

If each hospital suppresses counts below five:

0 + 0 + 0 + ...

The outbreak disappears.

If every hospital adds large privacy noise independently, accumulated noise can also hide useful signals.

But sending exact individual facility counts to one central server creates another privacy problem.

---

# PART 40 — SECURE AGGREGATION

JeevanRekha therefore proposes privacy-preserving aggregation for suitable trend signals.

Each participating facility counts:

> **unique patients, not visits**

for a defined syndrome/reporting period.

A patient's repeated visits should not automatically become repeated independent cases.

Each permitted measurement is cryptographically transformed into shares sent to separate aggregation services.

Conceptually:

Hospital count = C

↓

Share A + Share B

↓

Aggregator A receives A

Aggregator B receives B

Individually the shares do not reveal the original measurement under the intended protocol.

Aggregated shares are combined to produce an authorized population statistic.

---

# PART 41 — TWO INDEPENDENT AGGREGATORS

Conceptually:

### Aggregator A

Public-health infrastructure.

### Aggregator B

Independent authorized institution.

They should have:

- separate administrative control
- separate credentials
- separate infrastructure/cloud trust domains where practical
- independent audit

Neither should routinely receive a facility's clear count.

---

# PART 42 — MALICIOUS HOSPITAL PROBLEM

Privacy creates another issue.

A malicious facility might submit:

10,000 fake cases

or an invalid value.

Therefore simple additive secret sharing is NOT sufficient.

The production protocol requires:

- authenticated facility credentials
- replay protection
- input validation
- validity proofs or equivalent privacy-preserving validation
- acceptable measurement bounds
- duplicate/report-window controls
- protocol-level verification

A Prio/VDAF-style construction is one possible direction, subject to standards/security review.

### Decision

**Privacy must not remove integrity.**

---

# PART 43 — PRIVACY NOISE

Where differential privacy or statistical noise is appropriate, noise is calibrated at the aggregate release stage rather than independently destroying every small facility's signal.

The precise mechanism depends on the query, sensitivity and privacy model.

Privacy parameters must be documented.

They are not magical constants.

---

# PART 44 — SMALL COUNTS

Small counts are protected at the level of released statistics.

Example:

A tiny village should not publicly display:

**Rare condition = 1**

when that could identify the individual.

Controls can include:

- minimum cohort thresholds
- geographic aggregation
- temporal aggregation
- differential privacy
- controlled output review

---

# PART 45 — COVERAGE

Every disease signal must show reporting completeness.

Example:

### Respiratory syndrome

Signal: HIGH

Coverage: 43%

Confidence: LOW

because:

> **No data ≠ no disease.**

A poorly digitized district must not automatically appear healthy.

---

# PART 46 — OFFLINE HOSPITAL

If Hospital X does not report during a reporting window:

the system does not invent zero cases.

Instead:

its contribution is missing

and

coverage decreases.

This distinction is essential.

---

# PART 47 — EXISTING SURVEILLANCE FIRST

JeevanRekha does not create a parallel replacement for India's existing disease-surveillance infrastructure.

Privacy-protected signals should feed appropriate existing public-health workflows such as IDSP/IHIP where integration is authorized.

The surveillance system then supports epidemiologists and Rapid Response Teams.

---

# PART 48 — AI DOES NOT DECLARE AN OUTBREAK

Statistical systems may detect:

> **Unusual increase. Investigation recommended.**

They do not automatically announce:

> **There is definitely an epidemic.**

Human epidemiologists investigate.

Simple statistical techniques may often be preferable to unnecessary black-box AI.

---

# PART 49 — SINGLE NOTIFIABLE CASES

Secure aggregation is designed for population trends.

It does not replace legally required notification channels for diseases/events where even a single case requires specific reporting/action.

Those continue through the applicable public-health process.

---

# PART 50 — PUBLIC HEALTH TRANSPARENCY

Published high-impact aggregate outputs can also receive tamper-evident records.

For example the transparency evidence can bind:

- reporting period
- geographic level
- participating-source coverage
- algorithm/version
- privacy configuration identifier
- released statistic/version

without publishing patient data.

This helps auditors establish what calculation/version produced a public result.

---

# PART 51 — GOVERNMENT ACCESS BOUNDARY

Population intelligence does not create a:

# SEARCH CITIZEN

button.

Routine analytics sees authorized population signals.

Individual clinical access remains governed through separate healthcare/legal pathways.

These domains are deliberately separated.

---

# PART 52 — CHILDREN

Children require guardian rules consistent with applicable law.

But guardian control cannot simply remain forever.

When legal control transitions to the individual, permissions require lifecycle handling and fresh choices where required.

Emergency-disclosure preferences should also be reviewed.

---

# PART 53 — COERCION

Family is not always safe.

Therefore JeevanRekha threat modelling includes:

- coercive caregiver
- abusive relationship
- forced consent
- stolen unlocked device
- shoulder surfing

Sensitive controls should be designed with clinical/legal experts.

JeevanRekha should not invent a simplistic secret "duress button" that might itself create danger.

---

# PART 54 — NO SMARTPHONE

Smartphone ownership is not mandatory.

Possible participation paths include:

- physical credential
- assisted healthcare-facility workflows
- appropriately designed alternative authentication
- printed emergency information
- card-based emergency capability

Staff assisting a citizen cannot choose public disclosure settings on the citizen's behalf merely for convenience.

---

# PART 55 — NO INTERNET

Normal healthcare continues.

Systems may queue appropriate updates for secure synchronization when connectivity returns.

Offline emergency Tier 0 remains minimal.

Tier 1 may become unavailable.

No security promise is silently discarded.

---

# PART 56 — RANSOMWARE

Federation helps reduce one giant blast radius but does not solve ransomware.

Hospitals still require:

- network segmentation
- least privilege
- protected backups
- tested recovery
- endpoint security
- incident response
- key separation
- downtime procedures

JeevanRekha assumes connected institutions can be compromised.

---

# PART 57 — SECURITY MODEL

JeevanRekha protects three things simultaneously:

### CONFIDENTIALITY

Unauthorized people cannot read information.

### INTEGRITY

Information cannot be silently modified.

### AVAILABILITY

Healthcare can continue when systems fail.

A system protecting confidentiality while preventing doctors from treating patients is not a successful health system.

---

# PART 58 — DATA INGESTION

Doctors should not spend consultations typing twenty years of history.

Priority sources are:

1. e-prescriptions
2. laboratory systems
3. discharge summaries
4. diagnostic reports
5. structured encounter summaries
6. patient-uploaded historical documents

Manual data remains possible but clearly labelled by provenance.

---

# PART 59 — INTEROPERABILITY

JeevanRekha does not require every hospital to buy one company's software.

Integration occurs through standardized healthcare interfaces and ABDM-compatible mechanisms.

Hospital vendors can implement compatible connectors/SDKs.

---

# PART 60 — GOVERNANCE

No single team should control:

identity

+

medical records

+

emergency keys

+

analytics

+

auditing

all at once.

Responsibilities should be institutionally separated.

A national deployment needs:

- policy authority
- technical operator
- healthcare institutions
- independent security oversight
- emergency authorities
- public-health authorities
- grievance mechanism
- independent audit

---

# PART 61 — GRIEVANCE

Citizens must be able to report:

"I didn't authorize this access."

"My card was stolen."

"My family member should no longer have permission."

"My record is incorrect."

"My emergency information is outdated."

"My account may be compromised."

Every complaint receives a trackable process.

---

# PART 62 — BREACH RESPONSE

JeevanRekha assumes attacks will eventually be attempted.

Response:

Detect

↓

Contain

↓

Revoke compromised credentials

↓

Rotate affected keys

↓

Investigate

↓

Restore

↓

Notify where legally required

↓

Audit

↓

Improve controls

Security is continuous.

---

# PART 63 — WHAT THE CITIZEN EXPERIENCES

For Rahul, all of this complexity becomes simple.

### Normal hospital visit

"Dr X wants labs for 2 hours."

**Allow / Deny**

### Family

"Allow mother to receive medication reminders?"

**Yes / No**

### Emergency

"Make critical allergy public on Emergency QR?"

**Public / Responders only / Don't show**

### Privacy

"Who accessed my information?"

**View history**

The cryptography remains underneath.

---

# PART 64 — WHAT THE DOCTOR EXPERIENCES

Doctor:

1. Logs in.
2. Selects patient.
3. Confirms patient match.
4. Requests relevant categories.
5. Receives consent.
6. Views authorized records.
7. Treats patient.
8. Adds new verified clinical information.

The doctor does not manually manage encryption keys.

---

# PART 65 — WHAT THE RESPONDER EXPERIENCES

Responder:

1. Scans emergency credential.
2. Confirms identity confidence.
3. Sees permitted Tier 0.
4. Authenticates as responder.
5. Requests Tier 1 if needed.
6. Receives minimum emergency summary.
7. Access is recorded.

The responder does not see an entire lifetime history.

---

# PART 66 — WHAT PUBLIC HEALTH SEES

Authorized epidemiologist sees:

**District X**

Respiratory syndrome ↑

Coverage 81%

Confidence Medium/High

Trend unusual

**Investigation recommended**

They do NOT routinely see:

Rahul Sharma

House address

Complete prescription history

Complete medical file

---

# PART 67 — WHAT JEEVANREKHA NEVER DOES

❌ Replace ABHA unnecessarily.

❌ Use PAN as a health identifier.

❌ Store Aadhaar authentication biometrics.

❌ Treat two fingerprints as two independent factors.

❌ Give family automatic medical access.

❌ Unlock an unconscious patient's personal phone with their biometrics.

❌ Run a national biometric search merely because an unidentified patient has no credential.

❌ Pre-tick sensitive public emergency disclosures.

❌ Put complete medical history inside a QR.

❌ Treat a QR photograph as professional authorization.

❌ Give a normal administrator a universal medical-record browsing key.

❌ Treat identity as consent.

❌ Treat consent as permanent.

❌ Let sealed diagnoses leak through obvious linked medication/metadata.

❌ Treat missing disease reports as zero cases.

❌ Publish tiny population counts that identify individuals.

❌ Let AI silently alter clinical records.

❌ Let AI autonomously declare outbreaks.

❌ Deny healthcare because the digital system failed.

---

# PART 68 — FINAL ARCHITECTURE

## NORMAL CARE

Citizen

↓

Identity

↓

Patient match

↓

Doctor request

↓

Explicit scoped consent

↓

Short-lived authorization

↓

Federated record retrieval

↓

Treatment

↓

New verified record

↓

Protected audit evidence

## EMERGENCY

Emergency Credential

↓

Identity Confidence

↓

Tier 0 Public Minimum

↓

Responder Authentication

↓

Tier 1 Protected Emergency Summary

↓

If necessary:

Tier 2 Break-Glass

↓

Audit + Transparency Evidence

## FAMILY

Citizen

↓

Granular Permission

↓

Reminder / Emergency / Selected Care Capability

↓

No automatic full-record access

## PUBLIC HEALTH

Hospital/Lab

↓

Unique-patient signal

↓

Validated secure aggregation

↓

Privacy-protected district statistic

↓

Coverage + Confidence

↓

IDSP/IHIP workflow

↓

Human investigation

---

# PART 69 — FINAL LOCKED DECISIONS

### Identity

Use existing health identity infrastructure rather than duplicate it.

### Aadhaar

Optional/appropriate identity-verification role; never everyday medical password; no storage of Aadhaar authentication biometrics.

### PAN

Not part of core health architecture.

### Records

Federated.

### Normal Access

Identity + patient matching + explicit scoped consent.

### Consent

WHO + WHAT + WHY + HOW LONG.

### Sensitive Information

Sealed compartments plus linked-data leakage protection.

### Family

Capability-based permissions.

### Unconscious Identity

Layered confidence; unverified information increases caution only.

### Tier 0

Active choice; no sensitive pre-ticks.

### Offline

Minimal signed Tier-0 information.

### Tier 1

Protected pre-computed emergency summary with separated cryptographic access components.

### Tier 2

Authenticated, scoped, expiring, heavily audited break-glass.

### Failure

Care continues.

### Analytics

Secure aggregation for suitable population trends.

### Coverage

Always distinguish missing reports from zero cases.

### Outbreak Detection

Signal → epidemiological investigation, not automatic declaration.

### Transparency

High-risk events receive tamper-evident evidence without publishing medical relationships.

### Government

Population intelligence and individual clinical access remain separate security domains.

---

# PART 70 — THE COMPLETE JEEVANREKHA PROMISE

JeevanRekha is designed so that:

**A doctor can know what they need without knowing everything.**

**A family can help without automatically watching everything.**

**A responder can act when a patient cannot speak without turning a QR into a medical-file password.**

**A hospital can contribute to outbreak detection without exposing every local patient's identity.**

**Public-health authorities can detect patterns without receiving a searchable database of everyone's medical life.**

**Citizens can see who accessed their information.**

**Auditors can detect attempts to rewrite important access history.**

And if the technology fails:

# THE PATIENT STILL GETS TREATED.

---

# FINAL ONE-LINE PITCH

> **JeevanRekha is a zero-trust health trust and emergency layer for India's existing digital-health ecosystem that connects consent-controlled medical access, privacy-safe emergency care, family assistance and early disease intelligence without creating one central database that can see everyone's medical life.**

# FINAL MOTTO

## Right Person.

## Right Data.

## Right Reason.

## Right Time.

## And never more than necessary.

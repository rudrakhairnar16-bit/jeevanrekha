# Security baseline, corrections and review gates

Date: 2026-10-16. Applies to every prototype task. This file records **new engineering cautions**, not silent edits to accepted ADR history. Conflicts below require explicit review and later superseding ADRs.

## Corrections to earlier discussions and current ADR wording

| Prior statement | Engineering correction / safe default |
|---|---|
| Scoped consent and signed artefacts are new capabilities | ABDM already supports consent-based exchange. JR's differentiation must be established by gap analysis, not assumed. |
| An ABDM consent artefact contains a one-time keypair | Do not rely on this secondary-source claim. Consent permission and data-transfer key material are distinct concerns; verify current official API schemas during adapter work. No private key belongs in a shared consent artefact. |
| A BTG purpose code guarantees an operational bypass API | A vocabulary code is not authority or implementation. Actual emergency exchange depends on available APIs, provider policy, law and onboarding. Mock it explicitly. |
| A DPDP nominee can approve care or cannot unseal records | Data-rights nomination is not automatically medical decision-making authority. Neither unconditional nominee power nor an absolute prohibition is established. Legal/clinical review required. |
| DPDP s.7(f) directly authorizes our on-card unconscious biometric workflow | Do not treat a provision alone as approval. Applicability, commencement, Aadhaar-specific restrictions and clinical emergency rules need legal review. Prototype uses simulated matching. |
| An unverified allergy list is harmless if it merely increases caution | Avoiding appropriate treatment or assuming a device exists can also harm. Unverified information is a hypothesis only; clinicians must evaluate it independently. No medical advice engine. |
| Server compromise alone can never expose a key-split summary | Only under an explicit threat model. A compromised web server can serve malicious JavaScript that exfiltrates QR secrets; issuance/update terminals also see secrets. Hashes and URL fragments do not fix this. |
| A QR proves a responder is physically at the patient | QR images are copyable. QR + credential can enable remote abuse. It is a bearer capability, not presence proof. |
| Domain separation makes the public QR secret from anyone photographing it | It prevents cross-purpose key reuse, not copying. A photographer obtains everything encoded in the QR. Independent responder authorization remains mandatory. |
| Expiry wipes decrypted content after four hours | It ends authorized sessions/fetches; it cannot revoke screenshots, memory copies or malicious client exports. Local wipe is best-effort. |
| A version in AES-GCM associated data prevents rollback | It prevents altering version metadata but not replaying an older valid ciphertext with its old version. Need a separately authenticated latest-version source and anti-rollback policy. |
| Offline URL QR works for every first-time bystander | Without internet or a preinstalled/cached verifier, the URL cannot load and its signature cannot be checked. Printed information is the general no-app fallback. |
| A validity proof prevents fake case reports | It can prove encoding/range validity, not that patients existed or diagnoses were true. Facility audits and source integrity still matter. |
| Local unique-patient counts produce district unique persons | One patient at multiple hospitals is counted multiple times. Call the metric a sum of facility-distinct counts unless an approved cross-facility dedup protocol exists. |
| Each server adds half the noise | Sampling half-amplitude noise is not generally correct. Use a proven distributed mechanism with a stated corruption model, sensitivity and composition accounting. No DP guarantee for the educational demo. |
| Small-count suppression or a minimum cell size guarantees anonymity | Differencing, overlap and repeated releases leak information. Suppression alone is not differential privacy. |
| A salted commitment proves event completeness and time | It supports integrity/inclusion when witnesses check it. It does not prove an omitted access was logged or establish trusted real-world time. No public patient identifiers; account for traffic metadata too. |

## Prototype threat model

Assets: consent grants, device secrets, clinical records, emergency summaries, family mappings, audit metadata and aggregation inputs. Attackers: other patients, relatives, malicious insiders, compromised providers, stolen devices, rogue responders and external scanners.

Trust boundaries: browser/trust; trust/provider; browser/emergency; emergency/key service; family notification relay; source/each aggregator; event store/transparency witness. Do not assume same-origin browser code is trustworthy after a server compromise.

## Mandatory controls

- Deny by default; check principal, subject, audience, facility, purpose, scope, expiry and revocation on every protected request.
- Bind capabilities to intended requester/device where feasible. Client role toggles never grant authority.
- Use a standard session design, secure HttpOnly cookies where applicable, CSRF controls and strict origin validation.
- Validate inputs; bound pagination/uploads; prevent path traversal, injection and broken object-level authorization.
- Filter sealed episodes and linked items **before** pagination, totals, search and serialization.
- Separate databases and least-privilege service credentials; synthetic fixtures only.
- Use cryptographically secure randomness. No `random` module for secrets.
- Keys and secret shares never in logs, URLs sent to servers, analytics, crash dumps or Git.
- No third-party analytics or scripts on QR/consent pages.
- Rate-limit public alerts without blocking emergency call information.
- Record access and denied attempts with minimized metadata; do not log clinical request bodies.
- Fix transaction races: consent revocation, expiry and fetch must be checked at provider release time.
- Use outbox/retry semantics; delivery unknown is not delivery successful.

## Production gates

1. **Emergency crypto:** independent protocol review covering issuer trust, provisioning, web code integrity, credential copying, recovery, rotation, rollback, device compromise and key release.
2. **Aggregation:** reviewed VDAF/Prio library; validity vs truth distinction; non-collusion governance; same-report-set coordination and dropout handling; DP adjacency, clipping, sensitivity, noise, thresholding and composition.
3. **Legal/clinical:** current official texts and commencement dates; ABDM onboarding; Aadhaar permissions; sensitive-care rules; guardian and nominee authority; lawful notification; retention and breach duties.
4. **Operations:** independent security testing, backup restoration, incident exercise, accessibility/clinical usability review and signed acceptance.

Until gates pass: synthetic data only; no clinical deployment and no certified/privacy-guaranteed claims.

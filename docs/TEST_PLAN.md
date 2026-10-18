# Verification and acceptance plan

Status: specification only. **No application tests have run.** Every test below starts unimplemented. Documentation link/fence checks are a different check and do not establish application correctness.

## Layers

- Unit: scope intersection, expiry, state transitions, label propagation, coverage arithmetic.
- Integration: provider-side authorization, revocation races, separate stores, retry/outbox behavior.
- Browser: role-specific journeys, consent decisions, keyboard access, status feedback.
- Adversarial: object-ID swapping, role spoofing, replay, malformed payloads, hidden-data leaks.
- Manual: UI/UX acceptance, usability and explicit mock labels.

## Acceptance matrix

| ID | Given / when | Required result | Flow |
|---|---|---|---|
| A01 | New synthetic account; enrollment completed | No PAN/Aadhaar storage; independent credentials; no public flags pre-ticked | F-01 |
| A02 | Identity authenticated but no consent | Minimal identity only; clinical API denies access | F-02 |
| A03 | Wrong patient identifier entered | Match fails; request does not advance | F-02 |
| A04 | Citizen grants only labs + prescriptions | Only those categories returned; verified vs reported provenance visible | F-02 |
| A05 | Citizen denies request | No clinical release; normal treatment path stays available | F-02 |
| A06 | Grant expired/revoked before provider release | Provider refuses; stale UI or cached capability cannot bypass | F-04 |
| A07 | Sealed episode with linked medicine | Neither item nor revealing count/search metadata leaks | F-05 |
| A08 | Reminder-only caregiver queries timeline or raw API | Denied; reminder text contains no medicine/diagnosis | F-06 |
| A09 | Reminder not acknowledged | Say unacknowledged, not medically proven missed dose | F-07 |
| A10 | Stranger preview and actual Tier-0 scan | Exactly the chosen public fields; no contacts or unapproved identity | F-08 |
| A11 | Installed scanner offline; valid/tampered payload | Valid flags verify; tampered payload explicitly rejected | F-09 |
| A12 | First-time browser offline | Printed fallback documented; no fake claim of successful QR verification | F-09 |
| A13 | Public QR without responder credentials | No Tier-1 data; QR is not authorization | F-10 |
| A14 | Authorized mock responder requests summary | Logged narrow release; freshness/confidence warnings; no real-service claims | F-10 |
| A15 | Credential found nearby | Unverified association banner; no asserted identity or automated medical decision | F-11 |
| A16 | Break-glass without role/reason or for unrelated patient | Denied; no generic admin bypass | F-12 |
| A17 | Allowed mock emergency request | Narrow release; actual accessed categories and review entry recorded | F-12 |
| A18 | Older signed summary replayed | Detected using independently authenticated latest version, not AAD alone | F-13 |
| A19 | One card revoked | Other credentials still work; copied offline payload limitation shown | F-14 |
| A20 | Recovery canceled on registered channel | New session not issued; audit evidence retained | F-15 |
| A21 | Commitment proof checked then event/proof altered | Valid proof passes; alteration fails; witness model disclosed | F-16 |
| A22 | One clinician opens unrelated patients repeatedly | Review alert, not automatic finding of guilt | F-17 |
| A23 | Ten simulated facility counts sum to twenty | Share sums match; no local small-count suppression | F-18 |
| A24 | Invalid or replayed report | Reject or flag; educational validation explicitly not VDAF proof | F-18 |
| A25 | Aggregators received different report sets | Release blocked until same validated batch established | F-18 |
| A26 | Missing facility versus explicit zero report | Different coverage and missingness semantics | F-19 |
| A27 | Aggregate released | Coverage, definition, freshness, limitations and config ID shown; no names | F-20 |
| A28 | Grievance submitted | Trackable receipt; no claim hospital record was erased by revocation | F-21 |
| A29 | Provider/ABDM/emergency/log outage | Honest partial or delayed result; no unsafe privilege fallback | F-23 |
| A30 | Patient A substitutes Patient B object ID | Denied on every endpoint, including audit and family | All |
| A31 | Malformed input, injected role, excessive request or token replay | Rejected/rate limited; server role authoritative | All |
| A32 | Logs, browser errors and telemetry inspected | No keys, QR tokens, personal/clinical payloads | All |
| A33 | Mock integrations visible | Persistent synthetic-demo indicator, including exported demo screenshots | All |
| A34 | Consent used for an already copied record | Explain expiry cannot erase historical lawful copies | F-04 |

## UI/UX checks to finalize after discussion

Keyboard navigation, focus management, screen-reader labels, contrast, zoom, translation layout, distinct public/responders scopes, warning comprehensibility and screen privacy. No visual design is approved yet.

## Definition of task completion

1. Relevant acceptance IDs named before coding.
2. Test fails for the original bug or missing behavior.
3. Implementation passes it without weakening tests.
4. Typecheck/lint/tests actually run and outcomes recorded.
5. Domain/API docs updated if behavior changed.
6. Any skipped test or mocked guarantee disclosed.

CI eventually runs lint/typecheck/unit/integration/browser suites. Current CI runs documentation checks only. Cryptographic round trips and arithmetic examples are not security proofs.

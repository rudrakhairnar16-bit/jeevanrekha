# JeevanRekha Demo Director — Final Competition Cut

## Routes
- `/demo` — evidence-first jury cut. Drives the same-origin `/prototype?demo=1` UI through real browser actions.
- `/demo?autoplay=1&clean=1` — recording-ready evidence cut.
- `/demo?mode=full` — longer system story.
- `/beastmode` — direct complete competition showcase route.
- `/prototype` — manual interactive playground.

## Evidence-first sequence
1. Open Doctor workspace.
2. Confirm the intended synthetic patient. This does not grant permission.
3. Reduce request to Labs only.
4. Set duration to 1 hour.
5. Send the request.
6. Switch to Citizen and verify WHO / WHAT / WHY / HOW LONG.
7. Explicitly allow the 1-hour request.
8. Return to Doctor and assert CBC is visible while prescription content is absent.
9. Assert revealing sealed psychiatric metadata is absent.
10. Citizen revokes access.
11. Return to Doctor and assert authorization and retrieved CBC are gone.
12. Switch to Responder, simulate network loss, and assert OFFLINE MODE + standard emergency care continues.
13. Return to Prototype hub and state BUILT / SIMULATED / PROPOSED boundaries.
14. Close on CARE CONTINUES.

The director pauses with a readable error if an expected state is not found. Escape toggles pause/resume during the evidence run. Manual takeover remains available.

## Evidence boundaries
**BUILT:** browser interactions, local synthetic state, scope selection, consent decisions, revocation, role switching, failure-state UX.

**SIMULATED:** provider retrieval, professional authentication, emergency credential matching, notifications and external exchanges.

**PROPOSED:** production HSM/KMS, national identity/registry integrations, provider-side enforcement infrastructure, independent aggregation/privacy infrastructure.

Never describe this as a production clinical system. No real patient data is used.

## Release gate
Run from the current repository root:

```bash
npm ci
npm run typecheck
npm run build
npm run test:e2e --workspace apps/web
```

Critical acceptance: Labs-only contains no prescription content; sealed unauthorized metadata is absent; 1-hour duration is consistent; patient match persists across role switching; revoke blocks subsequent retrieval; deny grants no access; offline failure preserves Tier-0-only behavior and care-continuity copy; `/demo` works at desktop and mobile sizes; reduced motion remains readable.

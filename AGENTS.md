# JeevanRekha — coding-agent instructions

## Current state
The latest master task authorizes the real-time cinematic replacement, rendering dependencies and validation; it supersedes old phase-authorization statements for the website. It does not authorize a clinical backend, real integrations, deployment or publication. `/` is a sixteen-beat, deterministic native-scroll Three.js prototype; `/story` preserves the prior presentation. Art/owner acceptance and physical-device validation remain open.
Read docs/CINEMATIC_IMPLEMENTATION.md and docs/CINEMATIC_HANDOFF.md for current architecture, evidence and limits. Never equate old static QA with WebGL coverage. Stop the production server before rebuilding, then restart it to avoid stale hashed CSS.

## Read selectively
1. README.md and docs/PROGRESS.md at session start.
2. docs/MVP_SCOPE.md before proposing work.
3. Relevant ADRs in docs/DECISIONS.md and flows in docs/FLOWS.md.
4. docs/SECURITY.md before auth, consent, emergency, audit or analytics changes.
5. docs/TECH.md, docs/DATA_MODEL.md and docs/API_CONTRACTS.md for implementation.
6. docs/TEST_PLAN.md and docs/BUILD_PLAN.md for completion checks.
Do not load every large document into every task.

## Authority and uncertainty
- SYSTEM_E2E.md is the owner's requirements baseline, not proof of implementation.
- Existing accepted ADRs preserve decision history. Do not silently rewrite them.
- SECURITY.md records safety corrections and production blockers; raise conflicts explicitly.
- Proposed stack, policy defaults and review-gated cryptography are not production approvals.
- No claim of ABDM, UIDAI, HPR, HFR or IHIP certification without real evidence.

## Hard boundaries
- Synthetic identities and clinical records only. No real Aadhaar, PAN or medical uploads.
- No Aadhaar biometric storage and no national biometric search.
- Identity is not consent. Family relationship is not a permission.
- Enforce access on the server and again at the provider, not just in the UI.
- Never expose sealed data through lists, totals, search, notifications or logs.
- No raw tokens, key shares, plaintext summaries or health content in telemetry.
- Never invent cryptographic protocols or advertise toy secret sharing as Prio/VDAF.
- Public QR is copyable, not proof of physical presence.
- A timeout cannot remotely erase data already copied by a malicious client.
- No push, SMS, call or emergency-service dispatch without explicit configuration/authorization.

## Working method
- Implement one reviewed task and its tests at a time; cite task, ADR and flow IDs.
- Ask before changing dependencies, scope, auth rules or data ownership.
- No destructive database changes without a migration/rollback plan.
- No secrets in Git. Keep .env.example aligned with config validation.
- Run checks; report commands and outcomes. Never mark unrun checks as passing.
- Update PROGRESS.md after a milestone with facts, blockers and the exact next task.
- Preserve the approved Hybrid Cinematic storyboard. Detailed visuals and implementation remain subject to owner review.

## Commands available now
- Documentation validation: `python3 tools/check_docs.py`
- Install: `npm ci` (Node >=20.9).
- Preview: `npm run dev` (0.0.0.0:3000).
- Build: `npm run build`; types: `npm run typecheck`.
- Browser tests with dev server running: `npm run test:e2e --workspace apps/web`.
- Browser setup: `npx playwright install --with-deps chromium`.

## Completion report
State changed files, tests actually run, mock-vs-real boundaries, known failures and next task.
Do not commit or push without the user's authorization.

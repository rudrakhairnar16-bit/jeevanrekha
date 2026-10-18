# Owner-directed cinematic rescue — 17 Oct 2026

This pass responds to the owner rejecting the previous Arena cinematic quality and scroll feel.

## Changes
- Added a full-viewport authored landing prelude so the emergency film no longer begins abruptly on first paint.
- Kept native browser scrolling; story progress begins after the prelude.
- Reworked visual-follow smoothing to remove the old 160 ms hard catch-up snap and use frame-rate-independent interpolation.
- Added a fictional, unbranded ambulance arrival to motivate the verified responder beat rather than making the medic appear from nowhere.
- Preserved the canonical sequence: human moment → non-graphic incident → bystander/public minimum → responder/ambulance → limited Tier 1 → family alert → ordinary care → scoped consent → federation → sealed relationships → family capability → emergency protection → population → aggregation → transparency → care continues → finale.

## Boundaries
The ambulance and all clinical/emergency behavior are illustrative. No dispatch, government affiliation, real QR authorization, clinical integration, or real emergency service is represented.

## Verification note
Source-level edits were completed. Dependency installation in the sandbox exceeded the execution window, so a fresh full browser regression was not falsely claimed for this owner rescue pass. Run `npm ci`, `npm run typecheck`, `npm run build`, then the existing Playwright/cinematic review suite on the target machine before deployment.

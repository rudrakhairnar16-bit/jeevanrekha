# Current cinematic rescue

The authoritative current implementation/evidence closeout is [QUALITY_RESCUE_RELEASE.md](QUALITY_RESCUE_RELEASE.md). The document below is retained as historical implementation detail; its old assets, budgets and test counts do not describe the rescued build.

---

# JeevanRekha — cinematic implementation handoff

**16 October 2026 · implemented frontend concept, not a clinical service.**

The original audit and written plan are in [CINEMATIC_IMPLEMENTATION.md](CINEMATIC_IMPLEMENTATION.md). The original section-based presentation remains at `/story`; the primary `/` experience is a native-scroll, real-time Three.js film. No video, real medical records, SMS, government integration or clinical backend is involved.

## 1. Run and verify

From the repository root:

```bash
npm ci
npm run build
npm run start --workspace apps/web
# Production server: port 3000, bound to 0.0.0.0
```

In another terminal:

```bash
npm run typecheck
npm run test:e2e --workspace apps/web -- --workers=2
node tools/cinema_review.cjs
node tools/cinema_smoke.cjs
python3 tools/check_docs.py
npm audit --omit=dev
```

The review tools expect the running production server on port 3000. Install Playwright browsers if absent: `npx playwright install chromium firefox webkit`. Graphics tests explicitly enable Chromium's software WebGL; this does not certify a physical GPU.

Useful routes: `/`, `/?view=story`, `/story`, `/architecture`, `/status`, `/walkthrough`. Scene deep links use `/#film-doctor-consent`, for example. Experience settings provide native chapter/quality selects and reading mode. Final primary CTAs are **Experience the Prototype** and **Explore the Architecture**.

## 2. Architecture and deterministic ownership

Source modules are under `apps/web/components/cinema/`:

| Module | Responsibility |
|---|---|
| `narrative.ts` | Sixteen weighted ranges; pure `resolveNarrative(progress)`; authored camera position/target and continuous boundary poses |
| `controller.ts` | Passive native scroll, resize/hash restoration, one coalesced requestAnimationFrame, preference handling, cancellation and failure fallback |
| `engine.ts` | Persistent renderer/canvas, world visibility and lighting, same-canvas quality changes, projection, measurement and disposal |
| `worlds.ts` | Emergency, clinical, trust and population world builders; all poses and spatial transitions sampled from global time |
| `assets.ts` | Shared geometry/materials, rigged actor adapters, joint-attached props, fixed anatomy/foot calibration cached once per model variant |
| `humans.ts` | Abortable local model fetch, GLTFLoader/Meshopt parsing, ownership and partial-failure cleanup |
| `geography.ts` | Generalized India silhouette and separately authored schematic Gujarat highlight |
| `gpu-timer.ts` | Bounded, asynchronous GPU queries; unsupported/disjoint handling; no synchronous GPU-result wait |
| `experience.tsx` | Client enhancement over server-rendered complete story, controls, preference fallback and local consent callbacks |
| `overlays.tsx` | Precise readable HTML information, native disclosures and optional local-only demonstrations |

Native scroll distance maps to a normalized **0–1 global story time**. That value resolves the act, local time, camera, actors, world visibility, lights and materials. There are no independent intersection-observer scene animations, accumulated camera lerps, wall-clock character mixers, scroll snapping or wheel interception. Reversing restores the same pose; stopping does not keep rendering. Optional consent-demo state is explicitly separate from story time: **scrolling never grants permission**. Local choices reset on leaving their demonstration and never authorize anything outside this page.

The four reusable worlds load when first needed. Current/previous worlds support authored transitions; the bounded four-world set remains cached for reliable reverse navigation, not unloaded/re-fetched on every scroll boundary. Only relevant worlds are visible. Renderer resources are released on fallback/unmount; even an interrupted startup releases its allocated graphics context. Failed model loading selects the complete reading experience instead of silently substituting mannequin figures.

## 3. Scene map

| Beat | World | Visual action and boundary |
|---|---|---|
| I · Opening | Emergency | Adult silhouette walks along a restrained street; carried bag and small credential establish a person, not a giant QR |
| II · Incident | Emergency | Non-graphic deterministic collapse, bag drop and approaching bystander; no wound or phone-unlocking depiction |
| III · Public minimum | Emergency | Hand-held scanning phone and deliberate public-minimum illustration; history and sealed records stay locked |
| IV · Verified help | Emergency | Separate responder credential/verification and a limited summary; QR is neither professional proof nor presence proof |
| V · Family alert | Emergency | Family phone and factual **Emergency credential triggered · 14:32**; approximate location, no accident confirmation or dispatched SMS |
| VI · Ordinary visit | Clinical | Warm clinical reset; emergency permission visibly ends before routine care |
| VII · Consent | Clinical | Dr. Sharma / XYZ Hospital, who–what–why–two hours; optional request with nothing preselected |
| VIII · Federation | Trust | Four provider endpoints, direct temporary report path and deterministic expiry; not a central warehouse |
| IX · Sealed relationships | Trust | Proposed enclosure expands around episode, prescription, related test and metadata; no sensitive diagnosis disclosed |
| X · Family capability | Trust | Reminder capability remains separate from full-history access |
| XI · Emergency protection | Trust | Two components plus authenticated responder context; no real cryptographic unlocking or guarantee |
| XII · Population | Population | Human identity is removed before facility→city→district→Gujarat→India pullback; fictional area statistic, not journey tracking |
| XIII · Aggregation | Population | Separate paths to Aggregators A and B, privacy controls and district output; no per-facility clear counts |
| XIV · Transparency | Population | Evidence timeline and illustrated historical-edit mismatch, not an uncomputed claim of tamper-proof security |
| XV · Care continues | Clinical | Device/network layer recedes while clinician and person remain; care is never permission-gated |
| XVI · Finale | Clinical | Restrained shared clinical tableau, identity statement, two CTAs and visible concept/non-government disclaimer |

Continuity is carried by the scan/document/path line, material restraint and authored camera moves rather than repeated landing-page cards. India geography is a sourced generalized illustration; Gujarat and district scales are explicitly schematic, not official boundaries.

## 4. Assets and optimisation

See [ASSET_NOTICES.md](ASSET_NOTICES.md) for source URLs, licences, modifications and legal text locations.

- Two local Quaternius CC0 rigged meshes, **345,644 bytes combined** after Meshopt compression. Idle + Walk retained; unrelated/combat clips and orphan samplers removed. Source copies, byte counts and SHA-256 file hashes are retained.
- Runtime uses direct deterministic keyframe interpolation. Adult proportions, smaller head/hands, trouser colours, restrained facial detail and joint-positioned shoes replace the original assembled mannequin geometry. This is stylized low-poly art, **not photorealistic or commissioned character art**.
- Each skinned primitive retains its own inverse binds/skeleton ownership. Precise bounds require `root.updateMatrixWorld(true)` before skinned bounds calculation; do not replace this with inherited `updateWorldMatrix` without regression checking. Normalized adult height is 1.82 scene units. Expensive calibration is cached once per model variant.
- Geometry/material caches, instanced architectural details, reused props and a local 128×128 contact-shade canvas reduce repeated allocation. Most reported textures are small skeletal bone palettes, not image downloads.
- Three.js and loader/decoder code are dynamically loaded only for the cinematic enhancement. No remote fonts, models, telemetry or API calls are needed at runtime.

### Quality tiers

| Tier | DPR cap | Shadows | Geometry |
|---|---:|---|---|
| HIGH | 1.6 | 2048 map | Full procedural detail |
| MEDIUM | 1.25 | 1024 map | Full procedural detail |
| LOW | 1.0 | Disabled | Lower detail at world construction |
| FALLBACK | No WebGL | None | Complete semantic HTML story and local demonstrations |

Mobile defaults to LOW with a differently framed canvas and readable lower information area, not a shrunk desktop layout. Quality changes retain the same canvas and loaded story position. Repeated expensive submissions/completed GPU samples can lower quality. DPR/shadow settings change in place; already-created cached worlds are not rebuilt solely to change detail. There is no bloom, particle field, background video or hidden perpetual animation loop. Future sound can subscribe to a narrative cue hook; **no audio is loaded or played**.

## 5. Verification and evidence

Latest full functional suite: **75/75 passed** (59 preserved reading-story cases + 16 cinematic/model/timer cases). `evidence/completion/functional-final.txt` contains the complete production-server run. Following the final opaque-navigation compositor correction, the affected cinematic suite passed **16/16** again (`cinematic-final.txt`), followed by a fresh 48-view/68-scan accessibility review. Final navigation-edge/finale checks added **6 more views and 6 axe scans**, all passing (`navigation-final.json`).

Coverage includes all sixteen forward/reverse acts; exact composition restoration; continuous camera boundaries; zero idle rendering; rapid skips; resize and deep links; same-canvas quality at deep population progress; keyboard chapter/consent/finale operation; explicit opt-in consent; reduced motion initially/live; forced colours; no JavaScript; unavailable WebGL; context loss; missing model assets; fresh 3D retry; released GPU geometry buffers; compact local model contents; and bounded/disjoint GPU-query cleanup.

- **48 scene views**: all sixteen beats at 1440, 390 and 320 CSS pixels.
- **68 axe scans**: scene views plus expanded interactive demonstrations. **Zero reported violations**; zero horizontal overflows, page exceptions or external network requests in the review.
- **9/9 smoke cases**: Chromium, Firefox and WebKit × default/reduced-motion/no-JavaScript. Default may legitimately choose complete reading mode where WebGL is unavailable; this is not a claim that all three engines rendered the real-time film.
- Production dependency audit: **zero known advisories** at verification time; not a security certification.
- Fresh visual-only captures hide explanatory paragraphs/detailed overlays to inspect the scan, consent, sealed relationships and population compositions separately. Without WebGL, all fourteen long-form chapters remain readable independently of the sixteen film beats.

Artifacts: `evidence/completion/review.json`, `cross-engine-smoke.json`, `metrics-summary.json`, `dependency-audit.json` and production logs; screenshots in `evidence/cinema/` and `evidence/completion/`. Historical reports elsewhere predate this implementation and are not current acceptance evidence.

### Measured limits — not a device benchmark

Observed one-navigation startup to film mode was 1440px: 2.10 s; 390px: 1.52 s; 320px: 1.46 s. Encoded subresource bytes were 5,97,642 (not a full wire/header/document byte audit). The complete HTML story was present while graphics prepared. These are individual local observations, not statistical network or physical-phone benchmarks.

| CSS width | CPU submit min / median / max (ms) | Peak draws / triangles | Peak resident geometries / textures |
|---|---|---|---|
| 1440 | 1.1 / 10.8 / 72.3 | 68 / 80,946 | 104 / 57 |
| 390 | 2.0 / 5.6 / 45.0 | 56 / 78,132 | 102 / 57 |
| 320 | 1.0 / 6.6 / 65.3 | 56 / 77,846 | 104 / 57 |


Software WebGL did **not** expose `EXT_disjoint_timer_query_webgl2`: `gpuElapsedMs=null`, zero completed GPU samples. Real asynchronous GPU-query code is implemented and mock-tested for bounded polling, disjoint reset and disposal, but physical GPU timing has not been measured here. CPU submission time is not GPU time, frame rate or VRAM. Resident renderer geometry/texture counters are not operating-system memory measurements. Cold world/shader work produces spikes; no sustained 60-fps or minimum-phone certification is claimed.

## 6. Accessibility and failure behaviour

- Complete server-rendered story before enhancement; no blank loading gate. Semantic sixteen-beat strip remains available to assistive technology, while the decorative canvas is hidden from it.
- Native keyboard-operable selects, disclosures, focusable information area, visible focus, skip navigation and final links. Reading-mode transitions preserve a corresponding chapter/focus when available.
- Reduced motion and forced colours select the static presentation, including live preference changes. Reading mode is always explicit and retry uses a fresh canvas/context.
- Optional demos remain usable without motion; no-JavaScript outcomes and locked states are explained rather than presented as live controls.
- Navigation/transport use opaque themed backing so contrast does not depend on arbitrary canvas pixels. Information panels use native scroll chaining, not a wheel-locking overlay.
- Axe leaves **colour-contrast review items incomplete** where canvas/transparency cannot be evaluated automatically. Zero axe violations is therefore not full WCAG conformance. Manual screen-reader, physical-browser contrast/zoom and touch review remain required.

## 7. Deliberate exclusions and acceptance gates

Implemented scope is the **local frontend cinematic concept**, not a deployed healthcare platform. No real identity verification, ABHA/Aadhaar lookup, biometric unlocking, consent manager, patient data store, backend API, notification dispatch, public-health feed, payment, OTP or banking flow exists. All facilities, people, times and statistics are fictional.

Emergency access, routine consent, family help, sealed relationships and population aggregation remain separate explanations. Aggregation does not implement Prio/VDAF or prove privacy; evidence visuals do not compute cryptographic proofs. Statutory identifiable reporting is a separately governed workflow, not an exception that exposes full individuals through the district view.

Before public/production use: owner visual acceptance; physical desktop/mobile GPU frame-pacing and memory budgets; manual assistive-technology audit; official cartographic review; specialist cryptographic/privacy/Indian-health-law review; clinical safety and security review; and separately authorised backend/integration work. No official partnership, deployment, repository commit/push or certification is claimed.

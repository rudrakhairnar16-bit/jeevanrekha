# JeevanRekha — cinematic rescue closeout

**PS000134 · VCCI · solo registration: 1 member.** 16 October 2026.

## Delivery boundary
The rebuilt frontend is available in the local live preview. It remains a fictional concept, not an official Government of India service, a clinical deployment, commissioned production character art or an independently certified system. The owner’s canonical project brain remains the product authority. No backend, real provider connections, alerts, cryptographic implementation, deployment, commit or push was introduced.

Implementation and automated verification are delivery milestones, **not owner creative acceptance**. Physical-device performance and manual assistive-technology review remain external gates. No 60fps, WCAG certification, clinical outcome or production-security claim is made.

## Implemented
- Native browser scroll, touch and keyboard remain native. A short frame-independent visual follower drives one deterministic narrative configuration. Settled progress is exact; the render loop stops at rest and when hidden. Resize no longer overwrites a newer scroll position with an old progress snapshot.
- Dedicated authored desktop and portrait camera tracks, bounded cubic interpolation, optical targets and lenses. Cross-world relocation is completed under the foreground transition before copy settles. Portrait is not a scaled desktop camera.
- Four shared, reusable worlds with architectural support, facade glazing/mullions/canopies, quiet palette/lighting, clinic daylight and a restrained continuous line motif. No bloom, particle spectacle, floating UI-card wall or hidden video.
- Licensed adult rigs, tailored continuous clothing surfaces, explicit skin cuts, normalized skin weights and error-bounded mesh simplification. Care/locomotion clips: Crouch, Kneel, Idle, Talk, Sit, Walk. Finger poses are relaxed rather than combat fists. Each seek restores bind-local bones before sampling; omitted channels cannot inherit prior history.
- Grounded helper/responder staging; responder no longer stands over the patient. The chair follows the actual seated hips. Medical badges attach to the chest bone rather than floating at standing height during kneeling. Device screens are oriented to their holders.
- Consent feedback is embedded in the clinical device, not four floating slabs. Scrolling does not grant access. Federation depicts a separate fictional scoped exchange and expiry, not the consent submitted in the previous interaction.
- Episode, prescription, test and revealing metadata close inside one opaque linked boundary. No diagnosis-only concealment or sensitive record contents.
- Family help remains separate from history permission. Emergency-summary protection components remain conceptual; neither component alone is sufficient. The responder is not hidden behind an oversized panel.
- No individual humans/identity enter the population world. District/country scale, separate aggregation paths and witnessed-evidence staging remain fictional illustrations, with statistical/protocol/cartographic limitations retained.
- Care continues when the device recedes; the clinician and person remain. Finale uses ivory/navy, two requested CTAs and the concept disclaimer with corrected contrast.
- Accessible semantic reading presentation remains in the first server response. Reduced motion, forced colors, missing models, WebGL denial/loss and explicit reading selection work without changing any permission rules.
- HIGH/MEDIUM use physically shaded surfaces. LOW uses cached diffuse materials without bump/PBR cost, reduced district geometry, no shadows and adaptive DPR down to .72. Text stays native HTML. Materials, geometry, textures, skeletons, GPU queries and buffers are disposed on teardown.
- Development HUD only in development; production omits it. Optional narrative-cue hook has no autoplay sound and no comprehension dependency.

## Verification and evidence

Run from project root:

```bash
npm run typecheck
npm run build
npm run start --workspace apps/web
# In another terminal:
npm run test:e2e --workspace apps/web -- --workers=1
node tools/assets/verify-rescue-humans.mjs
python3 tools/check_docs.py
```

- `evidence/rescue/final-tests.log`: **82/82 PASS** on the final production build (2.3 minutes). Earlier failed exploratory runs are not current acceptance.
- `evidence/rescue/input-smoke.json`: synthetic native touch335px, 4× CPU throttling, frozen/resume retained film mode; no page errors. This is CDP simulation, not physical touch hardware.
- `evidence/rescue/asset-invariants.json`: current manifest checks, six clips, distinct Skin/Shirt/Pants/Shoes materials, no unreachable nodes/targets, finite attributes, valid indices and normalized weights.
- `evidence/rescue/final/review.json`: 48 WCAG-tagged axe scans over all sixteen acts at desktop1440×900, portrait390×844 and landscape844×390. **Zero reported violations**; color-contrast checks include incomplete results because canvas/transparent composition is not fully measurable by axe. This is not a manual accessibility audit.
- `evidence/rescue/final/`: desktop/portrait sampled compositions and a native forward/reverse software-renderer review recording. Final badge/wire/illustrative-QR fixes are recaptured in `evidence/rescue/review-*`; nine HIGH-tier hero compositions are in `evidence/rescue/review-1440-high/`. Desktop/portrait contact sheets and timestamped frame-extracted forward/reverse contact sheets were inspected; these do not certify physical-device motion.
- `evidence/rescue/final/profile.json`: 180-rAF native forward/reverse synthetic profile with video recording. Software rendering and capture stalls are explicitly disclosed. No real-GPU timer was available.
- Automated coverage includes all-act forward/reverse, pixel-exact **3D** frame restoration, continuous/bounded camera tracks, rapid skips, resize, native wheel/PageDown, offline scrubbing, page restoration, quality switching, context loss, buffer release, no WebGL, no JS, reduced motion, forced colors, keyboard consent/CTAs and all-act reflow at320×740,390×844,768×1024,844×390.
- Pixel-exact 3D checks hide DOM overlays while taking canvas-area screenshots: otherwise Chromium’s text compositing can produce a few changed antialias pixels even with identical geometry/camera. Visible HTML controls are checked separately, not silently removed from accessibility coverage.

### Measured software profile — do not interpret as physical-device FPS

| Version | Median interval | p95 | Maximum |
|---|---:|---:|---:|
| Rejected old baseline |126.5ms|291.2ms|327.9ms|
| Rescue before geometry/shader optimization |242.4ms|383.5ms|419.7ms|
| Rescue after optimization |132.3ms|196.7ms|227.9ms|

The optimization substantially corrected the rescue’s regression and improved worst-case intervals against the old baseline; **the median remains slightly worse than the old version**. This does not establish smoothness on phones or claim 60fps. In that run, maximum reported draws101 / triangles92,380; adaptive DPR floor.72. ReadPixels warnings were produced by capture; no application page errors were recorded.

## Assets and reproduction
Current runtime files: male506,540 B; female532,324 B; combined1,038,864 B. Hashes and provenance are in `assets/rescue-human-manifest.json`; notices in `ASSET_NOTICES.md`.

```bash
node tools/assets/build-rescue-humans.mjs
node tools/assets/verify-rescue-humans.mjs
```

Source: Quaternius Universal Base Characters Standard, hairstyles and Universal Animation Library Standard, CC0. Custom wardrobe is project procedural work. No paid/fantasy wardrobe was substituted. Old unused Casual runtime models were removed; historical source/provenance remain. This is a deliberately stylized treatment, not photorealistic or commissioned character art.

## Decisions

**DECISION:** Error-bounded simplify the wardrobe/rig meshes and use cached Lambert surfaces in LOW, preserving full shading in MEDIUM/HIGH.
**WHY:** The first rebuilt version regressed badly in the software profile. Added geometry and unnecessary low-tier PBR/bump cost needed correction before any delivery claim.
**FAILURE CASE:** LOW is visibly softer/flatter; software rendering remains slow and is not a substitute for physical-device review.
**FALLBACK:** Complete native reading experience and explicit quality/reading controls. Never lock native scrolling or sacrifice text sharpness to conceal low frame rate.
**SECURITY–PRIVACY BOUNDARY:** Only geometry, shader and pixel budgets change. Access/consent/data policy does not.
**WHAT WE DO NOT CLAIM:** Superior old-baseline median, verified mobile60fps, GPU measurements where unsupported, or owner art acceptance.

**DECISION:** Use a quiet physical information-installation treatment for abstract trust/population concepts and an opaque enclosure for linked privacy.
**WHY:** Detached floating props and sparse blank cards did not convey meaningful relationships, depth or closure.
**FAILURE CASE:** Architectural models remain an abstraction and may not meet the owner’s preferred creative treatment; they do not prove the real system exists.
**FALLBACK:** The complete semantic explanation and independent local demonstrations remain authoritative for comprehension.
**SECURITY–PRIVACY BOUNDARY:** Sealed relationships include linked data/metadata; family capability is not consent; two aggregation trust domains require independent protocol/non-collusion review; lawful case reporting remains separate.
**WHAT WE DO NOT CLAIM:** Real hospital connectivity, actual sealed records, real decryption, independently hosted witnesses, surveyed official boundaries or real population statistics.

## Manual/external limits
No physical phone/tablet, real trackpad/touch hardware, Safari hardware GPU, manual screen reader or actual OS zoom certification was available in this sandbox. Automated responsive/reflow, keyboard, preference and failure tests are not equivalent. All final creative/production acceptance remains with the owner; a green report is not permission to call the project clinically deployable.

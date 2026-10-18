# Cinematic quality rescue — audit and rebuild contract

Date: 2026-10-16. Status: **owner rejected the previous presentation**. Previous green tests are functional evidence, not cinematic acceptance.

## Canonical baseline
The owner supplied the full **Ultimate Project Brain / Master Source of Truth** in this conversation (sections 0–212 plus final product/engineering rules). It has been read before implementation. No abbreviated replacement is being invented as a new product authority. Existing source copy, domain demonstrations and server-rendered narrative remain the product baseline; this pass changes presentation and rendering only.

## Source audit: causes, not symptoms

| Area | Finding in the current source | Consequence | Required structural correction |
|---|---|---|---|
| Scroll | `controller.draw` samples raw scroll directly, rendering only once per event; no visual-response filter | Discrete wheel deltas become discrete camera steps | Separate native raw target from a short, frame-time-aware visual follower; settle exactly and stop; no input interception |
| Timeline | `resolveNarrative` spends the first 38% moving the camera, then holds it for most acts | Stop–travel–stop cadence and long dead ranges | Authored continuous shot track with local progression throughout each act, independently from response smoothing |
| Camera | Per-act endpoint interpolation, special-case previous endpoints, fixed desktop target offset | Mechanically generated travel; all shots share the same framing rule | Dedicated deterministic camera rig: authored position/target/lens keys, continuous tangents, per-shot composition and mobile framing |
| Worlds | Four roots separated by 12 scene units; roots universally shrink to .82 and sink during transitions | Empty camera travel and unrelated toy stages popping in | Shared stage coordinates, motivated foreground occlusion for major relocations, sustained line motif; remove universal root bob/scale |
| Intra-world transitions | `stages` repeats the same shrinking/sinking pattern | Four demos instead of one film | Stage-specific reversible reveals, spatial continuity and motivated shot handoffs |
| Humans | 2019 casual meshes are aggressively re-proportioned at runtime; leg scaling, head .35, hands .65, added box shoes | Deformed clothing/hips, stock silhouettes and rigid gestures; a licensed asset is not automatically suitable art | Investigate a newer coherent rig/outfit source; use genuine adult proportions, not another round of arbitrary bone scaling; explicitly reject unfinished art |
| Gait | Travel progress is blended through `sin(progress*pi)` and two walk cycles regardless of travel distance | Foot slide and inconsistent gait near approach endpoints | Distance-related deterministic gait and planted endpoint poses; stage approaches before scanning |
| Lighting | One hemisphere + one directional light; mostly a warm/cool scalar switch | Flat, muddy surfaces; no motivated window/street light or focal hierarchy | Authored key/fill/rim/environment treatment, material variation and grounded architectural detail without light spam |
| Materials | Mostly constant solid colours, uniform roughness, generic bevelled boxes for rooms and objects | Untextured model-shop appearance | Intentional matte, woven/plaster/road surface treatment; architectural scale/details and selective specular response |
| UI | Fixed left column, persistent large headline, paragraph and all precision data on every act | Website copy dominates the film; same composition repeatedly | Sequential headline/context timing, compact scene-specific information, exact safety text retained; details progressively disclosed |
| Mobile | Fixed 49svh canvas above a separately scrolling text half; finale changes canvas size | Obvious two-panel website, not mobile film | Full-height authored mobile composition, controlled depth/density and integrated lower information; no wheel/touch listeners |
| CPU | World factories run synchronously on entry; exact skinned calibration cached but material/scene creation and shader first-use remain cold | Transition spikes despite few draw calls | Idle/proximity preconstruction and asynchronous shader readiness, bounded to four worlds; never block scrolling |
| React/DOM | Production React only updates on act/phase (keep); dev debug uses state every frame; label selectors and serialized metrics updated every frame | Unnecessary dev rerenders and repeated DOM work | Throttle diagnostics; cache label elements; keep animation imperative and semantic/UI state low frequency |
| GPU | DPR capped and resources pooled (keep); no postprocessing; GPU timer unavailable in recorded software environment | Not primarily an effects deficiency; existing frame-submit spikes cannot prove physical GPU FPS | Preserve bounded timer/disposal, measure actual frame intervals separately, adapt cost not text resolution |
| Restore | No explicit visibility-change integration in controller | Incomplete tab-restore/delta-spike behaviour | Suspend on hidden, reset time base and resume deterministically |
| Input | Passive native scroll, no GSAP/ScrollTrigger/R3F or wheel hijacking | Correct foundation | Preserve native document scrolling, keyboard, touch and real scrollbar |

## Decisions before rebuild

### 1. Preserve the browser; rebuild visual time and the camera
**DECISION:** one frame-time-independent, short-settling visual follower; a pure authored camera track sampled from visual progress. Same *settled* raw position yields exactly the same film state.
**WHY:** smoothing input would fight the browser; easing only endpoint coordinates creates stop–start travel.
**FAILURE CASE:** long catch-up after a scrollbar drag or hidden tab.
**FALLBACK:** bounded delta, faster convergence on large scrubs, exact endpoint snapping below a tiny numerical tolerance, no perpetual idle loop; reduced motion uses full static story.
**SECURITY / PRIVACY BOUNDARY:** visual interpolation cannot change consent or emergency authorization state.
**WHAT WE DO NOT CLAIM:** synthetic wheel input equals physical trackpad/touch validation.

### 2. Rebuild the spatial grammar, not effects
**DECISION:** a shared stage, meaningful camera shots, architectural occlusion/match continuity, independent human lighting, less simultaneous UI motion. Four reusable worlds remain.
**WHY:** moving between disconnected miniature stages cannot be repaired with bloom or fades.
**FAILURE CASE:** a transition obscures required information or exposes identity at population scale.
**FALLBACK:** complete semantic/readable presentation; hard privacy visibility rule before population output.
**SECURITY / PRIVACY BOUNDARY:** no full-history QR, no public-to-responder privilege escalation, no scroll-granted consent, no individual analytics.
**WHAT WE DO NOT CLAIM:** geometry, maps or a visual seal implement cryptography, official geography or real integrations.

### 3. Asset quality is an acceptance gate
**DECISION:** inspect newer licensed character topology/outfits before committing to the old deformed rig. Build an intentional coherent stylized treatment with proper anatomy and grounded poses.
**WHY:** the existing silhouette itself fails the owner’s stated bar.
**FAILURE CASE:** replacement is unavailable, unsuitable or not legally usable.
**FALLBACK:** explicitly classify the remaining art gap; never call the premium rescue complete solely because all beats render.
**SECURITY / PRIVACY BOUNDARY:** fictional characters, no patient photographs, no official insignia.
**WHAT WE DO NOT CLAIM:** third-party licensed models are commissioned original art or owner-approved visual quality.

## Implementation sequence
1. Baseline motion/profile capture and asset feasibility.
2. Visual follower and deterministic camera rig; tab/resize/deep-link state.
3. Shared stage, composed frames and hero transitions.
4. Characters, lighting, surfaces, architecture and continuum motif.
5. Compact timed HTML, separate mobile direction and existing semantic fallback.
6. Proximity readiness, diagnostics, measured pacing and disposal.
7. Targeted checks during changes; one final regression batch. Inspect all sixteen acts, nine hero moments and forward/reverse motion recording. Report actual tested input/device scope and reject unfinished art.

No backend, domain-policy change, real message, deployment, commit or push is authorised by this rescue.

## 2026-10-16 — additional asset and composition rescue checkpoint

**Status: NOT creatively accepted; NOT a completed quality rescue.** The production build succeeds, but that is not a cinematic verdict.

### Decisions and boundaries

**DECISION:** Replace painted anatomical shirt/trouser subsets with continuous authored implicit-surface garments, exact exposed-skin cuts, normalized rig weights, authored shirt shoulder weights, convex footwear and retained adult heads/hands. Add deterministic Crouch alongside Idle/Sit/Walk. Runtime files: male 494,268 B; female 523,624 B (manifest has current hashes).
**WHY:** Material deduplication initially collapsed identical Skin/Shirt/Pants materials; after that fix, triangle-category cuts and six-pass body-surface smoothing still produced unacceptable cuffs/shoulders. Merely tinting muscular anatomy is not suitable wardrobe.
**FAILURE CASE:** This new procedural wardrobe is still not production character art. Bulky torso silhouettes, shoulder shading, fixed clinician badge attachment, prop grips and pose intersections require further art review. No claim that a generated garment is a commissioned asset or cloth simulation.
**FALLBACK:** Complete semantic reading presentation remains available; this does not excuse shipping weak art as the primary capable-device experience.
**SECURITY–PRIVACY BOUNDARY:** Rendering only. No change to emergency tiers, explicit consent, sealed relationships, family capabilities, aggregation assumptions or real integrations.
**WHAT WE DO NOT CLAIM:** Premium-final art, physical-device performance, WCAG certification, clinical/security/cryptographic validation or owner acceptance.

**DECISION:** Widen the public-minimum shot; crouch the helper; relocate responder away from the fallen patient's body; place the clinical chair against the actual translated sitting hips and orient it to the actor, not the standing origin. Orient illustrative device screens relative to their holder.
**WHY:** Direct screenshot inspection exposed cropped heads, a responder standing over/intersecting the patient, and clothing passing through a mispositioned chair back.
**FAILURE CASE:** Exact hand grip, floor contact, approach gait, reverse transitions and rapid scrubbing are not yet visually validated as motion.
**FALLBACK:** Keep staged presentation disabled if it cannot be made comprehensible/accessibly rendered; never change access permissions to solve presentation problems.
**SECURITY–PRIVACY BOUNDARY:** Devices and credentials remain local fictional illustrations; no notification, scan, verification or permission grant occurs through scrolling.
**WHAT WE DO NOT CLAIM:** Screenshots prove a believable response or that motion is solved.

### Verification actually executed

- `node tools/assets/verify-rescue-humans.mjs`: PASS for both assets: manifest hashes/byte counts, distinct named surface roles, finite attributes, valid indices, normalized weights, four retained clips, no unreachable nodes or animation targets. Evidence: `evidence/rescue/asset-invariants.json`.
- `npm run typecheck`: PASS after latest source edits.
- `npm run build`: PASS; eight static routes generated. No deployment performed.
- Latest all-act screenshot run at 1440×900 and 390×844: no page errors. All sixteen desktop sampled frames inspected across this checkpoint; selected mobile frames inspected. These captures precede the final responder/device/contact-shadow edits and are **not** current-motion acceptance evidence.
- No new full regression suite, accessibility audit, physical-device measurements or production-motion review. Old green test reports concern the rejected version.
- Screenshot sampling cadence is not FPS measurement. `cpuSubmitMs` is not GPU duration; SwiftShader GPU timer unavailable. Do not quote screenshot-report `fps` as device performance.

### Every-act sampled desktop visual review — rejection ledger

| Act | Direct visual finding / outstanding creative gate |
|---|---|
| Opening | Legible statement, but staged walking pose and model-shop street are not a premium opening. |
| Incident | Wider respectful composition; falling anatomy/contact and approach need motion review. |
| Public minimum | Both heads now in frame; crouched helper is clearer. Device aim/grip and physical credential focus remain weak. |
| Verified help | Sample exposed responder overlapping patient; repositioned/crouched afterwards, still needs recapture and motion review. |
| Family alert | Factual copy retained; phone/eye-line staging needs improvement. |
| Ordinary visit | Warm reset readable; architecture and human silhouettes remain too generic. |
| Scoped consent | Chair penetration corrected; clinical garment/badge and gesture quality remain below final-art bar. |
| Federation | Floating toy facilities and stranded peripheral human still read as a diagram/demo, not a cinematic transformation. |
| Sealed relationships | Linked objects understandable, but flat props/ring do not create a strong protected-boundary hero moment. |
| Family capabilities | Characters stand without a convincing interaction; surrounding facilities distract. |
| Emergency summary | Oversized plain panel obscures responder; abstract components lack authored hierarchy. |
| Person to population | Identity absent in sampled population view; toy map/facilities and scale transformation still require rebuilding/review. |
| Aggregation | Two pathways visible; plain blocks/facilities too schematic for cinematic acceptance. |
| Transparency | Sparse blank planes on a line; evidence reveal is not a successful hero moment. |
| Care continues | Humans retained and device removed; essential care gesture still too static. |
| Finale | Two CTAs/disclaimer retained; repeated clinic and floor-line motif insufficiently authored. |

Next substantive gates are still world/prop composition, meaningful gestures, transition/motion review in both directions, mobile direction, then measured adaptive performance and refreshed accessibility/regression tests. Do not conceal these failures with bloom, more cards or effects.


## Final implementation closeout — supersedes the intermediate rejection ledger above

Current facts are in [QUALITY_RESCUE_RELEASE.md](QUALITY_RESCUE_RELEASE.md). The intermediate ledger remains an audit trail, not a description of unchanged source. The additional requested work has now been implemented: physical information staging, coherent facades, linked opaque enclosure, six deterministic care/locomotion poses, relaxed hands, seated furniture fit, chest-bound badges, embedded consent-device feedback, independent portrait shots, bounded camera interpolation, resize-race fix, capture/transition label gating, final disclaimer contrast, geometry simplification and cached low-tier diffuse shading.

Final production build/types/asset invariants/document checks PASS; **82/82 browser tests PASS**. All sixteen desktop/portrait sampled compositions, timestamped extracted native forward/reverse frames, and selected HIGH-tier hero compositions were inspected. 48 axe scans report zero violations with contrast incompletes; synthetic touch/throttling/freeze-resume checks pass. Final evidence is under `evidence/rescue/`. The software profile's worse median versus the old baseline is explicitly retained, not hidden; worst-case intervals improved after optimization.

**Boundary:** implementation delivery is not owner creative acceptance or clinical production readiness. No physical-device FPS/assistive-technology certification and no 60fps claim. Sources are licensed stylized adults and project procedural architecture/wardrobe, not commissioned photorealistic assets. The primary capable-device rendering is genuine real-time3D, never the evidence recording.

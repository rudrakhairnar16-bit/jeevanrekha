# Current cinematic rescue

The authoritative current implementation/evidence closeout is [QUALITY_RESCUE_RELEASE.md](QUALITY_RESCUE_RELEASE.md). The document below is retained as historical implementation detail; its old assets, budgets and test counts do not describe the rescued build.

---

# Real-time cinematic replacement — audit and implementation plan

Authorized by the owner's master task, superseding the section-based visual target. This is not the old nine-phase handoff. Healthcare/backend boundaries remain unchanged.

## Focused audit
- Next.js 16 App Router, React 19, strict TypeScript, npm workspace. Existing routes `/`, `/architecture`, `/walkthrough`, `/status`.
- Inline/local CSS and SVG, bundled Manrope/OFL. No existing 3D models, texture sets, audio, Three.js, animation framework or GPU pipeline.
- Existing page is 14 independent editorial sections with local scroll enhancements. It does not meet the new continuous-film target.
- Preserve semantic English narrative, truthful disclaimers, local consent/privacy/family/protection/evidence demonstrations, accessible controls, licensed font and architecture route. Preserve the previous presentation as a readable story route/fallback.
- Prior final QA is historical: 168 cross-engine tests before final polish; follow-up release tests and 80 axe scans ran. This does not validate a new WebGL experience. Earlier Phase 8/9 handoff was interrupted, not delivered.

## Implementation architecture
1. **Central narrative configuration**: sixteen timed beats (fourteen requested acts, failure, finale); normalized native scroll, deterministic poses, camera keys and world state. No wheel interception or autoplay story clock.
2. **Persistent real-time renderer**: dynamically import Three.js; one canvas, one camera, shared physically shaded material/geometry library. No background video. Imperative Three.js inside React avoids a second reconciler and another animation dependency; native passive-scroll + one queued rAF is the timeline equivalent.
3. **Modules**: narrative/controller, quality selection, camera/state resolver, renderer/world manager, sculpted stand-in actors, emergency/clinical/trust/population world builders and readable HTML overlays. Geometry construction is deferred until proximity. Only visible worlds render; demand rendering stops when scroll stops.
4. **Visual continuity**: persistent human/credential/device/line motif; emergency street → family device → warm consultation → facility architecture → expanded privacy boundary → protected object → aggregate city/district/country silhouette → separated paths → witnessed timeline → human-only failure → restrained identity resolve.
5. **Fallback**: complete existing static narrative server rendered from first response. Reduced motion, explicit reading mode, unavailable WebGL, loading failure or context loss use that readable presentation. No blank loading gate. Mobile has lower DPR, simpler geometry/lights/shadows and a composed smaller canvas.
6. **Assets**: no appropriate existing GLB assets. Create reusable sculpted stylized stand-ins and architectural geometry using lathe/extrusion/instancing; expose replacement slots for reviewed GLB production assets. No externally fetched patient images. Asset optimization formats are not claimed when no texture/model payload exists.
7. **Development debug**: dev-only progress/act/camera/quality/asset inventory and act jumps. Production has no debug panel.
8. **Validation after implementation batch**: production build/types, deterministic forward/reverse/rapid-scroll/resize checks, mobile/reduced-motion/keyboard/no-JS/WebGL-loss tests, console/resource/disposal observations, screenshots of key compositions and GPU timing observations where available. Report software-renderer/hardware profiling limits explicitly.

## Non-goals and acceptance limits
No real APIs, patient data, grants, messages, government affiliations, security certification or new cryptographic protocol. No GLTF compression or texture-memory claims for procedural assets. Stand-in human art is replaceable and must not be represented as commissioned final character art. Visual acceptance and physical-device GPU validation remain distinct from passing code tests.

## Completion pass — authorized after the owner's explicit quality correction
1. Replace capsule/lathe mannequin actors with locally bundled, licensed Quaternius CC0 rigged casual human meshes. Retain only neutral Idle and Walk clips; strip all combat/action clips, deduplicate/quantize and Meshopt-compress offline. Recolor clothing/skin into the existing restrained palette. Pose named bones only from narrative state; never run an autonomous animation clock.
2. Add a real local GLB asset-loading/disposal path. Keep server-rendered reading content visible during loading. A model-load failure uses complete reading mode, not crude mannequin substitution. Clone skeletons but share geometry; dispose all imported resources and abort interrupted loads.
3. Ground the collapsed person and attach scanning/family devices to posed hands. Improve environment scale/details and replace the arbitrary country polygon with an explicitly non-authoritative Natural Earth geographic illustration. Preserve all privacy/safety copy.
4. Add optional GPU elapsed-query sampling where supported, bounded asynchronous queries and explicit unsupported/disjoint reporting; do not equate sandbox software timing with physical GPU performance. Validate quality switching on the same canvas at a deep story position.
5. Final batch: production build/types; full functional suite; all-beat screenshot/axe review, copy-hidden visual samples, asset-failure/no-JS/reduced-motion/context-loss/cleanup; browser smoke. Write a concrete handoff with asset licenses, measured limits and remaining external acceptance gates. No backend, deployment or publication.

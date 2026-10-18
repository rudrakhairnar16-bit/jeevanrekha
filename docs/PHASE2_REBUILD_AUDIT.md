# Phase 2 rebuild audit — 2026-10-16

## Inspected before edits
- `apps/web/app/`, `components/`, local assets, Next config, workspace package manifests, existing CSS and Playwright tests.
- Next.js 16 / React 19 / strict TypeScript; handwritten global CSS, no UI library or animation dependency.
- Local OFL-licensed Manrope; system Georgia; inline SVG brand, locks and arrows. No licensed geographic map asset.
- Layout already sets English language, metadata and a skip link; original CSS has focus, responsive and reduced-motion rules.
- Architecture, status and explicitly static walkthrough routes are useful and should remain.

## Good work to preserve
- Framework, lockfile, local typography, semantic main/heading landmarks, native anchors and meaningful safety copy.
- Fourteen-act narrative, scoped tiers, ordinary-care reset, separate providers, conceptual protection and aggregation limits.
- Native scroll, no-JavaScript baseline, simple mobile reading order, working architecture anchors.
- Tests are useful infrastructure, but passing route/overflow tests did not establish visual quality.

## Failure causes and current conflicts
- Original `story.tsx` uses the same two-column Scene component repeatedly. Uniform section height, boxed panels and headings flatten the narrative.
- Large credential/QR prominence competes with human-care and privacy narrative.
- Original CSS retains both Phase 1 and appended Phase 2 styles. Many tightly packed selectors make layout mistakes hard to identify.
- An interrupted rebuild left a new `page.tsx`, `scene-art.tsx` and `experience.tsx` without their matching CSS. The current route and old styles are inconsistent.
- Interrupted `experience.tsx` contains active consent, caregiver switches and proof buttons. These exceed the requested static Phase 2. Replace them with explicit static compositions.
- Missing relationships: sealed episode must include medication, test and metadata; network must distinguish authorized and expired paths; verified responder needs a limited output with full history locked; population transition needs explicit removal of identity before the facility-signal view.
- Some existing tests use stale headings/link names. Update tests to verify requirements, not merely rewrite expectations to hide regressions.
- Secondary pages lack the skip-link target. Correct while preserving their content.

## Rebuild approach
- Retain framework/assets/route foundation; replace conflicting scene CSS rather than append another override layer.
- Distinct compositions: editorial opening with a small credential; persistent emergency stage; phone notification; typographic reset; annotated consent document; wide distributed network; linked privacy boundary; human permission comparison; component-gated summary; signal field; bifurcated aggregation diagram; static commitment timeline; typographic failure and finale.
- Credential appears only in opening and public emergency stage. Decorative QR bounded to 44px or less.
- No scene hidden until JavaScript runs; no choreography/scroll listeners or new animation dependency. Desktop sticky emergency stage only, normal document flow on mobile.
- Validate production build, types, docs, four viewport widths, JavaScript-off narrative, static controls, SVG/credential sizing, internal anchors and screenshot review. Owner approval remains separate from technical checks.

## Rebuild outcome
- Completed scene-specific CSS and corrected mismatched markup/styles. Preserved foundation and supporting routes.
- Replaced active demo controls with disabled static consent examples, human caregiver comparison and static commitment mismatch.
- Added direct authorized/expired provider exchange, full sealed relationship and both protected contributions from each facility.
- Desktop emergency stage sticky; mobile normal flow. Decorative QR appears twice, rendered approximately 36–41px at checked widths.
- Production build/types pass; 17 browser tests pass. Four viewport widths have zero document overflow.
- Initial axe contrast findings fixed. Final automated scans report zero violations, with contrast manual-review items for effects/glyphs still identified. No certification claim.
- Scene screenshots inspected; four-line mobile finale corrected after visual review. Evidence in `evidence/phase-2-rebuild/`.
- Implementation ready for owner visual review, not presumed accepted. No Phase 3 choreography or clinical services implemented.

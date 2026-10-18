# UI/UX — discussion agenda, not an approved design

Status: **Hybrid Cinematic narrative approved on 2026-10-16**. See the approved storyboard below. Exact typography, component library and detailed layouts remain open.

## What must be decided together

1. **Audience and demo focus:** citizen-first, doctor-first, or a guided multi-role story?
2. **Visual direction:** calm public-health service, modern clinical workspace, or another direction?
3. **Platforms:** citizen/responder mobile-first web; doctor/public-health desktop; confirm priorities.
4. **Language:** Hinglish, Hindi, Gujarati, English; who uses each and how to switch?
5. **Density:** simple citizen cards versus information-dense clinical timeline.
6. **Navigation:** role switching only for an explicitly synthetic demo, never as production authorization.
7. **Consent comprehension:** category labels, requester evidence, duration, refusal and expansion.
8. **Privacy:** shared devices, caregiver views, lock-screen text, masking and discreet exit.
9. **Emergency speed:** scan entry, verifiability, offline explanation, identity confidence and stale warnings.
10. **Accessibility:** readability, touch sizes, keyboard and screen-reader behavior.

## Screen inventory to discuss

| Role | Candidate screens | Most important question |
|---|---|---|
| Citizen | Enrollment, home, timeline, consent inbox/detail, family permissions, emergency setup/preview, credentials, access history | Is control understandable without medical/security expertise? |
| Doctor | Login, match patient, request scope, permitted timeline, source record, emergency request | Is withheld/unavailable information represented safely? |
| Public scanner | Minimal flags, help/call action, alert confirmation, offline fallback | Is it immediately clear what is and is not known? |
| Responder | Scanner, verification state, confidence, authorized summary | Can a stressed user distinguish stale/unverified data? |
| Public health | Trend, coverage/freshness, release details, review alert | Could missing data be mistaken for low disease? |
| Security reviewer | Review queue, event detail, proof state, investigation outcome | Is a risk flag distinguished from confirmed misuse? |

## Required states for every relevant screen

Loading; empty; ready; pending; denied; expired; revoked; offline; partial source failure; stale; unverified; error; delivery unknown. Do not use one generic green success state for different guarantees.

## Safety copy principles

- “Permission ends at …” rather than implying past copies disappear.
- “Reminder not acknowledged” rather than “Patient definitely missed medicine.”
- “Emergency alert triggered” rather than “Accident confirmed.”
- “Some sources unavailable” rather than “No prior history.”
- “Synthetic demo — registry verification simulated” wherever mock trust could be mistaken for real trust.
- Do not reveal a sealed compartment exists through a special badge shown only to selected patients.

## Discussion output

After owner review, record visual direction, language and role priorities here with the date. Add a small design-token/component specification only then. No speculative mockups or implementation until the owner asks.

---

# Approved direction — Hybrid Cinematic (2026-10-16)

The owner has selected the following landing-page direction. This supersedes the earlier **visual direction pending** status, but does not authorize application implementation or approve the proposed technical stack.

**UX thesis:** Don't tell people how JeevanRekha works. Let them experience why every boundary exists.

## Visual language

- Dark emergency → warm clinical care → distributed network → privacy transition → dark national-intelligence finale.
- Navy = protection/trust; warm ivory = human care; teal = authorized flow; muted grey = locked/unavailable; red = genuinely critical warnings only.
- Oversized editorial headlines, clean readable UI text, deliberate whitespace. Information containers only where needed, not cards for every paragraph.
- Desktop: sticky cinematic stage with native scroll-linked transitions. Mobile: same narrative in simpler stacked scenes and lighter transitions.
- No scroll hijacking, mandatory video, blank loading screen, strobing glitch or fake government branding. No Ashoka emblem, ministry seal or partnership badge without authorization.
- Every motion carries meaning: glow = authorization; lock = restricted; split = secret shares; expiring line = permission expiry.

## Complete storyboard and implementation acceptance

| Act | Copy / narrative | Visual and scroll behavior | Acceptance |
|---|---|---|---|
| I — When you cannot speak | “Jab aap bol nahi sakte, zaroori jaankari bol sake.” JeevanRekha / “Right information. Only when it matters.” | Near-dark navy; subtle abstract pulse; emergency credential emerges. One “Scroll to experience ↓” cue; no cluttered navbar or multiple hero buttons. | Hero text immediately readable before motion initializes. |
| II — The emergency | “A QR is not a key to your medical life.” | Credential remains centered while location marker, stopped journey line and responder context move around it. Scanner enters; PUBLIC — TIER 0 shows chosen allergy and communication warnings. | Blood thinner is responders-only; history and sealed records remain locked. No graphic accident imagery. |
| III — Verified help | Public → minimum; responder → emergency-relevant; hospital → justified break-glass. | Credential and verified-responder indicators connect; only minimum summary opens. | Clearly simulated verification; no implication QR possession alone authorizes access. |
| IV — Family | “Emergency credential triggered” / “14:32” / “Approximate location available”. “No payment. No OTP. No banking request. Ever.” | Dark scene warms; family phone enters. | No accident-confirmed claim, no real alert, no real location or phone data. |
| V — Explicit reset | “Emergency access is exceptional.” Then “Now imagine an ordinary hospital visit.” | Navy becomes warm ivory; pulse becomes calm interface. | Normal consent is clearly a different scenario, not assumed consent from an unconscious patient. |
| VI — Doctor access | Dr. Sharma / XYZ Hospital; labs + previous prescriptions; current treatment; 2 hours. “Identity ≠ Permission.” | Clear ALLOW and DENY; only allowed categories illuminate. Other records remain restricted. | Both choices are meaningful in the illustrative interaction; no real authorization granted. |
| VII — Where is my data? | “Not here.” “Your records stay distributed. Permission travels instead.” | Central-database misconception separates into Hospital A, Lab B, Hospital C and Diagnostic Centre D. JR becomes Trust & Access Layer; authorized path lights, a permitted record travels, path expires. | Explain federation honestly: records do move during authorized exchange; no claim data never leaves providers. |
| VIII — Sealed means sealed | “Hiding the diagnosis isn't enough.” Protect linked sensitive records too. | Frosted sensitive episode; related medicine attempts to leave then joins the same privacy boundary. | Explicitly illustrative, not evidence of universal automatic detection. No real sensitive diagnosis needed. |
| IX — Family without surveillance | “Help me remember my medicine.” ✓ / “See my entire medical history.” ✕. “Care without surveillance.” | Split view; capability control separates reminders from history. | Reminders-only selection cannot visually imply full-record access. |
| X — Bank locker | “Centrally available when seconds matter.” “Not centrally readable by default.” | Credential and protected-service fragments approach encrypted summary; authorized responder context is required. “How this works →” opens architecture detail. | State conceptual/review-required construction. No absolute server-compromise protection claim. |
| XI — Public-health transition | “See the pattern. Not the person.” Vadodara District / respiratory ↑ / coverage 81% / confidence medium / unusual trend / investigation recommended. | Individual view gives way to facility-generated protected signals and India map. | All figures labelled illustrative. Fading identity is a storytelling metaphor, not proof of anonymization. No individual tracking line across map. |
| XII — Secure aggregation | “Hospitals contribute to the signal without exposing their individual patient lists.” | Two separate aggregation paths, A and B; unreadable shares combine into protected district output; privacy controls precede dashboard. “Explore secure aggregation →”. | Explain non-collusion assumptions; educational animation is not validated VDAF or a differential-privacy guarantee. |
| XIII — Transparency | “Trust shouldn't require ‘trust us.’” “Important access leaves verifiable evidence.” | Consent granted, emergency access and result published join commitment timeline. Simulated edit is detected by proof/witness state. | Tampering is detectable under the model; do not claim all deletions or unlogged accesses are impossible. Public evidence contains no medical relationships. |
| XIV — Technology failure | Internet OFFLINE / server UNAVAILABLE / phone DAMAGED. “CARE CONTINUES.” “JeevanRekha assists healthcare. It never becomes permission to receive healthcare.” | Gentle status interruption, not flashing glitch; clinician/responder remains present. | Care-continuity message stays readable, especially with reduced motion. |
| Finale | JEEVANREKHA. Right Person. Right Data. Right Reason. Right Time. “And never more than necessary.” | Person, clinician, responder, family, facilities and map resolve into a simple JeevanRekha mark. | Exactly two main finale CTAs: Experience the Prototype; Explore the Architecture. Visible “Concept / prototype — not an official government service.” |

## Accessibility and performance requirements

1. Semantic sections and headings preserve all narrative without JavaScript. Progressive enhancement only.
2. Native wheel/touch/keyboard scrolling; no forced autoplay navigation. Sticky visuals must not obscure text or keyboard focus.
3. `prefers-reduced-motion` removes parallax, zoom, scan sweeps and scene pinning where needed. All content and controls remain available.
4. Provide readable contrast, visible focus, comfortably sized touch targets and labelled controls. Do not communicate permission by color alone.
5. Mobile layouts avoid horizontal overflow and excessively tall empty pinned scenes. Test short viewports and zoom.
6. Use lightweight SVG/CSS first; 3D/video is not a requirement. Measure frame behavior and asset weight before adding expensive effects.
7. Do not fire announcements on every scroll tick. Decorative diagrams are hidden from assistive technology; essential information has text equivalents.
8. No network-dependent fonts/images required for first readable content. Static fallbacks available for unavailable graphics.
9. No actual emergency calls, messages, geolocation prompts or medical-data uploads from the landing-page story.

## CTA behavior and information safety

- Experience the Prototype: link to a working synthetic prototype only once available. Until then explicitly open a clearly labelled illustrative walkthrough; never a dead button or a fake live portal.
- Explore the Architecture: accessible local architecture explanation. Link to detailed docs where appropriate; no fabricated certification badges.
- Advanced links explain reviewed assumptions and limitations from SECURITY.md.
- India map: use a properly licensed, jurisdictionally appropriate map source before implementation. Do not casually invent national boundaries.
- Locked clinical category names in the story are generic educational examples, not patient-specific disclosure of hidden records.

## Remaining design choices

Exact typography, mark, visual tokens, language balance, illustration style, motion timings, map asset, wireframes and CTA destination behavior still require design/implementation review. The narrative and hybrid direction are approved; these details are not silently assumed.


## Language update — owner decision
All landing-page public copy must be English for a national-level hackathon. Hero: “When you cannot speak, let vital information speak for you.” This supersedes the Hinglish hero in the storyboard. Conversation and historical specifications need not be translated.

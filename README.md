# JeevanRekha

**PS000134 · VCCI · Solo registration: 1 member (Rudra Khairnar).**

**Trust, consent, emergency, family-safety and public-health intelligence around India's existing digital-health ecosystem.**

🎬 **Official Competition Pitch Video:** [Watch on Google Drive](https://drive.google.com/file/d/1hZtytfPcHI_JkimQCdirmtKLVQxWqRNa/view?usp=sharing)
🌐 **Live Deployed Prototype:** [https://jeevanrekha-delta.vercel.app](https://jeevanrekha-delta.vercel.app)

> Right Person. Right Data. Right Reason. Right Time. And never more than necessary.
> **Care is never denied because JeevanRekha failed.**

Updated: **2026-10-16**. **Real-time 3D cinematic prototype implemented; owner visual acceptance and physical-device review remain separate gates. No clinical backend.**

The latest authorized master task supersedes the section-based visual target. `/` now uses one persistent Three.js canvas, sixteen centrally timed beats and four reusable worlds. Native scrolling supplies deterministic story time; there is no wheel hijack, background video or perpetual animation loop. `/story` preserves the previous presentation. No-JavaScript, reduced-motion and unavailable/context-lost WebGL users receive the complete server-rendered reading experience.

Current rescue closeout: [QUALITY_RESCUE_RELEASE.md](docs/QUALITY_RESCUE_RELEASE.md).

Start with [the cinematic audit/plan](docs/CINEMATIC_IMPLEMENTATION.md) and [the implementation/validation handoff](docs/CINEMATIC_HANDOFF.md). Locally bundled CC0 rigged human meshes replace the assembled mannequin figures; architecture and props use stylized procedural geometry. This is **not photorealistic or commissioned character art**. Historical phase reports do not certify this renderer. All health examples remain synthetic and local-only.

## Read in this order

| File | Purpose |
|---|---|
| [AGENTS.md](AGENTS.md) | Short project instructions for coding agents; detailed docs loaded only when needed |
| [docs/PROGRESS.md](docs/PROGRESS.md) | Current state, blockers and exact next action |
| [docs/SYSTEM_E2E.md](docs/SYSTEM_E2E.md) | Owner's 70-part requirements baseline |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Existing 48 ADRs: context, alternatives, consequences and architectural history |
| [docs/FLOWS.md](docs/FLOWS.md) | Existing 25 flows, diagram source, event catalogue and failure paths |
| [docs/MVP_SCOPE.md](docs/MVP_SCOPE.md) | What the synthetic prototype includes, mocks and excludes |
| [docs/SECURITY.md](docs/SECURITY.md) | Engineering corrections, threat model, mandatory controls and production gates |
| [docs/TECH.md](docs/TECH.md) | Proposed stack, service boundaries and future repo layout |
| [docs/DATA_MODEL.md](docs/DATA_MODEL.md) | Data ownership, entities, states and invariants |
| [docs/API_CONTRACTS.md](docs/API_CONTRACTS.md) | Proposed endpoint behavior and contract conventions |
| [docs/TEST_PLAN.md](docs/TEST_PLAN.md) | Acceptance tests A01–A34; none implemented yet |
| [docs/BUILD_PLAN.md](docs/BUILD_PLAN.md) | Review gates and dependency-ordered T01–T32 |
| [docs/UIUX_DISCUSSION.md](docs/UIUX_DISCUSSION.md) | Approved Hybrid Cinematic storyboard; detailed design choices pending |

## Tooling and configuration

- [CLAUDE.md](CLAUDE.md): imports shared AGENTS instructions, avoiding duplicate rules.
- [.env.example](.env.example): planned synthetic/local configuration, no usable secrets.
- [.gitignore](.gitignore): excludes secrets, dependencies, runtime data and development keys.
- [tools/check_docs.py](tools/check_docs.py): local Markdown file-link and fence checks.
- [.github/workflows/docs.yml](.github/workflows/docs.yml): runs documentation checks only; GitHub execution has not been observed.

Run the check now:

```bash
python3 tools/check_docs.py
```

## Run the landing-page story

Requires Node >=20.9. From the repository root:

```bash
npm ci
npm run dev
# separate terminal
npm run typecheck
npm run build
npx playwright install --with-deps chromium
npm run test:e2e --workspace apps/web
```

Dev server binds 0.0.0.0:3000. Browser tests expect the dev server to be running. Routes: `/`, `/architecture`, `/status`, `/walkthrough`. No external font CDN, live identity integration or backend required. Screenshot evidence is in `evidence/`. Font license is bundled in `apps/web/public/fonts/OFL.txt`. Phase 3 uses native scroll plus requestAnimationFrame/CSS; no new animation dependency. Run `node tools/capture_landing.cjs` to refresh viewport and scene screenshots against the running server.

Rebuild verification: production build, typecheck, 56 Playwright Chromium tests, documentation check. Automated axe-core checks at 1440/768/390/320 widths; reports and screenshots in evidence/phase-2-rebuild. Automated checks do not establish accessibility certification or visual acceptance. Current closing screenshots and accessibility report are in evidence/phase-7; protection/population evidence remains in evidence/phase-6; distributed-trust/privacy evidence remains in evidence/phase-5; routine-care/consent screenshots remain in evidence/phase-4; emergency revision screenshots remain in evidence/phase-3-revision. See docs/PHASE2_REBUILD_AUDIT.md for the prior rebuild audit.

## Approval and safety status

The end-to-end vision is the owner's baseline. Proposed stack and new implementation defaults are **not yet approved**. Accepted ADRs preserve history, but **SECURITY.md identifies several claims requiring correction** before implementation. Prior blanket claims of perfect consistency or production readiness must not be used as engineering evidence.

Specialist review is required for emergency cryptography, verifiable aggregation/differential privacy, and Indian healthcare/privacy legal policy. Only fictional identities and medical records are permitted in the prototype. All real external services remain mocked until separately authorized.

## Change process

1. Cite a task ID, ADR and flow for each implementation change.
2. New decisions supersede old ADRs; never silently rewrite accepted history.
3. Update contracts, tests and progress alongside behavior.
4. Keep one source of truth per topic: BUILD_PLAN replaces duplicate todo/prompt-plan files.
5. Discuss UI/UX before choosing colors, typography, layouts or a component library.

Owner: Rudra Khaire.

## Competition demo routes

- 🎬 **Video Pitch (Drive):** https://drive.google.com/file/d/1hZtytfPcHI_JkimQCdirmtKLVQxWqRNa/view?usp=sharing
- `/demo` — evidence-first jury proof using synthetic data.
- `/demo?autoplay=1&clean=1` — recording-ready automated proof.
- `/demo?mode=full` — complete system story.
- `/beastmode` — direct route to the complete competition showcase.
- `/prototype` — manual interactive workspaces.
- `/walkthrough` — guided narrative chapters.

See `docs/DEMO_DIRECTOR.md` for evidence boundaries and release gates.

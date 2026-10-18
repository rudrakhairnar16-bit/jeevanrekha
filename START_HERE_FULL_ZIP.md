# JeevanRekha — full project archive

Includes all application source, runtime assets, original asset-authoring sources,
licenses, documentation, tests, tools and the complete existing evidence folder
(including screenshots, recordings, reports and logs).

Only dependency installations, generated build/cache directories, Git internals,
TypeScript build caches and private environment/credential files are excluded.
These are not needed to retain the project source and evidence.

## Run
Requires Node.js 20.9+ and npm. From this folder:

    npm ci
    npm run dev

Open http://localhost:3000.

Production:

    npm run build
    npm run start --workspace apps/web

See README.md and docs/QUALITY_RESCUE_RELEASE.md for scope, setup and limitations.
Historical evidence is retained; not every report describes the final release.
The painted-contrast follow-up was interrupted before completion and must not be
interpreted as a completed assessment. The app source remains the validated
frontend release. No backend, real integrations or deployment is included.

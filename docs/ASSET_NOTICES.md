# Cinematic asset provenance and notices

## Current rescue human meshes (not final-art accepted)

- Creator: Quaternius. Universal Base Characters Standard (Superhero adult male/female), hairstyles and Universal Animation Library Standard. CC0 sources and included licenses are retained under `assets/source/universal/`.
- Official sources: https://quaternius.com/packs/universalbasecharacters.html and https://quaternius.com/packs/universalanimationlibrary.html.
- Reproduce: `node tools/assets/build-rescue-humans.mjs`; verify: `node tools/assets/verify-rescue-humans.mjs`. Current bytes/hashes are authoritative in `assets/rescue-human-manifest.json`: male 506,540 B; female 532,324 B.
- Adaptations: locally authored implicit-surface wardrobe, exact skin cuts, rig-weight interpolation/authored shirt weights, closed convex footwear, local-rest animation retargeting and hair rig remapping. Retained Crouch/Kneel/Idle/Talk/Sit/Walk are sampled deterministically; there is no narrative animation clock.
- These are adapted licensed assets and procedural project garments, not commissioned production character art. The shipped sophisticated-stylized treatment remains subject to owner visual acceptance; it is not photorealistic. Geometry is error-bounded simplified before Meshopt compression. No paid pack was purchased; compatible fantasy outfits were not used. No source textures or remote asset requests ship in these runtime GLBs.

## Historical rigged human meshes (superseded runtime)
- Creator: **Quaternius**. Original pack: Ultimate Animated Character Pack (November 2019).
- Author's pack/license page: [1](https://quaternius.com/packs/ultimatedanimatedcharacter.html). License: CC0 1.0 Universal; full legal text retained in `assets/licenses/CC0-1.0.txt`.
- Local source copies downloaded from `https://cdn.cinevva.com/assets/packs/quaternius/ultimate-animated-characters/Casual_Male.glb` and `Casual_Female.glb`. Runtime never contacts that CDN.
- Reproduction: `node tools/assets/optimize-humans.mjs`. Original source bytes and source/runtime hashes are in `assets/human-optimization.json`.
- Runtime GLBs: male **172,512 bytes**, female **173,132 bytes**. Only Idle and Walk clips retained. Other clips and orphan samplers/accessors removed. Meshopt compression, quantization and deduplication; no image textures or external buffers.
- Project adaptations: adult proportions, restrained hair/skin/clothing palette, suppressed cartoon eye marks, trouser/shoe treatment, neutral medical badge, deterministic bone sampling and hand anchors. These are adapted licensed meshes, **not commissioned original character art**. No clock-driven idle/animation playback.
- Imported skins retain their per-mesh inverse-bind matrices. Do not deduplicate skeletons solely by bone names: quantized primitive skins can have different inverse binds.

## Geographic illustration
- India outline: Natural Earth 1:110m admin-0 geographic dataset, public-domain data. Source: `https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson`.
- Terms: `https://www.naturalearthdata.com/about/terms-of-use/`.
- Extracted source feature retained in `assets/source/india-natural-earth.json`; transformed local coordinates in `components/cinema/geography.ts`.
- Gujarat highlight is artist-authored schematic geometry, **not surveyed administrative data**. Natural Earth geography is not an official Indian boundary reference. The experience explicitly discloses schematic/non-authoritative scale illustrations. Review cartographic requirements before publication.
- All district numbers and facilities remain fictional, not derived from public-health feeds.

## Other assets and code
- Street, clinic, furniture, document/device props and trust/population visualizations are project procedural geometry; contact-shade texture is generated locally at 128×128.
- Three.js is MIT licensed; notice retained in `assets/licenses/THREE-MIT.txt`.
- Manrope remains locally served with OFL notice at `apps/web/public/fonts/OFL.txt`.
- No stock patient photos, video, music, remote fonts, official insignia or government branding are used.

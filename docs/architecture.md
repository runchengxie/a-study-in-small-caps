# Architecture and authoring

The site is static Astro with small client-side modules. No backend, external search service or credentialed data API is required. UI copy lives in `src/data/ui.json`; research records and evidence identities are language-neutral, with English and Chinese reader text.

- `src/data/research.json`: investigations, papers, claims, cross-checks, sources and history.
- `src/data/evidence.json`: deterministic chart projections of reviewed public snapshots.
- `public/evidence/`: exact upstream public source bytes, bound to SHA-256 records.
- `src/lib/research.mjs`: reference validation, bilingual search and evidence selectors.
- `src/components/`: reader navigation, search, source disclosures and chart interaction.
- `src/pages/`: overview, investigation routes, evidence, literature, history and methods.

## Add an investigation

Assign a stable ID and slug, bilingual question/summary/conclusion, evidence stage and dated source IDs. Write sections as a connected investigation, then add limitations and next tests. Link related papers and claims. Append a history event when the evidence or interpretation changes. Preserve failed findings and explain superseded scope.

Run `npm test` and `npm run build`; dangling references or duplicate IDs fail validation. Do not silently edit frozen upstream editions or upgrade review stages. A paper metadata entry can be useful without full text; keep that limitation visible.

## Update evidence

A new public source requires review and permission for its exact scope. Preserve bytes and register a SHA-256 source identity before deriving chart rows. Reconcile units, dates, denominators, universe and missing values. Never reconstruct a NAV curve from a few return/risk summaries.

NAV curves and early risk summaries use different samples. The liquidity explorer uses source-median lagged ADV20 across common dates; within-market quintiles and absolute dollar buckets answer different questions. The interface keeps those identities separate.

The website's evidence refresh is deliberate, not a production scheduled data job. Research results and raw data use the configured external data root. See the publication boundary before adding outputs.

## Runtime and verification

GitHub Pages uses `/a-study-in-small-caps/`. Browser checks use a dedicated local port and foreground preview; Astro's agent-inferred background mode is disabled by `--ignore-lock`. Tests launch Chromium with GPU disabled. This is a test setting, not a user browser configuration change.

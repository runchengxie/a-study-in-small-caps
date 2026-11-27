# Project boundaries

A Study in Small Caps is a public, static, bilingual research publication. Investigations, literature cross-checks and source identity live here. Raw vendor data, credentials, machine paths and private strategies do not.

Use a task branch and isolated worktree under the configured CODE_ROOT. Follow workspace Git/PR/merge and data-root rules. Do not alter frozen upstream report editions or silently upgrade evidence stages.

Validation: `npm test`, `npm run build`, `npm run test:e2e`, `git diff --check`. Node tests validate content references, bilingual search, source integrity and chart selectors; the build validates published paths and public boundaries; browser tests cover locale, filters, charts and responsive access.

English is the default locale. UI strings are in src/data/ui.json. Structured record IDs and source data are language-neutral. Review dates and data cutoffs are distinct. Publish only reviewed aggregate assets with source hashes; no BMLL security-level pilot results.

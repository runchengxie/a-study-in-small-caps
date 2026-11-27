# Research expansion

This task extends the existing publication with a research atlas, reviewed source charts, actual full-text reading notes and reproducible historical diagnostics. It also moves application modules to TypeScript and adds persistent accessible theme controls and a WebGL homepage illustration with a static fallback.

## Evidence requirements

- Preserve source revisions, byte hashes, sample dates and original evidence stages.
- Separate historical illustrations, diagnostic recomputations and independent replication.
- Do not publish raw vendor or security-level BMLL pilot data.
- Record full-text editions and page references; publish original reading notes rather than source PDFs.
- Label illustrative graphics as illustrations rather than market measurements.
- Use China A-shares and Hong Kong, China equities consistently in display copy; preserve machine codes.

## Verification

Run type checking, content/reference and aggregate calculations tests, production build, browser interaction tests and whitespace checks. Browser checks cover both locales, theme persistence, reduced motion and WebGL fallback, chart filters and responsive navigation. Validate the integrated branch against current main before merging through a PR.

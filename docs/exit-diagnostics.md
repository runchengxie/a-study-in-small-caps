# Exit diagnostics

INV-007 links to the merged research provider at revision 94b921a577d1514183e01100e4b51b1f72946060. Its public cost calculator is an arithmetic scenario with hypothetical inputs, not a projection of private BMLL observations. It uses one full quoted spread per complete round trip. The bar scale remains fixed across slider changes.

INV-006 adds a diagnostic of the existing frozen 400-stock NAV. `src/lib/exit-delay.ts` finds the first threshold crossing using a running peak within the explicit 2023-12-29 to 2024-03-29 interval, then labels the subsequent 1, 3 or 5 retained-observation change. The thresholds are 5%, 10% and 20%. The retrospective choice of period and thresholds is visible. These are endpoint changes in a reconstructed series; the calculation has no intraday prices, order policy or available bids. It cannot rank stop-loss policies or represent executable proceeds.

The unchanged NAV bytes retain SRC-NAV provenance and hash. Tests independently assert the January 29 threshold and February 5 endpoint, plus a synthetic no-lookahead example and missing outcomes. Run `npm test`, `npm run check`, `npm run build` and `npm run test:e2e`. Language catalogs and theme chart tokens cover the new interactions. Private US outputs are not copied into the site.

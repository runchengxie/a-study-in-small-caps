# Visual design

The publication uses warm paper and brown ink in light mode, and coffee surfaces with cream text in dark mode. Copper accents connect the homepage wave to article headings, navigation and evidence callouts. The wave retains its original geometry, pointer response, lateral motion and rendering workload.

## Site review

The cover uses a large sans-serif title and viewport-sized negative space. Articles retain serif headings, a narrower reading column and visible evidence boundaries. Cards and tables use fine rules rather than heavy shadows. These different layouts serve the cover and long-form reading while sharing the same colour tokens.

Body text, muted text, card borders, form borders and callout surfaces now use the warm theme palette. The favicon and browser theme colour follow the same direction. Risk comparison bars and the NAV axis use theme tokens instead of fixed light-mode colours.

Charts retain their established positive/negative colour semantics, numerical labels and exact-data tables. Chinese defaults to red-positive and green-negative; English defaults to green-positive and red-negative. Readers can override this independently of language. Decorative surfaces use warm neutrals. No research values or evidence classifications changed.

## Checks and limits

Reviewed both cover palettes and a representative investigation page visually. Checked headings and 390-pixel viewport overflow on the investigation, evidence, atlas, literature, history and methods routes in both themes. Checked nine text/background token pairs per theme at a minimum contrast of 4.5:1. This checks the selected solid-colour combinations, not every pixel over the moving particle field or a full accessibility audit.

Browser coverage also exercises the theme switch, context restoration, pause controls, language changes, title typography and chart interaction. Original third-party source snapshots remain unchanged; the integration palette is documented in [the source record](particle-wave-source.md).

## Chart colour preferences

Each chart group exposes a compact legend and an expandable colour setting. `language` follows the selected locale; `red-up` and `green-up` persist independently in local storage. All visible selectors stay synchronized. If storage is unavailable, selection still works for the current page. The preference changes CSS tokens only and never data or calculations.

NAV levels, liquidity, turnover, coverage and diagnostic loss-frequency bars use a separate neutral series colour. In the atlas, annual returns use signed colours and maximum drawdown uses the loss colour regardless of how its magnitude is stored. Other atlas metrics remain neutral. Monthly returns include explicit positive signs; zero is neutral. Chart labels, keyboard readouts and exact tables remain available.

Browser checks cover locale defaults, manual override, restoration after navigation, synchronized selectors, dark-mode colours, invalid/blocked storage and neutral metric semantics.

## Reading layout shared with the personal site

Investigation articles use a centred 45rem reading column, approximately 17px serif body text and sans-serif section headings. The title aligns with that column. The section navigation sits outside the column on wide screens and becomes an inline index on smaller screens. Interactive evidence remains full width.

The homepage investigation directory and the investigations index use rule-separated article rows. Each row preserves the stable investigation ID, evidence stage, current conclusion, date and chapter link. These replace boxed chapter cards while keeping key findings and evidence limitations visually distinct. This borrows reading conventions from the personal publication without introducing a runtime dependency.

# Particle wave source

The homepage directly adopts Enrichr's published **Particle wave hero** source from [the author’s machine-readable export](https://enrichr.dev/elements/particle-wave-hero.json), associated with [the requested CodePen](https://codepen.io/Enrichr-Dev/pen/ogZJMJp). It replaces the earlier custom terrain imitation. This is the author's vanilla WebGL export, not a claim that it is a byte-identical copy of the CodePen runtime.

The unchanged export fields are retained under `public/third-party-notices/enrichr/`, with SHA-256 digests and the exact preview licence. The source is used under that stated licence; no MIT licence is asserted for this export. The visible attribution links to Enrichr without adopting its logo or suggesting a partnership.

`src/vendor/enrichr/particle-wave.js` preserves the shaders, 32,000-particle distribution, additive blending, camera, pointer ray, scroll easing, and text transforms. Its explicit JavaScript type-check exception keeps the original author source reviewable; `particle-wave.d.ts` and `src/lib/terrain.ts` provide the strictly typed integration boundary. The author CSS is unchanged.

Local changes to the JavaScript are limited to the ES module export, translated corner labels, pause/live reduced-motion controls, stopping animation scheduling while hidden or offscreen, and context restoration/cleanup. The publication adapter supplies its bilingual title and caption. The markup uses an h1, decorative canvas, a research anchor, pause control and author credit. Shell CSS fits the existing viewport below navigation, removes the standalone card radius and keeps the research link accessible on small screens. The hero retains the author's emerald palette in both publication themes; the research body keeps the selected theme.

Validation: `npm test`, `npm run check`, `npm run build`, `npm run test:e2e`. Browser tests exercise rendered output, scroll text transforms, pointer output, pause, live motion preferences, context loss/restoration, translation and viewport fit.

# Wave Themes Implementation Plan

**Goal:** Match the wave to the publication theme and add gentle rightward motion.
**Architecture:** Extend the existing typed adapter and renderer options, keeping one canvas. Observe the resolved document theme; update colours without recreating buffers.
**Tech Stack:** Astro, TypeScript, WebGL, Playwright.
**Spec:** ../specs/2026-11-27-wave-themes-design.md

## Global Constraints

Preserve source snapshots, attribution, particle count and one draw per frame. Respect paused and reduced-motion states.

## Review Focus

Verify paused theme switches redraw once, system preference updates the wave, context recovery retains the palette, fallback text stays readable and mobile layout fits.

## Implementation

- [x] Extend `WaveOptions` with theme palette/blending options; add lateral phase offset in the existing vertex shader and theme-specific blending in draw.
- [x] In `src/lib/terrain.ts`, observe `data-theme` and update the same instance. Disconnect observer at teardown.
- [x] Add light text/fallback styles in `src/styles/global.css`; retain original author CSS.
- [x] Update browser coverage for light/dark/system, paused switches and recovery. Inspect screenshots in both modes. Run unit tests, typecheck, build, browser suite and diff check.
- [ ] Update provenance explanation, commit, verify remote checks and publish through PR.

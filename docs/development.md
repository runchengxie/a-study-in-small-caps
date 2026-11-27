# Development and configuration

[简体中文](development.zh-CN.md)

Run commands from the repository root with Node.js 24 or newer.

```sh
npm ci
npm run dev
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The development server prints the complete URL, including `/a-study-in-small-caps/`. `npm run preview` serves the production build after `npm run build`. Browser tests start their own preview on port 4381; keep that port free. Set `PLAYWRIGHT_EXECUTABLE_PATH` to use an installed Chromium executable.

## Configuration

- `configs/astro.config.mjs` sets the public URL, project path and React integration. npm scripts pass its location explicitly.
- `configs/playwright.config.mjs` defines browser checks. Test paths are relative to this file; the preview command runs from the repository root.
- `configs/tsconfig.json` contains TypeScript settings. The root `tsconfig.json` is a discovery entry that extends it so Astro and editors find the same project. Include/exclude paths are relative to `configs/`.
- `package.json` and `package-lock.json` remain in the project root, where npm discovers the project and locks its dependencies.

Use the npm scripts rather than bare `astro` or `playwright test` commands, which would search for their configurations in the default locations. GitHub Actions uses these same scripts.

## Checks and publication

The build validates content references, source hashes, public-data boundaries and local links. Browser checks cover language switching, charts, responsive layouts and animation controls. Pull requests run checks; successful pushes to `main` publish the static site to GitHub Pages.

Research inputs, vendor records and credentials remain outside this repository. Shared data is owned by `quant-market-data-platform`, general execution by `quant-platform`, and private strategies by `quant-research`. Original fixed report editions remain in `quant-market-research`. This project maintains the ongoing investigations and literature comparisons. See [publication boundaries](publication.md).

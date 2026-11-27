# A Study in Small Caps

[简体中文](README.zh-CN.md) · [Read the research](https://runchengxie.github.io/a-study-in-small-caps/)

An ongoing cross-market investigation of small-cap returns, risks, liquidity and implementation. Each investigation connects a question to evidence, literature, limitations and the next test. Failed checks and revised conclusions remain part of the record.

The first edition contains three investigations, interactive historical risk and cross-market liquidity views, five source-checked literature leads, and a research/claim history. It reorganizes existing reviewed public research; it does not add market observations or certify executable returns. Literature leads are not full-text reviews or replications.

## Develop

Requires Node.js 24 or newer.

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The build validates content references, exact source hashes, public-data boundaries and project-base paths. GitHub Actions runs the checks and deploys `main` to GitHub Pages.

See [architecture and authoring](docs/architecture.md), [source provenance](docs/source-provenance.md), and [publication boundaries](docs/publication.md).

Research inputs, raw provider data and credentials remain outside this repository. Shared data governance belongs to `quant-market-data-platform`; general execution to `quant-platform`; private strategies to `quant-research`. Original report editions remain upstream in [`quant-market-research`](https://github.com/runchengxie/quant-market-research). This project owns the new ongoing investigations and literature cross-checks; the Factor Observatory links reviewed projections.

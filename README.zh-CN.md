# A Study in Small Caps

[English](README.md) · [阅读研究专题](https://runchengxie.github.io/a-study-in-small-caps/)

持续更新的跨市场小微盘研究：收益、风险、流动性与可交易性。每次调查从一个问题出发，连接证据、文献、局限和下一项验证。未通过的核查与被修正的结论也保留在记录中。

首版包含三篇调查、历史风险与跨市场流动性的互动视图、五条已核对出处的文献入口，以及研究和结论历史。它重新组织已有审核公开研究，没有新增市场观察，也不能认证可实现收益。文献入口不等于已读全文或已复现。

## 本地运行

需要 Node.js 24 或更新版本。

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

构建校验内容引用、来源文件精确哈希、公开数据边界和项目路径。GitHub Actions 完成检查后，将 `main` 部署到 GitHub Pages。

详见[架构和写作流程](docs/architecture.md)、[来源说明](docs/source-provenance.md#来源说明)和[发布边界](docs/publication.md)。

研究输入、供应商原始数据和凭据保留在仓库外。共享数据治理归 `quant-market-data-platform`，通用执行归 `quant-platform`，私有策略归 `quant-research`。原固定报告继续保存在 [`quant-market-research`](https://github.com/runchengxie/quant-market-research)。本项目维护新的持续调查和文献对照；因子 Observatory 链接审核后的投影。

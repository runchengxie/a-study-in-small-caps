# 小微盘研究

[English](README.md) · [阅读研究专题](https://runchengxie.github.io/a-study-in-small-caps/)

持续更新的跨市场小微盘研究：收益、风险、流动性与可交易性。每次调查从一个问题出发，连接证据、文献、局限和下一项验证。未通过的核查与被修正的结论也保留在记录中。

专题汇集独立调查、可搜索的既有研究档案、历史与跨市场互动图表、全文精读笔记，以及带日期的结论修订记录。文献入口与实际读过的全文分别标注；已有数据的诊断重算也与独立复现区分。历史图表不能认证可实现收益。

网站使用 TypeScript，支持中英文和可保留选择的浅色、深色及系统主题。首页采用示意性的 WebGL 动态画面，提供暂停、减少动态效果和静态后备显示。

## 本地运行

需要 Node.js 24 或更新版本。

```sh
npm ci
npm run dev
```

```sh
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

构建校验内容引用、来源文件精确哈希、公开数据边界和项目路径。GitHub Actions 完成检查后，将 `main` 部署到 GitHub Pages。

详见[架构和写作流程](docs/architecture.md)、[来源说明](docs/source-provenance.md#来源说明)和[发布边界](docs/publication.md)。

研究输入、供应商原始数据和凭据保留在仓库外。共享数据治理归 `quant-market-data-platform`，通用执行归 `quant-platform`，私有策略归 `quant-research`。原固定报告继续保存在 [`quant-market-research`](https://github.com/runchengxie/quant-market-research)。本项目维护新的持续调查和文献对照；因子 Observatory 链接审核后的投影。

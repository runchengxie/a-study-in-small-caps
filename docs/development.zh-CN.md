# 开发与配置

[English](development.md)

使用 Node.js 24 或更新版本，从仓库根目录运行以下命令。

```sh
npm ci
npm run dev
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

开发服务器会显示包含 `/a-study-in-small-caps/` 的完整地址。执行 `npm run build` 后，可以用 `npm run preview` 查看生产构建。浏览器测试会自行在 4381 端口启动预览，请保持该端口空闲。如果已有 Chromium，可以通过 `PLAYWRIGHT_EXECUTABLE_PATH` 指定程序位置。

## 配置放在哪里

- `configs/astro.config.mjs` 设置网站地址、项目路径和 React 集成，npm 脚本明确指定该文件。
- `configs/playwright.config.mjs` 设置浏览器测试。测试路径相对于这个文件，预览命令从仓库根目录运行。
- `configs/tsconfig.json` 保存 TypeScript 选项。根目录的 `tsconfig.json` 仅引用它，让 Astro 和编辑器找到同一个项目。包含和排除路径相对于 `configs/`。
- `package.json` 和 `package-lock.json` 留在项目根目录，供 npm 识别项目并锁定依赖版本。

请使用 npm 脚本。直接执行 `astro` 或 `playwright test` 会按默认位置寻找配置。GitHub Actions 也使用这些 npm 脚本。

## 检查与发布

构建会核对内容引用、来源哈希、公开数据边界和站内链接。浏览器测试检查语言切换、图表、手机布局和动画控制。PR 运行检查，合并到 `main` 后，通过检查的静态网站会发布到 GitHub Pages。

研究输入、供应商记录和凭据保留在仓库外。共享数据归 `quant-market-data-platform` 管理，通用执行归 `quant-platform`，私有策略归 `quant-research`。原固定报告保留在 `quant-market-research`，本站维护持续更新的调查和文献对照。详见[发布边界](publication.md)（英文）。

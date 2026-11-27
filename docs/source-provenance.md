# Source provenance

[简体中文](#来源说明)

The initial edition reorganized previously public research. The research expansion adds three full-text literature readings and independent descriptive computations on an existing public NAV; it adds no market observations, portfolio reruns or completed prospective months. Inherited research source links are pinned to quant-market-research revision `6c4a09f26041cb7d47cf176e15cfc7a1181e2734`. Review date: 2026-11-27; this is not a data cutoff or proof of original runtime identity.

The authoritative fixed narrative is [v1.0.10](https://github.com/runchengxie/quant-market-research/blob/6c4a09f26041cb7d47cf176e15cfc7a1181e2734/web/public/downloads/archive/microcap-research.v1.0.10.zh-CN.md), dated 2026-11-01. SHA-256: `24b33028a5dbcd8b3f2d191204c755277e17df802463dd7c875fa75a355a71f1`. It remains upstream and is not rewritten here. Its linked online assets are not a complete frozen website.

Four previously public aggregate JSON files are vendored byte for byte under `public/evidence/`. Each has its own SHA-256 in the source registry. The browser projection in `src/data/evidence.json` is deterministic:

- NAV: retain `date` and `nav` from every original 400-name row, without rebasing or adding returns.
- Early summaries: retain each count's `max_drawdown` as a fraction and `longest_completed_underwater_sessions` as trading sessions. They cover 2008–2014, separately from the later NAV. All five counts have a right-censored episode. No unavailable NAV curves are inferred.
- Liquidity: pair absolute and relative `periods` by requested start/end; retain common dates and included markets. For each original market bucket, copy `median_usd`, `observations` and `count` into `medianUSD`, `observations` and `stocks`, preserving zero and null. Bucket indexes are zero-based in original order. Historical `count` is the source's unique-stock count for that bucket; a stock can occur in more than one bucket over time, so these counts must not be summed as a universe count.

Liquidity measures median lagged ADV20 mean in USD, not spread or executable capacity. Historical values pool security-days. The 2026 common window excludes the US and ends in April. Japanese historical share coverage is incomplete and exploratory; mainland coverage is Shanghai/Shenzhen. Common dates do not certify equal universes or point-in-time eligibility. The source snapshots keep additional market-specific dates and audit receipts available for inspection.

The MC-C01–MC-C06 identities retain historical downside, low-turnover association, capacity, support-policy diagnosis, provider-query evidence and unrecovered runtime as separate claims. Mapping source stages into the smaller site vocabulary does not upgrade evidence: provider-query evidence maps to diagnostic; unrecovered runtime maps to unestablished. Three literature entries are now full-text reviewed at the exact identified edition; two retain their earlier reading stages. None is replicated. Full-text method comparisons for the three readings are marked not comparable to current aggregate evidence, not empirical support or conflict. No paper full text, raw vendor records, holdings or BMLL per-security observations are included.

## 来源说明

[English](#source-provenance)

首版重新组织此前公开研究。本次扩展完整阅读三个明确版本，并对已有公开净值作独立描述计算，没有新增市场观察、重跑组合或增加已完成前瞻月份。来源固定到上述版本。2026-11-27是本次编辑与发布核查日期，不是样本截止日，也不能认证原运行身份。固定报告v1.0.10保留在原来源，哈希不变。

四份公开聚合JSON按原字节保留，每份都有独立来源编号与SHA-256。400只净值保留原日期和原数值。2008—2014年五组股票数量只提供风险汇总，不补造净值；最长水下期只统计已恢复区间，各组另有一个右删失区间。两段样本没有拼接。

流动性投影按请求起止日期配对绝对与相对分组，保留共同日期、所含市场、原中位数、观测数及分组股票数。历史分组的股票数不能相加当作总股票池，因为同一股票可能跨期进入不同分组。成交额、价差与可执行容量分别解释。日股、A股及2026年共同区间的限制在正文和图表保留。

六个旧结论编号继续区分风险、关联、容量、诊断、查询与运行身份。三篇文献已全文阅读，两篇保留原阅读阶段，均未复现。三篇全文的方法对照记为当前汇总无法比较，不记为实证支持或冲突。不发布论文全文、供应商原始记录、持仓或BMLL逐证券数据。


## Research expansion, 2026-11-27

The three reviewed PDFs are privately retained with extracted text, download URLs, byte hashes and page counts. Public literature records contain concise original bilingual notes only. The reviewed China edition is the Wharton manuscript dated December 11, 2018, not an asserted byte match to JFE 2019. The cost paper is NBER 20721, December 2014, not its later journal edition. Failed TLS/403 retrievals are not treated as evidence read; AQR remains an author-summary lead.

The new [NAV diagnostics script](research/nav-diagnostics.py) reads the exact frozen NAV bytes (SHA-256 `9d8a7366a0d5fe6ea98d1f082ece15d95f586d49505b7ba117dc98779ba9bf3e`). Its reviewed aggregate output is `public/evidence/nav-diagnostics.json`, SHA-256 `1f6e6cb68793b562c10a9b7ca88116a4bc9950f1edc0b8dc2d6beef0dec4dd38`. Reproduce with Python 3's standard library, supplying an output path outside the source checkout by default.

```sh
python docs/research/nav-diagnostics.py public/evidence/microcap_nav.json /tmp/nav-diagnostics.json
```

Returns are ratios of consecutive levels, without filling a first-day return. Calendar CAGR uses elapsed days / 365.25; volatility uses sample standard deviation of those ratios times sqrt(252). Annual returns use the last prior-year observation; 2015 and 2026 are partial. Rolling windows use observation steps and overlap. Drawdowns reset on a level at or above the prior peak; durations count peak-to-recovery steps, and an unfinished episode is right-censored at the last observation. The episode table retains the eight deepest episodes, not every episode. Removing the best/worst ten returns replaces them with zero return as an ex post sensitivity, not an implementable timing rule. No inference of independent loss probabilities, risk-adjusted alpha, traded fills or capacity follows.

Independent Decimal arithmetic cross-checked the endpoint ratio, maximum drawdown, rolling minima and all negative-window counts. This validates the transformation, not the supplied source account. Implied daily extremes remain visible because they need ledger reconciliation.

本次公开笔记注明实际阅读版本与页码，PDF及提取文本仅在项目数据目录保留。新增净值诊断沿用同一冻结输入，以标准库脚本重算，独立高精度运算核对端点、最大回撤及滚动窗口结果。观测间隔、重叠窗口和未恢复区间分别处理。计算正确不能认证来源账户正确，也不能证明可交易性。

## Research atlas expansion

The atlas registers 44 relevant public source artifacts from both predecessor repositories. Each entry retains its immutable source revision, path and SHA-256; eight interactive panels project 584 aggregate rows. `scripts/validate-atlas.mjs` verifies projection integrity in every build. With explicit source repository roots, it additionally compares each original source fingerprint and each projected value. The historical Observatory panel and its synthetic demo are separate: the demo supports interface exploration only. Review dates are copied only from explicit review fields, never inferred from generation dates.

Exit scenarios pool stock–formation observations, with repeated monthly stock membership. Their uncredited fraction refers to residual budget/notional rather than the fraction of uncovered securities. Both concepts and the original dollar size groups remain visible. The atlas is a navigable inventory of the relevant existing research, not a new certification of original portfolio runs.

## 研究档案扩充

研究档案登记两个原项目中的44份相关公开资料，每份保留固定版本、来源路径与SHA-256；八组互动图表投影584行聚合数据。每次构建校验投影指纹；指定原仓库路径后还可逐一核对来源文件与每个投影值。Observatory的历史风险面板与合成演示分开，演示仅用于体验界面。审阅日期只取明确的审阅字段，不以生成日期代替。

退出情景按股票—形成期汇总，同一股票可按月重复出现；未覆盖比例指剩余预算或名义金额，不能解释成未覆盖证券数量的比例。图表同时保留原美元市值分组。档案方便查阅既有相关研究，不构成对原组合运行的重新认证。

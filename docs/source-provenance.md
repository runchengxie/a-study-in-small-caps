# Source provenance

[简体中文](#来源说明)

This first edition reorganizes previously public research. It adds no market observations, experimental runs or completed prospective months. All source links are pinned to quant-market-research revision `6c4a09f26041cb7d47cf176e15cfc7a1181e2734`. Review date: 2026-11-27; this is not a data cutoff or proof of original runtime identity.

The authoritative fixed narrative is [v1.0.10](https://github.com/runchengxie/quant-market-research/blob/6c4a09f26041cb7d47cf176e15cfc7a1181e2734/web/public/downloads/archive/microcap-research.v1.0.10.zh-CN.md), dated 2026-11-01. SHA-256: `24b33028a5dbcd8b3f2d191204c755277e17df802463dd7c875fa75a355a71f1`. It remains upstream and is not rewritten here. Its linked online assets are not a complete frozen website.

Four previously public aggregate JSON files are vendored byte for byte under `public/evidence/`. Each has its own SHA-256 in the source registry. The browser projection in `src/data/evidence.json` is deterministic:

- NAV: retain `date` and `nav` from every original 400-name row, without rebasing or adding returns.
- Early summaries: retain each count's `max_drawdown` as a fraction and `longest_completed_underwater_sessions` as trading sessions. They cover 2008–2014, separately from the later NAV. All five counts have a right-censored episode. No unavailable NAV curves are inferred.
- Liquidity: pair absolute and relative `periods` by requested start/end; retain common dates and included markets. For each original market bucket, copy `median_usd`, `observations` and `count` into `medianUSD`, `observations` and `stocks`, preserving zero and null. Bucket indexes are zero-based in original order. Historical `count` is the source's unique-stock count for that bucket; a stock can occur in more than one bucket over time, so these counts must not be summed as a universe count.

Liquidity measures median lagged ADV20 mean in USD, not spread or executable capacity. Historical values pool security-days. The 2026 common window excludes the US and ends in April. Japanese historical share coverage is incomplete and exploratory; mainland coverage is Shanghai/Shenzhen. Common dates do not certify equal universes or point-in-time eligibility. The source snapshots keep additional market-specific dates and audit receipts available for inspection.

The MC-C01–MC-C06 identities retain historical downside, low-turnover association, capacity, support-policy diagnosis, provider-query evidence and unrecovered runtime as separate claims. Mapping source stages into the smaller site vocabulary does not upgrade evidence: provider-query evidence maps to diagnostic; unrecovered runtime maps to unestablished. All five literature entries are abstract/metadata or author-summary leads; none is full-text reviewed or replicated. All cross-checks remain untested. No paper full text, raw vendor records, holdings or BMLL per-security observations are included.

## 来源说明

[English](#source-provenance)

首版重新组织此前公开研究，没有新增市场观察、实验运行或已完成前瞻月份。来源固定到上述版本。2026-11-27是本次编辑与发布核查日期，不是样本截止日，也不能认证原运行身份。固定报告v1.0.10保留在原来源，哈希不变。

四份公开聚合JSON按原字节保留，每份都有独立来源编号与SHA-256。400只净值保留原日期和原数值。2008—2014年五组股票数量只提供风险汇总，不补造净值；最长水下期只统计已恢复区间，各组另有一个右删失区间。两段样本没有拼接。

流动性投影按请求起止日期配对绝对与相对分组，保留共同日期、所含市场、原中位数、观测数及分组股票数。历史分组的股票数不能相加当作总股票池，因为同一股票可能跨期进入不同分组。成交额、价差与可执行容量分别解释。日股、A股及2026年共同区间的限制在正文和图表保留。

六个旧结论编号继续区分风险、关联、容量、诊断、查询与运行身份。文献均未全文审阅或复现，对照状态均为未检验。不发布论文全文、供应商原始记录、持仓或BMLL逐证券数据。

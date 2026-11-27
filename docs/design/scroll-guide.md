# Scrolling research guide

[简体中文](scroll-guide.zh-CN.md)

The homepage keeps the existing returns, drawdowns and cost sequence. Each section pairs a sticky SVG chart with short reading steps. Native scrolling selects a step in either direction. A free-exploration control and direct input stop automatic selection. The research index remains directly accessible.

We considered decorative entrance animations, a single full-screen canvas, and section-level sticky charts. Section-level charts keep sources, independent controls and keyboard access close to each plot without extending the cover's WebGL runtime. No reference-site code or artwork is imported.

Returns reveal observations through 2015, 2020 and the complete sample on fixed logarithmic axes. Drawdown steps select the complete sample, 2024 and the complete sample again; every window retains the earlier full-series high-water mark. Costs use explicitly hypothetical spread/replacement presets, not a subtraction from the NAV series. Each figure keeps its material limitations visible.

The base HTML remains a readable article. Reduced motion disables following and tall scroll steps. Small or zoomed viewports use normal flow when a figure cannot fit. Updates are scheduled only for scrolling, resizing or relevant input, not a perpetual animation loop. Browser tests cover forward/backward steps, manual takeover, locale changes and static fallbacks.

Design references reviewed on 2026-11-27: [Highline](https://highline.huffingtonpost.com/articles/en/poor-millennials/) for continuous illustrated reading; [Hunterbrook](https://hntrbrk.com/investigations/amd-china) for source-adjacent evidence presentation. Their reporting is not a source for this site's investment claims. Direct browser inspection was unavailable; article content and the Highline public interaction bundle were inspected.

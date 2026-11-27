import {test,expect} from '@playwright/test';
test('deep routes, English default and Chinese preference persist',async({page})=>{await page.goto('./');await expect(page.locator('html')).toHaveAttribute('lang','en');await page.locator('#locale-toggle').click();await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');await page.goto('investigations/what-is-small/');await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');await expect(page.locator('h1')).toBeVisible();await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');});
test('Chinese paper query, review filter, reset and empty state',async({page})=>{await page.goto('literature/');await page.locator('#locale-toggle').click();await page.locator('#research-query').fill('质量');await expect(page.locator('.result-card')).toHaveCount(1);await page.locator('#record-stage').selectOption('replicated');await expect(page.locator('.empty-state')).toBeVisible();await page.locator('#clear-filters').click();await expect(page.locator('.result-card')).toHaveCount(5);await page.locator('#research-query').fill('ZZZ-no-such-paper');await expect(page.locator('.empty-state')).toBeVisible();});
test('risk summary preserves unavailable NAV and liquidity controls select values',async({page})=>{await page.goto('evidence/');await expect(page.locator('#nav-chart svg')).toBeVisible();await page.locator('#stock-count').selectOption('50');await expect(page.locator('#nav-chart .empty-state')).toBeVisible();await expect(page.locator('#drawdown-value')).toContainText('59.9');await page.locator('#stock-count').selectOption('400');await page.locator('#nav-frequency').selectOption('annual');await expect(page.locator('#nav-data tr')).toHaveCount(12);await page.locator('#liquidity-bucket').selectOption('0');await page.locator('#liquidity-market').selectOption('A-share');await expect(page.locator('#liquidity-chart .empty-state')).toBeVisible();await page.locator('#liquidity-basis').selectOption('relative');await expect(page.locator('#liquidity-chart svg')).toBeVisible();});
test('mobile and unsupported locale remain readable without horizontal overflow',async({page})=>{await page.addInitScript(()=>localStorage.setItem('smallcaps-locale','unsupported'));await page.setViewportSize({width:390,height:844});await page.goto('investigations/');await expect(page.locator('html')).toHaveAttribute('lang','en');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();await page.getByRole('link',{name:'Methods & data',exact:true}).first().click();await expect(page.locator('h1')).toBeVisible();});
test('missing group cells and relative-source identities remain visible',async({page})=>{await page.goto('evidence/');await page.locator('#liquidity-bucket').selectOption('0');await expect(page.locator('#liquidity-data')).toContainText('China A-shares');await expect(page.locator('#liquidity-data')).toContainText('No eligible observations');await page.locator('#liquidity-basis').selectOption('relative');await expect(page.locator('#liquidity-source-relative')).toBeVisible();await expect(page.locator('#liquidity-source-absolute')).toBeHidden();await page.locator('#liquidity-period').selectOption('period-4');await expect(page.locator('#liquidity-data')).toContainText('not included');});
test('chapter claims and affected historical records form navigable evidence paths',async({page})=>{await page.goto('investigations/what-is-small/');await page.locator('a[href$="history/#MC-C02"]').first().click();await expect(page.locator('#MC-C02')).toBeVisible();await page.goto('history/');await expect(page.locator('.result-card a[href$="#MC-C01"]').first()).toBeVisible();const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));expect(new Set(ids).size).toBe(ids.length);});
test('theme preference persists across routes and system follows device preference',async({page})=>{
 await page.emulateMedia({colorScheme:'dark'});await page.goto('./');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.locator('#theme-select').selectOption('light');
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.goto('methods/');await expect(page.locator('#theme-select')).toHaveValue('light');
 await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await page.locator('#theme-select').selectOption('system');
 await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.emulateMedia({colorScheme:'light'});await expect(page.locator('html')).toHaveAttribute('data-theme','light');
});
test('homepage keeps static artwork when WebGL is unavailable',async({page})=>{
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'?null:original.call(this,type,...args);};});
 await page.goto('./');await expect(page.locator('#particle-terrain')).toBeHidden();
 await expect(page.locator('.ef-pwave')).toHaveCSS('background-color','rgb(12, 30, 24)');
 await expect(page.locator('#motion-toggle')).toBeHidden();
 await expect(page.locator('h1')).toBeVisible();
});
test('reduced motion starts the terrain static',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');
 if(await page.locator('#motion-toggle').isVisible()) await expect(page.locator('#motion-toggle')).toHaveAttribute('aria-pressed','true');
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
test('new rolling diagnostics keep selected outcomes and window identities aligned',async({page})=>{
 await page.goto('evidence/#nav-diagnostics');
 await expect(page.locator('#diagnostic-chart svg')).toBeVisible();
 await expect(page.locator('#diagnostic-data tr').first()).toContainText('2015-06-05');
 await page.locator('#diagnostic-metric').selectOption('maximum');
 await expect(page.locator('#diagnostic-data tr').first()).toContainText('2015-05-06');
 await page.locator('#diagnostic-metric').selectOption('negativeFraction');
 await expect(page.locator('#diagnostic-data tr').first()).toContainText('36.17%');
 await expect(page.locator('#diagnostic-data tr').first()).not.toContainText('2015-05-06');
});

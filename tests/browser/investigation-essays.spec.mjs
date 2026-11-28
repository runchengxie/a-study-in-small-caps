import {test,expect} from '@playwright/test';
test('eight essays present narrative introductions and interactive evidence within the article',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 // Resolve established routes from the investigation index rather than inventing title slugs.
 await page.goto('investigations/');const links=await page.locator('.chapter-list-item h2 a').evaluateAll(a=>a.slice(0,8).map(n=>n.href));expect(links).toHaveLength(8);
 for(const link of links){await page.goto(link);await expect(page.locator('.investigation-essay .essay-opening p')).toHaveCount(2);await expect(page.locator('.essay-reading-time')).toContainText('min');await expect(page.locator('.investigation-essay select:visible, .investigation-essay input:visible').first()).toBeVisible();const context=await page.locator('.investigation-essay select:visible, .investigation-essay input:visible').first().evaluate(el=>({article:!!el.closest('article'),section:!!el.closest('article > section')}));expect(context).toEqual({article:true,section:true});}
 expect(errors).toEqual([]);
});
test('inline liquidity distinguishes absent markets and historical risk keeps fixed source summaries',async({page})=>{
 await page.goto('investigations/');const links=await page.locator('.chapter-list-item h2 a').evaluateAll(a=>a.slice(0,8).map(n=>n.href));
 await page.goto(links[0]);const root=page.locator('[data-liquidity-comparison]');await expect(root.locator('tbody tr')).toHaveCount(4);await root.locator('[data-liquidity="basis"]').selectOption('relative');await expect(root.locator('[data-liquidity="bucket"] option').first()).toHaveText('0–20%');await root.locator('[data-liquidity="period"]').selectOption('period-4');await expect(root.locator('tbody')).toContainText('Market not included');
 await page.locator('#locale-toggle').click();await expect(root.locator('tbody')).toContainText('中国香港港股');await expect(root.locator('tbody')).toContainText('该时期没有纳入该市场');await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.goto(links[1]);await page.locator('#essay-risk-count').selectOption('800');await expect(page.locator('#essay-risk-chart')).toContainText('611');await expect(page.locator('#essay-risk-chart')).toContainText('68.77');await expect(page.locator('#research-lab')).toBeVisible();
});

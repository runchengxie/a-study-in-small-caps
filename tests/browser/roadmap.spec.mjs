import {test,expect} from '@playwright/test';
test('roadmap filters preserve task evidence, dependencies and target-only progress',async({page})=>{
 await page.goto('roadmap/');await expect(page.locator('[data-task]:visible')).toHaveCount(30);
 await page.locator('#task-status').selectOption('waiting');await expect(page.locator('[data-task]:visible')).toHaveCount(13);
 await page.locator('#task-priority').selectOption('P0');await expect(page.locator('[data-task]:visible')).toHaveCount(2);
 await page.locator('#task-search').fill('no-such-task-zz');await expect(page.locator('#task-empty')).toBeVisible();
 await page.locator('#task-reset').click();await page.locator('#task-search').fill('共同份额');await expect(page.locator('[data-task]:visible')).toHaveCount(1);
 await page.goto('roadmap/#SC-009');await expect(page.locator('#SC-009')).toHaveAttribute('open','');await expect(page.locator('#SC-009')).toContainText('certified matched full-history account');
 await page.locator('#SC-009 a[href="#SC-008"]').click();await expect(page.locator('#SC-008')).toHaveAttribute('open','');
 await page.locator('#locale-toggle').click();await expect(page.locator('h1 .lang-zh')).toHaveText('研究清单与证据地图');await expect(page.locator('#target-support')).toContainText('不是实际换手或成本');
 await expect(page.locator('#target-support table')).toContainText('25.84%');
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
test('roadmap remains a complete readable checklist without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 await page.goto('http://127.0.0.1:4381/a-study-in-small-caps/roadmap/');await expect(page.locator('[data-task]')).toHaveCount(30);await expect(page.locator('#roadmap-filters')).toBeHidden();await page.locator('#SC-009 summary').click();await expect(page.locator('#SC-009')).toContainText('Same dates, eligibility, ledger');await context.close();
});

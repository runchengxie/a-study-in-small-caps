import {test,expect} from '@playwright/test';
test('atlas charts switch empirical specifications and keep exact aggregate rows',async({page})=>{
 await page.goto('atlas/');await expect(page.locator('#atlas-chart svg')).toBeVisible();
 await page.locator('#atlas-panel').selectOption('exclusion');await page.locator('#atlas-metric').selectOption('annualized_turnover');
 await page.locator('[data-dimension="candidate"]').selectOption('small_cap');await page.locator('[data-dimension="weighting"]').selectOption('equal');await page.locator('[data-dimension="buffer_setting"]').selectOption('no_buffer');await page.locator('[data-dimension="exclusion_percentile"]').selectOption('0');
 await expect(page.locator('#atlas-count')).toContainText('1');await expect(page.locator('#atlas-body tr')).toHaveCount(1);await expect(page.locator('#atlas-body')).toContainText('4.77569677');
 await page.locator('#atlas-panel').selectOption('stability');await page.locator('[data-dimension="market"]').selectOption('HK');await expect(page.locator('#atlas-body')).toContainText('Hong Kong, China equities');
 await page.locator('#locale-toggle').click();await expect(page.locator('#atlas-title')).toContainText('跨市场');await expect(page.locator('#atlas-body')).toContainText('中国香港港股');
});
test('atlas distinguishes synthetic demo, searches bilingual provenance and fits mobile',async({page})=>{
 await page.goto('atlas/');await page.locator('#atlas-panel').selectOption('demo');await expect(page.locator('#atlas-title')).toContainText('synthetic');await expect(page.locator('#atlas-limit')).toContainText('cannot support');
 await page.locator('#atlas-search').fill('公司行动');expect(await page.locator('.atlas-record:visible').count()).toBeGreaterThan(0);expect(await page.locator('.atlas-record:visible').count()).toBeLessThan(44);
 await page.locator('#atlas-search').fill('no-such-source-zzzz');await expect(page.locator('.atlas-record:visible')).toHaveCount(0);await page.locator('#atlas-search').fill('');await expect(page.locator('.atlas-record:visible')).toHaveCount(44);
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});

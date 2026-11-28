import {test,expect} from '@playwright/test';
test('chapter instruments retain comparable samples and distinguish published from rerun windows',async({page})=>{
 await page.goto('investigations/size-turnover-and-robustness/');
 const conditioned=page.locator('[data-focus="conditioning"]');await expect(conditioned.locator('tbody tr')).toHaveCount(6);
 const before=await conditioned.locator('tbody').innerText();await conditioned.locator('[data-control="universe"]').selectOption('retained_deconfounding');await expect(conditioned.locator('tbody')).not.toHaveText(before);
 const exclusion=page.locator('[data-focus="exclusion"]');await expect(exclusion.locator('tbody tr')).toHaveCount(12);const values=await exclusion.locator('tbody').innerText();await exclusion.locator('[data-control="weighting"]').selectOption('value');await expect(exclusion.locator('tbody')).not.toHaveText(values);
 const windows=page.locator('[data-focus="windows"]');await expect(windows.locator('tbody tr')).toHaveCount(7);await windows.locator('[data-control="days"]').selectOption('120');await expect(windows.locator('tbody tr')).toHaveCount(3);await expect(windows.locator('tbody')).toContainText('7.601898');await expect(windows.locator('tbody')).toContainText('4.224513');
 await page.locator('#locale-toggle').click();await expect(windows.locator('tbody')).toContainText('至少45个观测');await windows.locator('[data-control="metric"]').selectOption('drawdown');await expect(windows.locator('tbody')).toContainText('-58.259876');
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('reading guide retains original records, bilingual search and exact downloadable editions',async({page,request})=>{
 await page.goto('reading-guide/');await expect(page.locator('[data-guide-record]')).toHaveCount(42);
 await page.locator('#guide-search').fill('H24');await expect(page.locator('[data-guide-record]:visible')).toHaveCount(1);await page.locator('#H24 summary').click();await expect(page.locator('#H24')).toContainText('189');
 await page.locator('#locale-toggle').click();await expect(page.locator('#H24 summary')).toContainText('缺价');await page.locator('#guide-search').fill('unlikely-record-xyz');await expect(page.locator('#guide-empty')).toBeVisible();await page.locator('#guide-search').fill('');await expect(page.locator('[data-guide-record]:visible')).toHaveCount(42);
 for(const suffix of ['zh-CN','en-US']){const response=await request.get(`downloads/microcap-research.v1.0.10.${suffix}.md`);expect(response.ok()).toBe(true);expect(await response.text()).toContain('H35');}
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

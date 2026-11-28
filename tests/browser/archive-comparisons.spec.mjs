import {test,expect} from '@playwright/test';
test('archived capital and frequency comparisons remain distinct, bilingual and usable on mobile',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('investigations/targets-shares-and-cash/');
 const capital=page.locator('[data-archive-comparison="capital"]');
 await expect(capital.locator('tbody tr')).toHaveCount(7);
 await expect(capital.locator('.comparison-chart')).toContainText('15.07');
 await capital.locator('[data-compare="metric"]').selectOption('cash');await expect(capital.locator('.comparison-chart')).toContainText('38.25');
 await page.locator('#locale-toggle').click();await expect(capital.getByRole('heading',{name:'七档资金模拟',exact:true})).toBeVisible();await expect(capital.locator('thead')).toContainText('平均现金');
 await page.goto('investigations/size-turnover-and-robustness/');const matrix=page.locator('[data-archive-comparison="matrix"]');
 await matrix.locator('[data-compare="frequency"]').selectOption('biweekly');await expect(matrix.locator('tbody tr')).toHaveCount(4);await expect(matrix.locator('.comparison-chart')).toContainText('21.18');await expect(matrix.locator('tbody')).toContainText('296');
 await matrix.locator('[data-compare="metric"]').selectOption('drawdown');await expect(matrix.locator('.comparison-chart')).toContainText('-60.48');
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});

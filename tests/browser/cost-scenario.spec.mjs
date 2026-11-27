import {test,expect} from '@playwright/test';
test('cost assumptions update a fixed-scale plot and bilingual accessible table',async({page})=>{
 await page.goto('investigations/exit-liquidity-and-turnover/');
 await expect(page.locator('#cost-chart svg')).toBeVisible();
 await expect(page.locator('#cost-rows tr').first()).toContainText('25.2%');
 await page.locator('#cost-replacement').fill('50');
 await page.locator('#cost-replacement').dispatchEvent('input');
 await expect(page.locator('#cost-rows tr').first()).toContainText('12.6%');
 await page.locator('#locale-toggle').click();
 await expect(page.locator('#cost-scenario h2')).toContainText('覆盖');
 await page.locator('#cost-spread').fill('0');await page.locator('#cost-spread').dispatchEvent('input');
 await expect(page.locator('#cost-rows tr').first()).toContainText('0%');
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
test('2024 threshold diagnostic selects observed outcomes without claiming executions',async({page})=>{
 await page.goto('investigations/2024-microcap-drawdown/');await page.locator('#exit-delay-select').selectOption('5');
 await expect(page.locator('#exit-delay-rows tr').last()).toContainText('2024-02-05');await expect(page.locator('#exit-delay-rows tr').last()).toContainText('16.53%');
 await page.locator('#locale-toggle').click();await expect(page.locator('#exit-delay h2')).toContainText('回撤门槛');
});

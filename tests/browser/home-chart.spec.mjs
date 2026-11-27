import {test,expect} from '@playwright/test';
test('homepage drawdown preview selects actual dates and opens the linked instrument',async({page})=>{
 await page.goto('./');await expect(page.locator('#home-drawdown-chart svg')).toBeVisible();
 await page.locator('#home-chart-year').selectOption('2024');await expect(page.locator('#home-chart-readout')).toContainText('2024-');
 const chart=page.locator('#home-drawdown-chart svg');await chart.focus();const before=await page.locator('#home-chart-readout').innerText();await page.keyboard.press('ArrowLeft');await expect(page.locator('#home-chart-readout')).not.toHaveText(before);
 await page.locator('a[href$="evidence/#research-lab"]').click();await expect(page.locator('#research-lab')).toBeVisible();
});

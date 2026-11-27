import {test,expect} from '@playwright/test';
test('homepage drawdown preview selects actual dates and opens the linked instrument',async({page})=>{
 await page.goto('./');await expect(page.locator('#home-drawdown-chart svg')).toBeVisible();
 await page.locator('#home-chart-year').selectOption('2024');await expect(page.locator('#home-chart-readout')).toContainText('2024-');
 const chart=page.locator('#home-drawdown-chart svg');await chart.focus();const before=await page.locator('#home-chart-readout').innerText();await page.keyboard.press('ArrowLeft');await expect(page.locator('#home-chart-readout')).not.toHaveText(before);
 await page.locator('a[href$="evidence/#research-lab"]').click();await expect(page.locator('#research-lab')).toBeVisible();
});
test('homepage walks through returns, drawdowns and a separate cost scenario',async({page})=>{
 await page.goto('./');
 await expect(page.locator('#research')).toContainText('50.4%');
 await expect(page.locator('#home-risk')).toContainText('-51.3%');
 await expect(page.locator('#research')).toContainText('before trading costs');
 const chart=page.locator('#home-return-chart');await chart.focus();
 const before=await page.locator('#home-return-readout').innerText();await page.keyboard.press('ArrowLeft');
 await expect(page.locator('#home-return-readout')).not.toHaveText(before);
 await page.locator('#cost-spread').fill('100');await page.locator('#cost-spread').dispatchEvent('input');
 await expect(page.locator('#cost-rows tr').nth(1)).toContainText('12%');
 await page.locator('#locale-toggle').click();
 await expect(chart).toHaveAccessibleName('首个观测值归一为1的净值');
 await expect(page.locator('#research .story-number .lang-en')).toBeHidden();
 await expect(page.locator('#research .story-number .lang-zh')).toBeVisible();
 await page.setViewportSize({width:390,height:844});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('.story-continue').click();await expect(page).toHaveURL(/#explore$/);
});

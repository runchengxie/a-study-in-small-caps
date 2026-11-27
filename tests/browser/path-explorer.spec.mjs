import {test,expect} from '@playwright/test';
test('calendar links actual monthly dates, timeline cursor and holding counts',async({page})=>{
 await page.goto('evidence/#research-lab');await expect(page.locator('#path-timeline svg')).toBeVisible();
 await page.locator('#path-calendar button').first().click();await expect(page.locator('#path-start')).toHaveValue('2015-01-05');await expect(page.locator('#path-end')).toHaveValue('2015-01-30');
 await page.locator('#path-timeline svg').focus();await page.keyboard.press('ArrowRight');await expect(page.locator('#path-readout')).toContainText('2015-01-06');
 await page.locator('#path-timeline svg').hover({position:{x:200,y:100}});await expect(page.locator('#path-readout')).not.toContainText('2015-01-06');
 await page.locator('#holding-period').fill('3');await expect(page.locator('#holding-steps')).toHaveText('252');await expect(page.locator('#holding-summary')).toContainText('2,586');await expect(page.locator('#holding-chart rect')).toHaveCount(24);
 await page.locator('#path-reset').click();await expect(page.locator('#path-end')).toHaveValue('2026-09-04');
 await page.locator('#locale-toggle').click();await expect(page.locator('#path-readout')).toContainText('已发布净值');await expect(page.locator('#holding-summary')).toContainText('重叠窗口');
});
test('explicit playback pauses with reduced motion and mobile remains contained',async({page})=>{
 await page.goto('evidence/#research-lab');await page.locator('#path-play').click();await expect(page.locator('#path-play')).toHaveAttribute('aria-pressed','true');
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('#path-play')).toBeDisabled();await expect(page.locator('#path-play')).toHaveAttribute('aria-pressed','false');await expect(page.locator('#path-reduced')).toBeVisible();
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.locator('#theme-select').selectOption('dark');await expect(page.locator('#path-timeline svg')).toBeVisible();
});

test('2024 investigation preset selects observed dates through URL and button',async({page})=>{
 await page.goto('evidence/?period=2024#research-lab');await expect(page.locator('#path-start')).toHaveValue('2024-01-02');await expect(page.locator('#path-end')).toHaveValue('2024-09-30');
 await page.locator('#path-reset').click();await page.locator('#path-2024').click();await expect(page.locator('#path-start')).toHaveValue('2024-01-02');
 await expect(page.locator('#holding-period')).toHaveAttribute('aria-valuetext','21 Observation steps');
});
test('2024 investigation embeds its event window and retains regular chapter navigation',async({page})=>{
 await page.goto('investigations/2024-microcap-drawdown/');
 await expect(page.locator('#research-lab')).toBeVisible();
 await expect(page.locator('#path-start')).toHaveValue('2024-01-02');
 await expect(page.locator('#path-end')).toHaveValue('2024-09-30');
 await expect(page.locator('#path-timeline svg')).toBeVisible();
});

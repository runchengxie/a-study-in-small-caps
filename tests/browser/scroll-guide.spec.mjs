import {test,expect} from '@playwright/test';
const step=async(page,chapter,value)=>{
 const target=page.locator(`[data-scroll-chapter="${chapter}"] [data-scroll-step="${value}"]`);
 await target.evaluate(el=>window.scrollTo({top:scrollY+el.getBoundingClientRect().top-innerHeight*.4,behavior:'instant'}));
 await expect(page.locator(`[data-scroll-chapter="${chapter}"]`)).toHaveAttribute('data-active-step',value);
};
test('scrolling forwards and backwards selects actual NAV windows and cost assumptions',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('./');
 await step(page,'returns','2015');await expect(page.locator('#home-return-readout')).toContainText('2015-12-31');
 const early=Number(await page.locator('#return-reveal-width').getAttribute('width'));
 await step(page,'returns','2020');await expect(page.locator('#home-return-readout')).toContainText('2020-12-31');
 expect(Number(await page.locator('#return-reveal-width').getAttribute('width'))).toBeGreaterThan(early);
 await step(page,'returns','all');await expect(page.locator('#return-reveal-width')).toHaveAttribute('width','880');
 await step(page,'returns','2015');await expect(page.locator('#home-return-readout')).toContainText('2015-12-31');
 await step(page,'risk','2024');await expect(page.locator('#home-chart-year')).toHaveValue('2024');
 await step(page,'risk','context');await expect(page.locator('#home-chart-year')).toHaveValue('all');
 await step(page,'cost','base');await expect(page.locator('#cost-spread')).toHaveValue('50');
 await step(page,'cost','wide');await expect(page.locator('#cost-spread')).toHaveValue('100');
 await expect(page.locator('#cost-rows tr').nth(1)).toContainText('12%');
 await step(page,'cost','half');await expect(page.locator('#cost-replacement')).toHaveValue('50');
 await expect(page.locator('#cost-rows tr').nth(1)).toContainText('6%');
 await step(page,'cost','wide');await expect(page.locator('#cost-replacement')).toHaveValue('100');
});
test('manual exploration pauses following and resuming uses the current step',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('./');await step(page,'risk','2024');
 await page.locator('#home-chart-year').selectOption('2018');
 await expect(page.locator('#home-risk [data-scroll-toggle]')).toHaveAttribute('aria-pressed','false');
 await page.locator('#home-risk [data-scroll-step="context"]').evaluate(el=>window.scrollTo({top:scrollY+el.getBoundingClientRect().top-innerHeight*.4,behavior:'instant'}));
 await expect(page.locator('#home-chart-year')).toHaveValue('2018');
 await page.locator('#home-risk [data-scroll-toggle]').click();await expect(page.locator('#home-chart-year')).toHaveValue('all');
 await page.locator('#locale-toggle').click();await expect(page.locator('#home-risk [data-scroll-toggle]')).toHaveText('跟随滚动');
 await expect(page.locator('#home-chart-year')).toHaveValue('all');
 await page.locator('#home-drawdown-chart svg').hover();await expect(page.locator('#home-risk [data-scroll-toggle]')).toHaveAttribute('aria-pressed','false');
});
test('mobile sticky figure stays contained and reduced motion restores normal reading',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('./');await step(page,'returns','2020');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const figure=page.locator('#research .scroll-figure');
 await expect(page.locator('#research')).toHaveAttribute('data-sticky','true');
 expect((await figure.boundingBox()).y).toBeGreaterThanOrEqual(-1);
 expect((await figure.boundingBox()).height).toBeLessThan(844*.78);
 await page.locator('#home-return-chart').dispatchEvent('pointerdown',{pointerType:'touch'});
 await page.locator('#home-return-chart').dispatchEvent('pointermove',{pointerType:'touch',movementX:0,movementY:40});
 await expect(page.locator('#research [data-scroll-toggle]')).toHaveAttribute('aria-pressed','true');
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('#research')).toHaveAttribute('data-scroll-enhanced','false');
 await expect(page.locator('#research [data-scroll-toggle]')).toBeHidden();
 await expect(page.locator('#return-reveal-width')).toHaveAttribute('width','880');
 expect(await figure.evaluate(el=>getComputedStyle(el).position)).toBe('static');
 await page.setViewportSize({width:900,height:400});await page.emulateMedia({reducedMotion:'no-preference'});
 await expect(page.locator('#research')).toHaveAttribute('data-sticky','false');
 await expect(page.locator('#research')).toHaveAttribute('data-scroll-enhanced','false');
 await expect(page.locator('#research [data-scroll-toggle]')).toBeDisabled();
});
test('without JavaScript the complete figures and all reading steps remain available',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});try{const page=await context.newPage();await page.goto('http://127.0.0.1:4381/a-study-in-small-caps/');
 await expect(page.locator('#home-return-chart')).toBeVisible();await expect(page.locator('#home-drawdown-chart svg')).toBeVisible();
 await expect(page.locator('[data-scroll-step]')).toHaveCount(9);await expect(page.locator('[data-scroll-toggle]').first()).toBeHidden();
 expect(await page.locator('#research .scroll-figure').evaluate(el=>getComputedStyle(el).position)).toBe('static');
 await page.locator('#cost-scenario details').first().locator('summary').click();await expect(page.locator('#cost-rows')).toBeVisible();
 }finally{await context.close();}
});

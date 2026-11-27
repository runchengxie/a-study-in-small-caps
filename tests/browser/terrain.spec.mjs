import { test, expect, chromium } from '@playwright/test';
test('software WebGL draws, pauses and falls back after context loss', async () => {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH,
    args: ['--disable-gpu', '--disable-dev-shm-usage', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  });
  try {
    const page = await browser.newPage({ reducedMotion: 'no-preference' });
    await page.goto('http://127.0.0.1:4381/a-study-in-small-caps/');
    await expect(page.locator('.hero')).toHaveClass(/terrain-ready/);
    await page.emulateMedia({reducedMotion:'reduce'});
    await expect(page.locator('.hero')).not.toHaveClass(/terrain-ready/);
    await expect(page.locator('.terrain-fallback')).toBeVisible();
    await page.emulateMedia({reducedMotion:'no-preference'});
    await expect(page.locator('.hero')).toHaveClass(/terrain-ready/);
    await page.locator('#motion-toggle').click();
    await expect(page.locator('#motion-toggle')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#particle-terrain').evaluate(canvas => {
      canvas.dispatchEvent(new Event('webglcontextlost'));
    });
    await expect(page.locator('.hero')).not.toHaveClass(/terrain-ready/);
    await expect(page.locator('.terrain-fallback')).toBeVisible();
    await expect(page.locator('#motion-toggle')).toBeHidden();
  } finally { await browser.close(); }
});

test('cover occupies the first screen and switches the publication identity', async ({page}) => {
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('./');
  await expect(page).toHaveTitle('Study in the Small');
  await expect(page.getByRole('heading', {level:1})).toHaveAccessibleName('Study in the Small');
  const bounds = await page.locator('#research').boundingBox();
  expect(bounds.y).toBeGreaterThanOrEqual(999);
  expect(bounds.y).toBeLessThanOrEqual(1001);
  await page.locator('#locale-toggle').click();
  await expect(page).toHaveTitle('小微盘研究');
  await expect(page.getByRole('heading', {level:1})).toHaveAccessibleName('小微盘研究');
  await page.setViewportSize({width:390,height:844});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.locator('.cover-enter').click();
  await expect(page).toHaveURL(/#research$/);
});

for (const viewport of [{width:1366,height:768},{width:375,height:667}]) {
 test(`cover entry stays within ${viewport.width}×${viewport.height}`, async ({page}) => {
  await page.setViewportSize(viewport);
  await page.goto('./');
  for(const language of ['en','zh']) {
   if(language==='zh')await page.locator('#locale-toggle').click();
   const entry=await page.locator('.cover-enter').boundingBox();
   const title=await page.locator('h1').boundingBox();
   const research=await page.locator('#research').boundingBox();
   expect(entry.y+entry.height).toBeLessThanOrEqual(viewport.height);
   expect(title.y+title.height).toBeLessThan(entry.y);
   expect(research.y).toBeCloseTo(viewport.height,0);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  }
 });
}

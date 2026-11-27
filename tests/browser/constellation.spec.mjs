import { test, expect, chromium } from '@playwright/test';
test('software WebGL draws, pauses and falls back after context loss', async () => {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH,
    args: ['--disable-gpu', '--disable-dev-shm-usage', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  });
  try {
    const page = await browser.newPage({ reducedMotion: 'no-preference' });
    await page.goto('http://127.0.0.1:4381/a-study-in-small-caps/');
    await expect(page.locator('.hero')).toHaveClass(/constellation-ready/);
    await page.locator('#motion-toggle').click();
    await expect(page.locator('#motion-toggle')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#market-constellation').evaluate(canvas => {
      canvas.dispatchEvent(new Event('webglcontextlost'));
    });
    await expect(page.locator('.hero')).not.toHaveClass(/constellation-ready/);
    await expect(page.locator('.hero-orbit')).toBeVisible();
    await expect(page.locator('#motion-toggle')).toBeHidden();
  } finally { await browser.close(); }
});

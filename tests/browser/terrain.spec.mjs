import { test, expect, chromium } from '@playwright/test';
test('author wave responds to pointer and scroll, pauses, and recovers context', async () => {
 const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH,args:['--disable-gpu','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try {
  const page = await browser.newPage({reducedMotion:'no-preference'});
  await page.goto('http://127.0.0.1:4381/a-study-in-small-caps/');
  const canvas=page.locator('#particle-terrain'), section=page.locator('.ef-pwave__sec').first();
  await expect(canvas).toBeVisible();
  await expect(page.locator('#motion-toggle')).toBeVisible();
  // Read the active WebGL camera and pointer input, independently of changing wave time.
  const uniform=name=>canvas.evaluate((c,key)=>{
   const gl=c.getContext('webgl'), program=gl.getParameter(gl.CURRENT_PROGRAM);
   return Array.from(gl.getUniform(program,gl.getUniformLocation(program,key)));
  },name);
  const hover=()=>canvas.evaluate(c=>{const gl=c.getContext('webgl'),p=gl.getParameter(gl.CURRENT_PROGRAM);return gl.getUniform(p,gl.getUniformLocation(p,'uHover'));});
  expect(await hover()).toBe(0);
  await page.mouse.move(950,600);
  await expect.poll(hover).toBeGreaterThan(.8);
  await page.mouse.move(0,0);
  await expect.poll(hover).toBeLessThan(.01);
  await page.locator('.ef-pwave').dispatchEvent('pointermove',{pointerType:'touch',clientX:950,clientY:600});
  await page.waitForTimeout(150); expect(await hover()).toBeLessThan(.01);
  await page.mouse.move(200,500); const before=await uniform('uMouse');
  await page.mouse.move(950,600);
  await expect.poll(()=>uniform('uMouse')).not.toEqual(before);
  const camera=await uniform('uView');
  await expect.poll(()=>uniform('uView')).not.toEqual(camera);
  await page.evaluate(()=>scrollTo(0,350));
  await expect.poll(()=>section.evaluate(n=>Number(n.style.opacity))).toBeLessThan(.8);
  await page.evaluate(()=>scrollTo(0,0));
  await expect.poll(()=>section.evaluate(n=>Number(n.style.opacity))).toBeGreaterThan(.99);
  await page.locator('#motion-toggle').click();
  await expect(page.locator('#motion-toggle')).toHaveAttribute('aria-pressed','true');
  const transform=await section.getAttribute('style');
  await page.evaluate(()=>{window.waveDraws=0;const draw=WebGLRenderingContext.prototype.drawArrays;WebGLRenderingContext.prototype.drawArrays=function(...args){window.waveDraws++;return draw.apply(this,args);};});
  await page.mouse.move(300,400); await page.evaluate(()=>scrollTo(0,200));
  await page.waitForTimeout(150); expect(await section.getAttribute('style')).toBe(transform);
  expect(await page.evaluate(()=>window.waveDraws)).toBe(0);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('#motion-toggle')).toBeHidden(); await expect(canvas).toBeVisible();
  expect(await hover()).toBe(0);
  const still=await section.getAttribute('style');
  await page.evaluate(()=>scrollTo(0,100)); await page.waitForTimeout(150);
  expect(await section.getAttribute('style')).toBe(still);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await expect(page.locator('#motion-toggle')).toBeVisible();
  await canvas.evaluate(c=>{window.waveContextExtension=c.getContext('webgl').getExtension('WEBGL_lose_context');window.waveContextExtension.loseContext();});
  await expect(canvas).toBeHidden();
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#motion-toggle')).toBeHidden();
  await page.evaluate(()=>window.waveContextExtension.restoreContext());
  await expect(canvas).toBeVisible();
  await expect(page.locator('#motion-toggle')).toBeVisible();
 } finally {await browser.close();}
});

test('cover occupies the first screen and switches the publication identity', async ({page}) => {
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('./');
  await expect(page).toHaveTitle('a study in small caps');
  await expect(page.getByRole('heading', {level:1})).toHaveAccessibleName('a study in small caps');
  const bounds = await page.locator('#research').boundingBox();
  expect(bounds.y).toBeGreaterThanOrEqual(999);
  expect(bounds.y).toBeLessThanOrEqual(1001);
  await page.locator('#locale-toggle').click();
  await expect(page).toHaveTitle('小微盘研究');
  await expect(page.getByRole('heading', {level:1})).toHaveAccessibleName('小微盘研究');
  const sizes=await page.locator('.cover-micro').evaluate(n=>({glyph:parseFloat(getComputedStyle(n).fontSize),line:parseFloat(getComputedStyle(n.closest('.ef-pwave__line')).fontSize)}));
  expect(sizes.glyph/sizes.line).toBeCloseTo(.82,2);
  await page.locator('#theme-select').selectOption('dark');
  await expect(page.locator('.cover-micro')).toHaveText('微');
  await page.locator('#locale-toggle').click();
  await expect(page.locator('.ef-pwave__t1')).toHaveText(/a study in/);
  await expect(page.locator('.cover-micro')).toBeHidden();
  await page.locator('#locale-toggle').click();
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

test('wave follows explicit and system themes without replacing its paused WebGL context', async () => {
 const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH,args:['--disable-gpu','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try {
  const page=await browser.newPage({colorScheme:'light'});
  await page.goto('http://127.0.0.1:4381/a-study-in-small-caps/');
  const canvas=page.locator('#particle-terrain');
  const state=()=>canvas.evaluate(c=>{
   const gl=c.getContext('webgl');
   return {background:Array.from(gl.getParameter(gl.COLOR_CLEAR_VALUE)),blend:gl.getParameter(gl.BLEND_DST_RGB),same:!window.savedWaveGL||window.savedWaveGL===gl};
  });
  await expect.poll(async()=> (await state()).blend).toBe(771); // ONE_MINUS_SRC_ALPHA
  await expect(page.locator('.ef-pwave__t1')).toHaveCSS('color','rgb(57, 45, 38)');
  await page.locator('#motion-toggle').click();
  await canvas.evaluate(c=>{window.savedWaveGL=c.getContext('webgl');window.waveDraws=0;const draw=WebGLRenderingContext.prototype.drawArrays;WebGLRenderingContext.prototype.drawArrays=function(...args){window.waveDraws++;return draw.apply(this,args);};});
  await page.locator('#theme-select').selectOption('dark');
  await expect.poll(async()=> (await state()).blend).toBe(1); // ONE
  expect((await state()).same).toBe(true);
  await expect(page.locator('.ef-pwave__t1')).toHaveCSS('color','rgb(243, 234, 222)');
  const draws=await page.evaluate(()=>window.waveDraws);
  expect(draws).toBeGreaterThan(0);await page.waitForTimeout(150);
  expect(await page.evaluate(()=>window.waveDraws)).toBe(draws);
  await page.locator('#theme-select').selectOption('system');
  await expect.poll(async()=> (await state()).blend).toBe(771);
  await page.emulateMedia({colorScheme:'dark'});
  await expect.poll(async()=> (await state()).blend).toBe(1);
  await page.emulateMedia({colorScheme:'light',reducedMotion:'reduce'});
  await expect.poll(async()=> (await state()).background[0]).toBeCloseTo(245/255,4);
  await canvas.evaluate(c=>{window.waveContextExtension=c.getContext('webgl').getExtension('WEBGL_lose_context');window.waveContextExtension.loseContext();});
  await expect(canvas).toBeHidden();await expect(page.locator('.ef-pwave')).toHaveCSS('background-color','rgb(245, 242, 234)');
  await page.evaluate(()=>window.waveContextExtension.restoreContext());await expect(canvas).toBeVisible();
  await expect.poll(async()=> (await state()).blend).toBe(771);
 }finally{await browser.close();}
});

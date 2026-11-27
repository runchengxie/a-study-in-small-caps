/** Typed publication adapter for the directly adopted Enrichr element. */
import { mount, type WaveOptions } from '../vendor/enrichr/particle-wave.js';
import { text } from './i18n';
export function initializeTerrain(): void {
 const root = document.querySelector<HTMLElement>('#particle-wave-root');
 const canvas = root?.querySelector<HTMLCanvasElement>('canvas');
 const hero = root?.querySelector<HTMLElement>('.ef-pwave');
 const button = document.querySelector<HTMLButtonElement>('#motion-toggle');
 if (!root || !canvas || !hero || !button) return;
 const media = matchMedia('(prefers-reduced-motion: reduce)');
 let paused = false;
 const options = (): WaveOptions => ({title1:text('coverLine1'),title2:text('coverLine2'),caption:text('coverNote'),next:text('exploreResearch'),labels:[text('waveDive'),text('waveGoing'),text('waveAlmost'),text('waveWelcome')]});
 const effect = mount(root, options());
 const controls = (): void => {
  button.hidden = media.matches || canvas.style.display === 'none';
  button.textContent = text(paused ? 'resumeMotion' : 'pauseMotion');
  button.setAttribute('aria-pressed', String(paused));
  hero.classList.toggle('motion-paused', paused || media.matches);
 };
 const motion = (): void => { effect.setMotion(paused,media.matches); effect.update(options()); controls(); };
 const toggle = (): void => { paused = !paused; motion(); };
 const language = (): void => {effect.update(options()); controls();};
 const lost = (): void => {controls();};
 button.addEventListener('click',toggle);
 media.addEventListener('change',motion);
 document.addEventListener('research:locale',language);
 canvas.addEventListener('webglcontextlost',lost);
 canvas.addEventListener('webglcontextrestored',lost);
 controls();
 window.addEventListener('pagehide', (event: PageTransitionEvent) => {
  if (event.persisted) return;
  effect.destroy();
  button.removeEventListener('click',toggle);
  media.removeEventListener('change',motion);
  document.removeEventListener('research:locale',language);
  canvas.removeEventListener('webglcontextlost',lost);
  canvas.removeEventListener('webglcontextrestored',lost);
 });
}

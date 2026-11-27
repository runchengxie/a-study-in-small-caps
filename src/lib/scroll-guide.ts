import ui from '../data/home-story-ui.json';
import {local} from './i18n';

/** Progressive enhancement: native scrolling selects documented chart states. */
export function initializeScrollGuide() {
 const chapters=[...document.querySelectorAll<HTMLElement>('[data-scroll-chapter]')];
 if(!chapters.length)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const buttons=[...document.querySelectorAll<HTMLButtonElement>('[data-scroll-toggle]')];
 const visible=new Set<HTMLElement>();
 const selected=new Map<HTMLElement,string>();
 let follow=!reduced.matches,frame=0;
 const updateControls=()=>{
  for(const button of buttons){button.setAttribute('aria-pressed',String(follow));button.textContent=local(ui.follow);button.closest<HTMLElement>('.scroll-controls')!.hidden=reduced.matches;button.disabled=button.closest<HTMLElement>('[data-scroll-chapter]')!.dataset.sticky!=='true';if(button.disabled)button.setAttribute('aria-pressed','false');}
  for(const hint of document.querySelectorAll<HTMLElement>('[data-scroll-hint]')){hint.hidden=reduced.matches;hint.textContent=local(hint.closest<HTMLElement>('[data-scroll-chapter]')!.dataset.sticky!=='true'?ui.staticHint:follow?ui.followHint:ui.freeHint);}
 };
 const fit=()=>{
  for(const chapter of chapters){
   const figure=chapter.querySelector<HTMLElement>('.scroll-figure')!;
   const fits=!reduced.matches&&figure.offsetHeight<=innerHeight*.78;
   if(chapter.dataset.sticky!==String(fits))selected.delete(chapter);
   chapter.dataset.scrollEnhanced=String(fits);
   chapter.dataset.sticky=String(fits);
   if(!fits&&chapter.dataset.scrollChapter==='returns')document.querySelector('#return-reveal-width')?.setAttribute('width','880');
  }
  updateControls();
 };
 const update=()=>{
  frame=0;if(!follow||document.hidden)return;
  for(const chapter of visible){
   if(chapter.dataset.sticky!=='true')continue;
   const steps=[...chapter.querySelectorAll<HTMLElement>('[data-scroll-step]')];
   const figure=chapter.querySelector<HTMLElement>('.scroll-figure')!;
   const line=innerWidth<=800&&chapter.dataset.sticky==='true'?Math.min(innerHeight*.88,figure.offsetHeight+32+(innerHeight-figure.offsetHeight-32)*.45):innerHeight*.55;
   let index=0;steps.forEach((step,i)=>{if(step.getBoundingClientRect().top<=line)index=i;});
   const step=steps[index],value=step.dataset.scrollStep!;
   if(selected.get(chapter)===value)continue;
   selected.set(chapter,value);chapter.dataset.activeStep=value;
   steps.forEach(s=>{if(s===step)s.setAttribute('aria-current','step');else s.removeAttribute('aria-current');});
   chapter.querySelector('[data-scroll-position]')!.textContent=`${String(index+1).padStart(2,'0')} / ${String(steps.length).padStart(2,'0')}`;
   document.dispatchEvent(new CustomEvent('research:story-step',{detail:{chapter:chapter.dataset.scrollChapter,value}}));
  }
 };
 const schedule=()=>{if(!frame&&follow&&visible.size&&!document.hidden)frame=requestAnimationFrame(update);};
 const setFollow=(next:boolean)=>{
  follow=next&&!reduced.matches;selected.clear();updateControls();
  for(const chapter of chapters){chapter.querySelector<HTMLElement>('[data-scroll-position]')!.hidden=!follow;if(!follow){delete chapter.dataset.activeStep;chapter.querySelectorAll('[aria-current=step]').forEach(step=>step.removeAttribute('aria-current'));}}
  document.dispatchEvent(new CustomEvent('research:story-mode',{detail:{follow}}));
  if(!follow&&frame){cancelAnimationFrame(frame);frame=0;}
  schedule();
 };
 buttons.forEach(button=>button.addEventListener('click',()=>setFollow(!follow)));
 for(const chapter of chapters){
  const figure=chapter.querySelector<HTMLElement>('.scroll-figure')!;
  const manual=(event:Event)=>{if(follow&&(event.target as Element).closest('input,select,svg[tabindex]'))setFollow(false);};
  figure.addEventListener('pointermove',event=>{if(event.pointerType==='mouse'&&(event.movementX!==0||event.movementY!==0)&&(event.target as Element).closest('svg[tabindex]'))manual(event);});
  figure.addEventListener('input',manual);figure.addEventListener('change',manual);figure.addEventListener('pointerdown',event=>{if(event.pointerType!=='touch'||(event.target as Element).closest('input,select'))manual(event);});
  figure.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))manual(event);});
 }
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){const chapter=entry.target as HTMLElement;if(entry.isIntersecting)visible.add(chapter);else visible.delete(chapter);}schedule();});
 chapters.forEach(chapter=>observer.observe(chapter));
 const resize=new ResizeObserver(()=>{fit();schedule();});chapters.forEach(chapter=>resize.observe(chapter.querySelector('.scroll-figure')!));
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',()=>{fit();schedule();},{passive:true});
 addEventListener('pageshow',()=>{selected.clear();fit();schedule();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0;}else schedule();});
 reduced.addEventListener('change',()=>{updateControls();fit();setFollow(false);});
 document.addEventListener('research:locale',()=>{updateControls();fit();schedule();});
 updateControls();fit();schedule();
}

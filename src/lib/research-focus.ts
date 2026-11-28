import atlas from '../data/atlas.json';
import windows from '../data/window-review.json';
import catalog from '../data/research-focus-ui.json';
import research from '../data/research.json';
import {local,format} from './i18n';
type Row=Record<string,string|number|null>;
const ui:Record<string,{en:string;zh:string}>=catalog;
const label=(key:string)=>local(ui[key]??{en:key,zh:key});
const ns='http://www.w3.org/2000/svg';
export function initializeResearchFocus(){
 for(const root of document.querySelectorAll<HTMLElement>('[data-focus]')){
  const control=(name:string)=>(root.querySelector(`[data-control="${name}"]`) as HTMLSelectElement)?.value;
  const render=()=>{
   const kind=root.dataset.focus;
   let entries:{name:string;value:number;low?:number;high?:number}[]=[];
   let columns:string[]=[],tableRows:string[][]=[],metric='';
   let sourceId='SRC-ARCHIVE';
   if(kind==='conditioning'){
    const panel=atlas.panels.find(p=>p.id==='conditioning')!;
    const rows=(panel.rows as unknown as Row[]).filter(r=>r.universe===control('universe')&&(/:conditional$|:unconditional_common$/).test(String(r.coefficient)));
    metric=label('controlConditional');sourceId=panel.sourceId;
    entries=rows.map(r=>{const [term,stage]=String(r.coefficient).split(':');return {name:`${label(term)} · ${label(stage==='conditional'?'controlConditional':'controlCommon')}`,value:Number(r.coefficient_mean)*100,low:Number(r.ci95_low)*100,high:Number(r.ci95_high)*100};});
    columns=[label('candidate'),label('numericValue'),label('interval')];tableRows=entries.map(e=>[e.name,format(e.value,{maximumFractionDigits:4}),`${format(e.low!,{maximumFractionDigits:4})} … ${format(e.high!,{maximumFractionDigits:4})}`]);
   }else if(kind==='exclusion'){
    const panel=atlas.panels.find(p=>p.id==='exclusion')!;sourceId=panel.sourceId;metric=label(control('metric'));
    const rows=(panel.rows as unknown as Row[]).filter(r=>r.weighting===control('weighting')&&r.buffer_setting===control('buffer'));
    entries=rows.map(r=>({name:`${label(String(r.candidate))} · ${format(Number(r.exclusion_percentile),{style:'percent',maximumFractionDigits:0})}`,value:Number(r[control('metric')])}));
    columns=[label('candidate'),metric];tableRows=entries.map(e=>[e.name,format(e.value,{maximumFractionDigits:4})]);
   }else{
    metric=label(control('metric'));const rows=windows.rows.filter(r=>control('days')==='all'||String(r.days)===control('days'));
    entries=rows.map(r=>({name:`${r.days} · ${label(r.variant==='rerun'&&r.days===120?'rerun120':r.variant)}`,value:Number((r as unknown as Row)[control('metric')])}));
    columns=[label('days'),label('variant'),metric];tableRows=rows.map(r=>[String(r.days),label(r.variant==='rerun'&&r.days===120?'rerun120':r.variant),format(Number((r as unknown as Row)[control('metric')]),{maximumFractionDigits:6})]);
   }
   const values=entries.flatMap(e=>[e.value,e.low??e.value,e.high??e.value]);const low=Math.min(0,...values),high=Math.max(0,...values);const span=high-low||1;const x=(v:number)=>345+(v-low)/span*410;const height=entries.length*60+42;
   const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox',`0 0 900 ${height}`);svg.setAttribute('role','img');svg.setAttribute('aria-label',metric);
   const text=(content:string,px:number,py:number)=>{const t=document.createElementNS(ns,'text');t.setAttribute('x',String(px));t.setAttribute('y',String(py));t.setAttribute('font-size','12');t.setAttribute('fill','currentColor');t.textContent=content;svg.append(t);};
   const zero=document.createElementNS(ns,'line');for(const [k,v] of Object.entries({x1:x(0),x2:x(0),y1:8,y2:height-22}))zero.setAttribute(k,String(v));zero.setAttribute('stroke','currentColor');zero.setAttribute('opacity','.3');svg.append(zero);
   entries.forEach((e,i)=>{const y=28+i*60;const width=/[\u3400-\u9fff]/.test(e.name)?24:45;text(e.name.slice(0,width),5,y-3);if(e.name.length>width)text(e.name.slice(width,width*2)+(e.name.length>width*2?'…':''),5,y+13);
    if(e.low!==undefined){const line=document.createElementNS(ns,'line');line.setAttribute('x1',String(x(e.low)));line.setAttribute('x2',String(x(e.high!)));line.setAttribute('y1',String(y));line.setAttribute('y2',String(y));line.setAttribute('stroke','var(--plot-series)');line.setAttribute('stroke-width','3');svg.append(line);const dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',String(x(e.value)));dot.setAttribute('cy',String(y));dot.setAttribute('r','5');dot.setAttribute('fill','var(--accent)');svg.append(dot);
    }else{const rect=document.createElementNS(ns,'rect');rect.setAttribute('x',String(Math.min(x(0),x(e.value))));rect.setAttribute('y',String(y-12));rect.setAttribute('width',String(Math.max(1,Math.abs(x(e.value)-x(0)))));rect.setAttribute('height','24');rect.setAttribute('fill',/drawdown/i.test(control('metric'))?'var(--plot-negative)':/return/i.test(control('metric'))?(e.value>=0?'var(--plot-positive)':'var(--plot-negative)'):'var(--plot-series)');svg.append(rect);}
    text(format(e.value,{maximumFractionDigits:3}),775,y+4);
   });root.querySelector('.focus-chart')!.replaceChildren(svg);
   const head=document.createElement('tr');columns.forEach(name=>{const th=document.createElement('th');th.scope='col';th.textContent=name;head.append(th);});root.querySelector('thead')!.replaceChildren(head);
   root.querySelector('tbody')!.replaceChildren(...tableRows.map(row=>{const tr=document.createElement('tr');row.forEach(value=>{const td=document.createElement('td');td.textContent=value;tr.append(td);});return tr;}));
   const source=sourceId==='SRC-ARCHIVE'?research.sources.find(s=>s.id===sourceId)!:atlas.items.find(s=>s.id===sourceId)!;if(!source.sha256)throw new Error('Missing reviewed source hash');const a=document.createElement('a');a.href=source.url;a.textContent=`${label('source')} · SHA-256 ${source.sha256.slice(0,12)}`;root.querySelector('.focus-source')!.replaceChildren(a);
  };
  root.querySelectorAll('select').forEach(field=>field.addEventListener('change',render));document.addEventListener('research:locale',render);render();
 }
}

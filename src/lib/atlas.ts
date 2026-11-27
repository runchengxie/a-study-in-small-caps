import atlas from '../data/atlas.json';
import {text, local, format} from './i18n.ts';
type Value = string | number | null;
type Row = Record<string,Value>;
type Panel = {id:string;sourceId:string;title:{en:string;zh:string};limits:{en:string;zh:string};dimensions:string[];metrics:string[];units:{en:string;zh:string};rows:Row[];fieldLabels?:Record<string,string>;dimensionValues?:Record<string,Record<string,string>>};
const panels: Panel[]=atlas.panels as Panel[];
const element=(id:string)=>document.getElementById(id)!;
const select=(id:string)=>element(id) as HTMLSelectElement;
const escape=(value:unknown)=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const label=(key:string)=>text('atlasField_'+key);
const valueLabel=(value:Value)=>['A-share','HK','US','JP'].includes(String(value))?text(String(value)):String(value??'—');
export function initializeAtlas(){
 const filters=new Map<string,string>();
 const current=()=>panels.find(p=>p.id===select('atlas-panel').value)??panels[0];
 const option=(value:string,caption:string)=>{const o=document.createElement('option');o.value=value;o.textContent=caption;return o;};
 const render=()=>{
  const panel=current();const metric=select('atlas-metric').value;const fieldLabel=(key:string)=>panel.fieldLabels?.[key]?text(panel.fieldLabels[key]):label(key);const shownValue=(key:string,value:Value)=>panel.dimensionValues?.[key]?.[String(value)]??valueLabel(value);
  const rows=panel.rows.filter(row=>panel.dimensions.every(key=>!filters.get(key)||String(row[key])===filters.get(key)));
  element('atlas-title').textContent=local(panel.title);element('atlas-limit').textContent=local(panel.limits);element('atlas-units').textContent=local(panel.units);
  element('atlas-count').textContent=`${text('atlasRows')}: ${format(rows.length)}`;
  const source=atlas.items.find(item=>item.id===panel.sourceId)!;
  const anchor=document.createElement('a');anchor.href=`#source-${source.id}`;anchor.textContent=`${text('sourceDetails')} · ${source.sha256.slice(0,12)}`;element('atlas-source').replaceChildren(anchor);
  const shown=rows.slice(0,24);element('atlas-chart-note').textContent=rows.length>24?text('atlasChartLimit'):'';
  const values=shown.map(row=>row[metric]).filter((v):v is number=>typeof v==='number'&&Number.isFinite(v));
  const low=Math.min(0,...values);const high=Math.max(0,...values);const span=high-low||1;const x=(v:number)=>390+(v-low)/span*340;const zero=x(0);const height=Math.max(140,shown.length*44+50);
  element('atlas-chart').innerHTML=shown.length?`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 ${height}" role="img" aria-label="${escape(fieldLabel(metric))}"><line x1="${zero}" x2="${zero}" y1="8" y2="${height-30}" stroke="currentColor" opacity=".3"/>${shown.map((row,i)=>{const val=row[metric];const y=16+i*44;const name=panel.dimensions.map(k=>shownValue(k,row[k])).join(' · ');return `<text x="8" y="${y+20}" fill="currentColor" font-size="11">${escape(name.length>59?name.slice(0,56)+'…':name)}</text>${typeof val==='number'?`<rect x="${Math.min(zero,x(val))}" y="${y}" width="${Math.max(1,Math.abs(x(val)-zero))}" height="28" fill="${val<0?'var(--plot-negative)':'var(--plot-positive)'}"><title>${escape(name)}: ${escape(format(val,{maximumFractionDigits:6}))}</title></rect>`:''}<text x="744" y="${y+20}" fill="currentColor" font-size="12">${val===null?'—':escape(format(Number(val),{maximumFractionDigits:4}))}</text>`;}).join('')}</svg>`:`<p>${escape(text('atlasEmpty'))}</p>`;
  const keys=[...panel.dimensions,metric];const head=document.createElement('tr');for(const key of keys){const th=document.createElement('th');th.textContent=fieldLabel(key);head.append(th);}element('atlas-head').replaceChildren(head);element('atlas-body').replaceChildren();for(const row of rows){const tr=document.createElement('tr');for(const key of keys){const td=document.createElement('td');td.textContent=key===metric&&typeof row[key]==='number'?format(row[key],{maximumFractionDigits:8}):shownValue(key,row[key]);tr.append(td);}element('atlas-body').append(tr);}
 };
 const setup=(preserve=false)=>{
  const panel=current();const old=select('atlas-metric').value;select('atlas-metric').replaceChildren(...panel.metrics.map(k=>option(k,panel.fieldLabels?.[k]?text(panel.fieldLabels[k]):label(k))));if(preserve&&panel.metrics.includes(old))select('atlas-metric').value=old;
  element('atlas-filters').replaceChildren();for(const key of panel.dimensions){const wrapper=document.createElement('label');wrapper.append(label(key));const field=document.createElement('select');field.setAttribute('aria-label',label(key));field.dataset.dimension=key;field.append(option('',text('atlasAll')),...[...new Set(panel.rows.map(row=>String(row[key])))].map(value=>option(value,panel.dimensionValues?.[key]?.[value]??valueLabel(value))));field.value=filters.get(key)??'';field.addEventListener('change',()=>{filters.set(key,field.value);render();});wrapper.append(field);element('atlas-filters').append(wrapper);}render();
 };
 select('atlas-panel').addEventListener('change',()=>{filters.clear();setup();});select('atlas-metric').addEventListener('change',render);element('atlas-reset').addEventListener('click',()=>{filters.clear();setup(true);});
 const search=()=>{(element('atlas-search') as HTMLInputElement).placeholder=text('atlasSearchPlaceholder');const query=(element('atlas-search') as HTMLInputElement).value.toLowerCase().trim();let count=0;document.querySelectorAll<HTMLElement>('[data-atlas-search]').forEach(record=>{record.hidden=!record.dataset.atlasSearch!.includes(query);if(!record.hidden)count++;});element('atlas-source-count').textContent=`${format(count)} / ${format(atlas.items.length)}`;};element('atlas-search').addEventListener('input',search);document.addEventListener('research:locale',()=>{setup(true);search();});setup();search();
}

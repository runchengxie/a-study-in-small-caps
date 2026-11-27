import ui from '../data/ui.json' with {type:'json'};
type Localized = string | { en: string; zh?: string };
interface ResearchRecord {
 id: string; slug?: string; title?: Localized; summary?: Localized; stage?: string; url?: string;
 authors?: string[]; description?: Localized; updated?: string; date?: string; version?: string; markets?: string[]; topics?: string[]; year?: number; sourceIds?: string[]; claimIds?: string[];
 literatureIds?: string[]; investigationIds?: string[]; relatedIds?: string[]; literatureId?: string; investigationId?: string;
 status?: string;
}
interface ResearchData { investigations: ResearchRecord[]; literature: ResearchRecord[]; claims: ResearchRecord[]; sources: ResearchRecord[]; history: ResearchRecord[]; crosschecks: ResearchRecord[]; }
interface SearchFilters {query?: string; type?: string; market?: string; stage?: string; topic?: string; year?: string;}
interface NavRow {date: string; nav: number;}
interface MicrocapData {microcap: {sourceId: string; series: {count: number; rows: NavRow[]}[]; summary: {count: number; maxDrawdown: number; longestUnderwater: number}[];};}
interface LiquidityRow {market: string; bucket: number; medianUSD: number | null; observations: number; stocks: number;}
interface LiquidityData {liquidity: {sourceId: string; relativeSourceId?: string; periods: {id: string; start: string; end: string; markets: string[]; absolute: LiquidityRow[]; relative: LiquidityRow[]}[];};}
const catalog: Record<string, {en: string; zh?: string}> = ui;
/** Language-neutral content contracts and evidence selectors. No data-source access. */
export function validateResearch(data: ResearchData) {
  const groups: (keyof ResearchData)[]=['investigations','literature','claims','sources','history','crosschecks'];
  const identities=new Map<string, keyof ResearchData>();
  for (const group of groups) {
    if (!Array.isArray(data[group])) throw new Error(`missing collection ${group}`);
    for (const row of data[group]) {
      if (!row.id || identities.has(row.id)) throw new Error(`duplicate or missing id: ${row.id}`);
      identities.set(row.id,group);
    }
  }
  const ref=(id: string,group: keyof ResearchData)=>{if(identities.get(id)!==group) throw new Error(`missing ${group} reference: ${id}`);};
  for (const group of groups) for(const row of data[group]) {
    for(const [field,target] of ([['sourceIds','sources'],['claimIds','claims'],['literatureIds','literature'],['investigationIds','investigations']] as const))
      for(const id of row[field]??[]) ref(id,target);
    if(row.literatureId) ref(row.literatureId,'literature');
    if(row.investigationId) ref(row.investigationId,'investigations');
    for(const id of row.relatedIds??[]) if(!identities.has(id)) throw new Error(`missing history reference: ${id}`);
  }
  const slugs=new Set();
  for(const chapter of data.investigations) {
    if(!/^[a-z0-9-]+$/.test(chapter.slug ?? '')||slugs.has(chapter.slug)) throw new Error(`duplicate or invalid slug: ${chapter.slug}`);
    slugs.add(chapter.slug);
    for(const field of (['title','summary'] as const)) if(!chapter[field] || typeof chapter[field] === 'string' || !chapter[field]?.en) throw new Error(`missing English ${chapter.id}.${field}`);
  }
  for(const paper of data.literature) {
    if(!['abstract','author_summary','fulltext','replicated'].includes(paper.stage ?? '')) throw new Error(`invalid literature stage: ${paper.id}`);
    if(!/^https:\/\//.test(paper.url ?? '')) throw new Error(`invalid paper URL: ${paper.id}`);
  }
  for(const crosscheck of data.crosschecks) if(!['untested','not_comparable','supports','conflicts'].includes(String(crosscheck.status))) throw new Error(`invalid cross-check: ${crosscheck.id}`);
  return true;
}
const normalize=(value: unknown)=>String(value??'').normalize('NFKC').toLowerCase();
export function searchRecords(data: ResearchData,filters: SearchFilters={}) {
  const docs=[...(data.investigations??[]).map(row=>({...row,type:'investigation',href:`investigations/${row.slug}/`})),...(data.literature??[]).map(row=>({...row,type:'literature',href:`literature/#${row.id}`})),...(data.history??[]).map(row=>({...row,type:'history',href:`history/#${row.id}`}))];
  const terms=normalize(filters.query).trim().split(/\s+/).filter(Boolean);
  return docs.filter(row=> (!filters.type||filters.type==='all'||row.type===filters.type)
    &&(!filters.market||filters.market==='all'||row.markets?.includes(filters.market))
    &&(!filters.stage||filters.stage==='all'||row.stage===filters.stage)
    &&(!filters.topic||filters.topic==='all'||row.topics?.includes(filters.topic))
    &&(!filters.year||filters.year==='all'||String(row.year)===String(filters.year))
    &&terms.every(term=>normalize(JSON.stringify([row,...[...(row.markets??[]),...(row.topics??[]),row.stage].map(key=>catalog[key ?? '']).filter(Boolean)])).includes(term)));
}
export function selectMicrocap(data: MicrocapData,{count=400,granularity='monthly'}: {count?: number; granularity?: string}={}) {
  const evidence=data.microcap;
  const series=evidence.series.find(row=>Number(row.count)===Number(count));
  const summary=evidence.summary.find(row=>Number(row.count)===Number(count))??null;
  const rows=series?.rows??[];
  if(granularity==='daily') return {sourceId:evidence.sourceId,summary,rows};
  const periods=new Map<string, NavRow>();
  for(const row of rows) periods.set(row.date.slice(0,granularity==='annual'?4:7),row);
  return {sourceId:evidence.sourceId,summary,rows:[...periods.values()]};
}
export function selectLiquidity(data: LiquidityData,{period,basis='absolute',bucket=0,market='all'}: {period?: string; basis?: 'absolute' | 'relative'; bucket?: number; market?: string}={}) {
  const evidence=data.liquidity;
  const selected=evidence.periods.find(row=>row.id===period)??null;
  return {sourceId:basis==='relative'?(evidence.relativeSourceId??evidence.sourceId):evidence.sourceId,period:selected,rows:(selected?.[basis]??[]).filter(row=>row.bucket===Number(bucket)&&(market==='all'||row.market===market))};
}

export function recordLink(data: ResearchData,id: string){
 const chapter=data.investigations.find(r=>r.id===id);if(chapter)return {href:`investigations/${chapter.slug}/`,title:chapter.title};
 const claim=data.claims.find(r=>r.id===id);if(claim)return {href:`history/#${id}`,title:claim.title??id};
 const paper=data.literature.find(r=>r.id===id);if(paper)return {href:`literature/#${id}`,title:paper.title};
 const source=data.sources.find(r=>r.id===id);if(source)return {href:`methods/#${id}`,title:source.title??id};
 const history=data.history.find(r=>r.id===id);return history?{href:`history/#${id}`,title:history.title}:null;
}

/** Language-neutral content contracts and evidence selectors. No data-source access. */
export function validateResearch(data) {
  const groups=['investigations','literature','claims','sources','history','crosschecks'];
  const identities=new Map();
  for (const group of groups) {
    if (!Array.isArray(data[group])) throw new Error(`missing collection ${group}`);
    for (const row of data[group]) {
      if (!row.id || identities.has(row.id)) throw new Error(`duplicate or missing id: ${row.id}`);
      identities.set(row.id,group);
    }
  }
  const ref=(id,group)=>{if(identities.get(id)!==group) throw new Error(`missing ${group} reference: ${id}`);};
  for (const group of groups) for(const row of data[group]) {
    for(const [field,target] of [['sourceIds','sources'],['claimIds','claims'],['literatureIds','literature'],['investigationIds','investigations']])
      for(const id of row[field]??[]) ref(id,target);
    if(row.literatureId) ref(row.literatureId,'literature');
    if(row.investigationId) ref(row.investigationId,'investigations');
    for(const id of row.relatedIds??[]) if(!identities.has(id)) throw new Error(`missing history reference: ${id}`);
  }
  const slugs=new Set();
  for(const chapter of data.investigations) {
    if(!/^[a-z0-9-]+$/.test(chapter.slug)||slugs.has(chapter.slug)) throw new Error(`duplicate or invalid slug: ${chapter.slug}`);
    slugs.add(chapter.slug);
    for(const field of ['title','summary']) if(!chapter[field]?.en) throw new Error(`missing English ${chapter.id}.${field}`);
  }
  for(const paper of data.literature) {
    if(!['abstract','author_summary','fulltext','replicated'].includes(paper.stage)) throw new Error(`invalid literature stage: ${paper.id}`);
    if(!/^https:\/\//.test(paper.url)) throw new Error(`invalid paper URL: ${paper.id}`);
  }
  for(const crosscheck of data.crosschecks) if(!['untested','not_comparable','supports','conflicts'].includes(crosscheck.status)) throw new Error(`invalid cross-check: ${crosscheck.id}`);
  return true;
}
const normalize=value=>String(value??'').normalize('NFKC').toLowerCase();
export function searchRecords(data,filters={}) {
  const docs=[...(data.investigations??[]).map(row=>({...row,type:'investigation',href:`investigations/${row.slug}/`})),...(data.literature??[]).map(row=>({...row,type:'literature',href:`literature/#${row.id}`})),...(data.history??[]).map(row=>({...row,type:'history',href:`history/#${row.id}`}))];
  const terms=normalize(filters.query).trim().split(/\s+/).filter(Boolean);
  return docs.filter(row=> (!filters.type||filters.type==='all'||row.type===filters.type)
    &&(!filters.market||filters.market==='all'||row.markets?.includes(filters.market))
    &&(!filters.stage||filters.stage==='all'||row.stage===filters.stage)
    &&(!filters.topic||filters.topic==='all'||row.topics?.includes(filters.topic))
    &&(!filters.year||filters.year==='all'||String(row.year)===String(filters.year))
    &&terms.every(term=>normalize(JSON.stringify(row)).includes(term)));
}
export function selectMicrocap(data,{count=400,granularity='monthly'}={}) {
  const evidence=data.microcap;
  const series=evidence.series.find(row=>Number(row.count)===Number(count));
  const summary=evidence.summary.find(row=>Number(row.count)===Number(count))??null;
  const rows=series?.rows??[];
  if(granularity==='daily') return {sourceId:evidence.sourceId,summary,rows};
  const periods=new Map();
  for(const row of rows) periods.set(row.date.slice(0,granularity==='annual'?4:7),row);
  return {sourceId:evidence.sourceId,summary,rows:[...periods.values()]};
}
export function selectLiquidity(data,{period,basis='absolute',bucket=0,market='all'}={}) {
  const evidence=data.liquidity;
  const selected=evidence.periods.find(row=>row.id===period)??null;
  return {sourceId:evidence.sourceId,period:selected,rows:(selected?.[basis]??[]).filter(row=>row.bucket===Number(bucket)&&(market==='all'||row.market===market))};
}

import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const hash=value=>createHash('sha256').update(value).digest('hex');
export function validateAtlas(atlas,ui){
 const ids=new Set();for(const source of atlas.items){assert(!ids.has(source.id),`Duplicate ${source.id}`);ids.add(source.id);assert.match(source.sha256,/^[a-f0-9]{64}$/);assert.match(source.revision,/^[a-f0-9]{40}$/);assert(source.url.includes(source.revision));for(const field of ['title','family','stage','limits'])for(const lang of ['en','zh'])assert(source[field]?.[lang],`${source.id} ${field} ${lang}`);}
 for(const panel of atlas.panels){assert(ids.has(panel.sourceId));assert.equal(hash(JSON.stringify(panel.rows)),panel.projectionSha256);assert(panel.rows.length);for(const field of [...panel.dimensions,...panel.metrics]){assert(ui['atlasField_'+field]?.en||/^p\d+$/.test(field),`Uncatalogued ${field}`);for(const row of panel.rows)assert(Object.hasOwn(row,field),`${panel.id} ${field}`);}for(const row of panel.rows)for(const metric of panel.metrics)assert(row[metric]===null||typeof row[metric]==='number',`Invalid numeric metric ${metric}`);assert(!/execution-costs/.test(panel.sourceId),'BMLL source projections are prohibited');assert(panel.rows.every(row=>!Object.hasOwn(row,'ticker')&&!Object.hasOwn(row,'symbol')));}
 const demo=atlas.panels.find(panel=>panel.id==='demo');assert(demo?.limits.en.includes('synthetic'));
 return {sources:atlas.items.length,panels:atlas.panels.length,rows:atlas.panels.reduce((n,p)=>n+p.rows.length,0)};
}
export function verifyOriginals(atlas,roots){
 let checked=0;for(const source of atlas.items){const repo=source.id.startsWith('observatory-')?roots.observatory:roots.market;assert(repo,'Both source repository roots are required');const bytes=readFileSync(join(repo,source.sourcePath));assert.equal(hash(bytes),source.sha256,source.id);const original=JSON.parse(bytes.toString());for(const panel of atlas.panels.filter(p=>p.sourceId===source.id)){const rows=panel.sourceRowsPath.split('.').reduce((object,key)=>object[key],original);assert.deepEqual(panel.rows,rows.map(row=>Object.fromEntries(panel.rowFields.map(field=>[field,row[field]??null]))),panel.id);}checked++;}return checked;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const atlas=JSON.parse(readFileSync('src/data/atlas.json'));const ui=JSON.parse(readFileSync('src/data/ui.json'));console.log('Atlas validation:',validateAtlas(atlas,ui));if(process.env.ATLAS_MARKET_SOURCE||process.env.ATLAS_OBSERVATORY_SOURCE)console.log('Immutable source files verified:',verifyOriginals(atlas,{market:process.env.ATLAS_MARKET_SOURCE,observatory:process.env.ATLAS_OBSERVATORY_SOURCE}));}

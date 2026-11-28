import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';import {validateResearch} from '../src/lib/research.ts';
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
test('published records preserve archived claims and explicitly distinguish review stages',()=>{const r=load('src/data/research.json');assert.equal(validateResearch(r),true);assert.deepEqual(r.claims.map(c=>c.id).sort(),['MC-C01','MC-C02','MC-C03','MC-C04','MC-C05','MC-C06']);for(const id of ['INV-001','INV-002','INV-003'])assert.ok(r.investigations.some(row=>row.id===id));assert.ok(r.investigations.length>=5);assert.equal(r.literature.length,20);assert.ok(r.literature.every(p=>['abstract','author_summary','fulltext'].includes(p.stage)));assert.equal(r.literature.filter(p=>p.stage==='fulltext').length,4);assert.ok(r.crosschecks.every(c=>['untested','not_comparable'].includes(c.status)));assert.ok(r.crosschecks.some(c=>c.status==='untested'));assert.ok(r.crosschecks.some(c=>c.status==='not_comparable'));});
test('NAV projection retains exact observations and early summaries never create synthetic curves',()=>{const source=load('public/evidence/microcap_nav.json');const evidence=load('src/data/evidence.json').microcap;assert.equal(evidence.series.length,1);assert.equal(evidence.series[0].count,400);assert.deepEqual(evidence.series[0].rows,source.map(r=>({date:r.date,nav:r.nav})));assert.deepEqual(evidence.summary.map(r=>r.count),[50,100,200,400,800]);assert.equal(evidence.summaryUnit,'fraction');assert.equal(evidence.summaryPeriod.end,'2014-12-31');assert.ok(evidence.series[0].rows[0].date>'2014-12-31');});
test('all vendored source bytes have a pinned provenance hash',()=>{const r=load('src/data/research.json');for(const name of fs.readdirSync('public/evidence')){const bytes=fs.readFileSync(`public/evidence/${name}`);assert.ok(r.sources.some(s=>s.sha256===crypto.createHash('sha256').update(bytes).digest('hex')),name);}});

test('breadth protocol retains methods-only claims and preliminary reading stages',()=>{
 const r=load('src/data/research.json');const inv=r.investigations.find(i=>i.id==='INV-011');
 assert.equal(inv.stage,'methods');assert.deepEqual(inv.claimIds,[]);
 const additions=r.literature.filter(p=>Number(p.id.slice(4))>=11);
 assert.equal(additions.length,10);
 for(const paper of additions){
  assert.ok(['abstract','author_summary'].includes(paper.stage),paper.id);
  const checks=r.crosschecks.filter(c=>c.literatureId===paper.id&&c.investigationId===inv.id);
  assert.equal(checks.length,1);assert.equal(checks[0].status,'untested');assert.deepEqual(checks[0].claimIds,[]);
 }
});

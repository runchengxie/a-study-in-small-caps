import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import {validateRoadmap} from '../src/lib/roadmap.ts';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const agenda=()=>read('public/evidence/research-roadmap.json');
test('task map admits the exact source-pinned bilingual agenda and bounded target diagnostic',()=>{
 const r=read('src/data/research.json');assert.equal(validateRoadmap(agenda()),true);assert.equal(agenda().tasks.length,30);
 for(const [file,id] of [['research-roadmap.json','SRC-SMALLCAP-ROADMAP'],['target-support-roadmap.json','SRC-TARGET-SUPPORT-ROADMAP']]){
  const hash=crypto.createHash('sha256').update(fs.readFileSync('public/evidence/'+file)).digest('hex');assert.equal(hash,r.sources.find(s=>s.id===id).sha256);
 }
 const p=read('public/evidence/target-support-roadmap.json');assert.equal(p.formations.supported,137);assert.equal(p.formations.unsupported,1);assert.equal(p.verified_target_groups,822);assert.equal(p.verified_transitions,816);
 for(const key of ['pit_certified','returns_computed','execution_simulated'])assert.equal(p[key],false);
 assert.equal(p.rows.length,6);for(const row of p.rows)assert.equal(row.target_change_half_l1_valid_dates,136);
});
test('task map rejects cycles, unsupported completion and missing evidence gates',()=>{
 let r=agenda();r.tasks[0].dependsOn=['SC-002'];assert.throws(()=>validateRoadmap(r),/cycle/);
 r=agenda();r.tasks[1].status='done';r.tasks[1].evidence=[];assert.throws(()=>validateRoadmap(r),/evidence/);
 r=agenda();r.tasks[2].gap=null;assert.throws(()=>validateRoadmap(r),/gate/);
 r=agenda();r.tasks[8].status='ready';assert.throws(()=>validateRoadmap(r),/prerequisite/);
});

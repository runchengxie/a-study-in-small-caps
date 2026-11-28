import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const json=p=>JSON.parse(readFileSync(p));
test('complete bilingual archives retain immutable source hashes and all historical record identities',()=>{
 const guide=json('src/data/reading-guide.json'),research=json('src/data/research.json');
 for(const [lang,id] of [['en','SRC-ARCHIVE-EN'],['zh','SRC-ARCHIVE']]){
  const bytes=readFileSync('public/'+guide.archives[lang].path);assert.equal(createHash('sha256').update(bytes).digest('hex'),research.sources.find(s=>s.id===id).sha256);
  const original=bytes.toString();for(const record of guide.records){const line=original.split('\n')[record.sourceLine[lang]-1];assert.equal(line,`### ${record.id} · ${record.title[lang]}`);assert(original.includes(record.finding[lang]));}
 }
 assert.equal(new Set(guide.records.map(r=>r.id)).size,42);assert.equal(guide.records.filter(r=>r.id.startsWith('H')).length,35);assert.equal(guide.records.filter(r=>r.id.startsWith('R')).length,7);
});
test('window comparison retains seven source rows without merging incompatible variants',()=>{
 const source=readFileSync('public/downloads/microcap-research.v1.0.10.zh-CN.md','utf8'),data=json('src/data/window-review.json');
 const rows=[];for(const line of source.split('\n')){const m=line.match(/^\| (20|60|120) \| (原公开快照|新运行|新运行（最低 90 个观测）|同输入敏感性（最低 45 个观测）) \| ([\d.-]+) \| ([\d.-]+) \| ([\d.-]+) \| ([\d.-]+) \|/);if(m)rows.push([Number(m[1]),Number(m[3]),Number(m[4]),Number(m[5]),Number(m[6])]);}
 assert.equal(rows.length,7);assert.deepEqual(data.rows.map(r=>[r.days,r.annualReturn,r.sharpe,r.drawdown,r.turnover]),rows);
 assert.equal(data.rows.find(r=>r.days===120&&r.variant==='original').annualReturn,7.601898);assert.equal(data.rows.find(r=>r.days===120&&r.variant==='rerun').annualReturn,4.224513);
});

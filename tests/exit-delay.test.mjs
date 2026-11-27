import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {exitDelay} from '../src/lib/exit-delay.ts';
test('first crossing uses only observed peaks and missing future outcomes stay missing',()=>{
 const rows=[{date:'2024-01-01',nav:100},{date:'2024-01-02',nav:90},{date:'2024-01-03',nav:200}];
 const r=exitDelay(rows,.05,1);assert.equal(r.date,'2024-01-02');assert.equal(r.end,'2024-01-03');assert.equal(exitDelay(rows,.05,2).value,null);assert.equal(exitDelay(rows,.2,1),null);
 assert.throws(()=>exitDelay(rows,.05,0));
});
test('2024 diagnostic preserves the January crossing and five-observation denominator',()=>{
 const rows=JSON.parse(readFileSync('public/evidence/microcap_nav.json')).filter(r=>r.date>='2023-12-29'&&r.date<='2024-03-29');
 const r=exitDelay(rows,.2,5);assert.equal(r.date,'2024-01-29');assert.equal(r.end,'2024-02-05');assert(Math.abs(r.value-(-.165317372804496))<1e-12);
});

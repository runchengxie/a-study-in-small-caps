import test from 'node:test';
import assert from 'node:assert/strict';
import {navSummary} from '../src/lib/nav-summary.ts';
test('summary uses the published starting NAV and calendar time, including a partial final year',()=>{
 const rows=[{date:'2020-01-01',nav:2},{date:'2020-02-01',nav:1},{date:'2020-07-01',nav:4}];
 const actual=navSummary(rows);
 assert.equal(actual.multiple,2);assert.equal(actual.maxDrawdown,-.5);
 assert.ok(Math.abs(actual.cagr-(2**(365.2425/182)-1))<1e-12);
 assert.deepEqual(navSummary(rows.map(r=>({...r,nav:r.nav*10}))),actual);
});
test('summary rejects incomplete and invalid observations',()=>{
 for(const rows of [[],[{date:'2020-01-01',nav:1}], [{date:'2020-01-01',nav:1},{date:'2020-01-01',nav:2}], [{date:'bad',nav:1},{date:'2021-01-01',nav:2}], [{date:'2020-01-01',nav:0},{date:'2021-01-01',nav:2}]])assert.throws(()=>navSummary(rows));
});

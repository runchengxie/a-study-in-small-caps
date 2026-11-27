import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateAtlas} from '../scripts/validate-atlas.mjs';
const atlas=JSON.parse(readFileSync('src/data/atlas.json'));const ui=JSON.parse(readFileSync('src/data/ui.json'));
test('Migrated chart projections have valid source identities, field catalogs, units and aggregate-only rows',()=>{const result=validateAtlas(atlas,ui);assert.equal(result.panels,8);assert.equal(result.sources,44);assert(result.rows>500);});
test('Synthetic observatory distributions remain separate from empirical historical panels',()=>{const demo=atlas.items.find(item=>item.id==='observatory-demo');assert.match(demo.stage.en,/Synthetic/);assert.match(demo.limits.en,/cannot support/);assert(atlas.panels.filter(p=>p.id!=='demo').every(p=>p.sourceId!=='observatory-demo'));});
test('A modified projected return fails content integrity validation',()=>{const changed=structuredClone(atlas);changed.panels.find(p=>p.id==='exclusion').rows[0].net_annual_return+=1;assert.throws(()=>validateAtlas(changed,ui));});

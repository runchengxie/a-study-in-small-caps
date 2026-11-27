import test from 'node:test';
import assert from 'node:assert/strict';
import {costScenario} from '../src/lib/cost-scenario.ts';
test('one complete round trip uses one full spread; zero replacement incurs zero scenario cost',()=>{
 assert.equal(costScenario(100,21,1),.12);
 assert.equal(costScenario(100,21,.5),.06);
 assert.equal(costScenario(100,21,0),0);
 assert.equal(costScenario(0,5,1),0);
 for(const args of [[NaN,21,1],[1,0,1],[1,21,2]]) assert.throws(()=>costScenario(...args));
});

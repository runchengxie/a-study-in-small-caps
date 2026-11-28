import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('capital and definition-frequency projections match every archived row and unit',()=>{
 const data=JSON.parse(readFileSync('src/data/archive-comparisons.json'));
 const text=readFileSync('public/downloads/microcap-research.v1.0.10.zh-CN.md','utf8');
 const capital=[],matrix=[];
 for(const line of text.split('\n')){
  const cells=line.split('|').slice(1,-1).map(c=>c.trim());
  if(/^\| (100000|500000|1000000|5000000|10000000|30000000|50000000) \|/.test(line))capital.push(cells.map(c=>Number(c.replace('%',''))));
  if(/^\| (20 日均值|60 日均值|60 日中位数|120 日均值) \| (周频|双周|月频|季频) \|/.test(line))matrix.push(cells);
 }
 assert.equal(data.sourceId,'SRC-ARCHIVE');assert.equal(capital.length,7);assert.equal(matrix.length,16);
 assert.deepEqual(data.capital.map(r=>['capital','annualReturn','drawdown','sharpe','fillRate','cash','delayed'].map(k=>r[k])),capital);
 const definitions={'20 日均值':'mean20','60 日均值':'mean60','60 日中位数':'median60','120 日均值':'mean120'};
 const frequencies={'周频':'weekly','双周':'biweekly','月频':'monthly','季频':'quarterly'};
 assert.deepEqual(data.matrix.map(r=>[r.definition,r.frequency,...['formations','annualReturn','drawdown','sharpe','turnover','development','later'].map(k=>r[k])]),matrix.map(c=>[definitions[c[0]],frequencies[c[1]],...c.slice(2).map(v=>Number(v.replace('%','')))]));
});

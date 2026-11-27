import {drawdowns, type NavPoint} from './visual-math.ts';
/** Endpoint CAGR uses elapsed calendar time and preserves the source's initial NAV. */
export function navSummary(rows:NavPoint[]) {
 if(rows.length<2) throw new Error('At least two NAV observations required');
 let previous=-Infinity;
 for(const row of rows){const time=Date.parse(row.date);if(!Number.isFinite(time)||time<=previous||!Number.isFinite(row.nav)||row.nav<=0)throw new Error('Positive NAV and increasing dates required');previous=time;}
 const first=rows[0],last=rows.at(-1)!;
 const years=(Date.parse(last.date)-Date.parse(first.date))/(86400000*365.2425);
 return {cagr:(last.nav/first.nav)**(1/years)-1,multiple:last.nav/first.nav,maxDrawdown:Math.min(...drawdowns(rows))};
}

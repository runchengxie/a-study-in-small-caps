interface NavRow {date:string;nav:number}
/** First observed threshold crossing using only the running peak, then labelled outcomes. */
export function exitDelay(rows: NavRow[], threshold:number, delay:number) {
 if(!Number.isFinite(threshold)||threshold<=0||threshold>=1||!Number.isInteger(delay)||delay<1)throw new Error('Invalid delay scenario');
 let peak=0,last='';
 for(const row of rows){if(row.date<=last||!Number.isFinite(row.nav)||row.nav<=0)throw new Error('Invalid NAV series');last=row.date;}
 for(let i=0;i<rows.length;i++){
  peak=Math.max(peak,rows[i].nav);
  const drawdown=rows[i].nav/peak-1;
  if(drawdown<=-threshold){const end=rows[i+delay];return {date:rows[i].date,drawdown,end:end?.date??null,value:end?end.nav/rows[i].nav-1:null};}
 }
 return null;
}

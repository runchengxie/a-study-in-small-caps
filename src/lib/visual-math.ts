export type NavPoint = {date:string;nav:number};
export function drawdowns(rows:NavPoint[]):number[]{let peak=0;return rows.map(row=>{peak=Math.max(peak,row.nav);return row.nav/peak-1;});}
export function monthlyReturns(rows:NavPoint[]){
 const groups=new Map<string,{start:number;end:number}>();
 rows.forEach((r,i)=>{const key=r.date.slice(0,7);const group=groups.get(key);if(group)group.end=i;else groups.set(key,{start:i,end:i});});
 return [...groups].map(([month,g])=>{const base=Math.max(0,g.start-1);return {month,start:base,end:g.end,value:rows[g.end].nav/rows[base].nav-1,partial:g.start===0||g.end===rows.length-1};});
}
export function rollingReturns(rows:NavPoint[],steps:number){if(!Number.isInteger(steps)||steps<1)throw new RangeError('Positive integer steps required');return rows.slice(steps).map((r,i)=>({start:i,end:i+steps,value:r.nav/rows[i].nav-1}));}
export function histogram(values:number[],count=24){if(!values.length)return [];const min=Math.min(...values),max=Math.max(...values);const width=(max-min||1)/count;const bins=Array.from({length:count},(_,i)=>({low:min+i*width,high:min+(i+1)*width,count:0}));values.forEach(v=>bins[Math.min(count-1,Math.floor((v-min)/width))].count++);return bins;}

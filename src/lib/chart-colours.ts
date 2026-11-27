export type ChartColours = 'language' | 'red-up' | 'green-up';
export function isChartColours(value: unknown): value is ChartColours {
 return value === 'language' || value === 'red-up' || value === 'green-up';
}
export function initializeChartColours(): void {
 const selectors = document.querySelectorAll<HTMLSelectElement>('[data-chart-colours-select]');
 let preference: ChartColours = 'language';
 try { const saved=localStorage.getItem('smallcaps-chart-colours'); if(isChartColours(saved)) preference=saved; } catch {}
 const apply=(): void => {
  document.documentElement.dataset.chartColours=preference;
  selectors.forEach(selector=>{selector.value=preference;});
 };
 selectors.forEach(selector=>selector.addEventListener('change',()=>{
  if(!isChartColours(selector.value))return;
  preference=selector.value;
  try{localStorage.setItem('smallcaps-chart-colours',preference);}catch{}
  apply();
 }));
 apply();
}

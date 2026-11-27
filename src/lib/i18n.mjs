import ui from '../data/ui.json';
export const locale=()=>document.documentElement.dataset.lang==='zh'?'zh':'en';
export const text=(key)=>ui[key]?.[locale()]??ui[key]?.en??key;
export const local=(value)=>typeof value==='string'?value:value?.[locale()]??value?.en??'';
export const format=(n,options={})=>new Intl.NumberFormat(locale()==='zh'?'zh-CN':'en-US',options).format(n);
export function setLocale(value) {
 const next=value==='zh'?'zh':'en';document.documentElement.dataset.lang=next;document.documentElement.lang=next==='zh'?'zh-CN':'en';
 try{localStorage.setItem('smallcaps-locale',next);}catch{}
 for(const option of document.querySelectorAll('option[data-en]'))option.textContent=option.dataset[next]??option.dataset.en;
 for(const element of document.querySelectorAll('[data-aria]'))element.setAttribute('aria-label',text(element.dataset.aria));
 document.dispatchEvent(new CustomEvent('research:locale'));
}

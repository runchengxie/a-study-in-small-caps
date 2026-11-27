import ui from '../data/ui.json';
export type Locale = 'en' | 'zh';
export type Localized = string | {en: string; zh?: string};
const catalog: Record<string, {en: string; zh?: string}> = ui;
export const locale = (): Locale => document.documentElement.dataset.lang === 'zh' ? 'zh' : 'en';
export const text = (key: string): string => catalog[key]?.[locale()] ?? catalog[key]?.en ?? key;
export const local = (value: Localized | null | undefined): string => typeof value === 'string' ? value : value?.[locale()] ?? value?.en ?? '';
export const format = (n: number, options: Intl.NumberFormatOptions = {}): string => new Intl.NumberFormat(locale() === 'zh' ? 'zh-CN' : 'en-US', options).format(n);
export function setLocale(value: string): void {
 const next: Locale = value === 'zh' ? 'zh' : 'en';
 document.documentElement.dataset.lang = next;
 document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
 try { localStorage.setItem('smallcaps-locale', next); } catch {}
 for (const option of document.querySelectorAll<HTMLOptionElement>('option[data-en]')) option.textContent = option.dataset[next] ?? option.dataset.en ?? '';
 for (const element of document.querySelectorAll<HTMLElement>('[data-aria]')) element.setAttribute('aria-label', text(element.dataset.aria ?? ''));
 const title = document.querySelector<HTMLTitleElement>('title[data-page-title]');
 if (title) document.title = [title.dataset.pageTitle, text('brand')].filter(Boolean).join(' · ');
 document.dispatchEvent(new CustomEvent('research:locale'));
}

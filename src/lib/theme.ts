export type Theme = 'system' | 'light' | 'dark';
export function isTheme(value: unknown): value is Theme {
 return value === 'system' || value === 'light' || value === 'dark';
}
export function resolvedTheme(preference: Theme, systemDark: boolean): 'light' | 'dark' {
 return preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
}
export function initializeTheme(): void {
 const selector = document.querySelector<HTMLSelectElement>('#theme-select');
 if (!selector) return;
 const media = window.matchMedia('(prefers-color-scheme: dark)');
 let preference: Theme = 'system';
 try { const saved = localStorage.getItem('smallcaps-theme'); if (isTheme(saved)) preference = saved; } catch {}
 selector.value = preference;
 const apply = () => {
  const theme = resolvedTheme(preference, media.matches);
  document.documentElement.dataset.theme = theme;
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#17221e' : '#f5f2ea');
 };
 selector.addEventListener('change', () => {
  if (!isTheme(selector.value)) return;
  preference = selector.value;
  try { localStorage.setItem('smallcaps-theme', preference); } catch {}
  apply();
 });
 media.addEventListener('change', apply);
 apply();
}

export interface WaveOptions {
 title1: string; title2: string; caption: string; next: string;
 labels: [string, string, string, string];
}
export interface WaveInstance {
 update(options?: Partial<WaveOptions>): void;
 setMotion(paused: boolean, reduced: boolean): void;
 destroy(): void;
}
export function mount(root: HTMLElement, options: WaveOptions): WaveInstance;

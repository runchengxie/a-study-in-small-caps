/** Arithmetic annual hurdle, not a return forecast or execution model. */
export function costScenario(spreadBps: number, holdingDays: number, replacement: number): number {
 if (![spreadBps,holdingDays,replacement].every(Number.isFinite) || spreadBps<0 || holdingDays<=0 || replacement<0 || replacement>1) throw new Error('Invalid cost scenario');
 return spreadBps/10000*252/holdingDays*replacement;
}

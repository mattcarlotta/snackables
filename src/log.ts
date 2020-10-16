export function logWarning(msg: string): void {
  console.warn(`\x1b[33m[craftenv] ${msg}\x1b[0m`);
}

export function logInfo(msg: string): void {
  console.log(`\x1b[90m[craftenv] ${msg}\x1b[0m`);
}

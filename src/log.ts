export function logWarning(msg: string): void {
  console.warn(`\x1b[33m[snackables] ${msg}\x1b[0m`);
}

export function logInfo(msg: string): void {
  console.log(`\x1b[90m[snackables] ${msg}\x1b[0m`);
}

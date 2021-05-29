/**
 * A utility function that logs a debug message.
 *
 * @param message
 */
export function logMessage(message: string): void {
  console.log(`\x1b[90m[snackables]: ${message}\x1b[0m`);
}

/**
 * A utility function that logs a warning message.
 *
 * @param message
 */
export function logWarning(message: string): void {
  console.log(`\x1b[33m[snackables]: ${message}\x1b[0m`);
}

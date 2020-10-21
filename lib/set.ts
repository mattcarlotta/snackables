/**
 * Sets an object of ENV properties to process.env.
 *
 * @param parsedENVs - single object of envs: { "DB_USER": "root", "DB_PASS": "password", ...etc }
 */
export default function set(parsedENVs: Record<string, unknown>): void {
  process.env = Object.assign(process.env, parsedENVs);
}

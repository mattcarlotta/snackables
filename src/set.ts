/**
 * Assigns an object of ENV properties to process.env.
 *
 * @param parsed - single object of envs: { "DB_USER": "root", "DB_PASS": "password", ...etc }
 */
export default function set(parsed = {}): void {
  process.env = Object.assign({}, parsed, process.env);
}

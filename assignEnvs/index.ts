import type { ParsedEnvs, ProcessEnv } from "../types/index";

/**
 * A utility function to assign Envs to `process.env`.
 *
 * @param {ParsedEnvs} config - filename
 */
export default function assignEnvs(config: ParsedEnvs): ProcessEnv {
  return Object.assign(process.env, config) as ProcessEnv;
}

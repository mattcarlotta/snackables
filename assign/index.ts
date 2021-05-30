import type { ParsedEnvs, ProcessEnv } from "../index";

/**
 * A utility function to assign Envs to `process.env`.
 *
 * @param config - ParsedEnvs
 */
export default function assignEnvs(config: ParsedEnvs): ProcessEnv {
  return Object.assign(process.env, config) as ProcessEnv;
}

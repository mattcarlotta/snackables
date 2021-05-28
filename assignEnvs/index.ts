import type { ConfigArgs, ParsedEnvs, ProcessEnv } from "../types/index";

/**
 * A utility function to assign Envs to `process.env`.
 *
 * @param {ParsedEnvs | ConfigArgs} config - filename
 */
export default function assignEnvs(
  config: ParsedEnvs | ConfigArgs
): ProcessEnv {
  return Object.assign(process.env, config) as ProcessEnv;
}

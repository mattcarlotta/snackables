/// <reference types="node" />

export interface ParsedEnvs {
  [name: string]: string;
}

export type ProcessEnv = ParsedEnvs;

export declare type Option = boolean | string | undefined;

export declare type Path = string | string[];

export interface ConfigArgs {
  ENV_DIR?: string;
  ENV_LOAD?: Path;
  ENV_ENCODING?: BufferEncoding;
  ENV_OVERRIDE?: boolean;
  ENV_DEBUG?: Option
}

export interface ConfigOptions {
  dir?: string;
  paths?: Path;
  encoding?: BufferEncoding;
  override?: Option;
  debug?: Option;
}

export interface ConfigOutput {
  parsed: ProcessEnv;
  extracted: ParsedEnvs;
}

/**
* Extracts and interpolates one or multiple `.env` files into an object and assigns them to {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
* Example: 'KEY=value' becomes { KEY: "value" }
*
* @param {object} options - accepts: { `dir`: string, `paths`: string | string[], `encoding`: BufferEncoding, `override`: boolean | string, `debug`: boolean | string }
* @returns {object} a single object with `parsed` and `extracted` Envs as { KEY: "value" } pairs
*/
export declare function config(options?: ConfigOptions): ConfigOutput;


/**
 * Loads a config object from the `env.config.(m)js` file based upon `LOAD_ENV`.
 *
 * @param {string} env - the environment to be loaded
 * @returns {Promise<ConfigArgs | void>} a promise that resolves a config file as { key: value } pairs to be used with the `config` function
 * @example load("development")
 */
 export default function load(env: string): Promise<ConfigArgs | void>;

/**
* Parses a string or buffer of Envs into an object.
*
* @param {string | Buffer} src - contents to be parsed (string | Buffer)
* @param {boolean | string} override - allows extracted Envs to be parsed regardless if `process.env` has the properties defined (boolean | string)
* @returns {object} a single object of all { key: value } pairs from `src`
*/
export declare function parse(src: string | Buffer, override?: Option): ParsedEnvs;

/** Default import library interface */
export interface Snackables {
  config: typeof config;
  load: typeof load;
  parse: typeof parse;
}
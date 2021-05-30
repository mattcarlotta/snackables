// TypeScript Version: 4.0
/// <reference types="node" />

export interface ParsedEnvs {
  [name: string]: string;
}

export type ProcessEnv = ParsedEnvs;

export type Option = boolean | string | undefined;

export type Path = string | string[];

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
 * A utility function to assign Envs to `process.env`.
 *
 * @param config - ParsedEnvs
 */
 export declare function assign(config: ParsedEnvs): ProcessEnv;

/**
 * Extracts and interpolates one or multiple `.env` files into an object and assigns them to {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 * Example: 'KEY=value' becomes { KEY: "value" }
 *
 * @param options - accepts: { `dir`: string, `paths`: string | string[], `encoding`: BufferEncoding, `override`: boolean | string, `debug`: boolean | string }
 * @returns a single object with `parsed` and `extracted` Envs as { KEY: "value" } pairs
 * @example config({ dir: "example", paths: ".env" })
 */
export declare function config(options?: ConfigOptions): ConfigOutput;

/**
 * Loads a configuration object from the `env.config.json` file based upon `LOAD_ENV`.
 *
 * @param env - the environment to be loaded
 * @param dir - the directory where the config is located
 * @returns a config file as { key: value } pairs to be used with the `config` function
 * @example load("development")
 */
 export declare function load(env: string, dir?: string): ConfigOptions;

/**
 * Parses a string or buffer of Envs into an object.
 *
 * @param src - contents to be parsed (string | Buffer)
 * @param override - allows extracted Envs to be parsed regardless if `process.env` has the properties defined (boolean | string)
 * @returns a single object of all { key: value } pairs from `src`
 * @example parse(Buffer.from("JUSTICE=league\n"))
 */
export declare function parse(src: string | Buffer, override?: Option): ParsedEnvs;

/** Default import library declarations */
declare const snackables: {
  assign: typeof assign;
  config: typeof config;
  load: typeof load;
  parse: typeof parse;
};

export default snackables;
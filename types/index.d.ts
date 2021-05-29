// TypeScript Version: 4.0
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
  ENV_OVERRIDE?: Option;
  ENV_DEBUG?: Option;
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
 * @param options - accepts: { `dir`: string, `paths`: string | string[], `encoding`: BufferEncoding, `override`: boolean | string, `debug`: boolean | string }
 * @returns a single object with `parsed` and `extracted` Envs as { KEY: "value" } pairs
 * @example config({ dir: "example", paths: ".env" })
 */
export declare function config(options?: ConfigOptions): ConfigOutput;

/**
 * Loads a config object from the `env.config.(m)js` file based upon `LOAD_ENV`.
 *
 * @param env - the environment to be loaded
 * @returns a promise that resolves a config file as { key: value } pairs to be used with the `config` function
 * @example load("development")
 */
 export declare function load(env: string): Promise<ConfigArgs>;

/**
 * Parses a string or buffer of Envs into an object.
 *
 * @param src - contents to be parsed (string | Buffer)
 * @param override - allows extracted Envs to be parsed regardless if `process.env` has the properties defined (boolean | string)
 * @returns a single object of all { key: value } pairs from `src`
 * @example parse(Buffer.from("JUSTICE=league\n"))
 */
export declare function parse(src: string | Buffer, override?: Option): ParsedEnvs;

/** Default import library interface */
declare const snackables: {
  config: typeof config;
  load: typeof load;
  parse: typeof parse;
};

export default snackables;
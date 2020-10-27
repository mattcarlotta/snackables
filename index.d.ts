/// <reference types="node" />

// accepted encoding types for fs.readFileSync
export type Encoding =
  | "ascii"
  | "utf8"
  | "utf-8"
  | "utf16le"
  | "ucs2"
  | "ucs-2"
  | "base64"
  | "latin1"
  | "binary"
  | "hex";

interface ParsedENVs {
  [name: string]: string;
}

export type ProcessEnv = { [key: string]: string };

export type ENVFiles = Array<{
  path: string;
  contents: any;
}>;

/**
 * Parses a string or buffer into an object of ENVs.
 *
 * @param src - string or Buffer or an array of precached files to be parsed
 * @returns a single object with parsed ENVs as { key: value } pairs
 */
export function parse(src: string | Buffer | ENVFiles): ParsedENVs;

export interface ConfigOptions {
  dir?: string; // directory to env files
  path?: string | string[]; // path to .env file
  encoding?: Encoding; // encoding of .env file
  debug?: string | boolean; // turn on logging for debugging purposes
}

export interface ConfigOutput {
  parsed: ParsedENVs; // process.env ENVs as key value pairs
  extracted: ParsedENVs; // extracted ENVs as key value pairs
  cachedENVFiles: ENVFiles; // cached ENVs as key value pairs
}

/**
 * Returns internal cached ENVs files
 *
 * @returns an array of cached ENVs as { path: path/to/file, contents: file contents as string} pairs
 */
export function getCache(): ENVFiles;

/**
 * Extracts and interpolates one or multiple `.env` files into an object and assigns them to {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 * Example: 'KEY=value' becomes { KEY: 'value' }
 *
 * @param options - accepts: { dir: string, path: string | string[], debug: boolean, encoding: | "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary"| "hex" }
 * @returns a single parsed object with parsed ENVs as { key: value } pairs, a single extracted object with extracted ENVS as { key: value } pairs, and an array of cached ENVs as { path: string, contents: string} pairs
 */
export function config(options?: ConfigOptions): ConfigOutput;

/** snackables library interface */
export interface SnackableEnv {
  config: typeof config;
  parse: typeof parse;
  getCache: typeof getCache;
}

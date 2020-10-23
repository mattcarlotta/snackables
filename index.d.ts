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

interface ParsedOutput {
  [name: string]: string;
}

interface cachedENVFiles {
  [name: string]: string;
}

/**
 * Parses a string or buffer into an object of ENVs.
 *
 * @param src - string or Buffer to be parsed
 * @returns a single object with parsed ENVs as { key: value } pairs
 */

export function parse(src: string | Buffer): ParsedOutput;

export interface ConfigOptions {
  path?: string | string[]; // path to .env file
  encoding?: Encoding; // encoding of .env file
  debug?: string | boolean; // turn on logging for debugging purposes
}

export interface ConfigOutput {
  parsed?: ParsedOutput; // parsed ENVs as key value pairs
  cachedENVFiles?: cachedENVFiles; // cached ENVs as key value pairs
}

/**
 * Extracts and interpolates one or multiple `.env` files into an object and assigns them to {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 * Example: 'KEY=value' becomes { KEY: 'value' }
 *
 * @param options - accepts: { path: string | string[], debug: boolean, encoding: | "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary"| "hex" }
 * @returns a single parsed object with parsed ENVs as { key: value } pairs and an array of cached ENVs as { key: value} pairs
 */
export function config(options?: ConfigOptions): ConfigOutput;

/** snackables library interface */
export interface SnackableEnv {
  config: typeof config;
  parse: typeof parse;
}

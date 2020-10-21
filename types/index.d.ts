/// <reference types="node" />

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

export interface ExtractOptions {
  configs: string[]; // .env.* files as an array of strings [".env.a", ".env.b"]
  debug: boolean; // ouputs extract/assigned ENVs to console
  encoding: Encoding; // specifies the file encoding type
}

// keys and values from src
interface ParsedOutput {
  [name: string]: string;
}

/**
 * Parses a string or buffer in the .env file format into an object.
 *
 * @param src - contents to be parsed
 * @returns an object with keys and values based on `src`
 */

export function parse(src: string | Buffer): ParsedOutput;

export interface ConfigOptions {
  path?: string | string[]; // path to .env file
  encoding?: Encoding; // encoding of .env file
  debug?: string | boolean; // turn on logging for debugging purposes
}

export interface ConfigOutput {
  parsed?: ParsedOutput; // parsed ENVs
}

/**
 * Loads `.env` file contents into {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 * Example: 'KEY=value' becomes { parsed: { KEY: 'value' } }
 *
 * @param options - controls behavior
 * @returns an object with a `parsed` key if successful or `error` key if an error occurred
 *
 */
export function config(options?: ConfigOptions): ConfigOutput;

/** snackables library interface */
export interface SnackableEnv {
  config: typeof config;
  parse: typeof parse;
}

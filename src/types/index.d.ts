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

export type ExtractOptions = {
  configs: string[];
  debug?: boolean;
  encoding: Encoding;
};

// keys and values from src
type ParsedOutput = { [name: string]: string };

/**
 * Parses a string or buffer in the .env file format into an object.
 *
 * @param src - contents to be parsed
 * @returns an object with keys and values based on `src`
 */
export function parse(src: string | Buffer): ParsedOutput;

export type ConfigOptions = {
  path?: string; // path to .env file
  encoding?: Encoding; // encoding of .env file
  debug?: string | boolean; // turn on logging for debugging purposes
};

export interface ConfigOutput {
  error?: Error;
  parsed?: ParsedOutput;
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

/** dotenv library interface */
export interface CraftEnv {
  config: typeof config;
  parse: typeof parse;
}

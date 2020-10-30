/// <reference types="node" />
export interface ParsedEnvs {
    [name: string]: string;
}
export interface ProcessEnv {
    [key: string]: string;
}
export interface ParsedOutput {
    extracted: ParsedEnvs;
    sanitized: ParsedEnvs;
}
export interface CachedEnvFiles {
    path: string;
    contents: string;
}
export interface ConfigOptions {
    dir?: string;
    path?: string | string[];
    encoding?: BufferEncoding;
    debug?: string | boolean;
    cache?: string | boolean;
    override?: string | boolean;
}
export interface ConfigOutput {
    parsed: ParsedEnvs;
    extracted: ParsedEnvs;
    cachedEnvFiles: CachedEnvFiles[];
}
/**
 * Parses a string, buffer, or precached envs into an object.
 *
 * @param src - contents to be parsed
 * @param override - allows extracted Envs to potentially override contents of process.env
 * @returns an object with keys and values based on `src`
 */
export declare function parse(src: string | Buffer | CachedEnvFiles[], override?: string | boolean): ParsedEnvs;
/**
 * Extracts and interpolates one or multiple `.env` files into an object and assigns them to {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 * Example: 'KEY=value' becomes { KEY: 'value' }
 *
 * @param options - accepts: { dir: string, path: string | string[], debug: boolean, encoding: | "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary"| "hex", override: string | boolean }
 * @returns a single parsed object with parsed Envs as { key: value } pairs, a single extracted object with extracted Envs as { key: value } pairs, and an array of cached Envs as { path: string, contents: string} pairs
 */
export declare function config(options?: ConfigOptions): ConfigOutput;

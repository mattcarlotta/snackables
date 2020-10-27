/// <reference types="node" />
export declare type Encoding = "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex";
export interface ParsedENVs {
    [name: string]: string;
}
export declare type ProcessEnv = {
    [key: string]: string;
};
export declare type LoadedEnvFiles = Array<{
    path: string;
    contents: string;
}>;
export interface ConfigOptions {
    dir?: string;
    path?: string | string[];
    encoding?: Encoding;
    debug?: string | boolean;
}
export interface ConfigOutput {
    parsed: ParsedENVs;
    extracted: ParsedENVs;
    cachedEnvFiles: LoadedEnvFiles;
}
/**
 * Parses a string, buffer, or precached envs into an object.
 *
 * @param src - contents to be parsed
 * @returns an object with keys and values based on `src`
 */
export declare function parse(src: string | Buffer | LoadedEnvFiles): ParsedENVs;
/**
 * Extracts and interpolates one or multiple `.env` files into an object and assigns them to {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 * Example: 'KEY=value' becomes { KEY: 'value' }
 *
 * @param options - accepts: { dir: string, path: string | string[], debug: boolean, encoding: | "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary"| "hex" }
 * @returns a single parsed object with parsed ENVs as { key: value } pairs, a single extracted object with extracted ENVS as { key: value } pairs, and an array of cached ENVs as { path: string, contents: string} pairs
 */
export declare function config(options?: ConfigOptions): ConfigOutput;

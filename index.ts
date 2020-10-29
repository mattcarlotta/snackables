/*
  Copyright (c) 2015, Scott Motte
  All rights reserved.
  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:
  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.
  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
import { readFileSync, statSync } from "fs";
import { join } from "path";

export interface ParsedENVs {
  [name: string]: string;
}

export type ProcessEnv = { [key: string]: string };

export type CachedEnvFiles = Array<{
  path: string;
  contents: string;
}>;

export interface ConfigOptions {
  dir?: string; // directory to env files
  path?: string | string[]; // path to .env file
  encoding?: BufferEncoding; // encoding of .env file
  debug?: string | boolean; // turn on logging for debugging purposes
  cache?: string | boolean; // turn on caching
}

export interface ConfigOutput {
  parsed: ParsedENVs; // process.env ENVs as key value pairs
  extracted: ParsedENVs; // extracted ENVs as key value pairs
  cachedEnvFiles: CachedEnvFiles; // cached ENVs as key value pairs
}

const __CACHE__: CachedEnvFiles = [];

/**
 * Parses a string, buffer, or precached envs into an object.
 *
 * @param src - contents to be parsed
 * @returns an object with keys and values based on `src`
 */
export function parse(src: string | Buffer | CachedEnvFiles): ParsedENVs {
  const { env } = process;
  const { LOADED_CACHE } = env;
  const { assign } = Object;
  const extracted: ParsedENVs = {};

  // checks if src is an array of precached ENVs
  if (Array.isArray(src)) {
    // checks if process.env.LOADED_CACHE is undefined, otherwise skip reloading
    if (!LOADED_CACHE)
      for (let i = 0; i < src.length; i += 1) {
        assign(
          extracted,
          JSON.parse(Buffer.from(src[i].contents, "base64").toString())
        );
      }
    return (process.env = assign(extracted, env));
  }

  function interpolate(envValue: string): string {
    // find interpolated values with $KEY or ${KEY}
    const matches = envValue.match(/(.?\${?(?:[a-zA-Z0-9_]+)?}?)/g);

    return !matches
      ? envValue
      : matches.reduce((newEnv: string, match: string): string => {
          // parts = ["$string", "@"| ":" | "/", " ", "strippedstring", index: n, input: "$string", groups ]
          const parts = /(.?)\${?([a-zA-Z0-9_]+)?}?/g.exec(match);

          /* istanbul ignore next */
          if (!parts) return newEnv;

          let value, replacePart;

          // if prefix is escaped
          if (parts[1] === "\\") {
            // remove escaped characters
            replacePart = parts[0];
            value = replacePart.replace("\\$", "$");
          } else {
            // else remove prefix character
            replacePart = parts[0].substring(parts[1].length);
            // interpolate value from process or extracted object or empty string
            value = interpolate(env[parts[2]] || extracted[parts[2]] || "");
          }

          return newEnv.replace(replacePart, value);
        }, envValue);
  }

  // convert Buffers before splitting into lines and processing
  src
    .toString()
    .split(/\n|\r|\r\n/)
    .forEach(line => {
      // matching "KEY' and 'VAL' in 'KEY=VAL'
      const keyValueArr = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      // matched?
      if (keyValueArr) {
        // default undefined or missing values to empty string
        let value = keyValueArr[2] || "";
        const end = value.length - 1;
        const isDoubleQuoted = value[0] === '"' && value[end] === '"';
        const isSingleQuoted = value[0] === "'" && value[end] === "'";

        // if single or double quoted, remove quotes
        if (isSingleQuoted || isDoubleQuoted) {
          value = value.substring(1, end);

          // if double quoted, expand newlines
          if (isDoubleQuoted) value = value.replace(/\\n/g, "\n");
        } else {
          // remove surrounding whitespace
          value = value.trim();
        }

        // interpolate value from .env or process.env
        value = interpolate(value);

        // prevent the extracted value from overwriting a process.env variable
        if (!env[keyValueArr[1]]) extracted[keyValueArr[1]] = value;
      }
    });

  return extracted;
}

/**
 * Extracts and interpolates one or multiple `.env` files into an object and assigns them to {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 * Example: 'KEY=value' becomes { KEY: 'value' }
 *
 * @param options - accepts: { dir: string, path: string | string[], debug: boolean, encoding: | "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary"| "hex" }
 * @returns a single parsed object with parsed ENVs as { key: value } pairs, a single extracted object with extracted ENVS as { key: value } pairs, and an array of cached ENVs as { path: string, contents: string} pairs
 */
export function config(options?: ConfigOptions): ConfigOutput {
  const { cwd, env } = process;
  const { log } = console;
  const { assign } = Object;

  // default config options
  let dir = cwd();
  let path: string | string[] = [".env"];
  let debug: string | boolean | undefined;
  let encoding: BufferEncoding = "utf-8";
  let cache: string | boolean | undefined = false;

  // override default options with config options arguments
  if (options) {
    dir = options.dir || dir;
    path = options.path || path;
    debug = options.debug;
    encoding = options.encoding || encoding;
    cache = options.cache;
  }

  // split path into array of strings
  const configs = Array.isArray(path) ? path : path.split(",");

  // initializes ENV object
  const extracted: ParsedENVs = {};

  // loop over configs array
  for (let i = 0; i < configs.length; i += 1) {
    // gets config path file (append .env. if using shorthand)
    const envPath = join(dir, configs[i]);
    try {
      // check that the file hasn't already been cached
      if (
        !cache ||
        (!__CACHE__.some(({ path }) => path === envPath) && cache)
      ) {
        // checks if "envPath" is a file that exists
        statSync(envPath).isFile();

        // reads and parses ENVS from .env file
        const parsed = parse(readFileSync(envPath, { encoding }));

        // stores path and contents to internal cache
        if (cache)
          __CACHE__.push({
            path: envPath,
            contents: Buffer.from(JSON.stringify(parsed)).toString("base64")
          });

        // assigns ENVs to accumulated object
        assign(extracted, parsed);

        if (debug) log(`\x1b[90mLoaded env from ${envPath}\x1b[0m`);
      }
    } catch (err) {
      /* istanbul ignore next */
      if (err.code !== "ENOENT") {
        log(`\x1b[33mUnable to load ${envPath}: ${err.message}.\x1b[0m`);
      }
    }
  }

  return {
    parsed: process.env = assign({}, extracted, env),
    extracted,
    cachedEnvFiles: __CACHE__
  };
}

/**
 * Immediately loads a single or multiple `.env` file contents into {@link https://nodejs.org/api/process.html#process_process_env | `process.env`} when the package is preloaded or imported.
 */
(function () {
  // check if ENV_LOAD is defined
  const { ENV_CACHE, ENV_DIR, ENV_LOAD, ENV_DEBUG, ENV_ENCODE } = process.env;
  if (ENV_LOAD) {
    config({
      dir: ENV_DIR,
      path: ENV_LOAD,
      debug: ENV_DEBUG,
      encoding: ENV_ENCODE as BufferEncoding,
      cache: ENV_CACHE
    });
    // prevent the IFFE from reloading the .env files
    delete process.env.ENV_LOAD;
  }
})();

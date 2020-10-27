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
import { resolve } from "path";
import {
  CachedENVFiles,
  ConfigOptions,
  ConfigOutput,
  Encoding,
  ParsedOutput
} from "./index.d";

const __CACHE__: CachedENVFiles = [];

export function getCache(): CachedENVFiles {
  return __CACHE__;
}

/**
 * Parses a string or buffer in the .env file format into an object.
 *
 * @param src - contents to be parsed
 * @returns an object with keys and values based on `src`
 */
export function parse(src: string | Buffer): ParsedOutput {
  const obj: ParsedOutput = {};

  function interpolate(envValue: string): string {
    const matches = envValue.match(/(.?\${?(?:[a-zA-Z0-9_]+)?}?)/g);
    // should only match ${brackets} => envValue.match(/(.?\${(?:[a-zA-Z0-9_]+)?})/g) ??

    return !matches
      ? envValue
      : matches.reduce((newEnv: string, match: string): string => {
          // parts = ["$string", "@"| ":" | "/", " ", "strippedstring", index: n, input: "$string", groups ]
          const parts = /(.?)\${?([a-zA-Z0-9_]+)?}?/g.exec(match);
          // should only match ${brackets} => /(.?)\${([a-zA-Z0-9_]+)?}/g ??

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
            // interpolate value from process or parsed object or empty string
            value = interpolate(process.env[parts[2]] || obj[parts[2]] || "");
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

        obj[keyValueArr[1]] = interpolate(value);
      }
    });

  return obj;
}

/**
 * Extracts multiple .env files into an object and assigns them to process.env.
 *
 * @param options - accepts: { path: string | string[], debug: boolean, encoding: | "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary"| "hex" }
 * @returns a single parsed object with parsed ENVs as { key: value } pairs and an array of cached ENVs as { key: value} pairs
 */
export function config(options?: ConfigOptions): ConfigOutput {
  const { cwd, env } = process;
  const { ENV_CACHE } = env;
  const { log } = console;
  const { assign } = Object;

  let path: string | string[] = [".env"];
  let debug;
  let encoding: Encoding = "utf-8";

  // override default options with options arguments
  if (options) {
    path = options.path || path;
    debug = options.debug;
    encoding = options.encoding || encoding;
  }

  // split path into array of strings
  const configs = Array.isArray(path) ? path : path.split(",");

  // initializes ENV object
  const parsedENVs = {};

  // loop over configs array
  for (let i = 0; i < configs.length; i += 1) {
    // sets current config
    const config = configs[i];

    // gets config path file (append .env. if using shorthand)
    const envPath = resolve(
      cwd(),
      config.includes(".env") ? config : `.env.${config}`
    );
    try {
      // check that the file hasn't already been cached
      if (
        !ENV_CACHE ||
        (!__CACHE__.some(({ path }) => path === envPath) && ENV_CACHE)
      ) {
        // checks if "envPath" is a file that exists
        statSync(envPath).isFile();

        // parses ENVS from path
        const parsed = parse(readFileSync(envPath, { encoding }));

        // store path and contents to internal cache
        __CACHE__.push({
          path: envPath,
          contents: JSON.stringify(parsed)
        });

        // assigns ENVs to ENV object
        assign(parsedENVs, parsed);

        if (debug)
          log(
            `\x1b[90mExtracted '${envPath}' ENVs: ${JSON.stringify(
              parsed
            )}\x1b[0m`
          );
      }
    } catch (err) {
      log(`\x1b[33mUnable to extract '${envPath}': ${err.message}.\x1b[0m`);
    }
  }

  process.env = assign({}, parsedENVs, process.env);

  if (debug)
    log(`\x1b[90mAssigned ${JSON.stringify(parsedENVs)} to process.env\x1b[0m`);

  return { parsed: parsedENVs, cachedENVFiles: __CACHE__ };
}

/**
 * Loads a single or multiple `.env` file contents into {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 *
 */
(function () {
  // check if ENV_LOAD is defined
  const { ENV_LOAD, ENV_DEBUG, ENV_ENCODE } = process.env;
  if (ENV_LOAD)
    // extract and split all .env.* from ENV_LOAD into a parsed object of ENVS
    config({
      path: ENV_LOAD,
      debug: ENV_DEBUG,
      encoding: ENV_ENCODE as Encoding
    });
})();

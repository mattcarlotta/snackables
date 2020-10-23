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
import { ConfigOptions, Encoding, ParsedOutput } from "./index.d";

/* eslint-disable-next-line */
let __CACHED_ENVS__: string[] = [];

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
          const parts = /(.?)\${?([a-zA-Z0-9_]+)?}?/g.exec(match);
          // parts = ["$string", "@"| ":" | "/", " ", "strippedstring", index: n, input: "$string", groups ]
          // should only match ${brackets} => /(.?)\${([a-zA-Z0-9_]+)?}/g ??

          /* istanbul ignore next */
          if (!parts) return newEnv;

          let value;
          let replacePart;

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
      if (keyValueArr != null) {
        // default undefined or missing values to empty string
        let val = keyValueArr[2] || "";
        const end = val.length - 1;
        const isDoubleQuoted = val[0] === '"' && val[end] === '"';
        const isSingleQuoted = val[0] === "'" && val[end] === "'";

        // if single or double quoted, remove quotes
        if (isSingleQuoted || isDoubleQuoted) {
          val = val.substring(1, end);

          // if double quoted, expand newlines
          if (isDoubleQuoted) val = val.replace(/\\n/g, "\n");
        } else {
          // remove surrounding whitespace
          val = val.trim();
        }

        obj[keyValueArr[1]] = interpolate(val);
      }
    });

  return obj;
}

/**
 * Extracts multiple .env files into an object and assigns them to process.env.
 *
 * @param options - accepts: { path: string | string[], debug: boolean, encoding: | "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary"| "hex" }
 * @returns an object with parsed ENVs as key value pairs
 */
export function config(options?: ConfigOptions): ParsedOutput {
  const path = options && options.path ? options.path : ".env";
  const debug = options && options.debug ? Boolean(options.debug) : false;
  const encoding = options && options.encoding ? options.encoding : "utf-8";

  // split path into array of strings
  const configs = Array.isArray(path) ? path : path.split(",");

  // initializes ENV object
  const parsedENVs = {};

  // loop over configs array
  for (let i = 0; i < configs.length; i += 1) {
    // sets current config
    const config = configs[i];

    // sets current config path file (append .env. if using shorthand)
    const configFile = config.indexOf(".env") > -1 ? config : `.env.${config}`;

    try {
      // gets config path
      const envPath = resolve(process.cwd(), configFile);

      // check that the file hasn't already been loaded
      if (__CACHED_ENVS__.includes(envPath) && Boolean(process.env.ENV_CACHE))
        throw Error(`The file has already been loaded`);

      // checks if "envPath" is a file that exists
      statSync(envPath).isFile();

      // store path to internal cache
      __CACHED_ENVS__.push(envPath);

      // parses ENVS from path
      const parsed = parse(readFileSync(envPath, { encoding }));

      // assigns ENVs to ENV object
      Object.assign(parsedENVs, parsed);

      if (debug)
        console.log(
          `\x1b[90mExtracted '${configFile}' ENVs: ${JSON.stringify(
            parsed
          )}\x1b[0m`
        );
    } catch (e) {
      console.log(
        `\x1b[33mUnable to extract '${configFile}': ${e.message}.\x1b[0m`
      );
    }
  }

  Object.assign(process.env, parsedENVs);

  if (debug)
    console.log(
      `\x1b[90mAssigned ${JSON.stringify(parsedENVs)} to process.env\x1b[0m`
    );

  return parsedENVs;
}

/**
 * Loads a single or multiple `.env` file contents into {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 *
 */
(function () {
  // check if ENV_LOAD is defined
  if (process.env.ENV_LOAD != null)
    // extract and split all .env.* from ENV_LOAD into a parsed object of ENVS
    config({
      path: process.env.ENV_LOAD,
      debug: process.env.ENV_DEBUG,
      encoding: process.env.ENV_ENCODE as Encoding
    });
})();

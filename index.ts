/*
  BSD 2-Clause "Simplified" License
 
  Copyright (c) 2015, Scott Motte
 
  All rights reserved.
 
  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:
 
  Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.
 
  Redistributions in binary form must reproduce the above copyright notice,
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
import { execSync } from "child_process";

export interface ParsedEnvs {
  [name: string]: string; // parsed Envs as KEY=VALUE pairs
}

export interface ProcessEnv {
  [key: string]: string; // process.env
}

export type Option = boolean | string | undefined;

export type Path = string | string[];

export interface ConfigOptions {
  dir?: string; // directory to env files
  paths?: Path; // paths to .env file
  encoding?: BufferEncoding; // encoding of .env file
  override?: Option; // override process.envs
  debug?: Option; // turn on logging for debugging purposes
}

export interface ConfigOutput {
  parsed: ProcessEnv; // process.env Envs as key value pairs
  extracted: ParsedEnvs; // extracted Envs as key value pairs
}

/**
 * Parses a string or buffer of Envs into an object.
 *
 * @param src - contents to be parsed (string | Buffer)
 * @param override - allows extracted Envs to be parsed regardless if process.env has the properties defined (string | boolean)
 * @returns an object with keys and values from `src`
 */

export function parse(src: string | Buffer, override?: Option): ParsedEnvs {
  const { env } = process;
  // initialize extracted Envs object
  const extracted: ParsedEnvs = {};

  // interpts lines from command line, process.env or .env
  function interpolate(envValue: string): string {
    // find interpolated values with $(KEY) or with $KEY/${KEY}
    const matches =
      envValue.match(/\$\(([^)]+)\)/g) ||
      envValue.match(/(.?\${?(?:[a-zA-Z0-9_]+)?}?)/g);

    return !matches
      ? envValue
      : matches.reduce((newEnv: string, match: string): string => {
          // matches lines against $(command) or $command/${command}
          const parts =
            /(.?)\$\(([^)]+)\)/g.exec(match) ||
            /(.?)\${?([a-zA-Z0-9_]+)?}?/g.exec(match);

          const line = parts![0],
            command = parts![1],
            stripped = parts![2];

          let value = "",
            replacePart = line.substring(command.length);

          // if prefix is escaped
          if (command === "\\") {
            // removes escaped characters
            replacePart = line;
            value = replacePart.replace("\\$", "$");

            // else if line contains "(" and ")"
          } else if (line[1] === "(" && line[line.length - 1] === ")") {
            // attempts to substitute command line
            try {
              value = execSync(stripped, {
                stdio: "pipe"
              })
                .toString()
                .trim();
            } catch (e) {
              console.log(e.message);
            }

            // else interpolate value
          } else {
            // substitute commands from extracted values and/or
            // interpolate value from process or extracted object or empty string
            value = interpolate(env[stripped] || extracted[stripped] || value);
          }

          return newEnv.replace(replacePart, value);
        }, envValue);
  }

  // converts Buffers before splitting into lines and processing
  const keyValues = src.toString().split(/\n|\r|\r\n/);

  // loops over key value pairs
  for (let i = 0; i < keyValues.length; i += 1) {
    // finds matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = keyValues[i].match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);

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
        value = interpolate(value);
      }

      // prevents the extracted value from overriding a process.env variable
      if (override || !env[keyValueArr[1]]) extracted[keyValueArr[1]] = value;
    }
  }

  return extracted;
}

/**
 * Extracts and interpolates one or multiple `.env` files into an object and assigns them to {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 * Example: 'KEY=value' becomes { KEY: 'value' }
 *
 * @param options - accepts: { dir: string, paths: string | string[], encoding: | "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary"| "hex", override: boolean | string, debug: boolean | string }
 * @returns a single parsed object with parsed Envs as { key: value } pairs and a single extracted object with extracted Envs as { key: value } pairs
 */
export function config(options?: ConfigOptions): ConfigOutput {
  const { log } = console;
  const { assign } = Object;

  // default config options
  let dir = process.cwd();
  let paths: Path = [".env"];
  let debug: Option;
  let override: Option;
  let encoding: BufferEncoding = "utf-8";

  // override default options with config options arguments
  if (options) {
    dir = options.dir || dir;
    paths = options.paths || paths;
    debug = options.debug;
    encoding = options.encoding || encoding;
    override = options.override;
  }

  // split paths into array of strings
  const configs = Array.isArray(paths) ? paths : paths.split(",");

  // initializes parsed Env object
  const extracted: ParsedEnvs = {};

  // loop over configs array
  for (let i = 0; i < configs.length; i += 1) {
    // gets config paths file
    const envPath = join(dir, configs[i]);
    try {
      // checks if "envPath" is a file that exists
      statSync(envPath).isFile();

      // reads and parses Envs from .env file
      const parsed = parse(readFileSync(envPath, { encoding }), override);

      // assigns Envs to accumulated object
      assign(extracted, parsed);

      if (debug) log(`\x1b[90mLoaded env from ${envPath}\x1b[0m`);
    } catch (err) {
      if (debug)
        log(`\x1b[33mUnable to load ${envPath}: ${err.message}.\x1b[0m`);
    }
  }

  return {
    parsed: assign(process.env, extracted),
    extracted
  };
}

/**
 * Immediately loads a single or multiple `.env` file contents into {@link https://nodejs.org/api/process.html#process_process_env | `process.env`} when the package is preloaded or imported.
 */
(function () {
  // check if ENV_LOAD is defined
  const {
    ENV_DIR,
    ENV_LOAD,
    ENV_DEBUG,
    ENV_ENCODE,
    ENV_OVERRIDE
  } = process.env;
  if (ENV_LOAD) {
    config({
      dir: ENV_DIR,
      paths: ENV_LOAD,
      debug: ENV_DEBUG,
      encoding: ENV_ENCODE as BufferEncoding,
      override: ENV_OVERRIDE
    });

    // prevents the IFFE from reloading the .env files
    delete process.env.ENV_LOAD;
  }
})();

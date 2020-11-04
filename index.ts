import { readFileSync, statSync } from "fs";
import { join } from "path";

export interface ParsedEnvs {
  [name: string]: string; // parsed Envs as KEY=VALUE pairs
}

export interface ProcessEnv {
  [key: string]: string; // process.env
}

export interface CachedEnvFiles {
  path: string; // loaded .env file path
  contents: string; // parsed file to buffer string
}

export type Option = string | boolean | undefined;

export interface ConfigOptions {
  dir?: string; // directory to env files
  path?: string | string[]; // path to .env file
  encoding?: BufferEncoding; // encoding of .env file
  override?: Option; // override process.envs
  cache?: Option; // turn on caching
  debug?: Option; // turn on logging for debugging purposes
}

export interface ConfigOutput {
  parsed: ParsedEnvs; // process.env Envs as key value pairs
  extracted: ParsedEnvs; // extracted Envs as key value pairs
  cachedEnvFiles: CachedEnvFiles[]; // cached Envs as key value pairs
}

const __CACHE__: CachedEnvFiles[] = [];

/**
 * Parses a string, buffer, or precached envs into an object.
 *
 * @param src - contents to be parsed (string | Buffer | CachedEnvFiles[])
 * @param override - allows extracted Envs to be parsed regardless if process.env has the properties defined (string | boolean)
 * @returns an object with keys and values from `src`
 */
export function parse(
  src: string | Buffer | CachedEnvFiles[],
  override?: Option
): ParsedEnvs {
  const { env } = process;
  const { LOADED_CACHE } = env;
  const { assign } = Object;

  // initialize extracted Envs object
  const extracted: ParsedEnvs = {};

  // initialize sanitized Envs (not defined in process.env) object
  const sanitized: ParsedEnvs = {};

  // checks if src is an array of precached Envs
  if (Array.isArray(src)) {
    // checks if process.env.LOADED_CACHE is undefined, otherwise skip reloading
    if (!LOADED_CACHE)
      for (let i = 0; i < src.length; i += 1) {
        assign(extracted, JSON.parse(Buffer.from(src[i].contents).toString()));
      }
    return assign(env, extracted);
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
        // remove surrounding whitespace
        value = value.trim();
      }

      // interpolate value from process.env or .env
      value = interpolate(value);

      // assigns what was initially extracted from the file
      extracted[keyValueArr[1]] = value;

      // prevents the extracted value from overriding a process.env variable
      if (!env[keyValueArr[1]]) sanitized[keyValueArr[1]] = value;
    }
  }

  return override ? extracted : sanitized;
}

/**
 * Extracts and interpolates one or multiple `.env` files into an object and assigns them to {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 * Example: 'KEY=value' becomes { KEY: 'value' }
 *
 * @param options - accepts: { dir: string, path: string | string[], encoding: | "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary"| "hex", override: string | boolean, cache: string | boolean, debug: string | boolean }
 * @returns a single parsed object with parsed Envs as { key: value } pairs, a single extracted object with extracted Envs as { key: value } pairs, and an array of cached Envs as { path: string, contents: string } pairs
 */
export function config(options?: ConfigOptions): ConfigOutput {
  const { log } = console;
  const { assign } = Object;

  // default config options
  let dir = process.cwd();
  let path: string | string[] = [".env"];
  let debug: Option;
  let override: Option;
  let encoding: BufferEncoding = "utf-8";
  let cache: Option;

  // override default options with config options arguments
  if (options) {
    dir = options.dir || dir;
    path = options.path || path;
    debug = options.debug;
    encoding = options.encoding || encoding;
    cache = options.cache;
    override = options.override;
  }

  // split path into array of strings
  const configs = Array.isArray(path) ? path : path.split(",");

  // initializes parsed Env object
  const extracted: ParsedEnvs = {};

  // loop over configs array
  for (let i = 0; i < configs.length; i += 1) {
    // gets config path file
    const envPath = join(dir, configs[i]);
    try {
      // check that the file hasn't already been cached
      if (
        !cache ||
        (!__CACHE__.some(({ path }) => path === envPath) && cache)
      ) {
        // checks if "envPath" is a file that exists
        statSync(envPath).isFile();

        // reads and parses Envs from .env file
        const parsed = parse(readFileSync(envPath, { encoding }), override);

        // stores path and parsed file contents to internal cache
        if (cache)
          __CACHE__.push({
            path: envPath,
            contents: Buffer.from(JSON.stringify(parsed)).toString()
          });

        // assigns Envs to accumulated object
        assign(extracted, parsed);

        if (debug) log(`\x1b[90mLoaded env from ${envPath}\x1b[0m`);
      }
    } catch (err) {
      if (err.code !== "ENOENT") {
        log(`\x1b[33mUnable to load ${envPath}: ${err.message}.\x1b[0m`);
      }
    }
  }

  return {
    parsed: assign(process.env, extracted),
    extracted,
    cachedEnvFiles: __CACHE__
  };
}

/**
 * Immediately loads a single or multiple `.env` file contents into {@link https://nodejs.org/api/process.html#process_process_env | `process.env`} when the package is preloaded or imported.
 */
(function () {
  // check if ENV_LOAD is defined
  const {
    ENV_CACHE,
    ENV_DIR,
    ENV_LOAD,
    ENV_DEBUG,
    ENV_ENCODE,
    ENV_OVERRIDE
  } = process.env;
  if (ENV_LOAD) {
    config({
      dir: ENV_DIR,
      path: ENV_LOAD,
      debug: ENV_DEBUG,
      encoding: ENV_ENCODE as BufferEncoding,
      cache: ENV_CACHE,
      override: ENV_OVERRIDE
    });

    // prevents the IFFE from reloading the .env files
    delete process.env.ENV_LOAD;
  }
})();

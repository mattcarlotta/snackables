import { readFileSync } from "fs";
import parse from "parse";
import getFilePath from "../getFilePath";
import fileExists from "../fileExists";
import { logMessage, logWarning } from "../log";
import type {
  ConfigOptions,
  ConfigOutput,
  Path,
  Option,
  ParsedEnvs
} from "../types/index";

/**
 * Extracts and interpolates one or multiple `.env` files into an object and assigns them to {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 * Example: 'KEY=value' becomes { KEY: "value" }
 *
 * @param {object} options - accepts: { `dir`: string, `paths`: string | string[], `encoding`: BufferEncoding, `override`: boolean | string, `debug`: boolean | string }
 * @returns {object} a single object with `parsed` and `extracted` Envs as { KEY: "value" } pairs
 */
export default function config(options?: ConfigOptions): ConfigOutput {
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
    const envPath = getFilePath(configs[i], dir);
    try {
      // checks if "envPath" is a file that exists
      if (!fileExists(envPath)) throw String("File or folder doesn't exist");

      // reads and parses Envs from .env file
      const parsed = parse(readFileSync(envPath, { encoding }), override);

      // assigns Envs to accumulated object
      assign(extracted, parsed);

      if (debug) logMessage(`\x1b[90mLoaded env from ${envPath}\x1b[0m`);
    } catch (err) {
      if (debug)
        logWarning(
          `\x1b[33mUnable to load ${envPath}: ${err.toString()}.\x1b[0m`
        );
    }
  }

  return {
    parsed: assign(process.env, extracted),
    extracted
  };
}

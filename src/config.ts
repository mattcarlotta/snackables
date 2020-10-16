import { readFileSync } from "fs";
import { resolve } from "path";
import parse from "./parse";
import setENVs from "./set";
import { logInfo } from "./log";
import { ConfigOptions, ConfigOutput } from "./types";

const defaultPath = resolve(process.cwd(), ".env");

/**
 * Loads a single `.env` file contents into {@link https://nodejs.org/api/process.html#process_process_env | `process.env`} and returns the result as an object.
 *
 * @param debug - boolean
 * @param encoding - "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex"
 * @param path - stringified path to file relative to root
 * @returns an object with a `parsed` key if successful or `error` key if an error occurred
 *
 */
export default function config({
  debug = false,
  encoding = "utf-8",
  path = defaultPath
}: ConfigOptions): ConfigOutput {
  try {
    // parses ENVS from file
    const parsed = parse(readFileSync(path, { encoding }));

    // assigns ENVS to process.env
    setENVs(parsed);

    if (debug)
      logInfo(
        `Loaded '${path}' environment variables: ${JSON.stringify(parsed)}`
      );

    return { parsed };
  } catch (e) {
    return { error: e };
  }
}

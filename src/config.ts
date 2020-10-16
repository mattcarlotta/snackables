import { readFileSync } from "fs";
import { resolve } from "path";
import parse from "./parse";
import setENVs from "./set";
import { logInfo, logWarning } from "./log";

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
}: {
  path?: string; // path to .env file
  encoding?:
    | "ascii"
    | "utf8"
    | "utf-8"
    | "utf16le"
    | "ucs2"
    | "ucs-2"
    | "base64"
    | "latin1"
    | "binary"
    | "hex"; // encoding of .env file
  debug?: string | boolean; // turn on logging for debugging purposes
}): {
  error?: Error; // parsed error
  parsed?: { [name: string]: string }; // parsed ENVs
} {
  try {
    // parses ENVS from file
    const parsed = parse(readFileSync(path, { encoding }));

    if (debug)
      logInfo(
        `Extracted '${path}' environment variables: ${JSON.stringify(parsed)}`
      );

    // assigns ENVS to process.env
    setENVs(parsed);

    if (debug)
      logInfo(
        `Loaded '${path}' environment variables: ${JSON.stringify(parsed)}`
      );

    return { parsed };
  } catch (e) {
    if (debug)
      logWarning(
        `Failed to load '${path}' environment variables: ${e.toString()}`
      );
    return { error: e };
  }
}

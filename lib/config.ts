import { readFileSync, statSync } from "fs";
import { resolve } from "path";
import parse from "./parse";
import { ConfigOptions, ParsedOutput } from "../types";

function logInfo(msg: string): void {
  console.log(`\x1b[90m[snackables] ${msg}\x1b[0m`);
}

/**
 * Extracts multiple .env files into an object.
 *
 * @param configs - array of string envs: [".env.base", ".env.local"]
 * @param debug - boolean
 * @param encoding - "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex"
 * @returns an object with keys and values based on `src`
 */
export default function config({
  path = resolve(process.cwd(), ".env"),
  debug = false,
  encoding = "utf-8"
}: ConfigOptions): ParsedOutput {
  // split path into array of strings
  const configs = Array.isArray(path) ? path : path.split(",");

  // initializes ENV object
  let parsedENVs = {};

  // loop over configs array
  for (let i = 0; i < configs.length; i += 1) {
    // sets current config
    const config = configs[i];

    // sets current config path file (append .env. if using shorthand)
    const configFile = config.indexOf(".env") > -1 ? config : `.env.${config}`;

    try {
      // gets config path
      const envPath = resolve(process.cwd(), configFile);

      // checks if "envPath" is a file that exists
      statSync(envPath).isFile();

      // parses ENVS from path
      const parsed = parse(readFileSync(envPath, { encoding }));

      // assigns ENVs to ENV object
      parsedENVs = Object.assign(parsedENVs, parsed);

      if (debug)
        logInfo(
          `Extracted '${configFile}' environment variables: ${JSON.stringify(
            parsed
          )}`
        );
    } catch (e) {
      console.warn(
        `\x1b[33m[snackables] Unable to extract '${configFile}': ${e.message}.\x1b[0m`
      );
    }
  }

  process.env = Object.assign(process.env, parsedENVs);

  if (debug) logInfo(`Assigned ${JSON.stringify(parsedENVs)} to process.env`);

  return parsedENVs;
}

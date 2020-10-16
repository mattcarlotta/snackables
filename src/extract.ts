import { readFileSync, statSync } from "fs";
import { resolve } from "path";
import parse from "./parse";
import { logInfo, logWarning } from "./log";
import { ExtractOptions, ParsedOutput } from "../types";

/**
 * Extracts multiple .env files into an object.
 *
 * @param configs - array of string envs: [".env.base", ".env.local"]
 * @param debug - boolean
 * @param encoding - "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex"
 * @returns an object with keys and values based on `src`
 */
export default function extract({
  configs,
  debug,
  encoding = "utf-8"
}: ExtractOptions): ParsedOutput {
  // grabs root directory
  const root = process.cwd();

  // initializes ENV object
  let parsedENVs = {};

  // sets up loop
  let i = 0;

  // loops over configs array
  while (i < configs.length) {
    // sets current config
    const config = configs[i];

    try {
      // gets config path
      const envPath = resolve(root, `.env.${config}`);

      // checks if "envPath" is a file that exists
      if (statSync(envPath).isFile()) {
        // parses ENVS from path
        const parsed = parse(readFileSync(envPath, { encoding }));

        // assigns ENVs to ENV object
        parsedENVs = Object.assign(parsedENVs, parsed);

        if (debug)
          logInfo(
            `Extracted 'env.${config}' environment variables: ${JSON.stringify(
              parsed
            )}`
          );
      }
    } catch (e) {
      logWarning(
        `Unable to extract 'env.${config}' because the file was not found within the '${root}' directory.`
      );
    } finally {
      i += 1;
    }
  }

  return parsedENVs;
}

import set from "./set";
import extract from "./extract";
import { logInfo } from "./log";

export type Encoding =
  | "ascii"
  | "utf8"
  | "utf-8"
  | "utf16le"
  | "ucs2"
  | "ucs-2"
  | "base64"
  | "latin1"
  | "binary"
  | "hex";

const { ENV_LOAD, ENV_DEBUG, ENV_ENCODE } = process.env;

/**
 * Loads a single or multiple `.env` file contents into {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 *
 */
(function (): void {
  // check if ENV_LOAD is defined
  if (ENV_LOAD != null) {
    const debug = Boolean(ENV_DEBUG);

    // extract and split all .env.* from ENV_LOAD into a parsed object of ENVS
    const parsedENVs = extract({
      configs: ENV_LOAD.split(","),
      debug,
      encoding: ENV_ENCODE as Encoding
    });

    // sets ENVS to process.env
    set(parsedENVs);

    if (debug) logInfo(`Assigned ${JSON.stringify(parsedENVs)} to process.env`);
  }
})();

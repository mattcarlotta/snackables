import set from "./set";
import extract from "./extract";
import { logInfo } from "./log";
import { Encoding } from "./types";

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
      debug: Boolean(ENV_DEBUG),
      encoding: ENV_ENCODE as Encoding
    });

    // sets envs to process.env
    set(parsedENVs);

    if (debug) logInfo(`Assigned ${JSON.stringify(parsedENVs)} to process.env`);
  }
})();

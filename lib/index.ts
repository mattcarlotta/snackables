import config from "./config";
import parse from "./parse";
import { Encoding } from "../types";

const { ENV_LOAD, ENV_DEBUG, ENV_ENCODE } = process.env;
/**
 * Loads a single or multiple `.env` file contents into {@link https://nodejs.org/api/process.html#process_process_env | `process.env`}.
 *
 */
((): void => {
  // check if ENV_LOAD is defined
  if (ENV_LOAD != null) {
    // extract and split all .env.* from ENV_LOAD into a parsed object of ENVS
    config({
      path: ENV_LOAD.split(","),
      debug: Boolean(ENV_DEBUG),
      encoding: ENV_ENCODE as Encoding
    });
  }
})();

export { config, parse };

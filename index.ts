import config from "./config";
import parse from "./parse";
import load from "./load";
import assign from "./assign";
import type { ConfigOptions } from "./types/index";

/**
 * Immediately loads a single or multiple `.env` file contents into {@link https://nodejs.org/api/process.html#process_process_env | `process.env`} when the package is preloaded or imported.
 */
(async function (): Promise<void> {
  const { env } = process;
  const { LOAD_CONFIG } = env;

  let dir: ConfigOptions["dir"];
  let paths: ConfigOptions["paths"];
  let debug: ConfigOptions["debug"];
  let encoding: ConfigOptions["encoding"];
  let override: ConfigOptions["override"];

  // checks if LOAD_CONFIG is defined and assigns config options
  if (LOAD_CONFIG) {
    const envConfig = await load(LOAD_CONFIG);

    if (Object.keys(envConfig).length) {
      dir = envConfig.dir;
      paths = envConfig.paths;
      debug = envConfig.debug;
      encoding = envConfig.encoding;
      override = envConfig.override;
    }

    // prevents the IFFE from reloading the config file
    delete process.env.LOAD_CONFIG;
  }

  const { ENV_DIR, ENV_LOAD, ENV_DEBUG, ENV_ENCODE, ENV_OVERRIDE } = env;

  // checks if ENV_LOAD is defined and automatically calls config with Env variables
  if (ENV_LOAD || paths) {
    config({
      dir: ENV_DIR || dir,
      paths: ENV_LOAD || paths,
      debug: ENV_DEBUG || debug,
      encoding: (ENV_ENCODE || encoding) as BufferEncoding,
      override: ENV_OVERRIDE || override
    });

    // prevents the IFFE from reloading the .env files
    delete process.env.ENV_LOAD;
  }
})();

export { assign, config, load, parse };

const snackables = {
  assign,
  config,
  load,
  parse
};

export default snackables;

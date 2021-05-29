import { logWarning } from "log";
import getFilePath from "../getFilePath";
import fileExists from "../fileExists";
import importFile from "../importFile";
import type { ConfigOptions } from "../types/index";

/**
 * Loads a config object from the `env.config.(m)js` file based upon `LOAD_ENV`.
 *
 * @param env - the environment to be loaded
 * @param dir - the directory where the config is located
 * @returns a promise that resolves a config file as { key: value } pairs to be used with the `config` function
 * @example load("development")
 */
export default async function load(
  env: string,
  dir?: string
): Promise<ConfigOptions> {
  try {
    const configName = "env.config";
    let configPath = getFilePath(`${configName}.js`, dir);

    if (!fileExists(configPath)) {
      configPath = getFilePath(`${configName}.mjs`, dir);
      if (!fileExists(configPath))
        throw String(
          `Unable to locate an '${configName}.(m)js' file in the specified directory!`
        );
    }

    const config = await importFile(configPath);

    if (
      typeof config !== "object" ||
      !Object.prototype.hasOwnProperty.call(config, env)
    )
      throw String(
        `Unable to locate a '${env}' configuration within '${configName}.(m)js'!`
      );

    return config[env] as ConfigOptions;
  } catch (error) {
    logWarning(error.toString());
    return {} as ConfigOptions;
  }
}

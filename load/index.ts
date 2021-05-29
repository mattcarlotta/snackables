import { logWarning } from "log";
import getFilePath from "../getFilePath";
import fileExists from "../fileExists";
import importFile from "../importFile";
import type { ConfigArgs } from "../types/index";

/**
 * Loads a config object from the `env.config.(m)js` file based upon `LOAD_ENV`.
 *
 * @param env - the environment to be loaded
 * @returns a promise that resolves a config file as { key: value } pairs to be used with the `config` function
 * @example load("development")
 */
export default async function load(env: string): Promise<ConfigArgs> {
  try {
    const configName = "env.config";
    let configPath = getFilePath(`${configName}.js`);

    if (!fileExists(configPath)) {
      configPath = getFilePath(`${configName}.mjs`);
      if (!fileExists(configPath))
        throw String(
          `Unable to locate an '${configName}.(m)js' file in the root directory!`
        );
    }

    const config = await importFile(configPath);

    const configArgs = config[env];
    if (!configArgs)
      throw String(
        `Unable to locate a '${env}' configuration within '${configName}.(m)js'!`
      );

    return configArgs as ConfigArgs;
  } catch (error) {
    logWarning(error.toString());
    return {} as ConfigArgs;
  }
}

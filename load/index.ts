import { logWarning } from "log";
import getFilePath from "../getFilePath";
import fileExists from "../fileExists";
import importFile from "../importFile";
import type { ConfigArgs } from "../types/index";

/**
 * Loads a config object from the `env.config.(m)js` file based upon `LOAD_ENV`.
 *
 * @param {string} env - the environment to be loaded
 * @returns {Promise<ConfigArgs | void>} a promise that resolves a config file as { key: value } pairs to be used with the `config` function
 * @example load("development")
 */
export default async function load(env: string): Promise<ConfigArgs | void> {
  try {
    let configPath = getFilePath("env.config.js");

    if (!fileExists(configPath)) {
      configPath = getFilePath("env.config.mjs");
      if (!fileExists(configPath))
        throw String(
          "Unable to locate an 'env.config.(m)js' file in the root directory!"
        );
    }

    const config = await importFile(configPath);

    const configArgs = config[env];
    if (!configArgs)
      throw String(
        `Unable to locate a '${env}' configuration within 'env.config.(m)js'!`
      );

    return configArgs as ConfigArgs;
  } catch (error) {
    logWarning(error.toString());
  }
}

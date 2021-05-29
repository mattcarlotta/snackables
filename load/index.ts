import { readFileSync } from "fs";
import { logWarning } from "../log";
import getFilePath from "../getFilePath";
import fileExists from "../fileExists";
// import importFile from "../importFile";
import type { ConfigOptions } from "../types/index";

/**
 * Loads a configuration object from the `env.config.json` file based upon `LOAD_ENV`.
 *
 * @param env - the environment to be loaded
 * @param dir - the directory where the config is located
 * @returns a config file as { key: value } pairs to be used with the `config` function
 * @example load("development")
 */
export default function load(env: string, dir?: string): ConfigOptions {
  try {
    const configName = "env.config.json";
    const configPath = getFilePath(configName, dir);
    // let configPath = getFilePath(`${configName}.js`, dir);

    if (!fileExists(configPath))
      throw String(
        `Unable to locate an '${configName}' file in the specified directory!`
      );

    // if (!fileExists(configPath)) {
    //   configPath = getFilePath(`${configName}.mjs`, dir);
    //   if (!fileExists(configPath))
    //     throw String(
    //       `Unable to locate an '${configName}.(m)js' file in the specified directory!`
    //     );
    // }

    // TODO - Change this use `importFile`, however this may cause a racing condition.
    // const config = await importFile(configPath);
    const file = readFileSync(configPath, { encoding: "utf-8" });

    const config = JSON.parse(file);

    if (
      typeof config !== "object" ||
      !Object.prototype.hasOwnProperty.call(config, env)
    )
      throw String(
        `Unable to locate a '${env}' configuration within '${configName}'!`
      );

    return config[env] as ConfigOptions;
  } catch (error) {
    logWarning(error.toString());
    return {} as ConfigOptions;
  }
}

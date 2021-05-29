/**
 * Attempts to `import`/`require` a JavaScript `env.config.(m)js` file.
 *
 * @param {string} module - path to config file
 * @returns {object} an object configuration
 */
export default async function importModule(module: string): Promise<any> {
  try {
    return require(module);
  } catch (err) {
    if (err.code === "ERR_REQUIRE_ESM") {
      console.log("triggered");
      const { default: defaultExport } = await import(module);
      return defaultExport;
    }
  }
}

import fs from "fs";
import { join } from "path";
import { minify } from "terser";
import terserOptions from "../terser.config.json";

(async (): Promise<void> => {
  try {
    const dirs = [
      "assign",
      "config",
      "fileExists",
      "getFilePath",
      // "importFile",
      "load",
      "log",
      "parse",
      ""
    ];

    for (let i = 0; i < dirs.length; i += 1) {
      const file = `${dirs[i]}/index.js`;

      const filePath = join(process.cwd(), file);

      /* eslint-disable no-await-in-loop */
      const { code } = await minify(
        fs.readFileSync(filePath, { encoding: "utf-8" }),
        terserOptions
      );

      if (code) fs.writeFileSync(filePath, code, { encoding: "utf-8" });
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

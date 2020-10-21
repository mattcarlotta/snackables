import fs from "fs";
import { minify } from "terser";

const options = {
  compress: {
    warnings: false,
    comparisons: false,
    inline: 2
  },
  mangle: {
    safari10: true
  },
  output: {
    comments: false,
    ascii_only: true
  }
};

(async () => {
  try {
    const { code } = await minify(
      fs.readFileSync("lib/index.js", { encoding: "utf-8" }),
      options
    );
    if (code) fs.writeFileSync("lib/index.js", code, { encoding: "utf-8" });
  } catch (error) {
    /* eslint-disable-next-line */
    console.error(error);
    process.exit(1);
  }
})();

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
      fs.readFileSync("index.js", { encoding: "utf-8" }),
      options
    );
    if (code) fs.writeFileSync("index.js", code, { encoding: "utf-8" });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

const input = ["index.ts"];

const withPlugins = tsconfig => [
  typescript({ tsconfig }),
  terser({
    compress: {
      warnings: false,
      comparisons: false,
      inline: 2
    },
    mangle: {
      safari10: true
    },
    output: {
      comments: false
    }
  })
];

const cjsConfig = {
  input,
  output: [{ format: "cjs" }],
  plugins: withPlugins("./tsconfig.cjs.json")
};

const esmConfig = {
  preserveModules: true,
  input,
  output: [{ dir: "esm", format: "esm", entryFileNames: "[name].mjs" }],
  plugins: withPlugins("./tsconfig.esm.json")
};

export default [cjsConfig, esmConfig];

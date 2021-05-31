import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import terserOptions from "./terser.config.json";

export default [
  {
    preserveModules: true,
    input: ["index.ts"],
    output: [{ dir: "esm", format: "esm", entryFileNames: "[name].mjs" }],
    external: ["fs", "child_process", "path"],
    plugins: [
      typescript({ tsconfig: "./ts/tsconfig.esm.json" }),
      terser(terserOptions)
    ]
  }
];

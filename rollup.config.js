import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";
import { terser } from "rollup-plugin-terser";

export default [
  {
    preserveModules: true,
    input: ["index.ts"],
    output: [{ dir: "esm", format: "esm", entryFileNames: "[name].mjs" }],
    external: ["fs", "child_process", "path"],
    plugins: [
      typescript({ tsconfig: "./tsconfig.esm.json" }),
      copy({
        targets: [{ src: "types/index.d.ts", dest: "esm/types" }]
      }),
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
          comments: false,
          ascii_only: true
        }
      })
    ]
  }
];

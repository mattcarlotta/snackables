import { config } from "snackables";

const { extracted } = config({ dir: "tests" });

console.log(
  `\x1b[32mextracted ENVs: ${JSON.stringify(extracted, null, 2)}\x1b[0m`
);

import { config } from "snackables";

const { parsed, extracted } = config();

console.log(
  `\x1b[32mextracted ENVs: ${JSON.stringify(extracted, null, 2)}\x1b[0m`
);
console.log(`\x1b[32mparsed ENVs: ${parsed.ROOT}\x1b[0m`);

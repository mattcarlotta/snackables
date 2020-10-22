import { config } from "snackables";

const parsed = config();

console.log(`\x1b[32mparsed ENVs: ${JSON.stringify(parsed, null, 2)}\x1b[0m`);

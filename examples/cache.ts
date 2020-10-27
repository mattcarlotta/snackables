import { config } from "snackables";

console.log(`\x1b[32mCache is working if warning is thrown...\x1b[0m`);

const { cachedEnvFiles } = config({ path: "base" });

console.log(
  `\x1b[32mcachedENVFiles: ${JSON.stringify(cachedEnvFiles, null, 2)}\x1b[0m`
);

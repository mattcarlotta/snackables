/* eslint-disable no-console */
import { config } from "snackables";

config({ path: [".env.base", ".env.test"], debug: true });

console.log(`\x1b[32mprocess.env.MESSAGE: ${process.env.MESSAGE}\x1b[0m`);
console.log(`\x1b[32mprocess.env.TESTING: ${process.env.TESTING}\x1b[0m`);

/* eslint-enable no-console */

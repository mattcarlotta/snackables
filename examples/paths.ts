import { config } from "snackables";

config({ dir: "examples", paths: ".env.test", debug: true });

console.log(`\x1b[32mprocess.env.TESTING: ${process.env.TESTING}\x1b[0m`);

import { config, parse } from "snackables";

process.env.TESTING = "false";

console.log(`\x1b[32mprocess.env.TESTING: ${process.env.TESTING}\x1b[0m`);

config({ dir: "examples", paths: ".env.test", debug: true, override: true });

console.log(`\x1b[32mprocess.env.TESTING: ${process.env.TESTING}\x1b[0m`);

let result = parse(Buffer.from("TESTING=true"));

console.log(`\x1b[32mprocess.env.TESTING: ${result.TESTING}\x1b[0m`);

result = parse(Buffer.from("TESTING=false"), true);

console.log(`\x1b[32mprocess.env.TESTING: ${result.TESTING}\x1b[0m`);

Object.assign(process.env, result);

console.log(`\x1b[32mprocess.env.TESTING: ${result.TESTING}\x1b[0m`);

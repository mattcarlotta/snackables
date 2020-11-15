import { config, parse } from "snackables";

process.env.TESTING = "false";
console.log(`\x1b[32mprocess.env.TESTING: ${process.env.TESTING}\x1b[0m`);

config({ dir: "examples", paths: ".env.test", debug: true, override: true });
console.log(`\x1b[32mprocess.env.TESTING: ${process.env.TESTING}\x1b[0m`);

// process.env is defined therefore parse won't return anything
let result = parse(Buffer.from("TESTING=true"));
console.log(`\x1b[32mresult.TESTING: ${result.TESTING}\x1b[0m`);

// override Env in process.env
result = parse(Buffer.from("TESTING=false"), true);
Object.assign(process.env, result);
console.log(`\x1b[32mresult.TESTING: ${result.TESTING}\x1b[0m`);
console.log(`\x1b[32mprocess.env.TESTING: ${result.TESTING}\x1b[0m`);

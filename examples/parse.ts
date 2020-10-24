import { parse } from "snackables";

process.env.PORT = "5000";

const parseString = parse("NODE_ENV=production\nDB_HOST=a.b.c");
const dbHost: string = parseString.parsed["DB_HOST"];

const parsedFromBuffer = parse(Buffer.from("JUSTICE=league\n"));
const justice: string = parsedFromBuffer.parsed["JUSTICE"];

const parsedFromInterp = parse("DB_PORT=$PORT");
const apiPort: string = parsedFromInterp.parsed["DB_PORT"];

console.log(`\x1b[32mDB_HOST parsed from string: ${dbHost}\x1b[0m`);
console.log(`\x1b[32mJUSTICE parsed from Buffer: ${justice}\x1b[0m`);
console.log(`\x1b[32mDB_PORT parsed from process.env: ${apiPort}\x1b[0m`);

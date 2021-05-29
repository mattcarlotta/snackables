/* eslint-disable @typescript-eslint/no-unused-vars */
import { config, parse, load } from "snackables";

const env = config();
const dbUrl = !env.parsed ? null : env.parsed["BASIC"];

config({
  paths: ".env-example",
  encoding: "utf8",
  debug: true
});

(async () => {
  const loaded = await load("test");

  const loadedENVDEBUG = loaded["ENV_DEBUG"];
})();

const parsed = parse("NODE_ENV=production\nDB_HOST=a.b.c");
const dbHost = parsed["DB_HOST"];

const parsedFromBuffer = parse(Buffer.from("JUSTICE=league\n"));
const justice = parsedFromBuffer["JUSTICE"];

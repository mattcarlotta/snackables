import { expectType } from "tsd";
import snackables from "snackables";
import type { ConfigOptions, ParsedEnvs, ProcessEnv } from "snackables";

const env = snackables.config();
expectType<string>(env.parsed["ROOT"]);

const { parsed, extracted } = snackables.config({
  dir: "tests",
  paths: ".env-example",
  encoding: "utf8",
  debug: true
});

expectType<ProcessEnv>(parsed);
expectType<string>(parsed["BASE"]);
expectType<ParsedEnvs>(extracted);
expectType<string>(extracted["BASE"]);

expectType<ConfigOptions>(snackables.load("test"));
const envConfig = snackables.load("test");
expectType<ConfigOptions>(envConfig);
expectType<string>(envConfig["dir"] as string);

expectType<ParsedEnvs>(snackables.parse("NODE_ENV=production\nDB_HOST=a.b.c"));

const parsedEnvs = snackables.parse(Buffer.from("JUSTICE=league\n"));
expectType<ParsedEnvs>(parsedEnvs);
expectType<ProcessEnv>(snackables.assign(parsedEnvs))

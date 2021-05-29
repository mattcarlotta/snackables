import { expectType } from "tsd";
import { config, load, parse } from "snackables";
import type { ConfigOptions, ParsedEnvs, ProcessEnv } from "snackables";

const env = config();
expectType<string>(env.parsed["ROOT"]);

const { parsed, extracted } = config({
  dir: "tests",
  paths: ".env-example",
  encoding: "utf8",
  debug: true
});

expectType<ProcessEnv>(parsed);
expectType<string>(parsed["BASE"]);
expectType<ParsedEnvs>(extracted);
expectType<string>(extracted["BASE"]);

expectType<Promise<ConfigOptions>>(load("test"));
const envConfig = await load("test");
expectType<ConfigOptions>(envConfig);
expectType<string>(envConfig["dir"] as string);

expectType<ParsedEnvs>(parse("NODE_ENV=production\nDB_HOST=a.b.c"));

expectType<ParsedEnvs>(parse(Buffer.from("JUSTICE=league\n")));
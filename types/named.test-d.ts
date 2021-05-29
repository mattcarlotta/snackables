import { expectType } from "tsd";
import { config, load, parse } from "snackables";
import type { ConfigArgs, Option, ParsedEnvs, ProcessEnv } from "snackables";

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

expectType<Promise<ConfigArgs>>(load("test"));
const envConfig = await load("test");
expectType<ConfigArgs>(envConfig);
expectType<Option>(envConfig["ENV_DEBUG"]);

expectType<ParsedEnvs>(parse("NODE_ENV=production\nDB_HOST=a.b.c"));

expectType<ParsedEnvs>(parse(Buffer.from("JUSTICE=league\n")));
import { expectType } from "tsd";
import snackables from "snackables";
import type { ConfigArgs, Option, ParsedEnvs, ProcessEnv } from "snackables";

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

expectType<Promise<ConfigArgs>>(snackables.load("test"));
const envConfig = await snackables.load("test");
expectType<ConfigArgs>(envConfig);
expectType<Option>(envConfig["ENV_DEBUG"]);

expectType<ParsedEnvs>(snackables.parse("NODE_ENV=production\nDB_HOST=a.b.c"));

expectType<ParsedEnvs>(snackables.parse(Buffer.from("JUSTICE=league\n")));

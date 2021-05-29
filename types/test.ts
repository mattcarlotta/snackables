import { expectType } from "tsd";
import * as snackables from "snackables";
import type { ConfigArgs, ParsedEnvs, ProcessEnv } from "snackables";

const env = snackables.config();
expectType<string>(env.parsed["BASIC"]);

const { parsed, extracted } = snackables.config({
  paths: ".env-example",
  encoding: "utf8",
  debug: true
});

expectType<ProcessEnv>(parsed);
expectType<ParsedEnvs>(extracted);

expectType<Promise<ConfigArgs>>(snackables.load("test"));
expectType<ConfigArgs>(await snackables.load("test"));

expectType<ParsedEnvs>(snackables.parse("NODE_ENV=production\nDB_HOST=a.b.c"));

expectType<ParsedEnvs>(snackables.parse(Buffer.from("JUSTICE=league\n")));

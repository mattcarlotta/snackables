import fs from "fs";
import { parse } from "../index";

const parsed = parse(fs.readFileSync("tests/.env", { encoding: "utf8" }));

describe("Parse Method", () => {
  it("returns an object", () => {
    expect(parsed).toEqual(expect.any(Object));
  });

  it("sets basic attributes", () => {
    expect(parsed.BASIC).toEqual("basic");
  });

  it("reads after a skipped line", () => {
    expect(parsed.AFTER_LINE).toEqual("after_line");
  });

  it("defaults empty values to empty string", () => {
    expect(parsed.EMPTY).toEqual("");
  });

  it("escapes single quoted values", () => {
    expect(parsed.SINGLE_QUOTES).toEqual("single_quotes");
  });

  it("respects surrounding spaces in single quotes", () => {
    expect(parsed.SINGLE_QUOTES_SPACED).toEqual("    single quotes    ");
  });

  it("escapes double quoted values", () => {
    expect(parsed.DOUBLE_QUOTES).toEqual("double_quotes");
  });

  it("respects surrounding spaces in double quotes", () => {
    expect(parsed.DOUBLE_QUOTES_SPACED).toEqual("    double quotes    ");
  });

  it("doesn't respect newlines if not double quoted", () => {
    expect(parsed.EXPAND_NEWLINES).toEqual("expand\nnew\nlines");
    expect(parsed.DONT_EXPAND_UNQUOTED).toEqual("dontexpand\\nnewlines");
    expect(parsed.DONT_EXPAND_SQUOTED).toEqual("dontexpand\\nnewlines");
  });

  it("ignores commented lines", () => {
    expect(parsed.COMMENTS).toBeUndefined();
  });

  it("respects equals signs in values", () => {
    expect(parsed.EQUAL_SIGNS).toEqual("equals==");
  });

  it("retains inner quotes", () => {
    expect(parsed.RETAIN_INNER_QUOTES).toEqual('{"foo": "bar"}');
    expect(parsed.RETAIN_INNER_QUOTES_AS_STRING).toEqual('{"foo": "bar"}');
  });

  it("retains leading double quote", () => {
    expect(parsed.RETAIN_LEADING_DQUOTE).toEqual('"retained');
  });

  it("retains leading single quote", () => {
    expect(parsed.RETAIN_LEADING_SQUOTE).toEqual("'retained");
  });

  it("reatins trailing double quote", () => {
    expect(parsed.RETAIN_TRAILING_DQUOTE).toEqual('retained"');
  });

  it("retains trailing single quote", () => {
    expect(parsed.RETAIN_TRAILING_SQUOTE).toEqual("retained'");
  });

  it("retains spaces in string", () => {
    expect(parsed.TRIM_SPACE_FROM_UNQUOTED).toEqual("some spaced out string");
  });

  it("parses email addresses correctly", () => {
    expect(parsed.USERNAME).toEqual("therealnerdybeast@example.tld");
  });

  it("parses keys and values surrounded by spaces", () => {
    expect(parsed.SPACED_KEY).toEqual("parsed");
  });

  it("parses a buffer into an object", () => {
    const payload = parse(Buffer.from("BUFFER=true"));
    expect(payload.BUFFER).toEqual("true");
  });

  it("parses (\\r) line endings", () => {
    const expectedPayload = {
      SERVER: "localhost",
      PASSWORD: "password",
      DB: "tests"
    };
    const RPayload = parse(
      Buffer.from("SERVER=localhost\rPASSWORD=password\rDB=tests\r")
    );
    expect(RPayload).toEqual(expectedPayload);

    const NPayload = parse(
      Buffer.from("SERVER=localhost\nPASSWORD=password\nDB=tests\n")
    );
    expect(NPayload).toEqual(expectedPayload);

    const RNPayload = parse(
      Buffer.from("SERVER=localhost\r\nPASSWORD=password\r\nDB=tests\r\n")
    );
    expect(RNPayload).toEqual(expectedPayload);
  });

  it("parses default substitutions", () => {
    const result = parse(
      Buffer.from(
        `DEFAULT_VALUE=\${DEFAULT|hello}\nDEFAULT_EXAMPLE=$DEFAULT|hello\nENVNMT=$UNDFINED|$NODE_ENV`
      )
    );

    expect(result).toEqual(
      expect.objectContaining({
        DEFAULT_VALUE: "hello",
        DEFAULT_EXAMPLE: "hello",
        ENVNMT: "test"
      })
    );
  });

  it("parses single command-line substitutions", () => {
    let result = parse(
      Buffer.from(
        "MESSAGE=$(echo 'Welcome To The Mad House' | sed 's/[^A-Z]//g')"
      )
    );

    expect(result.MESSAGE).toEqual("WTTMH");
  });

  it("parses multiple command-line substitutions", () => {
    const result = parse(Buffer.from(`ADMIN=$(echo 'Bob') $(echo "Smith")`));

    expect(result.ADMIN).toEqual("Bob Smith");
  });

  it("parses and interopolates command-line substitutions", () => {
    const result = parse(
      Buffer.from(`ADMIN=$(echo 'Bob')@$(echo "Smith")\nDBADMIN=$ADMIN`)
    );

    expect(result.ADMIN).toEqual("Bob@Smith");
    expect(result.DBADMIN).toEqual("Bob@Smith");
  });

  it("handles invalid command-line substitutions", () => {
    const spy = jest.spyOn(console, "log").mockImplementation();

    parse(Buffer.from("INVALIDCOMMAND=$(invalid)"));

    expect(spy.mock.calls[0][0]).toContain("Command failed: invalid");
    spy.mockRestore();
  });
});

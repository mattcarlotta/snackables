import { config } from "../index";

const root = process.cwd();

describe("Config Method", () => {
  it("loads a default .env file", () => {
    const result = config();

    expect(result).toEqual(
      expect.objectContaining({
        ROOT: "true"
      })
    );
  });

  it("accepts a path argument as a string", () => {
    const result = config({ path: "tests/.env.base" });

    expect(result).toEqual(
      expect.objectContaining({
        BASE: "hello"
      })
    );
  });

  it("accepts a path argument as a string of files with commas", () => {
    const result = config({ path: "tests/.env.base,tests/.env.test" });

    expect(result).toEqual(
      expect.objectContaining({
        BASE: "hello",
        TESTING: "true"
      })
    );
  });

  it("accepts a path argument as an array", () => {
    const result = config({ path: ["tests/.env.base"] });

    expect(result).toEqual(
      expect.objectContaining({
        BASE: "hello"
      })
    );
  });

  it("accepts an encoding argument", () => {
    const result = config({ encoding: "utf-8" });

    expect(result).toEqual(
      expect.objectContaining({
        ROOT: "true"
      })
    );
  });

  it("accepts a debug argument", () => {
    const spy = jest.spyOn(console, "log").mockImplementation();

    config({ path: "tests/.env.base", debug: true });

    expect(spy.mock.calls[0][0]).toContain(
      `Extracted '${root}/tests/.env.base' ENVs`
    );

    expect(spy.mock.calls[1][0]).toContain(
      `Assigned {"BASE":"hello"} to process.env`
    );

    const invalidPath = "tests/.env.invalid";
    config({ path: "tests/.env.invalid", debug: true });

    expect(spy.mock.calls[2][0]).toContain(
      `Unable to extract '${root}/${invalidPath}': ENOENT: no such file or directory`
    );

    spy.mockRestore();
  });

  it("interops .env keys", () => {
    process.env.MACHINE = "node";
    const result = config({ path: "tests/.env.interp" });

    expect(result).toEqual(
      expect.objectContaining({
        BASIC: "basic",
        BASIC_EXPAND: "basic",
        BASIC_EMPTY: ""
      })
    );
  });

  it("interops and prioritizes process.env keys over .env keys", () => {
    process.env.MACHINE = "node";
    const result = config({ path: "tests/.env.interp" });

    expect(result).toEqual(
      expect.objectContaining({
        MACHINE: "machine_env",
        MACHINE_EXPAND: "node"
      })
    );
  });

  it("interops undefined keys", () => {
    const result = config({ path: "tests/.env.interp" });

    expect(result).toEqual(
      expect.objectContaining({
        UNDEFINED_EXPAND: ""
      })
    );
  });

  it("interops mixed ENV with or without brackets values", () => {
    const result = config({ path: "tests/.env.interp" });

    expect(result).toEqual(
      expect.objectContaining({
        MONGOLAB_URI:
          "mongodb://root:password@abcd1234.mongolab.com:12345/localhost",
        MONGOLAB_URI_RECURSIVELY:
          "mongodb://root:password@abcd1234.mongolab.com:12345/localhost",
        MONGOLAB_USER: "root",
        MONGOLAB_USER_RECURSIVELY: "root:password",
        UNDEFINED_EXPAND: "",
        WITHOUT_CURLY_BRACES_URI:
          "mongodb://root:password@abcd1234.mongolab.com:12345/localhost",
        WITHOUT_CURLY_BRACES_URI_RECURSIVELY:
          "mongodb://root:password@abcd1234.mongolab.com:12345/localhost",
        WITHOUT_CURLY_BRACES_USER_RECURSIVELY: "root:password"
      })
    );
  });

  it("doesn't interp escaped $ keys", () => {
    const result = config({ path: "tests/.env.interp" });

    expect(result).toEqual(
      expect.objectContaining({
        ESCAPED_EXPAND: "$ESCAPED",
        ESCAPED_TITLE: "There are $nakes in my boot$"
      })
    );
  });

  it("overwrites keys already in process.env", () => {
    const AUTHOR = "Matt";
    process.env.AUTHOR = AUTHOR;

    const result = config({ path: "tests/.env.overwrite" });

    expect(result).toEqual(
      expect.objectContaining({
        AUTHOR: "Default"
      })
    );
    expect(process.env.AUTHOR).toEqual(result.AUTHOR);
  });
});

/* eslint-disable no-console */
import { config } from "../lib";

jest.spyOn(global.console, "log").mockImplementation();
jest.spyOn(global.console, "warn").mockImplementation();

describe("Config Method", () => {
  afterAll(() => {
    jest.resetModules();
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
    config({ path: "tests/.env.base", debug: true });

    // @ts-ignore
    expect(global.console.log.mock.calls[0][0]).toContain(
      "Extracted 'tests/.env.base' environment variables"
    );

    // @ts-ignore
    expect(global.console.log.mock.calls[1][0]).toContain(
      `Loaded 'tests/.env.base' environment variables`
    );

    const invalidPath = "tests/.env.invalid";
    config({ path: "tests/.env.invalid", debug: true });

    // @ts-ignore
    expect(global.console.warn.mock.calls[0][0]).toContain(
      `Unable to extract '${invalidPath}': ENOENT: no such file or directory`
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

import fs from "fs";
import { config } from "../src";

jest.spyOn(fs, "readFileSync");
jest.spyOn(global.console, "log").mockImplementation();
jest.spyOn(global.console, "warn").mockImplementation();

const root = process.cwd();
const defaultEncoding = "utf-8";

describe("Config Method", () => {
  afterAll(() => {
    jest.resetModules();
  });

  it("accepts a path argument", () => {
    const testPath = "tests/.env";
    config({ path: testPath });
    expect(fs.readFileSync).toHaveBeenCalledWith(testPath, {
      encoding: defaultEncoding
    });
  });

  it("accepts an encoding argument", () => {
    const testEncoding = "latin1";
    config({ encoding: testEncoding });
    expect(fs.readFileSync).toHaveBeenCalledWith(`${root}/.env`, {
      encoding: testEncoding
    });
  });

  it("accepts a debug argument", () => {
    config({ path: "tests/.env", debug: true });

    // @ts-ignore
    expect(global.console.log.mock.calls[0][0]).toContain(
      "Extracted 'tests/.env' environment variables"
    );

    // @ts-ignore
    expect(global.console.log.mock.calls[1][0]).toContain(
      "Loaded 'tests/.env' environment variables"
    );

    const invalidPath = "tests/.env.invalid";
    config({ path: "tests/.env.invalid", debug: true });

    // @ts-ignore
    expect(global.console.warn.mock.calls[0][0]).toContain(
      `Failed to load '${invalidPath}' environment variables:`
    );
  });

  it("extracts and loads file to process.env while returning parsed output", () => {
    expect(process.env.BASE).toBeUndefined();

    const res = config({ path: "tests/.env.base" });

    expect(process.env.BASE).toEqual("hello");

    expect(res).toEqual(
      expect.objectContaining({
        parsed: expect.objectContaining({
          BASE: "hello"
        })
      })
    );
  });

  it("fails to extract a file that doesn't exist while returning the error output", () => {
    const res = config({ path: "tests/.env.invalid", debug: true });

    expect(res).toEqual(
      expect.objectContaining({
        error:
          "Error: ENOENT: no such file or directory, open 'tests/.env.invalid'"
      })
    );
  });

  it("doesn't overwrite keys already in process.env", () => {
    const AUTHOR = "Matt";
    process.env.AUTHOR = AUTHOR;

    const res = config({ path: "tests/.env.overwrite" });

    expect(res).toEqual(
      expect.objectContaining({
        parsed: expect.objectContaining({
          AUTHOR: "Hijacker"
        })
      })
    );
    expect(process.env.AUTHOR).toEqual(AUTHOR);
  });
});

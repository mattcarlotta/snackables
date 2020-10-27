import { config } from "../index";
import { ParsedENVs } from "../index.d";

const root = process.cwd();

describe("Config Method", () => {
  it("loads a default .env file", () => {
    const { extracted } = config();

    expect(extracted).toEqual(
      expect.objectContaining({
        ROOT: "true"
      })
    );
  });

  it("accepts a dir argument as a string", () => {
    const { extracted } = config({ dir: "tests" });

    expect(extracted).toEqual(
      expect.objectContaining({
        BASIC: "basic"
      })
    );
  });

  it("accepts a path argument as a string", () => {
    const { extracted } = config({ path: "tests/.env.base" });

    expect(extracted).toEqual(
      expect.objectContaining({
        BASE: "hello"
      })
    );
  });

  it("accepts a path argument as a string of files with commas", () => {
    const { extracted } = config({ path: "tests/.env.base,tests/.env.test" });

    expect(extracted).toEqual(
      expect.objectContaining({
        TESTING: "true"
      })
    );
  });

  it("accepts a path argument as an array", () => {
    const { extracted } = config({ path: ["tests/.env.path"] });

    expect(extracted).toEqual(
      expect.objectContaining({
        SNACKS: "true"
      })
    );
  });

  it("accepts an encoding argument", () => {
    const { extracted } = config({
      dir: "tests",
      path: ".env.utf8",
      encoding: "utf-8"
    });

    expect(extracted).toEqual(
      expect.objectContaining({
        UTF8: "true"
      })
    );
  });

  it("accepts a debug argument", () => {
    const spy = jest.spyOn(console, "log").mockImplementation();

    config({ path: "tests/.env.basic", debug: true });

    expect(spy.mock.calls[0][0]).toContain(
      `Extracted '${root}/tests/.env.basic' ENVs`
    );

    expect(spy.mock.calls[1][0]).toContain(
      `Assigned {"BASICENV":"basic"} to process.env`
    );

    const invalidPath = "tests/.env.invalid";
    config({ path: "tests/.env.invalid", debug: true });

    expect(spy.mock.calls[2][0]).toContain(
      `Unable to extract '${root}/${invalidPath}': ENOENT: no such file or directory`
    );

    spy.mockRestore();
  });

  it("allows non-existent files to silently fail", () => {
    const spy = jest.spyOn(console, "log").mockImplementation();

    config({ path: "tests/.env.invalid" });

    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  describe("Interpolation", () => {
    let extracted: ParsedENVs;
    beforeAll(() => {
      process.env.MACHINE = "node";
      extracted = config({ path: "tests/.env.interp" }).extracted;
    });

    it("interops .env keys", () => {
      expect(extracted).toEqual(
        expect.objectContaining({
          BASIC_EXPAND: "basic",
          BASIC_EMPTY: ""
        })
      );
    });

    it("interops and prioritizes process.env keys over .env keys", () => {
      expect(extracted).toEqual(
        expect.objectContaining({
          MACHINE_EXPAND: "node"
        })
      );
    });

    it("interops undefined keys", () => {
      expect(extracted).toEqual(
        expect.objectContaining({
          UNDEFINED_EXPAND: ""
        })
      );
    });

    it("interops mixed ENV with or without brackets values", () => {
      expect(extracted).toEqual(
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
      expect(extracted).toEqual(
        expect.objectContaining({
          ESCAPED_EXPAND: "$ESCAPED",
          ESCAPED_TITLE: "There are $nakes in my boot$"
        })
      );
    });
  });

  it("overwrites keys in other .envs but not ENVs already defined in process.env", () => {
    const AUTHOR = "Matt";
    process.env.AUTHOR = AUTHOR;

    const { extracted, parsed } = config({
      path: "tests/.env.write,tests/.env.overwrite"
    });

    expect(extracted).toEqual(
      expect.objectContaining({
        WRITE: "false"
      })
    );

    expect(parsed.AUTHOR).toEqual(AUTHOR);
  });
});

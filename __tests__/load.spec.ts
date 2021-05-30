import load from "../load/index";
import { logWarning } from "../log";

jest.mock("../log", () => ({
  __esModule: true,
  logMessage: jest.fn(),
  logWarning: jest.fn()
}));

describe("Load Method", () => {
  beforeEach(() => {
    (logWarning as jest.Mock).mockClear();
  });

  it("fails to load a config file from an invalid directory", async () => {
    load("dev", "invalid");

    expect(logWarning).toHaveBeenCalledWith(
      "Unable to locate an 'env.config.json' file in the specified directory!"
    );
  });

  it("fails to load a config file from an 'LOAD_ENV' environment", async () => {
    load("dev", "tests");

    expect(logWarning).toHaveBeenCalledWith(
      "Unable to locate a 'dev' configuration within 'env.config.json'!"
    );
  });

  it("loads a config file and returns an config arguments", async () => {
    const config = load("test");

    expect(config).toEqual({
      debug: true,
      dir: "tests",
      paths: ".env.base"
    });
  });
});

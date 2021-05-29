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
    await load("dev", "invalid");

    expect(logWarning).toHaveBeenCalledWith(
      "Unable to locate an 'env.config.(m)js' file in the specified directory!"
    );
  });

  it("fails to load a config file from an 'LOAD_ENV' environment", async () => {
    await load("dev", "tests");

    expect(logWarning).toHaveBeenCalledWith(
      "Unable to locate a 'dev' configuration within 'env.config.(m)js'!"
    );
  });

  it("loads a config file and returns an config arguments", async () => {
    const config = await load("test");

    expect(config).toEqual({
      debug: true,
      dir: "tests",
      paths: ".env.base"
    });
  });
});

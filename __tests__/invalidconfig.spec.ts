import { logWarning } from "../log";

jest.mock("../log", () => ({
  __esModule: true,
  logMessage: jest.fn(),
  logWarning: jest.fn()
}));

describe("Invalid Config", () => {
  it("displays a warning when an invalid config is loaded", () => {
    process.env.LOAD_CONFIG = "development";

    require("../index");

    expect(logWarning).toHaveBeenCalledWith(
      "Unable to locate a 'development' configuration within 'env.config.json'!"
    );
  });
});

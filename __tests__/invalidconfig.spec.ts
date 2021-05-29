import { logWarning } from "../log";
import waitFor from "../utils/waitFor";

jest.mock("../log", () => ({
  __esModule: true,
  logMessage: jest.fn(),
  logWarning: jest.fn()
}));

describe("Invalid Config", () => {
  it("displays a warning when an invalid config is loaded", async () => {
    process.env.LOAD_CONFIG = "development";

    import("../index");

    await waitFor(() => {
      expect(logWarning).toHaveBeenCalledWith(
        "Unable to locate a 'development' configuration within 'env.config.(m)js'!"
      );
    });
  });
});

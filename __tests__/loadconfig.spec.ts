import { logMessage } from "../log";
import waitFor from "../utils/waitFor";

jest.mock("../log", () => ({
  __esModule: true,
  logMessage: jest.fn(),
  logWarning: jest.fn()
}));

it("loads and parses an 'env.config.js' file and registers ENVs when the package is imported", async () => {
  expect(process.env.BASE).toBeUndefined();
  process.env.LOAD_CONFIG = "test";

  import("../index");

  await waitFor(() => {
    expect(logMessage).toHaveBeenCalledWith(`Loaded env from tests/.env.base`);

    expect(process.env.BASE).toEqual("hello");
  });
});
